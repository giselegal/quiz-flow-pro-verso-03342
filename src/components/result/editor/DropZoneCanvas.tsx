import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { ComponentRenderers } from './ComponentRenderers';
import { SortableCanvasItem } from './SortableCanvasItem';

interface CanvasItem {
  id: string;
  type: string;
  props: Record<string, any>;
  position: number;
}

interface DropZoneCanvasProps {
  items: CanvasItem[];
  previewMode: 'desktop' | 'tablet' | 'mobile';
  selectedItemId?: string | null;
  onSelectItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const BasicComponentRenderer: React.FC<{
  type: string;
  props: Record<string, any>;
  isSelected?: boolean;
  onSelect?: () => void;
}> = ({ type, props, isSelected, onSelect }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  switch (type) {
    case 'heading':
      return (
        <div
          className={`cursor-pointer ${isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : ''}`}
          onClick={handleClick}
          style={{ marginBottom: props.marginBottom || 20 }}
        >
          <h1
            style={{
              fontSize: props.fontSize || 32,
              fontWeight: props.fontWeight || 'bold',
              textAlign: props.textAlign || 'center',
              color: props.color || '#1a1a1a',
              margin: 0,
            }}
          >
            {props.content || 'Título'}
          </h1>
        </div>
      );
    case 'text':
      return (
        <div
          className={`cursor-pointer ${isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : ''}`}
          onClick={handleClick}
          style={{ marginBottom: props.marginBottom || 16 }}
        >
          <p
            style={{
              fontSize: props.fontSize || 16,
              lineHeight: props.lineHeight || 1.6,
              textAlign: props.textAlign || 'left',
              color: props.color || '#4a4a4a',
              margin: 0,
            }}
          >
            {props.content || 'Adicione seu texto aqui...'}
          </p>
        </div>
      );
    case 'button':
      return (
        <div
          className={`cursor-pointer ${isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : ''}`}
          onClick={handleClick}
          style={{ marginTop: props.marginTop || 20 }}
        >
          <button
            style={{
              backgroundColor: props.backgroundColor || '#3b82f6',
              color: props.textColor || '#ffffff',
              borderRadius: props.borderRadius || 8,
              padding: props.padding || '12px 24px',
              fontWeight: props.fontWeight || 'semibold',
              border: 'none',
              cursor: 'pointer',
              display: 'block',
              margin: props.textAlign === 'center' ? '0 auto' : 0,
            }}
          >
            {props.text || 'Clique Aqui'}
          </button>
        </div>
      );
    case 'image':
      return (
        <div
          className={`cursor-pointer ${isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : ''}`}
          onClick={handleClick}
        >
          <img
            src={props.src || 'https://via.placeholder.com/400x200'}
            alt={props.alt || 'Imagem'}
            style={{
              width: props.width || 400,
              height: props.height || 200,
              objectFit: props.objectFit || 'cover',
              borderRadius: props.borderRadius || 8,
              display: 'block',
            }}
          />
        </div>
      );
    default:
      return (
        <div
          className={`p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer ${
            isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : ''
          }`}
          onClick={handleClick}
        >
          <p style={{ color: '#8B7355' }}>Componente: {type}</p>
          <p className="text-xs text-gray-400 mt-1">Renderizador não encontrado</p>
        </div>
      );
  }
};

export const DropZoneCanvas: React.FC<DropZoneCanvasProps> = ({
  items,
  previewMode,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas',
    },
  });

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      default:
        return { maxWidth: '1200px', margin: '0 auto' };
    }
  };

  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const renderComponent = (item: CanvasItem) => {
    const isSelected = selectedItemId === item.id;

    const SpecificRenderer = ComponentRenderers[item.type as keyof typeof ComponentRenderers];
    if (SpecificRenderer) {
      return (
        <SpecificRenderer
          props={item.props}
          isSelected={isSelected}
          onSelect={() => onSelectItem(item.id)}
        />
      );
    }

    return (
      <BasicComponentRenderer
        type={item.type}
        props={item.props}
        isSelected={isSelected}
        onSelect={() => onSelectItem(item.id)}
      />
    );
  };

  return (
    <div className="h-full bg-[#F5F2E9] relative">
      <div className="bg-white border-b border-[#D4C4A0] p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#432818]">
            {getPreviewIcon()}
            <span className="font-medium capitalize">{previewMode}</span>
          </div>
          <div className="text-sm text-[#B89B7A]">
            {items.length} {items.length === 1 ? 'componente' : 'componentes'}
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[calc(100vh-200px)] p-6 transition-all duration-200 ${
          isOver ? 'bg-[#B89B7A]/10 ring-2 ring-[#B89B7A]/40' : ''
        }`}
        style={getPreviewStyles()}
      >
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-12 border-2 border-dashed border-[#D4C4A0] rounded-lg bg-white/50">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">+</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Comece criando seu quiz</h3>
              <p className="text-[#B89B7A] mb-4">
                Arraste componentes da barra lateral para começar
              </p>
              <div className="text-sm text-[#B89B7A]">💡 Dica: Comece com um título chamativo</div>
            </div>
          </div>
        ) : (
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {items
                .sort((a, b) => a.position - b.position)
                .map(item => (
                  <SortableCanvasItem
                    key={item.id}
                    id={item.id}
                    isSelected={selectedItemId === item.id}
                    onSelect={() => onSelectItem(item.id)}
                    onDelete={() => onDeleteItem(item.id)}
                  >
                    {renderComponent(item)}
                  </SortableCanvasItem>
                ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};
