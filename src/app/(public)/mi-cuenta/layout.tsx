"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              {/* Información del usuario */}
              <div className="mb-6 text-center">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Usuario"}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                )}
                <h2 className="font-bold text-gray-900">
                  {session.user?.name || "Sin nombre"}
                </h2>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>

              {/* Navegación */}
              <nav className="space-y-2">
                <Link
                  href="/mi-cuenta"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive("/mi-cuenta")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  👤 Mi Perfil
                </Link>
                <Link
                  href="/mi-cuenta/mis-cursos"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive("/mi-cuenta/mis-cursos")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📚 Mis Cursos
                </Link>
                <Link
                  href="/mi-cuenta/progreso"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive("/mi-cuenta/progreso")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 Mi Progreso
                </Link>
                
                {/* Solo para afiliados */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href="/mi-cuenta/afiliado"
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive("/mi-cuenta/afiliado")
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🌟 Programa de Afiliados
                  </Link>
                </div>

                {/* Otros */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href="/cursos"
                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    🏠 Catálogo de Cursos
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

