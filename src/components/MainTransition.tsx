
import React from 'react';
import { AnimatedWrapper } from './ui/animated-wrapper';
import { Button } from '@/components/ui/button';

interface MainTransitionProps {
  onContinue: () => void;
}

export const MainTransition: React.FC<MainTransitionProps> = ({ onContinue }) => {
  return (
    <AnimatedWrapper show={true}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf8f5] p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-playfair text-[#432818] mb-4">
            Agora vamos aprofundar...
          </h2>
          <p className="text-[#8F7A6A] mb-8">
            Algumas perguntas estratégicas para refinar seu resultado
          </p>
          <Button onClick={onContinue} className="bg-[#B89B7A] hover:bg-[#A38A69]">
            Continuar
          </Button>
        </div>
      </div>
    </AnimatedWrapper>
  );
};
