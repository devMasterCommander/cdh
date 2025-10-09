import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Crear nueva lección
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, moduleId, vimeoVideoId, order } = body;

    if (!name || !moduleId || !vimeoVideoId) {
      return NextResponse.json(
        { error: "Nombre, moduleId y vimeoVideoId son requeridos" },
        { status: 400 }
      );
    }

    // Si no se proporciona orden, calcularlo automáticamente
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: "desc" },
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    const leccion = await prisma.lesson.create({
      data: {
        name,
        moduleId,
        vimeoVideoId,
        order: lessonOrder,
      },
    });

    return NextResponse.json(leccion, { status: 201 });
  } catch (error) {
    console.error("Error al crear lección:", error);
    return NextResponse.json(
      { error: "Error al crear lección" },
      { status: 500 }
    );
  }
}

