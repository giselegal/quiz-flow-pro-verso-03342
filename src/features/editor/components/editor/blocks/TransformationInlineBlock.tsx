// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { ArrowRight, Sparkles } from 'lucide-react';
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

const TransformationInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Sua Transformação Começa Aqui',
    subtitle = 'Veja o que você vai alcançar',
    beforeTitle = 'ANTES',
    beforeDescription = 'Sem direção no guarda-roupa, comprando por impulso e se sentindo sempre inadequada.',
    beforeImage = 'https://via.placeholder.com/300x200?text=Antes',
    afterTitle = 'DEPOIS',
    afterDescription = 'Com um estilo autêntico, confiante e alinhado com seus objetivos pessoais e profissionais.',
    afterImage = 'https://via.placeholder.com/300x200?text=Depois',
    arrowColor = '#B89B7A',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full
        p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#B89B7A]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-2">
            <InlineEditableText
              value={title}
              onChange={value => handlePropertyChange('title', value)}
              placeholder="Título da transformação"
              className="text-2xl md:text-3xl font-bold text-[#aa6b5d]"
            />
          </h2>

          <p className="text-[#432818] text-lg">
            <InlineEditableText
              value={subtitle}
              onChange={value => handlePropertyChange('subtitle', value)}
              placeholder="Subtítulo da transformação"
              className="text-[#432818] text-lg"
            />
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* ANTES */}
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                src={beforeImage}
                alt="Antes"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <div style={{ backgroundColor: '#FAF9F7' }}>
                <InlineEditableText
                  value={beforeTitle}
                  onChange={value => handlePropertyChange('beforeTitle', value)}
                  placeholder="ANTES"
                  className="text-white text-sm font-bold"
                />
              </div>
            </div>

            <p className="text-[#432818] text-sm leading-relaxed">
              <InlineEditableText
                value={beforeDescription}
                onChange={value => handlePropertyChange('beforeDescription', value)}
                placeholder="Descrição do antes..."
                className="text-[#432818] text-sm leading-relaxed"
                multiline
              />
            </p>
          </div>

          {/* ARROW */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <ArrowRight
                className="w-12 h-12 md:w-16 md:h-16 animate-pulse"
                style={{ color: arrowColor }}
              />
              <span style={{ color: '#8B7355' }}>Transformação</span>
            </div>
          </div>

          {/* DEPOIS */}
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                src={afterImage}
                alt="Depois"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                <InlineEditableText
                  value={afterTitle}
                  onChange={value => handlePropertyChange('afterTitle', value)}
                  placeholder="DEPOIS"
                  className="text-white text-sm font-bold"
                />
              </div>
            </div>

            <p className="text-[#432818] text-sm leading-relaxed">
              <InlineEditableText
                value={afterDescription}
                onChange={value => handlePropertyChange('afterDescription', value)}
                placeholder="Descrição do depois..."
                className="text-[#432818] text-sm leading-relaxed"
                multiline
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationInlineBlock;
