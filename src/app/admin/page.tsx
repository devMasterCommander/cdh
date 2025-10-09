import { prisma } from "@/lib/prisma";

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de administración de CDH
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Cursos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalCourses}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Compras</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPurchases}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compras Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Compras Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.user.name || "Sin nombre"}
                    </div>
                    <div className="text-sm text-gray-500">{purchase.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{purchase.course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.course.price.toFixed(2)}€
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {recentPurchases.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay compras registradas todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

