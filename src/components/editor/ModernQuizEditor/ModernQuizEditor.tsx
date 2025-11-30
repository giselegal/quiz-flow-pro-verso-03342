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
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

export interface ModernQuizEditorProps {
    /** Quiz inicial para carregar no editor */
    initialQuiz?: QuizSchema;
    /** Callback quando o quiz é salvo */
    onSave?: (quiz: QuizSchema) => void;
    /** Callback quando ocorre um erro */
    onError?: (error: Error) => void;
}

export function ModernQuizEditor({
    initialQuiz,
    onSave,
    onError,
}: ModernQuizEditorProps) {
    const { loadQuiz, quiz, isLoading, error, save } = useQuizStore();

    // Carregar quiz inicial
    useEffect(() => {
        if (initialQuiz) {
            loadQuiz(initialQuiz);
        }
    }, [initialQuiz, loadQuiz]);

    // Notificar erro
    useEffect(() => {
        if (error && onError) {
            onError(new Error(error));
        }
    }, [error, onError]);

    // Handler de save
    const handleSave = async () => {
        try {
            const savedQuiz = await save();
            if (onSave && savedQuiz) {
                onSave(savedQuiz);
            }
        } catch (err) {
            if (onError) {
                onError(err instanceof Error ? err : new Error('Erro ao salvar'));
            }
        }
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
        <div className="h-screen w-full overflow-hidden">
            {/* Barra superior com ações globais */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900">
                        {quiz.metadata.name || 'Quiz sem título'}
                    </h1>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {quiz.version}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status de salvamento */}
                    <span className="text-sm text-gray-500">
                        {useQuizStore.getState().isDirty ? '● Não salvo' : '✓ Salvo'}
                    </span>

                    {/* Botão de salvar */}
                    <button
                        onClick={handleSave}
                        disabled={!useQuizStore.getState().isDirty}
                        className="
              px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
                    >
                        💾 Salvar
                    </button>
                </div>
            </header>

            {/* Layout com 4 colunas */}
            <EditorLayout />
        </div>
    );
}
