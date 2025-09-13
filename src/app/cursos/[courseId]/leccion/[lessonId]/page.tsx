// src/app/cursos/[courseId]/leccion/[lessonId]/page.tsx

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import { getServerSession } from 'next-auth/next'; // Importamos getServerSession
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Importamos authOptions

async function getLessonData(userId: string, courseId: string, lessonId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!purchase) return { error: 'ACCESS_DENIED' };

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { progress: { where: { userId } } },
  });
  if (!lesson) return { error: 'NOT_FOUND' };
  
  let videoUrl = '';
  try {
    const response = await fetch(`https://api.vimeo.com/videos/${lesson.vimeoVideoId}`, {
      headers: { Authorization: `bearer ${process.env.VIMEO_ACCESS_TOKEN}` },
    });
    const data = await response.json();
    
    // --- CAMBIO CLAVE AQUÍ ---
    // Extraemos la URL del reproductor incrustable en lugar del archivo directo
    videoUrl = data.player_embed_url || '';
    
  } catch (error) {
    console.error('Error fetching Vimeo video:', error);
    return { error: 'VIMEO_ERROR' };
  }
  return { lesson, videoUrl };
}

// ... (El resto del componente Page se mantiene igual) ...
export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { courseId, lessonId } = params;

  // --- OBTENEMOS LA SESIÓN REAL DEL USUARIO ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Si no hay sesión, en el futuro redirigiremos a una página de login.
    // Por ahora, denegamos el acceso directamente.
    return <div className="text-center py-20"><h1 className="text-2xl font-bold">Acceso Denegado</h1><p className="mt-4">Necesitas iniciar sesión para ver este contenido.</p></div>;
  }
  const userId = session.user.id;
  // --- FIN DE LA LÓGICA DE SESIÓN REAL ---

  const { error, lesson, videoUrl } = await getLessonData(userId, courseId, lessonId);

  if (error === 'ACCESS_DENIED' || !lesson) {
    return <div className="text-center py-20"><h1 className="text-2xl font-bold">Acceso Denegado</h1><p className="mt-4">No has comprado este curso o la lección no existe.</p></div>;
  }
  
  const userProgress = lesson.progress[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{lesson.name}</h1>
      
      {videoUrl ? (
        <VideoPlayer
          lessonId={lesson.id}
          videoUrl={videoUrl}
          initialTimestamp={userProgress?.lastTimestamp || 0}
          isInitiallyCompleted={userProgress?.isCompleted || false}
        />
      ) : (
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-red-500 font-bold text-lg">No se pudo cargar el video desde Vimeo.</p>
        </div>
      )}
    </div>
  );
}