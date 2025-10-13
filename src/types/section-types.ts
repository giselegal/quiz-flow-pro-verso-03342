/**
 * 🔧 Section Types - Tipos base para todas as seções v3.0
 * 
 * Define interfaces e tipos para o sistema de seções modulares
 */

import { ReactNode } from 'react';

// ================================
// BASE SECTION INTERFACE
// ================================

export interface BaseSectionProps {
    id: string;
    type: string;
    content: Record<string, any>;
    style?: SectionStyle;
    animation?: SectionAnimation;
    responsive?: ResponsiveConfig;
}

export interface SectionStyle {
    backgroundColor?: string;
    textColor?: string;
    padding?: string | number;
    margin?: string | number;
    borderRadius?: string | number;
    boxShadow?: string;
}

export interface SectionAnimation {
    type?: 'fade' | 'slide' | 'scale' | 'none';
    duration?: number;
    delay?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface ResponsiveConfig {
    mobile?: Partial<SectionStyle>;
    tablet?: Partial<SectionStyle>;
    desktop?: Partial<SectionStyle>;
}

// ================================
// SECTION CATEGORIES
// ================================

export type SectionCategory =
    | 'intro'
    | 'question'
    | 'transition'
    | 'result'
    | 'offer'
    | 'shared';

// ================================
// VALIDATION
// ================================

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
}

export interface ValidationState {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// ================================
// ANALYTICS
// ================================

export interface SectionAnalytics {
    sectionId: string;
    sectionType: string;
    event: 'view' | 'interaction' | 'completion' | 'error';
    timestamp: number;
    data?: Record<string, any>;
}

export interface AnalyticsCallback {
    (event: SectionAnalytics): void;
}

// ================================
// COMMON CONTENT TYPES
// ================================

export interface ImageContent {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
}

export interface ButtonContent {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
}

export interface TextContent {
    text: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
    align?: 'left' | 'center' | 'right';
    color?: string;
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

// ================================
// SECTION CONTAINER PROPS
// ================================

export interface SectionContainerProps {
    children: ReactNode;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    maxWidth?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    animation?: SectionAnimation;
    onVisible?: () => void;
}

// ================================
// THEME CONTEXT
// ================================

export interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        border: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    spacing: Record<string, number>;
    borderRadius: Record<string, number>;
}

// ================================
// SECTION REGISTRY
// ================================

export interface SectionComponent<T extends BaseSectionProps = BaseSectionProps> {
    type: string;
    component: React.ComponentType<T>;
    category: SectionCategory;
    displayName: string;
    description?: string;
    defaultContent?: Partial<T['content']>;
}

export type SectionRegistry = Record<string, SectionComponent>;
