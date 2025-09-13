// src/app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateAndRecordCommissions } from '@/lib/server/commissions';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  console.log('--- Inició el procesamiento del Webhook ---');
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET no está configurada.');
    }
    console.log('1. Secreto del Webhook cargado.');

    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    console.log('2. Cuerpo de la petición y firma leídos.');

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`3. Evento verificado con éxito: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      console.log('4. Procesando checkout.session.completed...');
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      const amountTotal = session.amount_total;
      const courseId = session.metadata?.courseId;
      const paymentIntentId = session.payment_intent as string;

      if (userId && amountTotal && courseId && paymentIntentId) {
        
        /* inicio lógica de registro de compra */
        await (prisma as any).purchase.create({
          data: {
            userId: userId,
            courseId: courseId,
            stripePaymentIntentId: paymentIntentId,
          },
        });
        console.log(`✅ Compra registrada para el usuario ${userId} del curso ${courseId}`);
        /* fin lógica de registro de compra */

        console.log(`5. Llamando a calculateAndRecordCommissions...`);
        await calculateAndRecordCommissions(userId, amountTotal / 100, courseId);
        console.log('6. calculateAndRecordCommissions completado con éxito.');

      } else {
        console.error('⚠️ Faltan datos en la sesión de Stripe para procesar la compra/comisiones.');
      }
    }

    console.log('7. Webhook procesado. Devolviendo respuesta 200.');
    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(`❌ ERROR INESPERADO EN EL WEBHOOK: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
  }
}