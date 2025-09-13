// src/components/VideoPlayer.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { throttle } from 'lodash'; // Usaremos lodash para no saturar la API

interface VideoPlayerProps {
  lessonId: string;
  videoUrl: string;
  initialTimestamp: number;
  isInitiallyCompleted: boolean;
}

export default function VideoPlayer({
  lessonId,
  videoUrl,
  initialTimestamp,
  isInitiallyCompleted,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);

  const saveProgress = async (data: { seconds: number }) => {
    fetch('/api/progress/update-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lessonId,
        timestamp: data.seconds,
      }),
    });
  };
  
  // Usamos throttle para llamar a la API como máximo una vez cada 10 segundos
  const throttledSaveProgress = throttle(saveProgress, 10000, { 'trailing': false });

  const markAsComplete = async (completedState: boolean) => {
    setIsCompleted(completedState);
    await fetch('/api/progress/toggle-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lessonId,
        isCompleted: completedState,
      }),
    });
  };

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);

    player.setCurrentTime(initialTimestamp).catch((error) => {
      console.warn("Error al establecer el tiempo inicial:", error);
    });

    player.on('timeupdate', throttledSaveProgress);
    
    // Marcar como completado automáticamente cuando el video termina
    player.on('ended', () => markAsComplete(true));

    return () => {
      player.off('timeupdate', throttledSaveProgress);
      player.off('ended');
      player.destroy();
    };
  }, [lessonId, initialTimestamp]); // Vuelve a ejecutar si la lección cambia

  return (
    <div>
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        <iframe
          ref={iframeRef}
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          title="Lesson Video"
        ></iframe>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => markAsComplete(!isCompleted)}
          className={`font-bold py-2 px-4 rounded-lg transition-colors ${
            isCompleted
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {isCompleted ? '✓ Lección Completada' : 'Marcar como Completada'}
        </button>
      </div>
    </div>
  );
}


