// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { Book, CheckCircle } from 'lucide-react';
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

const ArgumentsBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Por que escolher nosso produto?',
    items = [
      { text: 'Qualidade superior garantida', icon: 'CheckCircle' },
      { text: 'Suporte 24/7', icon: 'CheckCircle' },
      { text: 'Entrega rápida', icon: 'CheckCircle' },
    ],
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Fallback para ícone
  const getIcon = (iconName: string) => {
    if (iconName === 'CheckCircle') {
      return <CheckCircle className="w-5 h-5 text-[#B89B7A] flex-shrink-0 mt-0.5" />;
    }
    // Se não é um ícone conhecido, trata como emoji ou usa bullet
    return <span className="text-xl flex-shrink-0">{iconName || '✅'}</span>;
  };

  return (
    <div
      className={`
        py-6 space-y-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <h3 className="text-xl font-bold text-center text-[#432818]">
        <InlineEditableText
          value={title}
          onChange={(value: string) => handlePropertyChange('title', value)}
          className="inline-block"
          placeholder="Título dos argumentos"
        />
      </h3>
      <div className="space-y-3">
        {(items || []).map((item: any, index: number) => (
          <div key={index} style={{ backgroundColor: '#FAF9F7' }}>
            {getIcon(item.icon)}
            <p className="flex-1 text-[#432818]">{item.text}</p>
          </div>
        ))}
      </div>
      {(!items || items.length === 0) && (
        <div style={{ color: '#8B7355' }}>
          <Book className="w-12 h-12 mb-4 opacity-50" />
          <p>Configure os argumentos no painel de propriedades.</p>
        </div>
      )}
    </div>
  );
};

export default ArgumentsBlock;
