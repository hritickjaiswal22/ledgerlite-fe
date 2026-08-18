import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_AGE,
} from "@/app/api/auth/auth-handler";

// Add a 1-minute (60 seconds) buffer
const bufferSeconds = 60;
// 1. Define your routes outside the middleware function
const PUBLIC_PAGES = ["/signin", "/signup"];
const AUTH_API_PREFIX = "/api/auth";
const EXPRESS_URL = process.env.EXPRESS_API_URL;

export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    // 1. Split the token and get the payload (the middle part)
    const payloadBase64 = token.split(".")[1];

    // 2. Fix Base64Url formatting
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");

    // 3. Decode the base64 string (atob works in Edge, Node, and Browser)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    // 4. Parse the JSON
    const decoded = JSON.parse(jsonPayload);

    // 5. Compare expiration with current time
    // 'exp' is in seconds, Date.now() is in milliseconds
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const isExpiringSoon = decoded.exp < currentTimeInSeconds + bufferSeconds;

    return isExpiringSoon;
  } catch (error) {
    // If anything fails (malformed token), treat it as expired
    return true;
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/signin", request.url));

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    // Extract the pathname from nextUrl
    const { pathname } = request.nextUrl;

    // 2. Check for exact page matches
    const isAuthPage = PUBLIC_PAGES.includes(pathname);

    // 3. Check for API prefixes (covers /api/auth/signin, /api/auth/refresh, etc.)
    const isAuthApi = pathname.startsWith(AUTH_API_PREFIX);

    // 4. Combine the logic
    const isPublicRoute = isAuthPage || isAuthApi;

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (!refreshToken) {
      return redirectToLogin(request);
    }

    if (accessToken) {
      const isExpired = isTokenExpired(accessToken);

      if (!isExpired) {
        return NextResponse.next();
      }
    }

    // refresh logic
    const serverRes = await fetch(`${EXPRESS_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!serverRes.ok) {
      return redirectToLogin(request);
    }

    const { data } = await serverRes.json();

    request.cookies.set("access_token", data.accessToken);
    request.cookies.set("refresh_token", data.refreshToken);

    const response = NextResponse.next({
      request: {
        headers: request.headers, // Passes modified request.cookies to downstream components
      },
    });

    response.cookies.set("access_token", data.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_AGE,
    });

    response.cookies.set("refresh_token", data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_AGE,
    });

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    return redirectToLogin(request);
  }
}

export const config = {
  // Explicitly list ONLY the paths where this middleware should run.
  matcher: [
    "/",
    "/signup",
    "/signin",
    "/accounts",
    "/transactions",
    // Add all your protected routes here.
    // The "/:path*" suffix ensures all sub-routes (like /accounts/settings) are also protected.
    "/accounts/:path*",
    // "/dashboard/:path*",
    // "/profile/:path*"
    // Expand as add more routes
  ],
};
