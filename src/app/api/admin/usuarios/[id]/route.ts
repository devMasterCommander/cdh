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
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        referralSlug: true,
        createdAt: true,
        updatedAt: true,
        sponsorId: true,
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
          select: {
            id: true,
            createdAt: true,
            stripePaymentIntentId: true,
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
          select: {
            id: true,
            isCompleted: true,
            lastTimestamp: true,
            updatedAt: true,
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
          select: {
            id: true,
            amount: true,
            level: true,
            status: true,
            createdAt: true,
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

