import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint para crear usuario demo (solo en desarrollo)
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en producción" },
      { status: 403 }
    );
  }

  try {
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@cdh.com" },
    });

    if (existingUser) {
      return NextResponse.json({
        message: "Usuario demo ya existe",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    // Crear usuario demo
    const demoUser = await prisma.user.create({
      data: {
        email: "demo@cdh.com",
        name: "Usuario Demo",
        emailVerified: new Date(),
        userType: "CUSTOMER",
        referralSlug: "usuario-demo",
      },
    });

    // Crear un token de verificación permanente para login fácil
    const demoToken = await prisma.verificationToken.create({
      data: {
        identifier: "demo@cdh.com",
        token: "demo1234", // Token fijo para demo
        expires: new Date("2099-12-31"), // Expira en el futuro lejano
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario demo creado exitosamente",
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      },
      instructions: {
        email: "demo@cdh.com",
        loginUrl: `/api/auth/signin?email=demo@cdh.com`,
        note: "Usa el link mágico generado o accede directamente con el token demo1234",
      },
    });
  } catch (error) {
    console.error("Error al crear usuario demo:", error);
    return NextResponse.json(
      { error: "Error al crear usuario demo" },
      { status: 500 }
    );
  }
}

