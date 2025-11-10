import { InlineEditableText } from './InlineEditableText';
import { Button as UIButton } from '@/components/ui/button';
import { MousePointer } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
type MarginType = 'top' | 'bottom' | 'left' | 'right';
type MarginValue = string | number | undefined;

const getMarginClass = (value: MarginValue, type: MarginType): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value ?? 0;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const ButtonBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    buttonText = 'Clique aqui',
    buttonUrl = '#',
    action = 'link',
    backgroundColor = '#3b82f6',
    color = '#ffffff',
    padding = '12px 24px',
    borderRadius = '6px',
    fontSize = '16px',
    fontWeight = '500',
    textAlign = 'center',
    width = 'auto',
    margin = '0',
    boxShadow = 'none',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: unknown) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEditing) {
      return;
    }

    if (action === 'submit') {
      appLogger.debug('Form submitted');
    } else if (action === 'download') {
      appLogger.debug('Download triggered');
    } else if (buttonUrl && buttonUrl !== '#') {
      window.open(buttonUrl, '_blank');
    } else {
      appLogger.debug('Button clicked');
    }
  };

  // Safely handle style object
  const styleObj = (block as any)?.content?.style;
  const safeStyle: Record<string, unknown> =
    styleObj && typeof styleObj === 'object' ? (styleObj as Record<string, unknown>) : {};

  const containerStyle: React.CSSProperties = {
    textAlign: (safeStyle.textAlign as React.CSSProperties['textAlign']) ?? textAlign ?? 'center',
    margin: (safeStyle.margin as string) ?? margin ?? '0',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: (safeStyle.backgroundColor as string) ?? backgroundColor ?? '#3b82f6',
    color: (safeStyle.color as string) ?? color ?? '#ffffff',
    padding: (safeStyle.padding as string) ?? padding ?? '12px 24px',
    fontSize: (safeStyle.fontSize as string) ?? fontSize ?? '16px',
    fontWeight: (safeStyle.fontWeight as React.CSSProperties['fontWeight']) ??
      (fontWeight as React.CSSProperties['fontWeight']) ??
      '500',
    borderRadius: (safeStyle.borderRadius as string) ?? borderRadius ?? '6px',
    boxShadow: (safeStyle.boxShadow as string) ?? boxShadow ?? 'none',
    width: (safeStyle.width as string) ?? width ?? 'auto',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      className={`
        py-4 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={containerStyle}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div style={{ textAlign: containerStyle.textAlign }}>
        <UIButton style={buttonStyle} onClick={handleButtonClick} className="border-0">
          <MousePointer className="w-4 h-4 mr-2" />
          <InlineEditableText
            value={buttonText}
            onChange={(value: string) => handlePropertyChange('buttonText', value)}
            placeholder="Texto do botão"
            className="inline-block"
          />
        </UIButton>
      </div>
    </div>
  );
};

export default ButtonBlock;
