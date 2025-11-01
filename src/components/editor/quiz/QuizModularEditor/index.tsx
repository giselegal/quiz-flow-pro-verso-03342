import React, { Suspense, useEffect } from 'react';
import { useEditorState } from './hooks/useEditorState';
import { useBlockOperations } from './hooks/useBlockOperations';
import type { Block } from '@/services/UnifiedTemplateRegistry';

// Esqueleto do novo editor modular (Fase 1.3)
// Objetivo: ser o ponto de orquestração leve e carregado sob demanda

const StepNavigatorColumn = React.lazy(() => import('./components/StepNavigatorColumn'));
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // Estado compartilhado do editor (step atual, undo/redo, dirty flag)
    const editor = useEditorState(props.initialStepKey);
    const ops = useBlockOperations();

    // Garantir carregamento inicial dos blocos locais quando step mudar
    useEffect(() => {
        ops.ensureLoaded(editor.state.currentStepKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.state.currentStepKey]);

    const blocks: Block[] | null = ops.getBlocks(editor.state.currentStepKey);

    return (
        <div className="qm-editor grid grid-cols-4 gap-2 h-full">
            <Suspense fallback={<div>Carregando navegação…</div>}>
                <div className="col-span-1 border-r">
                    <StepNavigatorColumn
                        initialStepKey={props.initialStepKey}
                        currentStepKey={editor.state.currentStepKey}
                        onSelectStep={editor.setStep}
                    />
                </div>
            </Suspense>

            <Suspense fallback={<div className="col-span-2 flex items-center justify-center">Carregando canvas…</div>}>
                <div className="col-span-2">
                    <CanvasColumn currentStepKey={editor.state.currentStepKey} blocks={blocks} />
                </div>
            </Suspense>

            <Suspense fallback={<div className="col-span-1 border-l p-2 text-sm">Carregando biblioteca…</div>}>
                <div className="col-span-1 border-l flex flex-col h-full">
                    <ComponentLibraryColumn
                        currentStepKey={editor.state.currentStepKey}
                        onAddBlock={(type) => ops.addBlock(editor.state.currentStepKey, { type })}
                    />
                    <div className="mt-auto p-2 text-sm border-t">Properties Panel (placeholder)</div>
                </div>
            </Suspense>
        </div>
    );
}
