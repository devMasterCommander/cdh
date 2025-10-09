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
  
  // Estados para formularios
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [moduleForm, setModuleForm] = useState({ name: "" });
  const [lessonForm, setLessonForm] = useState({ name: "", vimeoVideoId: "" });

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

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/modulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: moduleForm.name,
          courseId: id,
        }),
      });

      if (response.ok) {
        alert("Módulo creado exitosamente");
        setModuleForm({ name: "" });
        setShowModuleForm(false);
        fetchCurso(id);
      } else {
        const data = await response.json();
        alert(data.error || "Error al crear el módulo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el módulo");
    }
  };

  const handleCreateLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/lecciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lessonForm.name,
          vimeoVideoId: lessonForm.vimeoVideoId,
          moduleId: moduleId,
        }),
      });

      if (response.ok) {
        alert("Lección creada exitosamente");
        setLessonForm({ name: "", vimeoVideoId: "" });
        setShowLessonForm(null);
        fetchCurso(id);
      } else {
        const data = await response.json();
        alert(data.error || "Error al crear la lección");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la lección");
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el módulo "${moduleName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/modulos/${moduleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Módulo eliminado correctamente");
        fetchCurso(id);
      } else {
        const data = await response.json();
        alert(data.error || "Error al eliminar el módulo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el módulo");
    }
  };

  const handleDeleteLesson = async (lessonId: string, lessonName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la lección "${lessonName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/lecciones/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Lección eliminada correctamente");
        fetchCurso(id);
      } else {
        const data = await response.json();
        alert(data.error || "Error al eliminar la lección");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la lección");
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
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {showModuleForm ? "Cancelar" : "+ Agregar Módulo"}
          </button>
        </div>

        <div className="p-6">
          {/* Formulario de crear módulo */}
          {showModuleForm && (
            <form onSubmit={handleCreateModule} className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Nuevo Módulo</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  required
                  placeholder="Nombre del módulo"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          )}

          {curso.modules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">
                Este curso aún no tiene módulos ni lecciones
              </p>
              {!showModuleForm && (
                <button
                  onClick={() => setShowModuleForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Primer Módulo
                </button>
              )}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLessonForm(showLessonForm === module.id ? null : module.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showLessonForm === module.id ? "Cancelar" : "+ Agregar Lección"}
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id, module.name)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Formulario de crear lección */}
                  {showLessonForm === module.id && (
                    <form 
                      onSubmit={(e) => handleCreateLesson(e, module.id)} 
                      className="mb-4 p-4 bg-green-50 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Nueva Lección</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Nombre de la lección"
                          value={lessonForm.name}
                          onChange={(e) => setLessonForm({ ...lessonForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                        <input
                          type="text"
                          required
                          placeholder="ID del video de Vimeo (ej: 123456789)"
                          value={lessonForm.vimeoVideoId}
                          onChange={(e) => setLessonForm({ ...lessonForm, vimeoVideoId: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Crear Lección
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lista de lecciones */}
                  {module.lessons.length > 0 && (
                    <div className="space-y-2 pl-4">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm text-gray-500 font-medium">
                              {lesson.order}
                            </span>
                            <span className="text-sm text-gray-900">
                              {lesson.name}
                            </span>
                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                              🎥 {lesson.vimeoVideoId}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id, lesson.name)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
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
