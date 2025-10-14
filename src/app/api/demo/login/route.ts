import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint para generar link de login demo
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Verificar contraseña demo
    if (password !== "demo1234") {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Buscar o crear usuario demo
    let demoUser = await prisma.user.findUnique({
      where: { email: "demo@cdh.com" },
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: "demo@cdh.com",
          name: "Usuario Demo",
          emailVerified: new Date(),
          userType: "CUSTOMER",
          referralSlug: "usuario-demo",
        },
      });
    }

    // Generar token de verificación
    const token = `demo-token-${Date.now()}`;
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5); // Expira en 5 minutos

    // Eliminar tokens anteriores del usuario demo
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: "demo@cdh.com",
      },
    });

    // Crear nuevo token
    await prisma.verificationToken.create({
      data: {
        identifier: "demo@cdh.com",
        token,
        expires,
      },
    });

    // Generar URL de callback
    const callbackUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/mi-cuenta`;
    const signInUrl = `/api/auth/callback/email?token=${token}&email=demo@cdh.com&callbackUrl=${encodeURIComponent(callbackUrl)}`;

    return NextResponse.json({
      success: true,
      redirectUrl: signInUrl,
    });
  } catch (error) {
    console.error("Error en login demo:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}

