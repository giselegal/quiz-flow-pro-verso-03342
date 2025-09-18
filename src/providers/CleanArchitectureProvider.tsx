/**
 * 🏗️ CLEAN ARCHITECTURE PROVIDER
 * 
 * Provider Bridge que encapsula a nova Clean Architecture
 * mantendo compatibilidade com o sistema existente
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { QuizService } from '@/application/services/QuizService';
import { FunnelService } from '@/application/services/FunnelService';
import { EditorService } from '@/application/services/EditorService';

// 🎯 TIPOS DO CONTEXTO
interface CleanArchitectureContextValue {
  // Services
  quizService: QuizService;
  funnelService: FunnelService;
  editorService: EditorService;
  
  // Feature Flags
  featureFlags: {
    useCleanArchitecture: boolean;
    enableNewEditor: boolean;
    enableOptimizedPanels: boolean;
  };
  
  // Status
  isInitialized: boolean;
  error: string | null;
}

// 🏗️ CONTEXTO
const CleanArchitectureContext = createContext<CleanArchitectureContextValue | null>(null);

// 🎯 PROVIDER PROPS
interface CleanArchitectureProviderProps {
  children: ReactNode;
  enableCleanArchitecture?: boolean;
  debugMode?: boolean;
  fallbackToLegacy?: boolean;
}

/**
 * 🏗️ Provider Bridge - Clean Architecture
 * 
 * Encapsula a nova arquitectura mantendo compatibilidade total
 */
export const CleanArchitectureProvider: React.FC<CleanArchitectureProviderProps> = ({
  children,
  enableCleanArchitecture = true,
  debugMode = false,
  fallbackToLegacy = true
}) => {
  // 🏗️ ESTADO
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔧 SERVICES (singleton instances)
  const [services] = useState(() => ({
    quizService: new QuizService(),
    funnelService: new FunnelService(),
    editorService: new EditorService()
  }));

  // 🚩 FEATURE FLAGS
  const [featureFlags] = useState(() => ({
    useCleanArchitecture: enableCleanArchitecture,
    enableNewEditor: true,
    enableOptimizedPanels: true
  }));

  // 🔄 INICIALIZAÇÃO
  useEffect(() => {
    const initializeServices = async () => {
      try {
        if (debugMode) {
          console.log('🏗️ CleanArchitectureProvider: Inicializando services...');
        }

        // Inicializar services se necessário
        await Promise.all([
          // services podem ter métodos de inicialização futuros
        ]);

        setIsInitialized(true);
        
        if (debugMode) {
          console.log('✅ CleanArchitectureProvider: Services inicializados');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        
        if (debugMode) {
          console.error('❌ CleanArchitectureProvider: Erro na inicialização:', err);
        }
      }
    };

    initializeServices();
  }, [debugMode]);

  // 🎯 CONTEXT VALUE
  const contextValue: CleanArchitectureContextValue = {
    quizService: services.quizService,
    funnelService: services.funnelService,
    editorService: services.editorService,
    featureFlags,
    isInitialized,
    error
  };

  // 💥 ERROR STATE
  if (error && !fallbackToLegacy) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">Erro na Clean Architecture</div>
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <CleanArchitectureContext.Provider value={contextValue}>
      {children}
    </CleanArchitectureContext.Provider>
  );
};

/**
 * 🪝 HOOK PARA USAR CLEAN ARCHITECTURE
 */
export const useCleanArchitecture = (): CleanArchitectureContextValue => {
  const context = useContext(CleanArchitectureContext);
  
  if (!context) {
    throw new Error(
      'useCleanArchitecture must be used within a CleanArchitectureProvider'
    );
  }
  
  return context;
};

/**
 * 🎯 HOOK PARA FEATURE FLAGS
 */
export const useFeatureFlags = () => {
  const { featureFlags } = useCleanArchitecture();
  return featureFlags;
};

/**
 * 🔧 HOOK PARA SERVICES
 */
export const useServices = () => {
  const { quizService, funnelService, editorService } = useCleanArchitecture();
  return { quizService, funnelService, editorService };
};

export default CleanArchitectureProvider;