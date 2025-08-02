
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { InlineBlockProps } from '@/types/inlineBlocks';

const QuizStartPageInlineBlock: React.FC<InlineBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Validate block and properties
  if (!block || !block.properties) {
    console.warn('QuizStartPageInlineBlock: block or block.properties is undefined');
    return null;
  }

  const properties = block.properties || {};

  // Safe property extraction with defaults
  const title = properties.title || 'Etapa 1: Descubra Seu Estilo Pessoal Único';
  const subtitle = properties.subtitle || 'Chega de guarda-roupa lotado e sensação de "não tenho nada para vestir"';
  const description = properties.description || 'Um quiz personalizado que vai te ajudar a descobrir seu estilo predominante e como aplicá-lo no dia a dia com confiança.';
  const buttonText = properties.buttonText || 'Começar Meu Quiz de Estilo';
  const benefits = properties.benefits || [
    '✓ Descubra seu estilo predominante em apenas 5 minutos',
    '✓ Receba dicas personalizadas para seu perfil único',
    '✓ Aprenda a criar looks que combinam 100% com você',
    '✓ Ganhe confiança para se vestir todos os dias'
  ];
  const nameInputPlaceholder = properties.nameInputPlaceholder || 'Digite seu primeiro nome aqui...';
  const showNameInput = properties.showNameInput !== false; // default to true
  const imageUrl = properties.imageUrl || '';
  const backgroundColor = properties.backgroundColor || '#fffaf7';
  const textColor = properties.textColor || '#432818';

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col bg-white rounded-lg border border-gray-200',
        'p-4 md:p-6 min-h-[300px] max-w-full', 
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : '',
        'cursor-pointer hover:shadow-md transition-all duration-200',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <Badge variant="outline" className="mb-3 text-xs bg-[#B89B7A] text-white border-[#B89B7A]">
          Etapa 1 - Quiz de Estilo Pessoal
        </Badge>

        {/* Title */}
        <h1 
          className={cn(
            "text-lg md:text-xl font-bold mb-2 leading-tight cursor-pointer p-2 rounded border-2 border-transparent hover:border-blue-300",
            isSelected && "ring-2 ring-blue-500 ring-opacity-50"
          )}
          onClick={onClick}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p 
          className={cn(
            "text-sm mb-3 opacity-80 leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-blue-300",
            isSelected && "ring-2 ring-blue-500 ring-opacity-50"
          )}
          onClick={onClick}
        >
          {subtitle}
        </p>
      </div>

      {/* Description */}
      <p 
        className={cn(
          "text-xs md:text-sm mb-4 opacity-75 text-center leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-blue-300",
          isSelected && "ring-2 ring-blue-500 ring-opacity-50"
        )}
        onClick={onClick}
      >
        {description}
      </p>

      {/* Benefits List */}
      {benefits && benefits.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Name Input */}
      {showNameInput && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={nameInputPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-auto">
        <Button 
          className="w-full bg-[#B89B7A] hover:bg-[#aa6b5d] text-white text-sm"
        >
          {buttonText}
        </Button>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-3">
        <p className="text-xs opacity-60">
          ⏱️ Leva apenas 5 minutos • 100% gratuito
        </p>
      </div>
    </div>
  );
};

export default QuizStartPageInlineBlock;
