import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET - Obtener detalle completo de un usuario
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const usuario = await prisma.user.findUnique({
      where: { id },
      include: {
        // Sponsor (afiliado que lo refirió)
        sponsor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Usuarios que refirió (sus afiliados)
        sponsored: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        // Compras realizadas
        purchases: {
          include: {
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
        },
        // Progreso en lecciones
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                name: true,
                module: {
                  select: {
                    course: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        // Comisiones recibidas (como afiliado)
        commissionsReceived: {
          include: {
            buyer: {
              select: {
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            purchases: true,
            lessonProgress: true,
            sponsored: true,
            commissionsReceived: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

