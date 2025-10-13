/**
 * 💰 PricingSection - Seção de preços com destaque
 * 
 * Exibe preço original, desconto e parcelamento
 */

import React from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface PricingInfo {
    originalPrice: number;
    salePrice: number;
    installments?: {
        count: number;
        value: number;
    };
    currency?: string;
}

export interface PricingSectionContent {
    pricing: PricingInfo;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
    features?: string[];
}

export interface PricingSectionProps extends BaseSectionProps {
    content: PricingSectionContent;
    onCtaClick?: () => void;
    onAnalytics?: (event: string, data?: any) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
    id,
    content,
    onCtaClick,
    style: customStyle,
    animation,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();

    const {
        pricing,
        title = 'Oferta Especial',
        subtitle,
        ctaText = 'Quero Aproveitar Esta Oferta!',
        ctaUrl,
        features = [],
    } = content;

    const { originalPrice, salePrice, installments, currency = 'R$' } = pricing;
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    const handleCtaClick = () => {
        onAnalytics?.('cta_click', {
            sectionId: id,
            sectionType: 'pricing',
            price: salePrice,
        });

        if (onCtaClick) {
            onCtaClick();
        } else if (ctaUrl) {
            window.location.href = ctaUrl;
        }
    };

    return (
        <SectionContainer
            id={id}
            maxWidth="tablet"
            padding="xl"
            animation={animation}
            style={{
                backgroundColor: customStyle?.backgroundColor || DesignTokens.colors.backgroundWhite,
                ...customStyle,
            }}
        >
            <AnimatedTransition type="slideUp" duration={500}>
                {/* Card Container */}
                <div
                    style={{
                        backgroundColor: DesignTokens.colors.backgroundWhite,
                        borderRadius: DesignTokens.borderRadius.xl,
                        boxShadow: DesignTokens.shadows.xl,
                        padding: isMobile ? DesignTokens.spacing.lg : DesignTokens.spacing.xl,
                        border: `3px solid ${DesignTokens.colors.primary}`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Discount Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: DesignTokens.colors.error,
                            color: DesignTokens.colors.backgroundWhite,
                            padding: `${DesignTokens.spacing.xs}px ${DesignTokens.spacing.md}px`,
                            borderRadius: DesignTokens.borderRadius.full,
                            fontSize: DesignTokens.fontSizes.sm,
                            fontWeight: DesignTokens.fontWeights.bold,
                            boxShadow: DesignTokens.shadows.md,
                        }}
                    >
                        -{discount}%
                    </div>

                    {/* Title */}
                    {title && (
                        <h3
                            style={{
                                fontSize: isMobile ? DesignTokens.fontSizes.xl : DesignTokens.fontSizes['2xl'],
                                fontWeight: DesignTokens.fontWeights.bold,
                                fontFamily: DesignTokens.fonts.heading,
                                color: DesignTokens.colors.secondary,
                                textAlign: 'center',
                                marginBottom: DesignTokens.spacing.sm,
                            }}
                        >
                            {title}
                        </h3>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            style={{
                                fontSize: DesignTokens.fontSizes.base,
                                color: DesignTokens.colors.textSecondary,
                                textAlign: 'center',
                                marginBottom: DesignTokens.spacing.lg,
                            }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Pricing */}
                    <div style={{ textAlign: 'center', marginBottom: DesignTokens.spacing.lg }}>
                        {/* Original Price */}
                        <p
                            style={{
                                fontSize: DesignTokens.fontSizes.lg,
                                color: DesignTokens.colors.textSecondary,
                                textDecoration: 'line-through',
                                marginBottom: DesignTokens.spacing.xs,
                            }}
                        >
                            De {currency} {originalPrice.toFixed(2).replace('.', ',')}
                        </p>

                        {/* Sale Price */}
                        <p
                            style={{
                                fontSize: isMobile ? DesignTokens.fontSizes['3xl'] : DesignTokens.fontSizes['5xl'],
                                fontWeight: DesignTokens.fontWeights.bold,
                                fontFamily: DesignTokens.fonts.heading,
                                color: DesignTokens.colors.primary,
                                lineHeight: 1,
                                marginBottom: DesignTokens.spacing.xs,
                            }}
                        >
                            {currency} {salePrice.toFixed(2).replace('.', ',')}
                        </p>

                        {/* Installments */}
                        {installments && (
                            <p
                                style={{
                                    fontSize: DesignTokens.fontSizes.base,
                                    color: DesignTokens.colors.textSecondary,
                                }}
                            >
                                ou {installments.count}x de {currency}{' '}
                                {installments.value.toFixed(2).replace('.', ',')}
                            </p>
                        )}
                    </div>

                    {/* Features List */}
                    {features.length > 0 && (
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                marginBottom: DesignTokens.spacing.lg,
                            }}
                        >
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    style={{
                                        fontSize: DesignTokens.fontSizes.base,
                                        color: DesignTokens.colors.textPrimary,
                                        marginBottom: DesignTokens.spacing.sm,
                                        paddingLeft: DesignTokens.spacing.lg,
                                        position: 'relative',
                                    }}
                                >
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: DesignTokens.colors.success,
                                            fontWeight: DesignTokens.fontWeights.bold,
                                        }}
                                    >
                                        ✓
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={handleCtaClick}
                        style={{
                            width: '100%',
                            padding: `${DesignTokens.spacing.lg}px ${DesignTokens.spacing.xl}px`,
                            fontSize: isMobile ? DesignTokens.fontSizes.lg : DesignTokens.fontSizes.xl,
                            fontWeight: DesignTokens.fontWeights.bold,
                            fontFamily: DesignTokens.fonts.body,
                            color: DesignTokens.colors.backgroundWhite,
                            backgroundColor: DesignTokens.colors.primary,
                            border: 'none',
                            borderRadius: DesignTokens.borderRadius.lg,
                            cursor: 'pointer',
                            transition: DesignTokens.transitions.base,
                            boxShadow: DesignTokens.shadows.lg,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = DesignTokens.colors.primaryHover;
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = DesignTokens.shadows.xl;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = DesignTokens.colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = DesignTokens.shadows.lg;
                        }}
                    >
                        {ctaText}
                    </button>
                </div>
            </AnimatedTransition>
        </SectionContainer>
    );
};
