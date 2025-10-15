import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, Shield, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Banner Demo - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm font-medium">
              🎭 <strong>Usuario Demo disponible</strong> - Prueba el dashboard sin configuración
            </p>
            <Link 
              href="/demo-login"
              className="bg-white text-primary px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Login Demo →
            </Link>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-cinzel font-bold text-foreground">CDH</h1>
                <p className="text-sm text-muted-foreground font-courgette">Centro de Desarrollo Humano</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cursos">
                <Button variant="ghost">Cursos</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Iniciar Sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-1" />
              Plataforma de Aprendizaje Online
            </Badge>
            <h2 className="text-5xl font-cinzel font-bold text-foreground mb-6">
              Transforma tu vida a través del conocimiento
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Accede a cursos especializados, desarrolla nuevas habilidades y forma parte de nuestra 
              comunidad de aprendizaje continuo. Tu crecimiento personal y profesional comienza aquí.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cursos">
                <Button size="lg" className="w-full sm:w-auto">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explorar Cursos
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-cinzel font-bold text-foreground mb-4">
              ¿Por qué elegir CDH?
            </h3>
            <p className="text-lg text-muted-foreground">
              Ofrecemos una experiencia de aprendizaje única y completa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Cursos Especializados</CardTitle>
                <CardDescription>
                  Contenido de alta calidad diseñado por expertos en cada área
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Comunidad Activa</CardTitle>
                <CardDescription>
                  Conecta con otros estudiantes y comparte experiencias de aprendizaje
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Programa de Afiliados</CardTitle>
                <CardDescription>
                  Gana comisiones recomendando nuestros cursos a otros
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-cinzel font-bold text-foreground mb-4">
              ¿Listo para comenzar tu viaje de aprendizaje?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Únete a miles de estudiantes que ya están transformando sus vidas con CDH
            </p>
            <Link href="/cursos">
              <Button size="lg" className="w-full sm:w-auto">
                Ver Todos los Cursos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-foreground">CDH</p>
                <p className="text-xs text-muted-foreground font-courgette">Centro de Desarrollo Humano</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2024 CDH. Transformando vidas a través del conocimiento.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}