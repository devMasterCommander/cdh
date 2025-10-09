import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Marcar comisiones como pagadas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commissionIds } = body; // Array de IDs de comisiones

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de IDs de comisiones" },
        { status: 400 }
      );
    }

    // Marcar todas las comisiones como pagadas
    const result = await prisma.commission.updateMany({
      where: {
        id: { in: commissionIds },
        status: "pending", // Solo las que estén pendientes
      },
      data: {
        status: "paid",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `${result.count} comisión(es) marcada(s) como pagada(s)`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error al marcar comisiones como pagadas:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago de comisiones" },
      { status: 500 }
    );
  }
}

