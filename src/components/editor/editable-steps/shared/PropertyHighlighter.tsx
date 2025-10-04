/**
 * 🎨 PROPERTY HIGHLIGHTER
 * 
 * Componente para destacar visualmente propriedades editáveis
 * quando o usuário interage com elementos no preview.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface PropertyHighlighterProps {
    /** Props editáveis que devem ser destacadas */
    editableProps: string[];
    /** Callback quando uma propriedade é clicada */
    onPropertyClick?: (propKey: string, element: HTMLElement) => void;
    /** Se o highlight está ativo */
    isActive: boolean;
    /** Filhos que devem ter propriedades destacáveis */
    children: React.ReactNode;
}

/**
 * 📍 MAPEAMENTO DE PROPRIEDADES PARA SELETORES
 * 
 * Define como encontrar elementos no DOM que correspondem a props editáveis
 */
const PROP_SELECTORS: Record<string, string> = {
    'title': '[data-editable="title"], h1, h2, .title',
    'formQuestion': '[data-editable="formQuestion"], label, .form-question',
    'placeholder': '[data-editable="placeholder"], input[placeholder]',
    'buttonText': '[data-editable="buttonText"], button, .button',
    'questionText': '[data-editable="questionText"], .question-text',
    'questionNumber': '[data-editable="questionNumber"], .question-number',
    'text': '[data-editable="text"], p, .text-content',
    'image': '[data-editable="image"], img',
    'options': '[data-editable="options"], .option, .quiz-option'
};

export const PropertyHighlighter: React.FC<PropertyHighlighterProps> = ({
    editableProps,
    onPropertyClick,
    isActive,
    children
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProp, setHoveredProp] = useState<string | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const handleClick = (e: MouseEvent) => {
            if (!onPropertyClick) return;

            // Encontrar qual propriedade foi clicada
            for (const prop of editableProps) {
                const selector = PROP_SELECTORS[prop];
                if (!selector) continue;

                const elements = container.querySelectorAll(selector);
                for (const element of elements) {
                    if (element.contains(e.target as Node)) {
                        e.preventDefault();
                        e.stopPropagation();
                        onPropertyClick(prop, element as HTMLElement);
                        return;
                    }
                }
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            for (const prop of editableProps) {
                const selector = PROP_SELECTORS[prop];
                if (!selector) continue;

                const elements = container.querySelectorAll(selector);
                for (const element of elements) {
                    if (element.contains(e.target as Node)) {
                        setHoveredProp(prop);
                        (element as HTMLElement).style.outline = '2px dashed #3b82f6';
                        (element as HTMLElement).style.outlineOffset = '2px';
                        (element as HTMLElement).style.cursor = 'pointer';
                        return;
                    }
                }
            }
            setHoveredProp(null);
        };

        const handleMouseOut = (e: MouseEvent) => {
            // Remover highlight de todos os elementos
            for (const prop of editableProps) {
                const selector = PROP_SELECTORS[prop];
                if (!selector) continue;

                const elements = container.querySelectorAll(selector);
                for (const element of elements) {
                    (element as HTMLElement).style.outline = '';
                    (element as HTMLElement).style.outlineOffset = '';
                    (element as HTMLElement).style.cursor = '';
                }
            }
            setHoveredProp(null);
        };

        container.addEventListener('click', handleClick);
        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseout', handleMouseOut);

        return () => {
            container.removeEventListener('click', handleClick);
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isActive, editableProps, onPropertyClick]);

    return (
        <div ref={containerRef} className="relative">
            {children}

            {/* Tooltip de propriedade */}
            {isActive && hoveredProp && (
                <div className="absolute top-0 left-0 z-50 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
                    📝 {hoveredProp}
                </div>
            )}
        </div>
    );
};