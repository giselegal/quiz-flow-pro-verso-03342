/**
 * 🔄 IMPLEMENTAÇÃO: EDITOR COM API + ESTADO LOCAL (HÍBRIDO)
 * 
 * Este é um exemplo prático de como implementar a arquitetura híbrida
 * recomendada, mantendo performance do estado local com confiabilidade da API.
 * 
 * Sprint 4 - Dia 4
 * Data: 11/out/2025
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';

// ============================================
// TYPES
// ============================================

interface Funnel {
    id: string;
    title: string;
    steps: Step[];
    updatedAt: string;
}

interface Step {
    id: string;
    type: string;
    blocks: Block[];
}

interface Block {
    id: string;
    type: string;
    properties: Record<string, any>;
    content?: Record<string, any>;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ============================================
// API CLIENT
// ============================================

class FunnelAPI {
    private baseUrl = '/api/funnels';

    async getFunnel(id: string): Promise<Funnel> {
        const res = await fetch(`${this.baseUrl}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch funnel');
        return res.json();
    }

    async updateFunnel(id: string, data: Partial<Funnel>): Promise<Funnel> {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update funnel');
        return res.json();
    }

    async updateBlock(
        funnelId: string,
        stepId: string,
        blockId: string,
        updates: Partial<Block>
    ): Promise<void> {
        const res = await fetch(
            `${this.baseUrl}/${funnelId}/steps/${stepId}/blocks/${blockId}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            }
        );
        if (!res.ok) throw new Error('Failed to update block');
    }

    async autoSave(id: string, data: Partial<Funnel>): Promise<void> {
        // Endpoint otimizado para auto-save (pode ser mais leve)
        const res = await fetch(`${this.baseUrl}/${id}/auto-save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Auto-save failed');
    }
}

const funnelAPI = new FunnelAPI();

// ============================================
// CUSTOM HOOK: useHybridEditor
// ============================================

interface UseHybridEditorOptions {
    funnelId: string;
    autoSaveDelay?: number;      // ms (default: 2000)
    pollingInterval?: number;    // ms (default: 30000)
    enableAutoSave?: boolean;    // default: true
}

export function useHybridEditor(options: UseHybridEditorOptions) {
    const {
        funnelId,
        autoSaveDelay = 2000,
        pollingInterval = 30000,
        enableAutoSave = true
    } = options;

    const queryClient = useQueryClient();

    // ============================================
    // 1. FETCH DADOS INICIAIS (com cache)
    // ============================================
    const {
        data: serverFunnel,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['funnel', funnelId],
        queryFn: () => funnelAPI.getFunnel(funnelId),
        staleTime: 5 * 60 * 1000,  // Considera fresh por 5min
        cacheTime: 30 * 60 * 1000, // Mantém cache por 30min
        refetchOnWindowFocus: false, // Não revalida ao focar janela
        refetchInterval: pollingInterval, // Polling background
    });

    // ============================================
    // 2. ESTADO LOCAL (edição instantânea)
    // ============================================
    const [steps, setSteps] = useState<Step[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

    // Sincroniza com dados do servidor (apenas se não estiver editando)
    useEffect(() => {
        if (serverFunnel && !isDirty) {
            setSteps(serverFunnel.steps);
        }
    }, [serverFunnel, isDirty]);

    // ============================================
    // 3. MUTATION (save com otimismo)
    // ============================================
    const saveMutation = useMutation({
        mutationFn: (data: { steps: Step[] }) =>
            funnelAPI.updateFunnel(funnelId, data),

        onMutate: async (newData) => {
            setSaveStatus('saving');

            // Cancela queries pendentes
            await queryClient.cancelQueries(['funnel', funnelId]);

            // Snapshot do estado anterior
            const previous = queryClient.getQueryData<Funnel>(['funnel', funnelId]);

            // Atualização otimista no cache
            queryClient.setQueryData<Funnel>(['funnel', funnelId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    steps: newData.steps,
                    updatedAt: new Date().toISOString()
                };
            });

            return { previous };
        },

        onError: (err, newData, context) => {
            // Rollback em caso de erro
            if (context?.previous) {
                queryClient.setQueryData(['funnel', funnelId], context.previous);
            }

            setSaveStatus('error');
            toast({
                title: 'Erro ao salvar',
                description: 'Suas alterações foram revertidas. Tente novamente.',
                variant: 'destructive'
            });

            console.error('Save error:', err);
        },

        onSuccess: () => {
            setSaveStatus('saved');
            setIsDirty(false);
            setLastSaveTime(new Date());

            // Feedback visual discreto
            if (enableAutoSave) {
                // Não mostra toast para auto-save (menos intrusivo)
                console.log('✅ Auto-saved at', new Date().toLocaleTimeString());
            } else {
                toast({
                    title: 'Salvo com sucesso',
                    description: 'Todas as alterações foram salvas.',
                });
            }

            // Reset status após 2s
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        },

        onSettled: () => {
            // Revalida dados do servidor
            queryClient.invalidateQueries(['funnel', funnelId]);
        }
    });

    // ============================================
    // 4. AUTO-SAVE DEBOUNCED
    // ============================================
    const debouncedAutoSave = useDebouncedCallback(
        (newSteps: Step[]) => {
            if (enableAutoSave) {
                saveMutation.mutate({ steps: newSteps });
            }
        },
        autoSaveDelay
    );

    // ============================================
    // 5. UPDATE STEPS (com auto-save)
    // ============================================
    const updateSteps = useCallback((
        updater: Step[] | ((prev: Step[]) => Step[])
    ) => {
        setSteps(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;

            setIsDirty(true);

            // Trigger auto-save debounced
            debouncedAutoSave(next);

            return next;
        });
    }, [debouncedAutoSave]);

    // ============================================
    // 6. SAVE MANUAL (Ctrl+S ou botão)
    // ============================================
    const saveNow = useCallback(() => {
        // Cancela debounce e salva imediatamente
        debouncedAutoSave.cancel();
        saveMutation.mutate({ steps });
    }, [steps, debouncedAutoSave, saveMutation]);

    // Atalho Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveNow();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [saveNow]);

    // ============================================
    // 7. BEFORE UNLOAD WARNING
    // ============================================
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                // Force save antes de sair
                debouncedAutoSave.flush();

                // Mostra warning
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty, debouncedAutoSave]);

    // ============================================
    // 8. CONFLICT DETECTION (outro usuário editou)
    // ============================================
    useEffect(() => {
        if (!serverFunnel || !isDirty) return;

        // Verifica se servidor tem versão mais nova
        const serverUpdatedAt = new Date(serverFunnel.updatedAt);
        if (lastSaveTime && serverUpdatedAt > lastSaveTime) {
            // Conflito detectado!
            toast({
                title: 'Conflito detectado',
                description: 'Outro usuário editou este funil. Recarregue para ver as mudanças.',
                variant: 'destructive',
                action: {
                    label: 'Recarregar',
                    onClick: () => {
                        setIsDirty(false);
                        setSteps(serverFunnel.steps);
                    }
                }
            });
        }
    }, [serverFunnel, isDirty, lastSaveTime]);

    // ============================================
    // 9. HELPERS
    // ============================================
    const updateBlock = useCallback((
        stepId: string,
        blockId: string,
        updates: Partial<Block>
    ) => {
        updateSteps(prev =>
            prev.map(step => {
                if (step.id !== stepId) return step;

                return {
                    ...step,
                    blocks: step.blocks.map(block =>
                        block.id === blockId
                            ? { ...block, ...updates }
                            : block
                    )
                };
            })
        );
    }, [updateSteps]);

    const updateBlockProperties = useCallback((
        stepId: string,
        blockId: string,
        propertyUpdates: Record<string, any>
    ) => {
        updateSteps(prev =>
            prev.map(step => {
                if (step.id !== stepId) return step;

                return {
                    ...step,
                    blocks: step.blocks.map(block =>
                        block.id === blockId
                            ? {
                                ...block,
                                properties: {
                                    ...block.properties,
                                    ...propertyUpdates
                                }
                            }
                            : block
                    )
                };
            })
        );
    }, [updateSteps]);

    // ============================================
    // RETURN API
    // ============================================
    return {
        // Estado
        steps,
        isLoading,
        isError,
        error,
        isDirty,
        saveStatus,
        lastSaveTime,

        // Ações
        updateSteps,
        updateBlock,
        updateBlockProperties,
        saveNow,

        // Metadata
        isSaving: saveMutation.isLoading,
        canSave: isDirty && !saveMutation.isLoading,
    };
}

// ============================================
// COMPONENTE DE UI: SaveIndicator
// ============================================

interface SaveIndicatorProps {
    status: SaveStatus;
    isDirty: boolean;
    lastSaveTime: Date | null;
    onSaveNow?: () => void;
}

export function SaveIndicator({
    status,
    isDirty,
    lastSaveTime,
    onSaveNow
}: SaveIndicatorProps) {
    const getStatusInfo = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: '⏳',
                    text: 'Salvando...',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50'
                };
            case 'saved':
                return {
                    icon: '✅',
                    text: 'Salvo',
                    color: 'text-green-600',
                    bg: 'bg-green-50'
                };
            case 'error':
                return {
                    icon: '❌',
                    text: 'Erro ao salvar',
                    color: 'text-red-600',
                    bg: 'bg-red-50'
                };
            default:
                if (isDirty) {
                    return {
                        icon: '⚠️',
                        text: 'Não salvo',
                        color: 'text-orange-600',
                        bg: 'bg-orange-50'
                    };
                }
                return {
                    icon: '✓',
                    text: 'Tudo salvo',
                    color: 'text-gray-600',
                    bg: 'bg-gray-50'
                };
        }
    };

    const statusInfo = getStatusInfo();

    const formatLastSave = () => {
        if (!lastSaveTime) return '';
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastSaveTime.getTime()) / 1000);

        if (diff < 60) return 'agora mesmo';
        if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
        return `às ${lastSaveTime.toLocaleTimeString()}`;
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusInfo.bg}`}>
            <span className="text-lg">{statusInfo.icon}</span>
            <div className="flex flex-col">
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                </span>
                {lastSaveTime && (
                    <span className="text-xs text-gray-500">
                        {formatLastSave()}
                    </span>
                )}
            </div>

            {isDirty && onSaveNow && (
                <button
                    onClick={onSaveNow}
                    className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Salvar agora
                </button>
            )}
        </div>
    );
}

// ============================================
// EXEMPLO DE USO NO EDITOR
// ============================================

export function QuizEditorWithAPI({ funnelId }: { funnelId: string }) {
    // Hook híbrido
    const {
        steps,
        isLoading,
        isDirty,
        saveStatus,
        lastSaveTime,
        updateBlockProperties,
        saveNow,
        canSave
    } = useHybridEditor({
        funnelId,
        autoSaveDelay: 2000,        // 2 segundos
        pollingInterval: 30000,     // 30 segundos
        enableAutoSave: true
    });

    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // Derivações
    const selectedStep = useMemo(
        () => steps.find(s => s.id === selectedStepId),
        [steps, selectedStepId]
    );

    const selectedBlock = useMemo(
        () => selectedStep?.blocks.find(b => b.id === selectedBlockId),
        [selectedStep, selectedBlockId]
    );

    if (isLoading) {
        return <div>Carregando editor...</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header com indicador */}
            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold">Editor de Funil</h1>

                <div className="flex items-center gap-4">
                    <SaveIndicator
                        status={saveStatus}
                        isDirty={isDirty}
                        lastSaveTime={lastSaveTime}
                        onSaveNow={canSave ? saveNow : undefined}
                    />

                    <button
                        onClick={saveNow}
                        disabled={!canSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        Salvar (Ctrl+S)
                    </button>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 flex">
                {/* Canvas */}
                <div className="flex-1 p-4">
                    {/* Renderização dos steps/blocks */}
                </div>

                {/* Painel de Propriedades */}
                <div className="w-96 border-l p-4">
                    {selectedBlock && (
                        <PropertiesPanel
                            selectedBlock={selectedBlock}
                            onUpdate={(updates) => {
                                if (!selectedStepId || !selectedBlockId) return;

                                // Atualiza com auto-save automático
                                updateBlockProperties(
                                    selectedStepId,
                                    selectedBlockId,
                                    updates
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// MOCK PARA DEMONSTRAÇÃO
// ============================================

function PropertiesPanel({ selectedBlock, onUpdate }: any) {
    return (
        <div>
            <h2>Propriedades</h2>
            <input
                value={selectedBlock.properties.text || ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
            />
        </div>
    );
}
