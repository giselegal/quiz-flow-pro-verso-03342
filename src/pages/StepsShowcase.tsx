import React, { useMemo, useState } from 'react';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';

type RenderMode = 'production' | 'preview' | 'editor';

const StepsShowcase: React.FC = () => {
    const [mode, setMode] = useState<RenderMode>('preview');

    // Clonar template para estado local e permitir edição no painel
    const [stepsMap, setStepsMap] = useState<Record<string, Block[]>>(() => {
        const cloned: Record<string, Block[]> = {};
        Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([k, arr]) => {
            cloned[k] = (arr || []).map((b: any) => ({
                ...b,
                properties: { ...(b.properties || {}) },
                content: { ...(b.content || {}) },
            }));
        });
        return cloned;
    });

    // Seleção atual
    const [selected, setSelected] = useState<{ stepKey: string | null; blockId: string | null }>({ stepKey: null, blockId: null });

    // Em teste, o template exporta uma versão mínima (1 bloco por etapa)
    const steps = useMemo(() => {
        const entries = Object.entries(stepsMap)
            .sort(([a], [b]) => {
                const na = parseInt(a.replace(/[^0-9]/g, '') || '0', 10);
                const nb = parseInt(b.replace(/[^0-9]/g, '') || '0', 10);
                return na - nb;
            })
            .slice(0, 21);
        return entries as Array<[string, Block[]]>;
    }, [stepsMap]);

    const selectedBlock = useMemo(() => {
        if (!selected.stepKey || !selected.blockId) return null;
        const arr = stepsMap[selected.stepKey] || [];
        return arr.find(b => b.id === selected.blockId) || null;
    }, [selected, stepsMap]);

    const updateBlock = (stepKey: string, blockId: string, updates: Record<string, any>) => {
        setStepsMap(prev => {
            const arr = prev[stepKey] || [];
            const idx = arr.findIndex(b => b.id === blockId);
            if (idx === -1) return prev;
            const current = arr[idx];
            const incomingProps = (updates as any).properties ?? updates;
            const merged: Block = {
                ...current,
                properties: { ...(current.properties || {}), ...(incomingProps || {}) },
            } as Block;
            const nextArr = [...arr];
            nextArr[idx] = merged;
            return { ...prev, [stepKey]: nextArr };
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Showcase: 21 Etapas</h1>
                        <p className="text-sm text-muted-foreground">
                            Renderização completa das etapas usando o UniversalBlockRenderer
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Modo:</label>
                        <select
                            aria-label="Modo de renderização"
                            className="rounded border px-2 py-1 text-sm"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as RenderMode)}
                        >
                            <option value="production">production</option>
                            <option value="preview">preview</option>
                            <option value="editor">editor</option>
                        </select>
                    </div>
                </div>

                {/* Grid principal: canvas à esquerda, painel de propriedades à direita */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-10">
                        {steps.map(([stepId, blocks], idx) => {
                            const stepNumber = idx + 1;
                            return (
                                <section key={stepId} aria-label={`Etapa ${stepNumber}`} className="rounded-lg border bg-white p-4 shadow-sm">
                                    <header className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Etapa {stepNumber}</h2>
                                        <span className="text-xs text-muted-foreground">{stepId}</span>
                                    </header>
                                    <div className="space-y-4">
                                        {blocks && blocks.length > 0 ? (
                                            blocks.map((block) => {
                                                const isSelected = selected.blockId === block.id;
                                                return (
                                                    <div
                                                        key={block.id}
                                                        data-testid="block-item"
                                                        className={`rounded-md border transition-colors ${isSelected ? 'border-[#B89B7A] ring-1 ring-[#B89B7A]' : 'border-transparent hover:border-gray-200'}`}
                                                        onClick={() => setSelected({ stepKey: stepId, blockId: block.id })}
                                                    >
                                                        <UniversalBlockRenderer
                                                            block={block}
                                                            mode={mode}
                                                            isSelected={isSelected}
                                                            onClick={() => setSelected({ stepKey: stepId, blockId: block.id })}
                                                            onPropertyChange={(key, value) => updateBlock(stepId, block.id, { [key]: value })}
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
                                                Sem blocos configurados para esta etapa.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                    <aside className="lg:col-span-1">
                        <PropertiesPanel
                            selectedBlock={selectedBlock ? { ...selectedBlock, properties: selectedBlock.properties || {} } as any : null}
                            onUpdate={(updates) => {
                                if (selected.stepKey && selected.blockId) {
                                    updateBlock(selected.stepKey, selected.blockId, updates as any);
                                }
                            }}
                            onClose={() => setSelected({ stepKey: null, blockId: null })}
                            onDelete={() => {
                                if (!selected.stepKey || !selected.blockId) return;
                                setStepsMap(prev => {
                                    const arr = prev[selected.stepKey!] || [];
                                    const next = arr.filter(b => b.id !== selected.blockId);
                                    return { ...prev, [selected.stepKey!]: next };
                                });
                                setSelected({ stepKey: null, blockId: null });
                            }}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default StepsShowcase;
