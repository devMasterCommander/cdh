import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 1. Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        affiliateRequestStatus: true,
        referralSlug: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // 2. Validar que no sea ya afiliado
    if (user.userType === "AFFILIATE") {
      return NextResponse.json(
        { error: "Ya eres afiliado" },
        { status: 400 }
      );
    }

    // 3. Validar que no tenga solicitud pendiente
    if (user.affiliateRequestStatus === "PENDING") {
      return NextResponse.json(
        { error: "Ya tienes una solicitud pendiente" },
        { status: 400 }
      );
    }

    // 4. Validar que tenga al menos 1 compra (requisito opcional)
    if (user._count.purchases < 1) {
      return NextResponse.json(
        { error: "Debes tener al menos una compra para ser afiliado" },
        { status: 400 }
      );
    }

    // 5. Generar slug de referido si no tiene uno
    let referralSlug = user.referralSlug;
    
    if (!referralSlug) {
      // Generar slug basado en el nombre o email
      const baseName = user.name || user.email?.split("@")[0] || "usuario";
      const slugBase = baseName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z0-9]+/g, "-") // Reemplazar caracteres especiales por guiones
        .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio/final

      // Verificar si el slug ya existe y añadir número si es necesario
      let finalSlug = slugBase;
      let counter = 1;
      
      while (true) {
        const existingUser = await prisma.user.findUnique({
          where: { referralSlug: finalSlug },
        });
        
        if (!existingUser) {
          break;
        }
        
        finalSlug = `${slugBase}-${counter}`;
        counter++;
      }
      
      referralSlug = finalSlug;
    }

    // 6. Actualizar estado de solicitud y slug
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        affiliateRequestStatus: "PENDING",
        referralSlug: referralSlug,
      },
      select: {
        id: true,
        name: true,
        email: true,
        affiliateRequestStatus: true,
        referralSlug: true,
      },
    });

    // TODO: Aquí se podría enviar una notificación al admin
    // await sendNotificationToAdmin({
    //   type: "AFFILIATE_REQUEST",
    //   userId: user.id,
    //   userName: user.name,
    //   userEmail: user.email,
    // });

    console.log(`[Solicitud de Afiliado] Usuario ${user.email} solicitó ser afiliado`);

    return NextResponse.json({
      success: true,
      message: "Solicitud enviada correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al procesar solicitud de afiliado:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

