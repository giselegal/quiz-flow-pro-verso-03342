import React from 'react';
import { Shield, CheckCircle, Star } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

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
    features = ['Garantia incondicional', 'Devolução em até 30 dias', 'Suporte completo', 'Sem riscos'] as string[],
    iconType = 'shield', // shield, star, check
    backgroundColor = '#f9f4ef',
    borderColor = '#B89B7A',
  } = block.properties;

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
            ? 'border-2 border-blue-500 bg-blue-50'
            : 'border-2 border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50/30'
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
              'text-2xl font-bold text-[#aa6b5d] mb-4 cursor-pointer p-2 rounded border-2 border-transparent hover:border-blue-300',
              isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
            )}
            onClick={onClick}
            title="Clique para editar no Painel de Propriedades"
          >
            {title || 'Título da garantia'}
          </h3>

          {/* Description */}
          <p
            className={cn(
              'text-[#432818] text-lg leading-relaxed mb-6 cursor-pointer p-2 rounded border-2 border-transparent hover:border-blue-300',
              isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
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
