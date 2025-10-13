/**
 * 📦 SectionContainer - Container responsivo para seções v3.0
 * 
 * Wrapper reutilizável que aplica estilos consistentes,
 * responsividade e animações para todas as seções
 */

import React, { useEffect, useRef, useState } from 'react';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { SectionContainerProps } from '@/types/section-types';

export const SectionContainer: React.FC<SectionContainerProps> = ({
    children,
    id,
    className = '',
    style = {},
    maxWidth = 'desktop',
    padding = 'md',
    animation,
    onVisible,
}) => {
    const { isMobile, isTablet } = useResponsive();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggeredVisible, setHasTriggeredVisible] = useState(false);

    // Intersection Observer para animações on-scroll
    useEffect(() => {
        if (!containerRef.current || !onVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasTriggeredVisible) {
                        setIsVisible(true);
                        setHasTriggeredVisible(true);
                        onVisible?.();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [onVisible, hasTriggeredVisible]);

    // Calcular max-width baseado no breakpoint
    const getMaxWidth = (): string => {
        if (maxWidth === 'full') return '100%';

        const widthMap = {
            mobile: DesignTokens.layout.maxWidth.mobile,
            tablet: DesignTokens.layout.maxWidth.tablet,
            desktop: DesignTokens.layout.maxWidth.desktop,
            wide: DesignTokens.layout.maxWidth.wide,
        };

        return widthMap[maxWidth];
    };

    // Calcular padding baseado no breakpoint
    const getPadding = (): number => {
        const paddingMap = {
            none: 0,
            sm: DesignTokens.spacing.sm,
            md: DesignTokens.spacing.md,
            lg: DesignTokens.spacing.lg,
            xl: DesignTokens.spacing.xl,
        };

        const basePadding = paddingMap[padding];

        // Reduzir padding em mobile
        if (isMobile) return Math.max(basePadding * 0.5, DesignTokens.spacing.sm);
        if (isTablet) return Math.max(basePadding * 0.75, DesignTokens.spacing.md);

        return basePadding;
    };

    // Gerar estilos de animação
    const getAnimationStyles = (): React.CSSProperties => {
        if (!animation || animation.type === 'none') return {};

        const duration = animation.duration || 500;
        const delay = animation.delay || 0;
        const easing = animation.easing || 'ease-out';

        const baseStyles: React.CSSProperties = {
            transition: `all ${duration}ms ${easing} ${delay}ms`,
        };

        if (!isVisible && animation.type) {
            switch (animation.type) {
                case 'fade':
                    return {
                        ...baseStyles,
                        opacity: 0,
                    };
                case 'slide':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(20px)',
                    };
                case 'scale':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'scale(0.95)',
                    };
            }
        }

        return {
            ...baseStyles,
            opacity: 1,
            transform: 'none',
        };
    };

    const containerStyles: React.CSSProperties = {
        width: '100%',
        maxWidth: getMaxWidth(),
        margin: '0 auto',
        padding: `${getPadding()}px`,
        boxSizing: 'border-box',
        ...getAnimationStyles(),
        ...style,
    };

    return (
        <div
            ref={containerRef}
            id={id}
            className={`section-container ${className}`}
            style={containerStyles}
        >
            {children}
        </div>
    );
};

// Variant específico para seções com background
export const SectionCard: React.FC<SectionContainerProps & {
    backgroundColor?: string;
    borderRadius?: keyof typeof DesignTokens.borderRadius;
    shadow?: keyof typeof DesignTokens.shadows;
}> = ({
    children,
    backgroundColor = DesignTokens.colors.backgroundWhite,
    borderRadius = 'lg',
    shadow = 'base',
    ...containerProps
}) => {
        const cardStyles: React.CSSProperties = {
            backgroundColor,
            borderRadius: DesignTokens.borderRadius[borderRadius],
            boxShadow: DesignTokens.shadows[shadow],
        };

        return (
            <SectionContainer {...containerProps} style={cardStyles}>
                {children}
            </SectionContainer>
        );
    };
