import React from 'react';
import type { Block } from '@/types/editor';
import { useResultOptional } from '@/contexts/ResultContext';

interface OfferHeroBlockProps {
    block: Block;
    className?: string;
    style?: React.CSSProperties;
    isSelected?: boolean;
    onSelect?: (blockId: string) => void;
}

/**
 * 🎯 OFFER HERO BLOCK
 * 
 * Hero section para página de oferta (Step 21)
 * Suporta variáveis dinâmicas como {userName}
 * 
 * @example
 * ```json
 * {
 *   "type": "offer-hero",
 *   "content": {
 *     "title": "{userName}, Transforme Seu Guarda-Roupa!",
 *     "subtitle": "Oferta exclusiva para você",
 *     "description": "Descubra como valorizar seu estilo único...",
 *     "urgencyMessage": "Oferta por tempo limitado!"
 *   }
 * }
 * ```
 */
const OfferHeroBlock: React.FC<OfferHeroBlockProps> = ({
    block,
    className = '',
    style = {},
    isSelected = false,
    onSelect,
}) => {
    const resultContext = useResultOptional();
    const content = block.content || {};

    // Extrair propriedades do content
    const {
        title = '',
        subtitle = '',
        description = '',
        urgencyMessage = '',
    } = content;

    // Interpolar variáveis dinâmicas se ResultContext disponível
    const interpolate = (text: string): string => {
        if (!text) return '';

        if (resultContext?.interpolateText) {
            return resultContext.interpolateText(text);
        }

        // Fallback: substituição simples de {userName}
        const userName = resultContext?.userProfile?.userName || 'você';
        return text.replace(/\{userName\}/g, userName);
    };

    const interpolatedTitle = interpolate(title);
    const interpolatedSubtitle = interpolate(subtitle);
    const interpolatedDescription = interpolate(description);

    const handleClick = () => {
        if (onSelect && block.id) {
            onSelect(block.id);
        }
    };

    return (
        <div
            className={`
        offer-hero-block 
        bg-gradient-to-br from-amber-50 via-white to-rose-50
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${className}
      `}
            style={style}
            onClick={handleClick}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
        >
            <div className="max-w-4xl mx-auto text-center py-16 px-6">
                {/* Title with dynamic {userName} support */}
                {interpolatedTitle && (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        {interpolatedTitle}
                    </h1>
                )}

                {/* Subtitle */}
                {interpolatedSubtitle && (
                    <h2 className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
                        {interpolatedSubtitle}
                    </h2>
                )}

                {/* Description */}
                {interpolatedDescription && (
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                        {interpolatedDescription}
                    </p>
                )}

                {/* Urgency Badge */}
                {urgencyMessage && (
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-6 py-3 rounded-full font-semibold shadow-md animate-pulse">
                        <span className="text-xl" role="img" aria-label="timer">⏰</span>
                        <span>{urgencyMessage}</span>
                    </div>
                )}
            </div>

            {/* Debug info (apenas em modo de edição selecionado) */}
            {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    offer-hero
                </div>
            )}
        </div>
    );
};

export default OfferHeroBlock;
