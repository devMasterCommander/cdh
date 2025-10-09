import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Procesar pago de comisiones (agrupa por afiliado)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commissionIds, paymentMethod, notes } = body;

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de IDs de comisiones" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "El método de pago es requerido" },
        { status: 400 }
      );
    }

    // Obtener las comisiones seleccionadas
    const comisiones = await prisma.commission.findMany({
      where: {
        id: { in: commissionIds },
        status: "APPROVED", // Solo las aprobadas se pueden pagar
      },
      select: {
        id: true,
        affiliateId: true,
        amount: true,
      },
    });

    if (comisiones.length === 0) {
      return NextResponse.json(
        { error: "No hay comisiones aprobadas para pagar en la selección" },
        { status: 400 }
      );
    }

    // Verificar que todas las comisiones sean del mismo afiliado
    const affiliateIds = [...new Set(comisiones.map((c) => c.affiliateId))];
    
    if (affiliateIds.length > 1) {
      return NextResponse.json(
        { 
          error: "Solo puedes pagar comisiones del mismo afiliado a la vez. Selecciona comisiones de un solo afiliado." 
        },
        { status: 400 }
      );
    }

    const affiliateId = affiliateIds[0];
    const totalAmount = comisiones.reduce((sum, c) => sum + c.amount, 0);

    // Crear registro de pago
    const payment = await prisma.payment.create({
      data: {
        affiliateId,
        method: paymentMethod,
        notes: notes || null,
        paymentDate: new Date(),
      },
    });

    // Actualizar comisiones: vincular al pago y marcar como PAID
    await prisma.commission.updateMany({
      where: {
        id: { in: comisiones.map((c) => c.id) },
      },
      data: {
        status: "PAID",
        paymentId: payment.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Pago registrado exitosamente. ${comisiones.length} comisión(es) pagada(s).`,
      payment: {
        id: payment.id,
        totalAmount,
        commissionsCount: comisiones.length,
      },
    });
  } catch (error: any) {
    console.error("Error al procesar pago de comisiones:", error);
    return NextResponse.json(
      { error: `Error al procesar el pago: ${error.message}` },
      { status: 500 }
    );
  }
}

