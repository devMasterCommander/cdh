import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  // Si ya compró el curso, mostrar contenido
  if (hasPurchased) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/mis-cursos"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Volver a Mis Cursos
          </Link>

          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-gray-600 mt-2">
              {course.modules.length} módulos • {totalLessons} lecciones
            </p>
          </div>

          <div className="space-y-6">
            {course.modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {module.order}. {module.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {module.lessons.length} lecciones
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/cursos/${courseId}/leccion/${lesson.id}`}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-blue-600 font-bold mr-4 text-lg">
                          {lesson.order}.
                        </span>
                        <span className="text-gray-900 flex-1">{lesson.name}</span>
                        <span className="text-blue-600">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si NO compró el curso, mostrar página de ventas
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/cursos"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Volver al catálogo
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {course.name}
          </h1>

          {/* Contenido del curso */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contenido del Curso
            </h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.order}. {module.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {module.lessons.length} lecciones
                  </p>
                  <ul className="mt-2 space-y-1 ml-4">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="text-sm text-gray-700">
                        • {lesson.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Información */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-800 font-medium">Módulos</p>
                <p className="text-2xl font-bold text-blue-900">{course.modules.length}</p>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Lecciones</p>
                <p className="text-2xl font-bold text-blue-900">{totalLessons}</p>
              </div>
            </div>
          </div>

          {/* Precio y compra */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Precio del curso</p>
                <p className="text-5xl font-bold text-blue-600">
                  {course.price.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500 mt-1">Pago único • Acceso de por vida</p>
              </div>
            </div>

            {session ? (
              <form action="/api/checkout_sessions" method="POST">
                <input type="hidden" name="courseId" value={courseId} />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Comprar Ahora
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/api/auth/signin"
                  className="block w-full bg-blue-600 text-white text-center font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Iniciar Sesión para Comprar
                </Link>
                <p className="text-sm text-gray-600 text-center">
                  O compra como invitado (te pediremos tu email en el checkout)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
