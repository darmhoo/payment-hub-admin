import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import apiClient from "@/lib/axios-client";

export async function GET(request: Request) {
  try {
    const response = await apiClient.get("/providers", {});

    const data = response.data;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data.message ?? "Unable to fetch providers." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data.message ?? "Providers fetched successfully.",
      providers: { data },
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
