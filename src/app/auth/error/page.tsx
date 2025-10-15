"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const errorMessages: { [key: string]: { title: string; description: string } } = {
  Configuration: {
    title: "Error de Configuración",
    description: "Hay un problema con la configuración del servidor. Por favor, contacta al soporte.",
  },
  AccessDenied: {
    title: "Acceso Denegado",
    description: "No tienes permiso para acceder a este recurso.",
  },
  Verification: {
    title: "Error de Verificación",
    description: "El enlace de verificación ha expirado o ya fue usado. Por favor, solicita uno nuevo.",
  },
  Default: {
    title: "Error de Autenticación",
    description: "Ocurrió un error durante el proceso de inicio de sesión. Por favor, intenta de nuevo.",
  },
};

function AuthErrorPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Botón de retorno */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>

        {/* Card principal */}
        <Card className="border-destructive/50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-cinzel text-destructive">
              {errorInfo.title}
            </CardTitle>
            <CardDescription>
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error === "Verification" && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Los enlaces de inicio de sesión expiran después de un tiempo por seguridad. 
                  Solicita un nuevo enlace para continuar.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Intentar de nuevo
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  Volver al inicio
                </Link>
              </Button>
            </div>

            {error === "Configuration" && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Si el problema persiste,{" "}
                  <Link href="/contacto" className="text-primary hover:underline font-medium">
                    contacta con soporte
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        {error !== "Configuration" && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground text-center">
                ¿Necesitas ayuda?{" "}
                <Link href="/contacto" className="text-primary hover:underline font-medium">
                  Contáctanos
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <AuthErrorPageContent />
    </Suspense>
  );
}

