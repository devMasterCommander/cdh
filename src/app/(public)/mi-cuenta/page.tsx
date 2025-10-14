"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, Calendar, User, Edit3, Save, X } from "lucide-react";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  userType: string;
  referralSlug: string | null;
  createdAt: string;
  _count: {
    purchases: number;
    sponsored: number;
  };
};

export default function MiPerfilPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/usuarios");
      if (response.ok) {
        const usuarios = await response.json();
        const user = usuarios.find((u: any) => u.email === session?.user?.email);
        if (user) {
          setUserData(user);
          setFormData({ name: user.name || "", email: user.email || "" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Datos actualizados correctamente");
        setEditing(false);
        fetchUserData();
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar datos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar datos");
    } finally {
      setSaving(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      GUEST: "Invitado",
      CUSTOMER: "Cliente",
      AFFILIATE: "Afiliado",
      ADMIN: "Administrador",
    };
    return labels[type] || type;
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "ADMIN":
        return <Badge variant="destructive">Administrador</Badge>;
      case "AFFILIATE":
        return <Badge className="bg-cdh-secondary text-white">Afiliado</Badge>;
      case "CUSTOMER":
        return <Badge variant="secondary">Cliente</Badge>;
      default:
        return <Badge variant="outline">Usuario</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <p className="text-muted-foreground">No se pudo cargar tu perfil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header con Avatar */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cdh-primary to-cdh-secondary p-6 text-white">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl font-cinzel bg-white text-cdh-accent">
                {userData.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-cinzel mb-2">{userData.name || "Usuario"}</h1>
              <p className="text-lg opacity-90 font-courgette">{userData.email}</p>
              <div className="mt-2">
                {getUserTypeBadge(userData.userType)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Comprados
            </CardTitle>
            <BookOpen className="h-4 w-4 text-cdh-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cdh-accent">{userData._count.purchases}</div>
            <p className="text-xs text-muted-foreground">
              Total de cursos adquiridos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personas Referidas
            </CardTitle>
            <Users className="h-4 w-4 text-cdh-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cdh-accent">{userData._count.sponsored}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios que te refirieron
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Miembro Desde
            </CardTitle>
            <Calendar className="h-4 w-4 text-cdh-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-cdh-accent">
              {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                month: "short",
                year: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Fecha de registro
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-cdh-primary" />
                <span>Datos Personales</span>
              </CardTitle>
              <CardDescription>
                Gestiona tu información personal
              </CardDescription>
            </div>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="text-cdh-primary border-cdh-primary hover:bg-cdh-primary hover:text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </Label>
                  <p className="text-lg font-medium mt-1">{userData.name || "Sin nombre"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email
                  </Label>
                  <p className="text-lg font-medium mt-1">{userData.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    className="border-cdh-primary focus:ring-cdh-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="border-cdh-primary focus:ring-cdh-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-cdh-primary hover:bg-cdh-primary-dark"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({ name: userData.name || "", email: userData.email || "" });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-cdh-primary" />
            <span>Información de Cuenta</span>
          </CardTitle>
          <CardDescription>
            Detalles técnicos de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-muted-foreground">ID de Usuario:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {userData.id}
              </code>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-muted-foreground">Tipo de Cuenta:</span>
              {getUserTypeBadge(userData.userType)}
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-muted-foreground">Fecha de Registro:</span>
              <span className="text-sm font-medium">
                {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

