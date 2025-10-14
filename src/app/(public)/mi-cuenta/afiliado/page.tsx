"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  Users,
  Euro,
  Copy,
  CheckCircle,
  Clock,
  TrendingUp,
  Share2,
  Target,
  Calendar,
  User,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PauseCircle
} from "lucide-react";

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
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "IN_REVIEW":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><AlertCircle className="h-3 w-3 mr-1" />En revisión</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case "PAID":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20"><CheckCircle className="h-3 w-3 mr-1" />Pagado</Badge>;
      case "DECLINED":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="secondary"><PauseCircle className="h-3 w-3 mr-1" />Desconocido</Badge>;
    }
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
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <div className="space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
              <Award className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No se pudo cargar la información
              </h2>
              <p className="text-muted-foreground">
                Intenta recargar la página o contacta con soporte
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si NO es afiliado, mostrar opción de solicitud
  if (!stats.user.isAffiliate) {
    return (
      <div className="space-y-6 fade-in">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-primary" />
              <span>Programa de Afiliados</span>
            </CardTitle>
            <CardDescription>
              Gana comisiones por referir nuevos usuarios a nuestra plataforma
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Estado de Solicitud */}
        {stats.user.affiliateRequestStatus === "PENDING" ? (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-900">
                <Clock className="h-5 w-5" />
                <span>Solicitud Pendiente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800">
                Tu solicitud para ser afiliado está siendo revisada. Te notificaremos cuando sea aprobada.
              </p>
            </CardContent>
          </Card>
        ) : stats.user.affiliateRequestStatus === "REJECTED" ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-900">
                <XCircle className="h-5 w-5" />
                <span>Solicitud Rechazada</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">
                Tu solicitud para ser afiliado fue rechazada. Por favor, contacta con soporte para más información.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-cinzel font-bold">¿Quieres ser Afiliado?</h2>
                <Award className="h-8 w-8 opacity-80" />
              </div>
              <p className="mb-6 opacity-90">
                Únete a nuestro programa de afiliados y gana comisiones por cada persona que refiera y realice una compra.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Comisiones por múltiples niveles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  URL personalizada para compartir
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Panel de estadísticas en tiempo real
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pagos mensuales
                </li>
              </ul>
              <Button
                onClick={requestAffiliate}
                disabled={requesting}
                className="bg-white text-primary hover:bg-gray-100"
              >
                {requesting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Solicitar ser Afiliado
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Beneficios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Beneficios del Programa</span>
            </CardTitle>
            <CardDescription>
              Descubre todas las ventajas de ser parte de nuestro programa de afiliados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Euro className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Comisiones Generosas</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gana hasta un 10% de comisión por cada venta generada a través de tu enlace.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold text-foreground">Panel de Control</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accede a estadísticas detalladas de tus referidos y comisiones en tiempo real.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">URL Personalizada</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Obtén un enlace único y fácil de compartir en redes sociales y otros canales.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-foreground">Pagos Puntuales</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recibe tus comisiones mensualmente a través del método de pago de tu preferencia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si ES afiliado, mostrar dashboard completo
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-cinzel font-bold mb-2">Panel de Afiliado</h1>
              <p className="opacity-90">Gestiona tus referidos y comisiones</p>
            </div>
            <Award className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </Card>

      {/* URL de Referido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span>Tu Enlace de Referido</span>
          </CardTitle>
          <CardDescription>
            Comparte este enlace y gana comisiones por cada compra realizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={stats.user.referralUrl || "No disponible"}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-primary hover:bg-primary/90"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Comisiones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comisiones Pendientes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.commissions.pending.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.commissions.pending.count} comisiones
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comisiones Aprobadas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.commissions.approved.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.commissions.approved.count} comisiones
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comisiones Pagadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.commissions.paid.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.commissions.paid.count} comisiones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Resumen General</span>
          </CardTitle>
          <CardDescription>
            Estadísticas generales de tu programa de afiliados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="border-l-4 border-primary pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Total Referidos</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.overview.totalReferrals}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <Euro className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Total Comisiones Generadas</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.overview.totalCommissionsGenerated)}
              </p>
            </div>
            <div className="border-l-4 border-secondary pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <Award className="h-4 w-4 text-secondary" />
                <p className="text-sm text-muted-foreground">Número de Comisiones</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.overview.totalCommissionsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referidos Directos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Mis Referidos</span>
          </CardTitle>
          <CardDescription>
            Lista de usuarios que se registraron a través de tu enlace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.referrals.length === 0 ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Aún no has referido a ningún usuario
                  </h2>
                  <p className="text-muted-foreground">
                    Comparte tu enlace para comenzar a ganar comisiones
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Compras</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.referrals.map((referral) => (
                    <TableRow key={referral.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{referral.name || "Sin nombre"}</TableCell>
                      <TableCell>{referral.email}</TableCell>
                      <TableCell>
                        <Badge variant={referral.userType === "CUSTOMER" ? "default" : "secondary"}>
                          {referral.userType === "CUSTOMER" ? "Cliente" : "Invitado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(referral.joinedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{referral.totalPurchases}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Comisiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Euro className="h-5 w-5 text-primary" />
            <span>Historial de Comisiones</span>
          </CardTitle>
          <CardDescription>
            Registro detallado de todas tus comisiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentCommissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Euro className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    No tienes comisiones registradas
                  </h2>
                  <p className="text-muted-foreground">
                    Las comisiones aparecerán aquí cuando tus referidos realicen compras
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentCommissions.map((commission) => (
                    <TableRow key={commission.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(commission.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{commission.buyer.name || "Sin nombre"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>{commission.course.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>Nivel {commission.level}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatCurrency(commission.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

