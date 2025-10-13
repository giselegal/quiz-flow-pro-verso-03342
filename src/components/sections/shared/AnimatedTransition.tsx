/**
 * ✨ AnimatedTransition - Transições suaves entre componentes
 * 
 * Wrapper para adicionar animações de entrada/saída
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { DesignTokens } from '@/styles/design-tokens';
import { usePrefersReducedMotion } from '@/hooks/useResponsive';

interface AnimatedTransitionProps {
    children: ReactNode;
    type?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown' | 'none';
    duration?: number;
    delay?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    trigger?: boolean; // Para controlar animação externamente
    className?: string;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
    children,
    type = 'fade',
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    trigger = true,
    className = '',
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (trigger) {
            // Pequeno delay para garantir que CSS transition funcione
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [trigger]);

    // Se usuário prefere movimento reduzido, não animar
    if (prefersReducedMotion || type === 'none') {
        return <div className={className}>{children}</div>;
    }

    const getTransitionStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            transition: `all ${duration}ms ${easing} ${delay}ms`,
        };

        if (!isVisible) {
            switch (type) {
                case 'fade':
                    return {
                        ...baseStyles,
                        opacity: 0,
                    };
                case 'slide':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateX(-20px)',
                    };
                case 'slideUp':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(20px)',
                    };
                case 'slideDown':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(-20px)',
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

    return (
        <div className={`animated-transition ${className}`} style={getTransitionStyles()}>
            {children}
        </div>
    );
};

// Componente de transição com fade rápido
export const FadeTransition: React.FC<{ children: ReactNode; trigger?: boolean }> = ({
    children,
    trigger = true,
}) => (
    <AnimatedTransition type="fade" duration={200} trigger={trigger}>
        {children}
    </AnimatedTransition>
);

// Componente de transição com slide suave
export const SlideTransition: React.FC<{ children: ReactNode; trigger?: boolean }> = ({
    children,
    trigger = true,
}) => (
    <AnimatedTransition type="slideUp" duration={300} trigger={trigger}>
        {children}
    </AnimatedTransition>
);
