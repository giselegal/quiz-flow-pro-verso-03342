/**
 * (LEGACY) MODERN UNIFIED EDITOR - Implementação original completa
 * Mantido temporariamente para rollback durante pivot ao QuizFunnelEditor direto.
 */
import React, { useState, useCallback, Suspense, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Layout, Brain, Settings, Target,
    Component, Crown, Eye, CheckCircle, Activity
} from 'lucide-react';
import { PublicationSettingsButton } from '@/components/editor/publication/PublicationButton';
import EditorNoCodePanel from '@/components/editor/EditorNoCodePanel';
import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { useNotification } from '@/components/ui/Notification';
import { UnifiedCRUDProvider, useUnifiedCRUD } from '@/contexts';
import useEditorBootstrap from '@/hooks/editor/useEditorBootstrap';
import useOperationsManager from '@/hooks/editor/useOperationsManager';
import EditorBootstrapProgress from '@/components/editor/EditorBootstrapProgress';
import OperationsPanel from '@/components/editor/OperationsPanel';
import { editorEvents } from '@/events/editorEvents';
import LazyBoundary from '@/components/common/LazyBoundary';
import { useUnifiedEditor } from '@/hooks/core/useUnifiedEditor';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';
import { loadFullTemplate, convertTemplateToEditorFormat } from '@/templates/registry';
import { QUIZ_STEPS } from '@/data/quizSteps';
import testCRUDOperations from '@/utils/testCRUDOperations';
import FunnelTypeDetector from '@/components/editor/FunnelTypeDetector';
const QuizFunnelEditor = React.lazy(() => import('../../components/editor/quiz/QuizFunnelEditor'));
import type { FunnelType } from '@/services/FunnelTypesRegistry';
import { StorageService } from '@/services/core/StorageService';

function convertTemplateToEditorBlocks(templateData: Record<string, any[]>): any[] {
    const allBlocks: any[] = [];
    Object.entries(templateData).forEach(([stepKey, stepBlocks]) => {
        if (stepKey.startsWith('step-') && Array.isArray(stepBlocks)) {
            stepBlocks.forEach((block, index) => {
                allBlocks.push({
                    ...block,
                    id: `${stepKey}-${block.id}`,
                    stepId: stepKey,
                    stepNumber: parseInt(stepKey.replace('step-', '')),
                    order: (parseInt(stepKey.replace('step-', '')) - 1) * 100 + index
                });
            });
        }
    });
    console.log(`(LEGACY) convertTemplateToEditorBlocks chamada (template fixo removido). Steps: ${Object.keys(templateData).length}`);
    return allBlocks;
}

function createFallbackTemplate(templateId: string) {
    console.log(`⚠️ Criando template de fallback para: ${templateId}`);
    return {
        'step-1': [
            {
                id: 'fallback-welcome',
                type: 'text-inline',
                properties: {
                    content: `Template "${templateId}" não encontrado. Este é um template de demonstração.`,
                    textAlign: 'center',
                    fontSize: 'text-xl',
                    fontWeight: 'font-bold',
                    color: '#1A365D'
                },
                content: {},
                order: 0
            },
            {
                id: 'fallback-description',
                type: 'text-inline',
                properties: {
                    content: 'Por favor, verifique se o template existe ou entre em contato com o suporte.',
                    textAlign: 'center',
                    fontSize: 'text-base',
                    color: '#718096'
                },
                content: {},
                order: 1
            }
        ]
    };
}

type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless' | 'admin-integrated' | 'quiz';

interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    mode?: EditorMode;
    className?: string;
}

interface EditorState {
    mode: EditorMode;
    aiAssistantActive: boolean;
    previewMode: boolean;
    realExperienceMode: boolean;
}

const LoadingSpinner: React.FC<{ message?: string }> = ({
    message = "Carregando Editor Neural..."
}) => (
    <div className="flex items-center justify-center h-full min-h-[400px] bg-background">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-foreground text-lg font-medium">{message}</p>
            <Badge variant="outline" className="mt-2">Neural Editor v2.0</Badge>
        </div>
    </div>
);

interface ModernToolbarProps {
    editorState: EditorState;
    onStateChange: (updates: Partial<EditorState>) => void;
    funnelId?: string;
    mode?: EditorMode;
    adminReturnUrl?: string;
    onSave?: () => Promise<void>;
    onCreateNew?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onTestCRUD?: () => Promise<void>;
}

