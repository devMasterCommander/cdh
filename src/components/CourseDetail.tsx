"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BuyButton from "./BuyButton";

type CourseDetailProps = {
  course: any;
  hasPurchased: boolean;
  hasSession: boolean;
};

export default function CourseDetail({ course, hasPurchased, hasSession }: CourseDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => {
        router.replace(`/cursos/${course.id}`);
      }, 5000);
    }
    
    if (canceled === 'true') {
      setShowCanceled(true);
      setTimeout(() => {
        setShowCanceled(false);
        router.replace(`/cursos/${course.id}`);
      }, 5000);
    }
  }, [searchParams, router, course.id]);

  const totalLessons = course.modules.reduce(
    (total: number, module: any) => total + module.lessons.length,
    0
  );

  // Si ya compró, mostrar contenido
  if (hasPurchased) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center mb-6 animate-pulse">
              <span className="text-6xl mb-4 block">✅</span>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                ¡Compra Exitosa!
              </h2>
              <p className="text-green-700 mb-4">
                Ahora tienes acceso completo al curso
              </p>
            </div>
          )}

          <Link
            href="/mi-cuenta/mis-cursos"
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
            {course.modules.map((module: any) => (
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
                  {module.lessons.map((lesson: any) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/cursos/${course.id}/leccion/${lesson.id}`}
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

  // Si NO compró, página de ventas
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Mensaje de cancelación */}
        {showCanceled && (
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 text-center mb-6">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">
              Pago Cancelado
            </h2>
            <p className="text-yellow-700">
              No se realizó ningún cargo. Puedes intentarlo cuando quieras.
            </p>
          </div>
        )}

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
              {course.modules.map((module: any) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.order}. {module.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {module.lessons.length} lecciones
                  </p>
                  <ul className="mt-2 space-y-1 ml-4">
                    {module.lessons.map((lesson: any) => (
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

            <BuyButton courseId={course.id} hasSession={hasSession} />
          </div>
        </div>
      </div>
    </div>
  );
}

