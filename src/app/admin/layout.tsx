"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Award,
  Home,
  Settings,
  Shield,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", description: "Vista general" },
    { href: "/admin/cursos", icon: BookOpen, label: "Cursos", description: "Gestionar cursos" },
    { href: "/admin/usuarios", icon: Users, label: "Usuarios", description: "Gestionar usuarios" },
    { href: "/admin/transacciones", icon: CreditCard, label: "Transacciones", description: "Ver pagos" },
    { href: "/admin/afiliados", icon: Award, label: "Afiliados", description: "Programa de afiliados" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Componente de Sidebar reutilizable
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} mb-2`}>
          <Shield className="h-6 w-6" />
          {!collapsed && <h1 className="text-2xl font-cinzel font-bold">CDH Admin</h1>}
        </div>
        {!collapsed && <p className="text-sm opacity-90">Panel de Administración</p>}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <TooltipProvider>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg border-2 border-primary hover:bg-primary/90 font-semibold"
                    : "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs opacity-75">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            ) : linkContent;
          })}

          <Separator className="my-4" />

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex items-center justify-center px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Home className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Volver al sitio</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Volver al sitio</span>
            </Link>
          )}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-courgette">
              Centro de Desarrollo Humano
            </p>
            <p className="text-xs text-muted-foreground/60">
              Panel de Administración
            </p>
          </div>
        </div>
      )}
    </div>
  );

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
        <div className="min-h-screen bg-gray-50">
          {/* Mobile & Tablet Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h1 className="font-cinzel text-lg text-foreground">CDH Admin</h1>
              </div>
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                    <Menu className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 sm:w-96">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navegación del Panel de Administración</SheetTitle>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="lg:flex">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 ${
              collapsed ? "w-20" : "w-80"
            }`}>
              <div className="sticky top-0 h-screen relative">
                <SidebarContent />

                {/* Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 -right-3 w-6 h-6 p-0 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronLeft className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-0">
              <div className="p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
        <RefineKbar />
      </Refine>
    </RefineKbarProvider>
  );
}

