/**
 * 🧩 BLOCK CONTEXT - Nível 3: Propriedades do Bloco
 * 
 * Renderiza configurações quando um bloco está selecionado
 * Reutiliza os editores especializados existentes do SinglePropertiesPanel
 * 
 * Features:
 * - ✅ Detecta tipo de bloco
 * - ✅ Renderiza editor especializado apropriado
 * - ✅ Ações rápidas (duplicar, deletar)
 * - ✅ Preview das propriedades
 */

import React, { useCallback, Suspense, lazy } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Trash2, Eye, EyeOff } from 'lucide-react';

// Lazy load dos editores especializados (mesmo do SinglePropertiesPanel)
const HeaderPropertyEditor = lazy(() =>
    import('../editors/HeaderPropertyEditor').then(m => ({ default: m.HeaderPropertyEditor })),
);
const QuestionPropertyEditor = lazy(() =>
    import('../editors/QuestionPropertyEditor').then(m => ({ default: m.QuestionPropertyEditor })),
);
const ButtonPropertyEditor = lazy(() =>
    import('../editors/ButtonPropertyEditor').then(m => ({ default: m.ButtonPropertyEditor })),
);
const TextPropertyEditor = lazy(() =>
    import('../editors/TextPropertyEditor'),
);
const OptionsGridPropertyEditor = lazy(() =>
    import('../editors/OptionsGridPropertyEditor'),
);
const ImagePropertyEditor = lazy(() =>
    import('../editors/ImagePropertyEditor'),
);

// ============================================================================
// TYPES
// ============================================================================

interface BlockContextProps {
    blockId: string;
    stepId: string;
    data: any;
    editor: any;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BlockContext({ blockId, stepId, data, editor }: BlockContextProps) {
    // Handler para atualizar bloco
    const handleUpdate = useCallback((updates: Record<string, any>) => {
        if (editor?.actions?.updateBlock) {
            editor.actions.updateBlock(blockId, updates);
        }
    }, [editor, blockId]);

    // Ações do bloco
    const handleDuplicate = () => {
        if (editor?.actions?.duplicateBlock) {
            editor.actions.duplicateBlock(blockId);
        }
    };

    const handleDelete = () => {
        if (editor?.actions?.deleteBlock) {
            if (confirm(`Deletar bloco "${data?.type}"?`)) {
                editor.actions.deleteBlock(blockId);
            }
        }
    };

    const handleToggleVisibility = () => {
        const newVisibility = !(data?.visible ?? true);
        handleUpdate({ visible: newVisibility });
    };

    if (!data) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                <p className="text-sm">Bloco não encontrado</p>
                <p className="text-xs mt-1">ID: {blockId}</p>
            </div>
        );
    }

    const blockType = data.type || 'unknown';
    const isVisible = data.visible ?? true;

    return (
        <div className="space-y-4">

            {/* Block Info Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono text-xs">
                        {blockId}
                    </Badge>
                    <div className="flex items-center gap-2">
                        {!isVisible && (
                            <Badge variant="destructive" className="text-xs">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Oculto
                            </Badge>
                        )}
                        <Badge variant="outline">{blockType}</Badge>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Specialized Editor */}
            <div className="min-h-[200px]">
                <SpecializedBlockEditor
                    blockType={blockType}
                    blockData={data}
                    onUpdate={handleUpdate}
                />
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase">
                    Ações Rápidas
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToggleVisibility}
                        className="w-full"
                    >
                        {isVisible ? (
                            <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Ocultar
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4 mr-2" />
                                Mostrar
                            </>
                        )}
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDuplicate}
                        className="w-full"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                    </Button>
                </div>

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    className="w-full"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar Bloco
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// SPECIALIZED EDITOR ROUTER
// ============================================================================

interface SpecializedBlockEditorProps {
    blockType: string;
    blockData: any;
    onUpdate: (updates: Record<string, any>) => void;
}

function SpecializedBlockEditor({
    blockType,
    blockData,
    onUpdate,
}: SpecializedBlockEditorProps) {

    // Switch baseado no tipo do bloco (mesmo do SinglePropertiesPanel)
    const renderEditor = () => {
        switch (blockType) {
            case 'header':
            case 'quiz-intro-header':
            case 'quiz-header':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <HeaderPropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            case 'question':
            case 'quiz-question':
            case 'quiz-question-inline':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <QuestionPropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            case 'button':
            case 'cta':
            case 'quiz-cta':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <ButtonPropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            case 'text':
            case 'text-inline':
            case 'headline':
            case 'title':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <TextPropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            case 'options-grid':
            case 'options-grid-inline':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <OptionsGridPropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            case 'image':
            case 'logo':
                return (
                    <Suspense fallback={<EditorSkeleton />}>
                        <ImagePropertyEditor
                            block={blockData}
                            onUpdate={onUpdate}
                            isPreviewMode={false}
                        />
                    </Suspense>
                );

            default:
                return <GenericBlockEditor blockData={blockData} onUpdate={onUpdate} />;
        }
    };

    return <div>{renderEditor()}</div>;
}

// ============================================================================
// FALLBACKS
// ============================================================================

function EditorSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
            </div>
        </div>
    );
}

function GenericBlockEditor({
    blockData,
    onUpdate,
}: {
    blockData: any;
    onUpdate: (updates: any) => void;
}) {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center">
            <div className="text-muted-foreground">
                <p className="text-sm font-medium mb-2">
                    Editor genérico para "{blockData.type}"
                </p>
                <p className="text-xs">
                    Editor especializado será adicionado em breve
                </p>
            </div>

            {/* Mostrar propriedades disponíveis */}
            <div className="mt-4 text-left">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                    Propriedades:
                </div>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(blockData, null, 2)}
                </pre>
            </div>
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default BlockContext;
