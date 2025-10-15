import { NextRequest, NextResponse } from "next/server";

// Endpoint GET para autenticar directamente al usuario demo
export async function GET(request: NextRequest) {
  try {
    // Verificar si la base de datos está configurada
    const hasDatabase = !!process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Si no hay base de datos, redirigir a una página de información
      return NextResponse.redirect(new URL('/demo-info', request.url));
    }

    // Si hay base de datos, usar la lógica original
    const { prisma } = await import("@/lib/prisma");
    
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
    return NextResponse.redirect(new URL('/demo-info', request.url));
  }
}

