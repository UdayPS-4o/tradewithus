import { NextRequest, NextResponse } from 'next/server';

// Define the protected routes
const protectedRoutes = ['/', '/index'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect /profile/{something} to /{something}
  if (pathname.startsWith('/profile/')) {
    const profileId = pathname.replace('/profile/', '');
    return NextResponse.redirect(new URL(`/${profileId}`, request.url));
  }
  
  // Check if the path is in the protected routes
  if (protectedRoutes.includes(pathname)) {
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;
    
    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Continue with the request if authenticated or not a protected route
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}; 