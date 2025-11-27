/**
 * 🎯 FASE 2: EditorShell - Container principal do editor
 * 
 * Responsabilidade única: Layout e estrutura geral
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface EditorShellProps {
    children: React.ReactNode;
    className?: string;
}

export function EditorShell({ children, className }: EditorShellProps) {
    return (
        <div className={cn(
            'flex flex-col h-screen bg-gray-50',
            className
        )}>
            {children}
        </div>
    );
}
