"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Calendar, 
  Layers, 
  Book,
  ShoppingCart,
  TrendingUp
} from "lucide-react";

type Course = {
  id: string;
  createdAt: string;
  course: {
    id: string;
    name: string;
    price: number;
    modules: Array<{
      id: string;
      name: string;
      order: number;
      lessons: Array<{
        id: string;
        name: string;
        order: number;
      }>;
    }>;
  };
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
};

export default function MisCursosPage() {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/my-courses");
      if (response.ok) {
        const data = await response.json();
        setCursos(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseStatus = (percentage: number) => {
    if (percentage === 0) return { label: "No iniciado", variant: "secondary" as const };
    if (percentage === 100) return { label: "Completado", variant: "default" as const };
    return { label: "En progreso", variant: "default" as const };
  };

  const getActionButtonText = (percentage: number) => {
    if (percentage === 0) return "Comenzar Curso";
    if (percentage === 100) return "Revisar Curso";
    return "Continuar Curso";
  };

  const getActionButtonIcon = (percentage: number) => {
    if (percentage === 0) return Play;
    if (percentage === 100) return CheckCircle;
    return TrendingUp;
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
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-cdh-primary" />
            <span>Mis Cursos</span>
          </CardTitle>
          <CardDescription>
            Accede a todos los cursos que has adquirido y continúa tu aprendizaje
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      {cursos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cursos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-cdh-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cdh-accent">{cursos.length}</div>
              <p className="text-xs text-muted-foreground">
                Cursos adquiridos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progreso Promedio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cdh-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cdh-accent">
                {Math.round(cursos.reduce((acc, curso) => acc + curso.progress.percentage, 0) / cursos.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Completado en promedio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cursos Completados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cdh-accent">
                {cursos.filter(curso => curso.progress.percentage === 100).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Finalizados exitosamente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cursos */}
      {cursos.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cdh-primary to-cdh-secondary rounded-full mx-auto flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-cinzel text-cdh-accent mb-2">
                  Aún no has comprado ningún curso
                </h2>
                <p className="text-muted-foreground mb-6 font-courgette">
                  Explora nuestro catálogo y comienza tu aprendizaje
                </p>
                <Button asChild className="bg-cdh-primary hover:bg-cdh-primary-dark">
                  <Link href="/cursos" className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Ver Cursos Disponibles</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursos.map((purchase) => {
            const status = getCourseStatus(purchase.progress.percentage);
            const ActionIcon = getActionButtonIcon(purchase.progress.percentage);
            
            return (
              <Card key={purchase.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-cinzel text-cdh-accent mb-1">
                        {purchase.course.name}
                      </CardTitle>
                      <Badge variant={status.variant} className="w-fit">
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progreso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-semibold text-cdh-accent">{purchase.progress.percentage}%</span>
                    </div>
                    <Progress 
                      value={purchase.progress.percentage} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {purchase.progress.completed} de {purchase.progress.total} lecciones completadas
                    </p>
                  </div>

                  {/* Información del curso */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-cdh-primary" />
                      <span className="text-muted-foreground">
                        {purchase.course.modules.length} módulos
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-cdh-secondary" />
                      <span className="text-muted-foreground">
                        {purchase.progress.total} lecciones
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Comprado el {new Date(purchase.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Botón de acceso */}
                  <Button asChild className="w-full bg-cdh-primary hover:bg-cdh-primary-dark">
                    <Link 
                      href={`/cursos/${purchase.course.id}`}
                      className="flex items-center justify-center space-x-2"
                    >
                      <ActionIcon className="h-4 w-4" />
                      <span>{getActionButtonText(purchase.progress.percentage)}</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

