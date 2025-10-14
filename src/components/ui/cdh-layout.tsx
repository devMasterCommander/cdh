"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  User, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CdhLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    userType?: string;
  };
}

const navigationItems = [
  {
    name: "Mi Perfil",
    href: "/mi-cuenta",
    icon: User,
    description: "Ver y editar datos personales"
  },
  {
    name: "Mis Cursos",
    href: "/mi-cuenta/mis-cursos",
    icon: BookOpen,
    description: "Cursos comprados y progreso"
  },
  {
    name: "Mi Progreso",
    href: "/mi-cuenta/progreso",
    icon: BarChart3,
    description: "Estadísticas de aprendizaje"
  },
  {
    name: "Programa de Afiliados",
    href: "/mi-cuenta/afiliado",
    icon: Users,
    description: "Referidos y comisiones"
  },
];

export function CdhLayout({ children, user }: CdhLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/mi-cuenta") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getUserTypeBadge = (userType?: string) => {
    switch (userType) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>;
      case "AFFILIATE":
        return <Badge className="bg-cdh-secondary text-white">Afiliado</Badge>;
      case "CUSTOMER":
        return <Badge variant="secondary">Cliente</Badge>;
      default:
        return <Badge variant="outline">Usuario</Badge>;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cdh-primary to-cdh-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-cinzel font-bold text-lg">CDH</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-cinzel text-xl text-cdh-accent">Mi Cuenta</h1>
              <p className="text-sm text-gray-500 font-courgette">Centro de Desarrollo Humano</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-cdh-primary text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.name || "Usuario"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
              <div className="mt-1">
                {getUserTypeBadge(user?.userType)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-4 ${
                  active 
                    ? "bg-cdh-primary text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100"
                } ${collapsed ? "px-3" : ""}`}
              >
                <Icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500 font-courgette">
              Centro de Desarrollo Humano
            </p>
            <p className="text-xs text-gray-400">
              Transformando vidas a través del conocimiento
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cdh-primary to-cdh-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-cinzel font-bold text-sm">CDH</span>
            </div>
            <h1 className="font-cinzel text-lg text-cdh-accent">Mi Cuenta</h1>
          </div>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SheetHeader className="sr-only">
                <SheetTitle>Navegación del Dashboard</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? "w-20" : "w-80"
        }`}>
          <div className="sticky top-0 h-screen">
            <SidebarContent />
            
            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 -right-3 w-6 h-6 p-0 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
