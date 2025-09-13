// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  // 1. Proteger la página: obtener la sesión del usuario
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Si no hay sesión, redirigir a la página principal para que inicie sesión
    redirect('/');
  }

  // 2. Obtener los datos completos del usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Si por alguna razón el usuario no se encuentra en la BD, redirigir
  if (!user) {
    redirect('/');
  }
  
  // 3. Generar el enlace de afiliado único
  // Usamos el nombre del usuario o su email (la parte antes del @) si no tiene nombre
  const refSlug = user.name?.toLowerCase().replace(/\s+/g, '-') || user.email?.split('@')[0];
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/ref/${refSlug}`;
  
  /* inicio renderizado del componente */
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido a tu Dashboard, {user.name || user.email}
        </h1>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Tu Enlace de Afiliado</h2>
          <p className="mt-2 text-gray-500">
            Comparte este enlace único para que tus referidos se unan y generes comisiones.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-md text-blue-600 font-mono break-all">
              {referralLink}
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Próximamente: botón para copiar y ver estadísticas.
          </p>
        </div>

        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700">Mis Cursos</h2>
            {/* Aquí listaremos los cursos comprados en un futuro punto de control */}
            <p className="mt-2 text-gray-500">Aún no has comprado ningún curso.</p>
        </div>

      </div>
    </div>
  );
  /* fin renderizado del componente */
}
