import { getHeaders } from './lib/middleware-helper';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.json({},{headers:getHeaders(),status:200})
  }else{
    let res = NextResponse.next()
    getHeaders().forEach((value,key) => {
      res.headers.append(key,value)
    })
    return res
  }
}
export const config = {
  matcher: '/api/:path*',
}