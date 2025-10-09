import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Actualizar referral slug
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { referralSlug } = body;

    if (!referralSlug) {
      return NextResponse.json(
        { error: "El slug de referido es requerido" },
        { status: 400 }
      );
    }

    // Validar formato del slug (solo letras, números y guiones)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(referralSlug)) {
      return NextResponse.json(
        { 
          error: "El slug solo puede contener letras minúsculas, números y guiones" 
        },
        { status: 400 }
      );
    }

    // Verificar que el slug no esté en uso por otro usuario
    const existingUser = await prisma.user.findFirst({
      where: {
        referralSlug: referralSlug,
        NOT: {
          id: id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este slug ya está en uso por otro usuario" },
        { status: 409 }
      );
    }

    // Actualizar el slug
    const usuario = await prisma.user.update({
      where: { id },
      data: { referralSlug },
    });

    return NextResponse.json({
      message: "Slug de referido actualizado correctamente",
      referralSlug: usuario.referralSlug,
    });
  } catch (error) {
    console.error("Error al actualizar referral slug:", error);
    return NextResponse.json(
      { error: "Error al actualizar el slug de referido" },
      { status: 500 }
    );
  }
}

