import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import apiClient from "@/lib/axios-client";

export async function GET(request: Request) {
  try {
    const response = await apiClient.get("/internal/users", {});

    const data = response.data;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data.message ?? "Unable to fetch users." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data.message ?? "Users fetched successfully.",
      users: { data },
    });
  } catch (error: unknown) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 502;
    const message = (error as { response?: { data?: { message?: string } } })
      ?.response?.data?.message;

    return NextResponse.json(
      { error: message ?? "Unable to reach the backend server on port 8080." },
      { status },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    body.role = "admin"; // Set the role to "admin" before sending the request
    console.log("Received body:", body);
    const response = await apiClient.post("/internal/users", body);

    const data = response.data;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data.message ?? "Unable to submit form" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data.message ?? "Submitted successfully.",
      users: { data },
    });
  } catch (error: unknown) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 502;
    const message = (error as { response?: { data?: { message?: string } } })
      ?.response?.data?.message;

    return NextResponse.json(
      { error: message ?? "Unable to reach the backend server on port 8080." },
      { status },
    );
  }
}
