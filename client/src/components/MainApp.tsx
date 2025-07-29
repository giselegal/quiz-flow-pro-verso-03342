
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuizzes } from '@/hooks/useQuizzes';
import QuizDashboard from './quiz/QuizDashboard';

export default function MainApp() {
  const { quizzes, loading, loadQuizzes, createQuiz } = useQuizzes();

  React.useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const handleQuizSelect = (quiz: any) => {
    console.log('Selected quiz:', quiz);
  };

  const handleCreateQuiz = async () => {
    try {
      await createQuiz({
        title: 'Novo Quiz',
        description: 'Descrição do quiz',
        category: 'general'
      });
      loadQuizzes();
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <QuizDashboard 
            quizzes={quizzes}
            onQuizSelect={handleQuizSelect}
            onCreateQuiz={handleCreateQuiz}
          />
        } />
      </Routes>
    </div>
  );
}
