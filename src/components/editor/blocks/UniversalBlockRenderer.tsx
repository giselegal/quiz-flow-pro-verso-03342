
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import QuizQuestionInteractiveBlock from './QuizQuestionInteractiveBlock';
import QuizResultCalculatedBlock from './QuizResultCalculatedBlock';
import ProgressBarModernBlock from './ProgressBarModernBlock';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isPreview = false
}) => {
  const handleContentUpdate = (key: string, value: any) => {
    onUpdate({
      content: { ...block.content, [key]: value }
    });
  }

  const renderBlock = () => {
    switch (block.type) {
      case 'quiz-question-interactive':
        return (
          <QuizQuestionInteractiveBlock
            block={block}
            isSelected={isSelected}
            onClick={onSelect}
            onPropertyChange={(key, value) => onUpdate({ content: { ...block.content, [key]: value } })}
          />
        );
      case 'quiz-result-calculated':
        return (
          <QuizResultCalculatedBlock
            block={block}
            isSelected={isSelected}
            onClick={onSelect}
            onPropertyChange={(key, value) => onUpdate({ content: { ...block.content, [key]: value } })}
          />
        );
      case 'progress-bar-modern':
        return (
          <ProgressBarModernBlock
            block={block}
            isSelected={isSelected}
            onClick={onSelect}
            onPropertyChange={(key, value) => onUpdate({ content: { ...block.content, [key]: value } })}
          />
        );
      case 'header':
        return (
          <div className="text-center py-6">
            {isPreview ? (
              <>
                <h1 className="text-3xl font-bold mb-2">{block.content.title || 'Título'}</h1>
                {block.content.subtitle && (
                  <p className="text-lg text-gray-600">{block.content.subtitle}</p>
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={block.content.title || ''}
                  onChange={(e) => handleContentUpdate('title', e.target.value)}
                  placeholder="Digite o título"
                  className="text-3xl font-bold mb-2 w-full text-center bg-transparent border-none outline-none"
                />
                <input
                  type="text"
                  value={block.content.subtitle || ''}
                  onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                  className="text-lg text-gray-600 w-full text-center bg-transparent border-none outline-none"
                />
              </>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="py-4">
            {isPreview ? (
              <p className="text-gray-800 leading-relaxed">{block.content.text || 'Texto'}</p>
            ) : (
              <textarea
                value={block.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Digite o texto aqui..."
                className="w-full min-h-[100px] p-2 border border-gray-200 rounded resize-y"
              />
            )}
          </div>
        );

      case 'image':
        return (
          <div className="py-4">
            {block.content.imageUrl ? (
              <div className="text-center">
                <img
                  src={block.content.imageUrl}
                  alt={block.content.imageAlt || 'Imagem'}
                  className="max-w-full h-auto mx-auto rounded"
                />
                {block.content.caption && (
                  <p className="text-sm text-gray-600 mt-2">{block.content.caption}</p>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">Adicione uma URL de imagem no painel de propriedades</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="py-4 text-center">
            <Button
              onClick={isPreview ? () => window.open(block.content.buttonUrl || '#', '_blank') : undefined}
              className="px-6 py-2"
            >
              {block.content.buttonText || 'Clique aqui'}
            </Button>
          </div>
        );

      case 'quiz-question':
        return (
          <div className="py-6 border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              {isPreview ? (
                <h3 className="text-xl font-medium">{block.content.question || 'Pergunta do quiz'}</h3>
              ) : (
                <input
                  type="text"
                  value={block.content.question || ''}
                  onChange={(e) => handleContentUpdate('question', e.target.value)}
                  placeholder="Digite a pergunta"
                  className="text-xl font-medium w-full bg-transparent border-none outline-none"
                />
              )}
            </div>
            
            <div className="space-y-2">
              {(block.content.options || []).map((option: any, index: number) => (
                <div key={option.id || index} className="flex items-center gap-2">
                  <input type="radio" name={`question-${block.id}`} disabled />
                  <span className="flex-1">{option.text || `Opção ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div className="py-8">
            <div className="border-t border-gray-200"></div>
          </div>
        );

      default:
        return (
          <div className="py-4 text-center text-gray-500">
            <p>Tipo de bloco: {block.type}</p>
          </div>
        );
    }
  }

  const handlePropertyChange = (key: string, value: any) =>
    onUpdate({ content: { ...block.content, [key]: value } });
  const toPascal = (s: string) =>
    s.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const componentName = `${toPascal(block.type)}Block`;
  const Blocks = require('./blocks');
  const Dynamic = Blocks[componentName] as React.FC<any>;
  if (Dynamic) {
    return (
      <div onClick={onSelect} className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'} ${isPreview ? '' : 'border border-transparent hover:border-gray-200 rounded-lg p-2'}`}>
        <Dynamic block={block} isSelected={isSelected} onClick={onSelect} onPropertyChange={handlePropertyChange} />
      </div>
    );
  }
  return (
    <div onClick={onSelect} className={`py-4 text-center text-gray-500 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'}`}>Tipo de bloco: {block.type}</div>
  };
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'}
        ${isPreview ? '' : 'border border-transparent hover:border-gray-200 rounded-lg p-2'}
      `}
    >
      {renderBlock()}
      
      {!isPreview && isSelected && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
};

export default UniversalBlockRenderer;
