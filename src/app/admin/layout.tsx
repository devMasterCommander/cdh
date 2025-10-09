import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: "CDH Admin - Panel de Administración",
  description: "Panel de administración del proyecto CDH",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.Node;
}) {
  const cookieStore = await cookies();
  
  return (
    <html lang="es">
      <body>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            resources={[
              {
                name: "cursos",
                list: "/admin/cursos",
                create: "/admin/cursos/create",
                edit: "/admin/cursos/edit/:id",
                show: "/admin/cursos/show/:id",
                meta: {
                  label: "Cursos",
                },
              },
              {
                name: "usuarios",
                list: "/admin/usuarios",
                show: "/admin/usuarios/show/:id",
                meta: {
                  label: "Usuarios",
                },
              },
              {
                name: "transacciones",
                list: "/admin/transacciones",
                show: "/admin/transacciones/show/:id",
                meta: {
                  label: "Transacciones",
                },
              },
              {
                name: "afiliados",
                list: "/admin/afiliados",
                show: "/admin/afiliados/show/:id",
                meta: {
                  label: "Afiliados",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <div className="min-h-screen bg-gray-50">
              {/* Sidebar */}
              <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800">CDH Admin</h1>
                  <p className="text-sm text-gray-500">Panel de Administración</p>
                </div>
                
                <nav className="mt-6">
                  <a 
                    href="/admin"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    📊 Dashboard
                  </a>
                  <a 
                    href="/admin/cursos"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    📚 Cursos
                  </a>
                  <a 
                    href="/admin/usuarios"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    👥 Usuarios
                  </a>
                  <a 
                    href="/admin/transacciones"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    💳 Transacciones
                  </a>
                  <a 
                    href="/admin/afiliados"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    🌳 Afiliados
                  </a>
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <a 
                      href="/"
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      🏠 Volver al sitio
                    </a>
                  </div>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </body>
    </html>
  );
}

