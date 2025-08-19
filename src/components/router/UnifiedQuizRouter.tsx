/**
 * 🔄 UNIFIED QUIZ ROUTER
 *
 * Componente que gerencia a transição entre sistema Supabase e sistema CORE
 * Usa feature flags para decidir qual sistema usar
 */

import { UnifiedQuizPage } from '@/pages/unified/UnifiedQuizPage';
import { useSystemValidation } from '@/testing/SystemValidation';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useEffect, useState } from 'react';

interface UnifiedQuizRouterProps {
  children?: React.ReactNode;
  fallbackComponent?: React.ComponentType;
  enableValidation?: boolean;
}

interface SystemStatus {
  activeSystem: 'unified' | 'supabase' | 'fallback';
  isValidating: boolean;
  validationScore?: number;
  lastValidation?: string;
  errors: string[];
}

/**
 * 🎯 Router principal que decide qual sistema usar
 */
export const UnifiedQuizRouter: React.FC<UnifiedQuizRouterProps> = ({
  children,
  fallbackComponent: FallbackComponent,
  enableValidation = false,
}) => {
  const flags = useFeatureFlags();
  const { runValidationSuite } = useSystemValidation();

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    activeSystem: 'supabase',
    isValidating: false,
    errors: [],
  });

  /**
   * 🔍 Validar sistemas na inicialização
   */
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        // Determinar sistema a usar
        const shouldUseUnified = flags.shouldUseUnifiedSystem();
        const shouldValidate = flags.shouldValidateCompatibility() || enableValidation;

        if (shouldValidate && shouldUseUnified) {
          setSystemStatus(prev => ({ ...prev, isValidating: true }));

          const validation = await runValidationSuite();

          console.log('🧪 Validation Results:', validation);

          setSystemStatus(prev => ({
            ...prev,
            isValidating: false,
            validationScore: validation.compatibilityScore,
            lastValidation: new Date().toISOString(),
            activeSystem: validation.compatibilityScore >= 80 ? 'unified' : 'supabase',
          }));
        } else {
          setSystemStatus(prev => ({
            ...prev,
            activeSystem: shouldUseUnified ? 'unified' : 'supabase',
          }));
        }
      } catch (error) {
        console.error('🚫 Erro na inicialização do sistema:', error);
        setSystemStatus(prev => ({
          ...prev,
          isValidating: false,
          activeSystem: flags.shouldAllowFallback() ? 'fallback' : 'supabase',
          errors: [...prev.errors, String(error)],
        }));
      }
    };

    initializeSystem();
  }, [flags, runValidationSuite, enableValidation]);

  /**
   * 🎛️ Render do sistema baseado na configuração
   */
  const renderActiveSystem = () => {
    const { activeSystem } = systemStatus;

    // Log do sistema ativo
    if (flags.shouldLogCompatibility()) {
      console.log(`🎯 Sistema ativo: ${activeSystem}`);
    }

    switch (activeSystem) {
      case 'unified':
        return <UnifiedSystemRenderer />;

      case 'supabase':
        return <SupabaseSystemRenderer />;

      case 'fallback':
        return FallbackComponent ? <FallbackComponent /> : <FallbackSystemRenderer />;

      default:
        return <FallbackSystemRenderer />;
    }
  };

  /**
   * 🔄 Render do status de validação
   */
  const renderValidationStatus = () => {
    if (!flags.shouldValidateCompatibility() || !systemStatus.isValidating) {
      return null;
    }

    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-blue-700 text-sm">Validando compatibilidade...</span>
        </div>
      </div>
    );
  };

  /**
   * 🎮 Debug panel para desenvolvimento
   */
  const renderDebugPanel = () => {
    if (process.env.NODE_ENV !== 'development' || !flags.shouldLogCompatibility()) {
      return null;
    }

    return (
      <div className="fixed bottom-4 left-4 bg-gray-900 text-white rounded-lg p-4 text-xs max-w-sm">
        <div className="font-bold mb-2">🔧 Debug Panel</div>
        <div>Sistema: {systemStatus.activeSystem}</div>
        <div>Score: {systemStatus.validationScore?.toFixed(1)}%</div>
        <div>Flags: {JSON.stringify(flags.flags, null, 2)}</div>
        {systemStatus.errors.length > 0 && (
          <div className="mt-2 text-red-300">Erros: {systemStatus.errors.join(', ')}</div>
        )}
      </div>
    );
  };

  return (
    <div className="unified-quiz-router">
      {renderValidationStatus()}
      {renderActiveSystem()}
      {renderDebugPanel()}
      {children}
    </div>
  );
};

/**
 * 🆕 Renderer do sistema unificado
 */
const UnifiedSystemRenderer: React.FC = () => {
  const flags = useFeatureFlags();

  useEffect(() => {
    if (flags.shouldLogCompatibility()) {
      console.log('🆕 Usando sistema UNIFICADO');
    }
  }, [flags]);

  return <UnifiedQuizPage />;
};

/**
 * 🔗 Renderer do sistema Supabase (compatibilidade)
 */
const SupabaseSystemRenderer: React.FC = () => {
  const flags = useFeatureFlags();

  useEffect(() => {
    if (flags.shouldLogCompatibility()) {
      console.log('🔗 Usando sistema SUPABASE (original)');
    }
  }, [flags]);

  // Lazy load do componente original
  const [OriginalComponent, setOriginalComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadOriginalComponent = async () => {
      try {
        // Importar componente original do Supabase
        const module = await import('@/pages/ProductionQuizPage');
        const ProductionQuizPage = module.default;
        setOriginalComponent(() => ProductionQuizPage);
      } catch (error) {
        console.error('🚫 Erro ao carregar componente original:', error);
        // Fallback para sistema unificado
        setOriginalComponent(() => UnifiedQuizPage);
      }
    };

    loadOriginalComponent();
  }, []);

  if (!OriginalComponent) {
    return <LoadingSpinner />;
  }

  return <OriginalComponent />;
};

/**
 * ⚠️ Renderer de fallback
 */
const FallbackSystemRenderer: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Sistema Temporariamente Indisponível
        </h2>
        <p className="text-gray-600 mb-4">Estamos trabalhando para resolver o problema.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

/**
 * ⏳ Loading spinner
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

/**
 * 🎯 Hook para controle manual do sistema
 */
export const useQuizSystemControl = () => {
  const flags = useFeatureFlags();

  const switchToUnified = () => {
    flags.setFlag('useUnifiedQuizSystem', true);
    console.log('🔄 Switched to Unified System');
  };

  const switchToSupabase = () => {
    flags.setFlag('useUnifiedQuizSystem', false);
    console.log('🔄 Switched to Supabase System');
  };

  const enableValidation = () => {
    flags.setFlag('enableSystemValidation', true);
    console.log('🧪 Validation enabled');
  };

  const getCurrentSystem = () => {
    if (flags.shouldUseUnifiedSystem()) return 'unified';
    return 'supabase';
  };

  return {
    currentSystem: getCurrentSystem(),
    switchToUnified,
    switchToSupabase,
    enableValidation,
    flags: flags.flags,
  };
};

export default UnifiedQuizRouter;
