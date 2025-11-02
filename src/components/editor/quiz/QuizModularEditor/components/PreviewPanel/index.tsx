/**
 * 🎯 ONDA 1: PREVIEW PANEL
 * 
 * Painel de preview isolado usando IsolatedPreviewIframe
 * Integrado ao QuizModularEditor para visualização em tempo real
 */

import React, { useMemo } from 'react';
import { IsolatedPreviewIframe } from '@/components/editor/preview/IsolatedPreviewIframe';
import { Eye, EyeOff } from 'lucide-react';
import type { Block } from '@/services/UnifiedTemplateRegistry';

export interface PreviewPanelProps {
    currentStepKey: string | null;
    blocks: Block[] | null;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
    className?: string;
}

export default function PreviewPanel({
    currentStepKey,
    blocks,
    isVisible = true,
    onToggleVisibility,
    className = '',
}: PreviewPanelProps) {
    // Converter blocos do editor para formato de preview
    const quizContent = useMemo(() => {
        if (!currentStepKey || !blocks) {
            return null;
        }

        return {
            steps: [
                {
                    id: currentStepKey,
                    type: 'quiz-step',
                    blocks: blocks,
                },
            ],
            metadata: {
                currentStep: currentStepKey,
                previewMode: true,
            },
        };
    }, [currentStepKey, blocks]);

    if (!isVisible) {
        return (
            <div className={`flex items-center justify-center p-4 border-t ${className}`}>
                <button
                    onClick={onToggleVisibility}
                    className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                    <Eye className="w-4 h-4" />
                    Mostrar Preview
                </button>
            </div>
        );
    }

    return (
        <div className={`flex flex-col border-t ${className}`}>
            {/* Header do Preview */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Preview Isolado</span>
                    {currentStepKey && (
                        <span className="text-xs text-gray-500">({currentStepKey})</span>
                    )}
                </div>
                {onToggleVisibility && (
                    <button
                        onClick={onToggleVisibility}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                        title="Ocultar preview"
                    >
                        <EyeOff className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Área do Preview */}
            <div className="flex-1 min-h-[400px] bg-white overflow-hidden">
                {!quizContent ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Selecione uma etapa para visualizar</p>
                        </div>
                    </div>
                ) : (
                    <IsolatedPreviewIframe
                        quizContent={quizContent}
                        currentStepId={currentStepKey || undefined}
                        className="w-full h-full"
                    />
                )}
            </div>

            {/* Footer com info */}
            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                ℹ️ Preview isolado em iframe - mudanças refletem em tempo real
            </div>
        </div>
    );
}
