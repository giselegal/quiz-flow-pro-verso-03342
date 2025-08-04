import React from 'react';
import { ChartArea } from 'lucide-react';
import { InlineEditableText } from './InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';

const ChartAreaBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const { title = 'Gráfico de Área', data = [], xAxisKey = 'x', yAxisKey = 'y' } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        py-6 text-center bg-gray-100 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <h3 className="text-xl font-bold text-[#432818] mb-4">
        <InlineEditableText
          value={title}
          onChange={(value: string) => handlePropertyChange('title', value)}
          className="inline-block"
          placeholder="Título do gráfico"
        />
      </h3>
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
        <div className="text-center">
          <ChartArea className="w-12 h-12 opacity-50 mx-auto mb-2" />
          <p>Visualização do Gráfico de Área</p>
          <p className="text-xs mt-1">Dados: {Array.isArray(data) ? data.length : 0} pontos</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">Configure os dados no painel de propriedades.</p>
    </div>
  );
};

export default ChartAreaBlock;
