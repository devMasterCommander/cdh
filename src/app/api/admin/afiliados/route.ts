import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los afiliados con métricas
export async function GET(request: NextRequest) {
  try {
    // Obtener usuarios que son afiliados o que tienen referidos
    const afiliados = await prisma.user.findMany({
      where: {
        OR: [
          { userType: "AFFILIATE" },
          { sponsored: { some: {} } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        referralSlug: true,
        createdAt: true,
        _count: {
          select: {
            sponsored: true,
            commissionsReceived: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular métricas de cada afiliado
    const afiliadosConMetricas = await Promise.all(
      afiliados.map(async (afiliado) => {
        // Total de comisiones
        const comisiones = await prisma.commission.aggregate({
          where: { affiliateId: afiliado.id },
          _sum: { amount: true },
          _count: true,
        });

        // Comisiones pendientes
        const pendientes = await prisma.commission.aggregate({
          where: {
            affiliateId: afiliado.id,
            status: "pending",
          },
          _sum: { amount: true },
          _count: true,
        });

        // Comisiones pagadas
        const pagadas = await prisma.commission.aggregate({
          where: {
            affiliateId: afiliado.id,
            status: "paid",
          },
          _sum: { amount: true },
        });

        return {
          ...afiliado,
          metricas: {
            totalComisiones: comisiones._sum.amount || 0,
            comisionesPendientes: pendientes._sum.amount || 0,
            comisionesPagadas: pagadas._sum.amount || 0,
            numeroComisiones: comisiones._count || 0,
            numeroPendientes: pendientes._count || 0,
          },
        };
      })
    );

    // Ordenar por total de comisiones (ranking)
    afiliadosConMetricas.sort(
      (a, b) => b.metricas.totalComisiones - a.metricas.totalComisiones
    );

    return NextResponse.json(afiliadosConMetricas);
  } catch (error) {
    console.error("Error al obtener afiliados:", error);
    return NextResponse.json(
      { error: "Error al obtener afiliados" },
      { status: 500 }
    );
  }
}

