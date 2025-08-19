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
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
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
      'result-header-inline': ResultHeaderRenderer,
      'style-card-inline': StyleCardRenderer,
      'secondary-styles': SecondaryStylesRenderer,
      hero: HeroRenderer,
      benefits: BenefitsRenderer,
      testimonials: TestimonialsRenderer,
      guarantee: GuaranteeRenderer,
      'quiz-offer-cta-inline': OfferCTARenderer,
    }),
    []
  );

  // ========================================
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
  // Renderizador de Bloco Individual
  // ========================================
  const renderBlock = useCallback(
    (block: Block, index: number) => {
      const Component = componentMap[block.type as keyof typeof componentMap];

      if (!Component) {
        return (
          <div key={block.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">
              Componente não encontrado: <code>{block.type}</code>
            </p>
            {isEditorMode && (
              <pre className="text-xs text-red-400 mt-2">{JSON.stringify(block, null, 2)}</pre>
            )}
          </div>
        );
      }

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
          <Draggable key={block.id} draggableId={block.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={cn(
                  'editor-block-wrapper relative group',
                  snapshot.isDragging && 'shadow-lg z-10'
                )}
              >
                {/* Controles do Editor */}
                <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 bg-white"
                    {...provided.dragHandleProps}
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

                  {onDeleteBlock && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0 bg-white text-red-600"
                      onClick={() => onDeleteBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
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
            )}
          </Draggable>
        );
      }

      // Modo preview/production
      return <div key={block.id}>{renderedBlock}</div>;
    },
    [componentMap, isEditorMode, handleBlockUpdate, onDeleteBlock]
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
                  Etapa {quizState.currentStep} - Editando
                </h3>
                <p className="text-sm text-gray-600">{blocks.length} bloco(s) nesta etapa</p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                {onAddBlock && (
                  <Button
                    size="sm"
                    onClick={() => onAddBlock('text')}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Bloco
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blocos da Etapa */}
        <div className="space-y-4">{blocks.map((block, index) => renderBlock(block, index))}</div>

        {/* Placeholder para etapa vazia */}
        {blocks.length === 0 && isEditorMode && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Esta etapa está vazia</p>
            {onAddBlock && (
              <Button
                onClick={() => onAddBlock('text')}
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Bloco
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Envolver com DragDropContext se for modo editor
  if (isEditorMode && onBlocksReorder) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="quiz-blocks">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {content}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
