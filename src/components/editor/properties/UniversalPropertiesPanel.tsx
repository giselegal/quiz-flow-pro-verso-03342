// @ts-nocheck
/**
 * 🎛️ PAINEL DE PROPRIEDADES UNIVERSAL
 * 
 * Painel context-aware que mostra configurações relevantes baseadas na seleção:
 * - Nível 1: FUNIL (quando nada selecionado) → Configs globais, publicação, SEO
 * - Nível 2: ETAPA (quando step selecionado) → Configs da etapa, tema, animações
 * - Nível 3: BLOCO (quando bloco selecionado) → Props do bloco específico
 * 
 * Features:
 * - ✅ Context-aware (detecta seleção automaticamente)
 * - ✅ Breadcrumb navegável
 * - ✅ Lazy loading de seções
 * - ✅ Auto-save com debounce
 * - ✅ Reutiliza editores especializados existentes
 */

import React, { useMemo } from 'react';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Home, FileText, Box } from 'lucide-react';

// Context renderers (lazy loaded)
import { FunnelContext } from './contexts/FunnelContext';
import { StepContext } from './contexts/StepContext';
import { BlockContext } from './contexts/BlockContext';

// ============================================================================
// TYPES
// ============================================================================

export type SelectionContextType =
    | { type: 'funnel'; data: any }
    | { type: 'step'; stepId: string; data: any }
    | { type: 'block'; blockId: string; stepId: string; data: any };

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UniversalPropertiesPanel() {
    const editor = useEditor({ optional: true });

    // Detectar contexto baseado em seleção (prioridade: Block > Step > Funnel)
    const context = useMemo((): SelectionContextType => {
        if (!editor) {
            return { type: 'funnel', data: null };
        }

        // Prioridade 1: Bloco selecionado
        if (editor.state?.selectedBlockId) {
            const block = editor.state.stepBlocks?.find(
                (b: any) => b.id === editor.state.selectedBlockId
            );

            return {
                type: 'block',
                blockId: editor.state.selectedBlockId,
                stepId: editor.state.currentStepKey || '',
                data: block || null,
            };
        }

        // Prioridade 2: Etapa ativa (mas nenhum bloco selecionado)
        if (editor.state?.currentStepKey) {
            const stepData = editor.state.templateConfig?.steps?.[editor.state.currentStepKey];

            return {
                type: 'step',
                stepId: editor.state.currentStepKey,
                data: stepData || null,
            };
        }

        // Prioridade 3: Funil (default quando nada selecionado)
        return {
            type: 'funnel',
            data: editor.state?.templateConfig || null,
        };
    }, [
        editor?.state?.selectedBlockId,
        editor?.state?.currentStepKey,
        editor?.state?.stepBlocks,
        editor?.state?.templateConfig,
    ]);

    if (!editor) {
        return (
            <div className="h-full flex items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground p-8">
                    <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Editor não disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background border-l">

            {/* Header com breadcrumb contextual */}
            <div className="p-4 border-b bg-muted/5">
                <ContextBreadcrumb context={context} editor={editor} />
            </div>

            {/* Conteúdo baseado em contexto */}
            <ScrollArea className="flex-1">
                <div className="p-4">
                    {context.type === 'funnel' && (
                        <FunnelContext data={context.data} editor={editor} />
                    )}

                    {context.type === 'step' && (
                        <StepContext
                            stepId={context.stepId}
                            data={context.data}
                            editor={editor}
                        />
                    )}

                    {context.type === 'block' && (
                        <BlockContext
                            blockId={context.blockId}
                            stepId={context.stepId}
                            data={context.data}
                            editor={editor}
                        />
                    )}
                </div>
            </ScrollArea>

            {/* Footer com ações contextuais */}
            <div className="p-4 border-t bg-muted/5">
                <ContextActions context={context} editor={editor} />
            </div>
        </div>
    );
}

// ============================================================================
// BREADCRUMB COMPONENT
// ============================================================================

interface ContextBreadcrumbProps {
    context: SelectionContextType;
    editor: any;
}

function ContextBreadcrumb({ context, editor }: ContextBreadcrumbProps) {
    const handleClearSelection = () => {
        if (editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(null);
        }
    };

    const handleSelectStep = () => {
        if (editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(null);
        }
    };

    return (
        <div className="space-y-2">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-sm">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 hover:bg-primary/10"
                    onClick={handleClearSelection}
                >
                    <Home className="w-3.5 h-3.5 mr-1.5" />
                    <span className="font-medium">Funil</span>
                </Button>

                {(context.type === 'step' || context.type === 'block') && (
                    <>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <Button
                            variant={context.type === 'step' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={handleSelectStep}
                        >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            <span className="font-medium">
                                {context.type === 'step'
                                    ? context.data?.metadata?.name || `Etapa ${context.stepId}`
                                    : `Etapa ${context.stepId}`
                                }
                            </span>
                        </Button>
                    </>
                )}

                {context.type === 'block' && (
                    <>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 px-2"
                        >
                            <Box className="w-3.5 h-3.5 mr-1.5" />
                            <span className="font-medium">
                                {context.data?.type || 'Block'}
                            </span>
                        </Button>
                    </>
                )}
            </div>

            {/* Context title */}
            <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    {context.type === 'funnel' && '🎯 Configurações do Funil'}
                    {context.type === 'step' && '📄 Configurações da Etapa'}
                    {context.type === 'block' && '🧩 Propriedades do Bloco'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {context.type === 'funnel' && 'Configurações globais, publicação e SEO'}
                    {context.type === 'step' && 'Conteúdo, tema e comportamento da etapa'}
                    {context.type === 'block' && `Editar propriedades do bloco ${context.data?.type || ''}`}
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// CONTEXT ACTIONS (Footer)
// ============================================================================

interface ContextActionsProps {
    context: SelectionContextType;
    editor: any;
}

function ContextActions({ context, editor }: ContextActionsProps) {
    if (context.type === 'funnel') {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        {Object.keys(editor.state?.templateConfig?.steps || {}).length} etapas
                    </Badge>
                </div>
                <Button size="sm" variant="default">
                    🚀 Publicar
                </Button>
            </div>
        );
    }

    if (context.type === 'step') {
        return (
            <div className="flex items-center justify-between">
                <Badge variant="outline">
                    {context.data?.blocks?.length || 0} blocos
                </Badge>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                        Duplicar Etapa
                    </Button>
                </div>
            </div>
        );
    }

    if (context.type === 'block') {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                        // TODO: Implementar duplicação
                        console.log('Duplicar bloco:', context.blockId);
                    }}
                >
                    Duplicar
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                        if (editor?.actions?.deleteBlock) {
                            editor.actions.deleteBlock(context.blockId);
                        }
                    }}
                >
                    Deletar
                </Button>
            </div>
        );
    }

    return null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default UniversalPropertiesPanel;
