"use client";

import { useState } from "react";
import Link from "next/link";

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
      <button
        onClick={handleBuy}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg disabled:bg-gray-400"
      >
        {isLoading ? 'Redirigiendo al pago...' : 'Comprar Ahora'}
      </button>
      
      {hasSession ? (
        <p className="text-sm text-gray-600 text-center">
          Comprarás con tu cuenta: {hasSession}
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 text-center">
            Puedes comprar sin crear cuenta (guest checkout)
          </p>
          <Link
            href="/api/auth/signin"
            className="block text-sm text-blue-600 hover:text-blue-800 text-center"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí →
          </Link>
        </div>
      )}
    </div>
  );
}

