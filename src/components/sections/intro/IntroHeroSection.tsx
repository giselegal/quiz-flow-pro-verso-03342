/**
 * 🚀 IntroHeroSection - Seção hero para página de introdução
 * 
 * Componente modular para apresentação inicial do quiz
 */

import React from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface IntroHeroContent {
    logoUrl?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    showProgress?: boolean;
    progressValue?: number;
}

export interface IntroHeroSectionProps extends BaseSectionProps {
    content: IntroHeroContent;
    onAnalytics?: (event: string, data?: any) => void;
}

export const IntroHeroSection: React.FC<IntroHeroSectionProps> = ({
    id,
    content,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();

    const {
        logoUrl,
        logoAlt = 'Logo',
        logoWidth = 96,
        logoHeight = 96,
        title,
        subtitle,
        imageUrl,
        imageAlt = 'Hero Image',
        description,
        showProgress = false,
        progressValue = 0,
    } = content;

    // Analytics: track section view
    React.useEffect(() => {
        onAnalytics?.('section_view', { sectionId: id, sectionType: 'intro-hero' });
    }, [id, onAnalytics]);

    const containerStyles: React.CSSProperties = {
        backgroundColor: customStyle?.backgroundColor || DesignTokens.colors.background,
        color: customStyle?.textColor || DesignTokens.colors.textPrimary,
        textAlign: 'center',
        ...customStyle,
    };

    return (
        <SectionContainer
            id={id}
            maxWidth="desktop"
            padding="lg"
            animation={animation}
            style={containerStyles}
        >
            <AnimatedTransition type="fade" duration={400}>
                {/* Logo */}
                {logoUrl && (
                    <div style={{ marginBottom: DesignTokens.spacing.lg }}>
                        <img
                            src={logoUrl}
                            alt={logoAlt}
                            width={isMobile ? logoWidth * 0.75 : logoWidth}
                            height={isMobile ? logoHeight * 0.75 : logoHeight}
                            style={{
                                margin: '0 auto',
                                display: 'block',
                                borderRadius: DesignTokens.borderRadius.md,
                            }}
                        />
                    </div>
                )}

                {/* Progress Bar (opcional) */}
                {showProgress && (
                    <div
                        style={{
                            width: '100%',
                            height: 4,
                            backgroundColor: DesignTokens.colors.borderLight,
                            borderRadius: DesignTokens.borderRadius.full,
                            marginBottom: DesignTokens.spacing.md,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${progressValue}%`,
                                height: '100%',
                                backgroundColor: DesignTokens.colors.primary,
                                transition: DesignTokens.transitions.base,
                            }}
                        />
                    </div>
                )}

                {/* Decorative Bar */}
                <div
                    style={{
                        width: '100%',
                        height: 4,
                        backgroundColor: DesignTokens.colors.primary,
                        marginBottom: DesignTokens.spacing.lg,
                        borderRadius: DesignTokens.borderRadius.sm,
                    }}
                />

                {/* Title */}
                <h1
                    style={{
                        fontSize: isMobile ? DesignTokens.fontSizes['2xl'] : DesignTokens.fontSizes['3xl'],
                        fontWeight: DesignTokens.fontWeights.bold,
                        fontFamily: DesignTokens.fonts.heading,
                        color: DesignTokens.colors.secondary,
                        marginBottom: DesignTokens.spacing.md,
                        lineHeight: DesignTokens.lineHeights.tight,
                    }}
                    dangerouslySetInnerHTML={{ __html: title }}
                />

                {/* Hero Image */}
                {imageUrl && (
                    <div style={{ marginBottom: DesignTokens.spacing.lg }}>
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: DesignTokens.borderRadius.lg,
                                boxShadow: DesignTokens.shadows.md,
                                margin: '0 auto',
                                display: 'block',
                            }}
                        />
                    </div>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <p
                        style={{
                            fontSize: isMobile ? DesignTokens.fontSizes.lg : DesignTokens.fontSizes.xl,
                            fontWeight: DesignTokens.fontWeights.medium,
                            color: DesignTokens.colors.secondary,
                            marginBottom: description ? DesignTokens.spacing.md : 0,
                            lineHeight: DesignTokens.lineHeights.normal,
                        }}
                        dangerouslySetInnerHTML={{ __html: subtitle }}
                    />
                )}

                {/* Description */}
                {description && (
                    <p
                        style={{
                            fontSize: DesignTokens.fontSizes.base,
                            color: DesignTokens.colors.textSecondary,
                            lineHeight: DesignTokens.lineHeights.relaxed,
                            maxWidth: 600,
                            margin: '0 auto',
                        }}
                    >
                        {description}
                    </p>
                )}
            </AnimatedTransition>
        </SectionContainer>
    );
};