const ModernToolbar: React.FC<ModernToolbarProps> = ({
    editorState,
    onStateChange,
    funnelId,
    mode,
    onSave,
    onCreateNew,
    onDuplicate,
    onTestCRUD
}) => {
    const { addNotification } = useNotification();
    const ops = useOperationsManager();
    const handleSave = useCallback(async () => {
        if (!onSave) return;
        await ops.runOperation('save', async ({ setProgress }) => {
            setProgress(10, 'Preparando');
            await onSave();
            setProgress(90, 'Finalizando');
        }, { dedupe: true }).then(() => {
            addNotification('💾 Projeto salvo com sucesso!', 'success');
        }).catch(error => {
            console.error('Erro ao salvar:', error);
            addNotification('❌ Erro ao salvar projeto', 'error');
        });
    }, [onSave, addNotification, ops]);
    const handleCreateNew = useCallback(async () => {
        if (!onCreateNew) return;
        await ops.runOperation('create', async ({ setProgress }) => {
            setProgress(15, 'Inicializando');
            await onCreateNew();
        }, { dedupe: true }).then(() => {
            addNotification('🎉 Novo projeto criado!', 'success');
        }).catch(error => {
            console.error('Erro ao criar projeto:', error);
            addNotification('❌ Erro ao criar projeto', 'error');
        });
    }, [onCreateNew, addNotification, ops]);
    const handleDuplicate = useCallback(async () => {
        if (!onDuplicate || !funnelId) return;
        await ops.runOperation('duplicate', async () => {
            await onDuplicate();
        }, { dedupe: true }).then(() => {
            addNotification('📋 Projeto duplicado com sucesso!', 'success');
        }).catch(error => {
            console.error('Erro ao duplicar projeto:', error);
            addNotification('❌ Erro ao duplicar projeto', 'error');
        });
    }, [onDuplicate, addNotification, funnelId, ops]);
    const handleTestCRUD = useCallback(async () => {
        if (!onTestCRUD) return;
        await ops.runOperation('test', async () => {
            await onTestCRUD();
        }, { dedupe: true }).then(() => {
            addNotification('🧪 Testes CRUD executados - veja o console', 'info');
        }).catch(error => {
            console.error('Erro ao executar testes:', error);
            addNotification('❌ Erro nos testes CRUD', 'error');
        });
    }, [onTestCRUD, addNotification, ops]);
    const handleBackToAdmin = useCallback(() => {
        if (mode === 'admin-integrated' && funnelId) {
            UnifiedRoutingService.navigateEditorToAdmin(funnelId);
            addNotification('🔙 Retornando ao dashboard admin', 'info');
        }
    }, [mode, funnelId, addNotification]);
    const handleAIToggle = useCallback(() => {
        const newState = !editorState.aiAssistantActive;
        onStateChange({ aiAssistantActive: newState });
        addNotification(
            newState ? '🧠 Assistente IA ativado' : '🧠 Assistente IA desativado',
            'info'
        );
    }, [editorState.aiAssistantActive, onStateChange, addNotification]);
    return (
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Editor Neural</span>
                    <Badge variant="secondary" className="text-xs">v2.0 UNIFIED</Badge>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Tabs value={editorState.mode} onValueChange={(mode) =>
                    onStateChange({ mode: mode as EditorMode })
                }>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="visual" className="text-xs"><Layout className="w-4 h-4 mr-1" />Visual</TabsTrigger>
                        <TabsTrigger value="builder" className="text-xs"><Component className="w-4 h-4 mr-1" />Builder</TabsTrigger>
                        <TabsTrigger value="funnel" className="text-xs"><Target className="w-4 h-4 mr-1" />Funnel</TabsTrigger>
                        <TabsTrigger value="headless" className="text-xs"><Settings className="w-4 h-4 mr-1" />Headless</TabsTrigger>
                        <TabsTrigger value="quiz" className="text-xs"><Target className="w-4 h-4 mr-1" />Quiz</TabsTrigger>
                    </TabsList>
                </Tabs>
                {funnelId && (<Badge variant="outline" className="text-xs">ID: {funnelId}</Badge>)}
            </div>
            <div className="flex items-center gap-2">
                {mode === 'admin-integrated' && (
                    <>
                        <Button variant="outline" size="sm" onClick={handleBackToAdmin} disabled={ops.isRunning('save') || ops.isRunning('create')} className="border-blue-200 text-blue-700 hover:bg-blue-50">🔙 Voltar ao Admin</Button>
                        <Separator orientation="vertical" className="h-4" />
                    </>
                )}
                <Button variant="secondary" size="sm" onClick={handleCreateNew} disabled={ops.isRunning('create')}><Target className="w-4 h-4 mr-2" />{ops.isRunning('create') ? 'Criando...' : 'Novo'}</Button>
                {funnelId && (
                    <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={ops.isRunning('duplicate')}><Component className="w-4 h-4 mr-2" />{ops.isRunning('duplicate') ? 'Duplicando...' : 'Duplicar'}</Button>
                )}
                <Separator orientation="vertical" className="h-4" />
                <Button variant="outline" size="sm" onClick={handleTestCRUD} disabled={ops.isRunning('test')} title="Executar testes CRUD (Development)">🧪 Test</Button>
                <Separator orientation="vertical" className="h-4" />
                <Button variant={editorState.aiAssistantActive ? "default" : "outline"} size="sm" onClick={handleAIToggle} disabled={ops.isRunning('save') || ops.isRunning('create') || ops.isRunning('duplicate')}><Brain className="w-4 h-4 mr-2" />IA</Button>
                <Button variant="outline" size="sm" onClick={() => onStateChange({ previewMode: !editorState.previewMode })} disabled={ops.isRunning('save')}><Eye className="w-4 h-4 mr-2" />Preview</Button>
                <Button variant={editorState.realExperienceMode ? "default" : "outline"} size="sm" onClick={() => { const newState = !editorState.realExperienceMode; onStateChange({ realExperienceMode: newState }); }} disabled={ops.isRunning('save') || ops.isRunning('create')} title="Ativar experiência real com QuizOrchestrator" className={editorState.realExperienceMode ? "bg-green-600 hover:bg-green-700" : ""}><Target className="w-4 h-4 mr-2" />{editorState.realExperienceMode ? "Real ✓" : "Real"}</Button>
                <Separator orientation="vertical" className="h-4" />
                <EditorNoCodePanel className="gap-2" />
                {funnelId && (<PublicationSettingsButton funnelId={funnelId} funnelTitle={`Funil ${funnelId}`} className="gap-2" />)}
                <Button variant="default" size="sm" onClick={handleSave} disabled={ops.isRunning('save') || !onSave}><CheckCircle className="w-4 h-4 mr-2" />{ops.isRunning('save') ? 'Salvando...' : 'Salvar'}</Button>
            </div>
        </div>
    );
};

