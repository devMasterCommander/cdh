import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar comisiones con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "pending", "paid", or null for all
    const affiliateId = searchParams.get("affiliateId");

    const where: Record<string, any> = {};

    if (status) {
      where.status = status;
    }

    if (affiliateId) {
      where.affiliateId = affiliateId;
    }

    const comisiones = await prisma.commission.findMany({
      where,
      include: {
        affiliate: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comisiones);
  } catch (error) {
    console.error("Error al obtener comisiones:", error);
    return NextResponse.json(
      { error: "Error al obtener comisiones" },
      { status: 500 }
    );
  }
}

