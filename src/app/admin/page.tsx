import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  ShoppingCart,
  Euro,
  TrendingUp,
  Calendar,
  User
} from "lucide-react";

// Forzar renderizado dinámico para evitar prerendering
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Obtener métricas básicas
  const [totalUsers, totalPurchases, totalCourses] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count(),
    prisma.course.count(),
  ]);

  // Calcular ingresos totales
  const purchases = await prisma.purchase.findMany({
    include: {
      course: {
        select: {
          price: true,
        },
      },
    },
  });

  const totalRevenue = purchases.reduce((sum, purchase) => {
    return sum + (purchase.course?.price || 0);
  }, 0);

  // Obtener compras recientes
  const recentPurchases = await prisma.purchase.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-cinzel">Dashboard</CardTitle>
          <CardDescription>
            Bienvenido al panel de administración de CDH
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Cursos disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Compras
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPurchases}</div>
            <p className="text-xs text-muted-foreground">
              Compras realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold mt-2">{totalRevenue.toFixed(2)}€</p>
              </div>
              <Euro className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </Card>
      </div>

      {/* Compras Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Compras Recientes</span>
          </CardTitle>
          <CardDescription>
            Últimas transacciones realizadas en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPurchases.length === 0 ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    No hay compras registradas
                  </h2>
                  <p className="text-muted-foreground">
                    Las compras aparecerán aquí cuando los usuarios adquieran cursos
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPurchases.map((purchase) => (
                    <TableRow key={purchase.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {purchase.user.name || "Sin nombre"}
                            </div>
                            <div className="text-xs text-muted-foreground">{purchase.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">{purchase.course.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {purchase.course.price.toFixed(2)}€
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(purchase.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

