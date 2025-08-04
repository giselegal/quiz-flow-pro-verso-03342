import React from 'react';
import { ArrowRight, Star, Shield } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const AdvancedCTAInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Transforme Seu Estilo Hoje!',
    subtitle = 'Descubra o método que já mudou a vida de mais de 10.000 mulheres',
    buttonText = 'QUERO TRANSFORMAR MEU ESTILO',
    price = 'R$ 197',
    originalPrice = 'R$ 397',
    features = ['Acesso Imediato', 'Garantia de 30 dias', 'Suporte Exclusivo'],
    urgencyText = 'Oferta válida apenas hoje!',
  } = block.properties;

  return (
    <div
      className={`
        w-full flex flex-col items-center
        p-6 rounded-xl transition-all duration-200
        bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5
        ${
          isSelected
            ? 'border-2 border-blue-500 bg-blue-50'
            : 'border-2 border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50/30'
        }
        ${className}
      `}
    >
      <div className="w-full text-center space-y-6">
        {/* Título Principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h2>

        {/* Subtítulo */}
        <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>

        {/* Recursos */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          {features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
              <Star className="w-4 h-4 text-[#B89B7A]" />
              <span className="text-sm font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Preço */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
            <span className="text-3xl font-bold text-[#B89B7A]">{price}</span>
          </div>
          <p className="text-sm text-red-600 font-medium mt-2">{urgencyText}</p>
        </div>

        {/* Botão Principal */}
        <button
          className="
          w-full max-w-md mx-auto
          bg-gradient-to-r from-[#B89B7A] to-[#a08965] 
          hover:from-[#a08965] hover:to-[#8f7854]
          text-white font-bold text-lg
          px-8 py-4 rounded-xl
          transition-all duration-300
          transform hover:scale-105 hover:shadow-xl
          flex items-center justify-center gap-3
          border-0 cursor-pointer
        "
        >
          <Shield className="w-5 h-5" />
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Garantia */}
        <p className="text-sm text-gray-500 mt-4">
          <Shield className="w-4 h-4 inline mr-1" />
          Garantia incondicional de 30 dias
        </p>
      </div>
    </div>
  );
};

export default AdvancedCTAInlineBlock;
