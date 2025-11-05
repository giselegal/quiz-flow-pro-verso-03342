// Coluna de navegação de steps — versão inicial usando TemplateService canônico
import React, { useEffect, useMemo, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddStepDialog, type NewStepData } from '../AddStepDialog';

export type StepNavigatorColumnProps = {
    initialStepKey?: string;
    steps?: { key: string; title: string }[];
    currentStepKey?: string | null;
    onSelectStep: (stepKey: string) => void;
};

// Nota: Em iterações futuras, os passos serão carregados do serviço/estado global
// e virtualizados para listas grandes.
function StepNavigatorColumnImpl({ initialStepKey, steps, currentStepKey, onSelectStep }: StepNavigatorColumnProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Preferir fonte canônica de steps; aceitar override via prop "steps"
    const canonicalSteps = useMemo(() => templateService.steps.list(), [refreshKey]);
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
    }, [canonicalSteps, steps, refreshKey]);

    const handleAddStep = async (stepData: NewStepData) => {
        try {
            // Adicionar step via TemplateService
            await templateService.steps.add({
                id: `step-${stepData.order.toString().padStart(2, '0')}`,
                name: stepData.name,
                order: stepData.order,
                type: stepData.type,
                description: stepData.description,
                blocksCount: 0,
                hasTemplate: false,
            });

            // Forçar refresh da lista
            setRefreshKey(prev => prev + 1);
            
            // Selecionar a nova etapa
            onSelectStep(`step-${stepData.order.toString().padStart(2, '0')}`);
        } catch (error) {
            console.error('Erro ao adicionar etapa:', error);
        }
    };

    // Garantir seleção inicial consistente
    useEffect(() => {
        if (!currentStepKey && items.length > 0) {
            onSelectStep(initialStepKey ?? items[0].key);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    return (
        <>
            <div className="p-2 space-y-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Navegação</div>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setShowAddDialog(true)}
                        className="h-7 w-7 p-0"
                        title="Adicionar etapa"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                
                {items.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        <p>Nenhuma etapa carregada</p>
                        <p className="text-xs mt-2">
                            Clique no botão + para adicionar sua primeira etapa
                        </p>
                    </div>
                ) : (
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
                )}
            </div>

            <AddStepDialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onAdd={handleAddStep}
                existingStepsCount={items.length}
            />
        </>
    );
}

export default StepNavigatorColumnImpl;
