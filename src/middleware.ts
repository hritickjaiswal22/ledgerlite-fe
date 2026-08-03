import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Checking via refreshToken token here because retries will be handled by client side axios interceptor so do not want to redirect on the basis of expired accessToken which happens frequently
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthRoute =
    request.nextUrl.pathname.includes("/signup") ||
    request.nextUrl.pathname.includes("/signin");

  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/accounts", request.url));
  }

  if (!refreshToken && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Explicitly list ONLY the paths where this middleware should run.
  matcher: [
    "/signup",
    "/signin",
    // Add all your protected routes here.
    // The "/:path*" suffix ensures all sub-routes (like /accounts/settings) are also protected.
    "/accounts/:path*",
    // "/dashboard/:path*",
    // "/profile/:path*"
    // Expand as add more routes
  ],
};
