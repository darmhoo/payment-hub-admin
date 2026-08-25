import { NextResponse } from 'next/server';
import apiClient from '@/lib/axios-client';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    const data = response.data;

    if (response.status >= 400) {
      return NextResponse.json(
        { error: data.message ?? 'Unable to reset your password.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: data.message ?? 'Reset instructions were sent.',
    });
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status ?? 502;
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;

    return NextResponse.json(
      { error: message ?? 'Unable to reach the backend server on port 8080.' },
      { status }
    );
  }
}
