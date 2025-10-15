// SOLO DESARROLLO - Procesa la última sesión de checkout completada
// Endpoint para llamar manualmente cuando stripe listen no funciona

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateAndRecordCommissions } from '@/lib/server/commissions';
import { prisma } from '@/lib/prisma';

// Configuración temporal para permitir deployment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function GET(request: NextRequest) {
  try {
    // Verificar si Stripe está configurado
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado. Configura STRIPE_SECRET_KEY en las variables de entorno.' },
        { status: 500 }
      );
    }
    
    console.log('🔧 [DEV] Buscando últimas sesiones de checkout...');
    
    // Obtener las últimas sesiones de checkout
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ['data.customer'],
    });
    
    // Buscar la más reciente que esté completada
    const completedSession = sessions.data.find(
      s => s.status === 'complete' && s.payment_status === 'paid'
    );
    
    if (!completedSession) {
      return NextResponse.json(
        { error: 'No se encontró ninguna sesión completada reciente' },
        { status: 404 }
      );
    }
    
    console.log('✅ [DEV] Sesión encontrada:', completedSession.id);
    
    // Verificar si ya se procesó esta compra
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        stripePaymentIntentId: completedSession.payment_intent as string,
      },
    });
    
    if (existingPurchase) {
      return NextResponse.json({
        message: 'Esta compra ya fue procesada anteriormente',
        purchase: existingPurchase,
      });
    }
    
    // Procesar la compra
    let userId = completedSession.client_reference_id;
    const customerEmail = completedSession.customer_email || completedSession.customer_details?.email;
    const courseId = completedSession.metadata?.courseId;
    const paymentIntentId = completedSession.payment_intent as string;
    
    console.log('📦 [DEV] Datos:', {
      userId,
      customerEmail,
      courseId,
      paymentIntentId,
    });
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'No se encontró courseId en los metadata' },
        { status: 400 }
      );
    }
    
    // Crear o buscar usuario
    if (!userId && customerEmail) {
      let user = await prisma.user.findUnique({
        where: { email: customerEmail },
      });
      
      if (!user) {
        console.log('➕ [DEV] Creando nuevo usuario...');
        user = await prisma.user.create({
          data: {
            email: customerEmail,
            name: completedSession.customer_details?.name || null,
          },
        });
        console.log(`✅ [DEV] Usuario creado: ${user.id}`);
      } else {
        console.log(`✅ [DEV] Usuario existente: ${user.id}`);
      }
      
      userId = user.id;
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo determinar el userId' },
        { status: 400 }
      );
    }
    
    // Crear la compra
    console.log('💳 [DEV] Creando registro de compra...');
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        courseId,
        stripePaymentIntentId: paymentIntentId,
      },
    });
    console.log('✅ [DEV] Compra registrada');
    
    // Actualizar tipo de usuario
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { userType: true, email: true },
    });
    
    if (currentUser?.userType === 'GUEST') {
      await prisma.user.update({
        where: { id: userId },
        data: { userType: 'CUSTOMER' },
      });
      console.log(`✅ [DEV] Usuario ${currentUser.email} actualizado a CUSTOMER`);
    }
    
    // Calcular comisiones
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { price: true },
    });
    
    if (course) {
      console.log('💰 [DEV] Calculando comisiones...');
      await calculateAndRecordCommissions(userId, course.price, courseId);
      console.log('✅ [DEV] Comisiones calculadas');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Compra procesada exitosamente',
      purchase,
      user: currentUser,
    });
    
  } catch (error: any) {
    console.error('❌ [DEV] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

