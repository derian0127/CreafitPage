import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  
  // Eliminamos la cookie de sesión
  response.cookies.set('admin_session', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
