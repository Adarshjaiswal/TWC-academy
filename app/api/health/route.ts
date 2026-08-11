import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "twc-membership-platform",
    time: new Date().toISOString()
  });
}
