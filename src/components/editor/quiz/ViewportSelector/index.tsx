/**
 * 📱 ViewportSelector - Controle de Viewport Responsivo
 * 
 * Permite alternar entre diferentes tamanhos de viewport para testes:
 * - Mobile: 375px (iPhone SE)
 * - Tablet: 768px (iPad)
 * - Desktop: 1280px (Desktop padrão)
 * - Full: 100% (sem restrições)
 * 
 * @version 1.0.0
 */

import React from 'react';
import { Monitor, Smartphone, Tablet, Maximize } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full';

export interface ViewportConfig {
    id: ViewportSize;
    label: string;
    width: number | '100%';
    icon: React.ReactNode;
    shortcut: string;
}

export const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
    mobile: {
        id: 'mobile',
        label: 'Mobile (375px)',
        width: 375,
        icon: <Smartphone className="w-4 h-4" />,
        shortcut: 'Ctrl+Alt+1',
    },
    tablet: {
        id: 'tablet',
        label: 'Tablet (768px)',
        width: 768,
        icon: <Tablet className="w-4 h-4" />,
        shortcut: 'Ctrl+Alt+2',
    },
    desktop: {
        id: 'desktop',
        label: 'Desktop (1280px)',
        width: 1280,
        icon: <Monitor className="w-4 h-4" />,
        shortcut: 'Ctrl+Alt+3',
    },
    full: {
        id: 'full',
        label: 'Full Width',
        width: '100%',
        icon: <Maximize className="w-4 h-4" />,
        shortcut: 'Ctrl+Alt+0',
    },
};

export interface ViewportSelectorProps {
    /** Viewport atual */
    value: ViewportSize;
    /** Callback quando viewport muda */
    onChange: (viewport: ViewportSize) => void;
    /** Desabilitar seletor */
    disabled?: boolean;
    /** Classes CSS adicionais */
    className?: string;
}

export function ViewportSelector({
    value,
    onChange,
    disabled = false,
    className = '',
}: ViewportSelectorProps) {
    const handleChange = (newValue: string) => {
        if (newValue && newValue !== value) {
            onChange(newValue as ViewportSize);
        }
    };

    return (
        <TooltipProvider>
            <div className={`flex items-center gap-2 ${className}`}>
                <span className="text-xs text-muted-foreground font-medium">Viewport:</span>
                <ToggleGroup
                    type="single"
                    value={value}
                    onValueChange={handleChange}
                    disabled={disabled}
                    className="gap-1"
                >
                    {Object.values(VIEWPORT_CONFIGS).map((config) => (
                        <Tooltip key={config.id}>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem
                                    value={config.id}
                                    aria-label={config.label}
                                    className="px-2 py-1.5 min-w-[40px]"
                                >
                                    {config.icon}
                                    <span className="ml-1.5 hidden sm:inline text-xs">
                                        {config.width === '100%' ? 'Full' : `${config.width}px`}
                                    </span>
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-xs">
                                    <div className="font-semibold">{config.label}</div>
                                    <div className="text-muted-foreground mt-0.5">{config.shortcut}</div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </ToggleGroup>
            </div>
        </TooltipProvider>
    );
}

export default ViewportSelector;
