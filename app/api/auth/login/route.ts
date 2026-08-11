import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import apiClient from "@/lib/axios-client";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const response = await apiClient.post("/internal/auth/login", {
      email,
      password,
    });

    console.log("Login Response:", response.data);

    const data = response.data;
    const token = data?.data.token ?? data?.accessToken ?? data?.access_token;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data.message ?? "Invalid email or password." },
        { status: response.status },
      );
    }

    await createSession(email, token);

    return NextResponse.json({
      message: data.message ?? "Signed in successfully.",
      user: { email },
    });
  } catch (error: unknown) {
    console.error("Error during login:", error);
    const status = (error as { response?: { status?: number } })?.response?.status ?? 502;
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;

    return NextResponse.json(
      { error: message ?? "Unable to reach the backend server on port 8080." },
      { status },
    );
  }
}
