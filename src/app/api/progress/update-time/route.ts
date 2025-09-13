// src/app/api/progress/update-time/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  /* inicio ejecución lógica */

  // 1. Verificar sesión de usuario
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const userId = session.user.id;

  // 2. Obtener datos del cuerpo de la petición
  const { lessonId, timestamp } = (await request.json()) as {
    lessonId: string;
    timestamp: number;
  };

  if (!lessonId || typeof timestamp === 'undefined') {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  try {
    // 3. Usar 'upsert' para crear o actualizar el progreso
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        lastTimestamp: timestamp,
      },
      create: {
        userId,
        lessonId,
        lastTimestamp: timestamp,
      },
    });

    return new NextResponse(null, { status: 200 });
    
  } catch (error) {
    console.error('Error al actualizar el progreso:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  /* fin ejecución lógica */
}


