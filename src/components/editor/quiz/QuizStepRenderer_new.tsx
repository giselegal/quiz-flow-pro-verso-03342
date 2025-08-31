/**
 * QuizStepRenderer.tsx - Renderiza dinamicamente os blocos de cada etapa
 * Migrado para @dnd-kit para drag & drop moderno
 */

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useCallback, useMemo } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Icons
import { Edit3, Eye, GripVertical, Plus, Trash2 } from 'lucide-react';

// ========================================
// Types e Interfaces
// ========================================
export interface Block {
  id: string;
  type: string;
  content: any;
  properties?: any;
  order?: number;
}

interface QuizStepRendererConfig {
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  editor?: {
    onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
    onBlockDelete?: (blockId: string) => void;
    onBlockAdd?: (type: string) => void;
  };
}

export interface QuizStepRendererProps {
  stepData: {
    id: string;
    title: string;
    description?: string;
    blocks: Block[];
  };
  currentStep: number;
  isEditorMode?: boolean;
  config?: QuizStepRendererConfig;
  className?: string;
  onBlocksReorder?: (blocks: Block[]) => void;
}

// ========================================
// Componente SortableBlock
// ========================================
interface SortableBlockProps {
  block: Block;
  index: number;
  config: QuizStepRendererConfig;
  isEditorMode: boolean;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  componentMap: any;
}

const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  // index, - removido pois não é usado
  config,
  isEditorMode,
  onUpdate,
  componentMap,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Buscar o componente apropriado
  const Component = componentMap[block.type as keyof typeof componentMap];

  if (!Component) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 border border-red-200 bg-red-50 rounded-lg"
      >
        <p className="text-red-600 text-sm">
          Componente não encontrado: <code>{block.type}</code>
        </p>
      </div>
    );
  }

  const blockProps = {
    block,
    config,
    isEditing: isEditorMode,
    onUpdate,
    className: cn('quiz-block', isEditorMode && 'editor-block', block.properties?.className),
    style: {
      ...block.properties?.style,
      order: block.order,
    },
  };

  const renderedBlock = <Component {...blockProps} />;

  // Em modo editor, adicionar controles
  if (isEditorMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn('editor-block-wrapper relative group', isDragging && 'shadow-lg z-10')}
      >
        {/* Controles do Editor */}
        <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white"
            onClick={() =>
              onUpdate(block.id, {
                properties: { ...block.properties, isEditing: true },
              })
            }
          >
            <Edit3 className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white text-red-600"
            onClick={() => config.editor?.onBlockDelete?.(block.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Overlay de Edição */}
        <div
          className={cn(
            'relative',
            'border-2 border-dashed border-transparent rounded-lg',
            'group-hover:border-blue-300',
            'transition-all duration-200'
          )}
        >
          {renderedBlock}
        </div>
      </div>
    );
  }

  // Modo preview/production
  return (
    <div ref={setNodeRef} style={style}>
      {renderedBlock}
    </div>
  );
};

// ========================================
// Componente Principal - QuizStepRenderer
// ========================================
export const QuizStepRenderer: React.FC<QuizStepRendererProps> = ({
  stepData,
  currentStep,
  isEditorMode = false,
  config = {
    theme: {
      primaryColor: '#B89B7A',
      accentColor: '#8B7355',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
    },
  },
  className,
  // unused parameter
}) => {
  // ========================================
  // Dados Derivados
  // ========================================
  const blocks = stepData.blocks || [];
  const theme = config.theme;

  // ========================================
  // Event Handlers
  // ========================================
  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      if (config.editor?.onBlockUpdate) {
        config.editor.onBlockUpdate(blockId, updates);
      }
    },
    [config.editor]
  );

  // ========================================
  // Component Map - Componentes Básicos
  // ========================================
  const componentMap = useMemo(
    () => ({
      text: ({ block }: any) => (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{block.content.title}</h3>
          <p className="text-gray-700">{block.content.description}</p>
        </div>
      ),
      quiz_intro_header: ({ block }: any) => (
        <div
          className="text-center py-8"
          style={{ backgroundColor: block.properties?.backgroundColor }}
        >
          <h1 className="text-3xl font-bold mb-4">{block.content.title}</h1>
          <p className="text-lg text-gray-600">{block.content.subtitle}</p>
        </div>
      ),
      quiz_question: ({ block }: any) => (
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">{block.content.question}</h3>
          <div className="space-y-2">
            {block.content.options?.map((option: any, index: number) => (
              <button
                key={index}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ),
    }),
    []
  );

  // ========================================
  // Render Principal
  // ========================================
  const blockIds = blocks.map(block => block.id);

  const content = (
    <div
      className={cn(
        'quiz-step-renderer',
        'min-h-screen',
        isEditorMode ? 'bg-gray-50 p-4' : 'bg-white',
        className
      )}
    >
      <div className={cn('quiz-step-content', 'mx-auto', isEditorMode ? 'max-w-4xl' : 'max-w-2xl')}>
        {/* Header do Editor */}
        {isEditorMode && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Etapa {currentStep} - Editando</h3>
                <p className="text-sm text-gray-600">{blocks.length} bloco(s) nesta etapa</p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                <Button
                  size="sm"
                  onClick={() => config.editor?.onBlockAdd?.('text')}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Bloco
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Blocos da Etapa */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              index={index}
              config={config}
              isEditorMode={isEditorMode}
              onUpdate={handleBlockUpdate}
              componentMap={componentMap}
            />
          ))}
        </div>

        {/* Placeholder para etapa vazia */}
        {blocks.length === 0 && isEditorMode && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Esta etapa está vazia</p>
            <Button
              onClick={() => config.editor?.onBlockAdd?.('text')}
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Bloco
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Envolver com SortableContext se for modo editor
  if (isEditorMode) {
    return (
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        {content}
      </SortableContext>
    );
  }

  return content;
};

export default QuizStepRenderer;
