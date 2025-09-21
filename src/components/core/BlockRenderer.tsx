/**
 * 🧩 BLOCK RENDERER - RENDERIZADOR UNIVERSAL DE BLOCOS
 * 
 * Componente unificado para renderizar todos os tipos de blocos do editor
 * ✅ Suporte a todos os tipos de bloco
 * ✅ Modo preview e edição
 * ✅ Controles de edição integrados
 * ✅ Performance otimizada
 */

import React, { memo, useCallback } from 'react';
import { Block } from '@/types/editor';

// Componentes específicos por tipo de bloco
import HeadlineBlock from './blocks/HeadlineBlock';
import TextBlock from './blocks/TextBlock';
import ButtonBlock from './blocks/ButtonBlock';
import ImageBlock from './blocks/ImageBlock';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  showEditControls?: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  isPreview,
  onUpdate,
  showEditControls = true
}) => {
  const handleContentUpdate = useCallback((content: any) => {
    onUpdate({ content: { ...block.content, ...content } });
  }, [block.content, onUpdate]);

  const handlePropertiesUpdate = useCallback((properties: any) => {
    onUpdate({ properties: { ...block.properties, ...properties } });
  }, [block.properties, onUpdate]);

  // Renderizar componente específico baseado no tipo
  const renderBlockComponent = () => {
    const commonProps = {
      block,
      isSelected,
      isPreview,
      onUpdateContent: handleContentUpdate,
      onUpdateProperties: handlePropertiesUpdate,
      showEditControls
    };

    switch (block.type) {
      case 'headline':
        return <HeadlineBlock {...commonProps} />;
      
      case 'text':
        return <TextBlock {...commonProps} />;
      
      case 'button':
        return <ButtonBlock {...commonProps} />;
      
      case 'image':
        return <ImageBlock {...commonProps} />;
      
      case 'form-input':
        return (
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Formulário</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Nome" 
                className="w-full p-2 border rounded"
                disabled={!isPreview}
              />
              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full p-2 border rounded"
                disabled={!isPreview}
              />
              <button 
                className="w-full bg-blue-600 text-white p-2 rounded"
                disabled={!isPreview}
              >
                Enviar
              </button>
            </div>
          </div>
        );
      
      case 'quiz-question-inline':
        return (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {block.content?.question || 'Pergunta do Quiz'}
            </h3>
            {block.content?.options && Array.isArray(block.content.options) && (
              <div className="space-y-2">
                {block.content.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    className="block w-full p-2 text-left bg-white border border-blue-300 rounded hover:bg-blue-50"
                    disabled={isPreview}
                  >
                    {typeof option === 'string' ? option : option.text || 'Opção'}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'options-grid':
        return (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {block.content?.title || block.properties?.title || 'Escolha uma opção:'}
            </h3>
            <div className={`grid gap-3 ${block.properties?.columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {block.properties?.options?.map((option: any, index: number) => (
                <button
                  key={option.id || index}
                  className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  disabled={isPreview}
                >
                  <div className="font-medium">{option.text}</div>
                  {option.description && (
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'mentor-section-inline':
        return (
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">GM</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-900">
                  {block.content?.title || 'Gisele Galvão'}
                </h3>
                <p className="text-purple-700">
                  {block.content?.subtitle || 'Consultora de Imagem'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'testimonial-card-inline':
        return (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div>
                <p className="text-gray-600 italic mb-2">
                  "Excelente serviço! Recomendo para todas as mulheres."
                </p>
                <div className="font-medium text-gray-900">Cliente Satisfeita</div>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
          </div>
        );

      case 'testimonials-carousel-inline':
        return (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-center mb-4">
              {block.content?.title || 'Depoimentos'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {block.content?.subtitle || 'O que nossos clientes dizem'}
            </p>
            <div className="bg-white p-4 rounded border">
              <p className="italic text-gray-600 mb-2">
                "Transformação incrível! Me sinto muito mais confiante."
              </p>
              <div className="font-medium">Maria Silva</div>
              <div className="text-yellow-500">★★★★★</div>
            </div>
          </div>
        );

      case 'container':
        return (
          <div 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]"
            style={{ backgroundColor: block.content?.backgroundColor || '#ffffff' }}
          >
            <div className="text-center text-gray-500">
              Container - Arraste componentes aqui
            </div>
          </div>
        );

      case 'spacer':
      case 'spacer-inline':
        return (
          <div 
            className="w-full bg-gray-100 border border-gray-300 rounded"
            style={{ height: block.content?.height || '20px' }}
          >
            {!isPreview && (
              <div className="text-center text-xs text-gray-500 py-1">
                Espaçador ({block.content?.height || '20px'})
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800">
              <strong>Tipo:</strong> {block.type}
            </div>
            <div className="text-sm mt-2 text-yellow-700">
              {block.content?.title || block.content?.text || 'Componente personalizado'}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`block-renderer ${isSelected ? 'selected' : ''}`}>
      {renderBlockComponent()}
    </div>
  );
};

// Otimização de re-render
const arePropsEqual = (prevProps: BlockRendererProps, nextProps: BlockRendererProps): boolean => {
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isPreview === nextProps.isPreview &&
    JSON.stringify(prevProps.block.content) === JSON.stringify(nextProps.block.content) &&
    JSON.stringify(prevProps.block.properties) === JSON.stringify(nextProps.block.properties)
  );
};

BlockRenderer.displayName = 'BlockRenderer';

export default memo(BlockRenderer, arePropsEqual);