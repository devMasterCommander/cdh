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
  userType: string;
  affiliateRequestStatus: string;
  referralSlug: string | null;
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
  
  // Estados para URL de referido
  const [editingSlug, setEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);
  
  // Estados para cambio de tipo de usuario
  const [changingType, setChangingType] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  
  // Estados para edición de datos
  const [editingData, setEditingData] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [savingData, setSavingData] = useState(false);

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
        setNewSlug(data.referralSlug || "");
        setEditForm({ name: data.name || "", email: data.email || "" });
      } else {
        alert("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUserData = async () => {
    if (!editForm.email.trim()) {
      alert("El email es requerido");
      return;
    }

    setSavingData(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert("Datos actualizados exitosamente");
        setEditingData(false);
        fetchUsuario(userId);
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar datos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar datos");
    } finally {
      setSavingData(false);
    }
  };

  const handleSaveSlug = async () => {
    if (!newSlug.trim()) {
      alert("El slug no puede estar vacío");
      return;
    }

    setSavingSlug(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${userId}/referral-slug`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralSlug: newSlug }),
      });

      if (response.ok) {
        alert("Slug actualizado exitosamente");
        setEditingSlug(false);
        fetchUsuario(userId);
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar el slug");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el slug");
    } finally {
      setSavingSlug(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("URL copiada al portapapeles");
  };

  const getReferralUrl = () => {
    const baseUrl = window.location.origin;
    const identifier = usuario?.referralSlug || userId;
    return `${baseUrl}/ref/${identifier}`;
  };

  const handleChangeUserType = async () => {
    if (!selectedType) {
      alert("Selecciona un tipo de usuario");
      return;
    }

    if (!confirm(`¿Estás seguro de cambiar el tipo de usuario a ${selectedType}?`)) {
      return;
    }

    setChangingType(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${userId}/change-type`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: selectedType }),
      });

      if (response.ok) {
        alert("Tipo de usuario actualizado exitosamente");
        fetchUsuario(userId);
      } else {
        const data = await response.json();
        alert(data.error || "Error al cambiar tipo de usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar tipo de usuario");
    } finally {
      setChangingType(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      GUEST: "Invitado",
      CUSTOMER: "Cliente",
      AFFILIATE: "Afiliado",
      ADMIN: "Administrador",
    };
    return types[type] || type;
  };

  const getUserTypeBadge = (type: string) => {
    const badges: { [key: string]: string } = {
      GUEST: "bg-gray-100 text-gray-800",
      CUSTOMER: "bg-green-100 text-green-800",
      AFFILIATE: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800",
    };
    return badges[type] || "bg-gray-100 text-gray-800";
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
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {usuario.name || "Sin nombre"}
              </h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getUserTypeBadge(usuario.userType)}`}>
                {getUserTypeLabel(usuario.userType)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{usuario.email}</p>
            <p className="text-sm text-gray-500 mt-1">ID: {usuario.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingData(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✏️ Editar Datos
            </button>
            {usuario.image && (
              <img
                src={usuario.image}
                alt={usuario.name || "Usuario"}
                className="w-16 h-16 rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal/Sección de Edición de Datos */}
      {editingData && (
        <div className="bg-white rounded-lg shadow mb-6 p-6 border-2 border-blue-500">
          <h2 className="text-lg font-bold text-gray-900 mb-4">✏️ Editar Datos del Usuario</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Juan Pérez García"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                El email debe ser único en el sistema
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveUserData}
                disabled={savingData}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {savingData ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                onClick={() => {
                  setEditingData(false);
                  setEditForm({ name: usuario?.name || "", email: usuario?.email || "" });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cambiar Tipo de Usuario */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">👤 Tipo de Usuario</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Actual
            </label>
            <div className={`inline-flex px-4 py-2 rounded-lg font-semibold ${getUserTypeBadge(usuario.userType)}`}>
              {getUserTypeLabel(usuario.userType)}
            </div>
            {usuario.affiliateRequestStatus === 'PENDING' && (
              <div className="mt-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  ⚠️ Solicitud de afiliado pendiente
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cambiar a
            </label>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Seleccionar...</option>
                <option value="GUEST">Invitado</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="AFFILIATE">Afiliado</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <button
                onClick={handleChangeUserType}
                disabled={changingType || !selectedType}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {changingType ? "Cambiando..." : "Cambiar"}
              </button>
            </div>
          </div>
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

      {/* URL para Recomendación (Solo para Afiliados) */}
      {usuario.userType === 'AFFILIATE' && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">🔗 URL para Recomendación</h2>
          </div>
        <div className="p-6">
          {/* URL Actual */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL para Compartir
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={getReferralUrl()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
              <button
                onClick={() => copyToClipboard(getReferralUrl())}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                📋 Copiar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {usuario.referralSlug 
                ? `Usando slug personalizado: "${usuario.referralSlug}"` 
                : `Usando ID por defecto. Personaliza el slug para una URL más amigable.`
              }
            </p>
          </div>

          {/* Editar Slug */}
          {!editingSlug ? (
            <button
              onClick={() => setEditingSlug(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ✏️ Personalizar Slug
            </button>
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                Personalizar Slug de Referido
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Nuevo Slug (solo letras minúsculas, números y guiones)
                  </label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase())}
                    placeholder="ej: juan-perez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vista previa: <code className="bg-gray-100 px-1 rounded">
                      {window.location.origin}/ref/{newSlug || "tu-slug"}
                    </code>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveSlug}
                    disabled={savingSlug || !newSlug.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm"
                  >
                    {savingSlug ? "Guardando..." : "Guardar Slug"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSlug(false);
                      setNewSlug(usuario?.referralSlug || "");
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>💡 Tip:</strong> El slug personalizado hace que la URL sea más fácil de recordar y compartir. 
              Será único en todo el sistema.
            </p>
          </div>
        </div>
      </div>
      )}

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

