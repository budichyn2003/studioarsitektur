import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Mengecek apakah pengunjung bawa "kartu akses"
  const authCookie = request.cookies.get('admin_token')?.value;
  const isAuthenticated = authCookie === process.env.ADMIN_TOKEN;

  // Jika mencoba masuk ke URL /admin/... tapi belum login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Tendang kembali ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login, tapi iseng buka halaman /login
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    // Langsung arahkan ke dashboard admin
    return NextResponse.redirect(new URL('/admin/projects', request.url));
  }

  return NextResponse.next();
}

// Menentukan halaman mana saja yang dijaga oleh satpam ini
export const config = {
  matcher: ['/admin/:path*', '/login'],
};