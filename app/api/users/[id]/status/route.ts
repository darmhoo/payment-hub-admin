import { NextResponse } from 'next/server';
import apiClient from '@/lib/axios-client';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await apiClient.patch(`/internal/users/${id}/status`, body);

    const data = response.data;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        {
          error: data?.message ?? 'Unable to update user status.',
        },
        {
          status: response.status || 500,
        }
      );
    }

    return NextResponse.json({
      message: data?.message ?? 'User status updated successfully.',
      status: data,
    });
  } catch (error: unknown) {
    const status =
      (
        error as {
          response?: {
            status?: number;
          };
        }
      )?.response?.status ?? 502;

    const message = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    )?.response?.data?.message;

    return NextResponse.json(
      {
        error: message ?? 'Unable to reach the backend server.',
      },
      { status }
    );
  }
}
