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
    // ✅ Novas propriedades para controle condicional
    requiresValidInput = false,
    watchInputId = '',
    nextStepUrl = '',
    nextStepId = '',
    disabledText = 'Preencha os campos obrigatórios',
    // Estilo do botão desabilitado
    disabledOpacity = 0.5,
    showDisabledState = true,
  } = (block?.properties as any) || {};

  const [isButtonEnabled, setIsButtonEnabled] = useState(!requiresValidInput);

  // ✅ Escutar eventos de mudança no input para habilitar/desabilitar botão
  useEffect(() => {
    if (!requiresValidInput || !watchInputId) {
      setIsButtonEnabled(true);
      return;
    }

    const handleInputChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        blockId: string;
        value: string;
        valid: boolean;
      };

      // Se o input monitorado mudou, atualizar estado do botão
      if (detail.blockId === watchInputId) {
        setIsButtonEnabled(detail.valid && detail.value.trim().length > 0);
        console.log('🔘 [ButtonInlineFixed] Estado do botão atualizado:', {
          blockId: block?.id,
          inputId: watchInputId,
          inputValue: detail.value,
          valid: detail.valid,
          buttonEnabled: detail.valid && detail.value.trim().length > 0,
        });
      }
    };

    window.addEventListener('quiz-input-change', handleInputChange);
    return () => window.removeEventListener('quiz-input-change', handleInputChange);
  }, [requiresValidInput, watchInputId, block?.id]);

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
