import { Button } from '@/components/ui/button';
import type { BlockComponentProps } from '@/types/blocks';
import React, { useEffect, useState } from 'react';

interface ButtonInlineFixedProps extends BlockComponentProps {
  disabled?: boolean;
}

const ButtonInlineFixed: React.FC<ButtonInlineFixedProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange: _onPropertyChange,
  disabled = false,
}) => {
  const {
    text = 'Click me',
    variant = 'default',
    size = 'default',
    fullWidth = false,
    backgroundColor = '#B89B7A',
    textColor = '#ffffff',
    // ✅ Controle condicional para input
    requiresValidInput = false,
    watchInputId = '',
    // ✅ NOVO: Controle condicional para grid
    requiresGridSelection = false,
    watchGridId = '',
    minRequiredSelections = 3,
    // Navegação
    nextStepUrl = '',
    nextStepId = '',
    disabledText = 'Complete as seleções obrigatórias',
    // Estilo do botão desabilitado
    disabledOpacity = 0.5,
    showDisabledState = true,
  } = (block?.properties as any) || {};

  const [isButtonEnabled, setIsButtonEnabled] = useState(
    !requiresValidInput && !requiresGridSelection
  );
  const [gridSelectionValid, setGridSelectionValid] = useState(!requiresGridSelection);
  const [inputValid, setInputValid] = useState(!requiresValidInput);

  // ✅ Escutar eventos de mudança no input
  useEffect(() => {
    if (!requiresValidInput || !watchInputId) {
      setInputValid(true);
      return;
    }

    const handleInputChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        blockId: string;
        value: string;
        valid: boolean;
      };

      if (detail.blockId === watchInputId) {
        const isValid = detail.valid && detail.value.trim().length > 0;
        setInputValid(isValid);
        console.log('🔘 [ButtonInlineFixed] Input validado:', {
          blockId: block?.id,
          inputId: watchInputId,
          inputValue: detail.value,
          valid: isValid,
        });
      }
    };

    window.addEventListener('quiz-input-change', handleInputChange);
    return () => window.removeEventListener('quiz-input-change', handleInputChange);
  }, [requiresValidInput, watchInputId, block?.id]);

  // ✅ NOVO: Escutar eventos de mudança no grid
  useEffect(() => {
    if (!requiresGridSelection || !watchGridId) {
      setGridSelectionValid(true);
      return;
    }

    const handleGridSelectionChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        gridId: string;
        selectedCount: number;
        minRequired: number;
        maxAllowed: number;
        isValid: boolean;
        selectedOptions: string[];
      };

      if (detail.gridId === watchGridId) {
        // Usar minRequiredSelections se definido, senão usar minRequired do grid
        const requiredCount = minRequiredSelections || detail.minRequired;
        const isValid = detail.selectedCount >= requiredCount;
        
        setGridSelectionValid(isValid);
        console.log('🔘 [ButtonInlineFixed] Grid validado:', {
          blockId: block?.id,
          gridId: watchGridId,
          selectedCount: detail.selectedCount,
          requiredCount: requiredCount,
          valid: isValid,
        });
      }
    };

    window.addEventListener('quiz-selection-change', handleGridSelectionChange);
    return () => window.removeEventListener('quiz-selection-change', handleGridSelectionChange);
  }, [requiresGridSelection, watchGridId, minRequiredSelections, block?.id]);

  // ✅ NOVO: Combinar validações de input e grid
  useEffect(() => {
    const overallValid = inputValid && gridSelectionValid;
    setIsButtonEnabled(overallValid);
    console.log('🔘 [ButtonInlineFixed] Estado geral do botão:', {
      blockId: block?.id,
      inputValid,
      gridSelectionValid,
      overallValid,
    });
  }, [inputValid, gridSelectionValid, block?.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Se desabilitado, não fazer nada
    if (!isButtonEnabled || disabled) {
      console.log('🚫 [ButtonInlineFixed] Botão desabilitado, clique ignorado');
      return;
    }

    console.log('✅ [ButtonInlineFixed] Botão clicado:', {
      blockId: block?.id,
      nextStepUrl,
      nextStepId,
    });

    // Executar ação de navegação se configurada
    if (nextStepUrl) {
      window.location.href = nextStepUrl;
    } else if (nextStepId) {
      // Disparar evento customizado para navegação entre etapas
      window.dispatchEvent(
        new CustomEvent('quiz-navigate-to-step', {
          detail: { stepId: nextStepId, fromButtonId: block?.id },
        })
      );
    }

    // Chamar onClick do editor se existir
    if (onClick) {
      onClick();
    }
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: isButtonEnabled ? backgroundColor : '#9CA3AF',
    color: isButtonEnabled ? textColor : '#6B7280',
    opacity: isButtonEnabled ? 1 : showDisabledState ? disabledOpacity : 1,
    cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
  };

  const displayText = isButtonEnabled ? text : disabledText;

  return (
    <div
      className={`
        transition-all duration-200 
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 rounded-lg p-1' : ''}
        ${fullWidth ? 'w-full' : 'w-auto'}
      `}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <Button
        variant={variant as any}
        size={size as any}
        disabled={!isButtonEnabled || disabled}
        onClick={handleClick}
        style={buttonStyle}
        className={`
          transition-all duration-200 font-semibold
          ${fullWidth ? 'w-full' : ''}
          ${
            isButtonEnabled
              ? 'hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
              : 'cursor-not-allowed'
          }
        `}
      >
        {displayText}
      </Button>
    </div>
  );
};

export default ButtonInlineFixed;
