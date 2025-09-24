/**
 * 🔄 HYBRID PROVIDER STACK
 * 
 * Stack híbrido que combina Clean Architecture com Legacy
 * para migração gradual sem quebrar funcionalidades existentes
 */

import React, { ReactNode } from 'react';
import CleanArchitectureProvider from './CleanArchitectureProvider';
import { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';

interface HybridProviderStackProps {
  children: ReactNode;
  funnelId?: string;
  initialStep?: number;
  debugMode?: boolean;
  useCleanArchitecture?: boolean;
  supabaseConfig?: {
    enabled: boolean;
    funnelId?: string;
    quizId?: string;
    storageKey?: string;
  };
}

/**
 * 🔄 Stack Híbrido de Providers
 * 
 * Ordem de providers otimizada:
 * 1. CleanArchitectureProvider (nova arquitetura)
 * 2. EditorRuntimeProviders (legacy, para compatibilidade)
 */
const HybridProviderStack: React.FC<HybridProviderStackProps> = ({
  children,
  funnelId,
  initialStep,
  debugMode = false,
  useCleanArchitecture = true,
  supabaseConfig = { enabled: false }
}) => {
  if (debugMode) {
    console.log('🔄 HybridProviderStack: Iniciando stack híbrido', {
      funnelId,
      initialStep,
      useCleanArchitecture,
      supabaseConfig
    });
  }

  // 🎯 STACK COM CLEAN ARCHITECTURE
  if (useCleanArchitecture) {
    return (
      <CleanArchitectureProvider
        funnelId={funnelId}
        debugMode={debugMode}
      >
        <EditorRuntimeProviders
          funnelId={funnelId}
          initialStep={initialStep}
          debugMode={debugMode}
          supabaseConfig={supabaseConfig}
        >
          {children}
        </EditorRuntimeProviders>
      </CleanArchitectureProvider>
    );
  }

  // 🔄 FALLBACK PARA LEGACY
  return (
    <EditorRuntimeProviders
      funnelId={funnelId}
      initialStep={initialStep}
      debugMode={debugMode}
      supabaseConfig={supabaseConfig}
    >
      {children}
    </EditorRuntimeProviders>
  );
};

export default HybridProviderStack;