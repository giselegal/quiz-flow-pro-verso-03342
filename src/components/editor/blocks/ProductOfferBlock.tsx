// @ts-nocheck
import { ShoppingCart, Check } from 'lucide-react';
import { InlineEditableText } from './InlineEditableText';
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

const ProductOfferBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    productName = 'Produto Incrível',
    productImage = '',
    originalPrice = 'R$ 297,00',
    discountPrice = 'R$ 197,00',
    buttonText = 'ADQUIRIR AGORA',
    buttonUrl = '',
    features = [],
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Imagem do Produto */}
        {productImage && (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          {/* Nome do Produto */}
          <InlineEditableText
            value={productName}
            onChange={(value: string) => handlePropertyChange('productName', value)}
            className="text-xl font-bold text-[#432818] mb-4"
            placeholder="Nome do produto"
          />

          {/* Preços */}
          <div className="flex items-center space-x-3 mb-4">
            <InlineEditableText
              value={originalPrice}
              onChange={(value: string) => handlePropertyChange('originalPrice', value)}
              style={{ color: '#8B7355' }}
              placeholder="Preço original"
            />
            <InlineEditableText
              value={discountPrice}
              onChange={(value: string) => handlePropertyChange('discountPrice', value)}
              className="text-2xl font-bold text-[#B89B7A]"
              placeholder="Preço com desconto"
            />
          </div>

          {/* Benefícios */}
          {features.length > 0 && (
            <div className="space-y-2 mb-6">
              {features.map((feature: any, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {isEditing ? (
                    <InlineEditableText
                      value={feature.text}
                      onChange={(value: string) => {
                        const updatedFeatures = features.map((feat: any, i: number) =>
                          i === index ? { ...feat, text: value } : feat
                        );
                        handlePropertyChange('features', updatedFeatures);
                      }}
                      style={{ color: '#6B4F43' }}
                      placeholder="Benefício do produto"
                    />
                  ) : (
                    <span style={{ color: '#6B4F43' }}>{feature.text}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Botão */}
          <button className="w-full bg-[#B89B7A] hover:bg-[#a08965] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <InlineEditableText
              value={buttonText}
              onChange={(value: string) => handlePropertyChange('buttonText', value)}
              className="text-white font-bold"
              placeholder="Texto do botão"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOfferBlock;
