// =============================================================================
// CONTEXTO DO EDITOR DE QUIZ - ESTADO GLOBAL
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Quiz, Question, EditorSettings } from '@shared/types/supabase';
import { supabase } from '@shared/lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface EditorState {
  // Estado do editor
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  
  // Quiz atual
  currentQuiz: Quiz | null;
  questions: Question[];
  
  // UI
  selectedQuestionId: string | null;
  previewMode: boolean;
  sidebarVisible: boolean;
  
  // Configurações
  settings: EditorSettings;
  
  // Erros
  error: string | null;
}

export interface EditorContextType {
  state: EditorState;
  
  // Ações do quiz
  createQuiz: (quizData: Partial<Quiz>) => Promise<void>;
  loadQuiz: (quizId: string) => Promise<void>;
  saveQuiz: () => Promise<void>;
  updateQuiz: (updates: Partial<Quiz>) => void;
  duplicateQuiz: () => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  
  // Ações das perguntas
  addQuestion: (questionData: Partial<Question>) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  reorderQuestions: (questionIds: string[]) => void;
  selectQuestion: (questionId: string | null) => void;
  
  // Ações da UI
  togglePreview: () => void;
  toggleSidebar: () => void;
  setError: (error: string | null) => void;
  
  // Configurações
  updateSettings: (settings: Partial<EditorSettings>) => void;
}

// =============================================================================
// REDUCER
// =============================================================================

type EditorAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_QUIZ'; payload: Quiz }
  | { type: 'UPDATE_QUIZ'; payload: Partial<Quiz> }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'UPDATE_QUESTION'; payload: { id: string; updates: Partial<Question> } }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'REORDER_QUESTIONS'; payload: string[] }
  | { type: 'SELECT_QUESTION'; payload: string | null }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<EditorSettings> };

const initialState: EditorState = {
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,
  currentQuiz: null,
  questions: [],
  selectedQuestionId: null,
  previewMode: false,
  sidebarVisible: true,
  settings: {
    autosave: true,
    autosaveInterval: 30000, // 30 segundos
    previewOnChange: true,
    darkMode: false,
    layout: 'three-panel',
  },
  error: null,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
      
    case 'SET_QUIZ':
      return { 
        ...state, 
        currentQuiz: action.payload,
        hasUnsavedChanges: false,
        error: null 
      };
      
    case 'UPDATE_QUIZ':
      return { 
        ...state, 
        currentQuiz: state.currentQuiz ? { ...state.currentQuiz, ...action.payload } : null,
        hasUnsavedChanges: true 
      };
      
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
      
    case 'ADD_QUESTION':
      return { 
        ...state, 
        questions: [...state.questions, action.payload],
        hasUnsavedChanges: true 
      };
      
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? { ...q, ...action.payload.updates } : q
        ),
        hasUnsavedChanges: true
      };
      
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload),
        selectedQuestionId: state.selectedQuestionId === action.payload ? null : state.selectedQuestionId,
        hasUnsavedChanges: true
      };
      
    case 'REORDER_QUESTIONS':
      const reorderedQuestions = action.payload.map((id, index) => {
        const question = state.questions.find(q => q.id === id);
        return question ? { ...question, order_index: index } : null;
      }).filter(Boolean) as Question[];
      
      return {
        ...state,
        questions: reorderedQuestions,
        hasUnsavedChanges: true
      };
      
    case 'SELECT_QUESTION':
      return { ...state, selectedQuestionId: action.payload };
      
    case 'TOGGLE_PREVIEW':
      return { ...state, previewMode: !state.previewMode };
      
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarVisible: !state.sidebarVisible };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };
      
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
      
    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor deve ser usado dentro de um EditorProvider');
  }
  return context;
};

