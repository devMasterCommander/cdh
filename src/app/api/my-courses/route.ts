import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
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

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: {
                    order: "asc",
                  },
                },
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular progreso de cada curso
    const cursosConProgreso = await Promise.all(
      purchases.map(async (purchase) => {
        const totalLessons = purchase.course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );

        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: session.user.id,
            isCompleted: true,
            lesson: {
              module: {
                courseId: purchase.course.id,
              },
            },
          },
        });

        const progressPercentage = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          ...purchase,
          progress: {
            total: totalLessons,
            completed: completedLessons,
            percentage: progressPercentage,
          },
        };
      })
    );

    return NextResponse.json(cursosConProgreso);
  } catch (error) {
    console.error("Error al obtener cursos del usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener cursos" },
      { status: 500 }
    );
  }
}

