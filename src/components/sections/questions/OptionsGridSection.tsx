/**
 * 🎯 OptionsGridSection - Grid de opções com imagens e seleção múltipla
 * 
 * Componente modular para exibir opções de quiz em grid responsivo
 */

import React, { useState, useEffect } from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

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
}

export const OptionsGridSection: React.FC<OptionsGridSectionProps> = ({
    id,
    content,
    selectedOptions = [],
    onSelectionChange,
    onComplete,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile, isTablet } = useResponsive();
    const [localSelected, setLocalSelected] = useState<string[]>(selectedOptions);

    const {
        options,
        columns = 2,
        multipleSelection = false,
        minSelections = 1,
        maxSelections = 1,
        showImages = true,
        imageSize = 256,
        autoAdvance = false,
        autoAdvanceDelay = 1500,
        validationMessage = 'Selecione ao menos uma opção',
    } = content;

    // Sincronizar com prop externa
    useEffect(() => {
        setLocalSelected(selectedOptions);
    }, [selectedOptions]);

    const handleOptionClick = (optionId: string) => {
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
                    return;
                }
            }
        } else {
            // Seleção única
            newSelection = [optionId];
        }

        setLocalSelected(newSelection);
        onSelectionChange(newSelection);

        onAnalytics?.('option_selected', {
            sectionId: id,
            optionId,
            totalSelected: newSelection.length,
            isMultiple: multipleSelection,
        });

        // Auto-advance se atingiu número necessário
        if (
            autoAdvance &&
            newSelection.length === (multipleSelection ? maxSelections : 1)
        ) {
            setTimeout(() => {
                onComplete?.();
            }, autoAdvanceDelay);
        }
    };

    const isOptionSelected = (optionId: string) => localSelected.includes(optionId);

    const getGridColumns = (): number => {
        if (isMobile) return 1;
        if (isTablet) return Math.min(columns, 2);
        return columns;
    };

    const gridColumns = getGridColumns();

    const gridStyles: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: DesignTokens.spacing.md,
        width: '100%',
    };

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
            <div style={gridStyles}>
                {options.map((option, index) => {
                    const isSelected = isOptionSelected(option.id);

                    const optionStyles: React.CSSProperties = {
                        position: 'relative',
                        backgroundColor: DesignTokens.colors.backgroundWhite,
                        border: `2px solid ${isSelected ? DesignTokens.colors.selected : DesignTokens.colors.border
                            }`,
                        borderRadius: DesignTokens.borderRadius.lg,
                        padding: DesignTokens.spacing.md,
                        cursor: 'pointer',
                        transition: DesignTokens.transitions.base,
                        boxShadow: isSelected ? DesignTokens.shadows.md : DesignTokens.shadows.sm,
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    };

                    return (
                        <AnimatedTransition
                            key={option.id}
                            type="slideUp"
                            duration={300}
                            delay={index * 50}
                        >
                            <div
                                onClick={() => handleOptionClick(option.id)}
                                style={optionStyles}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = DesignTokens.colors.primaryLight;
                                        e.currentTarget.style.backgroundColor = DesignTokens.colors.hover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = DesignTokens.colors.border;
                                        e.currentTarget.style.backgroundColor = DesignTokens.colors.backgroundWhite;
                                    }
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
                                            maxHeight: imageSize,
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
                            </div>
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
                >
                    {validationMessage.replace(
                        '{count}',
                        `${minSelections - localSelected.length}`
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
                >
                    {localSelected.length} de {maxSelections} selecionados
                </p>
            )}
        </SectionContainer>
    );
};
