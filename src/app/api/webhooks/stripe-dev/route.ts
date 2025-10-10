// SOLO PARA DESARROLLO LOCAL - Webhook SIN verificación de firma
// Este endpoint simula el comportamiento del webhook real pero sin validar la firma de Stripe
// NUNCA usar en producción

import { NextRequest, NextResponse } from 'next/server';
import { calculateAndRecordCommissions } from '@/lib/server/commissions';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('🔧 [DEV WEBHOOK] Iniciado...');
  
  try {
    const body = await request.json();
    console.log('📦 [DEV WEBHOOK] Body recibido:', JSON.stringify(body, null, 2));
    
    if (body.type === 'checkout.session.completed') {
      const session = body.data.object;
      
      let userId = session.client_reference_id;
      const amountTotal = session.amount_total;
      const courseId = session.metadata?.courseId;
      const paymentIntentId = session.payment_intent;
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      console.log('💰 [DEV WEBHOOK] Datos:', {
        userId,
        customerEmail,
        courseId,
        amountTotal,
        paymentIntentId
      });
      
      // Leer cookie de referido
      const referralCookie = request.cookies.get('cdh-referral');
      const referralValue = referralCookie?.value;
      let sponsorId: string | null = null;
      
      if (referralValue) {
        console.log(`🔗 [DEV WEBHOOK] Cookie de referido: ${referralValue}`);
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
          console.log(`✅ [DEV WEBHOOK] Sponsor encontrado: ${sponsor.email}`);
        }
      }
      
      // Si no hay userId pero hay email, crear o buscar usuario
      if (!userId && customerEmail) {
        console.log(`👤 [DEV WEBHOOK] Buscando/creando usuario con email: ${customerEmail}`);
        
        let user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });
        
        if (!user) {
          console.log('➕ [DEV WEBHOOK] Creando nuevo usuario...');
          user = await prisma.user.create({
            data: {
              email: customerEmail,
              name: session.customer_details?.name || null,
              sponsorId: sponsorId,
            },
          });
          console.log(`✅ [DEV WEBHOOK] Usuario creado: ${user.id}`);
        } else {
          console.log(`✅ [DEV WEBHOOK] Usuario existente: ${user.id}`);
          // Si el usuario no tiene sponsor, asignar el nuevo
          if (!user.sponsorId && sponsorId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { sponsorId: sponsorId },
            });
            console.log(`🔗 [DEV WEBHOOK] Sponsor asignado a usuario existente`);
          }
        }
        
        userId = user.id;
      }
      
      if (!userId) {
        console.error('❌ [DEV WEBHOOK] No se pudo determinar userId');
        return NextResponse.json({ error: 'No userId' }, { status: 400 });
      }
      
      if (!courseId) {
        console.error('❌ [DEV WEBHOOK] No courseId en metadata');
        return NextResponse.json({ error: 'No courseId' }, { status: 400 });
      }
      
      // Registrar la compra
      console.log('💳 [DEV WEBHOOK] Creando registro de compra...');
      await prisma.purchase.create({
        data: {
          userId,
          courseId,
          stripePaymentIntentId: paymentIntentId,
        },
      });
      console.log('✅ [DEV WEBHOOK] Compra registrada');
      
      // Actualizar tipo de usuario a CUSTOMER si es GUEST
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { userType: true, email: true },
      });
      
      if (currentUser?.userType === 'GUEST') {
        await prisma.user.update({
          where: { id: userId },
          data: { userType: 'CUSTOMER' },
        });
        console.log(`✅ [DEV WEBHOOK] Usuario ${currentUser.email} actualizado a CUSTOMER`);
      }
      
      // Calcular comisiones
      if (amountTotal) {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { price: true },
        });
        
        if (course) {
          console.log('💰 [DEV WEBHOOK] Calculando comisiones...');
          await calculateAndRecordCommissions(userId, course.price, courseId);
          console.log('✅ [DEV WEBHOOK] Comisiones calculadas');
        }
      }
      
      console.log('🎉 [DEV WEBHOOK] Proceso completado exitosamente');
      return NextResponse.json({ received: true, message: 'DEV webhook processed' });
    }
    
    return NextResponse.json({ received: true, message: 'Event type not handled' });
    
  } catch (error: any) {
    console.error('❌ [DEV WEBHOOK] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

