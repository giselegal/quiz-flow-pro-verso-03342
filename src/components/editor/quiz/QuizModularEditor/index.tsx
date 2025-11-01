import React, { Suspense } from 'react';

// Esqueleto do novo editor modular (Fase 1.3)
// Objetivo: ser o ponto de orquestração leve e carregado sob demanda

const StepNavigatorColumn = React.lazy(() => import('./components/StepNavigatorColumn'));

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // Por enquanto, apenas um layout placeholder minimalista.
    // Na próxima etapa, conectaremos useEditorState e demais colunas.
    return (
        <div className="qm-editor grid grid-cols-4 gap-2 h-full">
            <Suspense fallback={<div>Carregando navegação…</div>}>
                <div className="col-span-1 border-r">
                    <StepNavigatorColumn initialStepKey={props.initialStepKey} />
                </div>
            </Suspense>

            <div className="col-span-2 flex items-center justify-center text-muted-foreground">
                <div>
                    <div className="text-sm">Canvas</div>
                    <div className="text-xs">(placeholder)</div>
                </div>
            </div>

            <div className="col-span-1 border-l">
                <div className="p-2 text-sm">Properties Panel (placeholder)</div>
            </div>
        </div>
    );
}
