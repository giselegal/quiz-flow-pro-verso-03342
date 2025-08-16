import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext';

export const Step13Template: React.FC = () => {
  const { quizState } = useEditor();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (quizState.answerStrategicQuestion) {
      quizState.answerStrategicQuestion('strategic-question-13', answer);
    }
    setSelectedAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Qual peça de roupa te deixa mais confiante?</h2>
      <div className="space-y-4">
        <Button
          variant={selectedAnswer === 'opcao1' ? 'default' : 'outline'}
          onClick={() => handleAnswer('opcao1')}
        >
          Opção 1: Blazer estruturado
        </Button>
        <Button
          variant={selectedAnswer === 'opcao2' ? 'default' : 'outline'}
          onClick={() => handleAnswer('opcao2')}
        >
          Opção 2: Vestido elegante
        </Button>
        <Button
          variant={selectedAnswer === 'opcao3' ? 'default' : 'outline'}
          onClick={() => handleAnswer('opcao3')}
        >
          Opção 3: Jeans e camiseta básica
        </Button>
      </div>
    </div>
  );
};
