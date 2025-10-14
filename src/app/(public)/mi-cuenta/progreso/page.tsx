"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ProgressStats = {
  overview: {
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    globalProgressPercentage: number;
    totalStudyTimeSeconds: number;
  };
  courses: {
    courseId: string;
    courseName: string;
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    isActive: boolean;
    isCompleted: boolean;
  }[];
  recentLessons: {
    lessonId: string;
    lessonName: string;
    moduleName: string;
    courseName: string;
    courseId: string;
    lastTimestamp: number;
    isCompleted: boolean;
    lastViewed: string;
  }[];
};

export default function ProgresoPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/progress-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
        <p className="text-gray-600">Seguimiento de tu aprendizaje</p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-sm opacity-90 font-medium">Progreso Global</p>
          <p className="text-4xl font-bold mt-2">{stats.overview.globalProgressPercentage}%</p>
          <p className="text-sm mt-1 opacity-75">
            {stats.overview.completedLessons} de {stats.overview.totalLessons} lecciones
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Cursos Activos</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.overview.activeCourses}</p>
          <p className="text-sm text-gray-500 mt-1">En progreso</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Cursos Completados</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.overview.completedCourses}</p>
          <p className="text-sm text-gray-500 mt-1">Finalizados</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Tiempo de Estudio</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {formatTime(stats.overview.totalStudyTimeSeconds)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total acumulado</p>
        </div>
      </div>

      {/* Últimas Lecciones Vistas */}
      {stats.recentLessons.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Últimas Lecciones Vistas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.recentLessons.map((lesson) => (
                <Link
                  key={lesson.lessonId}
                  href={`/cursos/${lesson.courseId}/leccion/${lesson.lessonId}`}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      {lesson.lessonName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {lesson.courseName} • {lesson.moduleName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Visto {formatDate(lesson.lastViewed)}
                    </p>
                  </div>
                  <div className="ml-4">
                    {lesson.isCompleted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Completada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En progreso
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progreso por Curso */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Progreso por Curso</h2>
        </div>
        <div className="p-6">
          {stats.courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aún no has comprado ningún curso</p>
              <Link
                href="/cursos"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Cursos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.courses.map((course) => (
                <div
                  key={course.courseId}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.completedLessons} de {course.totalLessons} lecciones completadas
                      </p>
                    </div>
                    <div className="ml-4">
                      {course.isCompleted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✓ Completado
                        </span>
                      ) : course.isActive ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          En progreso
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          No iniciado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        course.isCompleted
                          ? "bg-green-500"
                          : course.isActive
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">
                    {course.progressPercentage}%
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/cursos/${course.courseId}`}
                      className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      {course.isActive ? "Continuar" : "Comenzar"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

