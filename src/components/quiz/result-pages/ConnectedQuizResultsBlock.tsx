import React from 'react';

interface ConnectedQuizResultsBlockProps {
  quizResult?: unknown;
  onNext?: () => void;
  onRestart?: () => void;
}

export const ConnectedQuizResultsBlock: React.FC<ConnectedQuizResultsBlockProps> = ({
  quizResult,
  onNext,
  onRestart,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Resultado do Quiz</h1>
        <p className="text-muted-foreground">
          Componente temporariamente simplificado para compatibilidade.
        </p>
      </div>
    </div>
  );
};

export default ConnectedQuizResultsBlock;