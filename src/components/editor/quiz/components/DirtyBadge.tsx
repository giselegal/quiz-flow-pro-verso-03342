import React from 'react';

interface DirtyBadgeProps {
    isDirty: boolean;
    className?: string;
}

/**
 * Badge visual para indicar steps com alterações não salvas
 * Aparece ao lado do título do step na navegação
 */
export function DirtyBadge({ isDirty, className = '' }: DirtyBadgeProps) {
    if (!isDirty) return null;

    return (
        <span
            className={`inline-flex items-center justify-center w-2 h-2 bg-amber-500 rounded-full ${className}`}
            title="Alterações não salvas"
            aria-label="Alterações não salvas"
        />
    );
}
