import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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
            sponsored: true,
            commissionsReceived: true,
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

    // 2. Verificar si es afiliado
    const isAffiliate = user.userType === "AFFILIATE";

    // 3. Obtener comisiones por estado
    const commissionsPending = await prisma.commission.aggregate({
      where: {
        affiliateId: userId,
        status: "PENDING",
      },
      _sum: { amount: true },
      _count: true,
    });

    const commissionsInReview = await prisma.commission.aggregate({
      where: {
        affiliateId: userId,
        status: "IN_REVIEW",
      },
      _sum: { amount: true },
      _count: true,
    });

    const commissionsApproved = await prisma.commission.aggregate({
      where: {
        affiliateId: userId,
        status: "APPROVED",
      },
      _sum: { amount: true },
      _count: true,
    });

    const commissionsPaid = await prisma.commission.aggregate({
      where: {
        affiliateId: userId,
        status: "PAID",
      },
      _sum: { amount: true },
      _count: true,
    });

    const commissionsDeclined = await prisma.commission.aggregate({
      where: {
        affiliateId: userId,
        status: "DECLINED",
      },
      _sum: { amount: true },
      _count: true,
    });

    // 4. Obtener referidos directos con sus compras
    const directReferrals = await prisma.user.findMany({
      where: { sponsorId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userType: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5. Obtener historial de comisiones recientes
    const recentCommissions = await prisma.commission.findMany({
      where: { affiliateId: userId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // 6. Calcular total de comisiones generadas
    const totalCommissions = 
      (commissionsPending._sum.amount || 0) +
      (commissionsInReview._sum.amount || 0) +
      (commissionsApproved._sum.amount || 0) +
      (commissionsPaid._sum.amount || 0) +
      (commissionsDeclined._sum.amount || 0);

    // 7. Generar URL de referido
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const referralUrl = user.referralSlug 
      ? `${baseUrl}/ref/${user.referralSlug}`
      : null;

    // 8. Preparar respuesta
    const stats = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isAffiliate,
        affiliateRequestStatus: user.affiliateRequestStatus,
        referralSlug: user.referralSlug,
        referralUrl,
      },
      overview: {
        totalReferrals: user._count.sponsored,
        totalCommissionsGenerated: totalCommissions,
        totalCommissionsCount: user._count.commissionsReceived,
      },
      commissions: {
        pending: {
          amount: commissionsPending._sum.amount || 0,
          count: commissionsPending._count || 0,
        },
        inReview: {
          amount: commissionsInReview._sum.amount || 0,
          count: commissionsInReview._count || 0,
        },
        approved: {
          amount: commissionsApproved._sum.amount || 0,
          count: commissionsApproved._count || 0,
        },
        paid: {
          amount: commissionsPaid._sum.amount || 0,
          count: commissionsPaid._count || 0,
        },
        declined: {
          amount: commissionsDeclined._sum.amount || 0,
          count: commissionsDeclined._count || 0,
        },
      },
      referrals: directReferrals.map((referral) => ({
        id: referral.id,
        name: referral.name,
        email: referral.email,
        userType: referral.userType,
        joinedAt: referral.createdAt,
        totalPurchases: referral._count.purchases,
      })),
      recentCommissions: recentCommissions.map((commission) => ({
        id: commission.id,
        amount: commission.amount,
        level: commission.level,
        status: commission.status,
        createdAt: commission.createdAt,
        buyer: {
          id: commission.buyer.id,
          name: commission.buyer.name,
          email: commission.buyer.email,
        },
        course: {
          id: commission.course.id,
          name: commission.course.name,
        },
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas de afiliado:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}

