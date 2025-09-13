// src/app/api/checkout_sessions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  /* inicio ejecución lógica */
  
  // --- REACTIVAMOS EL BLOQUE DE AUTENTICACIÓN ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  const course = {
    id: 'course_test_abc',
    name: 'Módulo 1: Introducción al Desarrollo Humano',
    priceInCents: 5000, // 50.00€
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.name,
            },
            unit_amount: course.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/curso?success=true`,
      cancel_url: `${request.nextUrl.origin}/curso?canceled=true`,
      client_reference_id: userId,
      metadata: {
        courseId: course.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (err: any) {
    console.error(`Error al crear la sesión de Stripe: ${err.message}`);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
  /* fin ejecución lógica */
}