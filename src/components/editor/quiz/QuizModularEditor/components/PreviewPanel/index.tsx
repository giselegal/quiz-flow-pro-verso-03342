/**
 * 🎯 FASE 8.2: PREVIEW PANEL AVANÇADO
 * 
 * Painel de preview com controles responsivos:
 * - Viewport (mobile/tablet/desktop)
 * - Zoom (50% - 150%)
 * - Dark mode toggle
 * - Refresh e fullscreen
 */

import React, { useMemo } from 'react';
import { ResponsivePreviewFrame } from '@/components/editor/preview/ResponsivePreviewFrame';
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
        <div className={`flex flex-col ${className}`}>
            {/* Preview com controles responsivos */}
            {!quizContent ? (
                <div className="flex items-center justify-center h-full text-gray-500 bg-muted/20">
                    <div className="text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Selecione uma etapa para visualizar</p>
                    </div>
                </div>
            ) : (
                <ResponsivePreviewFrame
                    quizContent={quizContent}
                    currentStepId={currentStepKey}
                />
            )}

            {/* Toggle visibility button (se fornecido) */}
            {onToggleVisibility && (
                <button
                    onClick={onToggleVisibility}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white/80 backdrop-blur-sm shadow-sm z-10"
                    title="Ocultar preview"
                >
                    <EyeOff className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
