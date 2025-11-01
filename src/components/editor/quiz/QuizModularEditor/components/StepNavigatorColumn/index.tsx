import React, { useEffect, useMemo } from 'react';
import { templateService } from '@/services/canonical/TemplateService';

export type StepNavigatorColumnProps = {
    initialStepKey?: string;
    steps?: { key: string; title: string }[];
    currentStepKey?: string | null;
    onSelectStep: (stepKey: string) => void;
};

// Nota: Em iterações futuras, os passos serão carregados do serviço/estado global
// e virtualizados para listas grandes.
function StepNavigatorColumnImpl({ initialStepKey, steps, currentStepKey, onSelectStep }: StepNavigatorColumnProps) {

    // Preferir fonte canônica de steps; aceitar override via prop "steps"
    const canonicalSteps = useMemo(() => templateService.steps.list(), []);
    const items = useMemo(() => {
        if (steps) return steps;
        if (canonicalSteps.success) {
            return canonicalSteps.data.map((s) => ({
                key: s.id,
                title: `${s.order.toString().padStart(2, '0')} - ${s.name}`,
            }));
        }
        // Fallback mínimo
        return [
            { key: 'step-01', title: '01 - Introdução' },
            { key: 'step-02', title: '02 - Pergunta' },
            { key: 'step-03', title: '03 - Pergunta' },
        ];
    }, [canonicalSteps, steps]);

    // Garantir seleção inicial consistente
    useEffect(() => {
        if (!currentStepKey && items.length > 0) {
            onSelectStep(initialStepKey ?? items[0].key);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    return (
        <div className="p-2 space-y-1">
            <div className="text-sm font-medium mb-2">Navegação</div>
            <ul className="space-y-1">
                {items.map((s) => (
                    <li key={s.key}>
                        <button
                            className={`w-full text-left px-2 py-1 rounded hover:bg-accent ${currentStepKey === s.key ? 'bg-accent' : ''
                                }`}
                            onClick={() => onSelectStep(s.key)}
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
