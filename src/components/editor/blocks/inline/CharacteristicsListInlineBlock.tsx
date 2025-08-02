import React from 'react';
import { cn } from '../../../../lib/utils';
import { BlockComponentProps } from '../../../../types/blocks';

const CharacteristicsListInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const characteristics = block?.properties?.characteristics || [
    'Elegância natural e sofisticação',
    'Preferência por peças atemporais',
    'Valoriza qualidade sobre quantidade',
    'Gosta de looks bem estruturados',
    'Prefere cores neutras e clássicas'
  ];

  const title = block?.properties?.title || 'Características do seu estilo:';
  const iconType = block?.properties?.iconType || 'check';

  const getIcon = () => {
    switch (iconType) {
      case 'star': return '⭐';
      case 'check': return '✓';
      case 'heart': return '💖';
      case 'diamond': return '💎';
      default: return '✓';
    }
  };

  return (
    <div 
      className={cn(
        "characteristics-list p-6 border border-gray-200 rounded-lg bg-white",
        "hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-[#B89B7A] bg-[#FAF9F7]",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4 text-[#432818]">
        {title}
      </h3>
      <ul className="space-y-3">
        {characteristics.map((item: string, index: number) => (
          <li key={index} className="flex items-start">
            <span className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5 flex-shrink-0">
              {getIcon()}
            </span>
            <span className="text-gray-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      
      {/* Área editável quando selecionado */}
      {isSelected && onPropertyChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>💡 <strong>Editável:</strong> Clique para personalizar as características</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacteristicsListInlineBlock;
