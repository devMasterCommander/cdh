"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Affiliate = {
  id: string;
  name: string | null;
  email: string | null;
  userType: string;
  referralSlug: string | null;
  createdAt: string;
  _count: {
    sponsored: number;
    commissionsReceived: number;
  };
  metricas: {
    totalComisiones: number;
    comisionesPendientes: number;
    comisionesPagadas: number;
    numeroComisiones: number;
    numeroPendientes: number;
  };
};

export default function AfiliadosPage() {
  const [afiliados, setAfiliados] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");

  useEffect(() => {
    fetchAfiliados();
  }, []);

  const fetchAfiliados = async () => {
    try {
      const response = await fetch("/api/admin/afiliados");
      const data = await response.json();
      setAfiliados(data);
    } catch (error) {
      console.error("Error al cargar afiliados:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAfiliados = afiliados.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalComisionesPendientes = afiliados.reduce(
    (sum, a) => sum + a.metricas.comisionesPendientes,
    0
  );

  const totalComisionesPagadas = afiliados.reduce(
    (sum, a) => sum + a.metricas.comisionesPagadas,
    0
  );

  const totalReferidos = afiliados.reduce(
    (sum, a) => sum + a._count.sponsored,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando afiliados...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Afiliados</h1>
        <p className="text-gray-600 mt-1">
          Gestiona afiliados, comisiones y pagos
        </p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Afiliados Activos</p>
          <p className="text-2xl font-bold text-gray-900">{afiliados.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Referidos</p>
          <p className="text-2xl font-bold text-gray-900">{totalReferidos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {totalComisionesPendientes.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Pagadas</p>
          <p className="text-2xl font-bold text-green-600">
            {totalComisionesPagadas.toFixed(2)}€
          </p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📊 Lista
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "tree"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🌳 Árbol
            </button>
          </div>
          <Link
            href="/admin/afiliados/comisiones"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            💰 Gestionar Pagos
          </Link>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar afiliado por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Vista de Lista */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ranking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Afiliado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Referidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Comisiones Totales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pendientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pagadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAfiliados.map((afiliado, index) => (
                <tr key={afiliado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index < 3 ? (
                      <span className="text-2xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/usuarios/${afiliado.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {afiliado.name || "Sin nombre"}
                    </Link>
                    <div className="text-sm text-gray-500">{afiliado.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {afiliado._count.sponsored}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {afiliado.metricas.totalComisiones.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-yellow-600">
                      {afiliado.metricas.comisionesPendientes.toFixed(2)}€
                    </span>
                    <div className="text-xs text-gray-500">
                      ({afiliado.metricas.numeroPendientes})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {afiliado.metricas.comisionesPagadas.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {afiliado.referralSlug ? (
                      <code className="bg-blue-50 text-blue-800 px-2 py-1 rounded">
                        /ref/{afiliado.referralSlug}
                      </code>
                    ) : (
                      <span className="text-gray-400">Sin slug</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/usuarios/${afiliado.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Perfil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAfiliados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm
                ? "No se encontraron afiliados con ese criterio"
                : "No hay afiliados registrados todavía"}
            </div>
          )}
        </div>
      )}

      {/* Vista de Árbol (Próximamente) */}
      {viewMode === "tree" && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl mb-4 block">🌳</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Vista de Árbol Multinivel
          </h3>
          <p className="text-gray-600 mb-4">
            Visualización del árbol de afiliados próximamente
          </p>
          <button
            onClick={() => setViewMode("list")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a Lista
          </button>
        </div>
      )}
    </div>
  );
}

