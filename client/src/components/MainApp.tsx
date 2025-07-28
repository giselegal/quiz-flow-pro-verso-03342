import React, { useState } from 'react';
import { QuizDashboard } from './quiz/QuizDashboard';
import { QuizEditor } from './quiz/QuizEditor';
import { QuizPreview } from './quiz/QuizPreview';
import type { Quiz } from '../types/supabase';

type ViewMode = 'dashboard' | 'editor' | 'preview';

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
    </div>
  );
};
