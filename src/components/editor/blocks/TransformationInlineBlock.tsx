import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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
  } = block.properties;

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
              <img src={beforeImage} alt="Antes" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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
              <ArrowRight className="w-12 h-12 md:w-16 md:h-16 animate-pulse" style={{ color: arrowColor }} />
              <span className="text-xs text-gray-500 mt-2">Transformação</span>
            </div>
          </div>

          {/* DEPOIS */}
          <div className="text-center space-y-4">
            <div className="relative">
              <img src={afterImage} alt="Depois" className="w-full h-48 object-cover rounded-lg shadow-md" />
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
