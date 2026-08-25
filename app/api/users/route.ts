import { NextResponse } from 'next/server';
import apiClient from '@/lib/axios-client';

export async function GET() {
  try {
    const response = await apiClient.get('/internal/users');
    const data = response.data;
    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data?.message ?? 'Unable to fetch users.' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      success: data?.success ?? true,
      message: data?.message ?? 'Users fetched successfully.',
      users: data?.data?.users ?? [],
      pagination: data?.data?.pagination ?? null,
    });
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status ?? 502;
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;

    return NextResponse.json(
      { error: message ?? 'Unable to reach the backend server.' },
      { status }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    body.role = "admin";
    const response = await apiClient.post('/internal/users', body);

    const data = response.data;

    if (!response.status || response.status >= 400) {
      return NextResponse.json(
        { error: data?.message ?? 'Unable to create user.' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: data?.success ?? true,
        message: data?.message ?? 'User created successfully.',
        data: data?.data ?? data,
      },
      { status: response.status }
    );
  } catch (error: unknown) {
    const status =
      (
        error as {
          response?: {
            status?: number;
          };
        }
      )?.response?.status ?? 502;

    const message = (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;

    return NextResponse.json(
      { error: message ?? 'Unable to reach the backend server.' },
      { status }
    );
  }
}
