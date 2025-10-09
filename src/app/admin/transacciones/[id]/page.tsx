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
  };
};

type Transaction = {
  id: string;
  createdAt: string;
  stripePaymentIntentId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    userType: string;
    image: string | null;
  };
  course: {
    id: string;
    name: string;
    price: number;
  };
  comisiones: Commission[];
};

type Params = {
  params: Promise<{ id: string }>;
};

export default function TransaccionDetailPage({ params }: Params) {
  const [transactionId, setTransactionId] = useState<string>("");
  const [transaccion, setTransaccion] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setTransactionId(resolvedParams.id);
      fetchTransaccion(resolvedParams.id);
    });
  }, [params]);

  const fetchTransaccion = async (tid: string) => {
    try {
      const response = await fetch(`/api/admin/transacciones/${tid}`);
      if (response.ok) {
        const data = await response.json();
        setTransaccion(data);
      } else {
        alert("Transacción no encontrada");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando transacción...</div>
      </div>
    );
  }

  if (!transaccion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transacción no encontrada</p>
        <Link
          href="/admin/transacciones"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Volver a Transacciones
        </Link>
      </div>
    );
  }

  const totalComisiones = transaccion.comisiones.reduce(
    (sum, c) => sum + c.amount,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/transacciones"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← Volver a Transacciones
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Detalle de Transacción</h1>
        <p className="text-gray-600 mt-1">
          {new Date(transaccion.createdAt).toLocaleString("es-ES")}
        </p>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Monto</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {transaccion.course.price.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Generadas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalComisiones.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {transaccion.comisiones.length} comisiones
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Beneficio Neto</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {(transaccion.course.price - totalComisiones).toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalComisiones > 0 
              ? `${((totalComisiones / transaccion.course.price) * 100).toFixed(1)}% en comisiones`
              : "Sin comisiones"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Información del Comprador */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">👤 Comprador</h2>
          </div>
          <div className="p-6">
            <Link
              href={`/admin/usuarios/${transaccion.user.id}`}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {transaccion.user.image && (
                <img
                  src={transaccion.user.image}
                  alt={transaccion.user.name || "Usuario"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {transaccion.user.name || "Sin nombre"}
                </p>
                <p className="text-sm text-gray-500">{transaccion.user.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {transaccion.user.userType}
                </span>
              </div>
              <span className="text-blue-600">→</span>
            </Link>
          </div>
        </div>

        {/* Información del Curso */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">📚 Curso Comprado</h2>
          </div>
          <div className="p-6">
            <Link
              href={`/admin/cursos/${transaccion.course.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-lg font-semibold text-gray-900">
                {transaccion.course.name}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold text-gray-900">
                  {transaccion.course.price.toFixed(2)}€
                </span>
                <span className="text-blue-600">Ver curso →</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Información de Pago */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">💳 Información de Pago</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Intent ID (Stripe)</p>
              <code className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded block">
                {transaccion.stripePaymentIntentId}
              </code>
              <a
                href={`https://dashboard.stripe.com/test/payments/${transaccion.stripePaymentIntentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                Ver en Stripe →
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(transaccion.createdAt).toLocaleString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comisiones Generadas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            💰 Comisiones Generadas ({transaccion.comisiones.length})
          </h2>
        </div>
        {transaccion.comisiones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Afiliado
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
                {transaccion.comisiones.map((comision) => (
                  <tr key={comision.id}>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/usuarios/${comision.affiliate.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {comision.affiliate.name || comision.affiliate.email}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
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
                        {comision.status === "paid" ? "Pagada" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(comision.createdAt).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Esta transacción no generó comisiones
          </div>
        )}
      </div>
    </div>
  );
}

