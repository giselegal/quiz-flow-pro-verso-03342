
import React from 'react';
import { Button } from '@/components/ui/button';
import type { Quiz } from '../../types/supabase';

interface QuizDashboardProps {
  onEditQuiz: (quiz: Quiz) => void;
  onPreviewQuiz: (quiz: Quiz) => void;
  onStartQuiz: () => void;
}

const QuizDashboard: React.FC<QuizDashboardProps> = ({ 
  onEditQuiz, 
  onPreviewQuiz, 
  onStartQuiz 
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#432818] mb-6">Quiz Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B89B7A]/20">
          <h2 className="text-lg font-semibold text-[#432818] mb-4">Criar Novo Quiz</h2>
          <p className="text-[#8F7A6A] mb-4">Crie um novo quiz personalizado</p>
          <Button>Criar Quiz</Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B89B7A]/20">
          <h2 className="text-lg font-semibold text-[#432818] mb-4">Meus Quizzes</h2>
          <p className="text-[#8F7A6A] mb-4">Visualize e edite seus quizzes</p>
          <Button variant="outline">Ver Todos</Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B89B7A]/20">
          <h2 className="text-lg font-semibold text-[#432818] mb-4">Começar Quiz</h2>
          <p className="text-[#8F7A6A] mb-4">Teste o quiz de estilo</p>
          <Button onClick={onStartQuiz} variant="ghost">Iniciar Quiz</Button>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;
