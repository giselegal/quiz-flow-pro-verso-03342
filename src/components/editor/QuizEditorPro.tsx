import { QuizRenderer } from '@/components/core/QuizRenderer';
import EnhancedUniversalPropertiesPanelFixed from '@/components/universal/EnhancedUniversalPropertiesPanelFixed';
import { cn } from '@/lib/utils';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useCallback, useState } from 'react';
import { SortableBlock } from './SortableBlock';

interface QuizEditorProProps {
  className?: string;
}

/**
 * 🎯 QUIZ EDITOR PROFISSIONAL - 4 COLUNAS
 *
 * Layout Profissional:
 * ┌─[ETAPAS: 200px]─┬─[COMPONENTES: 280px]─┬─[CANVAS: flex-1]─┬─[PROPRIEDADES: 380px]─┐
 * │ 📋 Lista 21     │ 🧩 Biblioteca        │ 🎨 Preview       │ ⚙️ Configurações    │
 * │ etapas          │ Componentes          │ Idêntico produção │ Painel avançado     │
 * └─────────────────┴─────────────────────┴─────────────────┴─────────────────────┘
 */
export const QuizEditorPro: React.FC<QuizEditorProProps> = ({ className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Estado mutável para os blocos de cada etapa
  const [stepBlocks, setStepBlocks] = useState<Record<string, Block[]>>(() => {
    // Inicializar com dados do template
    const initialBlocks: Record<string, Block[]> = {};
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
      initialBlocks[stepKey] = Array.isArray(blocks) ? [...blocks] : [];
    });
    return initialBlocks;
  });

  // Configuração dos sensores para drag & drop
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

  // Dados da etapa atual
  const currentStepKey = `step-${currentStep}`;
  const currentStepData = stepBlocks[currentStepKey] || [];
  const selectedBlock = currentStepData.find((block: Block) => block.id === selectedBlockId);

  // Tipos de componentes disponíveis
  const availableComponents = [
    {
      type: 'quiz-intro-header',
      name: 'Header Quiz',
      icon: '📝',
      category: 'Estrutura',
      description: 'Cabeçalho com título e descrição',
    },
    {
      type: 'options-grid',
      name: 'Grade Opções',
      icon: '⚡',
      category: 'Interação',
      description: 'Grid de opções para questões',
    },
    {
      type: 'form-container',
      name: 'Formulário',
      icon: '📝',
      category: 'Captura',
      description: 'Campo de entrada de dados',
    },
    {
      type: 'text',
      name: 'Texto',
      icon: '📄',
      category: 'Conteúdo',
      description: 'Bloco de texto simples',
    },
    {
      type: 'button',
      name: 'Botão',
      icon: '🔘',
      category: 'Interação',
      description: 'Botão de ação',
    },
    {
      type: 'result-header-inline',
      name: 'Header Resultado',
      icon: '🎯',
      category: 'Resultado',
      description: 'Cabeçalho personalizado de resultado',
    },
    {
      type: 'style-card-inline',
      name: 'Card Estilo',
      icon: '🎨',
      category: 'Resultado',
      description: 'Card com características do estilo',
    },
    {
      type: 'secondary-styles',
      name: 'Estilos Secundários',
      icon: '📊',
      category: 'Resultado',
      description: 'Lista de estilos complementares',
    },
    {
      type: 'testimonials',
      name: 'Depoimentos',
      icon: '💬',
      category: 'Social Proof',
      description: 'Lista de depoimentos',
    },
    {
      type: 'guarantee',
      name: 'Garantia',
      icon: '🛡️',
      category: 'Confiança',
      description: 'Selo de garantia',
    },
  ];

  // Agrupar componentes por categoria
  const groupedComponents = availableComponents.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, typeof availableComponents>
  );

  // Análise das etapas
  const getStepAnalysis = (step: number) => {
    if (step === 1) return { type: '📝', label: 'Captura', desc: 'Nome do usuário' };
    if (step >= 2 && step <= 11)
      return { type: '🎯', label: 'Questão', desc: 'Pontuação de estilo' };
    if (step === 12) return { type: '🔄', label: 'Transição', desc: 'Para estratégicas' };
    if (step >= 13 && step <= 18)
      return { type: '📊', label: 'Estratégica', desc: 'Tracking sem pontuação' };
    if (step === 19) return { type: '⏳', label: 'Calculando', desc: 'Processamento' };
    if (step === 20) return { type: '🎉', label: 'Resultado', desc: 'Estilo personalizado' };
    if (step === 21) return { type: '💰', label: 'Oferta', desc: 'CTA de conversão' };
    return { type: '❓', label: 'Indefinida', desc: 'Não mapeada' };
  };

  // Handlers para operações de bloco
  const addBlockToStep = useCallback((stepKey: string, newBlock: Block) => {
    setStepBlocks(prev => ({
      ...prev,
      [stepKey]: [...(prev[stepKey] || []), newBlock],
    }));
  }, []);

  const removeBlockFromStep = useCallback((stepKey: string, blockId: string) => {
    setStepBlocks(prev => ({
      ...prev,
      [stepKey]: (prev[stepKey] || []).filter(block => block.id !== blockId),
    }));
  }, []);

  const reorderBlocksInStep = useCallback((stepKey: string, oldIndex: number, newIndex: number) => {
    setStepBlocks(prev => {
      const blocks = [...(prev[stepKey] || [])];
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
      return {
        ...prev,
        [stepKey]: reorderedBlocks,
      };
    });
  }, []);

  const updateBlockInStep = useCallback(
    (stepKey: string, blockId: string, updates: Record<string, any>) => {
      setStepBlocks(prev => ({
        ...prev,
        [stepKey]: (prev[stepKey] || []).map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      }));
    },
    []
  );

  // Função para criar um novo bloco a partir de um componente
  const createBlockFromComponent = useCallback(
    (componentType: string): Block => {
      const timestamp = Date.now();
      const blockId = `block-${componentType}-${timestamp}`;

      return {
        id: blockId,
        type: componentType as any, // Type assertion para resolver erro de tipo
        order: currentStepData.length + 1,
        content: {
          title: `Novo ${componentType}`,
          description: 'Bloco criado através de drag & drop',
        },
        properties: {},
      };
    },
    [currentStepData.length]
  );

  // Handlers principais
  const handleStepSelect = useCallback((step: number) => {
    setCurrentStep(step);
    setSelectedBlockId(null);
  }, []);

  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Record<string, any>) => {
      updateBlockInStep(currentStepKey, blockId, updates);
    },
    [currentStepKey, updateBlockInStep]
  );

  const handleBlockDelete = useCallback(
    (blockId: string) => {
      removeBlockFromStep(currentStepKey, blockId);
      setSelectedBlockId(null);
    },
    [currentStepKey, removeBlockFromStep]
  );

  const handleBlockMoveUp = useCallback(
    (blockId: string) => {
      const currentIndex = currentStepData.findIndex(block => block.id === blockId);
      if (currentIndex > 0) {
        reorderBlocksInStep(currentStepKey, currentIndex, currentIndex - 1);
      }
    },
    [currentStepData, currentStepKey, reorderBlocksInStep]
  );

  const handleBlockMoveDown = useCallback(
    (blockId: string) => {
      const currentIndex = currentStepData.findIndex(block => block.id === blockId);
      if (currentIndex < currentStepData.length - 1) {
        reorderBlocksInStep(currentStepKey, currentIndex, currentIndex + 1);
      }
    },
    [currentStepData, currentStepKey, reorderBlocksInStep]
  );

  const handleClosePropertiesPanel = useCallback(() => {
    setSelectedBlockId(null);
  }, []);

  // Drag & Drop handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;

      // Se é um componente da biblioteca
      if (typeof active.id === 'string' && active.id.includes('component-')) {
        // Componente sendo arrastado da biblioteca
      }

      // Se é um bloco existente
      if (typeof active.id === 'string' && active.id.includes('block-')) {
        // Bloco sendo reordenado
      }
    },
    [availableComponents, currentStepData]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      // Arrastar componente da biblioteca para o canvas
      if (
        typeof active.id === 'string' &&
        active.id.includes('component-') &&
        over.id === 'canvas-drop-zone'
      ) {
        const componentType = active.id.replace('component-', '');
        const newBlock = createBlockFromComponent(componentType);
        addBlockToStep(currentStepKey, newBlock);
        setSelectedBlockId(newBlock.id);
        return;
      }

      // Reordenar blocos existentes
      if (
        typeof active.id === 'string' &&
        typeof over.id === 'string' &&
        active.id.includes('block-') &&
        over.id.includes('block-')
      ) {
        const activeIndex = currentStepData.findIndex(block => block.id === active.id);
        const overIndex = currentStepData.findIndex(block => block.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          reorderBlocksInStep(currentStepKey, activeIndex, overIndex);
        }
      }
    },
    [createBlockFromComponent, addBlockToStep, currentStepKey, currentStepData, reorderBlocksInStep]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`quiz-editor-pro h-screen bg-gray-50 flex ${className}`}>
        {/* 📋 COLUNA 1: ETAPAS (200px) */}
        <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm text-gray-900">Etapas do Quiz</h3>
            <p className="text-xs text-gray-500 mt-1">21 etapas configuradas</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {Array.from({ length: 21 }, (_, i) => i + 1).map(step => {
                const analysis = getStepAnalysis(step);
                const isActive = step === currentStep;
                const hasBlocks = stepBlocks[`step-${step}`]?.length > 0;

                return (
                  <button
                    key={step}
                    onClick={() => handleStepSelect(step)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-xs transition-colors',
                      isActive
                        ? 'bg-blue-100 border-blue-300 text-blue-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{analysis.type}</span>
                        <span className="font-medium">Etapa {step}</span>
                      </div>
                      {hasBlocks && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                    </div>
                    <div className="text-gray-600 mt-1">
                      <div className="font-medium">{analysis.label}</div>
                      <div className="text-xs">{analysis.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Etapa atual:</span>
              <span className="font-medium">{currentStep}/21</span>
            </div>
          </div>
        </div>

        {/* 🧩 COLUNA 2: COMPONENTES (280px) */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm text-gray-900">Biblioteca de Componentes</h3>
            <p className="text-xs text-gray-500 mt-1">
              {availableComponents.length} componentes disponíveis
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {components.map(component => (
                      <div
                        key={component.type}
                        draggable
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-grab active:cursor-grabbing transition-colors group"
                        onDragStart={e => {
                          e.dataTransfer.setData('component-type', component.type);
                          handleDragStart({
                            active: { id: `component-${component.type}` },
                          } as DragStartEvent);
                        }}
                        onDragEnd={() => {
                          // Drag finalizado
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{component.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">
                              {component.name}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {component.description}
                            </div>
                            <div className="text-xs text-blue-600 mt-1 font-mono">
                              {component.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🎨 COLUNA 3: CANVAS (flex-1) */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Header do Canvas */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  {mode === 'edit' ? '✏️' : '👁️'}
                  {mode === 'edit' ? 'Editor' : 'Preview'} - Etapa {currentStep}
                </h3>
                <p className="text-sm text-gray-600">
                  {getStepAnalysis(currentStep).label}: {getStepAnalysis(currentStep).desc}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Toggle de modo com visual melhorado */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setMode('edit')}
                    className={cn(
                      'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                      mode === 'edit'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => setMode('preview')}
                    className={cn(
                      'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                      mode === 'preview'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    👁️ Preview
                  </button>
                </div>

                {/* Controles */}
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                  💾 Salvar
                </button>
              </div>
            </div>

            {/* Informações contextuais do modo */}
            <div className="mt-3 p-3 rounded-lg border">
              {mode === 'edit' ? (
                <div
                  className={cn(
                    'flex items-center justify-between text-sm',
                    'bg-blue-50 border-blue-200 text-blue-900'
                  )}
                >
                  <div>
                    <strong>✏️ Modo Edição Visual:</strong> Conteúdo real com overlays de seleção
                    interativos
                  </div>
                  <div className="text-blue-700">
                    {selectedBlockId
                      ? `Editando: ${selectedBlockId}`
                      : `${currentStepData.length} blocos disponíveis - Clique para editar`}
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'flex items-center justify-between text-sm',
                    'bg-green-50 border-green-200 text-green-900'
                  )}
                >
                  <div>
                    <strong>👁️ Modo Preview:</strong> Visualização idêntica à produção final
                  </div>
                  <div className="text-green-700">Navegação e interações funcionais</div>
                </div>
              )}
            </div>
          </div>

          {/* Área do Canvas */}
          <div className="flex-1 p-6 overflow-auto" id="canvas-drop-zone">
            <div className="max-w-4xl mx-auto">
              {/* ✏️ MODO EDIÇÃO E PREVIEW - Conteúdo real com overlays de seleção */}
              <div className="relative bg-white rounded-lg shadow-sm">
                {/* Renderização do conteúdo real */}
                <QuizRenderer
                  mode={mode === 'preview' ? 'preview' : 'editor'}
                  onStepChange={handleStepSelect}
                  initialStep={currentStep}
                />

                {/* Overlays de seleção apenas no modo de edição */}
                {mode === 'edit' && (
                  <SortableContext
                    items={currentStepData.map(
                      block => block.id || `block-${currentStepData.indexOf(block)}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="absolute inset-0 pointer-events-none z-50">
                      {currentStepData.map((block: Block, index: number) => {
                        const blockId = block.id || `block-${index}`;
                        const isSelected = selectedBlockId === blockId;

                        // Calcular posição baseada no tipo de bloco e ordem
                        let topOffset = 0;
                        let height = 80;

                        // Ajustar posição baseado no tipo de bloco
                        switch (block.type) {
                          case 'quiz-intro-header':
                            topOffset = 20;
                            height = 120;
                            break;
                          case 'options-grid':
                            topOffset = 150 + index * 200;
                            height = 300;
                            break;
                          case 'form-container':
                            topOffset = 200 + index * 150;
                            height = 120;
                            break;
                          case 'button':
                            topOffset = 400 + index * 100;
                            height = 60;
                            break;
                          default:
                            topOffset = 60 + index * 100;
                            height = 80;
                        }

                        return (
                          <SortableBlock
                            key={blockId}
                            id={blockId}
                            block={block}
                            isSelected={isSelected}
                            topOffset={topOffset}
                            height={height}
                            onSelect={handleBlockSelect}
                            onMoveUp={handleBlockMoveUp}
                            onMoveDown={handleBlockMoveDown}
                            onDuplicate={() => {
                              const newBlock = createBlockFromComponent(block.type);
                              addBlockToStep(currentStepKey, newBlock);
                            }}
                            onDelete={handleBlockDelete}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                )}

                {/* Área de drop para novos componentes (apenas modo edição) */}
                {mode === 'edit' && currentStepData.length > 0 && (
                  <div
                    className="absolute bottom-0 left-4 right-4 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center text-blue-500 bg-blue-50 bg-opacity-50 hover:border-blue-500 hover:bg-opacity-80 transition-all duration-200"
                    onDragOver={e => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-600', 'bg-blue-100');
                    }}
                    onDragLeave={e => {
                      e.currentTarget.classList.remove('border-blue-600', 'bg-blue-100');
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-600', 'bg-blue-100');

                      const componentType = e.dataTransfer.getData('component-type');
                      if (componentType) {
                        const newBlock = createBlockFromComponent(componentType);
                        addBlockToStep(currentStepKey, newBlock);
                        setSelectedBlockId(newBlock.id);
                      }
                    }}
                  >
                    <div className="text-lg mb-2">➕</div>
                    <div className="text-sm font-medium">
                      Arraste um componente aqui para adicionar
                    </div>
                  </div>
                )}

                {/* Estado vazio (apenas modo edição) */}
                {mode === 'edit' && currentStepData.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-white bg-opacity-90 max-w-md transition-all duration-200 hover:border-blue-400 hover:bg-blue-50"
                      onDragOver={e => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          'border-blue-500',
                          'bg-blue-100',
                          'text-blue-600'
                        );
                      }}
                      onDragLeave={e => {
                        e.currentTarget.classList.remove(
                          'border-blue-500',
                          'bg-blue-100',
                          'text-blue-600'
                        );
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          'border-blue-500',
                          'bg-blue-100',
                          'text-blue-600'
                        );

                        const componentType = e.dataTransfer.getData('component-type');
                        if (componentType) {
                          const newBlock = createBlockFromComponent(componentType);
                          addBlockToStep(currentStepKey, newBlock);
                          setSelectedBlockId(newBlock.id);
                        }
                      }}
                    >
                      <div className="text-3xl mb-4">📝</div>
                      <div className="text-lg font-medium mb-2">Nenhum bloco configurado</div>
                      <div className="text-sm mb-4">
                        Esta etapa ainda não possui componentes configurados
                      </div>
                      <div className="text-xs text-gray-400">
                        Arraste componentes da biblioteca para começar a editar
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ⚙️ COLUNA 4: PROPRIEDADES (380px) */}
        <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm text-gray-900">Painel de Propriedades</h3>
            {selectedBlock ? (
              <p className="text-xs text-gray-500 mt-1">Editando: {selectedBlock.type}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Selecione um bloco para editar</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedBlock ? (
              <EnhancedUniversalPropertiesPanelFixed
                selectedBlock={selectedBlock}
                onUpdate={handleBlockUpdate}
                onClose={handleClosePropertiesPanel}
                onDelete={handleBlockDelete}
              />
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="text-2xl mb-3">⚙️</div>
                <div className="text-sm font-medium mb-2">Nenhum bloco selecionado</div>
                <div className="text-xs">
                  Clique em um bloco no canvas para ver suas propriedades
                </div>

                {/* Estatísticas da etapa */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Estatísticas da Etapa {currentStep}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Blocos configurados:</span>
                      <span className="font-medium">{currentStepData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo da etapa:</span>
                      <span className="font-medium">{getStepAnalysis(currentStep).label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Função:</span>
                      <span className="font-medium">{getStepAnalysis(currentStep).desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default QuizEditorPro;
