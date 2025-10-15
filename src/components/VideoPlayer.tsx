// src/components/VideoPlayer.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { throttle } from 'lodash';
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

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
      // Error al establecer el tiempo inicial del video
    });

    player.on('timeupdate', throttledSaveProgress);
    
    // Marcar como completado automáticamente cuando el video termina
    player.on('ended', () => markAsComplete(true));

    return () => {
      player.off('timeupdate', throttledSaveProgress);
      player.off('ended');
      player.destroy();
    };
  }, [lessonId, initialTimestamp]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ padding: '56.25% 0 0 0' }}>
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
      <div className="flex justify-end">
        <Button
          onClick={() => markAsComplete(!isCompleted)}
          className={
            isCompleted
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Lección Completada
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 mr-2" />
              Marcar como Completada
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


