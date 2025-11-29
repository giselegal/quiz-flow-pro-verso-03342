/**
 * 🎯 OptionsGridSection - Grid de opções com imagens e seleção múltipla
 * 
 * Componente modular para exibir opções de quiz em grid responsivo
 */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';
import { appLogger } from '@/lib/utils/appLogger';
import { useAppStore } from '@/state/store';

export interface QuizOption {
    id: string;
    text: string;
    imageUrl?: string;
    value: string;
    category?: string;
    points?: number;
}

export interface OptionsGridContent {
    options: QuizOption[];
    columns?: number; // 1, 2, 3, 4
    multipleSelection?: boolean;
    minSelections?: number;
    maxSelections?: number;
    showImages?: boolean;
    imageSize?: number;
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
    validationMessage?: string;
}

export interface OptionsGridSectionProps extends BaseSectionProps {
    content: OptionsGridContent;
    selectedOptions?: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    onComplete?: () => void;
    onAnalytics?: (event: string, data?: any) => void;
    /**
     * Opcional: id do elemento que contém o título da pergunta para aria-labelledby
     * Ex.: o id do componente "question-title" correspondente
     */
    ariaLabelledById?: string;
}

export const OptionsGridSection: React.FC<OptionsGridSectionProps & { properties?: Record<string, any> }> = ({
    id,
    content,
    selectedOptions = [],
    onSelectionChange,
    onComplete,
    style: customStyle,
    animation,
    onAnalytics,
    ariaLabelledById,
    properties,
}) => {
    // Helpers para robustez contra shapes não-array
    const ensureArray = <T,>(val: unknown): T[] => {
        if (Array.isArray(val)) return val as T[];
        if (val && typeof val === 'object') return Object.values(val as Record<string, T>);
        return [];
    };
    const safeFind = <T,>(list: unknown, predicate: (item: T) => boolean): T | undefined => {
        return Array.isArray(list) ? (list as T[]).find(predicate) : undefined;
    };

    const { isMobile, isTablet } = useResponsive();
    const [localSelected, setLocalSelected] = useState<string[]>(selectedOptions);
    // Leitura opcional da contagem global de seleções via Zustand (quizSlice)
    const globalSelectionsCountRaw = useAppStore((s) => Array.isArray(s.quiz.selections)
        ? s.quiz.selections
        : (s.quiz.selections?.size ?? 0));
    const globalSelectionsCount = typeof globalSelectionsCountRaw === 'number'
        ? globalSelectionsCountRaw
        : Array.isArray(globalSelectionsCountRaw)
            ? globalSelectionsCountRaw.length
            : 0;
    const autoAdvanceTimeoutRef = useRef<number | null>(null);

    const {
        options,
        multipleSelection = false,
        minSelections = 1,
        maxSelections = 1,
        autoAdvance = false,
        autoAdvanceDelay = 1500,
        validationMessage = 'Selecione ao menos uma opção',
    } = content;

    // Compat: permitir override por properties (novo painel) mantendo compat com v3 content
    const showImages = (properties?.showImages ?? content.showImages) !== false;
    const columns = Math.max(1, Math.min(4, Number(properties?.columns ?? content.columns ?? 2)));
    // Compat: v3 usava content.imageSize como número (maxHeight). Novo painel usa presets/string + imageMaxSize + custom w/h
    const propImageSize = (properties?.imageSize as any) as ('small' | 'medium' | 'large' | 'custom' | undefined);
    const imageWidth = typeof (properties as any)?.imageWidth === 'number' ? (properties as any).imageWidth : undefined;
    const imageHeight = typeof (properties as any)?.imageHeight === 'number' ? (properties as any).imageHeight : undefined;
    const imageMaxSize: number | undefined = typeof properties?.imageMaxSize === 'number'
        ? properties!.imageMaxSize
        : (typeof (content as any).imageSize === 'number' ? (content as any).imageSize : undefined);

    const computeMaxHeight = (): number | undefined => {
        // Modo custom (prioridade)
        if (propImageSize === 'custom' && (imageWidth || imageHeight)) {
            return imageHeight ?? imageWidth; // se só houver largura, usa como aprox.
        }
        // Slider rápido tem precedência sobre presets
        if (typeof imageMaxSize === 'number') return imageMaxSize;
        // Presets alinhados ao preview do editor
        switch (propImageSize) {
            case 'small': return 120;
            case 'large': return 240;
            case 'medium':
            default: return 180;
        }
    };
    const resolvedMaxHeight = computeMaxHeight();

    // Normalizar opções para evitar .map/.find em tipos inválidos
    const optionsArray = ensureArray<QuizOption>(options);

    if (import.meta?.env?.DEV && !Array.isArray(options)) {
        appLogger.warn('⚠️ OptionsGridSection: content.options não é um array. Shape recebido:', {
            data: [{
                type: typeof options,
                keys: options && typeof options === 'object' ? Object.keys(options as any) : undefined,
            }]
        });
    }

    // Sincronizar com prop externa
    useEffect(() => {
        setLocalSelected(selectedOptions);
    }, [selectedOptions]);

    const handleOptionClick = useCallback((optionId: string) => {
        let newSelection: string[];

        if (multipleSelection) {
            // Seleção múltipla
            const isSelected = localSelected.includes(optionId);

            if (isSelected) {
                // Remove seleção
                newSelection = localSelected.filter((id) => id !== optionId);
            } else {
                // Adiciona se não atingiu o máximo
                if (localSelected.length < maxSelections) {
                    newSelection = [...localSelected, optionId];
                } else {
                    // Já atingiu máximo
                    onAnalytics?.('selection_limit_reached', {
                        sectionId: id,
                        optionId,
                        totalSelected: localSelected.length,
                        limit: maxSelections,
                    });
                    return;
                }
            }
        } else {
            // Seleção única
            newSelection = [optionId];
        }

        setLocalSelected(newSelection);
        onSelectionChange(newSelection);

        const metaOpt = safeFind<QuizOption>(optionsArray, (o) => o.id === optionId);
        onAnalytics?.('option_selected', {
            sectionId: id,
            optionId,
            totalSelected: newSelection.length,
            isMultiple: multipleSelection,
            selectionMode: multipleSelection ? 'multiple' : 'single',
            optionMeta: metaOpt ? {
                category: metaOpt.category,
                points: metaOpt.points,
            } : undefined,
        });
    }, [autoAdvance, autoAdvanceDelay, id, maxSelections, multipleSelection, onAnalytics, onSelectionChange, optionsArray, localSelected]);

    const isOptionSelected = (optionId: string) => localSelected.includes(optionId);

    const getGridColumns = (): number => {
        if (isMobile) return 1;
        if (isTablet) return Math.min(columns, 2);
        return columns;
    };

    const gridColumns = getGridColumns();

    const gridStyles: React.CSSProperties = useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: typeof (properties as any)?.gridGap === 'number' ? (properties as any).gridGap : DesignTokens.spacing.md,
        width: '100%',
    }), [gridColumns]);

    // Auto-advance seguro: programa e cancela conforme mudanças
    useEffect(() => {
        if (!autoAdvance) return;

        const targetCount = multipleSelection ? maxSelections : 1;
        const hasReached = localSelected.length === targetCount;

        // Limpar timeout anterior
        if (autoAdvanceTimeoutRef.current) {
            window.clearTimeout(autoAdvanceTimeoutRef.current);
            autoAdvanceTimeoutRef.current = null;
        }

        if (hasReached) {
            autoAdvanceTimeoutRef.current = window.setTimeout(() => {
                onComplete?.();
                autoAdvanceTimeoutRef.current = null;
            }, autoAdvanceDelay);
        }

        return () => {
            if (autoAdvanceTimeoutRef.current) {
                window.clearTimeout(autoAdvanceTimeoutRef.current);
                autoAdvanceTimeoutRef.current = null;
            }
        };
    }, [autoAdvance, autoAdvanceDelay, localSelected, maxSelections, multipleSelection, onComplete]);

    return (
        <SectionContainer
            id={id}
            maxWidth="desktop"
            padding="md"
            animation={animation}
            style={{
                backgroundColor: customStyle?.backgroundColor || 'transparent',
                ...customStyle,
            }}
        >
            <div
                style={gridStyles}
                role={multipleSelection ? 'group' : 'radiogroup'}
                aria-labelledby={ariaLabelledById}
                aria-label={ariaLabelledById ? undefined : 'Opções'}
            >
                {optionsArray.map((option, index) => {
                    const isSelected = isOptionSelected(option.id);
                    const disableUnselectedDueToLimit = multipleSelection && !isSelected && localSelected.length >= maxSelections;

                    const optionStyles: React.CSSProperties = {
                        position: 'relative',
                        backgroundColor: DesignTokens.colors.backgroundWhite,
                        border: `2px solid ${isSelected ? DesignTokens.colors.selected : DesignTokens.colors.border
                            }`,
                        borderRadius: DesignTokens.borderRadius.lg,
                        padding: DesignTokens.spacing.md,
                        cursor: disableUnselectedDueToLimit ? 'not-allowed' : 'pointer',
                        transition: DesignTokens.transitions.base,
                        boxShadow: isSelected ? DesignTokens.shadows.md : DesignTokens.shadows.sm,
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        opacity: disableUnselectedDueToLimit ? 0.6 : 1,
                        outline: 'none',
                    };

                    return (
                        <AnimatedTransition
                            key={option.id}
                            type="slideUp"
                            duration={300}
                            delay={index * 50}
                        >
                            <button
                                type="button"
                                onClick={() => handleOptionClick(option.id)}
                                style={optionStyles}
                                role={multipleSelection ? 'checkbox' : 'radio'}
                                aria-checked={isSelected}
                                aria-disabled={disableUnselectedDueToLimit}
                                disabled={disableUnselectedDueToLimit}
                                data-selected={isSelected || undefined}
                                data-disabled={disableUnselectedDueToLimit || undefined}
                                onFocus={(e) => {
                                    // realçar foco sem depender de :focus-visible css
                                    e.currentTarget.style.boxShadow = DesignTokens.shadows.md;
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.boxShadow = isSelected ? DesignTokens.shadows.md : DesignTokens.shadows.sm;
                                }}
                            >
                                {/* Selected Indicator */}
                                {isSelected && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            width: 24,
                                            height: 24,
                                            borderRadius: DesignTokens.borderRadius.full,
                                            backgroundColor: DesignTokens.colors.primary,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: DesignTokens.colors.backgroundWhite,
                                            fontSize: DesignTokens.fontSizes.sm,
                                            fontWeight: DesignTokens.fontWeights.bold,
                                        }}
                                    >
                                        ✓
                                    </div>
                                )}

                                {/* Image */}
                                {showImages && option.imageUrl && (
                                    <img
                                        src={option.imageUrl}
                                        alt={option.text}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: resolvedMaxHeight ?? 256,
                                            objectFit: 'cover',
                                            borderRadius: DesignTokens.borderRadius.md,
                                            marginBottom: DesignTokens.spacing.sm,
                                        }}
                                        loading="lazy"
                                    />
                                )}

                                {/* Text */}
                                <p
                                    style={{
                                        fontSize: DesignTokens.fontSizes.base,
                                        fontWeight: DesignTokens.fontWeights.medium,
                                        color: DesignTokens.colors.textPrimary,
                                        textAlign: 'center',
                                        lineHeight: DesignTokens.lineHeights.normal,
                                    }}
                                >
                                    {option.text}
                                </p>

                                {/* Category Badge (opcional) */}
                                {option.category && (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginTop: DesignTokens.spacing.xs,
                                            padding: `${DesignTokens.spacing.xs}px ${DesignTokens.spacing.sm}px`,
                                            fontSize: DesignTokens.fontSizes.xs,
                                            fontWeight: DesignTokens.fontWeights.semibold,
                                            color: DesignTokens.colors.primary,
                                            backgroundColor: DesignTokens.colors.primaryLight,
                                            borderRadius: DesignTokens.borderRadius.full,
                                        }}
                                    >
                                        {option.category}
                                    </span>
                                )}
                            </button>
                        </AnimatedTransition>
                    );
                })}
            </div>

            {/* Validation Message */}
            {multipleSelection && localSelected.length < minSelections && (
                <p
                    style={{
                        marginTop: DesignTokens.spacing.md,
                        fontSize: DesignTokens.fontSizes.sm,
                        color: DesignTokens.colors.textSecondary,
                        textAlign: 'center',
                    }}
                    aria-live="polite"
                >
                    {validationMessage.replace(
                        '{count}',
                        `${minSelections - localSelected.length}`,
                    )}
                </p>
            )}

            {/* Selection Counter */}
            {multipleSelection && (
                <p
                    style={{
                        marginTop: DesignTokens.spacing.sm,
                        fontSize: DesignTokens.fontSizes.sm,
                        fontWeight: DesignTokens.fontWeights.medium,
                        color: DesignTokens.colors.primary,
                        textAlign: 'center',
                    }}
                    aria-live="polite"
                >
                    {localSelected.length} de {maxSelections} selecionados
                    {globalSelectionsCount > 0 ? ` • Global: ${globalSelectionsCount}` : ''}
                </p>
            )}
        </SectionContainer>
    );
};
