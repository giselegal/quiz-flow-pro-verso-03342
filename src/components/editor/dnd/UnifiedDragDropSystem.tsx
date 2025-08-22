import { cn } from '@/lib/utils';
import { Block, BlockType } from '@/types/editor';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState } from 'react';

interface UnifiedDragDropSystemProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  selectedBlockId?: string | null;
  onSelectBlock: (id: string) => void;
  children: React.ReactNode;
}

export const UnifiedDragDropSystem: React.FC<UnifiedDragDropSystemProps> = ({
  blocks,
  onBlocksChange,
  onSelectBlock,
  children,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimal distance to start dragging
      },
    })
  );

  // Extrair IDs dos blocos para o SortableContext
  const blockIds = blocks.map(block => block.id);

  // Handler para início do drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(String(active.id));

    // Verificar se é um componente da sidebar sendo arrastado
    const activeData = active.data.current;
    if (activeData?.type === 'sidebar-component') {
      setDraggedComponent(activeData);
    }

    console.log('🔄 Drag iniciado:', {
      id: active.id,
      data: activeData,
    });
  };

  // Handler para drag over (feedback visual)  
  const handleDragOver = (_event: DragOverEvent) => {
    // Adicionar feedback visual durante o drag se necessário
  };

  // Handler para fim do drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setDraggedComponent(null);

    if (!over) {
      console.log('🔄 Drag finalizado sem drop zone válido');
      return;
    }

    const activeData = active.data.current;
    const overId = String(over.id);

    console.log('🔄 Drag finalizado:', {
      activeId: active.id,
      overId,
      activeData,
    });

    // Caso 1: Arrastar componente da sidebar para o canvas
    if (activeData?.type === 'sidebar-component') {
      handleAddComponentToCanvas(activeData, overId);
      return;
    }

    // Caso 2: Reordenar blocos existentes no canvas
    if (overId.startsWith('dnd-block-') || blockIds.includes(String(active.id))) {
      handleReorderBlocks(String(active.id), overId);
      return;
    }
  };

  // Adicionar componente ao canvas
  const handleAddComponentToCanvas = (componentData: any, targetId: string) => {
    const componentType = componentData.blockType as BlockType;

    console.log('🧩 Adicionando componente ao canvas:', {
      type: componentType,
      targetId,
    });

    // Criar novo bloco
    const newBlock: Block = {
      id: `${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      content: getDefaultContentForType(componentType),
      properties: getDefaultPropertiesForType(componentType),
      order: blocks.length,
    };

    // Determinar posição de inserção
    let insertIndex = blocks.length;

    if (targetId.startsWith('dnd-block-')) {
      const targetBlockId = targetId.replace('dnd-block-', '');
      const targetIndex = blocks.findIndex(block => block.id === targetBlockId);
      if (targetIndex !== -1) {
        insertIndex = targetIndex + 1;
      }
    }

    // Inserir bloco na posição correta
    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);

    // Reordenar IDs
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));

    onBlocksChange(reorderedBlocks);
    onSelectBlock(newBlock.id);

    console.log('✅ Componente adicionado:', newBlock.id);
  };

  // Reordenar blocos existentes
  const handleReorderBlocks = (activeId: string, overId: string) => {
    const cleanActiveId = activeId.replace('dnd-block-', '');
    const cleanOverId = overId.replace('dnd-block-', '');

    const oldIndex = blocks.findIndex(block => block.id === cleanActiveId);
    const newIndex = blocks.findIndex(block => block.id === cleanOverId);

    if (oldIndex === -1 || newIndex === -1) {
      console.warn('⚠️ Índices inválidos para reordenação:', { oldIndex, newIndex });
      return;
    }

    console.log('🔄 Reordenando blocos:', {
      from: oldIndex,
      to: newIndex,
      activeId: cleanActiveId,
      overId: cleanOverId,
    });

    // Usar arrayMove do @dnd-kit/sortable para reordenação otimizada
    const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
      ...block,
      order: index,
    }));

    onBlocksChange(reorderedBlocks);
  };

  // Obter conteúdo padrão por tipo de componente
  const getDefaultContentForType = (type: string) => {
    const defaults: Record<string, any> = {
      'text-inline': { text: 'Novo texto adicionado' },
      'heading-inline': { text: 'Novo Título', level: 'h2' },
      'button-inline': { text: 'Novo Botão', variant: 'primary' },
      'image-display-inline': { src: '', alt: 'Nova imagem' },
      'quiz-intro-header': {
        title: 'Novo Título do Quiz',
        subtitle: 'Novo Subtítulo',
        description: 'Nova descrição do quiz',
      },
      'form-input': {
        title: 'Novo Campo',
        placeholder: 'Digite aqui...',
        fieldType: 'text',
        required: false,
      },
      'quiz-question': {
        question: 'Nova pergunta?',
        options: ['Nova Opção 1', 'Nova Opção 2'],
      },
    };
    return defaults[type] || {};
  };

  // Obter propriedades padrão por tipo de componente
  const getDefaultPropertiesForType = (type: string) => {
    const defaults: Record<string, any> = {
      'text-inline': { fontSize: 16, color: '#333333' },
      'heading-inline': { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
      'button-inline': { backgroundColor: '#B89B7A', color: '#ffffff', padding: 12 },
      'image-display-inline': { width: 'auto', height: 'auto' },
    };
    return defaults[type] || {};
  };

  // Renderizar overlay de drag
  const renderDragOverlay = () => {
    if (!activeId) return null;

    // Se é um componente da sidebar sendo arrastado
    if (draggedComponent) {
      return (
        <DragOverlay>
          <div
            className={cn(
              'bg-white border-2 border-primary shadow-xl rounded-lg p-3',
              'opacity-95 cursor-grabbing'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{draggedComponent.title}</span>
              <span className="text-xs text-muted-foreground">
                {draggedComponent.blockType}
              </span>
            </div>
          </div>
        </DragOverlay>
      );
    }

    // Se é um bloco existente sendo reordenado
    const draggedBlock = blocks.find(block => block.id === activeId || `dnd-block-${block.id}` === activeId);
    if (draggedBlock) {
      return (
        <DragOverlay>
          <div
            className={cn(
              'bg-white border-2 border-primary shadow-xl rounded-lg p-3',
              'opacity-95 cursor-grabbing'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{draggedBlock.type}</span>
              <span className="text-xs text-muted-foreground">
                Reordenando bloco
              </span>
            </div>
          </div>
        </DragOverlay>
      );
    }

    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Wrapper para o contexto de ordenação */}
      <SortableContext items={blockIds.map(id => `dnd-block-${id}`)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>

      {/* Overlay de drag */}
      {renderDragOverlay()}
    </DndContext>
  );
};

export default UnifiedDragDropSystem;