import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { AnimatedWrapper } from '../../../ui/animated-wrapper';
import { InlineEditText } from '../InlineEditText';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import type { InlineBlockProps } from '../../../../types/inlineBlocks';

/**
 * QuizExperienceInlineBlock - Componente inline para questões sobre experiência
 * 
 * Componente modular e responsivo para coletar informações sobre experiência do usuário.
 * Inclui título, opções de experiência e navegação.
 */

interface QuizExperienceInlineProperties {
  // Conteúdo principal
  title?: string;
  subtitle?: string;
  question?: string;
  
  // Opções de experiência
  options?: Array<{
    id: string;
    label: string;
    description?: string;
    value: string;
  }>;
  
  // Visual
  showBadge?: boolean;
  badgeText?: string;
  
  // Layout
  buttonSize?: 'sm' | 'md' | 'lg';
  contentAlignment?: 'left' | 'center' | 'right';
  
  // Navegação
  nextButtonText?: string;
  backButtonText?: string;
  showBackButton?: boolean;
}

interface QuizExperienceInlineProps extends InlineBlockProps {
  block: {
    id: string;
    type: string;
    properties: QuizExperienceInlineProperties & Record<string, any>;
  };
}

const QuizExperienceInlineBlock: React.FC<QuizExperienceInlineProps> = (props) => {
  const {
    isLoaded,
    properties,
    classes,
    commonProps,
    handlePropertyChange
  } = useInlineBlock(props);

  const {
    // Conteúdo
    title = 'Qual é o seu nível de experiência?',
    subtitle = 'Queremos entender melhor seu perfil',
    question = 'Selecione a opção que melhor descreve sua experiência:',
    
    // Opções
    options = [
      {
        id: 'beginner',
        label: 'Iniciante',
        description: 'Estou começando agora',
        value: 'beginner'
      },
      {
        id: 'intermediate',
        label: 'Intermediário',
        description: 'Tenho alguma experiência',
        value: 'intermediate'
      },
      {
        id: 'advanced',
        label: 'Avançado',
        description: 'Tenho bastante experiência',
        value: 'advanced'
      },
      {
        id: 'expert',
        label: 'Especialista',
        description: 'Sou muito experiente',
        value: 'expert'
      }
    ],
    
    // Visual
    showBadge = true,
    badgeText = 'Etapa 3 - Experiência',
    
    // Layout
    buttonSize = 'md',
    contentAlignment = 'center',
    
    // Navegação
    nextButtonText = 'Continuar',
    backButtonText = 'Voltar',
    showBackButton = true
  } = properties;

  const [selectedOption, setSelectedOption] = React.useState<string>('');

  const alignmentClass = contentAlignment === 'center' ? 'text-center' : 
                        contentAlignment === 'right' ? 'text-right' : 'text-left';

  const buttonSizeClass = buttonSize === 'sm' ? 'px-4 py-2 text-sm' :
                         buttonSize === 'lg' ? 'px-8 py-4 text-lg' :
                         'px-6 py-3 text-base';

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    handlePropertyChange('selectedExperience', value);
  };

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
              as="h2"
              value={title}
              onSave={(newValue) => handlePropertyChange('title', newValue)}
              placeholder="Título da questão..."
              className={`${classes.content} text-2xl md:text-3xl font-bold text-[#432818] leading-tight`}
            />

            {/* Subtitle */}
            <InlineEditText
              as="p"
              value={subtitle}
              onSave={(newValue) => handlePropertyChange('subtitle', newValue)}
              placeholder="Subtítulo da questão..."
              className={`${classes.content} text-lg text-[#8F7A6A] leading-relaxed`}
            />
          </div>

          {/* Question */}
          <InlineEditText
            as="p"
            value={question}
            onSave={(newValue) => handlePropertyChange('question', newValue)}
            placeholder="Pergunta sobre experiência..."
            className={`${classes.content} text-base text-[#432818]/80 leading-relaxed ${alignmentClass}`}
          />

          {/* Options */}
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                  selectedOption === option.value
                    ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-md'
                    : 'border-[#B89B7A]/20 bg-white hover:border-[#B89B7A]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#432818] mb-1">
                      {option.label}
                    </h4>
                    {option.description && (
                      <p className="text-sm text-[#8F7A6A]">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === option.value
                      ? 'border-[#B89B7A] bg-[#B89B7A]'
                      : 'border-[#B89B7A]/40'
                  }`}>
                    {selectedOption === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {showBackButton && (
              <Button
                variant="outline"
                className={`flex-1 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white ${buttonSizeClass}`}
              >
                {backButtonText}
              </Button>
            )}
            
            <Button
              disabled={!selectedOption}
              className={`flex-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:from-[#aa6b5d] hover:to-[#B89B7A] text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed ${buttonSizeClass}`}
            >
              {nextButtonText}
            </Button>
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizExperienceInlineBlock;