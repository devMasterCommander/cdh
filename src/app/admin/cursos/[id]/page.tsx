"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Lesson = {
  id: string;
  name: string;
  vimeoVideoId: string;
  order: number;
};

type Module = {
  id: string;
  name: string;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  modules: Module[];
  _count: {
    purchases: number;
  };
};

type Params = {
  params: Promise<{ id: string }>;
};

export default function CursoDetailPage({ params }: Params) {
  const [id, setId] = useState<string>("");
  const [curso, setCurso] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      fetchCurso(resolvedParams.id);
    });
  }, [params]);

  const fetchCurso = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/cursos/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCurso(data);
      } else {
        alert("Curso no encontrado");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando curso...</div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Curso no encontrado</p>
        <Link
          href="/admin/cursos"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Volver a Cursos
        </Link>
      </div>
    );
  }

  const totalLessons = curso.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/cursos"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← Volver a Cursos
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{curso.name}</h1>
            <p className="text-gray-600 mt-1">Detalles del curso</p>
          </div>
          <Link
            href={`/admin/cursos/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Curso
          </Link>
        </div>
      </div>

      {/* Información del curso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Precio</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {curso.price.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Módulos</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {curso.modules.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Lecciones</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalLessons}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Ventas</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {curso._count.purchases}
          </p>
        </div>
      </div>

      {/* Módulos y Lecciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Módulos y Lecciones
          </h2>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => alert("Funcionalidad de crear módulo próximamente")}
          >
            + Agregar Módulo
          </button>
        </div>

        <div className="p-6">
          {curso.modules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">
                Este curso aún no tiene módulos ni lecciones
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() =>
                  alert("Funcionalidad de crear módulo próximamente")
                }
              >
                Crear Primer Módulo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {curso.modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {module.order}. {module.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {module.lessons.length} lecciones
                      </p>
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        alert("Funcionalidad de agregar lección próximamente")
                      }
                    >
                      + Agregar Lección
                    </button>
                  </div>

                  {module.lessons.length > 0 && (
                    <div className="space-y-2 pl-4">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {lesson.order}
                            </span>
                            <span className="text-sm text-gray-900">
                              {lesson.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              Video: {lesson.vimeoVideoId}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

