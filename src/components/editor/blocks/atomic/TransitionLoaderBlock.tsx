import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionLoaderBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  const color = block.content?.color || '#5b4135';
  const size = block.content?.size || 'md';

  // Track when transition loader is shown
  React.useEffect(() => {
    if (!isSelected) {
      window.dispatchEvent(new CustomEvent('quiz-transition-shown', {
        detail: {
          blockId: block.id,
          timestamp: Date.now(),
        },
      }));

      // Track when user completes viewing transition (assumed 2s minimum)
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('quiz-transition-completed', {
          detail: {
            blockId: block.id,
            duration: 2000,
            timestamp: Date.now(),
          },
        }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [block.id, isSelected]);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`flex gap-2 justify-center items-center py-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={(e) => { onClick?.(); }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-full animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
