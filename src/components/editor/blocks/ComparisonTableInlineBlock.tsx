import React from 'react';
import { Check, X } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const ComparisonTableInlineBlock: React.FC<BlockComponentProps> = ({ 
  block,
  isSelected = false,
  onPropertyChange,
  className = ''
}) => {
  const { 
    title = 'Comparação de Opções',
    items = [
      { name: 'Opção Básica', price: 'R$ 97', features: ['Recurso 1', 'Recurso 2'], highlight: false },
      { name: 'Opção Premium', price: 'R$ 197', features: ['Recurso 1', 'Recurso 2', 'Recurso 3'], highlight: true }
    ]
  } = block.properties;

  return (
    <div 
      className={`
        w-full flex flex-col items-center
        p-4 rounded-lg transition-all duration-200
        ${isSelected 
          ? 'border-2 border-yellow-500 bg-yellow-50' 
          : 'border-2 border-dashed border-transparent hover:border-yellow-300 hover:bg-yellow-50/30'
        }
        ${className}
      `}
    >
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        {title}
      </h3>
      
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item: any, index: number) => (
            <div 
              key={index}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                ${item.highlight 
                  ? 'border-[#B89B7A] bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5 shadow-lg' 
                  : 'border-gray-200 bg-white'
                }
              `}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.name}
                </h4>
                <div className="text-2xl font-bold text-[#B89B7A]">
                  {item.price}
                </div>
              </div>
              
              <ul className="space-y-2">
                {item.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {item.highlight && (
                <div className="mt-4 text-center">
                  <span className="inline-block bg-[#B89B7A] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTableInlineBlock;