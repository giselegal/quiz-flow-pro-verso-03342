/**
 * 🎯 Modern Quiz Editor - Componente Principal
 * 
 * Editor moderno com arquitetura limpa:
 * - 4 colunas: Steps | Library | Canvas | Properties
 * - Zustand + Immer para estado
 * - dnd-kit para drag & drop
 * - Integração com cálculos
 * 
 * 🆕 PHASE 1: Added performance monitoring and memory leak detection
 * 🆕 PHASE 2: Added analytics sidebar integration
 * 🆕 PHASE 3: Real-time collaboration with Supabase Realtime
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { EditorLayout } from './layout/EditorLayout';
import { useQuizStore } from './store/quizStore';
import { useEditorStore } from './store/editorStore';
import { usePersistence, useAutoSave } from './hooks/usePersistence';
import { useSupabasePresence } from './hooks/useSupabasePresence';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useBlockClipboard } from './hooks/useBlockClipboard';
import { SaveStatusIndicator } from './components/SaveStatusIndicator';
import { PerformanceDebugger } from './components/PerformanceDebugger';
import { AnalyticsSidebar } from './components/AnalyticsSidebar';
import { DevTools } from './components/DevTools';
import { EditorModeToggle } from './components/EditorModeToggle';
import { CollaboratorAvatars } from './components/CollaboratorAvatars';
import { SaveToLibraryDialog } from './components/SaveToLibraryDialog';
import { CommandPalette } from './components/CommandPalette';
import { GlobalSearch } from './components/GlobalSearch';
import { PublishButton } from './components/PublishButton';
import { DuplicateFunnelButton } from './components/DuplicateFunnelButton';
import { ExportTemplateButton } from '../ExportTemplateButton';
import { ImportTemplateButton } from '../ImportTemplateButton';
import { usePerformanceMonitor, useMemoryLeakDetector } from '@/hooks/usePerformanceMonitor';
import { useAuthStore } from '@/contexts/store/authStore';
import { Activity, PanelLeftClose, PanelLeft, Command } from 'lucide-react';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';
import { normalizeQuizFormat } from './utils/quizAdapter';
import { validateTemplateFormat, formatValidationReport } from './utils/templateValidator';

export interface ModernQuizEditorProps {
    /** Quiz inicial para carregar no editor */
    initialQuiz?: QuizSchema;
    /** ID do quiz (para update) */
    quizId?: string;
    /** Callback quando o quiz é salvo */
    onSave?: (quiz: QuizSchema) => void;
    /** Callback quando ocorre um erro */
    onError?: (error: Error) => void;
}

