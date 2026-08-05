import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE_AGE = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_COOKIE_AGE = 60 * 60 * 24 * 7; // 7 days
export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function handleAuthRequest(request: Request, targetURL: string) {
  try {
    const body = await request.json();

    const res = await fetch(targetURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", data.data.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_AGE,
    });

    response.cookies.set("refresh_token", data.data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_AGE,
    });

    return response;
  } catch (error) {
    console.error(`Auth Error [${targetURL}]:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
