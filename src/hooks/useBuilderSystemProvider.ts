/**
 * 🎯 BUILDER SYSTEM PROVIDER HOOK - FASE 3
 * 
 * Hook consolidado para fornecer funcionalidades do Builder System
 * com compatibilidade entre diferentes providers
 */

import { createContext, useContext } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export interface BuilderSystemContextValue {
  // AI Features
  generateQuiz: (prompt: string) => Promise<any>;
  optimizeFunnel: () => Promise<void>;
  improveWithAI: () => Promise<any>;
  
  // Templates
  applyTemplate: (templateId: string) => Promise<void>;
  saveAsTemplate: (name: string) => Promise<void>;
  
  // Quick Actions
  quickOptimize: () => void;
  quickValidate: () => void;
  quickPreview: () => void;
  
  // State
  isGenerating: boolean;
  isOptimizing: boolean;
  currentTemplate?: string;
}

const BuilderSystemContext = createContext<BuilderSystemContextValue | undefined>(undefined);

export const useBuilderSystem = () => {
  const context = useContext(BuilderSystemContext);
  if (!context) {
    // Fallback para compatibilidade
    return {
      generateQuiz: async (prompt: string) => {
        appLogger.info('🤖 Builder System: Generate quiz (fallback):', { data: [prompt] });
        return null;
      },
      optimizeFunnel: async () => {
        appLogger.info('⚡ Builder System: Optimize funnel (fallback)');
      },
      improveWithAI: async () => {
        appLogger.info('🚀 Builder System: Improve with AI (fallback)');
        return null;
      },
      applyTemplate: async (templateId: string) => {
        appLogger.info('🎨 Builder System: Apply template (fallback):', { data: [templateId] });
      },
      saveAsTemplate: async (name: string) => {
        appLogger.info('💾 Builder System: Save as template (fallback):', { data: [name] });
      },
      quickOptimize: () => {
        appLogger.info('⚡ Builder System: Quick optimize (fallback)');
      },
      quickValidate: () => {
        appLogger.info('✅ Builder System: Quick validate (fallback)');
      },
      quickPreview: () => {
        appLogger.info('👁️ Builder System: Quick preview (fallback)');
      },
      isGenerating: false,
      isOptimizing: false,
      currentTemplate: undefined,
    };
  }
  return context;
};

export const BuilderSystemProvider = BuilderSystemContext.Provider;
export default BuilderSystemContext;