export function ModernQuizEditor({
    initialQuiz,
    quizId,
    onSave,
    onError,
}: ModernQuizEditorProps) {
    console.log('🎨 ModernQuizEditor rendering', { initialQuiz: !!initialQuiz, quizId });

    // 🆕 PHASE 2: Analytics sidebar state
    const [showAnalytics, setShowAnalytics] = useState(false);

    // 🆕 PHASE 1: Performance monitoring
    const { metrics } = usePerformanceMonitor('ModernQuizEditor');

    // 🆕 PHASE 1: Memory leak detection
    useMemoryLeakDetector('ModernQuizEditor');

    // Log slow renders in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && metrics.avgRenderTime > 50) {
            console.warn('⚠️ ModernQuizEditor renderizando lento:', metrics);
        }
    }, [metrics]);

    const { loadQuiz, quiz, isLoading, error, isDirty } = useQuizStore();
    const selectedStepId = useEditorStore((s) => s.selectedStepId);
    const splitPreviewEnabled = useEditorStore((s) => s.splitPreviewEnabled);
    const toggleSplitPreview = useEditorStore((s) => s.toggleSplitPreview);
    const setSplitPreviewEnabled = useEditorStore((s) => s.setSplitPreviewEnabled);
    const saveToLibraryDialog = useEditorStore((s) => s.saveToLibraryDialog);
    const closeSaveToLibrary = useEditorStore((s) => s.closeSaveToLibrary);
    const isCommandPaletteOpen = useEditorStore((s) => s.isCommandPaletteOpen);
    const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);

    // 🆕 Auto-enable split preview from URL param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('splitPreview') === 'true' && !splitPreviewEnabled) {
            setSplitPreviewEnabled(true);
        }
    }, []);
    
    // 🆕 PHASE 3: Get current user for collaboration
    const { user } = useAuthStore();
    
    // Generate stable user ID for anonymous users
    const sessionUserId = useMemo(() => {
        if (user?.id) return user.id;
        // Use localStorage for persistent anonymous ID
        const stored = localStorage.getItem('editor-anonymous-id');
        if (stored) return stored;
        const newId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem('editor-anonymous-id', newId);
        return newId;
    }, [user?.id]);

    // 🆕 PHASE 3: Real-time collaboration with Supabase
    const effectiveQuizId = quizId || quiz?.metadata?.id || 'default-quiz';
    const { collaborators, isConnected, setEditingLocation } = useSupabasePresence({
        quizId: effectiveQuizId,
        userId: sessionUserId,
        userName: user?.email?.split('@')[0] || 'Anônimo',
        userEmail: user?.email,
        userAvatar: undefined,
    });

    // 🆕 PHASE 3: Update presence when step selection changes
    useEffect(() => {
        if (selectedStepId) {
            setEditingLocation(selectedStepId);
        }
    }, [selectedStepId, setEditingLocation]);

    // Hook de persistência
    const persistence = usePersistence({
        autoSaveDelay: 3000,
        maxRetries: 3,
        onSaveSuccess: (savedQuiz) => {
            console.log('✅ Quiz salvo com sucesso via usePersistence');
            if (onSave) onSave(savedQuiz);
        },
        onSaveError: (err) => {
            console.error('❌ Erro ao salvar via usePersistence', err);
            if (onError) onError(err);
        },
    });

    // Auto-save quando quiz muda
    useAutoSave(quiz, isDirty, persistence, 3000);
    // Carregar quiz inicial (sem loadQuiz nas deps para evitar loop)
    useEffect(() => {
        if (initialQuiz) {
            console.log('📂 Carregando quiz inicial (RAW):', {
                stepsType: Array.isArray(initialQuiz.steps) ? 'array' : 'object',
                stepsKeys: !Array.isArray(initialQuiz.steps) ? Object.keys(initialQuiz.steps || {}) : undefined,
                stepsLength: Array.isArray(initialQuiz.steps) ? initialQuiz.steps?.length : undefined,
            });

            // 🔒 VALIDAR formato do template
            const validationResult = validateTemplateFormat(initialQuiz);

            if (!validationResult.valid) {
                console.warn('⚠️ Template com problemas detectados:');
                console.warn(formatValidationReport(validationResult));

                // Se auto-fix disponível, usar
                if (validationResult.fixed) {
                    console.log('✅ Usando template auto-corrigido');
                    loadQuiz(validationResult.fixed);
                    return;
                }
            } else {
                console.log('✅ Template válido!');
                if (validationResult.warnings.length > 0) {
                    console.warn(`⚠️ ${validationResult.warnings.length} avisos detectados - verifique console`);
                }
            }

            // 🔄 Normalizar formato (converte objeto para array se necessário)
            const normalizedQuiz = normalizeQuizFormat(initialQuiz);

            console.log('📂 Quiz normalizado:', {
                steps: normalizedQuiz.steps?.length,
                firstStepId: normalizedQuiz.steps?.[0]?.id,
                firstStepBlocks: normalizedQuiz.steps?.[0]?.blocks?.length,
            });

            loadQuiz(normalizedQuiz);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuiz]);
    // ✅ CRITICAL: Auto-selecionar primeiro step quando quiz carregar
    useEffect(() => {
        console.log('🔍 useEffect[quiz] executado:', {
            hasQuiz: !!quiz,
            hasSteps: !!quiz?.steps,
            stepsLength: quiz?.steps?.length,
            firstStep: quiz?.steps?.[0],
        });

        if (quiz && quiz.steps && quiz.steps.length > 0) {
            const firstStepId = quiz.steps[0].id;
            const firstStepBlocks = quiz.steps[0].blocks;
            console.log('🎯 Auto-selecionando primeiro step:', {
                stepId: firstStepId,
                stepTitle: quiz.steps[0].title,
                blocksCount: firstStepBlocks?.length || 0,
                firstBlockType: firstStepBlocks?.[0]?.type,
            });

            useEditorStore.getState().selectStep(firstStepId);

            // Verificar se foi realmente selecionado
            setTimeout(() => {
                const editorState = useEditorStore.getState();
                console.log('✅ Verificação pós-seleção (após timeout):', {
                    selectedStepId: editorState.selectedStepId,
                    match: editorState.selectedStepId === firstStepId,
                    quizSteps: quiz.steps.length,
                });
            }, 100);
        } else {
            console.warn('⚠️ Não foi possível auto-selecionar step:', {
                quiz: !!quiz,
                steps: quiz?.steps?.length || 0,
            });
        }
    }, [quiz]);

    // Notificar erro do store
    useEffect(() => {
        if (error && onError) {
            onError(new Error(error));
        }
    }, [error, onError]);

    // Handler de save manual
    const handleSave = async () => {
        if (!quiz) return;
        await persistence.saveQuiz(quiz, quizId);
    };

    // 🆕 Premium: Keyboard shortcuts
    const handleOpenCommandPalette = useCallback(() => {
        setCommandPaletteOpen(true);
    }, [setCommandPaletteOpen]);

    useKeyboardShortcuts({
        onSave: handleSave,
        onOpenCommandPalette: handleOpenCommandPalette,
    });

    // 🆕 Premium: Clipboard operations
    useBlockClipboard();

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">⏳</div>
                    <p className="text-gray-600">Carregando editor...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Erro ao carregar editor
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Recarregar página
                    </button>
                </div>
            </div>
        );
    }

    // Empty state - canvas em branco
    if (!quiz) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
                <div className="text-center max-w-lg">
                    <div className="text-8xl mb-6">🎨</div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Canvas Vazio
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Arraste blocos da biblioteca para começar a construir seu funil.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => window.location.href = '/editor?funnel=quiz21StepsComplete'}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            📂 Usar Template Base
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Editor principal
    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            {/* Barra superior com ações globais */}
            <header className="bg-background border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-foreground">
                        {quiz.metadata.name || 'Quiz sem título'}
                    </h1>
                    <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                        {quiz.version}
                    </span>
                    
                    {/* Toggle Visual/JSON */}
                    <EditorModeToggle />

                    {/* 🆕 Global Search */}
                    <GlobalSearch />
                    
                    {/* 🆕 Command Palette trigger */}
                    <button
                        onClick={handleOpenCommandPalette}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                        <Command className="w-4 h-4" />
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border border-border">
                            ⌘K
                        </kbd>
                    </button>

                    {/* 🆕 PHASE 3: Collaborator presence indicators */}
                    <div className="border-l border-border pl-4 ml-2">
                        <CollaboratorAvatars 
                            collaborators={collaborators} 
                            isConnected={isConnected} 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* 🆕 PHASE 2: Import/Export buttons */}
                    <ImportTemplateButton compact />
                    <ExportTemplateButton 
                        buttonText="Exportar" 
                        variant="outline" 
                        className="h-9 text-sm"
                    />
                    
                    {/* 🆕 PHASE 3: Duplicate & Publish */}
                    <DuplicateFunnelButton className="h-9 text-sm" />
                    <PublishButton 
                        draftId={quizId || quiz?.metadata?.id}
                        className="h-9 text-sm"
                    />

                    {/* 🆕 PHASE 4: Split Preview toggle */}
                    <button
                        onClick={toggleSplitPreview}
                        className={`
                            px-3 py-2 rounded-lg flex items-center gap-2
                            transition-colors text-sm font-medium
                            ${splitPreviewEnabled
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                        `}
                        title="Split Preview"
                    >
                        {splitPreviewEnabled ? (
                            <PanelLeftClose className="w-4 h-4" />
                        ) : (
                            <PanelLeft className="w-4 h-4" />
                        )}
                        Preview
                    </button>

                    {/* Analytics toggle button */}
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className={`
                            px-3 py-2 rounded-lg flex items-center gap-2
                            transition-colors text-sm font-medium
                            ${showAnalytics
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                        `}
                        title="Analytics em Tempo Real"
                    >
                        <Activity className="w-4 h-4" />
                        Analytics
                    </button>

                    {/* Botão de salvar manual */}
                    <button
                        onClick={handleSave}
                        disabled={!isDirty || persistence.status === 'saving'}
                        className="
                            px-4 py-2 bg-primary text-primary-foreground rounded-lg
                            hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors text-sm font-medium
                        "
                    >
                        💾 Salvar
                    </button>
                </div>
            </header>

            {/* Save Status Indicator */}
            <SaveStatusIndicator
                status={persistence.status}
                error={persistence.error}
                lastSaved={persistence.lastSaved}
                onRetry={persistence.retry}
                onClearError={persistence.clearError}
            />

            {/* Layout com 4 colunas */}
            <div className="flex-1 overflow-hidden">
                <EditorLayout />
            </div>

            {/* 🆕 PHASE 2: Analytics Sidebar */}
            <AnalyticsSidebar
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
            />

            {/* 🆕 PHASE 1: Performance Debugger (dev only) */}
            <PerformanceDebugger position="bottom-right" />

            {/* 🆕 PHASE 4: DevTools with Accessibility Auditor (dev only) */}
            <DevTools />

            {/* 🆕 PHASE 5: Save to Library Dialog */}
            <SaveToLibraryDialog
                open={saveToLibraryDialog.open}
                onOpenChange={(open) => !open && closeSaveToLibrary()}
                blockType={saveToLibraryDialog.blockType}
                blockConfig={saveToLibraryDialog.blockConfig}
            />

            {/* 🆕 Premium: Command Palette */}
            <CommandPalette
                open={isCommandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
                onSave={handleSave}
            />
        </div>
    );
}
