import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    const response = await fetch(getApiUrl("/auth/forgot-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ error: data.message ?? "Unable to reset your password." }, { status: response.status });
    }

    return NextResponse.json({
      message: data.message ?? "Reset instructions were sent.",
    });
  } catch {
    return NextResponse.json({ error: "Unable to reach the backend server on port 8080." }, { status: 502 });
  }
}
