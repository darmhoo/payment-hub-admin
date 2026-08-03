import { NextResponse } from "next/server";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getCurrentUser();

  return NextResponse.json({ user: user ? { email: user } : null });
}
