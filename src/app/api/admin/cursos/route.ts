import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los cursos
export async function GET(request: NextRequest) {
  try {
    const cursos = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            modules: true,
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return NextResponse.json(
      { error: "Error al obtener cursos" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Nombre y precio son requeridos" },
        { status: 400 }
      );
    }

    const curso = await prisma.course.create({
      data: {
        name,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(curso, { status: 201 });
  } catch (error) {
    console.error("Error al crear curso:", error);
    return NextResponse.json(
      { error: "Error al crear curso" },
      { status: 500 }
    );
  }
}

