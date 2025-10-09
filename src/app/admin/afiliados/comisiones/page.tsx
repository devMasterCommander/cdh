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
  const [filterStatus, setFilterStatus] = useState<string>("APPROVED");
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  
  // Estados para pago
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

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

  const handleChangeStatus = async (commissionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/comisiones/${commissionId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Estado actualizado correctamente");
        fetchComisiones();
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar estado");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar estado");
    }
  };

  const filteredComisiones = comisiones.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const handleSelectCommission = (id: string) => {
    if (selectedCommissions.includes(id)) {
      setSelectedCommissions(selectedCommissions.filter((cid) => cid !== id));
    } else {
      setSelectedCommissions([...selectedCommissions, id]);
    }
  };

  const handleSelectAllFromAffiliate = (affiliateId: string) => {
    const affiliateComm = filteredComisiones.filter(
      (c) => c.affiliateId === affiliateId && c.status === "APPROVED"
    );
    const ids = affiliateComm.map((c) => c.id);
    setSelectedCommissions(ids);
  };

  const handleProcessPayment = async () => {
    if (selectedCommissions.length === 0) {
      alert("Selecciona al menos una comisión");
      return;
    }

    if (!paymentMethod) {
      alert("Selecciona un método de pago");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/admin/comisiones/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionIds: selectedCommissions,
          paymentMethod,
          notes: paymentNotes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSelectedCommissions([]);
        setShowPaymentForm(false);
        setPaymentMethod("");
        setPaymentNotes("");
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

  // Agrupar comisiones por afiliado
  const agrupadoPorAfiliado = filteredComisiones.reduce((acc: any, c) => {
    if (!acc[c.affiliate.id]) {
      acc[c.affiliate.id] = {
        affiliate: c.affiliate,
        comisiones: [],
      };
    }
    acc[c.affiliate.id].comisiones.push(c);
    return acc;
  }, {});

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: "Pendiente",
      IN_REVIEW: "En Revisión",
      APPROVED: "Aprobada",
      DECLINED: "Declinada",
      PAID: "Pagada",
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      PENDING: "bg-gray-100 text-gray-800",
      IN_REVIEW: "bg-blue-100 text-blue-800",
      APPROVED: "bg-green-100 text-green-800",
      DECLINED: "bg-red-100 text-red-800",
      PAID: "bg-purple-100 text-purple-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  // Calcular totales por estado
  const byStatus = {
    PENDING: comisiones.filter((c) => c.status === "PENDING"),
    IN_REVIEW: comisiones.filter((c) => c.status === "IN_REVIEW"),
    APPROVED: comisiones.filter((c) => c.status === "APPROVED"),
    DECLINED: comisiones.filter((c) => c.status === "DECLINED"),
    PAID: comisiones.filter((c) => c.status === "PAID"),
  };

  const montoByStatus = {
    PENDING: byStatus.PENDING.reduce((sum, c) => sum + c.amount, 0),
    IN_REVIEW: byStatus.IN_REVIEW.reduce((sum, c) => sum + c.amount, 0),
    APPROVED: byStatus.APPROVED.reduce((sum, c) => sum + c.amount, 0),
    DECLINED: byStatus.DECLINED.reduce((sum, c) => sum + c.amount, 0),
    PAID: byStatus.PAID.reduce((sum, c) => sum + c.amount, 0),
  };

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
          Administra estados y procesa pagos de comisiones
        </p>
      </div>

      {/* Estadísticas por Estado */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Pendientes</p>
          <p className="text-xl font-bold text-gray-800">
            {montoByStatus.PENDING.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500">{byStatus.PENDING.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">En Revisión</p>
          <p className="text-xl font-bold text-blue-600">
            {montoByStatus.IN_REVIEW.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500">{byStatus.IN_REVIEW.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Aprobadas</p>
          <p className="text-xl font-bold text-green-600">
            {montoByStatus.APPROVED.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500">{byStatus.APPROVED.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Declinadas</p>
          <p className="text-xl font-bold text-red-600">
            {montoByStatus.DECLINED.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500">{byStatus.DECLINED.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Pagadas</p>
          <p className="text-xl font-bold text-purple-600">
            {montoByStatus.PAID.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500">{byStatus.PAID.length}</p>
        </div>
      </div>

      {/* Formulario de Pago */}
      {selectedCommissions.length > 0 && filterStatus === "APPROVED" && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-green-900">
                💰 Procesar Pago de Comisiones
              </h3>
              <p className="text-sm text-green-700 mt-1">
                {selectedCommissions.length} comisión(es) seleccionada(s) • Total: {montoSeleccionado.toFixed(2)}€
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCommissions([]);
                setShowPaymentForm(false);
              }}
              className="text-green-700 hover:text-green-900"
            >
              ✕
            </button>
          </div>

          {!showPaymentForm ? (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continuar con el Pago →
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Seleccionar método...</option>
                  <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="CRYPTO">Criptomonedas</option>
                  <option value="CASH">Efectivo</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ej: Transferencia #12345, Referencia: ABC123"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleProcessPayment}
                  disabled={processing || !paymentMethod}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 font-semibold"
                >
                  {processing ? "Procesando..." : `Registrar Pago de ${montoSeleccionado.toFixed(2)}€`}
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros por Estado */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setFilterStatus("all"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas ({comisiones.length})
          </button>
          <button
            onClick={() => { setFilterStatus("PENDING"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "PENDING" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pendientes ({byStatus.PENDING.length})
          </button>
          <button
            onClick={() => { setFilterStatus("IN_REVIEW"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "IN_REVIEW" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            En Revisión ({byStatus.IN_REVIEW.length})
          </button>
          <button
            onClick={() => { setFilterStatus("APPROVED"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "APPROVED" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Aprobadas ({byStatus.APPROVED.length})
          </button>
          <button
            onClick={() => { setFilterStatus("DECLINED"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "DECLINED" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Declinadas ({byStatus.DECLINED.length})
          </button>
          <button
            onClick={() => { setFilterStatus("PAID"); setSelectedCommissions([]); }}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "PAID" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pagadas ({byStatus.PAID.length})
          </button>
        </div>
      </div>

      {/* Tabla agrupada por Afiliado */}
      <div className="space-y-6">
        {Object.values(agrupadoPorAfiliado).map((group: any) => {
          const totalAfiliado = group.comisiones.reduce((sum: number, c: Commission) => sum + c.amount, 0);
          const canSelect = group.comisiones.every((c: Commission) => c.status === "APPROVED");
          const allSelected = group.comisiones.every((c: Commission) => selectedCommissions.includes(c.id));

          return (
            <div key={group.affiliate.id} className="bg-white rounded-lg shadow">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/usuarios/${group.affiliate.id}`}
                    className="text-lg font-bold text-blue-600 hover:text-blue-800"
                  >
                    {group.affiliate.name || group.affiliate.email}
                  </Link>
                  <span className="text-sm text-gray-600">
                    {group.comisiones.length} comisión(es) • {totalAfiliado.toFixed(2)}€
                  </span>
                </div>
                {canSelect && filterStatus === "APPROVED" && (
                  <button
                    onClick={() => handleSelectAllFromAffiliate(group.affiliate.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {allSelected ? "Deseleccionar todas" : "Seleccionar todas"}
                  </button>
                )}
              </div>

              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {filterStatus === "APPROVED" && (
                      <th className="px-6 py-3 w-12"></th>
                    )}
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
                    {filterStatus !== "PAID" && filterStatus !== "DECLINED" && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {group.comisiones.map((comision: Commission) => (
                    <tr key={comision.id} className="hover:bg-gray-50">
                      {filterStatus === "APPROVED" && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCommissions.includes(comision.id)}
                            onChange={() => handleSelectCommission(comision.id)}
                            className="w-4 h-4 text-green-600"
                          />
                        </td>
                      )}
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
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(comision.status)}`}>
                          {getStatusLabel(comision.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(comision.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      {filterStatus !== "PAID" && filterStatus !== "DECLINED" && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <select
                            value={comision.status}
                            onChange={(e) => handleChangeStatus(comision.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_REVIEW">En Revisión</option>
                            <option value="APPROVED">Aprobar</option>
                            <option value="DECLINED">Declinar</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {filteredComisiones.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No hay comisiones con estado "{getStatusLabel(filterStatus)}"
          </div>
        )}
      </div>

      {/* Información sobre estados */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Estados de Comisión:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Pendiente:</strong> Generada automáticamente al comprar</li>
          <li>• <strong>En Revisión:</strong> Bajo auditoría (subtotal se muestra pero no suma ni resta)</li>
          <li>• <strong>Aprobada:</strong> Cumple condiciones, lista para pagar (suma)</li>
          <li>• <strong>Declinada:</strong> No cumple condiciones (no suma)</li>
          <li>• <strong>Pagada:</strong> Ya pagada al afiliado</li>
        </ul>
      </div>
    </div>
  );
}
