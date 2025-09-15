/**
 * 🎯 EDITOR CONSOLIDADO PRO - ARQUITETURA FINAL
 * 
 * Esta é a implementação final consolidada que combina:
 * ✅ Layout responsivo (FourColumnLayout)
 * ✅ Provider stack unificado (EditorRuntimeProviders)  
 * ✅ Performance otimizada
 * ✅ Todas as 21 etapas carregadas
 * ✅ Sistema de drag & drop unificado
 */

import React, { Suspense, useMemo } from 'react';
import { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

// Lazy loading otimizado
const SchemaDrivenEditorResponsive = React.lazy(() => 
  import('@/components/editor/SchemaDrivenEditorResponsive')
);

export interface EditorConsolidatedProProps {
  className?: string;
  stepNumber?: number;
  funnelId?: string;
  onStepChange?: (stepId: string) => void;
  onSave?: (stepId: string, data: any) => void;
  debugMode?: boolean;
}

const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" className="mx-auto" />
      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground">
          Inicializando Editor Pro Consolidado
        </p>
        <p className="text-sm text-muted-foreground">
          Carregando layout responsivo e 21 etapas...
        </p>
      </div>
    </div>
  </div>
));

/**
 * 🏗️ Editor Consolidado Pro - Implementação Final
 * 
 * Combina todos os benefícios da arquitetura consolidada:
 * - FourColumnLayout responsivo 
 * - Provider stack unificado
 * - Performance otimizada
 * - Carregamento completo das 21 etapas
 */
export const EditorConsolidatedPro: React.FC<EditorConsolidatedProProps> = ({
  className = '',
  stepNumber = 1,
  funnelId = 'quiz-style-21-steps',
  debugMode = false
}) => {
  // Configuração Supabase otimizada
  const supabaseConfig = useMemo(() => ({
    enabled: true,
    funnelId,
    quizId: funnelId,
    storageKey: `${funnelId}-editor-state`
  }), [funnelId]);

  return (
    <div className={cn('h-screen w-full overflow-hidden bg-background', className)}>
      <EditorRuntimeProviders
        initialStep={stepNumber}
        debugMode={debugMode}
        supabaseConfig={supabaseConfig}
        funnelId={funnelId}
      >
        <Suspense fallback={<LoadingFallback />}>
          <div className="h-full w-full">
            <SchemaDrivenEditorResponsive className="h-full" />
          </div>
        </Suspense>

        {/* Indicador de status otimizado */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'bg-green-500 text-white'
          )}>
            ✅ Editor Consolidado Ativo
          </div>
        </div>
      </EditorRuntimeProviders>
    </div>
  );
};

export default EditorConsolidatedPro;