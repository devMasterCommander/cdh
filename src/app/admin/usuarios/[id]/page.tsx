"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Sponsor = {
  id: string;
  name: string | null;
  email: string | null;
};

type Purchase = {
  id: string;
  createdAt: string;
  stripePaymentIntentId: string;
  course: {
    id: string;
    name: string;
    price: number;
  };
};

type LessonProgress = {
  id: string;
  isCompleted: boolean;
  lastTimestamp: number;
  updatedAt: string;
  lesson: {
    id: string;
    name: string;
    module: {
      course: {
        name: string;
      };
    };
  };
};

type Commission = {
  id: string;
  amount: number;
  level: number;
  status: string;
  createdAt: string;
  buyer: {
    name: string | null;
    email: string | null;
  };
  course: {
    name: string;
  };
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  sponsor: Sponsor | null;
  sponsored: Array<{ id: string; name: string | null; email: string | null; createdAt: string }>;
  purchases: Purchase[];
  lessonProgress: LessonProgress[];
  commissionsReceived: Commission[];
  _count: {
    purchases: number;
    lessonProgress: number;
    sponsored: number;
    commissionsReceived: number;
  };
};

type Params = {
  params: Promise<{ id: string }>;
};

export default function UsuarioDetailPage({ params }: Params) {
  const [userId, setUserId] = useState<string>("");
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
      fetchUsuario(resolvedParams.id);
    });
  }, [params]);

  const fetchUsuario = async (uid: string) => {
    try {
      const response = await fetch(`/api/admin/usuarios/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
      } else {
        alert("Usuario no encontrado");
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
        <div className="text-gray-500">Cargando usuario...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuario no encontrado</p>
        <Link
          href="/admin/usuarios"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  const totalComisiones = usuario.commissionsReceived.reduce(
    (sum, com) => sum + com.amount,
    0
  );

  const totalGastado = usuario.purchases.reduce(
    (sum, purchase) => sum + purchase.course.price,
    0
  );

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {usuario.name || "Sin nombre"}
            </h1>
            <p className="text-gray-600 mt-1">{usuario.email}</p>
            <p className="text-sm text-gray-500 mt-1">ID: {usuario.id}</p>
          </div>
          {usuario.image && (
            <img
              src={usuario.image}
              alt={usuario.name || "Usuario"}
              className="w-16 h-16 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Compras</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {usuario._count.purchases}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Gastado</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalGastado.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Referidos</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {usuario._count.sponsored}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalComisiones.toFixed(2)}€
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patrocinador */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Patrocinador</h2>
          </div>
          <div className="p-4">
            {usuario.sponsor ? (
              <Link
                href={`/admin/usuarios/${usuario.sponsor.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-blue-100 rounded-full p-2">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {usuario.sponsor.name || "Sin nombre"}
                  </p>
                  <p className="text-xs text-gray-500">{usuario.sponsor.email}</p>
                </div>
              </Link>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Este usuario no tiene patrocinador
              </p>
            )}
          </div>
        </div>

        {/* Referidos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Referidos ({usuario.sponsored.length})
            </h2>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {usuario.sponsored.length > 0 ? (
              <div className="space-y-2">
                {usuario.sponsored.map((ref) => (
                  <Link
                    key={ref.id}
                    href={`/admin/usuarios/${ref.id}`}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ref.name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-500">{ref.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(ref.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No ha referido a nadie todavía
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Compras */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Compras ({usuario.purchases.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuario.purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/cursos/${purchase.course.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {purchase.course.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.course.price.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {purchase.stripePaymentIntentId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuario.purchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ha realizado compras todavía
            </div>
          )}
        </div>
      </div>

      {/* Progreso en Lecciones */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Progreso en Lecciones ({usuario.lessonProgress.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Última actividad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuario.lessonProgress.map((progress) => (
                <tr key={progress.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {progress.lesson.module.course.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {progress.lesson.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {progress.isCompleted ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Completada
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        En progreso
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(progress.lastTimestamp / 60)}:{String(Math.floor(progress.lastTimestamp % 60)).padStart(2, '0')} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(progress.updatedAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuario.lessonProgress.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ha iniciado ninguna lección todavía
            </div>
          )}
        </div>
      </div>

      {/* Comisiones Recibidas */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Comisiones Recibidas ({usuario.commissionsReceived.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
              {usuario.commissionsReceived.map((commission) => (
                <tr key={commission.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {commission.buyer.name || commission.buyer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {commission.course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Nivel {commission.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {commission.amount.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        commission.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {commission.status === "paid" ? "Pagada" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(commission.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuario.commissionsReceived.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ha recibido comisiones todavía
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

