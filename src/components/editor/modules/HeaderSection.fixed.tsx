import React, { useEffect, useState } from 'react';
import { useEditor } from '@craftjs/core';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';

export interface HeaderSectionProps extends BaseModuleProps {
    // Logo props
    logoUrl?: string;
    logoAlt?: string;
    logoSize?: 'sm' | 'md' | 'lg';
    showLogo?: boolean;

    // Text props
    title?: string;
    subtitle?: string;
    showTitle?: boolean;
    showSubtitle?: boolean;

    // Layout props
    alignment?: 'left' | 'center' | 'right';
    layout?: 'horizontal' | 'vertical' | 'logo-only' | 'text-only';

    // Visual props
    backgroundColor?: string;
    textColor?: string;
    titleSize?: 'sm' | 'md' | 'lg';
    subtitleSize?: 'sm' | 'md' | 'lg';

    // Animation props
    animation?: 'none' | 'fade' | 'slide' | 'bounce';
    animationDelay?: number;
    animationDuration?: number;
}

const HeaderSectionComponent: React.FC<HeaderSectionProps> = ({
    logoUrl = '/logo.png',
    logoAlt = 'Logo',
    logoSize = 'md',
    showLogo = true,
    title = 'Título',
    subtitle = 'Subtítulo',
    showTitle = true,
    showSubtitle = true,
    alignment = 'center',
    layout = 'horizontal',
    backgroundColor = 'transparent',
    textColor = themeColors.text,
    titleSize = 'md',
    subtitleSize = 'sm',
    animation = 'fade',
    animationDelay = 0,
    animationDuration = 500,
    className = '',
    isSelected = false,
    onPropertyChange,
}) => {
    const { connectors: { connect, drag }, setProp } = useEditor((node) => ({ node }));

    return (
        <div
            ref={connect}
            className={cn(
                'header-section relative transition-all duration-300',
                'flex items-center justify-center',
                layout === 'vertical' && 'flex-col',
                layout === 'horizontal' && 'flex-row gap-4',
                alignment === 'left' && 'justify-start',
                alignment === 'center' && 'justify-center',
                alignment === 'right' && 'justify-end',
                className
            )}
            style={{
                backgroundColor,
                color: textColor,
                padding: '1rem',
            }}
        >
            {/* Logo */}
            {showLogo && (layout === 'horizontal' || layout === 'vertical' || layout === 'logo-only') && (
                <div className={cn(
                    'logo-container',
                    logoSize === 'sm' && 'w-8 h-8',
                    logoSize === 'md' && 'w-12 h-12',
                    logoSize === 'lg' && 'w-16 h-16'
                )}>
                    <img src={logoUrl} alt={logoAlt} className="w-full h-full object-contain" />
                </div>
            )}

            {/* Text Content */}
            {(layout === 'horizontal' || layout === 'vertical' || layout === 'text-only') && (
                <div className={cn(
                    'text-content',
                    layout === 'vertical' && 'text-center mt-2',
                    layout === 'horizontal' && alignment === 'center' && 'text-center',
                    layout === 'horizontal' && alignment === 'left' && 'text-left',
                    layout === 'horizontal' && alignment === 'right' && 'text-right'
                )}>
                    {showTitle && (
                        <h1 className={cn(
                            'header-title font-bold',
                            titleSize === 'sm' && 'text-lg',
                            titleSize === 'md' && 'text-xl',
                            titleSize === 'lg' && 'text-2xl'
                        )}>
                            {title}
                        </h1>
                    )}

                    {showSubtitle && (
                        <h2 className={cn(
                            'header-subtitle opacity-80',
                            subtitleSize === 'sm' && 'text-sm',
                            subtitleSize === 'md' && 'text-base',
                            subtitleSize === 'lg' && 'text-lg',
                            showTitle && 'mt-1'
                        )}>
                            {subtitle}
                        </h2>
                    )}
                </div>
            )}

            {/* Selected outline */}
            {isSelected && (
                <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded pointer-events-none" />
            )}
        </div>
    );
};

// Configurações do Craft.js para o HeaderSection
export const HeaderSection = withCraftjsComponent(HeaderSectionComponent);

export default HeaderSection;