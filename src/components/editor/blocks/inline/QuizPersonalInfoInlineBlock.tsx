import React from 'react';
import type { BlockComponentProps } from '../../../../types/blocks';

interface QuizPersonalInfoInlineBlockProps extends BlockComponentProps {
  // Props específicas do componente
}

const QuizPersonalInfoInlineBlock: React.FC<QuizPersonalInfoInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  return (
    <div 
      className={`quiz-personal-info-block ${className || ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-4">
          {block.properties?.title || 'Informações Pessoais'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu telefone"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPersonalInfoInlineBlock;
