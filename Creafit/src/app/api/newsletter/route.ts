import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // 1. Guardar en Supabase (Newsletter)
    const { error: dbError } = await supabase
      .from('newsletter')
      .insert([{ email }]);

    if (dbError) {
      // Si ya existe (unique constraint), seguimos para reenviar el correo o dar aviso
      if (dbError.code === '23505') {
        return NextResponse.json({ error: 'Ya estás suscrito con este correo' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Error en base de datos' }, { status: 500 });
    }

    // 2. Enviar email de bienvenida con Resend
    // Nota: Si no tienes dominio verificado, solo puedes enviar a tu propio email de cuenta Resend.
    const { data, error: mailError } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Durante pruebas, este debe ser el remitente exacto
      to: [email],
      subject: '¡Bienvenido al Arsenal de CREAFIT! ⚡',
      html: `
        <div style="font-family: sans-serif; background: #0a0a08; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #1a1a18;">
          <h1 style="color: #e3aa2b; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">¡Bienvenido al Clan, Atleta!</h1>
          <p style="color: #a1a1a1; line-height: 1.6; font-size: 16px;">
            Gracias por suscribirte a CREAFIT. Estás un paso más cerca de optimizar tu rendimiento con ciencia y suplementación de verdad.
          </p>
          <div style="background: #1a1a18; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px dashed #e3aa2b;">
            <p style="margin: 0; color: #e3aa2b; font-weight: bold; font-size: 14px; text-transform: uppercase;">Tu regalo de bienvenida:</p>
            <p style="margin: 10px 0 0 0; font-size: 28px; color: #ffffff; font-weight: 800;">CREAFIT10</p>
            <p style="margin: 5px 0 0 0; color: #a1a1a1; font-size: 12px;">Usa este código en tu próxima compra por WhatsApp para un 10% de descuento.</p>
          </div>
          <p style="color: #a1a1a1; font-size: 14px;">
            Pronto recibirás artículos sobre nutrición, entrenamiento y ofertas exclusivas antes que nadie.
          </p>
          <hr style="border: 0; border-top: 1px solid #1a1a18; margin: 30px 0;">
          <p style="font-size: 12px; color: #555555; text-align: center;">
            © 2025 CREAFIT - Suplementos de alto rendimiento.
          </p>
        </div>
      `,
    });

    if (mailError) {
      console.error('Resend Error:', mailError);
      // No devolvemos error 500 aquí para que el usuario sepa que al menos se guardó su suscripción
      return NextResponse.json({ success: true, warning: 'Suscrito, pero hubo un problema enviando el correo' });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Newsletter Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
