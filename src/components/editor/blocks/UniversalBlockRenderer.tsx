
import React from 'react';
import { FunnelBlock } from '@/types/funnel';

interface UniversalBlockRendererProps {
  block: FunnelBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FunnelBlock>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isPreview = false
}) => {
  // Basic fallback renderer for different block types
  const renderBlock = () => {
    switch (block.type) {
      case 'quiz-intro-header':
        return (
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-[#432818]">Quiz Header</div>
              <div className="text-sm text-gray-500">Progresso: 0%</div>
            </div>
            {block.properties?.title && (
              <h1 className="text-2xl font-bold text-[#432818] mb-2">
                {block.properties.title}
              </h1>
            )}
            {block.properties?.subtitle && (
              <p className="text-gray-600">{block.properties.subtitle}</p>
            )}
          </div>
        );

      case 'text-inline':
      case 'text':
        return (
          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-700">
              {block.properties?.text || 'Texto do componente'}
            </p>
          </div>
        );

      case 'heading-inline':
      case 'heading':
        return (
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-xl font-bold text-[#432818]">
              {block.properties?.text || 'Título do componente'}
            </h2>
          </div>
        );

      case 'button-inline':
      case 'button':
        return (
          <div className="bg-white border rounded-lg p-4">
            <button className="bg-[#D4C4A0] hover:bg-[#B89B7A] text-[#432818] font-semibold py-2 px-6 rounded-lg transition-colors">
              {block.properties?.text || 'Botão'}
            </button>
          </div>
        );

      case 'image-display-inline':
      case 'image':
        return (
          <div className="bg-white border rounded-lg p-4">
            {block.properties?.imageUrl ? (
              <img 
                src={block.properties.imageUrl} 
                alt={block.properties?.imageAlt || 'Imagem'} 
                className="max-w-full h-auto rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>Imagem não definida</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'form-input':
        return (
          <div className="bg-white border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {block.properties?.label || 'Campo de entrada'}
            </label>
            <input
              type={block.properties?.inputType || 'text'}
              placeholder={block.properties?.placeholder || 'Digite aqui...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89B7A]"
            />
          </div>
        );

      case 'spacer':
        return (
          <div className="bg-white border rounded-lg p-4">
            <div 
              className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
              style={{ height: block.properties?.height || 40 }}
            >
              <span className="text-gray-400 text-sm">Espaçador</span>
            </div>
          </div>
        );

      case 'options-grid':
        return (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-[#432818]">
              {block.properties?.question || 'Pergunta do Quiz'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(block.properties?.options || ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']).map((option: string, index: number) => (
                <button
                  key={index}
                  className="p-3 border-2 border-[#D4C4A0] rounded-lg hover:bg-[#F5F2E9] transition-colors text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="text-yellow-600 text-sm font-medium">
                Componente: {block.type}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Renderer não implementado para este tipo de bloco
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`
        relative transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${!isPreview ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={!isPreview ? onSelect : undefined}
    >
      {renderBlock()}
    </div>
  );
};
