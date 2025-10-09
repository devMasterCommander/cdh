import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Actualizar lección
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, vimeoVideoId, order } = body;

    const leccion = await prisma.lesson.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(vimeoVideoId && { vimeoVideoId }),
        ...(order !== undefined && { order: parseInt(order) }),
      },
    });

    return NextResponse.json(leccion);
  } catch (error) {
    console.error("Error al actualizar lección:", error);
    return NextResponse.json(
      { error: "Error al actualizar lección" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar lección
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Lección eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar lección:", error);
    return NextResponse.json(
      { error: "Error al eliminar lección" },
      { status: 500 }
    );
  }
}