// =============================================================================
// PROVIDER
// =============================================================================

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // =============================================================================
  // AÇÕES DO QUIZ
  // =============================================================================

  const createQuiz = useCallback(async (quizData: Partial<Quiz>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('quizzes')
        .insert([{
          title: quizData.title || 'Novo Quiz',
          description: quizData.description || '',
          category: quizData.category || 'geral',
          difficulty: quizData.difficulty || 'medium',
          time_limit: quizData.time_limit || null,
          is_public: false,
          is_published: false,
          settings: quizData.settings || {},
        }])
        .select()
        .single();

      if (error) throw error;
      
      dispatch({ type: 'SET_QUIZ', payload: data });
      dispatch({ type: 'SET_QUESTIONS', payload: [] });
      
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar quiz' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadQuiz = useCallback(async (quizId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Carregar quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;
      
      // Carregar perguntas
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsError) throw questionsError;
      
      dispatch({ type: 'SET_QUIZ', payload: quiz });
      dispatch({ type: 'SET_QUESTIONS', payload: questions || [] });
      
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar quiz' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const saveQuiz = useCallback(async () => {
    if (!state.currentQuiz) return;
    
    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      
      // Salvar quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title: state.currentQuiz.title,
          description: state.currentQuiz.description,
          category: state.currentQuiz.category,
          difficulty: state.currentQuiz.difficulty,
          time_limit: state.currentQuiz.time_limit,
          is_public: state.currentQuiz.is_public,
          is_published: state.currentQuiz.is_published,
          settings: state.currentQuiz.settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.currentQuiz.id);

      if (quizError) throw quizError;
      
      // Salvar perguntas
      const questionsToUpdate = state.questions.filter(q => q.id);
      const questionsToInsert = state.questions.filter(q => !q.id);
      
      // Atualizar perguntas existentes
      for (const question of questionsToUpdate) {
        const { error } = await supabase
          .from('questions')
          .update({
            question_text: question.question_text,
            question_type: question.question_type,
            options: question.options,
            correct_answers: question.correct_answers,
            points: question.points,
            explanation: question.explanation,
            media_url: question.media_url,
            order_index: question.order_index,
          })
          .eq('id', question.id);
          
        if (error) throw error;
      }
      
      // Inserir novas perguntas
      if (questionsToInsert.length > 0) {
        const { data, error } = await supabase
          .from('questions')
          .insert(questionsToInsert.map(q => ({
            quiz_id: state.currentQuiz!.id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            correct_answers: q.correct_answers,
            points: q.points || 1,
            explanation: q.explanation,
            media_url: q.media_url,
            order_index: q.order_index,
          })))
          .select();
          
        if (error) throw error;
        
        // Atualizar IDs das perguntas inseridas
        if (data) {
          dispatch({ type: 'SET_QUESTIONS', payload: [...questionsToUpdate, ...data] });
        }
      }
      
      dispatch({ type: 'SET_UNSAVED_CHANGES', payload: false });
      
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar quiz' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.currentQuiz, state.questions]);

  const updateQuiz = useCallback((updates: Partial<Quiz>) => {
    dispatch({ type: 'UPDATE_QUIZ', payload: updates });
  }, []);

  const duplicateQuiz = useCallback(async () => {
    if (!state.currentQuiz) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Criar cópia do quiz
      const { data: newQuiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([{
          title: `${state.currentQuiz.title} (Cópia)`,
          description: state.currentQuiz.description,
          category: state.currentQuiz.category,
          difficulty: state.currentQuiz.difficulty,
          time_limit: state.currentQuiz.time_limit,
          is_public: false,
          is_published: false,
          settings: state.currentQuiz.settings,
        }])
        .select()
        .single();

      if (quizError) throw quizError;
      
      // Duplicar perguntas
      if (state.questions.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(state.questions.map(q => ({
            quiz_id: newQuiz.id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            correct_answers: q.correct_answers,
            points: q.points,
            explanation: q.explanation,
            media_url: q.media_url,
            order_index: q.order_index,
          })));
          
        if (questionsError) throw questionsError;
      }
      
      // Carregar o novo quiz
      await loadQuiz(newQuiz.id);
      
    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao duplicar quiz' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentQuiz, state.questions, loadQuiz]);

  const deleteQuiz = useCallback(async (quizId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;
      
      // Se é o quiz atual, limpar estado
      if (state.currentQuiz?.id === quizId) {
        dispatch({ type: 'SET_QUIZ', payload: null as any });
        dispatch({ type: 'SET_QUESTIONS', payload: [] });
      }
      
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar quiz' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentQuiz]);

  // =============================================================================
  // AÇÕES DAS PERGUNTAS
  // =============================================================================

  const addQuestion = useCallback((questionData: Partial<Question>) => {
    const newQuestion: Question = {
      id: `temp_${Date.now()}`, // ID temporário
      quiz_id: state.currentQuiz?.id || '',
      question_text: questionData.question_text || '',
      question_type: questionData.question_type || 'multiple_choice',
      options: questionData.options || [],
      correct_answers: questionData.correct_answers || [],
      points: questionData.points || 1,
      time_limit: questionData.time_limit || null,
      required: questionData.required ?? true,
      explanation: questionData.explanation || null,
      hint: questionData.hint || null,
      media_url: questionData.media_url || null,
      media_type: questionData.media_type || null,
      order_index: state.questions.length,
      tags: questionData.tags || [],
      created_at: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
    dispatch({ type: 'SELECT_QUESTION', payload: newQuestion.id });
  }, [state.currentQuiz, state.questions.length]);

  const updateQuestion = useCallback((questionId: string, updates: Partial<Question>) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { id: questionId, updates } });
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    dispatch({ type: 'DELETE_QUESTION', payload: questionId });
  }, []);

  const reorderQuestions = useCallback((questionIds: string[]) => {
    dispatch({ type: 'REORDER_QUESTIONS', payload: questionIds });
  }, []);

  const selectQuestion = useCallback((questionId: string | null) => {
    dispatch({ type: 'SELECT_QUESTION', payload: questionId });
  }, []);

  // =============================================================================
  // AÇÕES DA UI
  // =============================================================================

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const updateSettings = useCallback((settings: Partial<EditorSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // =============================================================================
  // AUTOSAVE
  // =============================================================================

  useEffect(() => {
    if (!state.settings.autosave || !state.hasUnsavedChanges || !state.currentQuiz) {
      return;
    }

    const timer = setTimeout(() => {
      saveQuiz();
    }, state.settings.autosaveInterval);

    return () => clearTimeout(timer);
  }, [state.hasUnsavedChanges, state.settings.autosave, state.settings.autosaveInterval, state.currentQuiz, saveQuiz]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: EditorContextType = {
    state,
    createQuiz,
    loadQuiz,
    saveQuiz,
    updateQuiz,
    duplicateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    selectQuestion,
    togglePreview,
    toggleSidebar,
    setError,
    updateSettings,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// =============================================================================
// TIPOS ADICIONAIS
// =============================================================================

// EditorSettings já está definido em @shared/types/supabase
