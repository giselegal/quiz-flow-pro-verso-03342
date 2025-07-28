import React from 'react';
import { AnimatedWrapper } from './ui/animated-wrapper';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface QuizFinalTransitionProps {
  onComplete: () => void;
  showingFinalTransition: boolean;
}

export const QuizFinalTransition: React.FC<QuizFinalTransitionProps> = ({
  onComplete,
  showingFinalTransition,
}) => {
  return (
    <AnimatedWrapper show={showingFinalTransition}>
      <div className="flex flex-col items-center justify-center h-screen bg-[#faf8f5]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-[#432818]">
          Preparando seu resultado...
        </p>
        <Button onClick={onComplete} className="mt-6">
          Continuar
        </Button>
      </div>
    </AnimatedWrapper>
  );
};
