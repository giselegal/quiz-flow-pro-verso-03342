// @ts-nocheck
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCarouselBlockProps {
  title?: string;
  showDescription?: boolean;
  className?: string;
}

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

const ProductCarouselBlock: React.FC<ProductCarouselBlockProps> = ({
  title = 'Vista-se de Você — na Prática',
  showDescription = true,
  className,
}) => {
  const handleCTAClick = () => {
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  return (
    <div
      className={cn(
        'text-center mt-10',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">{title}</h2>
      <div className="elegant-divider"></div>
      {showDescription && (
        <p className="text-[#432818] mb-6 max-w-xl mx-auto">
          Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. O Guia da
          Gisele Galvão foi criado para mulheres como você — que querem se vestir com autenticidade
          e transformar sua imagem em ferramenta de poder.
        </p>
      )}

      <button
        onClick={handleCTAClick}
        className="text-white py-5 px-8 rounded-md shadow-md transition-all duration-300 transform hover:scale-105"
        style={{
          background: 'linear-gradient(to right, #4CAF50, #45a049)',
          boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
          fontSize: '1rem',
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Garantir Meu Guia + Bônus Especiais</span>
        </span>
      </button>
    </div>
  );
};

export default ProductCarouselBlock;
