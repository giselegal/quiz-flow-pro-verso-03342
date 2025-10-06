// =============================================================
// ModernUnifiedEditor - Editor Unificado com Sistema Modular Integrado
// Combina FunnelEditingFacade + Sistema Modular (componentes modulares, drag & drop, Chakra UI)
// Implementa a arquitetura solicitada: "cada etapa composta por componentes modulares, independentes e editáveis"
// =============================================================
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { QuizFunnelEditingFacade, type FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import { resolveAdapter } from '@/editor/adapters/FunnelAdapterRegistry';
import { useUnifiedCRUDOptional } from '@/context/UnifiedCRUDProvider';
import '../../components/editor/quiz/QuizEditorStyles.css';
import { FunnelFacadeContext, useFunnelFacade, useOptionalFunnelFacade } from '@/editor/facade/FunnelFacadeContext';
import { FeatureFlagManager } from '@/utils/FeatureFlagManager';
import QuizFunnelEditorWYSIWYG from '@/components/editor/quiz/QuizFunnelEditorWYSIWYG';

export interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    className?: string;
}

// 🎯 SISTEMA MODULAR INTEGRADO - Componentes modulares, independentes e editáveis
import { exampleFunnel } from '../../components/editor/modular/ModularEditorExample';
// Provider de blocos do quiz
import { BlockRegistryProvider, ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock } from '@/runtime/quiz/blocks/BlockRegistry';
// Context do sistema modular
import { QuizEditorProvider } from '@/context/QuizEditorContext';
// ✅ NOVO: Editor com componentes editáveis modulares
// 🔧 STABLE: Editor estável sem dependências externas problemáticas
import StableEditableStepsEditor from '../../components/editor/modular/StableEditableStepsEditor';


export { useFunnelFacade, useOptionalFunnelFacade };

// buildInitialSnapshot agora via adapter registry
const buildInitialSnapshot = (crud: ReturnType<typeof useUnifiedCRUDOptional>): { snapshot: FunnelSnapshot; adapterType: string } => {
    const { adapter, snapshot } = resolveAdapter(crud?.currentFunnel || null);
    return { snapshot, adapterType: adapter.type };
};

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    const crud = useUnifiedCRUDOptional();
    const [flagsVersion, setFlagsVersion] = useState(0);

    useEffect(() => {
        const handleFlagUpdate = () => setFlagsVersion(prev => prev + 1);
        const handleFeatureEvent = () => handleFlagUpdate();
        const handleStorage = (event: StorageEvent) => {
            if (!event.key || event.key.startsWith('flag_')) {
                handleFlagUpdate();
            }
        };
        window.addEventListener('feature-flags:update', handleFeatureEvent);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('feature-flags:update', handleFeatureEvent);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const shouldUseFacadeEditor = useMemo(() => {
        // 🚨 FORÇADO TEMPORARIAMENTE - SEMPRE USAR EDITOR NOVO
        const result = true; // FORÇADO!
        
        const manager = FeatureFlagManager.getInstance();
        const force = manager.shouldForceUnifiedInEditor();
        const facade = manager.shouldEnableUnifiedEditorFacade();

        // 🐛 DEBUG: Ver valores das flags
        console.log('🎛️ [ModernUnifiedEditor] Feature Flags (FORÇADO=true):', {
            FORCADO_MANUAL: true,
            forceUnified: force,
            enableFacade: facade,
            shouldUseFacade: result,
            env_FORCE: import.meta.env.VITE_FORCE_UNIFIED_EDITOR,
            env_FACADE: import.meta.env.VITE_ENABLE_UNIFIED_EDITOR_FACADE,
            mode: import.meta.env.MODE
        });

        return result;
    }, [flagsVersion]);

    // Criar facade; recria se trocar de funil ou quando feature flag muda
    const facade = useMemo(() => {
        if (!crud || !shouldUseFacadeEditor) return null;
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
    }, [crud?.currentFunnel?.id, shouldUseFacadeEditor]);

    // ================= Autosave & Logging Básico =================
    const autosaveTimerRef = useRef<number | null>(null);
    useEffect(() => {
        if (!facade || !shouldUseFacadeEditor) return;
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
    }, [facade, shouldUseFacadeEditor]);

    return (
        <div className={`quiz-editor-container flex flex-col w-full h-full ${props.className || ''}`}>
            {/* 🐛 DEBUG: Indicador visual */}
            <div style={{
                position: 'fixed',
                top: 10,
                right: 10,
                padding: '8px 12px',
                background: shouldUseFacadeEditor ? '#22c55e' : '#ef4444',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 9999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
                {shouldUseFacadeEditor ? '✅ FACADE ATIVO' : '❌ EDITOR ANTIGO'}
            </div>

            <div className="flex-1 min-h-0">
                {!crud ? (
                    <div className="p-6 text-sm text-red-600" data-testid="missing-crud-provider">
                        ⚠️ UnifiedCRUDProvider ausente. Envolva <code>ModernUnifiedEditor</code> com <code>&lt;UnifiedCRUDProvider&gt;</code>.
                    </div>
                ) : shouldUseFacadeEditor ? (
                    facade ? (
                        <FunnelFacadeContext.Provider value={facade}>
                            <QuizFunnelEditorWYSIWYG funnelId={props.funnelId} templateId={props.templateId} />
                        </FunnelFacadeContext.Provider>
                    ) : (
                        <div className="p-4 text-sm text-muted-foreground">Carregando editor unificado...</div>
                    )
                ) : (
                    <QuizEditorProvider initialFunnel={exampleFunnel}>
                        <BlockRegistryProvider definitions={[ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock]}>
                            <div data-testid="quiz-editor-modular-container">
                                {/* 🔧 EDITOR SIMPLES - SEM DEPENDÊNCIAS PROBLEMÁTICAS */}
                                <StableEditableStepsEditor />
                            </div>
                        </BlockRegistryProvider>
                    </QuizEditorProvider>
                )}
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;
