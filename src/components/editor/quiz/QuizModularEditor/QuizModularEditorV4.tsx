/**
 * 🎯 QUIZ MODULAR EDITOR V4 WRAPPER
 * 
 * Wrapper que adiciona suporte v4 ao QuizModularEditor existente:
 * - Integra adaptadores v3 ↔ v4
 * - Usa DynamicPropertiesPanelV4
 * - Layout otimizado com 3 colunas
 * 
 * MODO OPERACIONAL:
 * - useV4Layout=false: Usa editor original com 4 colunas
 * - useV4Layout=true (PADRÃO): Usa layout v4 otimizado com DynamicPropertiesPanelV4
 * 
 * @version 2.0.0
 * @status PRODUCTION
 */

import React, { useMemo, useCallback, Suspense, lazy } from 'react';
import QuizModularEditor, { type QuizModularEditorProps } from './index';
import { DynamicPropertiesPanelV4 } from '@/components/editor/properties/DynamicPropertiesPanelV4';
import { BlockV3ToV4Adapter, BlockV4ToV3Adapter, ensureV4Block } from '@/core/quiz/blocks/adapters';
import { useEditorContext } from '@/core';
import type { Block } from '@/types/editor';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';

// Lazy imports dos componentes do editor
const StepNavigatorColumn = lazy(() => import('./components/StepNavigatorColumn'));
const CanvasColumn = lazy(() => import('./components/CanvasColumn'));

export interface QuizModularEditorV4Props extends QuizModularEditorProps {
    /** Usar layout otimizado v4 com DynamicPropertiesPanelV4 */
    useV4Layout?: boolean;
    /** Callback quando bloco v4 é atualizado */
    onBlockV4Update?: (blockId: string, updates: Partial<QuizBlock>) => void;
}

/**
 * Hook para gerenciar conversão automática v3 ↔ v4
 */
function useV4BlockAdapter() {
    const context = useEditorContext();

    // Converte blocos v3 do contexto para v4
    const v4Blocks = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blocks) return [];
        return blocks.map((block: Block, index: number) => {
            try {
                return ensureV4Block(block, index);
            } catch (error) {
                appLogger.error('Failed to convert block to v4:', { error, block });
                return null;
            }
        }).filter((b: QuizBlock | null): b is QuizBlock => b !== null);
    }, [(context as any).blocks]);

    // Handler que converte update v4 → v3 antes de chamar updateBlock
    const handleV4Update = useCallback((blockId: string, updates: Partial<QuizBlock>) => {
        appLogger.debug('V4 update received:', { blockId, updates });

        const blocks = (context as any).blocks as Block[] | undefined;
        const updateBlock = (context as any).updateBlock as ((id: string, block: Block) => void) | undefined;

        // Encontra bloco original v3
        const originalBlock = blocks?.find((b: Block) => b.id === blockId);
        if (!originalBlock) {
            appLogger.warn('Block not found for v4 update:', blockId);
            return;
        }

        if (!updateBlock) {
            appLogger.warn('updateBlock not available in context');
            return;
        }

        try {
            // Cria bloco v4 atualizado
            const v4Block = ensureV4Block(originalBlock);
            const updatedV4Block: QuizBlock = {
                ...v4Block,
                ...updates,
                properties: {
                    ...(v4Block.properties || {}),
                    ...(updates.properties || {}),
                },
            };

            // Converte de volta para v3
            const v3Block = BlockV4ToV3Adapter.convert(updatedV4Block);

            // Atualiza no contexto v3
            updateBlock(blockId, v3Block);

            appLogger.info('V4 update converted and applied:', { blockId, v3Block });
        } catch (error) {
            appLogger.error('Failed to convert v4 update to v3:', { error, blockId, updates });
        }
    }, [context]);

    return {
        v4Blocks,
        handleV4Update,
    };
}

/**
 * Layout V4 Otimizado - 3 Colunas
 */
