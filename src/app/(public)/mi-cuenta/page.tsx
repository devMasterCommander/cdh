"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  userType: string;
  referralSlug: string | null;
  createdAt: string;
  _count: {
    purchases: number;
    sponsored: number;
  };
};

export default function MiPerfilPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/usuarios");
      if (response.ok) {
        const usuarios = await response.json();
        const user = usuarios.find((u: any) => u.email === session?.user?.email);
        if (user) {
          setUserData(user);
          setFormData({ name: user.name || "", email: user.email || "" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Datos actualizados correctamente");
        setEditing(false);
        fetchUserData();
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar datos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar datos");
    } finally {
      setSaving(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      GUEST: "Invitado",
      CUSTOMER: "Cliente",
      AFFILIATE: "Afiliado",
      ADMIN: "Administrador",
    };
    return labels[type] || type;
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
        <div className="text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No se pudo cargar tu perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getUserTypeBadge(userData.userType)}`}>
            {getUserTypeLabel(userData.userType)}
          </span>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Cursos Comprados</p>
          <p className="text-3xl font-bold text-gray-900">{userData._count.purchases}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Personas Referidas</p>
          <p className="text-3xl font-bold text-gray-900">{userData._count.sponsored}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Miembro Desde</p>
          <p className="text-lg font-bold text-gray-900">
            {new Date(userData.createdAt).toLocaleDateString("es-ES", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Datos Personales */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Datos Personales</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✏️ Editar
            </button>
          )}
        </div>
        <div className="p-6">
          {!editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre Completo
                </label>
                <p className="text-lg text-gray-900">{userData.name || "Sin nombre"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{userData.email}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({ name: userData.name || "", email: userData.email || "" });
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información de Cuenta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Cuenta</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID de Usuario:</span>
            <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
              {userData.id}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tipo de Cuenta:</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getUserTypeBadge(userData.userType)}`}>
              {getUserTypeLabel(userData.userType)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha de Registro:</span>
            <span className="text-gray-900">
              {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

