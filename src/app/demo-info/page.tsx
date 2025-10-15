"use client";

import Link from "next/link";

export default function DemoInfoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Login</h1>
          <p className="text-gray-600">Información sobre el acceso demo</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Base de Datos No Configurada</h3>
            <p className="text-sm text-yellow-700">
              Para usar el demo login, necesitas configurar la variable de entorno <code className="bg-yellow-100 px-1 rounded">DATABASE_URL</code> en Vercel.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 Cómo Configurar</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Ve a Vercel Dashboard</li>
              <li>2. Selecciona tu proyecto</li>
              <li>3. Ve a Settings → Environment Variables</li>
              <li>4. Agrega <code className="bg-blue-100 px-1 rounded">DATABASE_URL</code></li>
              <li>5. Haz redeploy</li>
            </ol>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Credenciales Demo</h3>
            <p className="text-sm text-green-700">
              <strong>Email:</strong> demo@cdh.com<br/>
              <strong>Contraseña:</strong> demo1234
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/demo-login"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
          >
            Intentar Demo Login
          </Link>
          
          <Link
            href="/api/auth/signin"
            className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center block"
          >
            Login Normal
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
