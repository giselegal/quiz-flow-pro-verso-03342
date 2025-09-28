import { EditorBlock } from '@/types/editor';
import type { StyleResult } from '@/types/quiz';

interface BlockPreviewRendererProps {
  block: EditorBlock;
  isSelected?: boolean;
  isPreviewing?: boolean;
  onSelect?: () => void;
  primaryStyle?: StyleResult;
}

export const BlockPreviewRenderer: React.FC<BlockPreviewRendererProps> = ({
  block,
  isSelected = false,
  isPreviewing = false,
  onSelect,
}) => {
  // Safely handle style properties
  const style = block.content?.style || {};
  const styleProps = typeof style === 'object' && style !== null ? (style as any) : {};

  const containerStyle = {
    padding: styleProps.padding || block.content?.padding || '1rem',
    backgroundColor: styleProps.backgroundColor || block.content?.backgroundColor || 'transparent',
    color: styleProps.color || block.content?.color || 'inherit',
    textAlign: (styleProps.textAlign || block.content?.textAlign || 'left') as any,
    borderRadius: styleProps.borderRadius || block.content?.borderRadius || '0',
    border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
      case 'text-inline':
        return (
          <div className="text-block">
            {block.content?.title && <h3 className="font-medium mb-2">{block.content.title}</h3>}
            <p>{block.content?.text || 'Clique para editar o texto'}</p>
          </div>
        );

      case 'image':
      case 'image-display-inline':
        return (
          <div className="image-block">
            {block.content?.imageUrl ? (
              <img
                src={block.content.imageUrl}
                alt={block.content.alt || 'Imagem'}
                className="max-w-full h-auto rounded"
                style={{
                  width: styleProps.width || block.content?.width || 'auto',
                  height: styleProps.height || block.content?.height || 'auto',
                  objectFit: (styleProps.objectFit || block.content?.objectFit || 'cover') as any,
                }}
              />
            ) : (
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <span style={{ color: '#8B7355' }}>Clique para adicionar imagem</span>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="button-block">
            <button
              className="px-4 py-2 bg-[#B89B7A] text-white rounded hover:bg-[#8F7A6A] transition-colors"
              style={{
                backgroundColor:
                  styleProps.backgroundColor || block.content?.backgroundColor || '#3b82f6',
                color: styleProps.color || block.content?.color || '#ffffff',
                borderRadius: styleProps.borderRadius || block.content?.borderRadius || '0.375rem',
              }}
            >
              {block.content?.buttonText || 'Botão'}
            </button>
          </div>
        );

      default:
        return (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <p style={{ color: '#6B4F43' }}>Tipo de bloco: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`block-preview cursor-pointer transition-all hover:shadow-sm ${
        isPreviewing ? 'pointer-events-none' : ''
      }`}
      style={containerStyle}
      onClick={onSelect}
    >
      {renderBlockContent()}
      {isSelected && !isPreviewing && (
        <div className="absolute top-2 right-2 bg-[#B89B7A] text-white px-2 py-1 rounded text-xs">
          Selecionado
        </div>
      )}
    </div>
  );
};

export default BlockPreviewRenderer;
