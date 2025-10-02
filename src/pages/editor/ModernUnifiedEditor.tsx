// =============================================================
// ModernUnifiedEditor (Pivot Wrapper Limpo)
// Default => QuizFunnelEditor | ?legacy=1 => ModernUnifiedEditor.legacy
// Pronto para futura injeção da FunnelEditingFacade
// =============================================================
import React, { Suspense, useMemo, createContext, useContext, useEffect, useRef, useState } from 'react';
import { QuizFunnelEditingFacade, type IFunnelEditingFacade, type FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import { resolveAdapter, applySnapshotAndPersist } from '@/editor/adapters/FunnelAdapterRegistry';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { useFunnelPublication } from '@/hooks/useFunnelPublication';

export interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    className?: string;
}

const QuizFunnelEditor = React.lazy(() => import('../../components/editor/quiz/QuizFunnelEditor'));
const LegacyModernUnifiedEditor = React.lazy(() => import('./ModernUnifiedEditor.legacy'));

const TransitionBanner: React.FC<{ isLegacy: boolean }> = ({ isLegacy }) => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    const toggleUrl = (wantLegacy: boolean) => {
        const p = new URLSearchParams(params);
        if (wantLegacy) p.set('legacy', '1'); else p.delete('legacy');
        const qs = p.toString();
        return qs ? `${path}?${qs}` : path;
    };
    return (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-3 py-1 text-xs text-amber-800 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
                <strong className="font-medium">Pivot ativo:</strong>
                <span>{isLegacy ? 'Legacy ModernUnifiedEditor' : 'QuizFunnelEditor (novo padrão)'}</span>
                <a href={toggleUrl(!isLegacy)} className="underline hover:opacity-80">{isLegacy ? 'Ir para novo' : 'Voltar legacy'}</a>
            </div>
            {!isLegacy && <PublishIntegratedButton />}
        </div>
    );
};

// ============================================
// Botão de Publicação Integrado (usa hook real e eventos da fachada)
const PublishIntegratedButton: React.FC = () => {
    const facade = useOptionalFunnelFacade();
    const crud = useUnifiedCRUD();
    const funnelId = crud.currentFunnel?.id;
    const { publishFunnel, isPublishing, getPublicationStatus } = useFunnelPublication(funnelId || 'unknown');
    const status = getPublicationStatus();
    if (!facade || !funnelId) return null;
    const labelByStatus: Record<string, string> = {
        draft: 'Publicar',
        published: 'Atualizar',
        error: 'Tentar novamente'
    };
    const handlePublish = async () => {
        if (isPublishing) return;
        const startedAt = Date.now();
        // Emit publish/start via facade (se suportar)
        try {
            (facade as any).emit && (facade as any).emit('publish/start', { timestamp: startedAt });
        } catch { }
        try {
            if (facade.isDirty()) {
                await facade.save();
            }
            await publishFunnel();
            const end = Date.now();
            try { (facade as any).emit && (facade as any).emit('publish/success', { timestamp: end, duration: end - startedAt }); } catch { }
        } catch (err: any) {
            const end = Date.now();
            try { (facade as any).emit && (facade as any).emit('publish/error', { timestamp: end, error: String(err) }); } catch { }
            // eslint-disable-next-line no-console
            console.error('[PublishIntegrated:error]', err);
        }
    };
    return (
        <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-2 py-1 rounded border text-amber-900 bg-amber-100 hover:bg-amber-200 transition text-[11px] font-medium flex items-center gap-1 ${isPublishing ? 'opacity-60 cursor-not-allowed' : ''}`}
            title="Publicar"
        >
            {isPublishing ? 'Publicando...' : labelByStatus[status] || 'Publicar'}
        </button>
    );
};

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
const buildInitialSnapshot = (crud: ReturnType<typeof useUnifiedCRUD>): { snapshot: FunnelSnapshot; adapterType: string } => {
    const { adapter, snapshot } = resolveAdapter(crud.currentFunnel);
    return { snapshot, adapterType: adapter.type };
};

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    const isLegacy = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return new URLSearchParams(window.location.search).get('legacy') === '1';
    }, []);
    const crud = useUnifiedCRUD();
    // Criar facade apenas quando não legacy; recria se trocar de funil
    const facade = useMemo(() => {
        if (isLegacy) return null;
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
    }, [isLegacy, crud.currentFunnel?.id]);

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
            <TransitionBanner isLegacy={isLegacy} />
            <div className="flex-1 min-h-0">
                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                    {isLegacy ? (
                        <LegacyModernUnifiedEditor {...props} />
                    ) : facade ? (
                        <FunnelFacadeContext.Provider value={facade}>
                            <QuizFunnelEditor funnelId={props.funnelId} templateId={props.templateId} />
                        </FunnelFacadeContext.Provider>
                    ) : null}
                </Suspense>
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;
