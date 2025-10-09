// src/app/cursos/[courseId]/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

async function getCourseData(userId: string, courseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: courseId,
      },
    },
  });

  if (!purchase) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  return course;
}

export default async function CourseDashboardPage({
  params,
}: {
  params: { courseId: string };
}) {
  // CORRECCIÓN: Extraemos courseId de params aquí
  const { courseId } = params;

  const userId = 'user_test_123';

  const courseData = await getCourseData(userId, courseId);

  if (!courseData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="mt-4">No has comprado este curso o no existe.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{courseData.name}</h1>
        <p className="mt-2 text-gray-500">Contenido del curso:</p>
      </div>

      <div className="space-y-6">
        {courseData.modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {module.name}
            </h2>
            <ul className="space-y-3">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-blue-500 font-bold mr-4">{lesson.order}.</span>
                  <span className="text-gray-800">{lesson.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}