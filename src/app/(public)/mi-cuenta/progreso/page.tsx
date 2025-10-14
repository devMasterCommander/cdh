"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Calendar,
  Book,
  Target,
  Award,
  Timer
} from "lucide-react";

type ProgressStats = {
  overview: {
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    globalProgressPercentage: number;
    totalStudyTimeSeconds: number;
  };
  courses: {
    courseId: string;
    courseName: string;
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    isActive: boolean;
    isCompleted: boolean;
  }[];
  recentLessons: {
    lessonId: string;
    lessonName: string;
    moduleName: string;
    courseName: string;
    courseId: string;
    lastTimestamp: number;
    isCompleted: boolean;
    lastViewed: string;
  }[];
};

export default function ProgresoPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/progress-stats");
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "text-green-600";
    if (percentage >= 50) return "text-primary";
    if (percentage > 0) return "text-secondary";
    return "text-muted-foreground";
  };

  const getProgressBadge = (isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
    }
    if (isActive) {
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/20"><PlayCircle className="h-3 w-3 mr-1" />En progreso</Badge>;
    }
    return <Badge variant="secondary"><Target className="h-3 w-3 mr-1" />No iniciado</Badge>;
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
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No se pudieron cargar las estadísticas
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

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>Mi Progreso</span>
          </CardTitle>
          <CardDescription>
            Seguimiento detallado de tu aprendizaje y desarrollo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Progreso Global</p>
                <p className="text-3xl font-bold mt-2">{stats.overview.globalProgressPercentage}%</p>
                <p className="text-xs mt-1 opacity-75">
                  {stats.overview.completedLessons} de {stats.overview.totalLessons} lecciones
                </p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Activos
            </CardTitle>
            <PlayCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.overview.activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              En progreso actualmente
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Completados
            </CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.overview.completedCourses}</div>
            <p className="text-xs text-muted-foreground">
              Finalizados exitosamente
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tiempo de Estudio
            </CardTitle>
            <Timer className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatTime(stats.overview.totalStudyTimeSeconds)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Lecciones Vistas */}
      {stats.recentLessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Últimas Lecciones Vistas</span>
            </CardTitle>
            <CardDescription>
              Tu actividad de aprendizaje reciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentLessons.map((lesson) => (
                <Card key={lesson.lessonId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link
                      href={`/cursos/${lesson.courseId}/leccion/${lesson.lessonId}`}
                      className="flex items-start justify-between group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Book className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {lesson.lessonName}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {lesson.courseName} • {lesson.moduleName}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Visto {formatDate(lesson.lastViewed)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {lesson.isCompleted ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completada
                          </Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            En progreso
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progreso por Curso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Progreso por Curso</span>
          </CardTitle>
          <CardDescription>
            Detalle del avance en cada curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Aún no has comprado ningún curso
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Explora nuestro catálogo y comienza tu aprendizaje
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/cursos" className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Explorar Cursos</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.courses.map((course) => (
                <Card key={course.courseId} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-cinzel text-lg font-semibold text-foreground mb-1">{course.courseName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.completedLessons} de {course.totalLessons} lecciones completadas
                        </p>
                      </div>
                      <div className="ml-4">
                        {getProgressBadge(course.isCompleted, course.isActive)}
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className={`font-semibold ${getProgressColor(course.progressPercentage)}`}>
                          {course.progressPercentage}%
                        </span>
                      </div>
                      <Progress
                        value={course.progressPercentage}
                        className="h-2"
                      />
                    </div>

                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link
                        href={`/cursos/${course.courseId}`}
                        className="flex items-center justify-center space-x-2"
                      >
                        {course.isCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Revisar Curso</span>
                          </>
                        ) : course.isActive ? (
                          <>
                            <PlayCircle className="h-4 w-4" />
                            <span>Continuar Curso</span>
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4" />
                            <span>Comenzar Curso</span>
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

