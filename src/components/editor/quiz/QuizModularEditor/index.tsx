import React, { Suspense } from 'react';
import { useEditorState } from './hooks/useEditorState';

// Esqueleto do novo editor modular (Fase 1.3)
// Objetivo: ser o ponto de orquestração leve e carregado sob demanda

const StepNavigatorColumn = React.lazy(() => import('./components/StepNavigatorColumn'));
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // Estado compartilhado do editor (step atual, undo/redo, dirty flag)
    const editor = useEditorState(props.initialStepKey);

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
                    <CanvasColumn currentStepKey={editor.state.currentStepKey} />
                </div>
            </Suspense>

            <div className="col-span-1 border-l">
                <div className="p-2 text-sm">Properties Panel (placeholder)</div>
            </div>
        </div>
    );
}
