import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { randomUUID } from "crypto";

// Endpoint para login demo directo creando sesión
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Solo permitir en desarrollo
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Esta funcionalidad solo está disponible en desarrollo" },
        { status: 403 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado en la base de datos" },
        { status: 404 }
      );
    }

    // Eliminar sesiones anteriores del usuario
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // Crear nueva sesión directamente
    const sessionToken = randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // Expira en 30 días

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      message: "Sesión creada correctamente",
    });
  } catch (error) {
    console.error("Error en login de prueba:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión: " + (error instanceof Error ? error.message : "Unknown") },
      { status: 500 }
    );
  }
}

// GET para verificar estado
export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    authenticated: !!session,
    user: session?.user || null,
  });
}

