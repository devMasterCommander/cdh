"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Layers, 
  Play, 
  CheckCircle, 
  ArrowLeft,
  User,
  ShoppingCart
} from "lucide-react";

type Course = {
  id: string;
  name: string;
  price: number;
  modules: number;
  lessons: number;
  isPurchased?: boolean;
};

export default function CursosPage() {
  const { data: session } = useSession();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, [session]);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/admin/cursos");
      if (response.ok) {
        const data = await response.json();
        
        // Si hay sesión, verificar cuáles ya compró
        let purchasedCourseIds: string[] = [];
        if (session?.user?.id) {
          const purchasesRes = await fetch("/api/my-courses");
          if (purchasesRes.ok) {
            const purchases = await purchasesRes.json();
            purchasedCourseIds = purchases.map((p: any) => p.course.id);
          }
        }

        const cursosFormateados = data.map((curso: any) => ({
          id: curso.id,
          name: curso.name,
          price: curso.price,
          modules: curso._count.modules,
          lessons: curso.modules?.reduce(
            (total: number, mod: any) => total + (mod.lessons?.length || 0),
            0
          ) || 0,
          isPurchased: purchasedCourseIds.includes(curso.id),
        }));

        setCursos(cursosFormateados);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
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
    <div className="min-h-screen bg-background">
      {/* Barra de Navegación */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Inicio</span>
                </Link>
              </Button>
              {session && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/mi-cuenta" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Mi Cuenta</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {session && (
                <Button size="sm" asChild>
                  <Link href="/mi-cuenta/mis-cursos" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Mis Cursos
                  </Link>
                </Button>
              )}
              {!session && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/api/auth/signin">
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Descubre todos nuestros cursos de desarrollo humano
          </p>
        </div>

        {/* Links de navegación */}
        <div className="mb-6 md:mb-8 flex justify-center gap-4">
          {session && (
            <Button asChild>
              <Link href="/mi-cuenta/mis-cursos" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Mis Cursos
              </Link>
            </Button>
          )}
          {!session && (
            <Button variant="secondary" asChild>
              <Link href="/api/auth/signin" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          )}
        </div>

        {/* Grid de cursos */}
        {cursos.length === 0 ? (
          <Card className="text-center p-8 md:p-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    No hay cursos disponibles
                  </h2>
                  <p className="text-muted-foreground">
                    Pronto agregaremos nuevos cursos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cursos.map((curso) => (
              <Card key={curso.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-cinzel text-foreground mb-1">
                        {curso.name}
                      </CardTitle>
                      {curso.isPurchased && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ya adquirido
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Información del curso */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {curso.modules} módulos
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">
                        {curso.lessons} lecciones
                      </span>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {curso.price.toFixed(2)}€
                        </p>
                        <p className="text-xs text-muted-foreground">Pago único</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón */}
                  <Button asChild className="w-full">
                    <Link 
                      href={`/cursos/${curso.id}`}
                      className="flex items-center justify-center gap-2"
                      variant={curso.isPurchased ? "default" : "outline"}
                    >
                      {curso.isPurchased ? (
                        <>
                          <Play className="h-4 w-4" />
                          Acceder al Curso
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Ver Detalles
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

