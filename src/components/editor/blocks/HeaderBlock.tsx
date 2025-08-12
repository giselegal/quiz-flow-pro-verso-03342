// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { Heading } from 'lucide-react';
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

const HeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
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
    fontFamily = 'inherit',
  } = block?.properties || {};

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
    textAlign: (safeStyle as any).textAlign || textAlign || 'center',
  } as React.CSSProperties;

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
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
                height: logoHeight,
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
            lineHeight: 1.2,
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
              margin: 0,
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
