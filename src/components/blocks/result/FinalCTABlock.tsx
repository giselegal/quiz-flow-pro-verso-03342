
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import type { BlockData } from '@/types/blocks';

interface FinalCTABlockProps {
  block: BlockData;
  className?: string;
  onUpdate?: (updates: Partial<BlockData>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const FinalCTABlock: React.FC<FinalCTABlockProps> = ({
  block,
  className,
  onUpdate,
  isSelected,
  onSelect
}) => {
  const properties = block.properties || {};
  const {
    title = 'Transforme seu estilo agora!',
    subtitle = 'Não perca esta oportunidade única',
    buttonText = 'Quero transformar meu estilo',
    buttonSize = 'lg',
    urgencyText = 'Oferta válida por tempo limitado',
    showGuarantee = true,
    guaranteeText = 'Garantia de 30 dias',
    showTestimonials = true,
    primaryColor = '#B89B7A'
  } = properties;

  const handleClick = () => {
    onSelect?.();
  };

  // Ensure buttonSize is valid
  const validButtonSize = ['sm', 'md', 'lg'].includes(buttonSize) ? buttonSize : 'lg';

  return (
    <div
      className={cn(
        'final-cta-block w-full py-12 px-6',
        'bg-gradient-to-r from-[#FAF9F7] to-white',
        'border-t-4 border-[#B89B7A]',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={handleClick}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {subtitle}
          </p>
        </div>

        {/* Urgency */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            {urgencyText}
          </div>
        </div>

        {/* Main Button */}
        <div className="mb-8">
          <Button 
            size={validButtonSize as "sm" | "md" | "lg"}
            className="bg-[#B89B7A] hover:bg-[#A68A6D] text-white font-semibold px-8 py-4 text-lg"
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Trust Elements */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          {showGuarantee && (
            <div className="flex items-center text-gray-600">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              <span className="text-sm">{guaranteeText}</span>
            </div>
          )}
          
          {showTestimonials && (
            <div className="flex items-center text-gray-600">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm">Mais de 1000 clientes satisfeitos</span>
            </div>
          )}
        </div>

        {/* Secondary Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Processamento seguro • Sem taxas ocultas • Suporte 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalCTABlock;
