// @ts-nocheck
import { ArrowRight, Star, Shield } from 'lucide-react';
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
  } = block?.properties || {};

  return (
    <div
      className={`
        w-full flex flex-col items-center
        p-6 rounded-xl transition-all duration-200
        bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      <div className="w-full text-center space-y-6">
        {/* Título Principal */}
        <h2 style={{ color: '#432818' }}>{title}</h2>

        {/* Subtítulo */}
        <p style={{ color: '#6B4F43' }}>{subtitle}</p>

        {/* Recursos */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          {features.map((feature: string, index: number) => (
            <div key={index} style={{ borderColor: '#E5DDD5' }}>
              <Star className="w-4 h-4 text-[#B89B7A]" />
              <span style={{ color: '#6B4F43' }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Preço */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3">
            <span style={{ color: '#8B7355' }}>{originalPrice}</span>
            <span className="text-3xl font-bold text-[#B89B7A]">{price}</span>
          </div>
          <p style={{ color: '#432818' }}>{urgencyText}</p>
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
        <p style={{ color: '#8B7355' }}>
          <Shield className="w-4 h-4 inline mr-1" />
          Garantia incondicional de 30 dias
        </p>
      </div>
    </div>
  );
};

export default AdvancedCTAInlineBlock;
