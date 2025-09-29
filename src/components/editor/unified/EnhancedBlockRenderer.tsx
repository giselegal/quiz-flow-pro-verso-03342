/**
 * 🎯 FASE 2 - ENHANCED BLOCK RENDERER
 * 
 * Renderizador de blocos com sistema de validação integrado
 * Mostra estados visuais como na versão de produção
 */

import React, { Suspense } from 'react';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ValidationIndicator, ValidationBadge, ValidationState } from './ValidationIndicator';
import { useMockData, useMockStepData } from './MockDataProvider';
import { useStepValidation } from '@/hooks/useStepValidation';

export interface EnhancedBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreview?: boolean;
  currentStep?: number;
  funnelId?: string;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
  onValidationChange?: (blockId: string, isValid: boolean) => void;
  className?: string;
  enableValidation?: boolean;
  enableAutoAdvance?: boolean;
  // Novo: Props para experiência real
  realExperienceProps?: {
    quizState: any;
    selections: Record<string, string[]>;
    userName: string;
    isValidated: boolean;
    canAutoAdvance: boolean;
    onSelectionChange: (selections: string[]) => void;
  };
}

/**
 * Wrapper com validação visual
 */
const ValidationAwareBlockWrapper: React.FC<{
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  validationState: ValidationState;
  validationMessage?: string;
  canAutoAdvance: boolean;
  timeToAutoAdvance: number;
  onSelect?: () => void;
  children: React.ReactNode;
}> = ({ 
  block, 
  isSelected, 
  isPreview, 
  validationState, 
  validationMessage,
  canAutoAdvance,
  timeToAutoAdvance,
  onSelect, 
  children 
}) => {
  const [isHovering, setIsHovering] = React.useState(false);

  if (isPreview) {
    return (
      <div className="relative">
        {canAutoAdvance && timeToAutoAdvance > 0 && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Avançando em {Math.ceil(timeToAutoAdvance / 1000)}s...
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative transition-all duration-200 cursor-pointer group',
        'hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 rounded-lg',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHovering && !isSelected && 'ring-1 ring-primary/20',
        validationState === 'invalid' && 'ring-2 ring-red-500/50',
        validationState === 'valid' && 'ring-2 ring-green-500/30'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-block-id={block.id}
      data-block-type={block.type}
      data-validation-state={validationState}
    >
      {/* Toolbar do bloco */}
      {(isSelected || isHovering) && (
        <div className="absolute -top-8 left-0 z-10 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-lg">
            {block.type}
          </div>
          <div className="bg-stone-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
            {block.id}
          </div>
          {validationState !== 'none' && (
            <ValidationIndicator 
              state={validationState} 
              message={validationMessage}
              size="sm"
            />
          )}
        </div>
      )}
      
      {/* Badge de validação no canto */}
      <ValidationBadge state={validationState} />
      
      {/* Overlay de hover com cor baseada na validação */}
      <div className={cn(
        'absolute inset-0 rounded-lg pointer-events-none transition-opacity',
        (isHovering || isSelected) ? 'opacity-100' : 'opacity-0',
        validationState === 'valid' && 'bg-green-500/5',
        validationState === 'invalid' && 'bg-red-500/5',
        validationState === 'warning' && 'bg-yellow-500/5',
        validationState === 'pending' && 'bg-blue-500/5',
        validationState === 'none' && 'bg-primary/5'
      )} />
      
      {/* Indicador de auto-advance */}
      {canAutoAdvance && timeToAutoAdvance > 0 && (
        <div className="absolute -bottom-8 right-0 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Auto {Math.ceil(timeToAutoAdvance / 1000)}s
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

/**
 * Enhanced Block Renderer com validação
 */
export const EnhancedBlockRenderer: React.FC<EnhancedBlockRendererProps> = ({
  block,
  isSelected = false,
  isPreview = false,
  currentStep = 1,
  funnelId = 'quiz21StepsComplete',
  onSelect,
  onUpdate,
  onValidationChange,
  className = '',
  enableValidation = true,
  enableAutoAdvance = true,
  realExperienceProps,
}) => {
  const Component = getEnhancedBlockComponent(block.type);
  const { simulateValidation } = useMockData();
  const stepData = useMockStepData(currentStep, funnelId);
  
  // Sistema de validação integrado
  const validation = useStepValidation({
    stepNumber: currentStep,
    funnelId,
    autoAdvanceEnabled: enableAutoAdvance && isPreview,
    autoAdvanceDelay: getAutoAdvanceDelay(block.type, currentStep)
  });

  // Determinar estado de validação baseado no tipo de bloco
  const getValidationState = (): ValidationState => {
    if (!enableValidation) return 'none';
    
    if (validation.isValidating) return 'pending';
    
    // Regras específicas por tipo de bloco
    switch (block.type) {
      case 'form-input':
      case 'quiz-intro-header':
        return validation.isFieldValid('name') ? 'valid' : 'invalid';
        
      case 'options-grid':
      case 'quiz-question-inline':
        return validation.isFieldValid('selectedOptions') ? 'valid' : 'invalid';
        
      case 'button-inline':
        // Botões são válidos quando as condições do step são atendidas
        return validation.validationResult.isValid ? 'valid' : 'warning';
        
      default:
        return validation.validationResult.state;
    }
  };

  const validationState = getValidationState();
  const validationMessage = validation.getFieldError('name') || validation.getFieldError('selectedOptions') || validation.validationResult.message;

  // Notificar mudanças de validação
  React.useEffect(() => {
    if (onValidationChange && enableValidation) {
      onValidationChange(block.id, validation.validationResult.isValid);
    }
  }, [validation.validationResult.isValid, block.id, onValidationChange, enableValidation]);

  // Simular dados baseados no step atual
  React.useEffect(() => {
    if (isPreview && stepData) {
      // Atualizar dados de validação com base no mock data
      if (stepData.type === 'input' && stepData.value) {
        validation.updateStepData({ name: stepData.value });
      } else if (stepData.type === 'selection' && stepData.selectedOptions) {
        validation.updateStepData({ selectedOptions: stepData.selectedOptions });
      }
    }
  }, [stepData, isPreview, validation]);

  if (!Component) {
    return (
      <div className={cn(
        'min-h-[60px] border border-red-200 bg-red-50 rounded-lg p-4 text-center',
        className
      )}>
        <div className="text-red-600 text-sm">
          ⚠️ Componente não encontrado: <code>{block.type}</code>
        </div>
        <div className="text-red-500 text-xs mt-1">
          ID: {block.id}
        </div>
      </div>
    );
  }

  // Preparar props para o componente
  const componentProps = {
    block,
    properties: block.properties || {},
    content: block.content || {},
    isSelected: isSelected && !isPreview,
    isPreviewing: isPreview,
    isEditor: !isPreview,
    
    // Dados mockados (fallback quando não há experiência real)
    mockData: realExperienceProps ? null : stepData,
    funnelId,
    currentStep,
    
    // Validação
    validationState,
    validationMessage,
    isValid: realExperienceProps ? realExperienceProps.isValidated : validation.validationResult.isValid,
    
    // Auto-advance
    canAutoAdvance: realExperienceProps ? realExperienceProps.canAutoAdvance : validation.canAutoAdvance,
    timeToAutoAdvance: validation.timeToAutoAdvance,
    
    // Experiência real
    realData: realExperienceProps ? {
      selections: realExperienceProps.selections,
      userName: realExperienceProps.userName,
      quizState: realExperienceProps.quizState,
    } : null,
    
    // Callbacks
    onSave: (updates: any) => {
      onUpdate?.(updates);
    },
    onClick: () => {
      if (!isPreview) {
        onSelect?.();
      }
    },
    onValidationChange: (isValid: boolean) => {
      if (realExperienceProps) {
        // Usar callback da experiência real
        realExperienceProps.onSelectionChange([]);
      } else {
        // Fallback para mock
        simulateValidation(block.id, isValid);
      }
    },
    onSelectionChange: realExperienceProps?.onSelectionChange,
    
    // Props do bloco
    ...block.properties,
  };

  return (
    <ValidationAwareBlockWrapper
      block={block}
      isSelected={isSelected}
      isPreview={isPreview}
      validationState={validationState}
      validationMessage={validationMessage}
      canAutoAdvance={validation.canAutoAdvance}
      timeToAutoAdvance={validation.timeToAutoAdvance}
      onSelect={onSelect}
    >
      <Suspense
        fallback={
          <div className={cn(
            'min-h-[80px] bg-stone-50 border border-stone-200 rounded-lg animate-pulse',
            'flex items-center justify-center',
            className
          )}>
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-stone-500">
              Carregando {block.type}...
            </span>
          </div>
        }
      >
        <Component {...componentProps} />
      </Suspense>
    </ValidationAwareBlockWrapper>
  );
};

/**
 * Obter delay de auto-advance baseado no tipo de bloco e step
 */
function getAutoAdvanceDelay(_blockType: string, currentStep: number): number {
  // Steps 2-11: Quiz com auto-advance rápido
  if (currentStep >= 2 && currentStep <= 11) {
    return 1500; // 1.5s
  }
  
  // Steps 13-18: Questões estratégicas sem auto-advance
  if (currentStep >= 13 && currentStep <= 18) {
    return 0; // Sem auto-advance
  }
  
  // Outros steps: delay padrão
  return 2000; // 2s
}

export default EnhancedBlockRenderer;