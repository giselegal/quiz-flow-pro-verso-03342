/**
 * 🧪 EXEMPLO DE USO - HOOKS TEMPLATE SERVICE
 * 
 * Demonstração prática de como usar os hooks React Query
 * especializados para operações do TemplateService.
 * 
 * @version 4.0.0
 */

import React from 'react';
import {
    useStep,
    useStepV4,
    useSaveStep,
    useCreateBlock,
    useUpdateBlock,
    useDeleteBlock,
    useSteps,
    usePrepareTemplate,
    useCacheStats,
    useStepWithMutation,
} from '@/hooks/useTemplateServiceMutations';
import type { Block } from '@/types/editor';

// ============================================================================
// EXEMPLO 1: CARREGAR E RENDERIZAR STEP
// ============================================================================

export function StepViewer({ stepId }: { stepId: string }) {
    const { data: blocks, isLoading, error } = useStep(stepId, 'quiz21StepsComplete');

    if (isLoading) {
        return <div className="animate-pulse">Carregando step...</div>;
    }

    if (error) {
        return <div className="text-red-500">Erro: {error.message}</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Step: {stepId}</h2>
            <p className="text-gray-600">{blocks?.length || 0} blocos carregados</p>

            <div className="grid gap-4">
                {blocks?.map((block) => (
                    <div key={block.id} className="border p-4 rounded">
                        <h3>{block.type}</h3>
                        <pre className="text-xs">{JSON.stringify(block.properties, null, 2)}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 2: EDITOR COM SALVAR
// ============================================================================

export function StepEditor({ stepId }: { stepId: string }) {
    const {
        blocks,
        isLoading,
        saveBlocks,
        isSaving
    } = useStepWithMutation(stepId, 'quiz21StepsComplete');

    const [editedBlocks, setEditedBlocks] = React.useState<Block[]>([]);

    React.useEffect(() => {
        if (blocks) {
            setEditedBlocks(blocks);
        }
    }, [blocks]);

    const handleSave = () => {
        saveBlocks(editedBlocks, {
            onSuccess: () => {
                alert('✅ Step salvo com sucesso!');
            },
            onError: (error) => {
                alert(`❌ Erro ao salvar: ${error.message}`);
            },
        });
    };

    if (isLoading) return <div>Carregando...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2>Editor: {stepId}</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>

            <div className="space-y-2">
                {editedBlocks.map((block, index) => (
                    <div key={block.id} className="border p-2">
                        <input
                            type="text"
                            value={block.properties?.text || ''}
                            onChange={(e) => {
                                const updated = [...editedBlocks];
                                updated[index] = {
                                    ...updated[index],
                                    properties: {
                                        ...updated[index].properties,
                                        text: e.target.value,
                                    },
                                };
                                setEditedBlocks(updated);
                            }}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 3: OPERAÇÕES DE BLOCO (CRUD)
// ============================================================================

export function BlockManager({ stepId }: { stepId: string }) {
    const { data: blocks, refetch } = useStep(stepId);
    const { mutate: createBlock, isPending: isCreating } = useCreateBlock(stepId);
    const { mutate: updateBlock } = useUpdateBlock(stepId, blocks?.[0]?.id || '');
    const { mutate: deleteBlock } = useDeleteBlock(stepId, blocks?.[0]?.id || '');

    const handleCreate = () => {
        createBlock(
            {
                type: 'TextBlock',
                properties: { text: 'Novo bloco' },
            },
            {
                onSuccess: () => {
                    refetch();
                    alert('✅ Bloco criado!');
                },
            }
        );
    };

    const handleUpdate = () => {
        if (!blocks?.[0]) return;

        updateBlock(
            {
                properties: {
                    ...blocks[0].properties,
                    text: 'Texto atualizado',
                },
            },
            {
                onSuccess: () => {
                    refetch();
                    alert('✅ Bloco atualizado!');
                },
            }
        );
    };

    const handleDelete = () => {
        if (!blocks?.[0]) return;

        deleteBlock(undefined, {
            onSuccess: () => {
                refetch();
                alert('✅ Bloco deletado!');
            },
        });
    };

    return (
        <div className="space-y-4">
            <h3>Gerenciar Blocos: {stepId}</h3>

            <div className="flex gap-2">
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Criar Bloco
                </button>

                <button
                    onClick={handleUpdate}
                    disabled={!blocks?.length}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Atualizar Primeiro
                </button>

                <button
                    onClick={handleDelete}
                    disabled={!blocks?.length}
                    className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                >
                    Deletar Primeiro
                </button>
            </div>

            <p className="text-gray-600">{blocks?.length || 0} blocos no step</p>
        </div>
    );
}

// ============================================================================
// EXEMPLO 4: LISTAR TODOS OS STEPS
// ============================================================================

export function StepsList() {
    const { data: steps, isLoading } = useSteps('quiz21StepsComplete');

    if (isLoading) return <div>Carregando lista...</div>;

    return (
        <div className="space-y-2">
            <h3 className="text-xl font-bold">21 Steps do Quiz</h3>

            <div className="grid gap-2">
                {steps?.map((step) => (
                    <div key={step.id} className="border p-3 rounded hover:bg-gray-50">
                        <div className="flex justify-between">
                            <span className="font-medium">{step.name}</span>
                            <span className="text-gray-500">{step.blocksCount} blocos</span>
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 5: PREPARAR TEMPLATE
// ============================================================================

export function TemplateInitializer({ templateId }: { templateId: string }) {
    const { isLoading } = usePrepareTemplate(templateId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
                    <p className="text-gray-600">Preparando template...</p>
                    <p className="text-sm text-gray-500">Detectando steps automaticamente</p>
                </div>
            </div>
        );
    }

    return <div>✅ Template pronto!</div>;
}

// ============================================================================
// EXEMPLO 6: MONITOR DE CACHE
// ============================================================================

export function CacheMonitor() {
    const { data: stats } = useCacheStats();

    if (!stats) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4">
            <h4 className="font-bold mb-2">📊 Cache Stats</h4>

            <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Hit Rate:</span>
                    <span className="font-mono font-bold text-green-600">
                        {stats.cacheHitRate}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Steps Loaded:</span>
                    <span className="font-mono">{stats.stepsLoadedInMemory}</span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-mono">{stats.pendingLoads}</span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Avg Load:</span>
                    <span className="font-mono">{stats.avgLoadTimeMs.toFixed(0)}ms</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 7: PÁGINA COMPLETA DO EDITOR
// ============================================================================

export function EditorPage({ stepId = 'step-01' }: { stepId?: string }) {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-12 gap-4">
                {/* Sidebar: Lista de Steps */}
                <div className="col-span-3">
                    <StepsList />
                </div>

                {/* Main: Editor */}
                <div className="col-span-9">
                    <StepEditor stepId={stepId} />

                    <div className="mt-8">
                        <BlockManager stepId={stepId} />
                    </div>
                </div>
            </div>

            {/* Monitor de Cache */}
            <CacheMonitor />
        </div>
    );
}

export default EditorPage;
