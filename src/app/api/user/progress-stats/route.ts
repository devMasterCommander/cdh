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

    // 1. Obtener todas las compras del usuario
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // 2. Calcular lecciones totales
    const totalLessons = purchases.reduce((total, purchase) => {
      const courseLessons = purchase.course.modules.reduce(
        (moduleTotal, module) => moduleTotal + module.lessons.length,
        0
      );
      return total + courseLessons;
    }, 0);

    // 3. Obtener progreso de lecciones completadas
    const completedProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    const completedLessons = completedProgress.length;

    // 4. Calcular tiempo total de estudio (en segundos)
    const allProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      select: { lastTimestamp: true },
    });

    const totalStudyTime = allProgress.reduce(
      (total, progress) => total + progress.lastTimestamp,
      0
    );

    // 5. Obtener últimas lecciones vistas (últimas 5)
    const recentProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // 6. Calcular cursos activos (con algún progreso)
    const activeCourses = await Promise.all(
      purchases.map(async (purchase) => {
        const courseTotalLessons = purchase.course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );

        const courseCompletedLessons = await prisma.lessonProgress.count({
          where: {
            userId,
            isCompleted: true,
            lesson: {
              module: {
                courseId: purchase.course.id,
              },
            },
          },
        });

        const progressPercentage = courseTotalLessons > 0
          ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
          : 0;

        return {
          courseId: purchase.course.id,
          courseName: purchase.course.name,
          totalLessons: courseTotalLessons,
          completedLessons: courseCompletedLessons,
          progressPercentage,
          isActive: progressPercentage > 0 && progressPercentage < 100,
          isCompleted: progressPercentage === 100,
        };
      })
    );

    // 7. Filtrar cursos activos y completados
    const activeCoursesOnly = activeCourses.filter((c) => c.isActive);
    const completedCoursesOnly = activeCourses.filter((c) => c.isCompleted);

    // 8. Calcular porcentaje global
    const globalProgressPercentage = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    // 9. Preparar respuesta
    const stats = {
      overview: {
        totalCourses: purchases.length,
        activeCourses: activeCoursesOnly.length,
        completedCourses: completedCoursesOnly.length,
        totalLessons,
        completedLessons,
        globalProgressPercentage,
        totalStudyTimeSeconds: Math.round(totalStudyTime),
      },
      courses: activeCourses,
      recentLessons: recentProgress.map((progress) => ({
        lessonId: progress.lesson.id,
        lessonName: progress.lesson.name,
        moduleName: progress.lesson.module.name,
        courseName: progress.lesson.module.course.name,
        courseId: progress.lesson.module.course.id,
        lastTimestamp: progress.lastTimestamp,
        isCompleted: progress.isCompleted,
        lastViewed: progress.updatedAt,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas de progreso:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}

