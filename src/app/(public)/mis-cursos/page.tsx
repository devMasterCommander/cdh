"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Course = {
  id: string;
  createdAt: string;
  course: {
    id: string;
    name: string;
    price: number;
    modules: Array<{
      id: string;
      name: string;
      order: number;
      lessons: Array<{
        id: string;
        name: string;
        order: number;
      }>;
    }>;
  };
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
};

export default function MisCursosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchCursos();
    }
  }, [status, router]);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/my-courses");
      if (response.ok) {
        const data = await response.json();
        setCursos(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Cargando tus cursos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mis Cursos</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Cursos */}
        {cursos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aún no has comprado ningún curso
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestro catálogo y comienza tu aprendizaje
            </p>
            <Link
              href="/cursos"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Cursos Disponibles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {purchase.course.name}
                  </h3>
                  
                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span className="font-semibold">{purchase.progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${purchase.progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {purchase.progress.completed} de {purchase.progress.total} lecciones completadas
                    </p>
                  </div>

                  {/* Información del curso */}
                  <div className="mb-4 space-y-1">
                    <p className="text-sm text-gray-600">
                      📦 {purchase.course.modules.length} módulos
                    </p>
                    <p className="text-sm text-gray-600">
                      📚 {purchase.progress.total} lecciones
                    </p>
                    <p className="text-xs text-gray-500">
                      Comprado el {new Date(purchase.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Botón de acceso */}
                  <Link
                    href={`/cursos/${purchase.course.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {purchase.progress.percentage === 0
                      ? "Comenzar Curso"
                      : purchase.progress.percentage === 100
                      ? "Revisar Curso"
                      : "Continuar Curso"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

