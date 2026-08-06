import { NextResponse } from "next/server";
import apiClient from "@/lib/axios-client";

export async function GET() {
  try {
    const response = await apiClient.get("/internal/transacti000ons");

    const data = response.data;

    return NextResponse.json({
      message: data.message ?? "Transactions fetched successfully.",
      transactions: data,
    });
  } catch (error: unknown) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 500;

    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;

    return NextResponse.json(
      {
        error:
          message ?? "Unable to reach the backend transaction service.",
      },
      {
        status,
      }
    );
  }
}