import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { AnimatedWrapper } from '../../../ui/animated-wrapper';
import { InlineEditText } from '../InlineEditText';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import type { InlineBlockProps } from '../../../../types/inlineBlocks';

/**
 * QuizStartPageInlineBlock - Versão inline da página de início do quiz (Etapa 1)
 * 
 * Componente modular e responsivo para a primeira etapa do funil de 21 etapas.
 * Inclui título, subtítulo, benefícios, campo de nome e CTA.
 */

interface QuizStartPageInlineProperties {
  // Conteúdo principal
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  
  // Benefícios
  benefits?: string[];
  showBenefits?: boolean;
  
  // Campo de nome
  nameInputPlaceholder?: string;
  showNameInput?: boolean;
  nameInputLabel?: string;
  
  // Visual
  imageUrl?: string;
  showBadge?: boolean;
  badgeText?: string;
  
  // Footer
  footerText?: string;
  showFooter?: boolean;
  
  // Layout
  buttonSize?: 'sm' | 'md' | 'lg';
  contentAlignment?: 'left' | 'center' | 'right';
}

interface QuizStartPageInlineProps extends InlineBlockProps {
  block: {
    id: string;
    type: string;
    properties: QuizStartPageInlineProperties & Record<string, any>;
  };
}

const QuizStartPageInlineBlock: React.FC<QuizStartPageInlineProps> = (props) => {
  const {
    isLoaded,
    properties,
    classes,
    commonProps,
    handlePropertyChange
  } = useInlineBlock(props);

  const {
    // Conteúdo
    title = 'Descubra Seu Estilo Pessoal Único',
    subtitle = 'Chega de guarda-roupa lotado e sensação de "não tenho nada para vestir"',
    description = 'Um quiz personalizado que vai te ajudar a descobrir seu estilo predominante e como aplicá-lo no dia a dia com confiança.',
    buttonText = 'Começar Meu Quiz de Estilo',
    
    // Benefícios
    benefits = [
      '✓ Descubra seu estilo predominante em apenas 5 minutos',
      '✓ Receba dicas personalizadas para seu perfil único',
      '✓ Aprenda a criar looks que combinam 100% com você',
      '✓ Ganhe confiança para se vestir todos os dias'
    ],
    showBenefits = true,
    
    // Campo de nome
    nameInputPlaceholder = 'Digite seu primeiro nome aqui...',
    showNameInput = true,
    nameInputLabel = 'Seu nome',
    
    // Visual
    imageUrl,
    showBadge = true,
    badgeText = 'Etapa 1 - Quiz de Estilo Pessoal',
    
    // Footer
    footerText = '⏱️ Leva apenas 5 minutos • 100% gratuito',
    showFooter = true,
    
    // Layout
    buttonSize = 'lg',
    contentAlignment = 'center'
  } = properties;

  const alignmentClass = contentAlignment === 'center' ? 'text-center' : 
                        contentAlignment === 'right' ? 'text-right' : 'text-left';

  const buttonSizeClass = buttonSize === 'sm' ? 'px-4 py-2 text-sm' :
                         buttonSize === 'lg' ? 'px-8 py-4 text-lg' :
                         'px-6 py-3 text-base';

  return (
    <div
      className={`${classes.container} bg-white rounded-xl border border-[#B89B7A]/20 shadow-sm hover:shadow-md`}
      {...commonProps}
    >
      <AnimatedWrapper show={isLoaded} className="h-full">
        <div className="flex flex-col h-full space-y-6">
          
          {/* Badge */}
          {showBadge && (
            <div className={alignmentClass}>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white border-[#B89B7A] text-xs px-3 py-1"
              >
                {badgeText}
              </Badge>
            </div>
          )}

          {/* Header */}
          <div className={`space-y-4 ${alignmentClass}`}>
            {/* Title */}
            <InlineEditText
              as="h1"
              value={title}
              onSave={(newValue) => handlePropertyChange('title', newValue)}
              placeholder="Título do quiz..."
              className={`${classes.content} text-2xl md:text-3xl font-bold text-[#432818] leading-tight`}
            />

            {/* Subtitle */}
            <InlineEditText
              as="p"
              value={subtitle}
              onSave={(newValue) => handlePropertyChange('subtitle', newValue)}
              placeholder="Subtítulo do quiz..."
              className={`${classes.content} text-lg md:text-xl text-[#8F7A6A] leading-relaxed`}
            />
          </div>

          {/* Description */}
          <InlineEditText
            as="p"
            value={description}
            onSave={(newValue) => handlePropertyChange('description', newValue)}
            placeholder="Descrição do quiz..."
            className={`${classes.content} text-base text-[#432818]/80 leading-relaxed ${alignmentClass}`}
          />

          {/* Image (se fornecida) */}
          {imageUrl && (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Quiz de Estilo"
                className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
              />
            </div>
          )}

          {/* Benefits List */}
          {showBenefits && benefits && benefits.length > 0 && (
            <div className="space-y-3">
              <h3 className={`font-semibold text-[#432818] ${alignmentClass}`}>
                O que você vai descobrir:
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[#432818]/90">
                    <span className="text-[#B89B7A] mt-0.5 flex-shrink-0 font-bold">✓</span>
                    <span className="leading-relaxed">{benefit.replace(/^✓\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Name Input */}
          {showNameInput && (
            <div className="space-y-2">
              {nameInputLabel && (
                <label className={`block text-sm font-medium text-[#432818] ${alignmentClass}`}>
                  {nameInputLabel}
                </label>
              )}
              <input
                type="text"
                placeholder={nameInputPlaceholder}
                className="w-full px-4 py-3 border border-[#B89B7A]/30 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/50 focus:border-[#B89B7A] transition-all duration-200 bg-[#fffaf7]/50"
                name="userName"
              />
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-auto pt-4">
            <Button 
              className={`
                w-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] 
                hover:from-[#aa6b5d] hover:to-[#8F7A6A] 
                text-white font-semibold rounded-lg shadow-lg hover:shadow-xl 
                transition-all duration-300 transform hover:scale-105
                ${buttonSizeClass}
              `}
              onClick={() => {
                // Aqui seria implementada a lógica de avanço para próxima etapa
                console.log('🚀 Iniciando quiz de estilo...');
              }}
            >
              {buttonText}
            </Button>
          </div>

          {/* Footer Info */}
          {showFooter && (
            <div className={`${alignmentClass} pt-2`}>
              <p className="text-sm text-[#8F7A6A]/80">
                {footerText}
              </p>
            </div>
          )}

        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizStartPageInlineBlock;
