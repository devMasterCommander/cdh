import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Cambiar tipo de usuario
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userType } = body;

    const validTypes = ["GUEST", "CUSTOMER", "AFFILIATE", "ADMIN"];
    
    if (!userType || !validTypes.includes(userType)) {
      return NextResponse.json(
        { error: "Tipo de usuario inválido" },
        { status: 400 }
      );
    }

    // Si se está aprobando como AFFILIATE, actualizar también el estado de solicitud
    const updateData: any = { userType };
    
    if (userType === "AFFILIATE") {
      updateData.affiliateRequestStatus = "APPROVED";
    }

    const usuario = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Tipo de usuario actualizado correctamente",
      userType: usuario.userType,
    });
  } catch (error) {
    console.error("Error al cambiar tipo de usuario:", error);
    return NextResponse.json(
      { error: "Error al cambiar tipo de usuario" },
      { status: 500 }
    );
  }
}

