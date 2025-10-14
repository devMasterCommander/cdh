"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Search,
  Eye,
  Euro,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  Filter
} from "lucide-react";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-cinzel flex items-center space-x-2">
            <CreditCard className="h-7 w-7 text-primary" />
            <span>Transacciones</span>
          </CardTitle>
          <CardDescription>
            Historial completo de compras y ventas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transacciones
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{transacciones.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold mt-2">{totalIngresosGeneral.toFixed(2)}€</p>
              </div>
              <Euro className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio por Venta
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transacciones.length > 0
                ? (totalIngresosGeneral / transacciones.length).toFixed(2)
                : "0.00"}
              €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterPeriod === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPeriod("all")}
              className={filterPeriod === "all" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Todas
            </Button>
            <Button
              variant={filterPeriod === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPeriod("today")}
              className={filterPeriod === "today" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Hoy
            </Button>
            <Button
              variant={filterPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPeriod("week")}
              className={filterPeriod === "week" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Últimos 7 días
            </Button>
            <Button
              variant={filterPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPeriod("month")}
              className={filterPeriod === "month" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Último mes
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por usuario o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resultados filtrados */}
      {filterPeriod !== "all" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                Mostrando {filteredTransacciones.length} transacciones • Ingresos: {totalIngresos.toFixed(2)}€
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {filteredTransacciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {searchTerm ? "No se encontraron transacciones" : "No hay transacciones registradas"}
                  </h2>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Intenta con otro término de búsqueda"
                      : "Las transacciones aparecerán aquí cuando se realicen compras"}
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
                    <TableHead>Curso</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransacciones.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Link
                          href={`/admin/usuarios/${t.user.id}`}
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          {t.user.name || "Sin nombre"}
                        </Link>
                        <div className="text-xs text-muted-foreground">{t.user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/cursos/${t.course.id}`}
                          className="text-sm text-primary hover:text-primary/80 flex items-center space-x-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>{t.course.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {t.course.price.toFixed(2)}€
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(t.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {t.stripePaymentIntentId.substring(0, 20)}...
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/transacciones/${t.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen */}
      {filteredTransacciones.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Mostrando {filteredTransacciones.length} de {transacciones.length} transacciones
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

