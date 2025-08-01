
import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export const Home: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleStartQuiz = () => {
    setLocation('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Quiz Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crie quizzes interativos e páginas de resultado profissionais com nosso editor visual avançado.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleStartQuiz}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Criar Quiz
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setLocation('/admin/funis')}
          >
            Ver Funis
          </Button>
        </div>
      </div>
    </div>
  );
};
