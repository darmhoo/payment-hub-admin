import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getApiUrl } from "@/lib/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const response = await fetch(getApiUrl("/internal/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ error: data.message ?? "Invalid email or password." }, { status: response.status });
    }

    await createSession(email);

    return NextResponse.json({
      message: data.message ?? "Signed in successfully.",
      user: { email },
    });
  } catch {
    return NextResponse.json({ error: "Unable to reach the backend server on port 8080." }, { status: 502 });
  }
}
