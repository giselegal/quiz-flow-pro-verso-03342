/**
 * 🎯 FASE 8.2: PREVIEW PANEL AVANÇADO
 * 
 * Painel de preview com controles responsivos:
 * - Viewport (mobile/tablet/desktop)
 * - Zoom (50% - 150%)
 * - Dark mode toggle
 * - Refresh e fullscreen
 */

import React, { useMemo, useEffect, useState } from 'react';
import { ResponsivePreviewFrame } from '@/components/editor/preview/ResponsivePreviewFrame';
import { Eye, EyeOff } from 'lucide-react';
import type { Block } from '@/types/editor';
import { useStepBlocksQuery } from '@/services/api/steps/hooks';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';

export interface PreviewPanelProps {
    currentStepKey: string | null;
    blocks: Block[] | null;
    selectedBlockId?: string | null;
    onBlockSelect?: (blockId: string) => void;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
    className?: string;
    previewMode?: 'live' | 'production'; // 🔄 G42 FIX
    onStepChange?: (stepId: string) => void;
    funnelId?: string | null;
}

export default function PreviewPanel({
    currentStepKey,
    blocks,
    selectedBlockId,
    onBlockSelect,
    isVisible = true,
    onToggleVisibility,
    className = '',
    previewMode = 'live', // 🔄 G42 FIX: Default to live
    onStepChange,
    funnelId,
}: PreviewPanelProps) {
    // 🔄 G42 FIX: Live usa blocks do editor, Production força refetch do backend
    const shouldFetchFromBackend = previewMode === 'production';

    // Buscar via React Query sempre que houver stepKey
    const localBlocks = blocks ?? null;
    const isIncomplete = !!localBlocks && localBlocks.some((b: any) => !(b?.properties || b?.content || b?.config));
    const { data: fetchedBlocks, isLoading, error } = useStepBlocksQuery({
        stepId: currentStepKey,
        funnelId,
        enabled: !!currentStepKey && (shouldFetchFromBackend || isIncomplete),
        staleTimeMs: 0,
    });
    const mergeById = (primary: Block[] | null, secondary?: Block[]): Block[] | null => {
      if (!primary && !secondary) return null;
      if (!primary) return secondary ?? null;
      if (!secondary || secondary.length === 0) return primary;
      const byId = new Map<string, Block>();
      for (const s of secondary) byId.set(s.id, s as Block);
      return primary.map(p => byId.get((p as any).id) ?? p);
    };
    const blocksToUse: Block[] | null = previewMode === 'live'
      ? mergeById(localBlocks, fetchedBlocks)
      : ((fetchedBlocks ?? localBlocks) ?? null);

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const tryResolve = async () => {
      if (!currentStepKey || previewMode !== 'production') return;
      const needsImage = (blocksToUse || []).some((b: any) => {
        const t = String(b?.type || '').toLowerCase();
        const isImg = t.includes('image') || t.includes('logo');
        const url = (b?.content as any)?.url || (b?.content as any)?.src;
        return isImg && !url;
      });
      if (!needsImage) return;
      const base = (import.meta as any)?.env?.BASE_URL || '/';
      const stepId = String(currentStepKey).toLowerCase();
      const exts = ['webp', 'jpg', 'png'];
      const dirs = ['images/quiz21-steps', 'assets/quiz21-steps', 'images/quiz', 'assets/quiz'];
      const candidates: string[] = [];
      for (const dir of dirs) for (const ext of exts) candidates.push(`${base}${dir}/${stepId}.${ext}`);
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            if (!cancelled) setResolvedImageUrl(url);
            break;
          }
        } catch {}
      }
    };
    tryResolve();
    return () => { cancelled = true; };
  }, [currentStepKey, previewMode, blocksToUse]);

  // Converter blocos do editor para formato de preview
  const quizContent = useMemo(() => {
    if (!currentStepKey) {
      return null;
    }

    const normalizeType = (t: any): string => {
      const s = String(t || '').toLowerCase();
      if (s === 'heading') return 'headline';
      if (s === 'btn' || s === 'cta') return 'button';
      if (s.includes('image') || s.includes('logo')) return 'image';
      return String(t || 'unknown');
    };

    const normalizedBlocks = (blocksToUse || []).map((b: any, i: number) => {
      const id = b?.id || `block-${i}`;
      const type = normalizeType(b?.type);
      const order = typeof b?.order === 'number' ? b.order : i;
      const isSelected = id === selectedBlockId;

      const merged = {
        ...(b?.properties || {}),
        ...(b?.content || {}),
        ...(b?.config || {}),
      } as any;

      let content: any = merged;
      if (type === 'text' || type === 'headline' || type === 'quiz-question-header') {
        content = { text: merged.text ?? merged.title ?? merged.label ?? merged.value ?? '' };
      } else if (type === 'image' || type === 'image-display-inline' || type === 'quiz-logo') {
        const nestedUrl = (merged as any)?.image?.url || (merged as any)?.media?.url;
        content = {
          url: merged.url ?? merged.src ?? merged.imageUrl ?? merged.assetUrl ?? merged.asset_url ?? merged.path ?? nestedUrl ?? merged.href ?? resolvedImageUrl ?? '',
          alt: merged.alt ?? merged.title ?? merged.description ?? merged.name ?? '',
        };
      } else if (type === 'button' || type === 'quiz-back-button') {
        content = { text: merged.text ?? merged.label ?? merged.title ?? 'Continuar' };
      } else if (type === 'quiz-options' || type === 'options-grid') {
        const raw = (merged.options ?? merged.choices ?? merged.items ?? []) as any[];
        const options = raw.map((o: any, idx: number) => ({
          id: o?.id ?? `opt-${idx}`,
          text: o?.text ?? o?.label ?? String(o ?? ''),
          imageUrl:
            o?.imageUrl ?? o?.url ?? o?.src ?? (o?.image && o?.image.url) ?? (o?.media && o?.media.url) ?? null,
          alt: o?.alt ?? o?.title ?? o?.description ?? o?.name ?? '',
        }));
        content = { options };
      } else if (type === 'quiz-progress-bar' || type === 'progress-header') {
        content = {
          currentStep: merged.currentStep ?? 1,
          totalSteps: merged.totalSteps ?? 21,
          barColor: merged.barColor,
          backgroundColor: merged.backgroundColor,
          showPercentage: merged.showPercentage ?? true,
        };
      }

      return { id, type, order, content, isSelected };
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
                previewMode === 'live' ? (
                    <div className="p-4 overflow-auto">
                        <div className="max-w-3xl mx-auto space-y-4">
                            {(blocksToUse || []).sort((a,b) => (a.order ?? 0) - (b.order ?? 0)).map((b) => (
                                <div
                                    key={b.id}
                                    className={cn(
                                        'relative transition-all duration-200',
                                        b.id === selectedBlockId && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg'
                                    )}
                                    ref={(el) => {
                                        // ✅ G2 FIX: Auto-scroll para bloco selecionado
                                        if (el && b.id === selectedBlockId) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                >
                                    {b.id === selectedBlockId && (
                                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse z-10" />
                                    )}
                                    <BlockTypeRenderer
                                        block={b}
                                        isSelected={b.id === selectedBlockId}
                                        isEditable={false}
                                        onSelect={onBlockSelect}
                                        contextData={{ canvasMode: 'preview', stepNumber: (b as any)?.properties?.stepNumber }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="overflow-y-auto">
                        <ResponsivePreviewFrame
                            quizContent={quizContent}
                            currentStepId={currentStepKey}
                            onStepChange={onStepChange}
                            onBlockSelect={onBlockSelect}
                        />
                    </div>
                )
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
