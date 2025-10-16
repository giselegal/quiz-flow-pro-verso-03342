/**
 * 🎯 TRANSITION PROGRESS BLOCK - Bloco Atômico
 * Barra de progresso para telas de transição
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function TransitionProgressBlock({
  block,
  isSelected = false,
}: AtomicBlockProps) {
  const [progress, setProgress] = React.useState(0);
  const duration = block.content?.duration || 3000;
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto py-4",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
      )}
    >
      <Progress value={progress} className="h-2" />
    </div>
  );
}
