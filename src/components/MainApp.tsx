
import React, { useState } from 'react';
import QuizDashboard from './quiz/QuizDashboard';
import { QuizEditor } from './quiz/QuizEditor';
import { QuizPreview } from './quiz/QuizPreview';
import QuizIntro from './QuizIntro';
import type { Quiz } from '../types/supabase';

type ViewMode = 'dashboard' | 'editor' | 'preview' | 'quiz';

export const MainApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setViewMode('editor');
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setViewMode('preview');
  };

  const handleStartQuiz = () => {
    setViewMode('quiz');
  };

  const handleBackToDashboard = () => {
    setSelectedQuiz(null);
    setViewMode('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {viewMode === 'dashboard' && (
        <div className="container mx-auto px-4 py-8">
          <QuizDashboard
            onEditQuiz={handleEditQuiz}
            onPreviewQuiz={handlePreviewQuiz}
            onStartQuiz={handleStartQuiz}
          />
        </div>
      )}

      {viewMode === 'editor' && selectedQuiz && (
        <QuizEditor
          quiz={selectedQuiz}
          onBack={handleBackToDashboard}
        />
      )}

      {viewMode === 'preview' && selectedQuiz && (
        <QuizPreview
          quiz={selectedQuiz}
          onBack={handleBackToDashboard}
        />
      )}

      {viewMode === 'quiz' && (
        <QuizIntro
          onStart={() => console.log('Quiz started')}
          title="Descubra Seu Estilo Único"
          description="Um quiz personalizado para revelar seu estilo de moda e transformar sua forma de se vestir"
        />
      )}
    </div>
  );
};
