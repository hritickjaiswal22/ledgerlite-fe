import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_AGE,
} from "@/app/api/auth/auth-handler";

const EXPRESS_URL = process.env.EXPRESS_API_URL;

export async function GET(request: NextRequest) {
  try {
    console.log("-------------------reefresh route----------------------");

    const refreshToken = request.cookies.get("refresh_token")?.value;

    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const serverRes = await fetch(`${EXPRESS_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!serverRes.ok) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const { data } = await serverRes.json();
    const response = NextResponse.redirect(new URL(redirectTo, request.url));

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
