"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  sponsor: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  _count: {
    purchases: number;
    lessonProgress: number;
    sponsored: number;
  };
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "with-purchases" | "affiliates">("all");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/admin/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "with-purchases") {
      return matchesSearch && usuario._count.purchases > 0;
    }
    if (filterType === "affiliates") {
      return matchesSearch && usuario._count.sponsored > 0;
    }
    return matchesSearch;
  });

  const stats = {
    total: usuarios.length,
    withPurchases: usuarios.filter((u) => u._count.purchases > 0).length,
    affiliates: usuarios.filter((u) => u._count.sponsored > 0).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos los usuarios de la plataforma
          </p>
        </div>
        <Link
          href="/admin/usuarios/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Crear Usuario
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Usuarios</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Con Compras</p>
          <p className="text-2xl font-bold text-gray-900">{stats.withPurchases}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Afiliados Activos</p>
          <p className="text-2xl font-bold text-gray-900">{stats.affiliates}</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilterType("with-purchases")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "with-purchases"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Con Compras ({stats.withPurchases})
          </button>
          <button
            onClick={() => setFilterType("affiliates")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "affiliates"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Afiliados ({stats.affiliates})
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compras
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patrocinador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.name || "Sin nombre"}
                  </div>
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {usuario._count.purchases}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {usuario._count.lessonProgress} lecciones
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {usuario._count.sponsored}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {usuario.sponsor ? (
                    <div className="text-sm text-gray-900">
                      {usuario.sponsor.name || usuario.sponsor.email}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Sin patrocinador</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(usuario.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/usuarios/${usuario.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm
              ? "No se encontraron usuarios con ese criterio"
              : "No hay usuarios registrados todavía"}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="mt-4 text-sm text-gray-500">
        Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
      </div>
    </div>
  );
}

