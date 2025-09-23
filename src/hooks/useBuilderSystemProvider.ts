/**
 * 🎯 BUILDER SYSTEM PROVIDER HOOK - FASE 3
 * 
 * Hook consolidado para fornecer funcionalidades do Builder System
 * com compatibilidade entre diferentes providers
 */

import { createContext, useContext } from 'react';

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
        console.log('🤖 Builder System: Generate quiz (fallback):', prompt);
        return null;
      },
      optimizeFunnel: async () => {
        console.log('⚡ Builder System: Optimize funnel (fallback)');
      },
      improveWithAI: async () => {
        console.log('🚀 Builder System: Improve with AI (fallback)');
        return null;
      },
      applyTemplate: async (templateId: string) => {
        console.log('🎨 Builder System: Apply template (fallback):', templateId);
      },
      saveAsTemplate: async (name: string) => {
        console.log('💾 Builder System: Save as template (fallback):', name);
      },
      quickOptimize: () => {
        console.log('⚡ Builder System: Quick optimize (fallback)');
      },
      quickValidate: () => {
        console.log('✅ Builder System: Quick validate (fallback)');
      },
      quickPreview: () => {
        console.log('👁️ Builder System: Quick preview (fallback)');
      },
      isGenerating: false,
      isOptimizing: false,
      currentTemplate: undefined
    };
  }
  return context;
};

export const BuilderSystemProvider = BuilderSystemContext.Provider;
export default BuilderSystemContext;