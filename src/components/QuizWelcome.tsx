
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuizWelcomeProps {
  onStart: () => void;
}

const QuizWelcome: React.FC<QuizWelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-playfair text-[#432818] mb-4">
          Bem-vindo ao Quiz!
        </h1>
        <p className="text-[#8F7A6A] mb-8">
          Descubra seu estilo pessoal respondendo algumas perguntas rápidas
        </p>
        
        <Button onClick={onStart} className="w-full">
          Começar Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizWelcome;
