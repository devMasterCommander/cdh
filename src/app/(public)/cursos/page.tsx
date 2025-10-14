"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Course = {
  id: string;
  name: string;
  price: number;
  modules: number;
  lessons: number;
  isPurchased?: boolean;
};

export default function CursosPage() {
  const { data: session } = useSession();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, [session]);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/admin/cursos");
      if (response.ok) {
        const data = await response.json();
        
        // Si hay sesión, verificar cuáles ya compró
        let purchasedCourseIds: string[] = [];
        if (session?.user?.id) {
          const purchasesRes = await fetch("/api/my-courses");
          if (purchasesRes.ok) {
            const purchases = await purchasesRes.json();
            purchasedCourseIds = purchases.map((p: any) => p.course.id);
          }
        }

        const cursosFormateados = data.map((curso: any) => ({
          id: curso.id,
          name: curso.name,
          price: curso.price,
          modules: curso._count.modules,
          lessons: curso.modules?.reduce(
            (total: number, mod: any) => total + (mod.lessons?.length || 0),
            0
          ) || 0,
          isPurchased: purchasedCourseIds.includes(curso.id),
        }));

        setCursos(cursosFormateados);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Cargando cursos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de Navegación */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              {session && (
                <>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/mi-cuenta"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    👤 Mi Cuenta
                  </Link>
                </>
              )}
            </div>
            {session && (
              <Link
                href="/mi-cuenta/mis-cursos"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mis Cursos
              </Link>
            )}
            {!session && (
              <Link
                href="/api/auth/signin"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-gray-600">
            Descubre todos nuestros cursos de desarrollo humano
          </p>
        </div>

        {/* Links de navegación */}
        <div className="mb-8 flex justify-center gap-4">
          {session && (
            <Link
              href="/mi-cuenta/mis-cursos"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mis Cursos
            </Link>
          )}
          {!session && (
            <Link
              href="/api/auth/signin"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Grid de cursos */}
        {cursos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No hay cursos disponibles
            </h2>
            <p className="text-gray-600">
              Pronto agregaremos nuevos cursos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Badge si ya lo compró */}
                  {curso.isPurchased && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Ya adquirido
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {curso.name}
                  </h3>

                  {/* Información del curso */}
                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      📦 {curso.modules} módulos
                    </p>
                    <p className="text-sm text-gray-600">
                      📚 {curso.lessons} lecciones
                    </p>
                  </div>

                  {/* Precio */}
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-blue-600">
                      {curso.price.toFixed(2)}€
                    </p>
                    <p className="text-sm text-gray-500">Pago único</p>
                  </div>

                  {/* Botón */}
                  {curso.isPurchased ? (
                    <Link
                      href={`/cursos/${curso.id}`}
                      className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Acceder al Curso
                    </Link>
                  ) : (
                    <Link
                      href={`/cursos/${curso.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Ver Detalles
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

