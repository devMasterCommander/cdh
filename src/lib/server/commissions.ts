// src/lib/server/commissions.ts

import { prisma } from '@/lib/prisma'; // Importamos el cliente centralizado

const MLM_DEPTH = 5; // Esto también podría ser un Setting en el futuro

/**
 * Calcula y registra las comisiones en la base de datos para una nueva compra.
 * @param buyerId El ID del usuario que realizó la compra.
 * @param purchaseAmount El monto total de la compra.
 * @param courseId El ID del curso comprado.
 */
export async function calculateAndRecordCommissions(
  buyerId: string,
  purchaseAmount: number,
  courseId: string
) {
  /* inicio lógica dinámica */

  // 1. Obtener el porcentaje de comisión desde la base de datos
  const commissionRateSetting = await prisma.setting.findUnique({
    where: { key: 'commission_rate' },
  });

  // 2. Usar el valor de la BD, o un valor por defecto seguro si no existe
  const commissionRate = commissionRateSetting
    ? parseFloat(commissionRateSetting.value)
    : 0.1; // Valor por defecto del 10%

  console.log(`Tasa de comisión a usar: ${commissionRate * 100}%`);
  
  /* fin lógica dinámica */

  console.log(
    `Iniciando cálculo de comisiones para el comprador ${buyerId} por un monto de ${purchaseAmount}`
  );

  const commissionableSponsors: { userId: string; level: number }[] = [];
  let currentUserId = buyerId;

  for (let level = 1; level <= MLM_DEPTH; level++) {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { sponsorId: true },
    });

    if (!currentUser || !currentUser.sponsorId) {
      break;
    }

    const sponsorId = currentUser.sponsorId;
    commissionableSponsors.push({ userId: sponsorId, level: level });
    currentUserId = sponsorId;
  }

  if (commissionableSponsors.length > 0) {
    console.log('Patrocinadores encontrados:', commissionableSponsors);

    const commissionAmount = purchaseAmount * commissionRate; // Usamos la variable dinámica

    const commissionsToCreate = commissionableSponsors.map((sponsor) => ({
      amount: commissionAmount,
      level: sponsor.level,
      affiliateId: sponsor.userId,
      buyerId: buyerId,
      courseId: courseId,
      status: 'pending',
    }));

    await prisma.commission.createMany({
      data: commissionsToCreate,
    });

    console.log(
      `${commissionsToCreate.length} comisiones han sido registradas.`
    );
  } else {
    console.log('No se encontraron patrocinadores para comisionar.');
  }
}


