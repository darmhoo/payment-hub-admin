import { NextResponse } from 'next/server';
import apiClient from '@/lib/axios-client';

export async function GET() {
  try {
    const response = await apiClient.get('/admin/loan-products');

    const data = response.data;

    return NextResponse.json({
      message: data.message ?? 'Transactions fetched successfully.',
      transactions: data,
    });
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status ?? 500;

    const message = (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;

    return NextResponse.json(
      {
        error: message ?? 'Unable to reach the backend transaction service.',
      },
      {
        status,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await apiClient.post('/admin/loan-products', body);

    return NextResponse.json(
      {
        message: response.data?.message ?? 'Loan product created successfully',
        data: response.data,
      },
      {
        status: response.status,
      }
    );
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    const status = axiosError.response?.status ?? 502;

    return NextResponse.json(
      {
        error:
          axiosError.response?.data?.message ??
          axiosError.response?.data?.error ??
          axiosError.message ??
          'Unable to create loan product',
      },
      { status }
    );
  }
}
