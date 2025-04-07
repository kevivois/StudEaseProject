// middleware.ts
import { handleCors } from '@/lib/middleware';  // Import handleCors function
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = handleCors(request); // Call handleCors to add the CORS headers
  return response;
}


export const config = {
  matcher: '/api/:path*',
}