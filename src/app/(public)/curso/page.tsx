// src/app/curso/page.tsx
"use client"; // Directiva para convertirlo en un Componente de Cliente

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CoursePageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccess(true);
      // Limpiar URL después de 3 segundos
      setTimeout(() => {
        router.replace('/curso');
      }, 3000);
    }
    
    if (canceled === 'true') {
      setShowCanceled(true);
      setTimeout(() => {
        setShowCanceled(false);
        router.replace('/curso');
      }, 5000);
    }
  }, [searchParams, router]);

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
      <div className="max-w-md w-full space-y-4">
        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center animate-pulse">
            <span className="text-6xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              ¡Compra Exitosa!
            </h2>
            <p className="text-green-700 mb-4">
              Tu pago se ha procesado correctamente
            </p>
            <Link
              href="/mi-cuenta/mis-cursos"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Ver Mis Cursos →
            </Link>
          </div>
        )}

        {/* Mensaje de cancelación */}
        {showCanceled && (
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">
              Pago Cancelado
            </h2>
            <p className="text-yellow-700">
              No se ha realizado ningún cargo. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </div>
        )}

        {/* Card del curso */}
        <div className="bg-white rounded-lg shadow-md p-8">
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
          
          {/* Link a catálogo */}
          <div className="mt-4 text-center">
            <Link
              href="/cursos"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todos los cursos disponibles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CoursePageContent />
    </Suspense>
  );
}
