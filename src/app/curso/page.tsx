// src/app/curso/page.tsx
"use client"; // Directiva para convertirlo en un Componente de Cliente

import { useState } from 'react';

export default function CoursePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
      });
      const { url } = await response.json();
      if (url) {
        // Redirigir al usuario a la página de pago de Stripe
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error en el checkout:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Módulo 1: Introducción al Desarrollo Humano
        </h1>
        <p className="text-gray-600 mb-6">
          Aprende las bases fundamentales para iniciar tu camino de crecimiento
          personal y profesional.
        </p>
        <div className="flex justify-between items-center mb-8">
          <p className="text-4xl font-extrabold text-blue-600">50€</p>
          <p className="text-sm text-gray-500">Pago único</p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Procesando...' : 'Comprar Ahora'}
        </button>
      </div>
    </div>
  );
}