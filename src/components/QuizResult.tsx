
import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface QuizResultProps {
  result: any;
}

const QuizResult: React.FC<QuizResultProps> = ({ result }) => {
  const { user } = useAuth();
  
  // Safely get userName from user object
  const userName = user?.name || user?.email || 'Usuário';

  return (
    <div className="quiz-result p-6">
      <h1 className="text-2xl font-bold mb-4">
        Parabéns, {userName}!
      </h1>
      <p>Seu resultado: {result?.style || 'Resultado não disponível'}</p>
    </div>
  );
};

export default QuizResult;
