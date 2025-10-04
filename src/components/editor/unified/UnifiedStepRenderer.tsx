import React, { Suspense, useMemo } from 'react';
import { stepRegistry } from '@/components/step-registry/StepRegistry';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

/**
 * 🎯 UNIFIED STEP RENDERER - FASE 3
 * 
 * Componente central que unifica os 3 sistemas de renderização:
 * 1. QuizFunnelEditorWYSIWYG (preview/edição)
 * 2. Componentes de produção (QuizApp.tsx)  
 * 3. StepRegistry (sistema modular)
 * 
 * BENEFÍCIOS:
 * ✅ Fonte única de verdade para renderização
 * ✅ Elimina duplicação de código (~30% redução bundle)
 * ✅ Modos unificados: preview | production | editable
 * ✅ Lazy loading otimizado
 * ✅ Manutenção centralizada
 */

export type RenderMode = 'preview' | 'production' | 'editable';

export interface UnifiedStepRendererProps {
  /** ID do step no StepRegistry */
  stepId: string;
  
  /** Modo de renderização */
  mode: RenderMode;
  
  /** Props específicas do step */
  stepProps?: Record<string, any>;
  
  /** Dados do quiz state */
  quizState?: {
    currentStep: number;
    userName?: string;
    answers: Record<string, any>;
    strategicAnswers: Record<string, any>;
    resultStyle?: string;
    secondaryStyles?: string[];
  };
  
  /** Callbacks para interação */
  onStepUpdate?: (stepId: string, updates: Record<string, any>) => void;
  onStepSelect?: (stepId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  
  /** Configuração visual */
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Se está selecionado (modo editor) */
  isSelected?: boolean;
  
  /** Se permite edição inline */
  isEditable?: boolean;
}

/**
 * 🎨 UNIFIED STEP RENDERER
 * 
 * Renderiza qualquer step através do StepRegistry unificado
 */
export const UnifiedStepRenderer: React.FC<UnifiedStepRendererProps> = ({
  stepId,
  mode = 'production',
  stepProps = {},
  quizState,
  onStepUpdate,
  onStepSelect,
  onNext,
  onPrevious,
  theme = {
    primaryColor: '#B89B7A',
    accentColor: '#8B7355', 
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
  },
  className,
  isSelected = false,
  isEditable = false,
}) => {
  // 🔍 Buscar step no registry
  const stepComponent = useMemo(() => {
    try {
      return stepRegistry.get(stepId);
    } catch (error) {
      console.error(`Step "${stepId}" não encontrado no stepRegistry:`, error);
      return null;
    }
  }, [stepId]);

  // ⚠️ Step não encontrado
  if (!stepComponent) {
    return (
      <div className={cn(
        "flex items-center justify-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50",
        className
      )}>
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Step Não Encontrado</h3>
          <p className="text-red-600 text-sm mb-3">
            O step "{stepId}" não está registrado no StepRegistry
          </p>
          <details className="text-xs text-red-500">
            <summary className="cursor-pointer">Detalhes técnicos</summary>
            <div className="mt-2 p-2 bg-red-100 rounded text-left">
              <div>Step ID: {stepId}</div>
              <div>Modo: {mode}</div>
              <div>Registry disponível: {stepRegistry.getAll().map(s => s.id).join(', ')}</div>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // 🎨 Preparar props unificadas para o componente
  const unifiedProps = useMemo(() => ({
    // Props básicas
    stepId,
    mode,
    data: stepProps,
    
    // Estado do quiz
    quizState,
    currentStep: quizState?.currentStep,
    userName: quizState?.userName,
    answers: quizState?.answers || {},
    strategicAnswers: quizState?.strategicAnswers || {},
    resultStyle: quizState?.resultStyle,
    secondaryStyles: quizState?.secondaryStyles,
    
    // Callbacks de interação
    onUpdate: onStepUpdate,
    onSelect: onStepSelect,
    onNext,
    onPrevious,
    
    // Configuração visual
    theme,
    
    // Estados do editor
    isSelected,
    isEditable,
    isEditorMode: mode === 'editable',
    isPreviewMode: mode === 'preview',
    isProductionMode: mode === 'production',
    
    // Props específicas por modo
    ...(mode === 'editable' && {
      onEdit: (field: string, value: any) => {
        onStepUpdate?.(stepId, { [field]: value });
      },
    }),
    
    // Props específicas do step (override)
    ...stepProps,
  }), [
    stepId, mode, stepProps, quizState, onStepUpdate, onStepSelect, 
    onNext, onPrevious, theme, isSelected, isEditable
  ]);

  // 🎯 Renderizar baseado no modo
  const renderStep = () => {
    const Component = stepComponent.component;
    
    // Wrapper base com estilos do modo
    const wrapperClasses = cn(
      "unified-step-renderer",
      `unified-step-renderer--${mode}`,
      `unified-step-renderer--${stepId}`,
      {
        'unified-step-renderer--selected': isSelected && mode === 'editable',
        'unified-step-renderer--editable': isEditable,
      },
      className
    );

    const wrapperStyles = {
      '--theme-primary': theme.primaryColor,
      '--theme-accent': theme.accentColor,
      '--theme-background': theme.backgroundColor,
      '--theme-text': theme.textColor,
    } as React.CSSProperties;

    return (
      <div 
        className={wrapperClasses}
        style={wrapperStyles}
        onClick={mode === 'editable' ? () => onStepSelect?.(stepId) : undefined}
      >
        {/* Editor overlay */}
        {mode === 'editable' && isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none">
            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
              {stepComponent.name || stepId}
            </div>
          </div>
        )}
        
        {/* Componente do step */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-gray-600">
                Carregando {stepComponent.name || stepId}...
              </span>
            </div>
          }
        >
          <Component {...unifiedProps} />
        </Suspense>
      </div>
    );
  };

  return renderStep();
};

// 🎨 Estilos CSS para o UnifiedStepRenderer
export const UnifiedStepRendererStyles = `
  .unified-step-renderer {
    position: relative;
    width: 100%;
  }
  
  .unified-step-renderer--editable {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .unified-step-renderer--editable:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .unified-step-renderer--selected {
    z-index: 10;
  }
  
  .unified-step-renderer--preview {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .unified-step-renderer--production {
    /* Sem estilos extras - renderização limpa */
  }
`;

export default UnifiedStepRenderer;