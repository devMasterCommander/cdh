import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint GET para autenticar directamente al usuario demo
export async function GET(request: NextRequest) {
  try {
    // 1. Buscar o crear usuario demo
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

    // 2. Eliminar sesiones anteriores
    await prisma.session.deleteMany({
      where: { userId: demoUser.id },
    });

    // 3. Crear nueva sesión
    const sessionToken = `demo-session-${Date.now()}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 días

    await prisma.session.create({
      data: {
        sessionToken,
        userId: demoUser.id,
        expires,
      },
    });

    // 4. Crear respuesta con cookie
    const response = NextResponse.redirect(new URL('/mi-cuenta', request.url));
    
    response.cookies.set({
      name: "next-auth.session-token",
      value: sessionToken,
      expires,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error en demo auth:", error);
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
}

