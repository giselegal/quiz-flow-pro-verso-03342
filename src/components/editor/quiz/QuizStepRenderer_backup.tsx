/**
 * 🎨 RENDERIZADOR DE ETAPAS DO QUIZ
 *
 * QuizStepRenderer.tsx - Renderiza dinamicamente os blocos de cada etapa
 * Suporta modo editor com edição ao vivo e preview idêntico à produção
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { 
  DndContext, 
  closestCenter, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Eye, GripVertical, Plus, Trash2 } from 'lucide-react';
import ButtonBlock from '@/components/editor/blocks/ButtonBlock';
import FormContainerBlock from '@/components/editor/blocks/FormContainerBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import TextBlock from '@/components/editor/blocks/TextBlock';

interface QuizStepRendererConfig {
  mode: 'editor' | 'preview' | 'production';
  quizState: {
    currentStep: number;
    sessionData: Record<string, any>;
    userAnswers: Record<string, any>;
  };
  dataManager: {
    onDataUpdate: (key: string, value: any) => void;
    onAnswerUpdate: (questionId: string, answer: any) => void;
  };
  editor?: {
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export interface QuizStepRendererProps {
  stepData: {
    id: string;
    title: string;
    blocks: Block[];
    metadata?: {
      description?: string;
      category?: string;
      difficulty?: number;
    };
  };
  currentStep: number;
  mode: 'editor' | 'preview' | 'production';
  onDataChange: (data: Record<string, any>) => void;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  enableValidation?: boolean;
  enableScoring?: boolean;
  className?: string;
}

// ========================================
// Componente SortableBlock
// ========================================
interface SortableBlockProps {
  block: Block;
  index: number;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ block, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

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
    config: {} as any, // Será fornecido pelo contexto
    isEditing: true, // Será determinado pelo contexto
    onUpdate: () => {}, // Será fornecido pelo contexto
    className: cn('quiz-block', 'editor-block', block.properties?.className),
    style: {
      ...block.properties?.style,
      order: block.order,
    },
  };

  const renderedBlock = <Component {...blockProps} />;

  // Em modo editor, adicionar controles
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'editor-block-wrapper relative group',
        isDragging && 'shadow-lg z-10'
      )}
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
          onClick={() => console.log('Editar bloco:', block.id)}
        >
          <Edit3 className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-6 w-6 p-0 bg-white text-red-600"
          onClick={() => console.log('Deletar bloco:', block.id)}
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
};

// ========================================
// Componente Principal - QuizStepRenderer
// ========================================
export const QuizStepRenderer: React.FC<QuizStepRendererProps> = ({
  stepData,
  currentStep,
  mode,
  onDataChange,
  theme = { primaryColor: '#B89B7A', secondaryColor: '#8B7355' },
  enableValidation = true,
  enableScoring = true,
  className = '',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const isEditorMode = mode === 'editor';
  const blocks = stepData.blocks || [];

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Atualizar dados quando mudarem
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  // Handler para mudanças nos campos
  const handleFieldChange = (blockId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [blockId]: value,
    }));

    // Limpar erro se houver
    if (errors[blockId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[blockId];
        return newErrors;
      });
    }
  };

  // Handler para atualização de blocos
  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      // Implementação vazia - será conectada via props se necessário
      console.log('Block update:', blockId, updates);
    },
    []
  );

  // Handler para drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedBlocks = [...blocks];
        const [removed] = reorderedBlocks.splice(oldIndex, 1);
        reorderedBlocks.splice(newIndex, 0, removed);

        // Atualizar ordens
        const updatedBlocks = reorderedBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));

        console.log('Blocks reordered:', updatedBlocks);
        // Implementar callback de reordenação se necessário
      }
    }
  }, [blocks]);

  // Handler para drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // ========================================
  // Mapeamento de Componentes
  // ========================================
  const componentMap = useMemo(
    () => ({
      'quiz-intro-header': QuizIntroHeaderRenderer,
      'options-grid': OptionsGridRenderer,
      'form-container': FormContainerRenderer,
      button: ButtonRenderer,
      text: TextRenderer,
      'result-header': ResultHeaderRenderer,
      'style-card': StyleCardRenderer,
      'secondary-styles': SecondaryStylesRenderer,
      hero: HeroRenderer,
      benefits: BenefitsRenderer,
    }),
    []
  );

  // ========================================
  // Componente SortableBlock para @dnd-kit
  // ========================================
  const SortableBlock: React.FC<{ block: Block; index: number }> = ({ block, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: block.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const Component = componentMap[block.type as keyof typeof componentMap];
    if (!Component) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          Componente não encontrado: {block.type}
        </div>
      );
    }

    const config = {
      mode,
      theme,
      quizState: { currentStep, sessionData: formData, userAnswers: formData },
      dataManager: { onDataUpdate: handleFieldChange, onAnswerUpdate: handleFieldChange },
      editor: { onBlockUpdate: handleBlockUpdate },
    };

    const blockProps = {
      block,
      config,
      isEditing: isEditorMode,
      onUpdate: handleBlockUpdate,
      className: cn('quiz-block', isEditorMode && 'editor-block', block.properties?.className),
      style: {
        ...block.properties?.style,
        order: block.order,
      },
    };

    const renderedBlock = <Component {...blockProps} />;

    // Em modo editor, envolver com controles de edição
    if (isEditorMode) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'editor-block-wrapper relative group',
            isDragging && 'shadow-lg z-10'
          )}
        >
          {/* Controles do Editor */}
          <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 bg-white cursor-grab"
              {...listeners}
              {...attributes}
            >
              <GripVertical className="h-3 w-3" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 bg-white"
              onClick={() =>
                handleBlockUpdate(block.id, {
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
              onClick={() => console.log('Delete block:', block.id)}
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
    return <div key={block.id}>{renderedBlock}</div>;
  };  // ========================================
  // Handlers
  // ========================================
  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      if (config.editor?.onBlockUpdate) {
        config.editor.onBlockUpdate(blockId, updates);
      }
    },
    [config.editor]
  );

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination || !onBlocksReorder) return;

      const items = Array.from(blocks);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Atualizar ordem
      const reorderedBlocks = items.map((block, index) => ({
        ...block,
        order: index,
      }));

      onBlocksReorder(reorderedBlocks);
    },
    [blocks, onBlocksReorder]
  );

  // ========================================
  // Render Principal
  // ========================================
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
                <h3 className="font-semibold text-gray-900">
                  Etapa {currentStep} - Editando
                </h3>
                <p className="text-sm text-gray-600">{blocks.length} bloco(s) nesta etapa</p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                <Button
                  size="sm"
                  onClick={() => console.log('Adicionar bloco')}
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
            <SortableBlock key={block.id} block={block} index={index} />
          ))}
        </div>

        {/* Placeholder para etapa vazia */}
        {blocks.length === 0 && isEditorMode && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Esta etapa está vazia</p>
            <Button
              onClick={() => console.log('Adicionar primeiro bloco')}
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

  // Blocos para ordenação
  const blockIds = blocks.map(block => block.id);

  // Envolver com DndContext se for modo editor
  if (isEditorMode) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {content}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              Arrastando bloco: {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return content;
};

// ========================================
// Componentes de Renderização Específicos
// ========================================

// Quiz Intro Header
const QuizIntroHeaderRenderer: React.FC<any> = ({ block, config }) => {
  const { content, properties } = block;
  return (
    <div className="text-center py-8" style={{ backgroundColor: properties?.backgroundColor }}>
      {content.showLogo && properties?.logoUrl && (
        <img
          src={properties.logoUrl}
          alt={properties.logoAlt || 'Logo'}
          className="mx-auto mb-4 w-24 h-24 object-contain"
        />
      )}
      <h1 className="text-3xl font-bold mb-2" style={{ color: config.theme.textColor }}>
        {content.title}
      </h1>
      {content.subtitle && (
        <h2 className="text-xl mb-4" style={{ color: config.theme.textColor }}>
          {content.subtitle}
        </h2>
      )}
      {content.description && (
        <p className="text-gray-600 max-w-2xl mx-auto">{content.description}</p>
      )}
    </div>
  );
};

// Options Grid
const OptionsGridRenderer: React.FC<any> = ({ block }) => {
  return (
    <OptionsGridBlock
      block={block}
      isSelected={false}
      onPropertyChange={() => {}}
      properties={{}} // Adicionar propriedade obrigatória
    />
  );
};

// Form Container
const FormContainerRenderer: React.FC<any> = ({ block }) => {
  return <FormContainerBlock block={block} isSelected={false} onPropertyChange={() => {}} />;
};

// Button
const ButtonRenderer: React.FC<any> = ({ block }) => {
  return <ButtonBlock block={block} isSelected={false} onPropertyChange={() => {}} />;
};

// Text
const TextRenderer: React.FC<any> = ({ block }) => {
  return <TextBlock content={block.content} isSelected={false} />;
};

// Placeholders para outros componentes
const ResultHeaderRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-blue-50 rounded">Result Header: {block.content?.title}</div>
);

const StyleCardRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-green-50 rounded">Style Card: {block.content?.title}</div>
);

const SecondaryStylesRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-purple-50 rounded">Secondary Styles: {block.content?.title}</div>
);

const HeroRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-yellow-50 rounded">Hero: {block.content?.title}</div>
);

const BenefitsRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-pink-50 rounded">Benefits: {block.content?.title}</div>
);

const TestimonialsRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-indigo-50 rounded">Testimonials: {block.content?.title}</div>
);

const GuaranteeRenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-red-50 rounded">Guarantee: {block.content?.title}</div>
);

const OfferCTARenderer: React.FC<any> = ({ block }) => (
  <div className="p-4 bg-orange-50 rounded">Offer CTA: {block.content?.title}</div>
);

export default QuizStepRenderer;
