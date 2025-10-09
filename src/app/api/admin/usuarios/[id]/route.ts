import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET - Obtener detalle completo de un usuario
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    
    console.log(`[API] Buscando usuario con ID: ${id}`);

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
            course: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        // Progreso en lecciones
        lessonProgress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
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
      console.error(`[API] Usuario con ID ${id} no encontrado`);
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log(`[API] Usuario encontrado: ${usuario.email}`);
    return NextResponse.json(usuario);
  } catch (error: any) {
    console.error("Error al obtener usuario:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: `Error al obtener usuario: ${error.message}` },
      { status: 500 }
    );
  }
}

