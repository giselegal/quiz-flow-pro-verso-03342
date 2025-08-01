
import React from 'react';
import { EditorBlock } from '@/types/editor';

interface UniversalBlockRendererProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  isPreview: boolean;
}

export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isPreview
}) => {
  const renderContent = () => {
    switch (block.type) {
      case 'header':
        return (
          <h1 className="text-2xl font-bold text-gray-800">
            {block.content?.text || 'Título'}
          </h1>
        );
        
      case 'text':
        return (
          <p className="text-gray-700">
            {block.content?.text || 'Texto do parágrafo'}
          </p>
        );
        
      case 'image':
        return (
          <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
            {block.content?.imageUrl ? (
              <img 
                src={block.content.imageUrl} 
                alt="Imagem" 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-gray-500">Imagem</span>
            )}
          </div>
        );
        
      case 'button':
        return (
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {block.content?.text || 'Botão'}
          </button>
        );
        
      case 'spacer':
        return (
          <div className="h-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">Espaçador</span>
          </div>
        );
        
      case 'quiz-question':
        return (
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-2">
              {block.content?.question || 'Pergunta do Quiz'}
            </h3>
            <div className="space-y-2">
              {(block.content?.options || ['Opção 1', 'Opção 2']).map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="radio" name={`question-${block.id}`} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-gray-100 p-4 rounded">
            <span className="text-gray-500">Componente: {block.type}</span>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderContent()}
      
      {!isPreview && isSelected && (
        <div className="absolute top-2 right-2 bg-white shadow-md rounded flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};
