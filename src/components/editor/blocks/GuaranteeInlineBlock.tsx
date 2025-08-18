// @ts-nocheck
import { Shield, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const GuaranteeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Garantia de 30 Dias',
    description = 'Se você não ficar satisfeita com o resultado, devolvemos 100% do seu dinheiro em até 30 dias.',
    features = [
      'Garantia incondicional',
      'Devolução em até 30 dias',
      'Suporte completo',
      'Sem riscos',
    ] as string[],
    iconType = 'shield', // shield, star, check
    backgroundColor = '#f9f4ef',
    borderColor = '#B89B7A',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleFeatureChange = (index: number, newValue: string) => {
    const newFeatures = [...features];
    newFeatures[index] = newValue;
    handlePropertyChange('features', newFeatures);
  };

  const getIcon = () => {
    switch (iconType) {
      case 'star':
        return <Star className="w-12 h-12 text-[#B89B7A]" />;
      case 'check':
        return <CheckCircle className="w-12 h-12 text-[#B89B7A]" />;
      default:
        return <Shield className="w-12 h-12 text-[#B89B7A]" />;
    }
  };

  return (
    <div
      className={`
        w-full
        p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      <div
        className="p-6 rounded-lg border shadow-sm"
        style={{
          backgroundColor,
          borderColor: `${borderColor}/20`,
        }}
      >
        <div className="text-center mb-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-white shadow-md">{getIcon()}</div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              'text-2xl font-bold text-[#aa6b5d] mb-4 cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40',
              isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50',
              // Margens universais com controles deslizantes
              getMarginClass(marginTop, 'top'),
              getMarginClass(marginBottom, 'bottom'),
              getMarginClass(marginLeft, 'left'),
              getMarginClass(marginRight, 'right')
            )}
            onClick={onClick}
            title="Clique para editar no Painel de Propriedades"
          >
            {title || 'Título da garantia'}
          </h3>

          {/* Description */}
          <p
            className={cn(
              'text-[#432818] text-lg leading-relaxed mb-6 cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40',
              isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50'
            )}
            onClick={onClick}
            title="Clique para editar no Painel de Propriedades"
          >
            {description || 'Descrição da garantia...'}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-[#432818] flex-1">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuaranteeInlineBlock;
