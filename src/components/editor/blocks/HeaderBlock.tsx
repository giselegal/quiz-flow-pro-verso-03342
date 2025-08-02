
import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Heading } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const HeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    title = 'Título Principal',
    subtitle = 'Subtítulo opcional',
    logo,
    logoAlt = 'Logo',
    logoWidth = '120px',
    logoHeight = 'auto',
    backgroundColor = 'transparent',
    color = '#1f2937',
    padding = '2rem 1rem',
    margin = '0',
    textAlign = 'center',
    fontSize = '2.5rem',
    fontWeight = 'bold',
    fontFamily = 'inherit'
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Safely handle style object
  const styleObj = block.content?.style || {};
  const safeStyle = typeof styleObj === 'object' && styleObj !== null ? styleObj : {};

  const containerStyle = {
    backgroundColor: (safeStyle as any).backgroundColor || backgroundColor || 'transparent',
    padding: (safeStyle as any).padding || padding || '2rem 1rem',
    margin: (safeStyle as any).margin || margin || '0',
    textAlign: (safeStyle as any).textAlign || textAlign || 'center'
  } as React.CSSProperties;

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-1 ring-gray-400/40 bg-gray-50/30' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      style={containerStyle}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto">
        {logo && (
          <div className="mb-6">
            <img
              src={logo}
              alt={logoAlt}
              className="mx-auto"
              style={{
                width: logoWidth,
                height: logoHeight
              }}
            />
          </div>
        )}
        
        <h1 
          className="mb-4"
          style={{
            fontSize: (safeStyle as any).fontSize || fontSize || '2.5rem',
            fontWeight: (safeStyle as any).fontWeight || fontWeight || 'bold',
            color: (safeStyle as any).color || color || '#1f2937',
            fontFamily: (safeStyle as any).fontFamily || fontFamily || 'inherit',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          <InlineEditableText
            value={title}
            onChange={(value: string) => handlePropertyChange('title', value)}
            placeholder="Título principal"
            className="block"
          />
        </h1>
        
        {subtitle && (
          <p 
            className="text-lg"
            style={{
              fontSize: (safeStyle as any).subtitleFontSize || '1.25rem',
              color: (safeStyle as any).subtitleColor || '#6b7280',
              fontWeight: (safeStyle as any).subtitleFontWeight || 'normal',
              fontFamily: (safeStyle as any).fontFamily || fontFamily || 'inherit',
              margin: 0
            }}
          >
            <InlineEditableText
              value={subtitle}
              onChange={(value: string) => handlePropertyChange('subtitle', value)}
              placeholder="Subtítulo opcional"
              className="block"
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default HeaderBlock;
