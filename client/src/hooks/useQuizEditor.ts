import { useState, useCallback, useRef, useEffect } from 'react';
import type { Quiz, Question } from '../types/supabase';
import { useQuiz, useQuestions } from './useQuiz';

export interface EditorState {
  quiz: Quiz | null;
  questions: Question[];
  currentQuestionIndex: number;
  isDirty: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
}

export interface EditorActions {
  setQuiz: (quiz: Quiz) => void;
  updateQuizField: (field: keyof Quiz, value: any) => void;
  addQuestion: () => void;
  updateQuestion: (index: number, question: Partial<Question>) => void;
  deleteQuestion: (index: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setCurrentQuestion: (index: number) => void;
  saveQuiz: () => Promise<{ error: Error | null }>;
  resetEditor: () => void;
  markDirty: () => void;
  markClean: () => void;
}

interface UseQuizEditorOptions {
  quizId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number; // em milissegundos
}

const defaultOptions: UseQuizEditorOptions = {
  autoSave: true,
  autoSaveInterval: 30000 // 30 segundos
};

export const useQuizEditor = (options: UseQuizEditorOptions = {}) => {
  const { quizId, autoSave, autoSaveInterval } = { ...defaultOptions, ...options };
  
  const { quiz, loading: quizLoading, error: quizError, updateQuiz } = useQuiz(quizId);
  const { 
    questions, 
    loading: questionsLoading, 
    error: questionsError,
    addQuestion: addQuestionService,
    updateQuestion: updateQuestionService,
    deleteQuestion: deleteQuestionService,
    reorderQuestions: reorderQuestionsService,
    setQuestions
  } = useQuestions(quizId || '');

  const [state, setState] = useState<EditorState>({
    quiz: null,
    questions: [],
    currentQuestionIndex: 0,
    isDirty: false,
    isAutoSaving: false,
    lastSaved: null
  });

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<{
    quiz?: Partial<Quiz>;
    questions?: { id: string; updates: Partial<Question> }[];
  }>({});

  // Sincronizar com dados carregados
  useEffect(() => {
    if (quiz && questions) {
      setState(prev => ({
        ...prev,
        quiz,
        questions
      }));
    }
  }, [quiz, questions]);

  // Auto-save
  useEffect(() => {
    if (!autoSave || !state.isDirty) return;

    const startAutoSave = () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        if (state.isDirty) {
          await performAutoSave();
        }
      }, autoSaveInterval);
    };

    startAutoSave();

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [state.isDirty, autoSave, autoSaveInterval]);

  const performAutoSave = useCallback(async () => {
    if (!state.quiz || !state.isDirty) return;

    setState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      // Salvar alterações do quiz
      if (pendingChangesRef.current.quiz) {
        await updateQuiz(pendingChangesRef.current.quiz);
        pendingChangesRef.current.quiz = undefined;
      }

      // Salvar alterações das questões
      if (pendingChangesRef.current.questions) {
        for (const { id, updates } of pendingChangesRef.current.questions) {
          await updateQuestionService(id, updates);
        }
        pendingChangesRef.current.questions = undefined;
      }

      setState(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date()
      }));
    } catch (error) {
      console.error('Erro no auto-save:', error);
    } finally {
      setState(prev => ({ ...prev, isAutoSaving: false }));
    }
  }, [state.quiz, state.isDirty, updateQuiz, updateQuestionService]);

  const markDirty = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const markClean = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }));
  }, []);

  const setQuiz = useCallback((newQuiz: Quiz) => {
    setState(prev => ({ ...prev, quiz: newQuiz }));
  }, []);

  const updateQuizField = useCallback((field: keyof Quiz, value: any) => {
    setState(prev => {
      if (!prev.quiz) return prev;
      
      const updatedQuiz = { ...prev.quiz, [field]: value };
      
      // Adicionar à lista de mudanças pendentes
      if (!pendingChangesRef.current.quiz) {
        pendingChangesRef.current.quiz = {};
      }
      pendingChangesRef.current.quiz[field] = value;
      
      return {
        ...prev,
        quiz: updatedQuiz,
        isDirty: true
      };
    });
  }, []);

  const addQuestion = useCallback(async () => {
    if (!state.quiz) return;

    const newQuestion: Omit<Question, 'id' | 'created_at'> = {
      quiz_id: state.quiz.id,
      question_text: '',
      question_type: 'multiple_choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correct_answers: [],
      points: 1,
      explanation: '',
      media_url: null,
      order_index: state.questions.length
    };

    const { error } = await addQuestionService(newQuestion);
    
    if (!error) {
      markDirty();
    }

    return { error };
  }, [state.quiz, state.questions.length, addQuestionService, markDirty]);

  const updateQuestion = useCallback((index: number, updates: Partial<Question>) => {
    setState(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[index];
      
      if (!question) return prev;

      updatedQuestions[index] = { ...question, ...updates };

      // Adicionar à lista de mudanças pendentes
      if (!pendingChangesRef.current.questions) {
        pendingChangesRef.current.questions = [];
      }
      
      const existingIndex = pendingChangesRef.current.questions.findIndex(q => q.id === question.id);
      if (existingIndex >= 0) {
        pendingChangesRef.current.questions[existingIndex].updates = {
          ...pendingChangesRef.current.questions[existingIndex].updates,
          ...updates
        };
      } else {
        pendingChangesRef.current.questions.push({
          id: question.id,
          updates
        });
      }

      return {
        ...prev,
        questions: updatedQuestions,
        isDirty: true
      };
    });
  }, []);

  const deleteQuestion = useCallback(async (index: number) => {
    const question = state.questions[index];
    if (!question) return { error: new Error('Questão não encontrada') };

    const { error } = await deleteQuestionService(question.id);
    
    if (!error) {
      setState(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
        currentQuestionIndex: Math.max(0, Math.min(prev.currentQuestionIndex, prev.questions.length - 2))
      }));
      markDirty();
    }

    return { error };
  }, [state.questions, deleteQuestionService, markDirty]);

  const reorderQuestions = useCallback(async (fromIndex: number, toIndex: number) => {
    const newQuestions = [...state.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);

    // Atualizar índices
    const reorderUpdates = newQuestions.map((q, index) => ({
      id: q.id,
      order_index: index
    }));

    const { error } = await reorderQuestionsService(reorderUpdates);
    
    if (!error) {
      setState(prev => ({
        ...prev,
        questions: newQuestions.map((q, index) => ({ ...q, order_index: index })),
        currentQuestionIndex: toIndex
      }));
      markDirty();
    }

    return { error };
  }, [state.questions, reorderQuestionsService, markDirty]);

  const setCurrentQuestion = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, prev.questions.length - 1))
    }));
  }, []);

  const saveQuiz = useCallback(async () => {
    if (!state.quiz) return { error: new Error('Quiz não carregado') };

    setState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      await performAutoSave();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isAutoSaving: false }));
    }
  }, [state.quiz, performAutoSave]);

  const resetEditor = useCallback(() => {
    setState({
      quiz: null,
      questions: [],
      currentQuestionIndex: 0,
      isDirty: false,
      isAutoSaving: false,
      lastSaved: null
    });
    
    pendingChangesRef.current = {};
    
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, []);

  const actions: EditorActions = {
    setQuiz,
    updateQuizField,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    setCurrentQuestion,
    saveQuiz,
    resetEditor,
    markDirty,
    markClean
  };

  return {
    state,
    actions,
    loading: quizLoading || questionsLoading,
    error: quizError || questionsError,
    currentQuestion: state.questions[state.currentQuestionIndex] || null
  };
};
