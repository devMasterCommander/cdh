// src/app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateAndRecordCommissions } from '@/lib/server/commissions';
import { prisma } from '@/lib/prisma';

// Configuración temporal para permitir deployment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: NextRequest) {
  console.log('--- Inició el procesamiento del Webhook ---');
  try {
    // Verificar si Stripe está configurado
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado. Configura STRIPE_SECRET_KEY en las variables de entorno.' },
        { status: 500 }
      );
    }
    
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

      let userId = session.client_reference_id;
      const amountTotal = session.amount_total;
      const courseId = session.metadata?.courseId;
      const paymentIntentId = session.payment_intent as string;
      const customerEmail = session.customer_email || session.customer_details?.email;

      // Leer cookie de referido (si existe)
      const referralCookie = request.cookies.get('cdh-referral');
      const referralValue = referralCookie?.value;
      let sponsorId: string | null = null;

      // Si hay cookie de referido, buscar el sponsor
      if (referralValue) {
        console.log(`4.0 Cookie de referido detectada: ${referralValue}`);
        
        // Buscar sponsor por referralSlug o por ID
        const sponsor = await prisma.user.findFirst({
          where: {
            OR: [
              { referralSlug: referralValue },
              { id: referralValue },
            ],
          },
        });

        if (sponsor) {
          sponsorId = sponsor.id;
          console.log(`✅ Sponsor encontrado: ${sponsor.name || sponsor.email} (ID: ${sponsorId})`);
        } else {
          console.log(`⚠️ No se encontró sponsor con slug/ID: ${referralValue}`);
        }
      }

      // Si NO hay userId (guest checkout), crear o encontrar usuario por email
      if (!userId && customerEmail) {
        console.log(`4.1 Guest checkout detectado. Email: ${customerEmail}`);
        
        // Buscar si ya existe un usuario con ese email
        let user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        // Si no existe, crear uno nuevo
        if (!user) {
          console.log(`4.2 Creando nuevo usuario para email: ${customerEmail}`);
          user = await prisma.user.create({
            data: {
              email: customerEmail,
              name: session.customer_details?.name || null,
              sponsorId: sponsorId, // ← Asignar patrocinador si existe
            },
          });
          console.log(`✅ Usuario creado con ID: ${user.id}`);
          if (sponsorId) {
            console.log(`✅ Usuario vinculado al sponsor: ${sponsorId}`);
          }
        } else {
          console.log(`✅ Usuario existente encontrado con ID: ${user.id}`);
          
          // Si el usuario existe pero NO tiene sponsor, asignarlo ahora
          if (!user.sponsorId && sponsorId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { sponsorId: sponsorId },
            });
            console.log(`✅ Sponsor asignado a usuario existente: ${sponsorId}`);
          }
        }

        userId = user.id;
      }

      if (userId && amountTotal && courseId && paymentIntentId) {
        
        /* inicio lógica de registro de compra */
        await prisma.purchase.create({
          data: {
            userId: userId,
            courseId: courseId,
            stripePaymentIntentId: paymentIntentId,
          },
        });
        console.log(`✅ Compra registrada para el usuario ${userId} del curso ${courseId}`);
        
        // Actualizar tipo de usuario a CUSTOMER si era GUEST
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { userType: true },
        });
        
        if (currentUser?.userType === 'GUEST') {
          await prisma.user.update({
            where: { id: userId },
            data: { userType: 'CUSTOMER' },
          });
          console.log(`✅ Usuario actualizado de GUEST a CUSTOMER`);
        }
        /* fin lógica de registro de compra */

        console.log(`5. Llamando a calculateAndRecordCommissions...`);
        await calculateAndRecordCommissions(userId, amountTotal / 100, courseId);
        console.log('6. calculateAndRecordCommissions completado con éxito.');

      } else {
        console.error('⚠️ Faltan datos en la sesión de Stripe para procesar la compra/comisiones.');
        console.error(`Datos recibidos: userId=${userId}, amountTotal=${amountTotal}, courseId=${courseId}, paymentIntentId=${paymentIntentId}`);
      }
    }

    console.log('7. Webhook procesado. Devolviendo respuesta 200.');
    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(`❌ ERROR INESPERADO EN EL WEBHOOK: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
  }
}