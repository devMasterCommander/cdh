import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Crear nuevo módulo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, courseId, order } = body;

    if (!name || !courseId) {
      return NextResponse.json(
        { error: "Nombre y courseId son requeridos" },
        { status: 400 }
      );
    }

    // Si no se proporciona orden, calcularlo automáticamente
    let moduleOrder = order;
    if (!moduleOrder) {
      const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: "desc" },
      });
      moduleOrder = lastModule ? lastModule.order + 1 : 1;
    }

    const modulo = await prisma.module.create({
      data: {
        name,
        courseId,
        order: moduleOrder,
      },
    });

    return NextResponse.json(modulo, { status: 201 });
  } catch (error) {
    console.error("Error al crear módulo:", error);
    return NextResponse.json(
      { error: "Error al crear módulo" },
      { status: 500 }
    );
  }
}

