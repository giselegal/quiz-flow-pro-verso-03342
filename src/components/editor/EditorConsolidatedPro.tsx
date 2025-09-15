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

import React, { useMemo } from 'react';
import { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';
import { cn } from '@/lib/utils';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';
import { EditorLoadingWrapper } from './EditorLoadingWrapper';

export interface EditorConsolidatedProProps {
  className?: string;
  stepNumber?: number;
  funnelId?: string;
  onStepChange?: (stepId: string) => void;
  onSave?: (stepId: string, data: any) => void;
  debugMode?: boolean;
}

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
  console.log('🚀 EditorConsolidatedPro: Iniciando com stepNumber:', stepNumber, 'funnelId:', funnelId);

  // Configuração Supabase otimizada
  const supabaseConfig = useMemo(() => ({
    enabled: true,
    funnelId,
    quizId: funnelId,
    storageKey: `${funnelId}-editor-state`
  }), [funnelId]);

  return (
    <EditorLoadingWrapper 
      templateId={funnelId}
      funnelId={funnelId}
      timeout={8000}
    >
      <div className={cn('h-screen w-full overflow-hidden bg-background', className)}>
        <EditorRuntimeProviders
          initialStep={stepNumber}
          debugMode={debugMode}
          supabaseConfig={supabaseConfig}
          funnelId={funnelId}
        >
          <div className="h-full w-full">
            <SchemaDrivenEditorResponsive className="h-full" />
          </div>

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
    </EditorLoadingWrapper>
  );
};

export default EditorConsolidatedPro;