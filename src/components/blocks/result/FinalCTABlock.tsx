import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * BLOCO EDITÁVEL: Call-to-Action Final
 * 
 * Props Editáveis:
 * - title: string (título principal)
 * - subtitle: string (subtítulo)
 * - description: string (descrição)
 * - buttonText: string (texto do botão)
 * - buttonUrl: string (URL do botão)
 * - buttonStyle: 'primary' | 'secondary' | 'success' | 'warning'
 * - buttonSize: 'sm' | 'md' | 'lg'
 * - showUrgency: boolean (mostrar elementos de urgência)
 * - urgencyText: string (texto de urgência)
 * - backgroundColor: string
 * - textAlign: 'left' | 'center' | 'right'
 * 
 * Exemplo de Uso:
 * <FinalCTABlock 
 *   title="Não perca esta oportunidade!"
 *   buttonText="Garantir minha vaga"
 *   showUrgency={true}
 *   urgencyText="Oferta válida por tempo limitado"
 * />
 */

export interface FinalCTABlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'warning';
  buttonSize?: 'sm' | 'lg' | 'default';
  showUrgency?: boolean;
  urgencyText?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

const FinalCTABlock: React.FC<FinalCTABlockProps> = ({
  blockId = 'final-cta',
  title = 'Sua transformação começa agora!',
  subtitle = 'Não deixe para depois',
  description = 'Garante já seu acesso completo ao CaktoQuiz e descubra seu estilo único.',
  buttonText = 'Quero me transformar agora',
  buttonUrl = '#',
  buttonStyle = 'primary',
  buttonSize = 'lg',
  showUrgency = true,
  urgencyText = '⏰ Oferta por tempo limitado',
  backgroundColor = '#f8f9fa',
  textAlign = 'center',
  className = '',
}) => {
  const handleClick = () => {
    if (buttonUrl && buttonUrl !== '#') {
      window.open(buttonUrl, '_blank');
    }
  };

  return (
    <div 
      className={`final-cta-block py-16 px-6 ${className}`} 
      data-block-id={blockId}
      style={{ 
        backgroundColor,
        textAlign 
      }}
    >
      <div className="max-w-4xl mx-auto">
        {showUrgency && urgencyText && (
          <div className="mb-4">
            <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
              {urgencyText}
            </span>
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h2>
        
        {subtitle && (
          <h3 className="text-xl md:text-2xl text-[#6B5B73] mb-6">
            {subtitle}
          </h3>
        )}
        
        {description && (
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        <Button
          onClick={handleClick}
          size={buttonSize}
          className={`
            px-8 py-4 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl
            ${buttonStyle === 'primary' ? 'bg-[#B89B7A] hover:bg-[#a68a6d]' : ''}
            ${buttonStyle === 'secondary' ? 'bg-gray-600 hover:bg-gray-700' : ''}
            ${buttonStyle === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
            ${buttonStyle === 'warning' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          `}
        >
          {buttonText}
        </Button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>✅ Acesso imediato • ✅ Garantia de 7 dias • ✅ Suporte especializado</p>
        </div>
      </div>
    </div>
  );
};

export default FinalCTABlock;
