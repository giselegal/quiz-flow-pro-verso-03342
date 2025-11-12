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
import type { Block } from '@/types/editor';
import { useStepBlocksQuery } from '@/services/api/steps/hooks';

export interface PreviewPanelProps {
    currentStepKey: string | null;
    blocks: Block[] | null;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
    className?: string;
    previewMode?: 'live' | 'production'; // 🔄 G42 FIX
    onStepChange?: (stepId: string) => void;
}

export default function PreviewPanel({
    currentStepKey,
    blocks,
    isVisible = true,
    onToggleVisibility,
    className = '',
    previewMode = 'live', // 🔄 G42 FIX: Default to live
    onStepChange,
}: PreviewPanelProps) {
    // 🔄 G42 FIX: Live usa blocks do editor, Production força refetch do backend
    const shouldFetchFromBackend = previewMode === 'production';

    // Sempre buscar via React Query quando em modo production
    const { data: fetchedBlocks, isLoading, error } = useStepBlocksQuery({
        stepId: currentStepKey,
        enabled: !!currentStepKey && shouldFetchFromBackend,
        // Production força cache zero (stale imediato) para refletir mudanças publicadas
        staleTimeMs: shouldFetchFromBackend ? 0 : 15_000,
    });    // 🔄 G42 FIX: Live = blocks do editor, Production = refetch forçado
  const blocksToUse: Block[] | null = shouldFetchFromBackend
    ? (fetchedBlocks ?? blocks)
    : (blocks ?? fetchedBlocks) ?? null;

  // Converter blocos do editor para formato de preview
  const quizContent = useMemo(() => {
    if (!currentStepKey) {
      return null;
    }

    const normalizeType = (t: any): string => {
      const s = String(t || '').toLowerCase();
      if (s === 'heading') return 'headline';
      if (s === 'btn' || s === 'cta') return 'button';
      return s || 'unknown';
    };

    const normalizedBlocks = (blocksToUse || []).map((b: any, i: number) => {
      const id = b?.id || `block-${i}`;
      const type = normalizeType(b?.type);
      const order = typeof b?.order === 'number' ? b.order : i;

      const merged = {
        ...(b?.properties || {}),
        ...(b?.content || {}),
        ...(b?.config || {}),
      } as any;

      let content: any = merged;
      if (type === 'text' || type === 'headline') {
        content = { text: merged.text ?? merged.title ?? merged.label ?? merged.value ?? '' };
      } else if (type === 'image') {
        content = {
          url: merged.url ?? merged.src ?? '',
          alt: merged.alt ?? merged.title ?? '',
        };
      } else if (type === 'button') {
        content = { text: merged.text ?? merged.label ?? merged.title ?? 'Continuar' };
      } else if (type === 'quiz-options') {
        const raw = (merged.options ?? merged.choices ?? merged.items ?? []) as any[];
        const options = raw.map((o: any, idx: number) => ({
          id: o?.id ?? `opt-${idx}`,
          text: o?.text ?? o?.label ?? String(o ?? ''),
        }));
        content = { options };
      }

      return { id, type, order, content };
    });

    return {
      steps: [
        {
          id: currentStepKey,
          type: 'quiz-step',
          blocks: normalizedBlocks,
        },
      ],
      metadata: {
        currentStep: currentStepKey,
        previewMode: true,
      },
    };
  }, [currentStepKey, blocksToUse]);

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

    if (isLoading && !blocksToUse) {
        return (
            <div className={`flex items-center justify-center h-full text-gray-500 bg-muted/20 ${className}`}>
                <div className="text-center">
                    <div className="animate-pulse mb-2">Carregando preview…</div>
                    <div className="text-xs text-gray-400">{currentStepKey}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-full text-red-500 bg-red-50 ${className}`}>
                <div className="text-sm">Erro ao carregar blocos: {String(error.message || error)}</div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col relative ${className}`}>
            {/* 🔄 G42 FIX: Indicador visual do modo Production */}
            {previewMode === 'production' && (
                <div className="absolute top-2 left-2 z-20 px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded border border-emerald-300 shadow-sm">
                    🚀 Modo Production (Dados Publicados)
                </div>
            )}
            {previewMode === 'live' && (
                <div className="absolute top-2 left-2 z-20 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded border border-blue-300 shadow-sm">
                    🛠 Visualização do Editor (Dados em edição)
                </div>
            )}

            {/* Preview com controles responsivos */}
            {!quizContent ? (
                <div className="flex items-center justify-center h-full text-gray-500 bg-muted/20">
                    <div className="text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Selecione uma etapa para visualizar</p>
                        {previewMode === 'production' && (
                            <p className="text-xs text-gray-400 mt-2">Modo Production: mostrando dados publicados</p>
                        )}
                    </div>
                </div>
            ) : (
                <ResponsivePreviewFrame
                    quizContent={quizContent}
                    currentStepId={currentStepKey}
                    onStepChange={onStepChange}
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
