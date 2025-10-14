"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AffiliateStats = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    userType: string;
    isAffiliate: boolean;
    affiliateRequestStatus: string;
    referralSlug: string | null;
    referralUrl: string | null;
  };
  overview: {
    totalReferrals: number;
    totalCommissionsGenerated: number;
    totalCommissionsCount: number;
  };
  commissions: {
    pending: { amount: number; count: number };
    inReview: { amount: number; count: number };
    approved: { amount: number; count: number };
    paid: { amount: number; count: number };
    declined: { amount: number; count: number };
  };
  referrals: {
    id: string;
    name: string | null;
    email: string | null;
    userType: string;
    joinedAt: string;
    totalPurchases: number;
  }[];
  recentCommissions: {
    id: string;
    amount: number;
    level: number;
    status: string;
    createdAt: string;
    buyer: {
      id: string;
      name: string | null;
      email: string | null;
    };
    course: {
      id: string;
      name: string;
    };
  }[];
};

export default function AfiliadoPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/affiliate-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (stats?.user.referralUrl) {
      try {
        await navigator.clipboard.writeText(stats.user.referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error al copiar:", err);
      }
    }
  };

  const requestAffiliate = async () => {
    setRequesting(true);
    try {
      const response = await fetch("/api/user/request-affiliate", {
        method: "POST",
      });

      if (response.ok) {
        alert("Solicitud enviada correctamente. Te notificaremos cuando sea aprobada.");
        fetchStats(); // Recargar datos
      } else {
        const data = await response.json();
        alert(data.error || "Error al enviar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar la solicitud");
    } finally {
      setRequesting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      NONE: "No solicitado",
      PENDING: "Pendiente de aprobación",
      APPROVED: "Aprobado",
      REJECTED: "Rechazado",
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_REVIEW: "bg-blue-100 text-blue-800",
      APPROVED: "bg-green-100 text-green-800",
      PAID: "bg-purple-100 text-purple-800",
      DECLINED: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando información de afiliado...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No se pudo cargar la información</p>
      </div>
    );
  }

  // Si NO es afiliado, mostrar opción de solicitud
  if (!stats.user.isAffiliate) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programa de Afiliados</h1>
          <p className="text-gray-600">Gana comisiones por referir nuevos usuarios</p>
        </div>

        {/* Estado de Solicitud */}
        {stats.user.affiliateRequestStatus === "PENDING" ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-2">Solicitud Pendiente</h2>
            <p className="text-yellow-800">
              Tu solicitud para ser afiliado está siendo revisada. Te notificaremos cuando sea aprobada.
            </p>
          </div>
        ) : stats.user.affiliateRequestStatus === "REJECTED" ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Solicitud Rechazada</h2>
            <p className="text-red-800">
              Tu solicitud para ser afiliado fue rechazada. Por favor, contacta con soporte para más información.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">¿Quieres ser Afiliado?</h2>
            <p className="mb-6 opacity-90">
              Únete a nuestro programa de afiliados y gana comisiones por cada persona que refiera y realice una compra.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Comisiones por múltiples niveles
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> URL personalizada para compartir
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Panel de estadísticas en tiempo real
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Pagos mensuales
              </li>
            </ul>
            <button
              onClick={requestAffiliate}
              disabled={requesting}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-300"
            >
              {requesting ? "Enviando..." : "Solicitar ser Afiliado"}
            </button>
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Beneficios del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💰 Comisiones Generosas</h3>
              <p className="text-sm text-gray-600">
                Gana hasta un 10% de comisión por cada venta generada a través de tu enlace.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Panel de Control</h3>
              <p className="text-sm text-gray-600">
                Accede a estadísticas detalladas de tus referidos y comisiones en tiempo real.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔗 URL Personalizada</h3>
              <p className="text-sm text-gray-600">
                Obtén un enlace único y fácil de compartir en redes sociales y otros canales.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💸 Pagos Puntuales</h3>
              <p className="text-sm text-gray-600">
                Recibe tus comisiones mensualmente a través del método de pago de tu preferencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si ES afiliado, mostrar dashboard completo
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Panel de Afiliado</h1>
        <p className="opacity-90">Gestiona tus referidos y comisiones</p>
      </div>

      {/* URL de Referido */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tu Enlace de Referido</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={stats.user.referralUrl || "No disponible"}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          />
          <button
            onClick={copyToClipboard}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Comparte este enlace y gana comisiones por cada compra realizada
        </p>
      </div>

      {/* Métricas de Comisiones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {formatCurrency(stats.commissions.pending.amount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{stats.commissions.pending.count} comisiones</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Aprobadas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(stats.commissions.approved.amount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{stats.commissions.approved.count} comisiones</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Comisiones Pagadas</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {formatCurrency(stats.commissions.paid.amount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{stats.commissions.paid.count} comisiones</p>
        </div>
      </div>

      {/* Resumen General */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600">Total Referidos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overview.totalReferrals}</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600">Total Comisiones Generadas</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.overview.totalCommissionsGenerated)}
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">Número de Comisiones</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overview.totalCommissionsCount}</p>
          </div>
        </div>
      </div>

      {/* Referidos Directos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Mis Referidos</h2>
        </div>
        <div className="p-6">
          {stats.referrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aún no has referido a ningún usuario</p>
              <p className="text-sm text-gray-400 mt-2">Comparte tu enlace para comenzar a ganar comisiones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Compras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{referral.name || "Sin nombre"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{referral.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          referral.userType === "CUSTOMER" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {referral.userType === "CUSTOMER" ? "Cliente" : "Invitado"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(referral.joinedAt)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{referral.totalPurchases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Comisiones */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Historial de Comisiones</h2>
        </div>
        <div className="p-6">
          {stats.recentCommissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes comisiones registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Comprador</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Curso</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nivel</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Monto</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(commission.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{commission.buyer.name || "Sin nombre"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{commission.course.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Nivel {commission.level}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatCurrency(commission.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(commission.status)}`}>
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

