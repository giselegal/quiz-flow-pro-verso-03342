
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Question {
  id: string;
  text: string;
  type: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  required: boolean;
  hint?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  is_public: boolean | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

interface EditorState {
  quiz: Quiz | null;
  selectedQuestionId: string | null;
  isPreview: boolean;
  isSidebarOpen: boolean;
  loading: boolean;
  error: string | null;
}

interface EditorContextType {
  activeTab: string;
  blockSearch: string;
  availableBlocks: any[];
  setActiveTab: (tab: string) => void;
  setBlockSearch: (search: string) => void;
  handleAddBlock: (type: string) => void;
  
  // Quiz editor specific properties
  state: EditorState;
  loadQuiz: (id: string) => Promise<void>;
  createQuiz: (quiz: Partial<Quiz>) => Promise<void>;
  saveQuiz: () => Promise<void>;
  togglePreview: () => void;
  toggleSidebar: () => void;
  setError: (error: string | null) => void;
  updateQuiz: (updates: Partial<Quiz>) => void;
  selectQuestion: (questionId: string | null) => void;
  addQuestion: () => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [blockSearch, setBlockSearch] = useState('');
  const [state, setState] = useState<EditorState>({
    quiz: null,
    selectedQuestionId: null,
    isPreview: false,
    isSidebarOpen: true,
    loading: false,
    error: null
  });

  const availableBlocks = [
    { type: 'header', name: 'Cabeçalho', icon: '📄', category: 'content' },
    { type: 'text', name: 'Texto', icon: '📝', category: 'content' },
    { type: 'image', name: 'Imagem', icon: '🖼️', category: 'content' },
    { type: 'button', name: 'Botão', icon: '🔘', category: 'content' },
    { type: 'spacer', name: 'Espaçador', icon: '⬜', category: 'layout' },
    { type: 'quiz-question', name: 'Questão Quiz', icon: '❓', category: 'quiz' },
    { type: 'testimonial', name: 'Depoimento', icon: '💬', category: 'content' }
  ];

  const handleAddBlock = useCallback((type: string) => {
    console.log('Adding block:', type);
  }, []);

  const loadQuiz = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Simulate API call
      const mockQuiz: Quiz = {
        id,
        title: 'Quiz Exemplo',
        description: 'Descrição do quiz',
        author_id: 'user-1',
        category: 'general',
        difficulty: 'medium',
        time_limit: null,
        is_public: false,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        questions: []
      };
      setState(prev => ({ ...prev, quiz: mockQuiz, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Erro ao carregar quiz', loading: false }));
    }
  }, []);

  const createQuiz = useCallback(async (quiz: Partial<Quiz>) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: quiz.title || 'Novo Quiz',
        description: quiz.description || null,
        author_id: quiz.author_id || 'user-1',
        category: quiz.category || 'general',
        difficulty: quiz.difficulty || 'medium',
        time_limit: quiz.time_limit || null,
        is_public: quiz.is_public || false,
        is_published: quiz.is_published || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        questions: []
      };
      setState(prev => ({ ...prev, quiz: newQuiz, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Erro ao criar quiz', loading: false }));
    }
  }, []);

  const saveQuiz = useCallback(async () => {
    if (!state.quiz) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Erro ao salvar quiz', loading: false }));
    }
  }, [state.quiz]);

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreview: !prev.isPreview }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateQuiz = useCallback((updates: Partial<Quiz>) => {
    setState(prev => ({
      ...prev,
      quiz: prev.quiz ? { ...prev.quiz, ...updates } : null
    }));
  }, []);

  const selectQuestion = useCallback((questionId: string | null) => {
    setState(prev => ({ ...prev, selectedQuestionId: questionId }));
  }, []);

  const addQuestion = useCallback(() => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: 'Nova pergunta',
      type: 'multiple_choice',
      options: [
        { text: 'Opção 1', isCorrect: false },
        { text: 'Opção 2', isCorrect: false }
      ],
      required: true,
      hint: ''
    };

    setState(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: [...prev.quiz.questions, newQuestion]
      } : null,
      selectedQuestionId: newQuestion.id
    }));
  }, []);

  const updateQuestion = useCallback((questionId: string, updates: Partial<Question>) => {
    setState(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: prev.quiz.questions.map(q =>
          q.id === questionId ? { ...q, ...updates } : q
        )
      } : null
    }));
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    setState(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: prev.quiz.questions.filter(q => q.id !== questionId)
      } : null,
      selectedQuestionId: prev.selectedQuestionId === questionId ? null : prev.selectedQuestionId
    }));
  }, []);

  return (
    <EditorContext.Provider value={{
      activeTab,
      blockSearch,
      availableBlocks,
      setActiveTab,
      setBlockSearch,
      handleAddBlock,
      state,
      loadQuiz,
      createQuiz,
      saveQuiz,
      togglePreview,
      toggleSidebar,
      setError,
      updateQuiz,
      selectQuestion,
      addQuestion,
      updateQuestion,
      deleteQuestion
    }}>
      {children}
    </EditorContext.Provider>
  );
};
