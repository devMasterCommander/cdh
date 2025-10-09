"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Params = {
  params: Promise<{ id: string }>;
};

export default function EditCursoPage({ params }: Params) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

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
        setFormData({
          name: data.name,
          price: data.price.toString(),
        });
      } else {
        alert("Curso no encontrado");
        router.push("/admin/cursos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar el curso");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        alert("Curso actualizado exitosamente");
        router.push("/admin/cursos");
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar el curso");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el curso");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando curso...</div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-gray-600 mt-1">Modifica la información del curso</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre del curso */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Curso *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Módulo 1: Introducción al Desarrollo Humano"
            />
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio (€) *
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50.00"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <Link
              href="/admin/cursos"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

