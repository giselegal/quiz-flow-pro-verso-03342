
import React from 'react';
import { cn } from '@/lib/utils';
import InlineEditableText from '@/components/editor/blocks/base/InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';

export interface QuizIntroBlockProps extends BlockComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  userName?: string;
  benefits?: string[];
  buttonText?: string;
  logoUrl?: string;
  onNext?: () => void;
  showBenefits?: boolean;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}

/**
 * BLOCO EDITÁVEL: Introdução do Quiz
 * 
 * Props Editáveis:
 * - title: string (título principal)
 * - subtitle: string (subtítulo)
 * - description: string (descrição)
 * - userName: string (nome do usuário)
 * - benefits: string[] (lista de benefícios)
 * - buttonText: string (texto do botão)
 * - logoUrl: string (URL do logo)
 * - showBenefits: boolean (mostrar benefícios)
 * - cores personalizáveis
 * 
 * Exemplo de Uso:
 * <QuizIntroBlock 
 *   title="Descubra Seu Estilo"
 *   subtitle="Quiz personalizado"
 *   description="Responda algumas perguntas..."
 *   userName="Maria"
 *   benefits={["Resultado instantâneo", "Personalizado"]}
 *   buttonText="Começar Quiz"
 *   showBenefits={true}
 * />
 */

const QuizIntroBlock: React.FC<QuizIntroBlockProps> = ({
  id = 'quiz-intro',
  title = 'Descubra Seu Estilo Único',
  subtitle = 'Quiz Personalizado de Estilo',
  description = 'Responda algumas perguntas rápidas e descubra qual estilo combina mais com sua personalidade.',
  userName = '',
  benefits = [
    'Resultado instantâneo e personalizado',
    'Baseado em análise de personalidade',
    'Dicas exclusivas para seu estilo'
  ],
  buttonText = 'Começar Quiz',
  logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  onNext = () => {},
  showBenefits = true,
  titleColor = '#432818',
  subtitleColor = '#8F7A6A',
  descriptionColor = '#5D4A3A',
  buttonColor = '#B89B7A',
  backgroundColor = '#ffffff',
  borderColor = '#B89B7A',
  className = '',
  isEditable = false,
  onUpdate = () => {}
}) => {
  const handleUpdateProperty = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ [key]: value });
    }
  };

  return (
    <div 
      className={cn(
        'quiz-intro-block w-full max-w-2xl mx-auto p-8 rounded-xl shadow-lg',
        'border-2 transition-all duration-300',
        className
      )}
      style={{ 
        backgroundColor, 
        borderColor: `${borderColor}40` 
      }}
      data-block-id={id}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="w-24 h-24 mx-auto rounded-full object-cover shadow-md"
        />
      </div>

      {/* Título */}
      <div className="text-center mb-6">
        {isEditable ? (
          <InlineEditableText
            value={title}
            onChange={(value: string) => handleUpdateProperty('title', value)}
            className="text-3xl font-bold text-center"
            style={{ color: titleColor }}
            placeholder="Título principal"
          />
        ) : (
          <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
            {title}
          </h1>
        )}
        
        {isEditable ? (
          <InlineEditableText
            value={subtitle}
            onChange={(value: string) => handleUpdateProperty('subtitle', value)}
            className="text-lg mt-2 text-center"
            style={{ color: subtitleColor }}
            placeholder="Subtítulo"
          />
        ) : (
          <p className="text-lg mt-2" style={{ color: subtitleColor }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div className="text-center mb-8">
        {isEditable ? (
          <InlineEditableText
            value={description}
            onChange={(value: string) => handleUpdateProperty('description', value)}
            className="text-base leading-relaxed text-center"
            style={{ color: descriptionColor }}
            placeholder="Descrição do quiz"
            isTextArea={true}
          />
        ) : (
          <p className="text-base leading-relaxed" style={{ color: descriptionColor }}>
            {description}
          </p>
        )}
      </div>

      {/* Saudação personalizada */}
      {userName && (
        <div className="text-center mb-6">
          <p className="text-lg font-medium" style={{ color: titleColor }}>
            Olá, {userName}! 👋
          </p>
        </div>
      )}

      {/* Benefícios */}
      {showBenefits && benefits.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: titleColor }}>
            O que você vai descobrir:
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5"
                  style={{ backgroundColor: buttonColor }}
                >
                  ✓
                </div>
                {isEditable ? (
                  <InlineEditableText
                    value={benefit}
                    onChange={(value: string) => {
                      const newBenefits = [...benefits];
                      newBenefits[index] = value;
                      handleUpdateProperty('benefits', newBenefits);
                    }}
                    placeholder="Benefício"
                    disabled={!isEditable}
                  />
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: descriptionColor }}>
                    {benefit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Começar */}
      <div className="text-center">
        <button
          onClick={onNext}
          className={cn(
            'px-8 py-4 rounded-lg font-semibold text-white text-lg',
            'transition-all duration-300 transform hover:scale-105',
            'shadow-lg hover:shadow-xl',
            'focus:outline-none focus:ring-4 focus:ring-opacity-50'
          )}
          style={{ 
            backgroundColor: buttonColor,
            boxShadow: `0 4px 15px ${buttonColor}40`
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default QuizIntroBlock;
