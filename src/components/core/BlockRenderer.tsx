import { Block } from '@/types/editor';
import { useCallback, useState } from 'react';

export interface BlockRendererProps {
  block: Block;
  mode?: 'production' | 'preview' | 'editor';
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlockSelect?: (blockId: string) => void;
  isSelected?: boolean;
  quizState?: any;
}

/**
 * 🧩 RENDERIZADOR UNIVERSAL DE BLOCOS
 *
 * Renderiza qualquer tipo de bloco do sistema
 * Funciona em produção, preview e editor
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  mode = 'production',
  onBlockUpdate,
  onBlockSelect,
  isSelected = false,
  quizState,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = useCallback(() => {
    if (mode === 'editor') {
      onBlockSelect?.(block.id);
      setIsEditing(true);
    }
  }, [mode, onBlockSelect, block.id]);

  const handleUpdate = useCallback(
    (updates: Partial<Block>) => {
      onBlockUpdate?.(block.id, updates);
    },
    [onBlockUpdate, block.id]
  );

  // Estilos base do bloco
  const blockStyles = {
    ...block.properties,
    borderRadius: block.properties?.borderRadius || 8,
    padding: block.properties?.padding || 16,
    marginBottom: block.properties?.marginBottom || 16,
    backgroundColor: block.properties?.backgroundColor || 'transparent',
    border: isSelected && mode === 'editor' ? '2px solid #3B82F6' : 'none',
  };

  // Renderizar diferentes tipos de bloco
  const renderBlockContent = () => {
    switch (block.type) {
      case 'quiz-intro-header':
        return (
          <div className="text-center">
            {block.content?.title && (
              <h1 className="text-3xl font-bold mb-4">{block.content.title}</h1>
            )}
            {block.content?.subtitle && (
              <h2 className="text-xl text-gray-600 mb-4">{block.content.subtitle}</h2>
            )}
            {block.content?.description && (
              <p className="text-gray-700 mb-6">{block.content.description}</p>
            )}
            {block.properties?.showLogo && block.properties?.logoUrl && (
              <img
                src={block.properties.logoUrl}
                alt={block.properties.logoAlt || 'Logo'}
                className="mx-auto mb-4 max-h-16"
              />
            )}
          </div>
        );

      case 'form-container':
        return (
          <div className="max-w-md mx-auto">
            {block.content?.title && (
              <label className="block text-sm font-medium mb-2">{block.content.title}</label>
            )}
            <input
              type={block.content?.fieldType || 'text'}
              placeholder={block.content?.placeholder}
              required={block.content?.required}
              className="w-full px-4 py-3 border rounded-lg mb-4"
              style={{
                borderColor: block.content?.borderColor,
                backgroundColor: block.content?.backgroundColor,
                color: block.content?.textColor,
              }}
            />
            <button
              className="w-full py-3 px-6 rounded-lg font-semibold"
              style={{
                backgroundColor: block.content?.buttonBackgroundColor || '#3B82F6',
                color: block.content?.buttonTextColor || '#FFFFFF',
              }}
            >
              {block.content?.buttonText || 'Continuar'}
            </button>
          </div>
        );

      case 'options-grid':
        return (
          <div>
            {block.content?.question && (
              <h2 className="text-2xl font-bold text-center mb-8">{block.content.question}</h2>
            )}
            <div
              className="grid gap-4 max-w-2xl mx-auto"
              style={{
                gridTemplateColumns: `repeat(${block.properties?.columns || 2}, 1fr)`,
                gap: block.properties?.gridGap || 16,
              }}
            >
              {block.content?.options?.map((option: any, index: number) => (
                <button
                  key={option.id || index}
                  className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                  style={{
                    borderColor: block.properties?.selectedColor || '#3B82F6',
                  }}
                >
                  {option.imageUrl && block.properties?.showImages && (
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-full h-48 object-cover rounded mb-3"
                      style={{
                        width: block.properties?.imageWidth || '100%',
                        height: block.properties?.imageHeight || 200,
                      }}
                    />
                  )}
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="text-center py-12">
            {block.content?.title && (
              <h1 className="text-4xl font-bold mb-6">{block.content.title}</h1>
            )}
            {block.content?.subtitle && (
              <p className="text-xl text-gray-600 mb-8">{block.content.subtitle}</p>
            )}
            {block.content?.description && (
              <p className="text-gray-700 mb-8">{block.content.description}</p>
            )}
            {block.content?.imageUrl && (
              <img
                src={block.content.imageUrl}
                alt="Hero"
                className="mx-auto mb-6 rounded-lg"
                style={{
                  width: block.properties?.imageWidth || 300,
                  height: block.properties?.imageHeight || 300,
                }}
              />
            )}
            {block.properties?.showButton && (
              <button
                className="px-8 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: block.properties?.buttonColor || '#3B82F6',
                  color: block.properties?.buttonTextColor || '#FFFFFF',
                }}
              >
                {block.content?.buttonText || 'Continuar'}
              </button>
            )}
          </div>
        );

      case 'text':
        return (
          <div
            className="text-content"
            style={{
              fontSize: block.properties?.fontSize,
              color: block.properties?.color,
              textAlign: block.properties?.textAlign || 'left',
            }}
          >
            {block.content?.text}
          </div>
        );

      case 'button':
        return (
          <button
            className="quiz-button"
            style={{
              backgroundColor: block.properties?.backgroundColor || '#3B82F6',
              color: block.properties?.textColor || '#FFFFFF',
              borderRadius: block.properties?.borderRadius || 8,
              padding: block.properties?.padding || '12px 24px',
              fontSize: block.properties?.fontSize || '16px',
              fontWeight: block.properties?.fontWeight || 'normal',
              width: block.properties?.width || 'auto',
            }}
            onClick={() => {
              if (block.content?.buttonUrl) {
                window.open(block.content.buttonUrl, '_blank');
              }
            }}
          >
            {block.content?.buttonText || 'Click'}
          </button>
        );

      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded">
            <p className="text-gray-500 text-sm">Tipo de bloco não suportado: {block.type}</p>
            <pre className="text-xs mt-2 text-gray-400">
              {JSON.stringify(block.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div
      className={`block-renderer ${mode === 'editor' ? 'cursor-pointer' : ''}`}
      style={blockStyles}
      onClick={handleClick}
    >
      {renderBlockContent()}

      {/* Overlay de edição */}
      {isSelected && mode === 'editor' && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Editar</button>
          <button className="px-2 py-1 bg-red-600 text-white text-xs rounded">Remover</button>
        </div>
      )}
    </div>
  );
};
