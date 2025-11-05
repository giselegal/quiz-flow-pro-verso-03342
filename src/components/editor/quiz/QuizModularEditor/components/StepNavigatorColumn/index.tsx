// Coluna de navegação de steps — versão inicial usando TemplateService canônico
import React, { useEffect, useMemo, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MoreVertical } from 'lucide-react';
import { AddStepDialog, type NewStepData } from '../AddStepDialog';
import { DeleteStepConfirmDialog } from '../DeleteStepConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export type StepNavigatorColumnProps = {
    initialStepKey?: string;
    steps?: { key: string; title: string }[];
    currentStepKey?: string | null;
    onSelectStep: (stepKey: string) => void;
};

// Nota: Em iterações futuras, os passos serão carregados do serviço/estado global
// e virtualizados para listas grandes.
function StepNavigatorColumnImpl({ initialStepKey, steps, currentStepKey, onSelectStep }: StepNavigatorColumnProps) {
    const { toast } = useToast();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        stepId: string;
        stepName: string;
    }>({ open: false, stepId: '', stepName: '' });
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

    const handleDeleteStep = async (stepId: string) => {
        try {
            const result = await templateService.steps.remove(stepId);
            
            if (result.success) {
                toast({
                    title: 'Etapa removida',
                    description: 'A etapa foi deletada com sucesso',
                });

                // Se a etapa deletada estava selecionada, selecionar a primeira
                if (currentStepKey === stepId) {
                    const remainingSteps = items.filter(s => s.key !== stepId);
                    if (remainingSteps.length > 0) {
                        onSelectStep(remainingSteps[0].key);
                    }
                }

                // Forçar refresh da lista
                setRefreshKey(prev => prev + 1);
            } else {
                toast({
                    title: 'Erro ao deletar',
                    description: result.error?.message || 'Não foi possível deletar a etapa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Erro ao deletar etapa:', error);
            toast({
                title: 'Erro ao deletar',
                description: 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
        }
    };

    const openDeleteDialog = (stepId: string, stepName: string) => {
        setDeleteDialog({ open: true, stepId, stepName });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, stepId: '', stepName: '' });
    };

    const confirmDelete = () => {
        handleDeleteStep(deleteDialog.stepId);
        closeDeleteDialog();
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
                        {items.map((s) => {
                            // Verificar se é uma etapa customizada (deletável)
                            const isCustomStep = !s.key.match(/^step-0[1-9]$|^step-1[0-9]$|^step-2[01]$/);
                            
                            return (
                                <li key={s.key} className="group relative">
                                    <div className="flex items-center gap-1">
                                        <button
                                            className={`flex-1 text-left px-2 py-1 rounded hover:bg-accent transition-colors ${
                                                currentStepKey === s.key ? 'bg-accent' : ''
                                            }`}
                                            onClick={() => onSelectStep(s.key)}
                                        >
                                            {s.title}
                                        </button>
                                        
                                        {isCustomStep && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(s.key, s.title)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Deletar Etapa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <AddStepDialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onAdd={handleAddStep}
                existingStepsCount={items.length}
            />

            <DeleteStepConfirmDialog
                open={deleteDialog.open}
                stepName={deleteDialog.stepName}
                stepId={deleteDialog.stepId}
                onConfirm={confirmDelete}
                onCancel={closeDeleteDialog}
            />
        </>
    );
}

export default StepNavigatorColumnImpl;
