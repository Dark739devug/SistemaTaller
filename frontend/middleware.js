import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/appointments', '/vehicles', '/services'];

  // Si intenta acceder a una ruta protegida sin token
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      console.log("Token no encontrado, redirigiendo a login...");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si ya está autenticado y trata de acceder a login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    console.log("Ya autenticado, redirigiendo al dashboard...");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
