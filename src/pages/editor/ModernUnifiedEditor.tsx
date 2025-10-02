// =============================================================
// ModernUnifiedEditor (Pivot Wrapper Limpo)
// Default => QuizFunnelEditor | ?legacy=1 => ModernUnifiedEditor.legacy
// Pronto para futura injeção da FunnelEditingFacade
// =============================================================
import React, { Suspense, useMemo, createContext, useContext, useEffect, useRef, useState } from 'react';
import { QuizFunnelEditingFacade, type IFunnelEditingFacade, type FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';

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
            {!isLegacy && <PublishStub />}
        </div>
    );
};

// ============================================
// Botão de Publicação (Stub Fase 1)
// - Executa save() via facade se dirty
// - Emite logs estruturados de ciclo publish
// Futuro: integrar com serviço real de publicação + status
// ============================================
const PublishStub: React.FC = () => {
    const facade = useOptionalFunnelFacade();
    const [isPublishing, setIsPublishing] = useState(false);
    if (!facade) return null;
    const handlePublish = async () => {
        if (isPublishing) return;
        setIsPublishing(true);
        const startedAt = Date.now();
        try {
            // eslint-disable-next-line no-console
            console.log('[Publish:start]', { dirty: facade.isDirty(), ts: startedAt });
            if (facade.isDirty()) {
                await facade.save();
            }
            // Simula pequena operação de validação
            await new Promise(r => setTimeout(r, 300));
            // eslint-disable-next-line no-console
            console.log('[Publish:success]', { durationMs: Date.now() - startedAt });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[Publish:error]', { error: String(err) });
        } finally {
            setIsPublishing(false);
        }
    };
    return (
        <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-2 py-1 rounded border text-amber-900 bg-amber-100 hover:bg-amber-200 transition text-[11px] font-medium flex items-center gap-1 ${isPublishing ? 'opacity-60 cursor-not-allowed' : ''}`}
            title="Publicar (stub)"
        >
            {isPublishing ? 'Publicando...' : 'Publicar (stub)'}
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

const buildInitialSnapshot = (crud: ReturnType<typeof useUnifiedCRUD>): FunnelSnapshot => {
    // Extrair steps do funil atual se existir e tiver quizSteps
    const rawSteps: any[] = (crud.currentFunnel as any)?.quizSteps || [];
    // Normalizar para FunnelStep mínimo (order = index)
    const steps = rawSteps.map((s, idx) => ({
        id: s.id || `step-${idx}`,
        title: s.title || s.questionText || s.type || `Step ${idx + 1}`,
        order: idx,
        blocks: (s.blocks || []).map((b: any) => ({ id: b.id || `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type: b.type || 'unknown', data: b.config || {} })),
        meta: { type: s.type, nextStep: s.nextStep }
    }));
    return { steps, meta: { id: crud.currentFunnel?.id, templateId: crud.currentFunnel?.templateId, updatedAt: Date.now() } };
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
        const persist = async (snapshot: FunnelSnapshot) => {
            if (!crud.currentFunnel) return; // nada para salvar
            const quizSteps = snapshot.steps.map(s => ({
                id: s.id,
                title: s.title,
                order: s.order,
                type: s.meta?.type,
                nextStep: s.meta?.nextStep,
                blocks: s.blocks.map(b => ({ id: b.id, type: b.type, config: b.data }))
            }));
            const updated = { ...crud.currentFunnel, quizSteps } as any;
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);
        };
        return new QuizFunnelEditingFacade(buildInitialSnapshot(crud), persist);
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
