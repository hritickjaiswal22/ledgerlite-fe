import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    // Extract query string directly from Next.js request URL
    const searchParams = request.nextUrl.searchParams;

    // Forward query params to your external Express API
    const res = await fetch(
      `${process.env.EXPRESS_API_URL}/transactions?${searchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      const data = await res.json();

      return NextResponse.json(data, { status: res.status });
    }

    const { data } = await res.json();

    const response = NextResponse.json({ success: true, data });

    return response;
  } catch (error) {
    console.error(` Error `, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
