// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFERRAL_COOKIE_NAME = 'cdh-referral';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // NUEVA LÓGICA: Solo actuar si la ruta empieza con /ref/
  if (pathname.startsWith('/ref/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // El slug del afiliado es el segundo segmento (ej: /ref/juan-perez)
    if (pathSegments.length === 2) {
      const referrerSlug = pathSegments[1];
      const response = NextResponse.next();

      response.cookies.set(REFERRAL_COOKIE_NAME, referrerSlug, {
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: '/',
      });

      console.log(`[Middleware] Afiliado capturado: ${referrerSlug}`);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};