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
  Users,
  Plus,
  Search,
  Eye,
  ShoppingCart,
  BookOpen,
  Award,
  Calendar,
  User,
  UserCheck
} from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  sponsor: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  _count: {
    purchases: number;
    lessonProgress: number;
    sponsored: number;
  };
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "with-purchases" | "affiliates">("all");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/admin/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "with-purchases") {
      return matchesSearch && usuario._count.purchases > 0;
    }
    if (filterType === "affiliates") {
      return matchesSearch && usuario._count.sponsored > 0;
    }
    return matchesSearch;
  });

  const stats = {
    total: usuarios.length,
    withPurchases: usuarios.filter((u) => u._count.purchases > 0).length,
    affiliates: usuarios.filter((u) => u._count.sponsored > 0).length,
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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-cinzel flex items-center space-x-2">
                <Users className="h-7 w-7 text-primary" />
                <span>Usuarios</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Gestiona todos los usuarios de la plataforma
              </CardDescription>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/usuarios/create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Crear Usuario</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Con Compras
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.withPurchases}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Afiliados Activos
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.affiliates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className={filterType === "all" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Todos ({stats.total})
            </Button>
            <Button
              variant={filterType === "with-purchases" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("with-purchases")}
              className={filterType === "with-purchases" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Con Compras ({stats.withPurchases})
            </Button>
            <Button
              variant={filterType === "affiliates" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("affiliates")}
              className={filterType === "affiliates" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Afiliados ({stats.affiliates})
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent className="p-0">
          {filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                  </h2>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Intenta con otro término de búsqueda"
                      : "Los usuarios aparecerán aquí cuando se registren"}
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
                    <TableHead>Compras</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Referidos</TableHead>
                    <TableHead>Patrocinador</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {usuario.name || "Sin nombre"}
                            </div>
                            <div className="text-xs text-muted-foreground">{usuario.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center space-x-1 w-fit">
                          <ShoppingCart className="h-3 w-3" />
                          <span>{usuario._count.purchases}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center space-x-1 w-fit">
                          <BookOpen className="h-3 w-3" />
                          <span>{usuario._count.lessonProgress}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                          <Award className="h-3 w-3" />
                          <span>{usuario._count.sponsored}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {usuario.sponsor ? (
                          <div className="flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">
                              {usuario.sponsor.name || usuario.sponsor.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin patrocinador</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(usuario.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/usuarios/${usuario.id}`}>
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
      {filteredUsuarios.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

