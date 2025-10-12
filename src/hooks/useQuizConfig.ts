import { useState, useEffect } from 'react';
import { StorageService } from '@/services/core/StorageService';

// Tipos para configuração do quiz editável
export interface QuizStep {
  id: string;
  title: string;
  type: 'intro' | 'question' | 'transition' | 'loading' | 'result' | 'offer';
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: QuizComponent[];
}

export interface QuizComponent {
  id: string;
  type: string;
  data: Record<string, any>;
  style?: Record<string, any>;
}

export interface QuizFunnel {
  id: string;
  name: string;
  pages: QuizStep[];
  variants?: any[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    points: Record<string, number>;
  }>;
}

/**
 * Hook para acessar configurações do quiz criadas no SimpleDragDropEditor
 * Conecta o editor visual com o quiz funcional
 */
export const useQuizConfig = () => {
  const [quizConfig, setQuizConfig] = useState<QuizFunnel | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega configurações do localStorage (salvas pelo editor)
  const loadQuizConfig = () => {
    try {
      const savedConfig = StorageService.safeGetString('quiz_funnel_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setQuizConfig(config);

        // Extrai questões das páginas configuradas
        const questions = extractQuestionsFromConfig(config);
        setQuizQuestions(questions);

        console.log('📥 Configuração do quiz carregada:', {
          pages: config.pages?.length || 0,
          questions: questions.length,
        });
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração do quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extrai questões das páginas configuradas no editor
  const extractQuestionsFromConfig = (config: QuizFunnel): QuizQuestion[] => {
    if (!config.pages) return [];

    const questions: QuizQuestion[] = [];

    config.pages.forEach(page => {
      if (page.type === 'question' && page.components) {
        // Procura por componentes de questão
        page.components.forEach(component => {
          if (component.type === 'options' && component.data?.options) {
            const question: QuizQuestion = {
              id: page.id,
              text: component.data.text || `Questão ${questions.length + 1}`,
              options: component.data.options.map((opt: any) => ({
                id: opt.id || `${page.id}_${opt.text}`,
                text: opt.text,
                points: opt.points || {},
              })),
            };
            questions.push(question);
          }
        });
      }
    });

    return questions;
  };

  // Busca uma página específica por tipo
  const getPageByType = (type: string) => {
    return quizConfig?.pages?.find(page => page.type === type) || null;
  };

  // Busca componentes de uma página por tipo
  const getComponentsByType = (pageType: string, componentType: string) => {
    const page = getPageByType(pageType);
    return page?.components?.filter(comp => comp.type === componentType) || [];
  };

  // Busca texto de um componente específico
  const getComponentText = (pageType: string, componentType: string, defaultText = '') => {
    const components = getComponentsByType(pageType, componentType);
    return components[0]?.data?.text || defaultText;
  };

  // Recarrega configurações quando localStorage muda
  useEffect(() => {
    loadQuizConfig();

    // Listen for storage changes (quando editor salva)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quiz_funnel_config') {
        loadQuizConfig();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    quizConfig,
    quizQuestions,
    isLoading,
    getPageByType,
    getComponentsByType,
    getComponentText,
    reloadConfig: loadQuizConfig,
  };
};
