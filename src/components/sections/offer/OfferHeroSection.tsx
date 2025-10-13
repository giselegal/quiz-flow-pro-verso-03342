/**
 * 🎁 OfferHeroSection - Hero para página de oferta
 * 
 * Cabeçalho chamativo para apresentar a oferta final
 */

import React from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface OfferHeroContent {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    urgencyMessage?: string;
}

export interface OfferHeroSectionProps extends BaseSectionProps {
    content: OfferHeroContent;
    userName?: string;
    onAnalytics?: (event: string, data?: any) => void;
}

export const OfferHeroSection: React.FC<OfferHeroSectionProps> = ({
    id,
    content,
    userName,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();

    const {
        title,
        subtitle,
        imageUrl,
        imageAlt = 'Oferta',
        description,
        urgencyMessage,
    } = content;

    // Replace {userName} no title
    const formattedTitle = userName ? title.replace('{userName}', userName) : title;

    React.useEffect(() => {
        onAnalytics?.('section_view', {
            sectionId: id,
            sectionType: 'offer-hero',
            hasUser: !!userName,
        });
    }, [id, userName, onAnalytics]);

    return (
        <SectionContainer
            id={id}
            maxWidth="desktop"
            padding="xl"
            animation={animation}
            style={{
                backgroundColor: customStyle?.backgroundColor || DesignTokens.colors.background,
                textAlign: 'center',
                ...customStyle,
            }}
        >
            <AnimatedTransition type="scale" duration={500}>
                {/* Title */}
                <h1
                    style={{
                        fontSize: isMobile ? DesignTokens.fontSizes['2xl'] : DesignTokens.fontSizes['4xl'],
                        fontWeight: DesignTokens.fontWeights.bold,
                        fontFamily: DesignTokens.fonts.heading,
                        color: DesignTokens.colors.primary,
                        marginBottom: DesignTokens.spacing.md,
                        lineHeight: DesignTokens.lineHeights.tight,
                    }}
                >
                    {formattedTitle}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p
                        style={{
                            fontSize: isMobile ? DesignTokens.fontSizes.lg : DesignTokens.fontSizes.xl,
                            fontWeight: DesignTokens.fontWeights.medium,
                            color: DesignTokens.colors.textPrimary,
                            marginBottom: DesignTokens.spacing.lg,
                            lineHeight: DesignTokens.lineHeights.normal,
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Urgency Message */}
                {urgencyMessage && (
                    <div
                        style={{
                            display: 'inline-block',
                            padding: `${DesignTokens.spacing.sm}px ${DesignTokens.spacing.lg}px`,
                            backgroundColor: DesignTokens.colors.warning,
                            color: DesignTokens.colors.backgroundWhite,
                            borderRadius: DesignTokens.borderRadius.lg,
                            fontSize: DesignTokens.fontSizes.sm,
                            fontWeight: DesignTokens.fontWeights.bold,
                            marginBottom: DesignTokens.spacing.lg,
                            boxShadow: DesignTokens.shadows.md,
                        }}
                    >
                        ⏰ {urgencyMessage}
                    </div>
                )}

                {/* Hero Image */}
                {imageUrl && (
                    <div style={{ marginBottom: DesignTokens.spacing.xl }}>
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: DesignTokens.borderRadius.xl,
                                boxShadow: DesignTokens.shadows.lg,
                                margin: '0 auto',
                                display: 'block',
                            }}
                        />
                    </div>
                )}

                {/* Description */}
                {description && (
                    <p
                        style={{
                            fontSize: DesignTokens.fontSizes.lg,
                            color: DesignTokens.colors.textSecondary,
                            lineHeight: DesignTokens.lineHeights.relaxed,
                            maxWidth: 700,
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
