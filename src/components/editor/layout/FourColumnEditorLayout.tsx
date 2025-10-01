import React from 'react';
import clsx from 'clsx';

export interface FourColumnEditorLayoutProps {
    sidebar: React.ReactNode;          // Coluna 1: Steps
    palette: React.ReactNode;          // Coluna 2: Componentes / Blocks
    canvas: React.ReactNode;           // Coluna 3: Canvas
    properties: React.ReactNode;       // Coluna 4: Painel de propriedades
    className?: string;
}

/**
 * Layout base 4 colunas (desktop). Em telas menores algumas colunas podem ser colapsadas futuramente.
 * Grid fixa por enquanto: 260px | 240px | 1fr | 360px.
 */
export const FourColumnEditorLayout: React.FC<FourColumnEditorLayoutProps> = ({
    sidebar,
    palette,
    canvas,
    properties,
    className
}) => {
    return (
        <div className={clsx('w-full h-full grid', 'grid-cols-[260px_240px_1fr_360px]', 'overflow-hidden', className)}>
            <div className="border-r bg-white flex flex-col min-h-0 overflow-y-auto">{sidebar}</div>
            <div className="border-r bg-neutral-50 flex flex-col min-h-0 overflow-y-auto">{palette}</div>
            <div className="bg-background flex flex-col min-h-0 overflow-hidden">{canvas}</div>
            <div className="border-l bg-white flex flex-col min-h-0 overflow-y-auto">{properties}</div>
        </div>
    );
};

export default FourColumnEditorLayout;
