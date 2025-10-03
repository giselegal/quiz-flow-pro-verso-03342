// =============================================================
// ModernUnifiedEditor - Editor Unificado com FunnelEditingFacade
// Renderiza QuizFunnelEditor integrado com sistema de persistência unificado
// =============================================================
import React, { Suspense, useMemo, createContext, useContext, useEffect, useRef, useState } from 'react';
import { QuizFunnelEditingFacade, type IFunnelEditingFacade, type FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import { resolveAdapter, applySnapshotAndPersist } from '@/editor/adapters/FunnelAdapterRegistry';
import { useUnifiedCRUDOptional } from '@/context/UnifiedCRUDProvider';
import { useFunnelPublication } from '@/hooks/useFunnelPublication';

export interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    className?: string;
}

const QuizFunnelEditor = React.lazy(() => import('../../components/editor/quiz/QuizFunnelEditor'));
// Provider de blocos do quiz
import { BlockRegistryProvider, ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock } from '@/runtime/quiz/blocks/BlockRegistry';


// ============================================
// Contexto da Facade (fase de integração)
// ============================================
const FunnelFacadeContext = createContext<IFunnelEditingFacade | null>(null);
export const useFunnelFacade = () => {
    const ctx = useContext(FunnelFacadeContext);
    if (!ctx) throw new Error('useFunnelFacade deve ser usado dentro de <FunnelFacadeContext.Provider>');
    return ctx;
};
// Versão opcional (uso em componentes que podem renderizar antes da fachada existir)
export const useOptionalFunnelFacade = () => useContext(FunnelFacadeContext);

// buildInitialSnapshot agora via adapter registry
const buildInitialSnapshot = (crud: ReturnType<typeof useUnifiedCRUDOptional>): { snapshot: FunnelSnapshot; adapterType: string } => {
    const { adapter, snapshot } = resolveAdapter(crud?.currentFunnel || null);
    return { snapshot, adapterType: adapter.type };
};

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    const crud = useUnifiedCRUDOptional();
    // Criar facade; recria se trocar de funil
    const facade = useMemo(() => {
        if (!crud) return null;
        const { snapshot } = buildInitialSnapshot(crud);
        const persist = async (snap: FunnelSnapshot) => {
            if (!crud.currentFunnel) return;
            // Usar adapter resolvido novamente (garantir consistência com tipo atual)
            const { adapter } = resolveAdapter(crud.currentFunnel);
            const updated = adapter.applySnapshot(snap, crud.currentFunnel);
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);
        };
        const base = new QuizFunnelEditingFacade(snapshot, persist);
        // Decorator para adicionar método publish padronizado que emite eventos (usa botão/hook externo)
        (base as any).publish = async ({ ensureSaved = true } = {}) => {
            const startedAt = Date.now();
            try { (base as any).emit && (base as any).emit('publish/start', { timestamp: startedAt }); } catch { }
            try {
                if (ensureSaved && base.isDirty()) {
                    await base.save();
                }
                // Publicação real é disparada externamente (hook); aqui apenas marca sucesso imediato
                const end = Date.now();
                try { (base as any).emit && (base as any).emit('publish/success', { timestamp: end, duration: end - startedAt }); } catch { }
            } catch (err: any) {
                const end = Date.now();
                try { (base as any).emit && (base as any).emit('publish/error', { timestamp: end, error: String(err) }); } catch { }
                throw err;
            }
        };
        return base;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crud?.currentFunnel?.id]);

    // ================= Autosave & Logging Básico =================
    const autosaveTimerRef = useRef<number | null>(null);
    useEffect(() => {
        if (!facade) return;
        const dispose: Array<() => void> = [];
        const log = (label: string, payload: any) => {
            // Logs estruturados (podemos trocar depois por instrumentation real)
            // eslint-disable-next-line no-console
            console.log(`[Facade:${label}]`, payload);
        };
        dispose.push(facade.on('steps/changed', p => log('steps', p)));
        dispose.push(facade.on('blocks/changed', p => log('blocks', p)));
        dispose.push(facade.on('step/selected', p => log('select', p)));
        dispose.push(facade.on('save/start', p => log('save/start', p)));
        dispose.push(facade.on('save/success', p => log('save/success', p)));
        dispose.push(facade.on('save/error', p => log('save/error', p)));
        dispose.push(facade.on('dirty/changed', p => {
            log('dirty', p);
            if (p.dirty) {
                if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
                autosaveTimerRef.current = window.setTimeout(() => {
                    // autosave placeholder (fase 1) - apenas chama facade.save()
                    facade.save().catch(err => console.warn('[Facade autosave error]', err));
                }, 5000);
            } else if (!p.dirty && autosaveTimerRef.current) {
                window.clearTimeout(autosaveTimerRef.current);
                autosaveTimerRef.current = null;
            }
        }));
        dispose.push(facade.on('publish/start', p => log('publish/start', p)));
        dispose.push(facade.on('publish/success', p => log('publish/success', p)));
        dispose.push(facade.on('publish/error', p => log('publish/error', p)));
        return () => {
            dispose.forEach(fn => fn());
            if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
        };
    }, [facade]);

    return (
        <div className={`flex flex-col w-full h-full ${props.className || ''}`}>
            <div className="flex-1 min-h-0">
                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                    {!crud ? (
                        <div className="p-6 text-sm text-red-600" data-testid="missing-crud-provider">
                            ⚠️ UnifiedCRUDProvider ausente. Envolva <code>ModernUnifiedEditor</code> com <code>&lt;UnifiedCRUDProvider&gt;</code>.
                        </div>
                    ) : facade ? (
                        <FunnelFacadeContext.Provider value={facade}>
                            <BlockRegistryProvider definitions={[ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock]}>
                                <QuizFunnelEditor funnelId={props.funnelId} templateId={props.templateId} />
                            </BlockRegistryProvider>
                        </FunnelFacadeContext.Provider>
                    ) : null}
                </Suspense>
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;
