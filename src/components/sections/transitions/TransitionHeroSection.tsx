/**
 * ⏳ TransitionHeroSection - Hero para páginas de transição
 * 
 * Componente para exibir mensagens de carregamento entre etapas
 */

import React, { useEffect } from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface TransitionHeroContent {
    title: string;
    subtitle?: string;
    message?: string;
    autoAdvanceDelay?: number; // ms
}

export interface TransitionHeroSectionProps extends BaseSectionProps {
    content: TransitionHeroContent;
    onComplete?: () => void;
    onAnalytics?: (event: string, data?: any) => void;
}

export const TransitionHeroSection: React.FC<TransitionHeroSectionProps> = ({
    id,
    content,
    onComplete,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();

    const {
        title,
        subtitle,
        message,
        autoAdvanceDelay = 3000,
    } = content;

    useEffect(() => {
        onAnalytics?.('section_view', {
            sectionId: id,
            sectionType: 'transition-hero',
        });

        // Auto-advance após delay
        if (onComplete && autoAdvanceDelay > 0) {
            const timer = setTimeout(() => {
                onComplete();
            }, autoAdvanceDelay);

            return () => clearTimeout(timer);
        }
    }, [id, autoAdvanceDelay, onComplete, onAnalytics]);

    return (
        <SectionContainer
            id={id}
            maxWidth="tablet"
            padding="xl"
            animation={animation}
            style={{
                backgroundColor: customStyle?.backgroundColor || DesignTokens.colors.background,
                textAlign: 'center',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                ...customStyle,
            }}
        >
            <AnimatedTransition type="scale" duration={500}>
                {/* Loading Spinner */}
                <div
                    style={{
                        width: isMobile ? 48 : 64,
                        height: isMobile ? 48 : 64,
                        border: `4px solid ${DesignTokens.colors.borderLight}`,
                        borderTop: `4px solid ${DesignTokens.colors.primary}`,
                        borderRadius: DesignTokens.borderRadius.full,
                        animation: 'spin 1s linear infinite',
                        marginBottom: DesignTokens.spacing.lg,
                    }}
                />

                {/* Title */}
                <h2
                    style={{
                        fontSize: isMobile ? DesignTokens.fontSizes.xl : DesignTokens.fontSizes['2xl'],
                        fontWeight: DesignTokens.fontWeights.bold,
                        fontFamily: DesignTokens.fonts.heading,
                        color: DesignTokens.colors.secondary,
                        marginBottom: subtitle ? DesignTokens.spacing.md : DesignTokens.spacing.lg,
                        lineHeight: DesignTokens.lineHeights.tight,
                    }}
                >
                    {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                    <p
                        style={{
                            fontSize: DesignTokens.fontSizes.lg,
                            fontWeight: DesignTokens.fontWeights.medium,
                            color: DesignTokens.colors.textPrimary,
                            marginBottom: message ? DesignTokens.spacing.md : 0,
                            lineHeight: DesignTokens.lineHeights.normal,
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Message */}
                {message && (
                    <p
                        style={{
                            fontSize: DesignTokens.fontSizes.base,
                            color: DesignTokens.colors.textSecondary,
                            maxWidth: 500,
                            margin: '0 auto',
                            lineHeight: DesignTokens.lineHeights.relaxed,
                        }}
                    >
                        {message}
                    </p>
                )}
            </AnimatedTransition>

            {/* CSS Animation for Spinner */}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </SectionContainer>
    );
};
