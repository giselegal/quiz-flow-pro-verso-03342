// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { Button as UIButton } from '@/components/ui/button';
import { MousePointer } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

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

  const handlePropertyChange = (key: string, value: any) => {
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
      console.log('Form submitted');
    } else if (action === 'download') {
      console.log('Download triggered');
    } else if (buttonUrl && buttonUrl !== '#') {
      window.open(buttonUrl, '_blank');
    } else {
      console.log('Button clicked');
    }
  };

  // Safely handle style object
  const styleObj = block.content?.style || {};
  const safeStyle = typeof styleObj === 'object' && styleObj !== null ? styleObj : {};

  const containerStyle = {
    textAlign: (safeStyle as any).textAlign || textAlign || 'center',
    margin: (safeStyle as any).margin || margin || '0',
  } as React.CSSProperties;

  const buttonStyle = {
    backgroundColor: (safeStyle as any).backgroundColor || backgroundColor || '#3b82f6',
    color: (safeStyle as any).color || color || '#ffffff',
    padding: (safeStyle as any).padding || padding || '12px 24px',
    fontSize: (safeStyle as any).fontSize || fontSize || '16px',
    fontWeight: (safeStyle as any).fontWeight || fontWeight || '500',
    borderRadius: (safeStyle as any).borderRadius || borderRadius || '6px',
    boxShadow: (safeStyle as any).boxShadow || boxShadow || 'none',
    width: (safeStyle as any).width || width || 'auto',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  } as React.CSSProperties;

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
      <div style={{ textAlign: containerStyle.textAlign as any }}>
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
