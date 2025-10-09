import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Cambiar estado de una comisión
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["PENDING", "IN_REVIEW", "APPROVED", "DECLINED", "PAID"];
    
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado de comisión inválido" },
        { status: 400 }
      );
    }

    const comision = await prisma.commission.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.json({
      message: "Estado de comisión actualizado correctamente",
      commission: comision,
    });
  } catch (error) {
    console.error("Error al cambiar estado de comisión:", error);
    return NextResponse.json(
      { error: "Error al cambiar estado de comisión" },
      { status: 500 }
    );
  }
}

