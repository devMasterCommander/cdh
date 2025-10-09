import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todas las transacciones
export async function GET(request: NextRequest) {
  try {
    const transacciones = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transacciones);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return NextResponse.json(
      { error: "Error al obtener transacciones" },
      { status: 500 }
    );
  }
}

