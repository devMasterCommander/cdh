import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CourseDetail from '@/components/CourseDetail';

type Params = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailPage({ params }: Params) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  
  // Obtener curso
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
      _count: {
        select: {
          modules: true,
          purchases: true,
        },
      },
    },
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Curso no encontrado</h1>
          <p className="mt-2 text-gray-600">El curso que buscas no existe</p>
          <Link
            href="/cursos"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Verificar si el usuario compró el curso
  let hasPurchased = false;
  if (session?.user?.id) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    });
    hasPurchased = !!purchase;
  }

  return (
    <CourseDetail 
      course={course} 
      hasPurchased={hasPurchased} 
      hasSession={!!session}
    />
  );
}