function EditorLayoutV4({
    editorProps,
    v4Blocks,
    handleV4Update
}: {
    editorProps: QuizModularEditorProps;
    v4Blocks: QuizBlock[];
    handleV4Update: (blockId: string, updates: Partial<QuizBlock>) => void;
}) {
    const context = useEditorContext();
    const selectedBlockId = (context as any).selectedBlockId as string | null;
    const blocks = (context as any).blocks as Block[] | undefined || [];

    // Encontra o bloco v4 selecionado
    const selectedV4Block = useMemo(() => {
        if (!selectedBlockId) return null;
        return v4Blocks.find(b => b.id === selectedBlockId) || null;
    }, [selectedBlockId, v4Blocks]);

    appLogger.info('EditorLayoutV4 rendered', {
        blocksCount: v4Blocks.length,
        selectedBlockId,
        hasSelectedBlock: !!selectedV4Block
    });

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header simplificado */}
            <header className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V4</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Editor Modular v4
                        </h1>
                        <p className="text-xs text-gray-500">
                            Layout otimizado • {v4Blocks.length} blocos
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        ✓ DynamicPropertiesV4
                    </div>
                </div>
            </header>

            {/* Layout 3 Colunas */}
            <PanelGroup
                direction="horizontal"
                className="flex-1"
                autoSaveId="editor-v4-layout"
            >
                {/* Coluna 1: Steps Navigator */}
                <Panel defaultSize={18} minSize={12} maxSize={25}>
                    <div className="h-full border-r bg-white overflow-y-auto">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-pulse text-sm text-gray-400">
                                    Carregando navegação...
                                </div>
                            </div>
                        }>
                            <StepNavigatorColumn
                                steps={[]} // TODO: Integrar steps do context
                                currentStepKey={editorProps.initialStep || 'step1'}
                                onSelectStep={(key) => appLogger.info('Step selected:', key)}
                                validationErrors={[]}
                                validationWarnings={[]}
                            />
                        </Suspense>
                    </div>
                </Panel>

                <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors" withHandle />

                {/* Coluna 2: Canvas (expandido) */}
                <Panel defaultSize={52} minSize={40}>
                    <div className="h-full bg-gray-50 overflow-y-auto">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-pulse text-sm text-gray-400">
                                    Carregando canvas...
                                </div>
                            </div>
                        }>
                            <CanvasColumn
                                currentStepKey={editorProps.initialStep || 'step1'}
                                blocks={blocks}
                                selectedBlockId={selectedBlockId}
                                onBlockSelect={(id) => {
                                    const selectBlock = (context as any).selectBlock;
                                    if (selectBlock) selectBlock(id);
                                }}
                                hasTemplate={!!editorProps.funnelId}
                                onLoadTemplate={() => { }}
                                isEditable={true}
                            />
                        </Suspense>
                    </div>
                </Panel>

                <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors" withHandle />

                {/* Coluna 3: DynamicPropertiesPanel V4 */}
                <Panel defaultSize={30} minSize={25} maxSize={40}>
                    <div className="h-full border-l bg-white overflow-y-auto">
                        {selectedV4Block ? (
                            <DynamicPropertiesPanelV4
                                block={selectedV4Block}
                                onUpdate={(updates) => {
                                    appLogger.debug('Property update from V4 panel:', updates);
                                    handleV4Update(selectedV4Block.id, updates);
                                }}
                                onClose={() => {
                                    const clearSelection = (context as any).clearSelection;
                                    if (clearSelection) clearSelection();
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎨</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Nenhum bloco selecionado
                                </h3>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    Clique em um bloco no canvas para editar suas propriedades com controles dinâmicos
                                </p>
                            </div>
                        )}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

/**
 * Componente wrapper que adiciona funcionalidades v4
 */
export function QuizModularEditorV4Wrapper({
    useV4Layout = true, // ✅ V4 layout por padrão!
    onBlockV4Update,
    ...editorProps
}: QuizModularEditorV4Props) {
    const { v4Blocks, handleV4Update } = useV4BlockAdapter();

    // Combina handlers v4
    const combinedV4Handler = useCallback(
        (blockId: string, updates: Partial<QuizBlock>) => {
            handleV4Update(blockId, updates);
            onBlockV4Update?.(blockId, updates);
        },
        [handleV4Update, onBlockV4Update]
    );

    appLogger.info('QuizModularEditorV4 render', {
        useV4Layout,
        blocksCount: v4Blocks.length
    });

    // Layout v4 otimizado
    if (useV4Layout) {
        return (
            <EditorLayoutV4
                editorProps={editorProps}
                v4Blocks={v4Blocks}
                handleV4Update={combinedV4Handler}
            />
        );
    }

    // Fallback: editor original com 4 colunas
    return (
        <QuizModularEditor
            {...editorProps}
        />
    );
}/**
 * Hook para usar blocos v4 diretamente no código
 */
export function useV4Blocks() {
    const context = useEditorContext();

    const v4Blocks = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blocks) return [];
        return BlockV3ToV4Adapter.convertMany(blocks);
    }, [(context as any).blocks]);

    return v4Blocks;
}

/**
 * Hook para converter um bloco específico para v4
 */
export function useV4Block(blockId: string | null) {
    const context = useEditorContext();

    const v4Block = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blockId || !blocks) return null;
        const block = blocks.find((b: Block) => b.id === blockId);
        if (!block) return null;
        return ensureV4Block(block);
    }, [blockId, (context as any).blocks]);

    return v4Block;
}

export default QuizModularEditorV4Wrapper;
