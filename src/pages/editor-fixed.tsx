import React from 'react';
import BrandHeader from '@/components/ui/BrandHeader';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import DynamicPropertiesPanel from '@/components/editor/DynamicPropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { EditableContent } from '@/types/editor';
import { getRegistryStats, generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { useEditor } from '@/context/EditorContext';
import { Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditorFixedPage: React.FC = () => {
  console.log('🔥 EditorFixedPage: PÁGINA RENDERIZANDO!');
  
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
    const baseClasses = "transition-all duration-300 mx-auto bg-white rounded-lg shadow-sm border";
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      <BrandHeader />
      
      <EditorToolbar
        isPreviewing={isPreviewing}
        onTogglePreview={() => setIsPreviewing(!isPreviewing)}
        onSave={handleSave}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
      />
      
      {/* Status bar moderno com dados unificados */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200/50 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-purple-700 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Editor Ativo ✅ UNIFICADO
            </span>
            <span className="text-purple-600">
              {currentBlocks.length} blocos • {totalBlocks} total • {stageCount} etapas • Ativa: {activeStageId}
            </span>
            <span className="text-purple-600">
              Viewport: {viewportSize.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-purple-500">
            Context unificado ativo • {registryStats.active} componentes
          </div>
        </div>
      </div>
      
      <FourColumnLayout
        stagesPanel={
          <FunnelStagesPanel 
            onStageSelect={handleStageSelect} 
          />
        }
        componentsPanel={
          <EnhancedComponentsSidebar 
            onAddComponent={(type: string) => {
              // ✅ USAR CONTEXT UNIFICADO
              const blockId = addBlock(type);
              console.log(`➕ Bloco ${type} adicionado à etapa ${activeStageId}`);
            }}
          />
        }
        canvas={
          <div className="p-6 overflow-auto h-full bg-gradient-to-br from-gray-50 to-slate-100">
            <div className={getCanvasClassName()}>
              <div className="p-6">
                {currentBlocks.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Etapa {activeStageId}</h3>
                    <p className="text-gray-500">Arraste componentes da sidebar para adicionar à esta etapa</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Sistema unificado: {stageCount} etapas inicializadas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBlocks.map((block) => (
                      <div
                        key={block.id}
                        className={`
                          group relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                          ${selectedBlockId === block.id 
                            ? 'border-purple-400 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                          }
                        `}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        {/* Controles do bloco */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Renderização do bloco */}
                        <UniversalBlockRenderer
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onClick={() => setSelectedBlockId(block.id)}
                          onPropertyChange={(key: string, value: any) => {
                            updateBlock(block.id, { content: { [key]: value } });
                          }}
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
          selectedBlock ? (
            <DynamicPropertiesPanel
              block={selectedBlock}
              blockDefinition={getBlockDefinitionForType(selectedBlock.type)}
              onUpdateBlock={(blockId: string, updates: Partial<EditableContent>) => {
                updateBlock(blockId, { content: updates });
              }}
              onClose={() => setSelectedBlockId(null)}
            />
          ) : (
            <div className="h-full p-4 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">⚙️</div>
                <p className="text-sm">Selecione um bloco para editar propriedades</p>
                <p className="text-xs text-gray-400 mt-1">
                  Context unificado ativo
                </p>
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default EditorFixedPage;
