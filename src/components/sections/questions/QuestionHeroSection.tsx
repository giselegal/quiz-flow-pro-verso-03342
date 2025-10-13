/**
 * ❓ QuestionHeroSection - Hero para páginas de pergunta
 * 
 * Cabeçalho com título da pergunta, contador e barra de progresso
 */

import React from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface QuestionHeroContent {
    questionNumber: string; // ex: "Q1 - ROUPA FAVORITA"
    questionText: string;   // ex: "Qual desses resultados você mais gostaria de alcançar?"
    currentQuestion?: number; // ex: 1
    totalQuestions?: number;  // ex: 13
    progressValue?: number;   // ex: 10 (porcentagem)
    showProgress?: boolean;
    logoUrl?: string;
    logoAlt?: string;
}

export interface QuestionHeroSectionProps extends BaseSectionProps {
    content: QuestionHeroContent;
    onAnalytics?: (event: string, data?: any) => void;
}

export const QuestionHeroSection: React.FC<QuestionHeroSectionProps> = ({
    id,
    content,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();

    const {
        questionNumber,
        questionText,
        currentQuestion,
        totalQuestions,
        progressValue = 0,
        showProgress = true,
        logoUrl,
        logoAlt = 'Logo',
    } = content;

    React.useEffect(() => {
        onAnalytics?.('section_view', {
            sectionId: id,
            sectionType: 'question-hero',
            questionNumber: currentQuestion,
        });
    }, [id, currentQuestion, onAnalytics]);

    return (
        <SectionContainer
            id={id}
            maxWidth="desktop"
            padding="md"
            animation={animation}
            style={{
                backgroundColor: customStyle?.backgroundColor || 'transparent',
                textAlign: 'center',
                ...customStyle,
            }}
        >
            <AnimatedTransition type="fade" duration={300}>
                {/* Logo (opcional) */}
                {logoUrl && (
                    <div style={{ marginBottom: DesignTokens.spacing.md }}>
                        <img
                            src={logoUrl}
                            alt={logoAlt}
                            width={isMobile ? 72 : 96}
                            height={isMobile ? 72 : 96}
                            style={{
                                margin: '0 auto',
                                display: 'block',
                                borderRadius: DesignTokens.borderRadius.md,
                            }}
                        />
                    </div>
                )}

                {/* Progress Bar */}
                {showProgress && (
                    <div
                        style={{
                            width: '100%',
                            height: 6,
                            backgroundColor: DesignTokens.colors.borderLight,
                            borderRadius: DesignTokens.borderRadius.full,
                            marginBottom: DesignTokens.spacing.lg,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${progressValue}%`,
                                height: '100%',
                                backgroundColor: DesignTokens.colors.primary,
                                transition: `width ${DesignTokens.transitions.slow}`,
                            }}
                        />
                    </div>
                )}

                {/* Question Number */}
                <h2
                    style={{
                        fontSize: isMobile ? DesignTokens.fontSizes.xl : DesignTokens.fontSizes['2xl'],
                        fontWeight: DesignTokens.fontWeights.bold,
                        color: DesignTokens.colors.secondary,
                        marginBottom: DesignTokens.spacing.sm,
                        fontFamily: DesignTokens.fonts.body,
                    }}
                >
                    {questionNumber}
                </h2>

                {/* Question Counter */}
                {currentQuestion && totalQuestions && (
                    <p
                        style={{
                            fontSize: DesignTokens.fontSizes.sm,
                            color: DesignTokens.colors.textSecondary,
                            marginBottom: DesignTokens.spacing.md,
                        }}
                    >
                        Questão {currentQuestion} de {totalQuestions}
                    </p>
                )}

                {/* Question Text */}
                <p
                    style={{
                        fontSize: isMobile ? DesignTokens.fontSizes.lg : DesignTokens.fontSizes.xl,
                        fontWeight: DesignTokens.fontWeights.bold,
                        fontFamily: DesignTokens.fonts.heading,
                        color: DesignTokens.colors.primary,
                        lineHeight: DesignTokens.lineHeights.normal,
                        maxWidth: 800,
                        margin: '0 auto',
                    }}
                >
                    {questionText}
                </p>
            </AnimatedTransition>
        </SectionContainer>
    );
};
