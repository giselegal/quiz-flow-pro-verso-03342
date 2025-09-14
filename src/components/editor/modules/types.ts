import { UserComponent } from '@craftjs/core';

// Tipos base para propriedades dos módulos
export interface BaseModuleProps {
    className?: string;
    isSelected?: boolean;
    onPropertyChange?: (key: string, value: any) => void;
}

// Sistema de responsividade mobile-first
export const breakpoints = {
    sm: '640px',   // Mobile large
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px' // Extra large
} as const;

// Hook personalizado para responsividade
export const useResponsive = () => {
    // Implementação será adicionada quando necessário
    return { isSmall: false, isMedium: false, isLarge: false };
};

// Configuração padrão de cores do tema
export const themeColors = {
    primary: '#B89B7A',
    secondary: '#aa6b5d',
    brown: '#432818',
    lightBrown: '#6B4F43',
    beige: '#8F7A6A',
    background: '#F3E8E6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
} as const;

// Utilitários para Craft.js
export const withCraftjsComponent = <T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    craft: Partial<UserComponent<T>>
): React.ComponentType<T> & { craft: UserComponent<T> } => {
    const WrappedComponent = Component as any;
    WrappedComponent.craft = craft;
    return WrappedComponent;
};

// Classes utilitárias para responsividade
export const responsiveClasses = {
    container: {
        small: 'max-w-sm mx-auto',
        medium: 'max-w-md mx-auto',
        large: 'max-w-lg mx-auto',
        full: 'w-full'
    },
    spacing: {
        small: 'p-2 gap-2',
        normal: 'p-4 gap-4',
        large: 'p-6 gap-6'
    },
    text: {
        small: 'text-sm',
        normal: 'text-base',
        large: 'text-lg'
    }
} as const;