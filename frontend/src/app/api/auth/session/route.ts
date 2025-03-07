import { NextResponse } from "next/server";
import { SessionData } from "@/auth";

export async function GET(req: Request) {
  const session = await SessionData();

  if (!session || session.user.role !== "superadmin") {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  return NextResponse.json(session);
}
