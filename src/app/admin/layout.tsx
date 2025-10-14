"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Award,
  Home,
  Settings,
  Shield
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/cursos", icon: BookOpen, label: "Cursos" },
    { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { href: "/admin/transacciones", icon: CreditCard, label: "Transacciones" },
    { href: "/admin/afiliados", icon: Award, label: "Afiliados" },
  ];

  return (
    <RefineKbarProvider>
      <Refine
        dataProvider={dataProvider("http://localhost:3000/api")}
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
        <div className="min-h-screen bg-background">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-6 w-6" />
                <h1 className="text-2xl font-cinzel font-bold">CDH Admin</h1>
              </div>
              <p className="text-sm opacity-90">Panel de Administración</p>
            </div>
            
            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <Separator className="my-4" />

              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Volver al sitio</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="ml-64 min-h-screen">
            <div className="p-6 md:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
        <RefineKbar />
      </Refine>
    </RefineKbarProvider>
  );
}

