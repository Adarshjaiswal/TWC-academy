import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (env.TELEGRAM_WEBHOOK_SECRET && secret !== env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid Telegram webhook secret." }, { status: 401 });
  }

  const update = await request.json().catch(() => null);
  console.info("[telegram:webhook]", {
    updateId: update?.update_id,
    messageType: update?.message ? "message" : update?.chat_join_request ? "join_request" : "unknown"
  });

  return NextResponse.json({ ok: true });
}
