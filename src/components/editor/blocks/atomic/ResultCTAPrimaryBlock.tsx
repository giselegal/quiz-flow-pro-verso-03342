import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { useResult } from '@/contexts/ResultContext';

/**
 * 🎯 RESULT CTA PRIMARY BLOCK
 * 
 * Botão principal de call-to-action com tracking de analytics.
 * Consome handleCTAClick do ResultContext.
 */
export default function ResultCTAPrimaryBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // 🎯 Tentar usar context (modo production)
    let contextAvailable = false;
    let handleCTAClick: ((customUrl?: string) => void) | undefined;

    try {
        const result = useResult();
        handleCTAClick = result.handleCTAClick;
        contextAvailable = true;
    } catch (e) {
        // Editor mode: não há context
        contextAvailable = false;
    }

    // Ler de content
    const text = block.content?.text || 'Quero Conhecer o Guia Completo';
    const url = block.content?.url;
    const backgroundColor = block.content?.backgroundColor || '#B89B7A';
    const textColor = block.content?.textColor || '#FFFFFF';
    const size = block.content?.size || 'lg';
    const trackAnalytics = block.content?.trackAnalytics !== false;

    const handleClick = () => {
        // Permitir seleção no editor
        if (onClick) {
            onClick();
        }

        // Em modo runtime com context, usar handler com analytics
        if (contextAvailable && handleCTAClick && !isSelected) {
            handleCTAClick(url);
        }
        // Em modo editor ou preview, navegar normalmente
        else if (url && url !== '#' && !isSelected) {
            window.open(url, '_blank');
        }
    }; return (
        <div
            className={`mt-6 mb-6 ${isSelected ? 'ring-2 ring-primary rounded-lg' : ''}`}
            onClick={handleClick}
        >
            <Button
                size={size as any}
                className="w-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{
                    backgroundColor,
                    color: textColor
                }}
            >
                {text}
            </Button>
        </div>
    );
}
