/**
 * ❓ BLOCO DE QUESTÃO REUTILIZÁVEL E MODULAR
 *
 * QuizQuestionBlockModular.tsx - Versão melhorada e modular do bloco de questão
 * Suporta múltipla escolha, seleção única, imagens, validação em tempo real
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Edit3, Image as ImageIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  value?: number; // Para scoring
}

interface QuizQuestionBlockModularProps {
  // Configuração básica
  block: {
    id: string;
    type: string;
    content: {
      question?: string;
      options?: QuizOption[];
      subtitle?: string;
      description?: string;
    };
    properties?: {
      questionId?: string;
      showImages?: boolean;
      columns?: number;
      requiredSelections?: number;
      maxSelections?: number;
      minSelections?: number;
      multipleSelection?: boolean;
      autoAdvanceOnComplete?: boolean;
      autoAdvanceDelay?: number;

      // Validação
      enableButtonOnlyWhenValid?: boolean;
      showValidationFeedback?: boolean;
      validationMessage?: string;
      progressMessage?: string;
      showSelectionCount?: boolean;

      // Styling
      selectionStyle?: 'border' | 'background' | 'shadow';
      selectedColor?: string;
      hoverColor?: string;
      gridGap?: number;
      responsiveColumns?: boolean;

      // Pontuação
      scoreValues?: Record<string, number>;

      // Layout
      imageSize?: 'small' | 'medium' | 'large' | 'custom';
      imageWidth?: number;
      imageHeight?: number;
    };
  };

  // Estado e controle
  selectedOptions?: string[];
  onSelectionChange?: (options: string[]) => void;
  onQuestionComplete?: (questionId: string, answers: string[]) => void;

  // Modo do editor
  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (blockId: string, updates: any) => void;

  // Configuração geral
  config?: {
    mode: 'editor' | 'preview' | 'production';
    theme: {
      primaryColor: string;
      textColor: string;
      backgroundColor: string;
    };
  };

  className?: string;
}

export const QuizQuestionBlockModular: React.FC<QuizQuestionBlockModularProps> = ({
  block,
  selectedOptions = [],
  onSelectionChange,
  onQuestionComplete,
  isEditing = false,
  isSelected = false,
  onUpdate,
  config = {
    mode: 'preview',
    theme: {
      primaryColor: '#B89B7A',
      textColor: '#432818',
      backgroundColor: '#FEFEFE',
    },
  },
  className,
}) => {
  const { content, properties = {} } = block;
  const { mode, theme } = config;

  // ========================================
  // Estado Local
  // ========================================
  const [localSelections, setLocalSelections] = useState<string[]>(selectedOptions);
  const [isValid, setIsValid] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // ========================================
  // Configuração Derivada
  // ========================================
  const {
    questionId = block.id,
    showImages = false,
    columns = showImages ? 2 : 1,
    requiredSelections = 1,
    maxSelections = 3,
    minSelections = 1,
    multipleSelection = true,
    autoAdvanceOnComplete = false,
    autoAdvanceDelay = 1500,

    enableButtonOnlyWhenValid = true,
    showValidationFeedback = true,
    validationMessage = `Selecione ${requiredSelections} opções para continuar`,
    progressMessage = 'Você selecionou {count} de {required} opções',
    showSelectionCount = true,

    selectionStyle = 'border',
    selectedColor = theme.primaryColor,
    hoverColor = '#EBF5FF',
    gridGap = 16,
    responsiveColumns = true,

    scoreValues = {},

    imageSize = 'medium',
    imageWidth = 300,
    imageHeight = 300,
  } = properties;

  // ========================================
  // Classes CSS Dinâmicas
  // ========================================
  const gridClasses = useMemo(() => {
    const baseClasses = 'grid gap-4';

    if (responsiveColumns) {
      switch (columns) {
        case 1:
          return `${baseClasses} grid-cols-1`;
        case 2:
          return `${baseClasses} grid-cols-1 md:grid-cols-2`;
        case 3:
          return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
        case 4:
          return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-4`;
        default:
          return `${baseClasses} grid-cols-1 md:grid-cols-2`;
      }
    } else {
      return `${baseClasses} grid-cols-${columns}`;
    }
  }, [columns, responsiveColumns]);

  const imageClasses = useMemo(() => {
    switch (imageSize) {
      case 'small':
        return 'w-16 h-16';
      case 'medium':
        return 'w-24 h-24';
      case 'large':
        return 'w-32 h-32';
      case 'custom':
        return '';
      default:
        return 'w-24 h-24';
    }
  }, [imageSize]);

  // ========================================
  // Validação
  // ========================================
  useEffect(() => {
    const currentCount = localSelections.length;
    const valid = currentCount >= minSelections && currentCount <= maxSelections;
    setIsValid(valid);

    if (showValidationFeedback && currentCount > 0 && !valid) {
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  }, [localSelections, minSelections, maxSelections, showValidationFeedback]);

  // ========================================
  // Handlers
  // ========================================
  const handleOptionClick = useCallback(
    (optionId: string) => {
      if (isEditing) return; // Não permitir seleção em modo de edição

      setLocalSelections(prev => {
        let newSelections: string[];

        if (multipleSelection) {
          if (prev.includes(optionId)) {
            // Remover seleção
            newSelections = prev.filter(id => id !== optionId);
          } else {
            // Adicionar seleção (respeitando máximo)
            if (prev.length < maxSelections) {
              newSelections = [...prev, optionId];
            } else {
              newSelections = prev;
            }
          }
        } else {
          // Seleção única
          newSelections = [optionId];
        }

        // Notificar mudança
        if (onSelectionChange) {
          onSelectionChange(newSelections);
        }

        return newSelections;
      });
    },
    [isEditing, multipleSelection, maxSelections, onSelectionChange]
  );

  // ========================================
  // Auto-advance
  // ========================================
  useEffect(() => {
    if (autoAdvanceOnComplete && isValid && localSelections.length === requiredSelections) {
      const timer = setTimeout(() => {
        if (onQuestionComplete) {
          onQuestionComplete(questionId, localSelections);
        }
      }, autoAdvanceDelay);

      return () => clearTimeout(timer);
    }
  }, [
    autoAdvanceOnComplete,
    isValid,
    localSelections,
    requiredSelections,
    questionId,
    onQuestionComplete,
    autoAdvanceDelay,
  ]);

  // ========================================
  // Progress Message
  // ========================================
  const formattedProgressMessage = useMemo(() => {
    return progressMessage
      .replace('{count}', localSelections.length.toString())
      .replace('{required}', requiredSelections.toString())
      .replace('{max}', maxSelections.toString());
  }, [progressMessage, localSelections.length, requiredSelections, maxSelections]);

  // ========================================
  // Render Option
  // ========================================
  const renderOption = useCallback(
    (option: QuizOption) => {
      const isOptionSelected = localSelections.includes(option.id);

      return (
        <Card
          key={option.id}
          className={cn(
            'cursor-pointer transition-all duration-200',
            'hover:shadow-md',
            isOptionSelected && selectionStyle === 'border' && 'border-2',
            isOptionSelected && selectionStyle === 'shadow' && 'shadow-lg',
            isOptionSelected && selectionStyle === 'background' && 'bg-opacity-10'
          )}
          style={{
            borderColor:
              isOptionSelected && selectionStyle === 'border' ? selectedColor : '#E5E7EB',
            backgroundColor:
              isOptionSelected && selectionStyle === 'background' ? selectedColor : 'white',
            boxShadow:
              isOptionSelected && selectionStyle === 'shadow'
                ? `0 0 0 3px ${selectedColor}25`
                : undefined,
          }}
          onClick={() => handleOptionClick(option.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {/* Ícone de Seleção */}
              <div className="flex-shrink-0">
                {isOptionSelected ? (
                  <CheckCircle2 className="h-5 w-5" style={{ color: selectedColor }} />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* Imagem (se habilitada) */}
              {showImages && option.imageUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className={cn(
                      'object-cover rounded',
                      imageSize === 'custom' ? '' : imageClasses
                    )}
                    style={
                      imageSize === 'custom'
                        ? {
                            width: `${imageWidth}px`,
                            height: `${imageHeight}px`,
                          }
                        : undefined
                    }
                  />
                </div>
              )}

              {/* Placeholder para imagem ausente */}
              {showImages && !option.imageUrl && (
                <div
                  className={cn(
                    'flex items-center justify-center bg-gray-100 rounded',
                    imageSize === 'custom' ? '' : imageClasses
                  )}
                  style={
                    imageSize === 'custom'
                      ? {
                          width: `${imageWidth}px`,
                          height: `${imageHeight}px`,
                        }
                      : undefined
                  }
                >
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}

              {/* Texto */}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: theme.textColor }}>
                  {option.text}
                </p>

                {/* Score value (modo editor) */}
                {mode === 'editor' && scoreValues[option.id] && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    +{scoreValues[option.id]} pts
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    },
    [
      localSelections,
      selectedColor,
      selectionStyle,
      handleOptionClick,
      showImages,
      imageClasses,
      imageSize,
      imageWidth,
      imageHeight,
      theme.textColor,
      mode,
      scoreValues,
    ]
  );

  // ========================================
  // Render Principal
  // ========================================
  return (
    <div
      className={cn(
        'quiz-question-block p-6 rounded-lg',
        isEditing && 'border-2 border-dashed border-blue-300',
        className
      )}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        {content.question && (
          <h2 className="text-xl font-semibold mb-3" style={{ color: theme.textColor }}>
            {content.question}
          </h2>
        )}

        {content.subtitle && (
          <h3 className="text-lg mb-2" style={{ color: theme.textColor }}>
            {content.subtitle}
          </h3>
        )}

        {content.description && <p className="text-sm text-gray-600 mb-4">{content.description}</p>}

        {/* Selection Requirements */}
        {multipleSelection && showSelectionCount && (
          <div className="flex justify-center space-x-2 mb-4">
            <Badge variant="outline" style={{ borderColor: selectedColor, color: selectedColor }}>
              {formattedProgressMessage}
            </Badge>

            {requiredSelections === maxSelections && (
              <Badge variant="secondary">Selecione exatamente {requiredSelections}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className={gridClasses} style={{ gap: `${gridGap}px` }}>
        {content.options?.map(renderOption)}
      </div>

      {/* Validation Feedback */}
      {showFeedback && validationMessage && (
        <div className="mt-4 text-center">
          <p className="text-sm text-red-600">{validationMessage}</p>
        </div>
      )}

      {/* Continue Button (se não auto-advance) */}
      {!autoAdvanceOnComplete && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => onQuestionComplete?.(questionId, localSelections)}
            disabled={enableButtonOnlyWhenValid && !isValid}
            style={{
              backgroundColor: isValid ? selectedColor : undefined,
              opacity: !isValid ? 0.5 : 1,
            }}
          >
            Continuar
          </Button>
        </div>
      )}

      {/* Editor Controls */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-white rounded p-1 shadow-sm">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpdate?.(block.id, { isEditing: true })}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Debug Info (modo editor) */}
      {mode === 'editor' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>ID: {questionId}</div>
            <div>Válido: {isValid ? '✅' : '❌'}</div>
            <div>
              Seleções: {localSelections.length}/{maxSelections}
            </div>
            <div>Tipo: {multipleSelection ? 'Múltipla' : 'Única'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlockModular;
