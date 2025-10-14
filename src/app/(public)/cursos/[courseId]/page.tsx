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
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center border border-border">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-cinzel font-bold text-foreground mb-2">Curso no encontrado</h1>
            <p className="text-muted-foreground mb-6">El curso que buscas no existe o ha sido eliminado</p>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al catálogo
            </Link>
          </div>
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
