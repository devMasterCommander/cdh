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
  Award,
  Users,
  Euro,
  CheckCircle,
  List,
  Network,
  Search,
  Eye,
  TrendingUp,
  Link2
} from "lucide-react";

type Affiliate = {
  id: string;
  name: string | null;
  email: string | null;
  userType: string;
  referralSlug: string | null;
  createdAt: string;
  _count: {
    sponsored: number;
    commissionsReceived: number;
  };
  metricas: {
    totalComisiones: number;
    comisionesAprobadas: number;
    comisionesPagadas: number;
    numeroComisiones: number;
    numeroAprobadas: number;
  };
};

export default function AfiliadosPage() {
  const [afiliados, setAfiliados] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");

  useEffect(() => {
    fetchAfiliados();
  }, []);

  const fetchAfiliados = async () => {
    try {
      const response = await fetch("/api/admin/afiliados");
      const data = await response.json();
      setAfiliados(data);
    } catch (error) {
      console.error("Error al cargar afiliados:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAfiliados = afiliados.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalComisionesAprobadas = afiliados.reduce(
    (sum, a) => sum + a.metricas.comisionesAprobadas,
    0
  );

  const totalComisionesPagadas = afiliados.reduce(
    (sum, a) => sum + a.metricas.comisionesPagadas,
    0
  );

  const totalReferidos = afiliados.reduce(
    (sum, a) => sum + a._count.sponsored,
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
            <Award className="h-7 w-7 text-primary" />
            <span>Sistema de Afiliados</span>
          </CardTitle>
          <CardDescription>
            Gestiona afiliados, comisiones y pagos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Afiliados Activos
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{afiliados.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Referidos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalReferidos}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comisiones Aprobadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalComisionesAprobadas.toFixed(2)}€
            </div>
            <p className="text-xs text-muted-foreground mt-1">Listas para pagar</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Comisiones Pagadas</p>
                <p className="text-2xl font-bold mt-2">
                  {totalComisionesPagadas.toFixed(2)}€
                </p>
              </div>
              <Euro className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-primary hover:bg-primary/90" : ""}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === "tree" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("tree")}
                className={viewMode === "tree" ? "bg-primary hover:bg-primary/90" : ""}
              >
                <Network className="h-4 w-4 mr-2" />
                Árbol
              </Button>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/afiliados/comisiones" className="flex items-center space-x-2">
                <Euro className="h-4 w-4" />
                <span>Gestionar Pagos</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Buscador */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar afiliado por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vista de Lista */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            {filteredAfiliados.length === 0 ? (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {searchTerm ? "No se encontraron afiliados" : "No hay afiliados registrados"}
                    </h2>
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Intenta con otro término de búsqueda"
                        : "Los afiliados aparecerán aquí cuando se aprueben"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Afiliado</TableHead>
                      <TableHead>Referidos</TableHead>
                      <TableHead>Comisiones Totales</TableHead>
                      <TableHead>Aprobadas</TableHead>
                      <TableHead>Pagadas</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAfiliados.map((afiliado, index) => (
                      <TableRow key={afiliado.id} className="hover:bg-muted/50">
                        <TableCell>
                          {index < 3 ? (
                            <span className="text-2xl">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <Badge variant="secondary">#{index + 1}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/usuarios/${afiliado.id}`}
                            className="text-sm font-medium text-primary hover:text-primary/80"
                          >
                            {afiliado.name || "Sin nombre"}
                          </Link>
                          <div className="text-xs text-muted-foreground">{afiliado.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                            <Users className="h-3 w-3" />
                            <span>{afiliado._count.sponsored}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Euro className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-foreground">
                              {afiliado.metricas.totalComisiones.toFixed(2)}€
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-semibold text-green-600">
                            {afiliado.metricas.comisionesAprobadas.toFixed(2)}€
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({afiliado.metricas.numeroAprobadas})
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-semibold text-primary">
                            {afiliado.metricas.comisionesPagadas.toFixed(2)}€
                          </div>
                        </TableCell>
                        <TableCell>
                          {afiliado.referralSlug ? (
                            <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                              <Link2 className="h-3 w-3" />
                              <code className="text-xs">/ref/{afiliado.referralSlug}</code>
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin slug</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/usuarios/${afiliado.id}`}>
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
      )}

      {/* Vista de Árbol (Próximamente) */}
      {viewMode === "tree" && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Network className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-cinzel font-bold text-foreground mb-2">
                  Vista de Árbol Multinivel
                </h3>
                <p className="text-muted-foreground mb-6">
                  Visualización del árbol de afiliados próximamente
                </p>
                <Button
                  onClick={() => setViewMode("list")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <List className="h-4 w-4 mr-2" />
                  Volver a Lista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

