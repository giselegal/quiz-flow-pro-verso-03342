
import React, { useEffect } from 'react';
import { AnimatedWrapper } from './ui/animated-wrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LoadingManagerProps {
  onComplete: () => void;
}

export const LoadingManager: React.FC<LoadingManagerProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatedWrapper show={true}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf8f5]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg text-[#432818]">
          Calculando seu resultado...
        </p>
      </div>
    </AnimatedWrapper>
  );
};
