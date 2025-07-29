
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QuizDashboard } from './quiz/QuizDashboard';
import QuizEditor from './quiz/QuizEditor';
import { Quiz } from '@/types/quiz';

interface MainAppProps {
  onShowTemplates?: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onShowTemplates }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsEditing(true);
  };

  const handleBackToDashboard = () => {
    setSelectedQuiz(null);
    setIsEditing(false);
  };

  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Quiz de Personalidade',
      description: 'Descubra mais sobre sua personalidade',
      author_id: 'user-1',
      category: 'personality',
      difficulty: 'easy',
      time_limit: null,
      is_public: true,
      is_published: true,
      is_template: false,
      thumbnail_url: null,
      tags: ['personalidade', 'autoconhecimento'],
      view_count: 150,
      average_score: 85,
      questions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Quiz de Conhecimentos Gerais',
      description: 'Teste seus conhecimentos',
      author_id: 'user-1',
      category: 'knowledge',
      difficulty: 'medium',
      time_limit: 300,
      is_public: true,
      is_published: false,
      is_template: false,
      thumbnail_url: null,
      tags: ['conhecimento', 'geral'],
      view_count: 89,
      average_score: 72,
      questions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  if (isEditing && selectedQuiz) {
    return (
      <QuizEditor
        quiz={selectedQuiz}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <QuizDashboard
            quizzes={mockQuizzes}
            onQuizSelect={handleQuizSelect}
            onShowTemplates={onShowTemplates}
          />
        } 
      />
    </Routes>
  );
};

export default MainApp;
