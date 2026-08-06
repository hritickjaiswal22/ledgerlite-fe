import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.EXPRESS_API_URL}/currencies`);

  const { data = [] } = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json({ success: true, data });

  return response;
}
