/**
 * 🎯 QUIZ ROUTE CONTROLLER - FASE 3
 *
 * Controlador inteligente de rotas que decide qual sistema usar
 * baseado em feature flags e validação automática
 */

import { UnifiedQuizRouter } from '@/components/router/UnifiedQuizRouter';
import { initializeQuizSystem } from '@/config/SystemConfig';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useEffect, useState } from 'react';

interface QuizRouteControllerProps {
  fallbackComponent?: React.ComponentType;
}

/**
 * 🎛️ Controlador principal de rotas do quiz
 */
export const QuizRouteController: React.FC<QuizRouteControllerProps> = ({
  fallbackComponent: FallbackComponent,
}) => {
  const flags = useFeatureFlags();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🚀 Inicialização do sistema
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Inicializando Quiz Route Controller...');

        // Inicializar configurações do sistema
        await initializeQuizSystem();

        setIsInitialized(true);
        console.log('✅ Quiz Route Controller inicializado com sucesso');
      } catch (err) {
        console.error('🚫 Erro na inicialização:', err);
        setError(String(err));
      }
    };

    initialize();
  }, []);

  /**
   * 🔄 Renderização condicional baseada em flags
   */
  if (!isInitialized) {
    return <QuizLoadingState />;
  }

  if (error) {
    return <QuizErrorState error={error} fallback={FallbackComponent} />;
  }

  // Decisão de qual sistema usar
  const shouldUseUnified = flags.shouldUseUnifiedSystem();

  if (shouldUseUnified) {
    console.log('🆕 Usando sistema UNIFICADO');
    return <UnifiedQuizRouter enableValidation={flags.shouldValidateCompatibility()} />;
  } else {
    console.log('🔗 Usando sistema LEGADO (fallback)');
    return <LegacyQuizFallback fallback={FallbackComponent} />;
  }
};

/**
 * ⏳ Estado de carregamento
 */
const QuizLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Inicializando Quiz</h3>
          <p className="text-sm text-gray-600">Carregando sistema otimizado...</p>
        </div>
      </div>
    </div>
  );
};

/**
 * 🚫 Estado de erro
 */
interface QuizErrorStateProps {
  error: string;
  fallback?: React.ComponentType;
}

const QuizErrorState: React.FC<QuizErrorStateProps> = ({ error, fallback: FallbackComponent }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleFallback = () => {
    if (FallbackComponent) {
      // Redirecionar para componente de fallback
      window.location.href = '/quiz';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-md mx-auto text-center space-y-6 p-8">
        <div className="text-6xl">⚠️</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Erro na Inicialização</h2>
          <p className="text-gray-600">Ocorreu um problema ao carregar o sistema do quiz.</p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-left">
            <p className="text-sm text-red-800 font-mono break-all">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>

          <button
            onClick={handleFallback}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Versão Clássica
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 🔗 Fallback para sistema legado
 */
interface LegacyQuizFallbackProps {
  fallback?: React.ComponentType;
}

const LegacyQuizFallback: React.FC<LegacyQuizFallbackProps> = ({ fallback: FallbackComponent }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [LegacyComponent, setLegacyComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadLegacyComponent = async () => {
      try {
        // Importar componente legado dinamicamente
        const { default: ProductionQuizPage } = await import('@/pages/ProductionQuizPage');
        setLegacyComponent(() => ProductionQuizPage);
      } catch (error) {
        console.error('🚫 Erro ao carregar componente legado:', error);

        if (FallbackComponent) {
          setLegacyComponent(() => FallbackComponent);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLegacyComponent();
  }, [FallbackComponent]);

  if (isLoading) {
    return <QuizLoadingState />;
  }

  if (!LegacyComponent) {
    return (
      <QuizErrorState
        error="Não foi possível carregar nenhum sistema do quiz"
        fallback={FallbackComponent}
      />
    );
  }

  return <LegacyComponent />;
};

/**
 * 🎮 Hook para controle manual do sistema (desenvolvimento)
 */
export const useQuizRouteControl = () => {
  const flags = useFeatureFlags();

  const switchToUnified = () => {
    flags.setFlag('useUnifiedQuizSystem', true);
    console.log('🔄 Switched to Unified System - Reloading...');
    setTimeout(() => window.location.reload(), 500);
  };

  const switchToLegacy = () => {
    flags.setFlag('useUnifiedQuizSystem', false);
    console.log('🔄 Switched to Legacy System - Reloading...');
    setTimeout(() => window.location.reload(), 500);
  };

  const getCurrentSystem = () => {
    return flags.shouldUseUnifiedSystem() ? 'unified' : 'legacy';
  };

  return {
    currentSystem: getCurrentSystem(),
    switchToUnified,
    switchToLegacy,
    flags: flags.flags,
  };
};

// Exportar helpers para console de debug
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).quizRoute = {
    switchToUnified: () => {
      const flags = useFeatureFlags();
      flags.setFlag('useUnifiedQuizSystem', true);
      window.location.reload();
    },
    switchToLegacy: () => {
      const flags = useFeatureFlags();
      flags.setFlag('useUnifiedQuizSystem', false);
      window.location.reload();
    },
    getCurrentSystem: () => {
      const flags = useFeatureFlags();
      return flags.shouldUseUnifiedSystem() ? 'unified' : 'legacy';
    },
  };

  console.log('🎮 Quiz route controls disponíveis em window.quizRoute');
}

export default QuizRouteController;
