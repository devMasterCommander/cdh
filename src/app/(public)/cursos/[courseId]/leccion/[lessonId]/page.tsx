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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center border border-border">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-cinzel font-bold text-foreground mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-6">Necesitas iniciar sesión para ver este contenido.</p>
            <a
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }
  const userId = session.user.id;
  // --- FIN DE LA LÓGICA DE SESIÓN REAL ---

  const { error, lesson, videoUrl } = await getLessonData(userId, courseId, lessonId);

  if (error === 'ACCESS_DENIED' || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center border border-border">
            <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-cinzel font-bold text-foreground mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-6">No has comprado este curso o la lección no existe.</p>
            <a
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Catálogo de Cursos
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  const userProgress = lesson.progress[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <a
            href={`/cursos/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al curso
          </a>
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-foreground">{lesson.name}</h1>
        </div>
        
        {videoUrl ? (
          <VideoPlayer
            lessonId={lesson.id}
            videoUrl={videoUrl}
            initialTimestamp={userProgress?.lastTimestamp || 0}
            isInitiallyCompleted={userProgress?.isCompleted || false}
          />
        ) : (
          <div className="w-full aspect-video bg-destructive/10 flex items-center justify-center rounded-lg border-2 border-destructive">
            <div className="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-destructive font-bold text-lg">No se pudo cargar el video desde Vimeo</p>
              <p className="text-muted-foreground text-sm mt-2">Por favor, contacta con soporte</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}