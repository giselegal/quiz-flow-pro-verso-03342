/**
 * 🎭 ResponsiveWrapper - Renderização condicional baseada em breakpoints
 * 
 * Componente para mostrar diferentes versões de conteúdo
 * dependendo do dispositivo/breakpoint
 */

import React, { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveWrapperProps {
    mobile?: ReactNode;
    tablet?: ReactNode;
    desktop?: ReactNode;
    fallback?: ReactNode;
    children?: ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
    mobile,
    tablet,
    desktop,
    fallback,
    children,
}) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();

    // Prioridade: específico > fallback > children
    if (isMobile && mobile) return <>{mobile}</>;
    if (isTablet && tablet) return <>{tablet}</>;
    if (isDesktop && desktop) return <>{desktop}</>;
    if (fallback) return <>{fallback}</>;

    return <>{children}</>;
};

// Componentes utilitários
export const ShowOnMobile: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isMobile } = useResponsive();
    return isMobile ? <>{children}</> : null;
};

export const ShowOnTablet: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isTablet } = useResponsive();
    return isTablet ? <>{children}</> : null;
};

export const ShowOnDesktop: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isDesktop } = useResponsive();
    return isDesktop ? <>{children}</> : null;
};

export const HideOnMobile: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isMobile } = useResponsive();
    return !isMobile ? <>{children}</> : null;
};

export const HideOnDesktop: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isDesktop } = useResponsive();
    return !isDesktop ? <>{children}</> : null;
};
