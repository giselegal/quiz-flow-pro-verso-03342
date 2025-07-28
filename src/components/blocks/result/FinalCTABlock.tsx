
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface FinalCTABlockProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
  className?: string;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}

const FinalCTABlock: React.FC<FinalCTABlockProps> = ({
  id = 'final-cta',
  title = 'Pronta para Transformar Seu Estilo?',
  subtitle = 'Descubra como aplicar seu resultado na prática',
  description = 'Tenha acesso ao guia completo com dicas personalizadas baseadas no seu perfil de estilo.',
  buttonText = 'Quero Transformar Meu Estilo',
  buttonUrl = '#',
  buttonSize = 'lg',
  showSecondaryButton = false,
  secondaryButtonText = 'Saiba Mais',
  secondaryButtonUrl = '#',
  backgroundColor = '#ffffff',
  titleColor = '#432818',
  descriptionColor = '#8F7A6A',
  buttonColor = '#B89B7A',
  className = '',
  isEditable = false,
  onUpdate
}) => {
  const validButtonSize = ['sm', 'md', 'lg'].includes(buttonSize) ? buttonSize as 'sm' | 'md' | 'lg' : 'lg';

  return (
    <div 
      className={`final-cta-block p-8 rounded-xl text-center ${className}`}
      style={{ backgroundColor }}
      data-block-id={id}
    >
      {title && (
        <h2 
          className="text-3xl font-playfair font-bold mb-4"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-xl mb-6" style={{ color: descriptionColor }}>
          {subtitle}
        </p>
      )}
      
      {description && (
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: descriptionColor }}>
          {description}
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size={validButtonSize}
          className="text-white font-semibold px-8"
          style={{ backgroundColor: buttonColor }}
          onClick={() => window.open(buttonUrl, '_blank')}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        {showSecondaryButton && (
          <Button
            variant="outline"
            size={validButtonSize}
            className="font-semibold px-8"
            style={{ borderColor: buttonColor, color: buttonColor }}
            onClick={() => window.open(secondaryButtonUrl, '_blank')}
          >
            {secondaryButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinalCTABlock;
