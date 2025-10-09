"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Commission = {
  id: string;
  amount: number;
  level: number;
  status: string;
  createdAt: string;
  affiliate: {
    id: string;
    name: string | null;
    email: string | null;
    userType: string;
  };
  buyer: {
    id: string;
    name: string | null;
    email: string | null;
  };
  course: {
    id: string;
    name: string;
  };
};

export default function ComisionesPage() {
  const [comisiones, setComisiones] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid">("pending");
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchComisiones();
  }, []);

  const fetchComisiones = async () => {
    try {
      const response = await fetch("/api/admin/comisiones");
      const data = await response.json();
      setComisiones(data);
    } catch (error) {
      console.error("Error al cargar comisiones:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComisiones = comisiones.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const handleSelectAll = () => {
    const pendientes = filteredComisiones
      .filter((c) => c.status === "pending")
      .map((c) => c.id);
    
    if (selectedCommissions.length === pendientes.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(pendientes);
    }
  };

  const handleSelectCommission = (id: string) => {
    if (selectedCommissions.includes(id)) {
      setSelectedCommissions(selectedCommissions.filter((cid) => cid !== id));
    } else {
      setSelectedCommissions([...selectedCommissions, id]);
    }
  };

  const handleMarkAsPaid = async () => {
    if (selectedCommissions.length === 0) {
      alert("Selecciona al menos una comisión");
      return;
    }

    const totalAmount = comisiones
      .filter((c) => selectedCommissions.includes(c.id))
      .reduce((sum, c) => sum + c.amount, 0);

    if (!confirm(
      `¿Marcar ${selectedCommissions.length} comisión(es) como pagadas?\n\n` +
      `Total a pagar: ${totalAmount.toFixed(2)}€`
    )) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/admin/comisiones/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionIds: selectedCommissions }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSelectedCommissions([]);
        fetchComisiones();
      } else {
        const data = await response.json();
        alert(data.error || "Error al procesar el pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pago");
    } finally {
      setProcessing(false);
    }
  };

  const totalPendientes = comisiones.filter((c) => c.status === "pending");
  const totalPagadas = comisiones.filter((c) => c.status === "paid");
  const montoPendiente = totalPendientes.reduce((sum, c) => sum + c.amount, 0);
  const montoSeleccionado = comisiones
    .filter((c) => selectedCommissions.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando comisiones...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/afiliados"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← Volver a Afiliados
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Comisiones</h1>
        <p className="text-gray-600 mt-1">
          Administra y procesa los pagos de comisiones
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Pendientes de Pago</p>
          <p className="text-3xl font-bold text-yellow-600">
            {montoPendiente.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">{totalPendientes.length} comisiones</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Seleccionadas para Pagar</p>
          <p className="text-3xl font-bold text-blue-600">
            {montoSeleccionado.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">{selectedCommissions.length} seleccionadas</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Ya Pagadas</p>
          <p className="text-3xl font-bold text-green-600">
            {totalPagadas.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">{totalPagadas.length} comisiones</p>
        </div>
      </div>

      {/* Acciones */}
      {selectedCommissions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">
                {selectedCommissions.length} comisión(es) seleccionada(s)
              </p>
              <p className="text-xs text-green-700">
                Total a pagar: {montoSeleccionado.toFixed(2)}€
              </p>
            </div>
            <button
              onClick={handleMarkAsPaid}
              disabled={processing}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {processing ? "Procesando..." : "💰 Marcar Como Pagadas"}
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setFilterStatus("all");
              setSelectedCommissions([]);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas ({comisiones.length})
          </button>
          <button
            onClick={() => {
              setFilterStatus("pending");
              setSelectedCommissions([]);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pendientes ({totalPendientes.length})
          </button>
          <button
            onClick={() => {
              setFilterStatus("paid");
              setSelectedCommissions([]);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === "paid"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pagadas ({totalPagadas.length})
          </button>
        </div>
      </div>

      {/* Tabla de Comisiones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filterStatus === "pending" && totalPendientes.length > 0 && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCommissions.length === totalPendientes.length && totalPendientes.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Seleccionar todas las pendientes
              </span>
            </label>
          </div>
        )}

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {filterStatus === "pending" && (
                <th className="px-6 py-3 w-12"></th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Afiliado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Comprador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComisiones.map((comision) => (
              <tr key={comision.id} className="hover:bg-gray-50">
                {filterStatus === "pending" && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.includes(comision.id)}
                      onChange={() => handleSelectCommission(comision.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/usuarios/${comision.affiliate.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {comision.affiliate.name || "Sin nombre"}
                  </Link>
                  <div className="text-xs text-gray-500">{comision.affiliate.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {comision.buyer.name || comision.buyer.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {comision.course.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Nivel {comision.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {comision.amount.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      comision.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {comision.status === "paid" ? "✓ Pagada" : "⏳ Pendiente"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(comision.createdAt).toLocaleDateString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredComisiones.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {filterStatus === "pending"
              ? "🎉 No hay comisiones pendientes de pago"
              : filterStatus === "paid"
              ? "No hay comisiones pagadas todavía"
              : "No hay comisiones registradas"}
          </div>
        )}
      </div>

      {/* Información */}
      {filterStatus === "pending" && totalPendientes.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>💡 Cómo usar:</strong> Selecciona las comisiones que deseas marcar como pagadas 
            y luego haz clic en "Marcar Como Pagadas". Esto registrará que ya fueron pagadas a los afiliados.
          </p>
        </div>
      )}
    </div>
  );
}

