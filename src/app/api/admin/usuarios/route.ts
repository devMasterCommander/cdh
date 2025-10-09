import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const usuarios = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            purchases: true,
            lessonProgress: true,
            sponsored: true,
          },
        },
        sponsor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

