"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Transaction = {
  id: string;
  createdAt: string;
  stripePaymentIntentId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    userType: string;
  };
  course: {
    id: string;
    name: string;
    price: number;
  };
};

export default function TransaccionesPage() {
  const [transacciones, setTransacciones] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "week" | "month">("all");

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const fetchTransacciones = async () => {
    try {
      const response = await fetch("/api/admin/transacciones");
      const data = await response.json();
      setTransacciones(data);
    } catch (error) {
      console.error("Error al cargar transacciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByPeriod = (transactions: Transaction[]) => {
    if (filterPeriod === "all") return transactions;

    const now = new Date();
    const filtered = transactions.filter((t) => {
      const transDate = new Date(t.createdAt);
      
      if (filterPeriod === "today") {
        return transDate.toDateString() === now.toDateString();
      }
      
      if (filterPeriod === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transDate >= weekAgo;
      }
      
      if (filterPeriod === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return transDate >= monthAgo;
      }
      
      return true;
    });

    return filtered;
  };

  const filteredTransacciones = filterByPeriod(transacciones).filter((t) =>
    t.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIngresos = filteredTransacciones.reduce(
    (sum, t) => sum + t.course.price,
    0
  );

  const totalIngresosGeneral = transacciones.reduce(
    (sum, t) => sum + t.course.price,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando transacciones...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
        <p className="text-gray-600 mt-1">
          Historial completo de compras y ventas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Transacciones</p>
          <p className="text-2xl font-bold text-gray-900">{transacciones.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Ingresos Totales</p>
          <p className="text-2xl font-bold text-gray-900">{totalIngresosGeneral.toFixed(2)}€</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Promedio por Venta</p>
          <p className="text-2xl font-bold text-gray-900">
            {transacciones.length > 0
              ? (totalIngresosGeneral / transacciones.length).toFixed(2)
              : "0.00"}
            €
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setFilterPeriod("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPeriod === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterPeriod("today")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPeriod === "today"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setFilterPeriod("week")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPeriod === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => setFilterPeriod("month")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPeriod === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Último mes
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar por usuario o curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Resultados filtrados */}
      {filterPeriod !== "all" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📊 Mostrando {filteredTransacciones.length} transacciones • Ingresos: {totalIngresos.toFixed(2)}€
          </p>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransacciones.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/usuarios/${t.user.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {t.user.name || "Sin nombre"}
                  </Link>
                  <div className="text-sm text-gray-500">{t.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/cursos/${t.course.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t.course.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">
                    {t.course.price.toFixed(2)}€
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {t.stripePaymentIntentId.substring(0, 20)}...
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/transacciones/${t.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransacciones.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm
              ? "No se encontraron transacciones con ese criterio"
              : "No hay transacciones registradas todavía"}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="mt-4 text-sm text-gray-500">
        Mostrando {filteredTransacciones.length} de {transacciones.length} transacciones
      </div>
    </div>
  );
}

