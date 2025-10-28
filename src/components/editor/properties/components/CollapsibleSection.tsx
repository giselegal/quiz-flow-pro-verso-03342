/**
 * 🎨 COLLAPSIBLE SECTION COMPONENT
 * 
 * Seção expansível reutilizável para o painel de propriedades
 * Usa Accordion do shadcn/ui com customizações
 * 
 * Features:
 * - ✅ Ícone customizável
 * - ✅ Badge de contador
 * - ✅ Estado aberto/fechado
 * - ✅ Animação suave
 */

import React from 'react';
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface CollapsibleSectionProps {
    id: string;
    title: string;
    icon?: React.ReactNode | string;
    count?: number;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    defaultOpen?: boolean;
    className?: string;
    children: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CollapsibleSection({
    id,
    title,
    icon,
    count,
    badge,
    badgeVariant = 'secondary',
    className,
    children,
}: CollapsibleSectionProps) {
    // Renderizar ícone (pode ser string emoji ou componente React)
    const renderIcon = () => {
        if (!icon) return null;

        if (typeof icon === 'string') {
            return <span className="text-lg">{icon}</span>;
        }

        return icon;
    };

    return (
        <AccordionItem value={id} className={cn('border rounded-lg', className)}>
            <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                    {/* Left side: Icon + Title */}
                    <div className="flex items-center gap-2.5">
                        {renderIcon()}
                        <span className="font-medium text-sm">{title}</span>
                    </div>

                    {/* Right side: Badges */}
                    <div className="flex items-center gap-2 mr-2">
                        {count !== undefined && count > 0 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {count}
                            </Badge>
                        )}

                        {badge && (
                            <Badge variant={badgeVariant} className="text-xs px-2 py-0.5">
                                {badge}
                            </Badge>
                        )}
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
                <div className="pt-3 space-y-4">
                    {children}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

// ============================================================================
// VARIANT: Collapsible Section com Header Customizado
// ============================================================================

export interface CollapsibleSectionHeaderProps {
    id: string;
    header: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

export function CollapsibleSectionWithHeader({
    id,
    header,
    className,
    children,
}: CollapsibleSectionHeaderProps) {
    return (
        <AccordionItem value={id} className={cn('border rounded-lg', className)}>
            <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50 transition-colors">
                {header}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
                <div className="pt-3 space-y-4">
                    {children}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default CollapsibleSection;
