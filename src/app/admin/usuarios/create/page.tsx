"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "GUEST",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Usuario creado exitosamente");
        router.push(`/admin/usuarios/${data.id}`);
      } else {
        const data = await response.json();
        alert(data.error || "Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/usuarios"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← Volver a Usuarios
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
        <p className="text-gray-600 mt-1">
          Registra un nuevo usuario en el sistema
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Juan Pérez García"
            />
            <p className="mt-1 text-sm text-gray-500">
              Nombre y apellidos del usuario (opcional)
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="usuario@ejemplo.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Debe ser único en el sistema
            </p>
          </div>

          {/* Tipo de usuario */}
          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Usuario *
            </label>
            <select
              id="userType"
              value={formData.userType}
              onChange={(e) =>
                setFormData({ ...formData, userType: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="GUEST">Invitado</option>
              <option value="CUSTOMER">Cliente</option>
              <option value="AFFILIATE">Afiliado</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona el tipo de usuario inicial
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              ℹ️ Información
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Invitado: Usuario registrado sin compras</li>
              <li>• Cliente: Usuario con compras (se asigna automáticamente al comprar)</li>
              <li>• Afiliado: Puede referir y ganar comisiones</li>
              <li>• Administrador: Acceso al panel de administración</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Usuario"}
            </button>
            <Link
              href="/admin/usuarios"
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

