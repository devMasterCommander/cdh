"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Euro,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CheckCircle2,
  User,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Info
} from "lucide-react";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "IN_REVIEW":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><AlertCircle className="h-3 w-3 mr-1" />En Revisión</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobada</Badge>;
      case "DECLINED":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Declinada</Badge>;
      case "PAID":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20"><CheckCircle className="h-3 w-3 mr-1" />Pagada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/afiliados" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Afiliados
          </Link>
        </Button>
        
        <Card>
          <CardHeader>
          <CardTitle className="text-3xl font-cinzel flex items-center space-x-2">
            <Euro className="h-7 w-7 text-primary" />
            <span>Gestión de Comisiones</span>
          </CardTitle>
            <CardDescription>
              Administra estados y procesa pagos de comisiones
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Estadísticas por Estado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Pendientes</p>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">
              {montoByStatus.PENDING.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground">{byStatus.PENDING.length} comisiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">En Revisión</p>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-blue-600">
              {montoByStatus.IN_REVIEW.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground">{byStatus.IN_REVIEW.length} comisiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Aprobadas</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xl font-bold text-green-600">
              {montoByStatus.APPROVED.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground">{byStatus.APPROVED.length} comisiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Declinadas</p>
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-xl font-bold text-destructive">
              {montoByStatus.DECLINED.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground">{byStatus.DECLINED.length} comisiones</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs opacity-90 font-medium">Pagadas</p>
              <CheckCircle className="h-4 w-4 opacity-80" />
            </div>
            <p className="text-xl font-bold">
              {montoByStatus.PAID.toFixed(2)}€
            </p>
            <p className="text-xs opacity-75">{byStatus.PAID.length} comisiones</p>
          </div>
        </Card>
      </div>

      {/* Formulario de Pago */}
      {selectedCommissions.length > 0 && filterStatus === "APPROVED" && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-green-900">
                  <Euro className="h-5 w-5" />
                  <span>Procesar Pago de Comisiones</span>
                </CardTitle>
                <CardDescription className="text-green-700">
                  {selectedCommissions.length} comisión(es) seleccionada(s) • Total: {montoSeleccionado.toFixed(2)}€
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCommissions([]);
                  setShowPaymentForm(false);
                }}
                className="text-green-700 hover:text-green-900"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!showPaymentForm ? (
              <Button
                onClick={() => setShowPaymentForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Continuar con el Pago
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pago *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Seleccionar método..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                      <SelectItem value="PAYPAL">PayPal</SelectItem>
                      <SelectItem value="STRIPE">Stripe</SelectItem>
                      <SelectItem value="CRYPTO">Criptomonedas</SelectItem>
                      <SelectItem value="CASH">Efectivo</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentNotes">Notas (opcional)</Label>
                  <Textarea
                    id="paymentNotes"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Ej: Transferencia #12345, Referencia: ABC123"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleProcessPayment}
                    disabled={processing || !paymentMethod}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? "Procesando..." : `Registrar Pago de ${montoSeleccionado.toFixed(2)}€`}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtros por Estado */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("all"); setSelectedCommissions([]); }}
              className={filterStatus === "all" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Todas ({comisiones.length})
            </Button>
            <Button
              variant={filterStatus === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("PENDING"); setSelectedCommissions([]); }}
              className={filterStatus === "PENDING" ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Clock className="h-3 w-3 mr-1" />
              Pendientes ({byStatus.PENDING.length})
            </Button>
            <Button
              variant={filterStatus === "IN_REVIEW" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("IN_REVIEW"); setSelectedCommissions([]); }}
              className={filterStatus === "IN_REVIEW" ? "bg-primary hover:bg-primary/90" : ""}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              En Revisión ({byStatus.IN_REVIEW.length})
            </Button>
            <Button
              variant={filterStatus === "APPROVED" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("APPROVED"); setSelectedCommissions([]); }}
              className={filterStatus === "APPROVED" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Aprobadas ({byStatus.APPROVED.length})
            </Button>
            <Button
              variant={filterStatus === "DECLINED" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("DECLINED"); setSelectedCommissions([]); }}
              className={filterStatus === "DECLINED" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Declinadas ({byStatus.DECLINED.length})
            </Button>
            <Button
              variant={filterStatus === "PAID" ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilterStatus("PAID"); setSelectedCommissions([]); }}
              className={filterStatus === "PAID" ? "bg-primary hover:bg-primary/90" : ""}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Pagadas ({byStatus.PAID.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla agrupada por Afiliado */}
      <div className="space-y-4">
        {Object.values(agrupadoPorAfiliado).map((group: any) => {
          const totalAfiliado = group.comisiones.reduce((sum: number, c: Commission) => sum + c.amount, 0);
          const canSelect = group.comisiones.every((c: Commission) => c.status === "APPROVED");
          const allSelected = group.comisiones.every((c: Commission) => selectedCommissions.includes(c.id));

          return (
            <Card key={group.affiliate.id}>
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <Link
                        href={`/admin/usuarios/${group.affiliate.id}`}
                        className="text-lg font-bold text-primary hover:text-primary/80"
                      >
                        {group.affiliate.name || group.affiliate.email}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {group.comisiones.length} comisión(es) • {totalAfiliado.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                  {canSelect && filterStatus === "APPROVED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllFromAffiliate(group.affiliate.id)}
                    >
                      {allSelected ? "Deseleccionar todas" : "Seleccionar todas"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {filterStatus === "APPROVED" && (
                        <TableHead className="w-12"></TableHead>
                      )}
                      <TableHead>Comprador</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      {filterStatus !== "PAID" && filterStatus !== "DECLINED" && (
                        <TableHead className="text-right">Acciones</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.comisiones.map((comision: Commission) => (
                      <TableRow key={comision.id} className="hover:bg-muted/50">
                        {filterStatus === "APPROVED" && (
                          <TableCell>
                            <Checkbox
                              checked={selectedCommissions.includes(comision.id)}
                              onCheckedChange={() => handleSelectCommission(comision.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">
                              {comision.buyer.name || comision.buyer.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{comision.course.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Nivel {comision.level}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {comision.amount.toFixed(2)}€
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(comision.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(comision.createdAt).toLocaleDateString("es-ES")}</span>
                          </div>
                        </TableCell>
                        {filterStatus !== "PAID" && filterStatus !== "DECLINED" && (
                          <TableCell className="text-right">
                            <Select
                              value={comision.status}
                              onValueChange={(value) => handleChangeStatus(comision.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pendiente</SelectItem>
                                <SelectItem value="IN_REVIEW">En Revisión</SelectItem>
                                <SelectItem value="APPROVED">Aprobar</SelectItem>
                                <SelectItem value="DECLINED">Declinar</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}

        {filteredComisiones.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Euro className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    No hay comisiones con este estado
                  </h2>
                  <p className="text-muted-foreground">
                    No hay comisiones con estado "{getStatusLabel(filterStatus)}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Información sobre estados */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Info className="h-4 w-4 text-primary" />
            <span>Estados de Comisión</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-foreground space-y-2">
            <li className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Pendiente:</strong> Generada automáticamente al comprar</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span><strong>En Revisión:</strong> Bajo auditoría (subtotal se muestra pero no suma ni resta)</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>Aprobada:</strong> Cumple condiciones, lista para pagar (suma)</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <span><strong>Declinada:</strong> No cumple condiciones (no suma)</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong>Pagada:</strong> Ya pagada al afiliado</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
