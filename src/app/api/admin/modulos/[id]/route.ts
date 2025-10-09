import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Actualizar módulo
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, order } = body;

    const modulo = await prisma.module.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(order !== undefined && { order: parseInt(order) }),
      },
    });

    return NextResponse.json(modulo);
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    return NextResponse.json(
      { error: "Error al actualizar módulo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar módulo
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.module.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Módulo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar módulo:", error);
    return NextResponse.json(
      { error: "Error al eliminar módulo" },
      { status: 500 }
    );
  }
}

