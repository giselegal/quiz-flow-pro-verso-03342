// src/components/editor/StepEditorWrapper.tsx
import React, { Suspense, useMemo } from 'react';
import { SCHEMAS, migrateProps } from '@/schemas';
import { normalizeByType } from '@/utils/normalizeByType';
import { PropsToBlocksAdapter } from '@/services/editor/PropsToBlocksAdapter';

type Props = {
    selectedStep?: any;
    onUpdateSteps: (updater: (prev: any[]) => any[]) => void; // consumer should provide setSteps or similar
    pushHistory: (snap: any) => void;
    setIsDirty: (v: boolean) => void;
    steps: any[];
    toast: (opts: any) => void;
};

const JsonFallbackEditor: React.FC<{ step: any; onApply: (p: any) => void }> = ({ step, onApply }) => {
    const [json, setJson] = React.useState(() => JSON.stringify(step?.meta?.props ?? step?.props ?? {}, null, 2));
    return (
        <div className="p-3">
            <textarea className="w-full h-48 border p-2" value={json} onChange={(e) => setJson(e.target.value)} />
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => {
                        try {
                            onApply(JSON.parse(json));
                        } catch (e) {
                            alert('JSON inválido');
                        }
                    }}
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
};

const StepEditorWrapper: React.FC<Props> = ({ selectedStep, onUpdateSteps, pushHistory, setIsDirty, steps, toast }) => {
    const entry = useMemo(() => (selectedStep ? selectedStep.type : undefined), [selectedStep]);
    if (!selectedStep) return <div className="p-3 text-sm text-slate-500">Selecione uma etapa para editar</div>;

    const schema = (SCHEMAS as any)[selectedStep.type];
    const currentProps = selectedStep.meta?.props ?? selectedStep.props ?? {};

    const handleApply = async (rawProps: any) => {
        try {
            if (!schema) throw new Error(`Schema não encontrado para tipo: ${selectedStep.type}`);
            const validated = schema.parse(rawProps);
            const migrated = migrateProps(selectedStep.type, validated);
            const normalized = normalizeByType(selectedStep.type, migrated, selectedStep.id);
            const stepWithMeta = { ...selectedStep, meta: { ...(selectedStep.meta || {}), props: normalized } };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(stepWithMeta);
            pushHistory(steps);
            onUpdateSteps((prev) => prev.map((s) => (s.id === selectedStep.id ? converted : s)));
            setIsDirty(true);
            toast({ title: 'Props aplicadas', description: 'Canvas atualizado a partir das propriedades' });
        } catch (e: any) {
            console.error('Erro ao aplicar props → blocks', e);
            toast({ title: 'Erro ao aplicar props', description: e?.message || 'Falha ao aplicar propriedades', variant: 'destructive' });
        }
    };

    // Lazy mapping simples por tipo (poderia vir de um stepRegistry dedicado)
    const EditorComp = useMemo(() => {
        switch (selectedStep.type) {
            case 'transition':
            case 'transition-result':
                return React.lazy(() => import('@/components/editor/step-editors/TransitionStepEditor'));
            case 'result':
                return React.lazy(() => import('@/components/editor/step-editors/ResultStepEditor'));
            case 'offer':
                return React.lazy(() => import('@/components/editor/step-editors/OfferStepEditor'));
            default:
                return null;
        }
    }, [selectedStep.type]);

    return (
        <div>
            <div className="p-2 text-xs text-slate-500">Editando: {selectedStep.type} — {selectedStep.id}</div>
            <div className="p-3">
                {EditorComp ? (
                    <Suspense fallback={<div>Carregando editor...</div>}>
                        {/* @ts-ignore */}
                        <EditorComp step={selectedStep} props={currentProps} onApply={(patch: any) => handleApply(patch)} />
                    </Suspense>
                ) : (
                    <JsonFallbackEditor step={selectedStep} onApply={(p) => handleApply(p)} />
                )}
            </div>
        </div>
    );
};

export default StepEditorWrapper;
