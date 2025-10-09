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
  
  // Verificar si hay sesión (opcional, permite compras sin login)
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const course = {
    id: 'course_test_abc',
    name: 'Módulo 1: Introducción al Desarrollo Humano',
    priceInCents: 5000, // 50.00€
  };

  try {
    // Configuración base del checkout
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
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
      metadata: {
        courseId: course.id,
      },
    };

    // Si el usuario está logueado, vincular su ID
    if (userId) {
      checkoutConfig.client_reference_id = userId;
    } else {
      // Si NO está logueado, requerir email en el checkout
      checkoutConfig.customer_email = undefined; // Stripe pedirá el email
      checkoutConfig.billing_address_collection = 'required';
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig);

    return NextResponse.json({ url: checkoutSession.url });

  } catch (err: any) {
    console.error(`Error al crear la sesión de Stripe: ${err.message}`);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
  /* fin ejecución lógica */
}