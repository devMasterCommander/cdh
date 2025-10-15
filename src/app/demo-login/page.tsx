"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DemoLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar contraseña
    if (password !== "demo1234") {
      setError("Contraseña incorrecta");
      return;
    }

    setLoading(true);
    setError("");

    // Redirigir al endpoint que configura la sesión
    window.location.href = "/api/demo/auth";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Demo</h1>
          <p className="text-gray-600">Acceso rápido para pruebas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (fijo)
            </label>
            <input
              type="email"
              value="demo@cdh.com"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo1234"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-semibold mb-2">Credenciales Demo:</p>
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> demo@cdh.com
          </p>
          <p className="text-sm text-blue-700">
            <strong>Contraseña:</strong> demo1234
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/api/auth/signin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver al login normal
          </Link>
        </div>
      </div>
    </div>
  );
}

