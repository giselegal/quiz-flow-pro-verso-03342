/**
 * 📐 ViewportContainer - Container com Viewport Responsivo
 * 
 * Wrapper que aplica restrições de largura baseadas no viewport selecionado.
 * Usado para testar responsividade do canvas em diferentes tamanhos de tela.
 * 
 * @version 1.0.0
 */

import React from 'react';
import type { ViewportSize } from './index';
import { VIEWPORT_CONFIGS } from './index';

export interface ViewportContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Tamanho do viewport */
    viewport: ViewportSize;
    /** Conteúdo a ser renderizado */
    children: React.ReactNode;
    /** Classes CSS adicionais */
    className?: string;
    /** Mostrar régua de medida */
    showRuler?: boolean;
}

export function ViewportContainer({
    viewport,
    children,
    className = '',
    showRuler = false,
    ...rest
}: ViewportContainerProps) {
    const config = VIEWPORT_CONFIGS[viewport];
    const width = config.width;

    const containerStyle: React.CSSProperties = {
        width: width === '100%' ? '100%' : `${width}px`,
        maxWidth: '100%',
        margin: width === '100%' ? '0' : '0 auto',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <div className={`viewport-container-wrapper ${className}`}>
            {showRuler && viewport !== 'full' && (
                <div className="flex items-center justify-center py-2 px-4 bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono font-semibold">{width}px</span>
                        <span>•</span>
                        <span>{config.label}</span>
                    </div>
                </div>
            )}
            <div
                className="viewport-container"
                style={containerStyle}
                data-viewport={viewport}
                data-width={width}
                {...rest}
            >
                {children}
            </div>
        </div>
    );
}

export default ViewportContainer;
