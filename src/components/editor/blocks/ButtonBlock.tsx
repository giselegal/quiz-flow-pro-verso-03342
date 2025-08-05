import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Button as UIButton } from '@/components/ui/button';
import { MousePointer } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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
