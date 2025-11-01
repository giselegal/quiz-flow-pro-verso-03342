import React from 'react';
import { useEditorState } from '../../hooks/useEditorState';

export type StepNavigatorColumnProps = {
    initialStepKey?: string;
    steps?: { key: string; title: string }[];
};

// Nota: Em iterações futuras, os passos serão carregados do serviço/estado global
// e virtualizados para listas grandes.
function StepNavigatorColumnImpl({ initialStepKey, steps }: StepNavigatorColumnProps) {
    const { state, setStep } = useEditorState(initialStepKey);

    const items = steps ?? [
        { key: 'step-01', title: 'Etapa 01' },
        { key: 'step-02', title: 'Etapa 02' },
        { key: 'step-03', title: 'Etapa 03' },
    ];

    return (
        <div className="p-2 space-y-1">
            <div className="text-sm font-medium mb-2">Navegação</div>
            <ul className="space-y-1">
                {items.map((s) => (
                    <li key={s.key}>
                        <button
                            className={`w-full text-left px-2 py-1 rounded hover:bg-accent ${state.currentStepKey === s.key ? 'bg-accent' : ''
                                }`}
                            onClick={() => setStep(s.key)}
                        >
                            {s.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StepNavigatorColumnImpl;
