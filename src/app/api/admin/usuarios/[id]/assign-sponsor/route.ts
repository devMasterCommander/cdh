import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAndRecordCommissions } from "@/lib/server/commissions";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT - Asignar o cambiar patrocinador
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { sponsorId, recalculateCommissions } = body;

    if (!sponsorId) {
      return NextResponse.json(
        { error: "El ID del patrocinador es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el sponsor existe
    const sponsor = await prisma.user.findUnique({
      where: { id: sponsorId },
    });

    if (!sponsor) {
      return NextResponse.json(
        { error: "El patrocinador no existe" },
        { status: 404 }
      );
    }

    // Verificar que no esté intentando asignarse a sí mismo
    if (userId === sponsorId) {
      return NextResponse.json(
        { error: "Un usuario no puede ser su propio patrocinador" },
        { status: 400 }
      );
    }

    // Verificar que no cree un ciclo (sponsor no puede estar en la cadena de sponsored del usuario)
    let currentSponsor = sponsor;
    while (currentSponsor.sponsorId) {
      if (currentSponsor.sponsorId === userId) {
        return NextResponse.json(
          { error: "No se puede crear un ciclo de patrocinio" },
          { status: 400 }
        );
      }
      const nextSponsor = await prisma.user.findUnique({
        where: { id: currentSponsor.sponsorId },
      });
      if (!nextSponsor) break;
      currentSponsor = nextSponsor;
    }

    // Obtener datos del usuario antes de actualizar
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        sponsorId: true,
      },
    });

    const hadPreviousSponsor = usuario?.sponsorId !== null;

    // Actualizar el sponsor
    await prisma.user.update({
      where: { id: userId },
      data: { sponsorId },
    });

    // Si se solicita recalcular comisiones
    if (recalculateCommissions) {
      // Obtener todas las compras del usuario
      const purchases = await prisma.purchase.findMany({
        where: { userId },
        include: {
          course: true,
        },
      });

      // Si tenía sponsor anterior, eliminar sus comisiones
      if (hadPreviousSponsor) {
        await prisma.commission.deleteMany({
          where: { buyerId: userId },
        });
        console.log(`Comisiones anteriores eliminadas para usuario ${userId}`);
      }

      // Calcular nuevas comisiones para cada compra
      for (const purchase of purchases) {
        await calculateAndRecordCommissions(
          userId,
          purchase.course.price,
          purchase.courseId
        );
      }

      return NextResponse.json({
        message: "Patrocinador asignado y comisiones recalculadas correctamente",
        commissionsRecalculated: purchases.length,
      });
    }

    return NextResponse.json({
      message: "Patrocinador asignado correctamente",
    });
  } catch (error) {
    console.error("Error al asignar patrocinador:", error);
    return NextResponse.json(
      { error: "Error al asignar patrocinador" },
      { status: 500 }
    );
  }
}

