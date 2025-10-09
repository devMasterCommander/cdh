import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET - Obtener detalle de una transacción
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const transaccion = await prisma.purchase.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
            image: true,
            sponsorId: true,
            sponsor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!transaccion) {
      return NextResponse.json(
        { error: "Transacción no encontrada" },
        { status: 404 }
      );
    }

    // Obtener comisiones generadas por esta compra
    const comisiones = await prisma.commission.findMany({
      where: {
        buyerId: transaccion.userId,
        courseId: transaccion.courseId,
      },
      include: {
        affiliate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...transaccion,
      comisiones,
    });
  } catch (error) {
    console.error("Error al obtener transacción:", error);
    return NextResponse.json(
      { error: "Error al obtener transacción" },
      { status: 500 }
    );
  }
}

