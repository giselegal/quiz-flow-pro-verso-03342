/**
 * 🎯 Responsive Layout - Componente de layout responsivo
 * 
 * Wrapper para garantir consistência de layout em diferentes breakpoints:
 * - 375px (mobile)
 * - 768px (tablet)
 * - 1024px (desktop)
 * - 1280px (large desktop)
 * 
 * @see Fase 6 - UX/Design e feedback de estado
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Tipo de container */
  variant?: 'full' | 'contained' | 'narrow';
  /** Padding responsivo */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Se deve centralizar o conteúdo */
  center?: boolean;
}

/**
 * Container responsivo principal
 */
export function ResponsiveLayout({
  children,
  className,
  variant = 'contained',
  padding = 'md',
  center = false,
}: ResponsiveLayoutProps) {
  const variantClasses = {
    full: 'w-full',
    contained: 'w-full max-w-7xl mx-auto',
    narrow: 'w-full max-w-3xl mx-auto',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4 md:px-6',
    md: 'px-4 sm:px-6 md:px-8 lg:px-12',
    lg: 'px-6 sm:px-8 md:px-12 lg:px-16',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        center && 'flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid responsivo para layouts de cards/items
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  /** Colunas em diferentes breakpoints */
  cols?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
    large?: 4 | 5 | 6;
  };
  /** Gap entre items */
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const colClasses = [
    `grid-cols-${cols.mobile || 1}`,
    `sm:grid-cols-${cols.tablet || 2}`,
    `md:grid-cols-${cols.desktop || 3}`,
    `lg:grid-cols-${cols.large || 4}`,
  ].join(' ');

  const gapClasses = {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-4 sm:gap-5 md:gap-6',
    lg: 'gap-6 sm:gap-7 md:gap-8',
  };

  return (
    <div className={cn('grid', colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

/**
 * Stack responsivo (vertical em mobile, horizontal em desktop)
 */
interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  /** Breakpoint para mudar de vertical para horizontal */
  breakAt?: 'sm' | 'md' | 'lg';
  /** Gap entre items */
  gap?: 'sm' | 'md' | 'lg';
  /** Alinhamento vertical */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Alinhamento horizontal */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function ResponsiveStack({
  children,
  className,
  breakAt = 'md',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
}: ResponsiveStackProps) {
  const breakClasses = {
    sm: 'sm:flex-row',
    md: 'md:flex-row',
    lg: 'lg:flex-row',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        breakClasses[breakAt],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Componente para mostrar/esconder baseado em breakpoint
 */
interface ResponsiveShowProps {
  children: React.ReactNode;
  /** Mostrar apenas acima deste breakpoint */
  above?: 'sm' | 'md' | 'lg' | 'xl';
  /** Mostrar apenas abaixo deste breakpoint */
  below?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveShow({
  children,
  above,
  below,
  className,
}: ResponsiveShowProps) {
  const aboveClasses = {
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
  };

  const belowClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
  };

  const showClass = above
    ? aboveClasses[above]
    : below
    ? belowClasses[below]
    : '';

  return <div className={cn(showClass, className)}>{children}</div>;
}

/**
 * Hook para detectar breakpoint atual
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1280) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('large');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'large',
    isLarge: breakpoint === 'large',
  };
}

export default ResponsiveLayout;
