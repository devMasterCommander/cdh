import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET - Obtener un curso por ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const curso = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!curso) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(curso);
  } catch (error) {
    console.error("Error al obtener curso:", error);
    return NextResponse.json(
      { error: "Error al obtener curso" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un curso
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price } = body;

    const curso = await prisma.course.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
      },
    });

    return NextResponse.json(curso);
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    return NextResponse.json(
      { error: "Error al actualizar curso" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un curso
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Verificar si el curso tiene compras
    const purchases = await prisma.purchase.count({
      where: { courseId: id },
    });

    if (purchases > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar el curso. Tiene ${purchases} compra(s) asociada(s).`,
        },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return NextResponse.json(
      { error: "Error al eliminar curso" },
      { status: 500 }
    );
  }
}

