// app/(presentation)/clone/components/clone-progress.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface CloneProgressProps {
  onComplete?: () => void;
}

export function CloneProgress({ onComplete }: CloneProgressProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/clone");
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          clearInterval(interval);
          onComplete?.();
          return;
        }

        setProgress(data.progress);

        if (data.progress >= 100) {
          clearInterval(interval);
          onComplete?.();
        }
      } catch (error) {
        console.error("Error al obtener el progreso:", error);
        setError("Error al obtener el progreso");
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-muted-foreground text-center">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          `Progreso: ${progress}%`
        )}
      </p>
    </div>
  );
}
