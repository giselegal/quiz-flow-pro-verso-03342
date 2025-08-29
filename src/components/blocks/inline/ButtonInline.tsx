import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface ButtonInlineProps {
  text?: string;
  style?: 'primary' | 'secondary' | 'outline';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  boxShadow?: string;
  hoverEffect?: boolean;
  requiresValidInput?: boolean;
  requiresValidSelection?: boolean;
  disabled?: boolean;
  // Propriedades de layout
  textAlign?: string;
  justifyContent?: string;
  alignItems?: string;
  display?: string;
  margin?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  // Propriedades de edição
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  isSelected?: boolean;
}

export function ButtonInline({
  text = 'Clique aqui',
  style = 'primary',
  variant = 'primary',
  size = 'medium',
  backgroundColor = '#B89B7A',
  textColor = '#ffffff',
  onClick,
  className = '',
  fullWidth = false,
  borderRadius = 'rounded-lg',
  padding,
  fontSize,
  fontWeight = 'font-bold',
  boxShadow,
  hoverEffect = true,
  requiresValidInput = false,
  requiresValidSelection = false,
  disabled = false,
  textAlign = 'text-center',
  justifyContent: _justifyContent = 'center',
  alignItems: _alignItems = 'center',
  display: _display = 'flex',
  margin: _margin = '0 auto',
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  // Propriedades de edição
  isEditable = true, // ATIVADO POR PADRÃO
  onPropertyChange,
  isSelected = false,
}: ButtonInlineProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState('');

  // Usar variant se style não estiver definido
  const actualVariant = variant || style;

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  // Converter fontSize numérico em classes Tailwind
  const getFontSizeClass = (size: string | number | undefined): string => {
    if (typeof size === 'number') {
      if (size <= 12) return 'text-xs';
      if (size <= 14) return 'text-sm';
      if (size <= 16) return 'text-base';
      if (size <= 18) return 'text-lg';
      if (size <= 20) return 'text-xl';
      if (size <= 24) return 'text-2xl';
      return 'text-3xl';
    }
    return size || 'text-base';
  };

  // Converter fontWeight numérico em classes Tailwind
  const getFontWeightClass = (weight: string | number | undefined): string => {
    if (typeof weight === 'number' || !isNaN(Number(weight))) {
      const numWeight = Number(weight);
      if (numWeight <= 300) return 'font-light';
      if (numWeight <= 400) return 'font-normal';
      if (numWeight <= 500) return 'font-medium';
      if (numWeight <= 600) return 'font-semibold';
      if (numWeight <= 700) return 'font-bold';
      return 'font-extrabold';
    }
    return weight || 'font-bold';
  };

  // Função para converter margens numéricas em classes Tailwind
  const getMarginClass = (value: number, type: 'top' | 'bottom' | 'left' | 'right'): string => {
    if (!value || value === 0) return '';

    const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

    // Converter pixels em unidades Tailwind (aproximadamente)
    if (value <= 4) return `${prefix}-1`;
    if (value <= 8) return `${prefix}-2`;
    if (value <= 12) return `${prefix}-3`;
    if (value <= 16) return `${prefix}-4`;
    if (value <= 20) return `${prefix}-5`;
    if (value <= 24) return `${prefix}-6`;
    if (value <= 32) return `${prefix}-8`;
    if (value <= 40) return `${prefix}-10`;
    if (value <= 48) return `${prefix}-12`;
    if (value <= 64) return `${prefix}-16`;
    if (value <= 80) return `${prefix}-20`;
    return `${prefix}-24`;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEditable && !isEditing) {
      setIsEditing(true);
      setTempText(text);
    }
  };

  const handleSave = () => {
    if (onPropertyChange && tempText.trim()) {
      onPropertyChange('text', tempText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempText('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const [isSelectionValid, setIsSelectionValid] = useState<boolean>(!requiresValidSelection);

  React.useEffect(() => {
    if (!requiresValidSelection) return;
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ isValid?: boolean; valid?: boolean }>; 
      const ok = typeof e.detail?.isValid === 'boolean' ? e.detail.isValid : !!e.detail?.valid;
      setIsSelectionValid(ok);
    };
    window.addEventListener('quiz-selection-change', handler as EventListener);
    return () => window.removeEventListener('quiz-selection-change', handler as EventListener);
  }, [requiresValidSelection]);

  if (isEditing && isEditable) {
    return (
      <div className="inline-block relative">
        <input
          type="text"
          value={tempText}
          onChange={e => setTempText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="px-4 py-2 border-2 border-blue-500 rounded text-center font-bold"
          style={{
            backgroundColor,
            color: textColor,
            minWidth: '120px',
          }}
          placeholder="Texto do botão..."
        />
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#666',
            background: 'white',
            padding: '2px 4px',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            marginTop: '4px',
          }}
        >
          Enter para salvar • Esc para cancelar
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={isEditable ? handleEditClick : onClick}
      disabled={
        disabled ||
        requiresValidInput ||
        (requiresValidSelection && !isSelectionValid)
      }
      className={cn(
        // Base styles
        'inline-flex items-center justify-center transition-all duration-300 border',
        'focus:outline-none focus:ring-4 focus:ring-opacity-50',
        // Editable styles
        isEditable && isSelected && 'ring-2 ring-blue-400 ring-opacity-50',
        isEditable && 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-30',

        // Size
        padding || sizeClasses[size],

        // Layout
        fullWidth && 'w-full',
        borderRadius || 'rounded-lg',
        textAlign,

        // Typography
        getFontSizeClass(fontSize),
        getFontWeightClass(fontWeight),

        // Effects
        boxShadow,
        hoverEffect && 'hover:shadow-lg hover:scale-105 active:scale-95',

        // States
        disabled && 'opacity-50 cursor-not-allowed',
  (requiresValidInput || (requiresValidSelection && !isSelectionValid)) && 'opacity-75 cursor-not-allowed',

        // Margins
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right'),

        // Custom classes
        className
      )}
      style={{
        backgroundColor:
          actualVariant === 'primary'
            ? backgroundColor
            : actualVariant === 'secondary'
              ? undefined
              : 'transparent',
        color:
          actualVariant === 'primary'
            ? textColor
            : actualVariant === 'outline'
              ? backgroundColor
              : textColor,
        borderColor: backgroundColor,
        ...(actualVariant === 'outline' &&
          ({
            '--hover-bg': backgroundColor,
          } as React.CSSProperties)),
      }}
      onMouseEnter={e => {
        if (actualVariant === 'outline') {
          e.currentTarget.style.backgroundColor = backgroundColor;
          e.currentTarget.style.color = textColor;
        }
      }}
      onMouseLeave={e => {
        if (actualVariant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = backgroundColor;
        }
      }}
      title={
        isEditable
          ? 'Clique para editar texto do botão'
          : (requiresValidSelection && !isSelectionValid)
            ? 'Selecione as opções obrigatórias para continuar'
            : requiresValidInput
              ? 'Preencha os campos obrigatórios para continuar'
              : undefined
      }
    >
      {text}
      {isEditable && isSelected && <span className="ml-2 text-xs opacity-60">✎</span>}
    </button>
  );
}

export default ButtonInline;