const UnifiedEditorCore: React.FC<ModernUnifiedEditorProps> = ({ funnelId, templateId, mode = 'visual', className = '' }) => {
    const bootstrap = useEditorBootstrap();
    const extractedInfo = useMemo(() => ({
        funnelId: bootstrap.params.funnelId,
        templateId: bootstrap.params.templateId,
        type: bootstrap.params.funnelId ? 'funnel' : (bootstrap.params.templateId ? 'template' : 'auto')
    }), [bootstrap.params.funnelId, bootstrap.params.templateId]);
    const ops = useOperationsManager();
    const isLoadingTemplate = bootstrap.phase !== 'ready' && bootstrap.phase !== 'error';
    const templateError = bootstrap.error?.message || null;
    const crudContext = useUnifiedCRUD();
    const unifiedEditor = useUnifiedEditor();
    const urlModeParam = React.useMemo(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const raw = params.get('mode');
            const allowed: EditorMode[] = ['visual', 'builder', 'funnel', 'headless', 'admin-integrated', 'quiz'];
            if (raw && allowed.includes(raw as EditorMode)) {
                return raw as EditorMode;
            }
        } catch { }
        return null;
    }, []);
    const [editorState, setEditorState] = useState<EditorState>({
        mode: 'quiz',
        aiAssistantActive: false,
        previewMode: false,
        realExperienceMode: false
    });
    const [detectedFunnelType, setDetectedFunnelType] = useState<FunnelType | null>(null);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [isDetectingType, setIsDetectingType] = useState(false);
    const [showOpsPanel, setShowOpsPanel] = useState<boolean>(() => { if (typeof window === 'undefined') return false; try { return StorageService.safeGetString('editor.showOpsPanel') === '1'; } catch { return false; } });
    useEffect(() => { try { StorageService.safeSetString('editor.showOpsPanel', showOpsPanel ? '1' : '0'); } catch { } }, [showOpsPanel]);
    const autosaveTimerRef = React.useRef<number | null>(null);
    useEffect(() => {
        if (extractedInfo.funnelId && !detectedFunnelType) { setIsDetectingType(true); }
    }, [extractedInfo.funnelId, detectedFunnelType]);
    useEffect(() => {
        const disconnect = EditorDashboardSyncService.connectEditor({
            funnelId: extractedInfo.funnelId,
            refresh: () => { }
        });
        return disconnect;
    }, [extractedInfo.funnelId]);
    const handleStateChange = useCallback((updates: Partial<EditorState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    }, []);
    const handleSave = useCallback(async () => { await crudContext.saveFunnel(); }, [crudContext]);
    const handleCreateNew = useCallback(async () => { await crudContext.createFunnel('Novo Funil', { templateId }); }, [crudContext, templateId]);
    const handleDuplicate = useCallback(async () => {
        if (!funnelId && !crudContext.currentFunnel?.id) { throw new Error('ID do funil necessário para duplicar'); }
        const targetId = funnelId || crudContext.currentFunnel!.id; await crudContext.duplicateFunnel(targetId, 'Cópia de Funil');
    }, [funnelId, crudContext]);
    const handleTestCRUD = useCallback(async () => { try { await testCRUDOperations(); } catch { } }, []);
    useEffect(() => { if (crudContext.currentFunnel && !unifiedEditor.funnel) { unifiedEditor.loadFunnel(crudContext.currentFunnel.id).catch(console.error); } }, [crudContext.currentFunnel, unifiedEditor]);
    useEffect(() => {
        if (!crudContext.currentFunnel) return; if (!unifiedEditor.isDirty) return; if (bootstrap.phase !== 'ready') return;
        if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = window.setTimeout(() => {
            editorEvents.emit('EDITOR_AUTOSAVE_START', { dirty: true });
            ops.runOperation('autosave', async ({ setProgress }) => { setProgress(10, 'Validando'); await crudContext.saveFunnel(); setProgress(90, 'Finalizando'); }, { dedupe: true })
                .then(() => { editorEvents.emit('EDITOR_AUTOSAVE_SUCCESS', { savedAt: Date.now() }); })
                .catch(err => { editorEvents.emit('EDITOR_AUTOSAVE_ERROR', { error: String(err) }); });
        }, 5000);
        return () => { if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current); };
    }, [unifiedEditor.isDirty, crudContext.currentFunnel, bootstrap.phase]);
    if (isLoadingTemplate) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <ModernToolbar editorState={editorState} onStateChange={handleStateChange} funnelId={undefined} mode={editorState.mode} onSave={async () => { }} onCreateNew={async () => { }} />
                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                    <EditorBootstrapProgress step={bootstrap.progress.step} total={bootstrap.progress.total} label={bootstrap.progress.label} phase={bootstrap.phase} />
                    <LoadingSpinner message="Preparando ambiente" />
                </div>
            </div>
        );
    }
    if (templateError) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-4">❌ Erro ao carregar template</div>
                        <p className="text-muted-foreground">{templateError}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">Tentar novamente</Button>
                    </div>
                </div>
            </div>
        );
    }
    if (!extractedInfo.funnelId && !crudContext.currentFunnel?.id) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <ModernToolbar editorState={editorState} onStateChange={(u) => setEditorState(prev => ({ ...prev, ...u }))} funnelId={undefined} mode={editorState.mode} onSave={async () => { }} onCreateNew={async () => { const created = await crudContext.createFunnel('Novo Funil Quiz', { templateId: 'quiz-estilo-21-steps' }); if (created?.id) { window.history.replaceState({}, '', `/editor/${created.id}?mode=quiz`); } }} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-sm p-6 border rounded-lg bg-muted/30">
                        <h2 className="text-lg font-semibold mb-2">Nenhum funil carregado</h2>
                        <p className="text-sm text-muted-foreground mb-4">Crie um novo funil de Quiz para começar a editar as etapas.</p>
                        <Button onClick={async () => { const created = await crudContext.createFunnel('Novo Funil Quiz', { templateId: 'quiz-estilo-21-steps' }); if (created?.id) { window.history.replaceState({}, '', `/editor/${created.id}?mode=quiz`); } }}>Criar Funil Quiz</Button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
            <ModernToolbar editorState={editorState} onStateChange={handleStateChange} funnelId={extractedInfo.funnelId || crudContext.currentFunnel?.id} mode={mode || editorState.mode} onSave={handleSave} onCreateNew={handleCreateNew} onDuplicate={handleDuplicate} onTestCRUD={handleTestCRUD} />
            <div className="flex-1 overflow-hidden">
                <FunnelMasterProvider funnelId={extractedInfo.funnelId || undefined} debugMode={false} enableCache={true}>
                    {extractedInfo.funnelId && (
                        <div className="p-4 border-b bg-background">
                            <Suspense fallback={<div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span>Detectando tipo...</span></div>}>
                                <FunnelTypeDetector funnelId={extractedInfo.funnelId} onFunnelLoaded={(data) => { setFunnelData(data); setIsDetectingType(false); }} onTypeDetected={(type) => { setDetectedFunnelType(type); }} />
                            </Suspense>
                            {detectedFunnelType && (
                                <div className="mt-2 p-2 bg-primary/5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{detectedFunnelType.category}</Badge>
                                        <span className="text-sm font-medium">{detectedFunnelType.name}</span>
                                        {detectedFunnelType.supportsAI && (<Brain className="w-4 h-4 text-primary" />)}
                                    </div>
                                    {detectedFunnelType.description && (<p className="text-xs text-muted-foreground mt-1">{detectedFunnelType.description}</p>)}
                                </div>
                            )}
                            {isDetectingType && (
                                <div className="mt-2 p-2 bg-muted/20 rounded-md">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span>Detectando tipo de funil...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <LazyBoundary fallback={<LoadingSpinner message={'Carregando editor de quiz...'} />}>
                        <QuizFunnelEditor key={`quiz-funnel-${extractedInfo.templateId || extractedInfo.funnelId || crudContext.currentFunnel?.id || 'new'}`} templateId={extractedInfo.templateId || undefined} funnelId={extractedInfo.funnelId || crudContext.currentFunnel?.id} />
                    </LazyBoundary>
                </FunnelMasterProvider>
            </div>
            <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>Editor ativo: {editorState.mode}</span>
                    {unifiedEditor.isLoading && (<><Separator orientation="vertical" className="h-3" /><span>⏳ Carregando...</span></>)}
                    {unifiedEditor.isDirty && (<><Separator orientation="vertical" className="h-3" /><span>✏️ Modificado</span></>)}
                    {unifiedEditor.lastSaved && (<><Separator orientation="vertical" className="h-3" /><span>💾 Salvo: {new Date(unifiedEditor.lastSaved).toLocaleTimeString()}</span></>)}
                    {editorState.aiAssistantActive && (<><Separator orientation="vertical" className="h-3" /><Brain className="w-3 h-3" /><span>IA Assistente ativo</span></>)}
                    {detectedFunnelType && (<><Separator orientation="vertical" className="h-3" /><Target className="w-3 h-3" /><span>Tipo: {detectedFunnelType.name}</span></>)}
                    {funnelData && (<><Separator orientation="vertical" className="h-3" /><CheckCircle className="w-3 h-3" /><span>Dados carregados</span></>)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <button onClick={() => setShowOpsPanel(v => !v)} className="px-2 py-1 border rounded hover:bg-muted/50 transition" title="Mostrar operações">Ops {showOpsPanel ? '▼' : '▲'}</button>
                    <span>Neural Editor v2.0 - CRUD Unificado ✅ (LEGACY)</span>
                </div>
            </div>
            {showOpsPanel && (
                <div className="fixed bottom-8 right-0 top-0 w-80 shadow-lg z-40 bg-background border-l border-border">
                    <OperationsPanel statuses={ops.statuses} onClose={() => setShowOpsPanel(false)} />
                </div>
            )}
        </div>
    );
};

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    return (
        <UnifiedCRUDProvider funnelId={props.funnelId} autoLoad={true} debug={false}>
            <UnifiedEditorCore {...props} />
        </UnifiedCRUDProvider>
    );
};

export default ModernUnifiedEditor;
