import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

export interface LibraryComponentItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

export interface ComponentLibraryPanelProps {
  components: LibraryComponentItem[];
  categories?: string[];
  selectedStepId?: string;
  onAdd?: (type: string) => void;
}

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  components,
  categories = ['content', 'interactive', 'media', 'layout'],
  selectedStepId,
  onAdd
}) => {
  return (
    <>
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-sm">Componentes</h2>
        <p className="text-xs text-muted-foreground">Arraste para o canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {categories.map(category => {
            const items = components.filter(c => c.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {category === 'content' && 'Conteúdo'}
                  {category === 'interactive' && 'Interativo'}
                  {category === 'media' && 'Mídia'}
                  {category === 'layout' && 'Layout'}
                </h3>
                <div className="space-y-1">
                  {items.map(component => {
                    const DraggableItem: React.FC = () => {
                      const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `lib:${component.type}` });
                      const style: React.CSSProperties = {
                        transform: transform ? CSS.Translate.toString(transform) : undefined,
                        opacity: isDragging ? 0.4 : 1,
                      };
                      return (
                        <button
                          ref={setNodeRef}
                          {...attributes}
                          {...listeners}
                          key={component.type}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => selectedStepId && onAdd && onAdd(component.type)}
                          disabled={!selectedStepId}
                          style={style}
                        >
                          {component.icon}
                          <span>{component.label}</span>
                        </button>
                      );
                    };
                    return <DraggableItem key={component.type} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default ComponentLibraryPanel;
