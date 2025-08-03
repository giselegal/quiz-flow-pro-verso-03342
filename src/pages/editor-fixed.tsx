import React, { useState } from 'react';
import BrandHeader from '@/components/ui/BrandHeader';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import DynamicPropertiesPanel from '@/components/editor/DynamicPropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { EditableContent, Block } from '@/types/editor';
import { getDefaultContentForType } from '@/utils/blockDefaults';
import { getRegistryStats, generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { useEditor } from '@/context/EditorContext';
import { Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditorFixedPage: React.FC = () => {
  // ✅ INTEGRAÇÃO COM EDITOR CONTEXT
  const { blocks, selectedBlockId, setSelectedBlockId, actions } = useEditor();
  
  // ✅ BLOCOS POR ETAPA: Cada etapa tem seus próprios blocos
  const [stageBlocks, setStageBlocks] = useState<Record<string, Block[]>>({});
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [activeStageId, setActiveStageId] = useState<string>('step-1');

  // ✅ BLOCOS ATUAIS: Usa EditorContext como fonte da verdade
  const currentBlocks = stageBlocks[activeStageId] || blocks;

  const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId);
  
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

  // ✅ INTEGRAÇÃO: Usar actions do EditorContext
  const handleDeleteBlock = (blockId: string) => {
    actions.deleteBlock(blockId);
    // Também remover do estado local da etapa
    setStageBlocks(prev => ({
      ...prev,
      [activeStageId]: (prev[activeStageId] || []).filter(block => block.id !== blockId)
    }));
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

  
  // ✅ CONECTAR: Handler para mudança de etapa com carregamento de blocos
  const handleStageSelect = (stageId: string) => {
    console.log('🔄 Editor: Mudando para etapa:', stageId);
    console.log('📦 Carregando blocos da etapa:', stageId);
    console.log('🔢 Blocos disponíveis:', stageBlocks[stageId]?.length || 0);
    
    setActiveStageId(stageId);
    setSelectedBlockId(null); // Limpar seleção de bloco
    
    // ✅ CARREGAMENTO: Inicializar etapa vazia se não existe
    if (!stageBlocks[stageId]) {
      setStageBlocks(prev => ({
        ...prev,
        [stageId]: []
      }));
      console.log(`📝 Etapa ${stageId} inicializada como vazia`);
    }
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
      
      {/* Status bar moderno */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200/50 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-purple-700 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Editor Ativo
            </span>
            <span className="text-purple-600">
              {currentBlocks.length} blocos • {registryStats.active} componentes • Etapa: {activeStageId}
            </span>
            <span className="text-purple-600">
              Viewport: {viewportSize.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-purple-500">
            Sistema de validação em runtime ativo
          </div>
        </div>
      </div>
      
      <FourColumnLayout
        stagesPanel={<FunnelStagesPanel onStageSelect={handleStageSelect} />}
        componentsPanel={
          <EnhancedComponentsSidebar 
            onAddComponent={(type: string) => {
              // ✅ INTEGRAÇÃO: Usar actions do EditorContext
              const blockId = actions.addBlock(type as any);
              
              // Também adicionar ao estado local da etapa
              const defaultContent = getDefaultContentForType(type as any);
              const newBlock: Block = {
                id: blockId,
                type: type as any,
                content: defaultContent,
                properties: {},
                order: currentBlocks.length
              };
              
              setStageBlocks(prev => ({
                ...prev,
                [activeStageId]: [...(prev[activeStageId] || []), newBlock]
              }));
              
              console.log(`➕ Bloco ${type} adicionado à etapa ${activeStageId} via EditorContext`);
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
                    <p className="text-xs text-gray-400 mt-2">Cada etapa tem seu próprio conteúdo</p>
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

                        <UniversalBlockRenderer
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onClick={() => setSelectedBlockId(block.id)}
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
          selectedBlockId && selectedBlock ? (
            <DynamicPropertiesPanel
              block={selectedBlock}
              blockDefinition={getBlockDefinitionForType(selectedBlock.type)}
              onUpdateBlock={(blockId: string, properties: Partial<EditableContent>) => {
                // ✅ INTEGRAÇÃO: Usar actions do EditorContext
                actions.updateBlock(blockId, { content: properties });
                
                // Também atualizar estado local da etapa
                setStageBlocks(prev => ({
                  ...prev,
                  [activeStageId]: (prev[activeStageId] || []).map(block => 
                    block.id === blockId 
                      ? { ...block, content: { ...block.content, ...properties } }
                      : block
                  )
                }));
              }}
              onClose={() => setSelectedBlockId(null)}
            />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Selecione um bloco para editar suas propriedades
            </div>
          )
        }
      />
    </div>
  );
};

export default EditorFixedPage;
