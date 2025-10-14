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
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Layers,
  ShoppingCart,
  Calendar,
  Euro
} from "lucide-react";

type Course = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  _count: {
    modules: number;
    purchases: number;
  };
};

export default function CursosPage() {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/admin/cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el curso "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Curso eliminado correctamente");
        fetchCursos();
      } else {
        const data = await response.json();
        alert(data.error || "Error al eliminar el curso");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el curso");
    }
  };

  const filteredCursos = cursos.filter((curso) =>
    curso.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-cinzel flex items-center space-x-2">
                <BookOpen className="h-7 w-7 text-primary" />
                <span>Cursos</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Gestiona todos los cursos de la plataforma
              </CardDescription>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/cursos/create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Crear Curso</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Buscador */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar cursos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de cursos */}
      <Card>
        <CardContent className="p-0">
          {filteredCursos.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {searchTerm ? "No se encontraron cursos" : "No hay cursos creados"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm
                      ? "Intenta con otro término de búsqueda"
                      : "Crea tu primer curso para comenzar"}
                  </p>
                  {!searchTerm && (
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/admin/cursos/create" className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Crear Primer Curso</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Módulos</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCursos.map((curso) => (
                    <TableRow key={curso.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {curso.name}
                            </div>
                            <div className="text-xs text-muted-foreground">ID: {curso.id.slice(0, 12)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Euro className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            {curso.price.toFixed(2)}€
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                          <Layers className="h-3 w-3" />
                          <span>{curso._count.modules}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center space-x-1 w-fit">
                          <ShoppingCart className="h-3 w-3" />
                          <span>{curso._count.purchases}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(curso.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/cursos/${curso.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/cursos/${curso.id}/edit`}>
                              <Edit className="h-4 w-4 text-primary" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(curso.id, curso.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
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

