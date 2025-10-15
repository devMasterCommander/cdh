"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock, CheckCircle } from "lucide-react";

export default function DemoTestPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("test-oswald4993@yopmail.com");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      // Crear sesión directamente
      const response = await fetch("/api/demo/create-test-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Establecer cookie de sesión (NextAuth usa diferentes nombres según el protocolo)
        const cookieName = window.location.protocol === 'https:' 
          ? '__Secure-next-auth.session-token' 
          : 'next-auth.session-token';
        
        const maxAge = 30 * 24 * 60 * 60; // 30 días
        document.cookie = `${cookieName}=${data.sessionToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        
        // Forzar recarga completa para que NextAuth detecte la sesión
        window.location.href = "/mi-cuenta";
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al iniciar sesión");
        setLoading(false);
      }
    } catch (error) {
      // Error en la autenticación demo
      alert("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card principal */}
        <Card className="overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-cinzel font-bold mb-2">Login Demo - Test</h1>
            <p className="text-sm opacity-90">
              Acceso rápido para pruebas
            </p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de Prueba</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">Usuario de Prueba</p>
                  <p className="text-muted-foreground text-xs">
                    Este usuario tiene un curso comprado para probar el reproductor de video y el progreso.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading || !email}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Acceder como Usuario de Prueba
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Solo para desarrollo y pruebas. No usar en producción.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Email:</strong> test-oswald4993@yopmail.com</p>
              <p><strong>Estado:</strong> Cliente con curso comprado</p>
              <p><strong>Propósito:</strong> Probar reproductor de video y progreso</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

