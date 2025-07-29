
import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ComponentRenderer } from './ComponentRenderer';

interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface EditorCanvasProps {
  components: Component[];
  onSelectComponent: (component: Component | null) => void;
  onChange: (components: Component[]) => void;
  selectedComponent: Component | null;
}

export default function EditorCanvas({ 
  components, 
  onSelectComponent,
  onChange,
  selectedComponent 
}: EditorCanvasProps) {
  
  const [{ isOver }, dropRef] = useDrop<{ type: string }, void, { isOver: boolean }>(() => ({
    accept: 'component',
    drop: (item: { type: string }) => {
      const newComponent: Component = {
        id: `comp-${Date.now()}`,
        type: item.type,
        props: getDefaultProps(item.type)
      };
      
      onChange([...components, newComponent]);
      onSelectComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getDefaultProps = (type: string): Record<string, any> => {
    switch (type) {
      case 'heading':
        return { text: 'Novo Título', level: 1, style: {} };
      case 'paragraph':
        return { text: 'Novo parágrafo de texto. Clique para editar.', style: {} };
      case 'button':
        return { text: 'Clique aqui', variant: 'primary', href: '#', style: {} };
      case 'image':
        return { src: 'https://via.placeholder.com/400x200', alt: 'Imagem', style: {} };
      case 'divider':
        return { style: {} };
      case 'container':
        return { children: [], style: { padding: '20px', backgroundColor: '#f9f9f9' } };
      default:
        return { style: {} };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over.id);
      onChange(arrayMove(components, oldIndex, newIndex));
    }
  };

  const handleComponentClick = (component: Component) => {
    onSelectComponent(component);
  };

  const handleComponentDelete = (componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    onChange(updatedComponents);
    
    if (selectedComponent?.id === componentId) {
      onSelectComponent(null);
    }
  };
    
  const handleComponentDuplicate = (component: Component) => {
    const duplicatedComponent: Component = {
      ...component,
      id: `comp-${Date.now()}`,
      props: { ...component.props }
    };
    const componentIndex = components.findIndex(comp => comp.id === component.id);
    const newComponents = [...components];
    newComponents.splice(componentIndex + 1, 0, duplicatedComponent);
    onChange(newComponents);
    onSelectComponent(duplicatedComponent);
  };

  return (
    <div 
      ref={dropRef}
      className={`min-h-[600px] rounded-lg border-2 border-dashed p-6 transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      }`}
    >
      {components.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-gray-400">
          <div className="mb-4 text-6xl">🎨</div>
          <h3 className="mb-2 text-lg font-medium">Canvas Vazio</h3>
          <p className="text-center">
            Arraste componentes da paleta lateral para começar a construir sua página
          </p>
          <div className="mt-4 text-sm">
            💡 Dica: Comece com um título para dar boas-vindas aos seus visitantes
          </div>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {components.map((component) => (
                <SortableItem
                  key={component.id}
                  id={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onClick={() => handleComponentClick(component)}
                  onDelete={() => handleComponentDelete(component.id)}
                  onDuplicate={() => handleComponentDuplicate(component)}
                >
                  <ComponentRenderer component={component} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isOver && (
        <div className="flex h-full items-center justify-center">
          <div className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg">
            Solte aqui para adicionar o componente
          </div>
        </div>
      )}
    </div>
  );
}
