"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";

type BuyButtonProps = {
  courseId: string;
  hasSession: boolean;
};

export default function BuyButton({ courseId, hasSession }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        alert('Error al crear la sesión de pago');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error en el checkout:', error);
      alert('Error al procesar la compra');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleBuy}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Redirigiendo al pago...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Comprar Ahora
          </>
        )}
      </Button>
      
      {hasSession ? (
        <p className="text-sm text-muted-foreground text-center">
          Comprarás con tu cuenta actual
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Puedes comprar sin crear cuenta (guest checkout)
          </p>
          <Link
            href="/api/auth/signin"
            className="block text-sm text-primary hover:text-primary/80 text-center font-medium transition-colors"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí →
          </Link>
        </div>
      )}
    </div>
  );
}

