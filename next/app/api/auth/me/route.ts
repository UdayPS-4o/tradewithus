import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const responseObj = NextResponse.json(
        { message: 'Authentication failed' },
        { status: 401 }
      );
      
      responseObj.cookies.delete('token');
      return responseObj;
    }

    const data = await response.json();
    
    if (data && data.success && data.data && data.data.user) {
      return NextResponse.json(
        { user: data.data.user },
        { status: 200 }
      );
    } else if (data && data.user) {
      return NextResponse.json(
        { user: data.user },
        { status: 200 }
      );
    } else {
      console.error('Unexpected response format:', data);
      return NextResponse.json(
        { message: 'Invalid response from server' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 