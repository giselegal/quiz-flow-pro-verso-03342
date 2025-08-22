import { QuizRenderer } from '@/components/core/QuizRenderer';
import EnhancedUniversalPropertiesPanelFixed from '@/components/universal/EnhancedUniversalPropertiesPanelFixed';
import { cn } from '@/lib/utils';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import React, { useCallback, useState } from 'react';

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
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Template data
  const templateData = QUIZ_STYLE_21_STEPS_TEMPLATE;
  const currentStepData = templateData[`step-${currentStep}`] || [];
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

  // Handlers
  const handleStepSelect = useCallback((step: number) => {
    setCurrentStep(step);
    setSelectedBlockId(null);
  }, []);

  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockUpdate = useCallback((blockId: string, updates: Record<string, any>) => {
    console.log('Atualizando bloco:', blockId, updates);
    // TODO: Implementar atualização real do bloco
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    console.log('Removendo bloco:', blockId);
    setSelectedBlockId(null);
    // TODO: Implementar remoção real do bloco
  }, []);

  const handleClosePropertiesPanel = useCallback(() => {
    setSelectedBlockId(null);
  }, []);

  // Drag & Drop handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const component = availableComponents.find(c => c.type === event.active.id);
      setDraggedComponent(component);
    },
    [availableComponents]
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDraggedComponent(null);

    if (event.over && event.over.id === 'canvas-drop-zone') {
      const componentType = event.active.id;
      console.log('Adicionando componente ao canvas:', componentType);
      // TODO: Implementar adição de componente ao canvas
    }
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                const hasBlocks = templateData[`step-${step}`]?.length > 0;

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
                    <strong>✏️ Modo Edição:</strong> Clique nos blocos para editar suas propriedades
                  </div>
                  <div className="text-blue-700">
                    {selectedBlockId
                      ? `Editando: ${selectedBlockId}`
                      : `${currentStepData.length} blocos disponíveis`}
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
                    <strong>👁️ Modo Preview:</strong> Visualização idêntica à produção
                  </div>
                  <div className="text-green-700">Navegação e interações funcionais</div>
                </div>
              )}
            </div>
          </div>

          {/* Área do Canvas */}
          <div className="flex-1 p-6 overflow-auto" id="canvas-drop-zone">
            <div className="max-w-4xl mx-auto">
              {mode === 'preview' ? (
                /* 👁️ MODO PREVIEW - Idêntico à produção */
                <div className="bg-white rounded-lg shadow-sm">
                  <QuizRenderer
                    mode="preview"
                    onStepChange={handleStepSelect}
                    initialStep={currentStep}
                  />
                </div>
              ) : (
                /* ✏️ MODO EDIÇÃO - Canvas com blocos editáveis */
                <div className="bg-white rounded-lg shadow-sm min-h-[600px] p-6">
                  <div className="space-y-4">
                    {currentStepData.map((block: Block, index: number) => (
                      <div
                        key={block.id || index}
                        onClick={() => handleBlockSelect(block.id || `block-${index}`)}
                        className={cn(
                          'border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200',
                          selectedBlockId === (block.id || `block-${index}`)
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-mono">
                              {block.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              Ordem: {block.order || index + 1}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            #{block.id || `block-${index}`}
                          </div>
                        </div>

                        {/* Preview do conteúdo do bloco */}
                        <div className="space-y-2">
                          {block.content?.title && (
                            <div className="font-semibold text-gray-900 text-sm">
                              📝 {block.content.title}
                            </div>
                          )}

                          {block.content?.question && (
                            <div className="font-medium text-gray-800 text-sm">
                              ❓ {block.content.question}
                            </div>
                          )}

                          {block.content?.description && (
                            <div className="text-gray-600 text-xs">
                              📄 {block.content.description}
                            </div>
                          )}

                          {block.content?.options && (
                            <div className="text-xs text-blue-600">
                              🎯 {block.content.options.length} opções configuradas
                            </div>
                          )}

                          {block.content?.buttonText && (
                            <div className="text-xs text-green-600">
                              🔘 Botão: "{block.content.buttonText}"
                            </div>
                          )}

                          {block.content?.testimonials && (
                            <div className="text-xs text-purple-600">
                              💬 {block.content.testimonials.length} depoimentos
                            </div>
                          )}

                          {/* Propriedades importantes */}
                          {block.properties && Object.keys(block.properties).length > 0 && (
                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                              ⚙️ {Object.keys(block.properties).length} propriedades configuradas
                            </div>
                          )}
                        </div>

                        {/* Indicador de seleção */}
                        {selectedBlockId === (block.id || `block-${index}`) && (
                          <div className="mt-3 text-xs text-blue-600 font-medium">
                            ✏️ Bloco selecionado - Edite no painel de propriedades →
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Estado vazio */}
                    {currentStepData.length === 0 && (
                      <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-3xl mb-4">📝</div>
                        <div className="text-lg font-medium mb-2">Nenhum bloco configurado</div>
                        <div className="text-sm mb-4">
                          Esta etapa ainda não possui componentes configurados
                        </div>
                        <div className="text-xs text-gray-400">
                          Arraste componentes da biblioteca para começar a editar
                        </div>
                      </div>
                    )}

                    {/* Área de drop para novos componentes */}
                    {currentStepData.length > 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                        <div className="text-lg mb-2">➕</div>
                        <div className="text-sm">Arraste um componente aqui para adicionar</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
