"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BuyButton from "./BuyButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  CheckCircle,
  ArrowLeft,
  PlayCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  DollarSign,
  Clock,
  Award
} from "lucide-react";

type CourseDetailProps = {
  course: any;
  hasPurchased: boolean;
  hasSession: boolean;
};

export default function CourseDetail({ course, hasPurchased, hasSession }: CourseDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => {
        router.replace(`/cursos/${course.id}`);
      }, 5000);
    }
    
    if (canceled === 'true') {
      setShowCanceled(true);
      setTimeout(() => {
        setShowCanceled(false);
        router.replace(`/cursos/${course.id}`);
      }, 5000);
    }
  }, [searchParams, router, course.id]);

  const totalLessons = course.modules.reduce(
    (total: number, module: any) => total + module.lessons.length,
    0
  );

  // Si ya compró, mostrar contenido
  if (hasPurchased) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {/* Mensaje de éxito */}
          {showSuccess && (
            <Card className="border-green-200 bg-green-50 mb-6 animate-pulse">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-cinzel font-bold text-green-900 mb-2">
                  ¡Compra Exitosa!
                </h2>
                <p className="text-green-700">
                  Ahora tienes acceso completo al curso
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navegación */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mi-cuenta/mis-cursos" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Mis Cursos
              </Link>
            </Button>
          </div>

          {/* Header del curso */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Curso Adquirido
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-cinzel font-bold mb-3">{course.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4" />
                  <span>{course.modules.length} módulos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lecciones</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Módulos y lecciones */}
          <div className="space-y-4 md:space-y-6">
            {course.modules.map((module: any, moduleIndex: number) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl font-cinzel text-foreground">
                        {module.order}. {module.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {module.lessons.length} lecciones en este módulo
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      <Layers className="h-3 w-3 mr-1" />
                      Módulo {moduleIndex + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    {module.lessons.map((lesson: any) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/cursos/${course.id}/leccion/${lesson.id}`}
                          className="flex items-center p-4 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {lesson.order}
                          </div>
                          <span className="text-foreground flex-1 group-hover:text-primary transition-colors">
                            {lesson.name}
                          </span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si NO compró, página de ventas
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Mensaje de cancelación */}
        {showCanceled && (
          <Card className="border-yellow-200 bg-yellow-50 mb-6">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-cinzel font-bold text-yellow-900 mb-2">
                Pago Cancelado
              </h2>
              <p className="text-yellow-700">
                No se realizó ningún cargo. Puedes intentarlo cuando quieras.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navegación */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cursos" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>
        </div>

        {/* Header del curso */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-primary-foreground">
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold mb-3">
              {course.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4" />
                <span>{course.modules.length} módulos</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{totalLessons} lecciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Acceso de por vida</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido del curso */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Contenido del Curso</span>
                </CardTitle>
                <CardDescription>
                  Todo lo que aprenderás en este curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module: any, moduleIndex: number) => (
                    <Card key={module.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-cinzel text-foreground">
                              {module.order}. {module.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {module.lessons.length} lecciones
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            Módulo {moduleIndex + 1}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {module.lessons.map((lesson: any) => (
                            <li key={lesson.id} className="flex items-start space-x-2 text-sm text-muted-foreground">
                              <PlayCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{lesson.name}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Precio y compra */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Adquiere este curso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Layers className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{course.modules.length}</p>
                    <p className="text-xs text-muted-foreground">Módulos</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <BookOpen className="h-6 w-6 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lecciones</p>
                  </div>
                </div>

                {/* Precio */}
                <div className="border-t border-border pt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Precio del curso</p>
                    <div className="flex items-baseline justify-center space-x-2">
                      <DollarSign className="h-6 w-6 text-primary" />
                      <p className="text-5xl font-bold text-primary">
                        {course.price.toFixed(2)}
                      </p>
                      <span className="text-2xl text-muted-foreground">€</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Pago único • Acceso de por vida
                    </p>
                  </div>

                  <BuyButton courseId={course.id} hasSession={hasSession} />
                </div>

                {/* Beneficios */}
                <div className="border-t border-border pt-6 space-y-3">
                  <p className="font-semibold text-sm text-foreground">Este curso incluye:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Acceso de por vida</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Contenido actualizado</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Certificado de finalización</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Soporte dedicado</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

