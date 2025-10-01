import React, { createContext, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { mapEditorBlocksToQuizSteps } from '@/utils/mapEditorBlocksToQuizSteps';
import { useEditor } from '@/components/editor/provider-alias';

/**
 * EditorCoreProvider (V2 - Placeholder Fase 1)
 * ------------------------------------------
 * Objetivo: Centralizar futuramente stepBlocks, currentStep, seleção e operações.
 * Nesta fase inicial, apenas expõe shape mínimo para permitir migração incremental
 * sem quebrar a cadeia de composição do editor existente.
 */

export interface EditorCoreState {
    version: string;
    initialized: boolean;
    createdAt: number;
    // Espelhados (read-only nesta fase) do EditorProvider
    currentStep: number;
    totalSteps: number;
    stepKeys: string[];
    stepBlocksHash: string; // Hash leve para detectar mudanças
    selectedBlockId?: string | null;
    quizSteps?: any[]; // derivado memoizado
    stepBlocks?: Record<string, any[]>; // Fonte de verdade dos blocos (V2)
    metrics?: {
        hashCount: number;
        mapCount: number;
        lastHashDurationMs: number;
        lastMapDurationMs: number;
    };
}

interface EditorCoreContextValue {
    state: EditorCoreState;
    markInitialized(): void;
    coreActions: {
        addBlock(stepKey: string, block: any): void;
        updateBlock(stepKey: string, blockId: string, updates: Record<string, any>): void;
        removeBlock(stepKey: string, blockId: string): void;
        reorderBlocks(stepKey: string, sourceIndex: number, targetIndex: number): void;
        setCurrentStep(step: number): void;
        selectBlock(blockId: string | null): void;
    };
    getStepDiff(stepKey: string): {
        added: any[];
        removed: any[];
        updated: { before: any; after: any }[];
        stable: any[];
        version: number;
    };
}

const EditorCoreContext = createContext<EditorCoreContextValue | null>(null);

export const EditorCoreProvider: React.FC<{ children: React.ReactNode; funnelId?: string }> = ({ children }) => {
    const { state: editorState, actions: editorActions } = useEditor();
    const [initialized, setInitialized] = useState(false);
    const [hash, setHash] = useState('');
    const metricsRef = useRef({
        hashCount: 0,
        mapCount: 0,
        lastHashDurationMs: 0,
        lastMapDurationMs: 0
    });
    const [coreStepBlocks, setCoreStepBlocks] = useState<Record<string, any[]>>({});
    const [currentStepInternal, setCurrentStepInternal] = useState<number>(1);
    const [selectedBlockIdInternal, setSelectedBlockIdInternal] = useState<string | null>(null);
    const isHydratedRef = useRef(false);
    const lastExternalSigRef = useRef<string>('');

    // Hidratação inicial: copiar stepBlocks externos apenas uma vez.
    useEffect(() => {
        if (!isHydratedRef.current && editorState.stepBlocks) {
            setCoreStepBlocks(editorState.stepBlocks as any);
            setCurrentStepInternal(editorState.currentStep || 1);
            setSelectedBlockIdInternal(editorState.selectedBlockId || null);
            isHydratedRef.current = true;
        }
    }, [editorState.stepBlocks, editorState.currentStep, editorState.selectedBlockId]);

    // Bridge de sincronização: se o provider legado alterar stepBlocks externamente (fora das coreActions)
    // detectamos por assinatura simples e atualizamos o core, evitando drift.
    useEffect(() => {
        if (!editorState.stepBlocks) return;
        // Gera assinatura leve do externo
        const keys = Object.keys(editorState.stepBlocks).sort();
        const sig = keys
            .map(k => {
                const arr = (editorState.stepBlocks as any)[k] || [];
                return `${k}:${arr.length}:${arr.map((b: any) => b.id || b.type).join(',')}`;
            })
            .join('|');
        if (sig !== lastExternalSigRef.current) {
            lastExternalSigRef.current = sig;
            // Verifica divergência antes de sobrescrever
            const localKeys = Object.keys(coreStepBlocks).sort();
            const localSig = localKeys
                .map(k => {
                    const arr = (coreStepBlocks as any)[k] || [];
                    return `${k}:${arr.length}:${arr.map((b: any) => b.id || b.type).join(',')}`;
                })
                .join('|');
            if (localSig !== sig) {
                setCoreStepBlocks(editorState.stepBlocks as any);
            }
        }
        // Sync currentStep / selectedBlockId externos se divergirem e não estivermos no primeiro hydrate
        if (editorState.currentStep && editorState.currentStep !== currentStepInternal) {
            setCurrentStepInternal(editorState.currentStep);
        }
        if (editorState.selectedBlockId !== selectedBlockIdInternal) {
            setSelectedBlockIdInternal(editorState.selectedBlockId || null);
        }
        /**
         * TODO(Remover Bridge): Quando EditorProvider legado for desativado,
         * eliminar este efeito de sincronização externa e promover coreStepBlocks/currentStep/selection
         * como única fonte de verdade. Etapas:
         * 1. Garantir que nenhuma parte do app lê mais editorState.* diretamente.
         * 2. Remover chamadas de compatibilidade em coreActions.
         * 3. Expor API mais enxuta (remover __coreStepBlocks experimental).
         */
    }, [editorState.stepBlocks, coreStepBlocks]);

    /**
     * TODO(Fase 4 - Ownership): Migrar stepBlocks para estado interno do Core
     * Estratégia:
     * 1. Introduzir estado interno: const [coreStepBlocks, setCoreStepBlocks]
     * 2. Sincronizar uma única vez a partir de editorState.stepBlocks quando provider monta (se ainda não migrado)
     * 3. Redirecionar coreActions.* para operar sobre coreStepBlocks e emitir eventos/diffs
     * 4. Fornecer mecanismo de compatibilidade opcional para EditorProvider consumir diff até sua remoção
     * 5. Remover uso de editorState.stepBlocks das dependências de memo após transição
     */

    // Hash leve (não criptográfico) baseado em tamanhos e tipos — evita custo de JSON completo aqui.
    useEffect(() => {
        const t0 = performance.now?.() || Date.now();
        const source = coreStepBlocks; // agora hash baseado no estado interno
        const keys = Object.keys(source || {});
        const sig = keys
            .sort()
            .map(k => {
                const arr = (source as any)[k] || [];
                return `${k}:${arr.length}:${arr.map((b: any) => b.type).join(',')}`;
            })
            .join('|');
        // Fowler–Noll–Vo hash (FNV-1a) simples
        let h = 2166136261;
        for (let i = 0; i < sig.length; i++) {
            h ^= sig.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        setHash((h >>> 0).toString(16));
        const t1 = performance.now?.() || Date.now();
        metricsRef.current.hashCount += 1;
        metricsRef.current.lastHashDurationMs = t1 - t0;
    }, [coreStepBlocks]);

    // Derivação memoizada de quizSteps baseada no hash estrutural
    const quizSteps = useMemo(() => {
        try {
            const t0 = performance.now?.() || Date.now();
            if (!coreStepBlocks) return [];
            const mapped = mapEditorBlocksToQuizSteps(coreStepBlocks as any);
            const t1 = performance.now?.() || Date.now();
            metricsRef.current.mapCount += 1;
            metricsRef.current.lastMapDurationMs = t1 - t0;
            return mapped;
        } catch (err) {
            console.warn('[EditorCoreProvider] Falha ao derivar quizSteps', err);
            return [];
        }
    }, [hash, coreStepBlocks]);

    // Snapshot anterior para diffs (armazenado em ref para comparação)
    const previousBlocksRef = useRef<Record<string, any[]>>({});
    const versionRef = useRef(0);

    // Atualiza snapshot e versão quando coreStepBlocks muda
    useEffect(() => {
        versionRef.current += 1;
        previousBlocksRef.current = coreStepBlocks;
    }, [coreStepBlocks]);

    const getStepDiff = (stepKey: string) => {
        const prev = previousBlocksRef.current[stepKey] || [];
        const curr = coreStepBlocks[stepKey] || [];
        const prevById = new Map(prev.map(b => [b.id, b]));
        const currById = new Map(curr.map(b => [b.id, b]));
        const added: any[] = [];
        const removed: any[] = [];
        const updated: { before: any; after: any }[] = [];
        const stable: any[] = [];
        for (const c of curr) {
            if (!c.id) { stable.push(c); continue; }
            if (!prevById.has(c.id)) added.push(c);
            else {
                const before = prevById.get(c.id)!;
                // Comparação rasa
                const changed = Object.keys(c).some(k => c[k] !== before[k]);
                if (changed) updated.push({ before, after: c }); else stable.push(c);
            }
        }
        for (const p of prev) {
            if (!p.id) continue;
            if (!currById.has(p.id)) removed.push(p);
        }
        return { added, removed, updated, stable, version: versionRef.current };
    };

    const value = useMemo<EditorCoreContextValue>(() => {
        const stepKeys = Object.keys(coreStepBlocks || {}).sort();
        return {
            state: {
                version: 'core-v2-alpha',
                initialized,
                createdAt: Date.now(),
                currentStep: currentStepInternal,
                totalSteps: stepKeys.length,
                stepKeys,
                stepBlocksHash: hash,
                selectedBlockId: selectedBlockIdInternal,
                quizSteps,
                stepBlocks: coreStepBlocks,
                metrics: { ...metricsRef.current }
            },
            markInitialized: () => setInitialized(true),
            coreActions: {
                addBlock: (stepKey: string, block: any) => {
                    setCoreStepBlocks(prev => {
                        const arr = (prev[stepKey] || []).slice();
                        arr.push(block);
                        return { ...prev, [stepKey]: arr };
                    });
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.addBlock?.(stepKey, block);
                },
                setCurrentStep: (next: number) => {
                    setCurrentStepInternal(next);
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.setCurrentStep?.(next);
                },
                selectBlock: (blockId: string | null) => {
                    setSelectedBlockIdInternal(blockId);
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.setSelectedBlockId?.(blockId);
                },
                updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => {
                    setCoreStepBlocks(prev => {
                        const arr = (prev[stepKey] || []).map(b => (b.id === blockId ? { ...b, ...updates } : b));
                        return { ...prev, [stepKey]: arr };
                    });
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.updateBlock?.(stepKey, blockId, updates);
                },
                removeBlock: (stepKey: string, blockId: string) => {
                    setCoreStepBlocks(prev => {
                        const arr = (prev[stepKey] || []).filter(b => b.id !== blockId);
                        return { ...prev, [stepKey]: arr };
                    });
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.removeBlock?.(stepKey, blockId);
                },
                reorderBlocks: (stepKey: string, sourceIndex: number, targetIndex: number) => {
                    setCoreStepBlocks(prev => {
                        const arr = (prev[stepKey] || []).slice();
                        if (sourceIndex < 0 || sourceIndex >= arr.length || targetIndex < 0 || targetIndex >= arr.length) return prev;
                        const [moved] = arr.splice(sourceIndex, 1);
                        arr.splice(targetIndex, 0, moved);
                        return { ...prev, [stepKey]: arr };
                    });
                    if (!(window as any).EDITOR_CORE_NO_COMPAT) editorActions?.reorderBlocks?.(stepKey, sourceIndex, targetIndex);
                }
            },
            getStepDiff
        };
    }, [initialized, currentStepInternal, selectedBlockIdInternal, coreStepBlocks, hash, quizSteps, editorActions]);

    return (
        <EditorCoreContext.Provider value={value}>
            {/**
             * TODO (Fase 3): Substituir delegações em coreActions por implementação nativa
             * após migração completa do estado para EditorCoreProvider.
             * Segurança: chamadas são no-op se editorActions não expuser método.
             */}
            {children}
        </EditorCoreContext.Provider>
    );
};

export function useEditorCore(): EditorCoreContextValue {
    const ctx = useContext(EditorCoreContext);
    if (!ctx) throw new Error('useEditorCore deve ser usado dentro de <EditorCoreProvider>');
    return ctx;
}
