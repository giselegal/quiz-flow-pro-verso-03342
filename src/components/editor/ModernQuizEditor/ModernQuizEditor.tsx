/**
 * 🎯 Modern Quiz Editor - Componente Principal
 * 
 * Editor moderno com arquitetura limpa:
 * - 4 colunas: Steps | Library | Canvas | Properties
 * - Zustand + Immer para estado
 * - dnd-kit para drag & drop
 * - Integração com cálculos
 */

import { useEffect } from 'react';
import { EditorLayout } from './layout/EditorLayout';
import { useQuizStore } from './store/quizStore';
import { useEditorStore } from './store/editorStore';
import { usePersistence, useAutoSave } from './hooks/usePersistence';
import { SaveStatusIndicator } from './components/SaveStatusIndicator';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

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

    const { loadQuiz, quiz, isLoading, error, isDirty } = useQuizStore();

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

    // Carregar quiz inicial
    useEffect(() => {
        if (initialQuiz) {
            console.log('📂 Carregando quiz inicial:', {
                steps: initialQuiz.steps?.length,
                firstStepId: initialQuiz.steps?.[0]?.id,
                firstStepBlocks: initialQuiz.steps?.[0]?.blocks?.length
            });
            loadQuiz(initialQuiz);
        }
    }, [initialQuiz, loadQuiz]);

    // ✅ CRITICAL: Auto-selecionar primeiro step quando quiz carregar
    useEffect(() => {
        console.log('🔍 useEffect[quiz] executado:', {
            hasQuiz: !!quiz,
            hasSteps: !!quiz?.steps,
            stepsLength: quiz?.steps?.length,
            firstStep: quiz?.steps?.[0]
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
                steps: quiz?.steps?.length || 0
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

    // Empty state
    if (!quiz) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-600">Nenhum quiz carregado</p>
                </div>
            </div>
        );
    }

    // Editor principal
    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            {/* Barra superior com ações globais */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900">
                        {quiz.metadata.name || 'Quiz sem título'}
                    </h1>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {quiz.version}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botão de salvar manual */}
                    <button
                        onClick={handleSave}
                        disabled={!isDirty || persistence.status === 'saving'}
                        className="
              px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors text-sm font-medium
            "
                    >
                        💾 Salvar agora
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
        </div>
    );
}
