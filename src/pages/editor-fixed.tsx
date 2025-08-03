import React from 'react';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import EnhancedPropertiesPanel from '@/components/editor/EnhancedPropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { EditableContent } from '@/types/editor';
import { getRegistryStats, generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { useEditor } from '@/context/EditorContext';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { SortableBlockWrapper } from '@/components/editor/canvas/SortableBlockWrapper';
import { Type, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditorFixedPage: React.FC = () => {
  console.log('🔥 EditorFixedPage: PÁGINA RENDERIZANDO!');
  
  // Hook para scroll sincronizado
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });
  
  // ✅ USAR NOVA ESTRUTURA UNIFICADA DO EDITORCONTEXT
  const { 
    stages,
    activeStageId,
    selectedBlockId,
    stageActions: {
      setActiveStage
    },
    blockActions: {
      addBlock,
      getBlocksForStage,
      setSelectedBlockId,
      deleteBlock,
      updateBlock
    },
    uiState: {
      isPreviewing,
      setIsPreviewing,
      viewportSize,
      setViewportSize
    },
    computed: {
      currentBlocks,
      selectedBlock,
      totalBlocks,
      stageCount
    }
  } = useEditor();

  console.log('🔥 EditorFixedPage: Dados do editor:', {
    stages: stages?.length || 0,
    activeStageId,
    selectedBlockId,
    currentBlocks: currentBlocks?.length || 0,
    totalBlocks,
    stageCount
  });
  
  // Mostrar estatísticas do registry
  const registryStats = getRegistryStats();
  
  // Obter todas as definições de blocos para properties
  const allBlockDefinitions = generateBlockDefinitions();
  
  // Função para obter blockDefinition com propriedades reais
  const getBlockDefinitionForType = (type: string) => {
    const definition = allBlockDefinitions.find(def => def.type === type);
    if (definition) {
      return definition;
    }
    
    // Fallback com propriedades padrão para qualquer componente
    return {
      type: type,
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, ' '),
      description: `Componente ${type}`,
      category: 'basic',
      icon: Type,
      component: React.Fragment,
      defaultProps: {},
      properties: {
        text: {
          type: 'string' as const,
          label: 'Texto',
          default: '',
          description: 'Conteúdo de texto do componente'
        },
        title: {
          type: 'string' as const,
          label: 'Título',
          default: '',
          description: 'Título do componente'
        },
        visible: {
          type: 'boolean' as const,
          label: 'Visível',
          default: true,
          description: 'Controla se o componente está visível'
        },
        className: {
          type: 'string' as const,
          label: 'Classes CSS',
          default: '',
          description: 'Classes CSS adicionais'
        }
      },
      label: type
    };
  };

  const handleSave = () => {
    console.log('Salvando projeto...', currentBlocks);
  };

  // ✅ USAR CONTEXT UNIFICADO PARA DELETAR
  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(blockId);
  };

  const getCanvasClassName = () => {
    const baseClasses = "transition-all duration-500 ease-out mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20";
    switch (viewportSize) {
      case 'sm': return `${baseClasses} max-w-sm`; // 384px
      case 'md': return `${baseClasses} max-w-2xl`; // 672px  
      case 'lg': return `${baseClasses} max-w-4xl`; // 896px
      case 'xl': return `${baseClasses} max-w-6xl`; // 1152px
      default: return `${baseClasses} max-w-4xl`;
    }
  };

  // ✅ NAVEGAÇÃO SIMPLIFICADA (CALLBACK OPCIONAL)
  const handleStageSelect = (stageId: string) => {
    console.log('🔄 Editor: Callback de mudança de etapa recebido:', stageId);
    // O EditorContext já gerencia tudo internamente
    // Este callback é apenas para compatibilidade
  };

  return (
    <DndProvider
      blocks={(currentBlocks || []).map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {}
      }))}
      onBlocksReorder={(newBlocks) => {
        // Atualizar ordem dos blocos
        console.log('🔄 Reordenando blocos:', newBlocks);
        // Implementar lógica de reordenação via EditorContext
      }}
      onBlockAdd={(blockType, position) => {
        const blockId = addBlock(blockType);
        console.log(`➕ Bloco ${blockType} adicionado via drag&drop na posição ${position}`);
      }}
      onBlockSelect={(blockId) => {
        setSelectedBlockId(blockId);
      }}
      selectedBlockId={selectedBlockId || undefined}
      onBlockUpdate={(blockId, updates) => {
        updateBlock(blockId, updates as any);
      }}
    >
      <div className="h-screen flex flex-col bg-gradient-to-br from-stone-50/80 via-stone-100/60 to-stone-150/40 relative">
      {/* Overlay sutil para mais elegância */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-brand-dark/[0.01] pointer-events-none"></div>
      
      <div className="relative z-10">
      <EditorToolbar
        isPreviewing={isPreviewing}
        onTogglePreview={() => setIsPreviewing(!isPreviewing)}
        onSave={handleSave}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
      />
      
      {/* Status bar elegante com sombra suave */}
            {/* Top Bar - Otimizado */}
      <div className="bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 border-b border-amber-200/50 backdrop-blur-md px-3 py-2 shadow-sm">
        {/* Status bar removida para interface mais limpa */}
      </div>
      
      <FourColumnLayout
        stagesPanel={
          !isPreviewing ? (
            <FunnelStagesPanel 
              onStageSelect={handleStageSelect} 
            />
          ) : null
        }
        componentsPanel={
          !isPreviewing ? (
            <EnhancedComponentsSidebar 
              onAddComponent={(type: string) => {
                // ✅ USAR CONTEXT UNIFICADO
                const blockId = addBlock(type);
                console.log(`➕ Bloco ${type} adicionado à etapa ${activeStageId}`);
              }}
            />
          ) : null
        }
        canvas={
          <div ref={scrollRef} className="p-2 overflow-auto h-full bg-gradient-to-br from-stone-50/50 via-white/30 to-stone-100/40 backdrop-blur-sm">
            <div className={getCanvasClassName()}>
              <div className="p-3">
                {currentBlocks.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold text-stone-700 mb-3 font-serif">Etapa {activeStageId}</h3>
                    <p className="text-stone-500 text-lg mb-2">
                      {isPreviewing ? 'Modo Preview - Nenhum componente nesta etapa' : 'Arraste componentes da sidebar para começar'}
                    </p>
                    <p className="text-xs text-stone-400 bg-stone-100/50 px-3 py-1 rounded-full inline-block">
                      Sistema integrado com {stageCount} etapas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentBlocks.map((block) => (
                      <SortableBlockWrapper
                        key={block.id}
                        block={block}
                        isSelected={!isPreviewing && selectedBlockId === block.id}
                        onSelect={() => !isPreviewing && setSelectedBlockId(block.id)}
                        onUpdate={(updates) => {
                          if (!isPreviewing) {
                            updateBlock(block.id, updates);
                          }
                        }}
                        onDelete={() => {
                          if (!isPreviewing) {
                            handleDeleteBlock(block.id);
                          }
                        }}
                      />
                    ))}
                  </div>
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        propertiesPanel={
          !isPreviewing && selectedBlock ? (
            <EnhancedPropertiesPanel
              block={selectedBlock}
              blockDefinition={getBlockDefinitionForType(selectedBlock.type)}
              onUpdateBlock={(blockId: string, updates: Partial<EditableContent>) => {
                updateBlock(blockId, { content: updates });
              }}
              onClose={() => setSelectedBlockId(null)}
            />
          ) : !isPreviewing ? (
            <div className="h-full p-4 flex items-center justify-center text-stone-500">
              <div className="text-center">
                <p className="text-sm">Selecione um bloco para editar propriedades</p>
                <p className="text-xs text-stone-400 mt-1">
                  Painel aprimorado ativo
                </p>
              </div>
            </div>
          ) : null
        }
      />
      </div>
    </div>
    </DndProvider>
  );
};

export default EditorFixedPage;
