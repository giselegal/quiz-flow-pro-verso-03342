import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { appLogger } from '@/lib/utils/logger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Migrado: usar SuperUnifiedProvider em vez do provider canônico deprecated
import { SuperUnifiedProvider as EditorProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import { useBlocksFromSupabase } from '@/hooks/useBlocksFromSupabase';
import { useBlockMutations } from '@/hooks/useBlockMutations';
import React, { useState } from 'react';
import { CanvasDropZone } from '../canvas/CanvasDropZone.simple';
// ✅ CORREÇÃO: Usar ModernPropertiesPanel que aceita selectedBlock
import ModernPropertiesPanel from '../properties/ModernPropertiesPanel';
import ComponentsSidebar from '../components/ComponentsSidebar';
import { AutosaveIndicator } from '@/components/editor/quiz/AutosaveIndicator';
import { useEditor } from '@/contexts/editor/EditorContext';

interface UnifiedEditorLayoutProps {
  className?: string;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({ className = '' }) => {
  const { saveStatus, lastSaved, saveError } = (() => {
    try { return useEditor(); } catch { return { saveStatus: 'idle', lastSaved: null, saveError: null } as any; }
  })();
  const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const { resultPageConfig } = useResultPageConfig('Natural');
  const editorCtx = (() => { try { return useEditor(); } catch { return null as any; } })();
  const funnelId = editorCtx?.funnelId as string | undefined;
  const currentStep = editorCtx?.currentStep ?? 1;

  // 🐛 DEBUG: Ver o que está chegando
  React.useEffect(() => {
    console.log('🔍 UnifiedEditorLayout Estado:', {
      funnelId,
      currentStep,
      hasEditorCtx: !!editorCtx,
      selectedBlockId
    });
  }, [funnelId, currentStep, editorCtx, selectedBlockId]);

  const { data: supabaseBlocks, isLoading: loadingBlocks } = useBlocksFromSupabase(
    funnelId || '',
    currentStep - 1 // step_number zero-based no banco; ajuste conforme necessário
  );

  const { updateBlock, deleteBlock } = useBlockMutations();

  // 🐛 DEBUG: Ver se blocos carregaram
  React.useEffect(() => {
    console.log('🔍 Blocos do Supabase:', {
      count: supabaseBlocks?.length || 0,
      blocks: supabaseBlocks,
      isLoading: loadingBlocks
    });
  }, [supabaseBlocks, loadingBlocks]);

  const handleComponentSelect = (type: string) => {
    appLogger.debug('Component selected:', type);
  };

  const handleBlockUpdate = (updates: any) => {
    if (selectedBlockId) {
      // appLogger.debug('Block updated:', selectedBlockId, updates);
      updateBlock({ id: selectedBlockId, updates });
    }
  };

  const handleBlockDelete = () => {
    if (selectedBlockId) {
      // appLogger.debug('Block deleted:', selectedBlockId);
      deleteBlock(selectedBlockId);
      setSelectedBlockId(null);
    }
  };

  // Create default config with all required properties
  const defaultConfig = {
    styleType: 'Natural',
    header: {
      visible: true,
      content: {
        title: 'Seu Resultado',
        subtitle: 'Descubra seu estilo único',
      },
    },
    mainContent: {
      visible: true,
      content: {
        description: 'Conteúdo principal do resultado',
      },
    },
    offer: {
      hero: {
        visible: true,
        content: {
          title: 'Oferta Especial',
          description: 'Descrição da oferta',
        },
      },
      benefits: { visible: true, content: {} },
      products: { visible: true, content: {} },
      pricing: { visible: true, content: {} },
      testimonials: { visible: true, content: {} },
      guarantee: { visible: true, content: {} },
    },
    blocks: [],
  };

  const config = resultPageConfig || defaultConfig;
  // Fix type compatibility by ensuring content is always defined
  const sourceBlocks = supabaseBlocks && supabaseBlocks.length > 0 ? supabaseBlocks : (config.blocks || []);

  // 🐛 DEBUG: Ver blocos finais
  React.useEffect(() => {
    console.log('📦 Source blocks:', {
      count: sourceBlocks.length,
      fromSupabase: !!(supabaseBlocks && supabaseBlocks.length > 0),
      blocks: sourceBlocks.slice(0, 2) // primeiros 2 para não poluir
    });
  }, [sourceBlocks, supabaseBlocks]);

  const selectedBlock = selectedBlockId
    ? sourceBlocks.find((b: any) => b.id === selectedBlockId) || null
    : null;

  const safeSelectedBlock = selectedBlock
    ? {
      ...selectedBlock,
      content: selectedBlock.content || {},
      properties: selectedBlock.properties || {},
    }
    : null;

  // 🐛 DEBUG: Ver seleção
  React.useEffect(() => {
    if (selectedBlockId) {
      console.log('🎯 Bloco selecionado:', {
        id: selectedBlockId,
        found: !!selectedBlock,
        block: safeSelectedBlock
      });
    }
  }, [selectedBlockId, selectedBlock, safeSelectedBlock]);

  return (
    <EditorProvider>
      <div className={`h-screen flex flex-col ${className}`}>
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as any)}
          className="flex-1"
        >
          <div className="border-b border-brand-brightPink/20 bg-brand-background">
            <TabsList className="grid w-full grid-cols-3 bg-brand-darkBlue/5">
              <TabsTrigger value="quiz" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Quiz Editor</TabsTrigger>
              <TabsTrigger value="result" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Result Page</TabsTrigger>
              <TabsTrigger value="sales" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Sales Page</TabsTrigger>
            </TabsList>
            <div className="px-3 py-2 flex justify-end">
              <AutosaveIndicator status={saveStatus as any} errorMessage={saveError?.message} compact />
            </div>
          </div>

          <TabsContent value="result" className="flex-1 mt-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={15} minSize={12} maxSize={30}>
                <ComponentsSidebar onComponentSelect={handleComponentSelect} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={70} minSize={60}>
                <CanvasDropZone
                  blocks={sourceBlocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={handleBlockUpdate}
                  onDeleteBlock={handleBlockDelete}
                  scopeId={'unified-layout'}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={15} minSize={12}>
                <ModernPropertiesPanel
                  selectedBlock={safeSelectedBlock}
                  onUpdate={(updates) => {
                    if (selectedBlockId) {
                      handleBlockUpdate(updates);
                    }
                  }}
                  onDelete={handleBlockDelete}
                  onClose={() => setSelectedBlockId(null)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="quiz" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center bg-brand-background">
              <p className="text-brand-darkBlue/70">Quiz Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center bg-brand-background">
              <p className="text-brand-darkBlue/70">Sales Page Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EditorProvider>
  );
};
