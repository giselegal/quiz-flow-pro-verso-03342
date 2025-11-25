import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { appLogger } from '@/lib/utils/logger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuperUnifiedProvider as EditorProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import { useBlocksFromSupabase } from '@/hooks/useBlocksFromSupabase';
import { useBlockMutations } from '@/hooks/useBlockMutations';
import React, { useState, useCallback, useEffect } from 'react';
import { CanvasDropZone } from '../canvas/CanvasDropZone.simple';
import PropertiesColumnWithJson from '@/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/PropertiesColumnWithJson';
import ComponentsSidebar from '../components/ComponentsSidebar';
import { AutosaveIndicator } from '@/components/editor/quiz/AutosaveIndicator';
import { useEditor } from '@/contexts/editor/EditorContext';
import { templateService } from '@/services/canonical/TemplateService';

interface UnifiedEditorLayoutProps {
    className?: string;
    /** ID do funil (Supabase) */
    funnelId?: string;
    /** ID do template (JSON) */
    templateId?: string;
    /** ID unificado do recurso */
    resourceId?: string;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({
    className = '',
    funnelId: funnelIdProp,
    templateId: templateIdProp,
    resourceId: resourceIdProp
}) => {
    const { saveStatus, lastSaved, saveError } = (() => {
        try { return useEditor(); } catch { return { saveStatus: 'idle', lastSaved: null, saveError: null } as any; }
    })();
    const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [templateBlocks, setTemplateBlocks] = useState<any[]>([]);
    const [loadingTemplate, setLoadingTemplate] = useState(false);

    const { resultPageConfig } = useResultPageConfig('Natural');
    const editorCtx = (() => { try { return useEditor(); } catch { return null as any; } })();

    // 🎯 UNIFICAÇÃO: Props > Contexto > URL
    const funnelId = funnelIdProp || editorCtx?.funnelId || new URLSearchParams(window.location.search).get('funnelId') || undefined;
    const templateId = templateIdProp || resourceIdProp || new URLSearchParams(window.location.search).get('template') || new URLSearchParams(window.location.search).get('resourceId') || undefined;
    const currentStep = editorCtx?.currentStep ?? 1;

    // 🐛 DEBUG: Log do estado
    useEffect(() => {
        console.log('🔍 UnifiedEditorLayout Estado:', {
            funnelId,
            templateId,
            currentStep,
            mode: funnelId ? '🟢 SUPABASE' : templateId ? '🟡 TEMPLATE' : '🔴 MOCK'
        });
    }, [funnelId, templateId, currentStep]);

    // 📦 Carregar do Supabase (se funnelId presente)
    const { data: supabaseBlocks, isLoading: loadingBlocks } = useBlocksFromSupabase(
        funnelId || '',
        currentStep - 1
    );

    useEffect(() => {
        if (funnelId) {
            console.log('📁 Blocos Supabase:', {
                count: supabaseBlocks?.length || 0,
                isLoading: loadingBlocks,
                blocks: supabaseBlocks
            });
        }
    }, [supabaseBlocks, loadingBlocks, funnelId]);

    // 📚 Carregar template JSON (se templateId presente e SEM funnelId)
    useEffect(() => {
        if (!templateId || funnelId) return;

        setLoadingTemplate(true);
        // templateService não tem loadTemplate, usar fetch direto ou outro método
        fetch(`/templates/${templateId}.json`)
            .then(res => res.json())
            .then((template: any) => {
                const stepBlocks = template?.steps?.[currentStep - 1]?.blocks || [];
                console.log('✅ Template carregado:', template?.name, stepBlocks.length, 'blocos');
                setTemplateBlocks(stepBlocks);
            })
            .catch((err: Error) => {
                console.error('❌ Erro ao carregar template:', err);
                setTemplateBlocks([]);
            })
            .finally(() => setLoadingTemplate(false));
    }, [templateId, currentStep, funnelId]);

    // 🎯 UNIFICAÇÃO: Decidir qual fonte usar
    const sourceBlocks = React.useMemo(() => {
        // 1️⃣ Supabase (prioridade máxima)
        if (funnelId && supabaseBlocks && supabaseBlocks.length > 0) {
            console.log('🟢 Usando blocos do SUPABASE:', supabaseBlocks.length);
            return supabaseBlocks;
        }

        // 2️⃣ Template JSON
        if (templateId && templateBlocks && templateBlocks.length > 0) {
            console.log('🟡 Usando blocos do TEMPLATE:', templateBlocks.length);
            return templateBlocks;
        }

        // 3️⃣ Config padrão
        if (resultPageConfig?.blocks && resultPageConfig.blocks.length > 0) {
            console.log('🔵 Usando blocos do CONFIG:', resultPageConfig.blocks.length);
            return resultPageConfig.blocks;
        }

        // 4️⃣ Mock (fallback)
        const mockBlocks = [
            {
                id: 'mock-header-1',
                type: 'header',
                properties: { title: '🎯 Painel de Propriedades HÍBRIDO!', subtitle: 'Funciona com Supabase OU Templates' },
                content: {},
                order: 0
            },
            {
                id: 'mock-text-1',
                type: 'text',
                properties: { content: '👉 Edite este texto no painel direito!' },
                content: {},
                order: 1
            },
            {
                id: 'mock-button-1',
                type: 'button',
                properties: { label: 'Botão de Teste', variant: 'primary' },
                content: {},
                order: 2
            }
        ];
        console.log('🔴 Usando blocos MOCK:', mockBlocks.length);
        return mockBlocks;
    }, [funnelId, supabaseBlocks, templateId, templateBlocks, resultPageConfig]);

    const { updateBlock, deleteBlock } = useBlockMutations();

    const handleComponentSelect = (type: string) => {
        appLogger.debug('Component selected:', type);
    };

    const handleBlockUpdate = useCallback((blockId: string, updates: any) => {
        console.log('📝 Block update:', { blockId, updates });
        updateBlock({ id: blockId, updates });
    }, [updateBlock]);

    const handleBlockDelete = useCallback(() => {
        if (selectedBlockId) {
            console.log('🗑️ Block delete:', selectedBlockId);
            deleteBlock(selectedBlockId);
            setSelectedBlockId(null);
        }
    }, [selectedBlockId, deleteBlock]);

    const selectedBlock = selectedBlockId
        ? sourceBlocks.find((b: any) => b.id === selectedBlockId) || null
        : null;

    useEffect(() => {
        if (selectedBlockId) {
            console.log('🎯 Bloco selecionado:', { selectedBlockId, selectedBlock });
        }
    }, [selectedBlockId, selectedBlock]);

    const safeSelectedBlock = selectedBlock
        ? {
            ...selectedBlock,
            content: selectedBlock.content || {},
            properties: selectedBlock.properties || {},
        }
        : null;

    const isLoading = loadingBlocks || loadingTemplate;

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
                            <TabsTrigger value="quiz">Quiz Editor</TabsTrigger>
                            <TabsTrigger value="result">Result Page</TabsTrigger>
                            <TabsTrigger value="sales">Sales Page</TabsTrigger>
                        </TabsList>
                        <div className="px-3 py-2 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                {funnelId && '🟢 Supabase'}
                                {!funnelId && templateId && '🟡 Template'}
                                {!funnelId && !templateId && '🔴 Mock'}
                                {isLoading && ' • Carregando...'}
                            </div>
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
                                    onUpdateBlock={(blockId, updates) => handleBlockUpdate(blockId, updates)}
                                    onDeleteBlock={handleBlockDelete}
                                    scopeId={'unified-layout'}
                                />
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            <ResizablePanel defaultSize={15} minSize={12}>
                                <PropertiesColumnWithJson
                                    selectedBlock={safeSelectedBlock as any}
                                    onBlockUpdate={(blockId, updates) => {
                                        console.log('🎨 Properties column update:', { blockId, updates });
                                        handleBlockUpdate(blockId, updates);
                                    }}
                                    onClearSelection={() => setSelectedBlockId(null)}
                                    blocks={sourceBlocks as any}
                                    onBlockSelect={setSelectedBlockId}
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
