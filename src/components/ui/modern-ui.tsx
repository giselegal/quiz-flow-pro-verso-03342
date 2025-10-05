/**
 * 🎨 SISTEMA DE COMPONENTES UI MODERNOS
 * 
 * Componentes customizados independentes para interface visual
 */

import React, { HTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import './modern-ui.css';

// ============================================================================
// INTERFACES BASE
// ============================================================================

interface BaseUIProps {
    className?: string;
    children?: ReactNode;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseUIProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseUIProps {
    variant?: 'elevated' | 'outlined' | 'ghost';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface FlexProps extends HTMLAttributes<HTMLDivElement>, BaseUIProps {
    direction?: 'row' | 'column';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    gap?: number;
    wrap?: boolean;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseUIProps {
    icon: ReactNode;
    'aria-label': string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export interface TooltipProps extends BaseUIProps {
    label: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

// ============================================================================
// COMPONENTES UI
// ============================================================================

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseClass = 'modern-button';
    const variantClass = `modern-button--${variant}`;
    const sizeClass = `modern-button--${size}`;
    const loadingClass = isLoading ? 'modern-button--loading' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {leftIcon && <span className="modern-button__left-icon">{leftIcon}</span>}
            {isLoading ? <span className="modern-spinner" /> : children}
            {rightIcon && <span className="modern-button__right-icon">{rightIcon}</span>}
        </button>
    );
};

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'elevated',
    padding = 'md',
    ...props
}) => {
    const baseClass = 'modern-card';
    const variantClass = `modern-card--${variant}`;
    const paddingClass = `modern-card--padding-${padding}`;

    return (
        <div
            className={`${baseClass} ${variantClass} ${paddingClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const Flex: React.FC<FlexProps> = ({
    children,
    className = '',
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    gap = 0,
    wrap = false,
    style,
    ...props
}) => {
    const flexStyle = {
        display: 'flex',
        flexDirection: direction,
        alignItems: align === 'start' ? 'flex-start' :
            align === 'end' ? 'flex-end' :
                align === 'center' ? 'center' : 'stretch',
        justifyContent: justify === 'start' ? 'flex-start' :
            justify === 'end' ? 'flex-end' :
                justify === 'between' ? 'space-between' :
                    justify === 'around' ? 'space-around' :
                        justify === 'evenly' ? 'space-evenly' : 'center',
        gap: gap ? `${gap}px` : undefined,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style
    };

    return (
        <div
            className={`modern-flex ${className}`}
            style={flexStyle}
            {...props}
        >
            {children}
        </div>
    );
};

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    className = '',
    size = 'md',
    variant = 'secondary',
    disabled,
    ...props
}) => {
    const baseClass = 'modern-icon-button';
    const variantClass = `modern-icon-button--${variant}`;
    const sizeClass = `modern-icon-button--${size}`;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {icon}
        </button>
    );
};

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    label,
    placement = 'top',
    className = ''
}) => {
    return (
        <div className={`modern-tooltip-wrapper ${className}`}>
            {children}
            <div className={`modern-tooltip modern-tooltip--${placement}`}>
                {label}
            </div>
        </div>
    );
};

// ============================================================================
// COMPONENTES DE LAYOUT
// ============================================================================

export const VStack: React.FC<Omit<FlexProps, 'direction'>> = (props) => (
    <Flex direction="column" {...props} />
);

export const HStack: React.FC<Omit<FlexProps, 'direction'>> = (props) => (
    <Flex direction="row" {...props} />
);

export const Container: React.FC<BaseUIProps> = ({
    children,
    className = '',
    ...props
}) => (
    <div className={`modern-container ${className}`} {...props}>
        {children}
    </div>
);

export const Box: React.FC<HTMLAttributes<HTMLDivElement> & BaseUIProps> = ({
    children,
    className = '',
    ...props
}) => (
    <div className={`modern-box ${className}`} {...props}>
        {children}
    </div>
);

// ============================================================================
// COMPONENTES DE TEXTO
// ============================================================================

export interface TextProps extends HTMLAttributes<HTMLElement>, BaseUIProps {
    as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
}

export const Text: React.FC<TextProps> = ({
    children,
    as: Component = 'p',
    size = 'md',
    weight = 'normal',
    color,
    className = '',
    style,
    ...props
}) => {
    const textStyle = {
        fontSize: size === 'xs' ? '12px' :
            size === 'sm' ? '14px' :
                size === 'md' ? '16px' :
                    size === 'lg' ? '18px' :
                        size === 'xl' ? '20px' : '24px',
        fontWeight: weight === 'normal' ? 400 :
            weight === 'medium' ? 500 :
                weight === 'semibold' ? 600 : 700,
        color: color || undefined,
        ...style
    };

    return (
        <Component
            className={`modern-text ${className}`}
            style={textStyle}
            {...props}
        >
            {children}
        </Component>
    );
};

export const Heading: React.FC<TextProps> = (props) => (
    <Text weight="bold" {...props} />
);