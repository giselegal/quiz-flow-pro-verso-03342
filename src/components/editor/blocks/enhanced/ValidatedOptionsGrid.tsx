/**
 * 🎯 FASE 2 - VALIDATED OPTIONS GRID
 * 
 * Grid de opções com validação visual integrada
 * Replica o comportamento da versão de produção com auto-advance
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useFieldValidation } from '@/hooks/useStepValidation';
import { ValidationIndicator, ValidationState } from '../../unified/ValidationIndicator';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
}

interface ValidatedOptionsGridProps {
  options: Option[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  stepNumber: number;
  requiredSelections?: number;
  maxSelections?: number;
  className?: string;
  isPreview?: boolean;
  showValidation?: boolean;
  enableAutoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

/**
 * Grid de opções com validação em tempo real
 */
export const ValidatedOptionsGrid: React.FC<ValidatedOptionsGridProps> = ({
  options,
  selectedOptions,
  onSelectionChange,
  stepNumber,
  requiredSelections,
  maxSelections,
  className = '',
  isPreview = false,
  showValidation = true,
  enableAutoAdvance = false,
  autoAdvanceDelay = 1500,
}) => {
  const { isValid, error } = useFieldValidation('selectedOptions', selectedOptions, stepNumber);
  
  // Determinar regras baseadas no step
  const getSelectionRules = () => {
    if (requiredSelections !== undefined && maxSelections !== undefined) {
      return { required: requiredSelections, max: maxSelections };
    }
    
    // Regras padrão baseadas no step
    if (stepNumber >= 2 && stepNumber <= 11) {
      return { required: 3, max: 3 };
    } else if (stepNumber >= 13 && stepNumber <= 18) {
      return { required: 1, max: 1 };
    }
    
    return { required: 1, max: 1 };
  };

  const rules = getSelectionRules();
  const canSelectMore = selectedOptions.length < rules.max;
  const hasEnoughSelections = selectedOptions.length >= rules.required;
  const isComplete = selectedOptions.length === rules.required;

  // Auto-advance quando completo
  React.useEffect(() => {
    if (enableAutoAdvance && isComplete && isValid) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('quiz-auto-advance', {
          detail: {
            fromStep: stepNumber,
            toStep: stepNumber + 1,
            source: 'options-grid-auto-advance'
          }
        }));
      }, autoAdvanceDelay);

      return () => clearTimeout(timer);
    }
  }, [enableAutoAdvance, isComplete, isValid, stepNumber, autoAdvanceDelay]);

  const handleOptionSelect = (optionId: string) => {
    if (isPreview) return;

    let newSelection: string[];

    if (selectedOptions.includes(optionId)) {
      // Desmarcar opção
      newSelection = selectedOptions.filter(id => id !== optionId);
    } else {
      // Marcar opção
      if (selectedOptions.length >= rules.max) {
        // Se já atingiu o máximo, substituir a primeira
        newSelection = [...selectedOptions.slice(1), optionId];
      } else {
        // Adicionar à seleção
        newSelection = [...selectedOptions, optionId];
      }
    }

    onSelectionChange(newSelection);
  };

  // Determinar estado de validação
  const getValidationState = (): ValidationState => {
    if (!showValidation) return 'none';
    
    if (selectedOptions.length === 0) return 'none';
    if (isComplete && isValid) return 'valid';
    if (selectedOptions.length > 0 && selectedOptions.length < rules.required) return 'warning';
    if (error) return 'invalid';
    
    return 'none';
  };

  const validationState = getValidationState();

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header com validação */}
      {showValidation && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-stone-600">
            {rules.required === rules.max ? (
              `Selecione ${rules.required} opção${rules.required > 1 ? 'ões' : ''}`
            ) : (
              `Selecione de ${rules.required} a ${rules.max} opções`
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-700">
              {selectedOptions.length}/{rules.max}
            </span>
            {validationState !== 'none' && (
              <ValidationIndicator 
                state={validationState}
                showIcon={true}
                showMessage={false}
                size="sm"
              />
            )}
          </div>
        </div>
      )}

      {/* Grid de opções */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={isDisabled || isPreview}
              className={cn(
                'relative p-4 border-2 rounded-lg text-left transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                
                // Estados de seleção
                isSelected && 'border-primary bg-primary/10 ring-2 ring-primary/20',
                !isSelected && !isDisabled && 'border-stone-300 bg-white hover:border-stone-400',
                isDisabled && 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed',
                
                // Estados de validação
                isSelected && validationState === 'valid' && 'border-green-500 bg-green-50',
                isSelected && validationState === 'warning' && 'border-yellow-500 bg-yellow-50',
                
                // Preview mode
                isPreview && 'cursor-default'
              )}
            >
              {/* Indicador de seleção */}
              <div className="flex items-start gap-3">
                <div className={cn(
                  'mt-1 w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors',
                  isSelected ? 'border-primary bg-primary' : 'border-stone-300'
                )}>
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  {/* Imagem da opção (se houver) */}
                  {option.imageUrl && (
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  
                  {/* Texto da opção */}
                  <div className="font-medium text-stone-800">
                    {option.text}
                  </div>
                  
                  {/* Descrição (se houver) */}
                  {option.description && (
                    <div className="text-sm text-stone-600 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mensagem de validação */}
      {showValidation && error && (
        <div className="text-sm text-red-600 px-1">
          {error}
        </div>
      )}

      {/* Feedback de progresso */}
      {showValidation && selectedOptions.length > 0 && (
        <div className={cn(
          'text-sm px-1 transition-all duration-200',
          hasEnoughSelections ? 'text-green-600' : 'text-yellow-600'
        )}>
          {hasEnoughSelections ? (
            <>
              ✓ Seleção válida
              {enableAutoAdvance && isComplete && (
                <span className="ml-2 text-green-500">
                  - Avançando automaticamente...
                </span>
              )}
            </>
          ) : (
            `Selecione mais ${rules.required - selectedOptions.length} opção${rules.required - selectedOptions.length > 1 ? 'ões' : ''}`
          )}
        </div>
      )}
    </div>
  );
};

export default ValidatedOptionsGrid;