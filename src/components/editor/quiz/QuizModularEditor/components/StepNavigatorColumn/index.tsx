// Coluna de navegação de steps — versão inicial usando TemplateService canônico
import React, { useEffect, useMemo, useState } from 'react';
import { templateService, type StepInfo } from '@/services/canonical/TemplateService';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MoreVertical, GripVertical } from 'lucide-react';
import { AddStepDialog, type NewStepData } from '../AddStepDialog';
import { DeleteStepConfirmDialog } from '../DeleteStepConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SortableStepItem } from './SortableStepItem';
import { appLogger } from '@/lib/utils/appLogger';

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

    // Configurar sensores de drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Requer 8px de movimento para iniciar drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Preferir fonte canônica de steps; aceitar override via prop "steps"
    const canonicalSteps = useMemo(() => templateService.steps.list(), [refreshKey]);
    const [localItems, setLocalItems] = useState<{ key: string; title: string }[]>([]);

    // Sincronizar items com canonicalSteps
    useEffect(() => {
        if (steps) {
            setLocalItems(steps);
        } else if (canonicalSteps.success) {
            setLocalItems(
                canonicalSteps.data.map((s: StepInfo) => ({
                    key: s.id,
                    title: `${s.order.toString().padStart(2, '0')} - ${s.name}`,
                }))
            );
        }
    }, [canonicalSteps, steps, refreshKey]);

    const items = localItems;

    const handleAddStep = async (stepData: NewStepData) => {
        try {
            // ✅ Gerar ID único usando timestamp + random para evitar colisões
            const randomId = Math.random().toString(36).substring(2, 9);
            const uniqueId = `step-custom-${Date.now()}-${randomId}`;
            
            // Adicionar step via TemplateService
            const result = await templateService.steps.add({
                id: uniqueId,
                name: stepData.name,
                order: stepData.order,
                type: stepData.type,
                description: stepData.description,
                blocksCount: 0,
                hasTemplate: false,
            });

            // ✅ Validar resultado da operação
            if (result.success) {
                toast({
                    title: 'Etapa criada',
                    description: `A etapa "${stepData.name}" foi adicionada com sucesso`,
                });

                // Forçar refresh da lista
                setRefreshKey(prev => prev + 1);
                
                // Selecionar a nova etapa
                onSelectStep(uniqueId);
            } else {
                toast({
                    title: 'Erro ao criar etapa',
                    description: result.error?.message || 'Não foi possível criar a etapa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            appLogger.error('Erro ao adicionar etapa:', { data: [error] });
            toast({
                title: 'Erro ao criar etapa',
                description: 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
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
            appLogger.error('Erro ao deletar etapa:', { data: [error] });
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

    const handleDuplicateStep = async (stepId: string) => {
        try {
            const result = await templateService.steps.duplicate(stepId);
            
            if (result.success) {
                toast({
                    title: 'Etapa duplicada',
                    description: `Nova etapa criada: ${result.data.name}`,
                });

                // Forçar refresh da lista
                setRefreshKey(prev => prev + 1);
                
                // Selecionar a nova etapa
                onSelectStep(result.data.id);
            } else {
                toast({
                    title: 'Erro ao duplicar',
                    description: 'error' in result ? result.error.message : 'Não foi possível duplicar a etapa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            appLogger.error('Erro ao duplicar etapa:', { data: [error] });
            toast({
                title: 'Erro ao duplicar',
                description: 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        // Atualizar ordem localmente primeiro (UI instantânea)
        const newItems = arrayMove(items, oldIndex, newIndex);
        setLocalItems(newItems);

        try {
            // Atualizar ordem no service
            const stepIds = newItems.map((item) => item.key);
            const result = await templateService.steps.reorder(stepIds);

            if (result.success) {
                toast({
                    title: 'Ordem atualizada',
                    description: 'As etapas foram reordenadas com sucesso',
                });
                // Forçar refresh para sincronizar com service
                setRefreshKey((prev) => prev + 1);
            } else {
                // Reverter em caso de erro
                setLocalItems(items);
                toast({
                    title: 'Erro ao reordenar',
                    description: result.error?.message || 'Não foi possível atualizar a ordem',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            // Reverter em caso de erro
            setLocalItems(items);
            appLogger.error('Erro ao reordenar etapas:', { data: [error] });
            toast({
                title: 'Erro ao reordenar',
                description: 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((item) => item.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul className="space-y-1">
                                {items.map((s) => {
                                    // Verificar se é uma etapa customizada (deletável)
                                    const isCustomStep = !s.key.match(/^step-0[1-9]$|^step-1[0-9]$|^step-2[01]$/);
                                    
                                    return (
                                        <SortableStepItem
                                            key={s.key}
                                            id={s.key}
                                            title={s.title}
                                            isSelected={currentStepKey === s.key}
                                            isCustomStep={isCustomStep}
                                            onSelect={() => onSelectStep(s.key)}
                                            onDelete={() => openDeleteDialog(s.key, s.title)}
                                            onDuplicate={() => handleDuplicateStep(s.key)}
                                        />
                                    );
                                })}
                            </ul>
                        </SortableContext>
                    </DndContext>
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
