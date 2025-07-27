
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: { text: string; isCorrect: boolean }[];
  correct_answers: string[];
  points: number;
  explanation?: string;
  time_limit?: number;
  required: boolean;
  hint?: string;
  media_url?: string;
  media_type?: string;
  tags: string[];
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  settings: any;
  is_public: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useQuizEditor = (quizId?: string) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load quiz and questions
  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    } else {
      setLoading(false);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    try {
      setLoading(true);
      // Simulated API call - replace with actual API
      const mockQuiz: Quiz = {
        id,
        title: 'Quiz Exemplo',
        description: 'Descrição do quiz',
        author_id: user?.id || '',
        category: 'general',
        difficulty: 'medium',
        time_limit: null,
        settings: {},
        is_public: false,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setQuiz(mockQuiz);
      setQuestions([]);
    } catch (err) {
      setError('Erro ao carregar quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = useCallback((updates: Partial<Quiz>) => {
    if (!quiz) return;
    
    setQuiz(prev => prev ? { ...prev, ...updates } : null);
  }, [quiz]);

  const addQuestion = useCallback(() => {
    if (!quiz) return;
    
    const newQuestion: QuizQuestion = {
      id: `question_${Date.now()}`,
      quiz_id: quiz.id,
      question_text: 'Nova pergunta',
      question_type: 'multiple_choice',
      options: [
        { text: 'Opção 1', isCorrect: false },
        { text: 'Opção 2', isCorrect: false }
      ],
      correct_answers: [],
      points: 1,
      explanation: '',
      time_limit: undefined,
      required: true,
      hint: '',
      media_url: undefined,
      media_type: undefined,
      tags: [],
      order_index: questions.length
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    return newQuestion.id;
  }, [quiz, questions.length]);

  const updateQuestion = useCallback((id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const reorderQuestions = useCallback((dragIndex: number, hoverIndex: number) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      const draggedQuestion = newQuestions[dragIndex];
      
      newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedQuestion);
      
      return newQuestions.map((q, index) => ({
        ...q,
        order_index: index
      }));
    });
  }, []);

  const saveQuiz = useCallback(async () => {
    if (!quiz || !user) return false;
    
    try {
      setSaving(true);
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError('Erro ao salvar quiz');
      return false;
    } finally {
      setSaving(false);
    }
  }, [quiz, user]);

  const publishQuiz = useCallback(async () => {
    if (!quiz) return false;
    
    updateQuiz({ is_published: true });
    return await saveQuiz();
  }, [quiz, updateQuiz, saveQuiz]);

  const duplicateQuestion = useCallback((id: string) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    
    const duplicatedQuestion: QuizQuestion = {
      ...question,
      id: `question_${Date.now()}`,
      question_text: `${question.question_text} (Cópia)`,
      order_index: questions.length
    };
    
    setQuestions(prev => [...prev, duplicatedQuestion]);
  }, [questions]);

  return {
    quiz,
    questions,
    loading,
    error,
    saving,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    saveQuiz,
    publishQuiz,
    duplicateQuestion
  };
};
