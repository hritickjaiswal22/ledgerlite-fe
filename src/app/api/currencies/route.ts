import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.EXPRESS_API_URL}/currencies`);

    const { data = [] } = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

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
