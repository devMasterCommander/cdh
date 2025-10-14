import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function VerifyRequestPage() {
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
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-cinzel">Revisa tu Email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace de inicio de sesión
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Enlace enviado exitosamente
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Haz clic en el enlace del email para iniciar sesión en CDH
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                ¿No ves el email?
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Verifica que el email sea correcto</li>
                <li>El enlace puede tardar unos minutos en llegar</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/signin">
                  Intentar con otro email
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de ayuda */}
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
      </div>
    </div>
  );
}

