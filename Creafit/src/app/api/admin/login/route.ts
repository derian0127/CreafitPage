import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { password } = await request.json();
  
  // Intentamos obtener la contraseña desde la BD (tabla admin_config)
  const { data } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'admin_password')
    .single();

  const correctPassword = data?.value || process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    
    // Seteamos la cookie de sesión (sin maxAge para que sea de sesión)
    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
