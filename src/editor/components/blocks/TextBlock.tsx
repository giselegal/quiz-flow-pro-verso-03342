/**
 * 🎯 TEXT BLOCK - Componente Modular
 * 
 * Bloco de texto genérico com suporte a HTML e formatação.
 * Usado em várias etapas do quiz.
 */

import React from 'react';
import { BlockComponentProps } from '@/editor/registry/BlockRegistry';
import { cn } from '@/lib/utils';

const TextBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect
}) => {
    // Extrair propriedades
    const text = data.content?.text || '';
    const html = data.content?.html || '';
    const fontSize = data.properties?.fontSize || 'base';
    const textColor = data.properties?.textColor || '#334155';
    const lineHeight = data.properties?.lineHeight || '1.6';
    const marginBottom = data.properties?.marginBottom || '1rem';
    
    // Decidir se renderiza HTML ou texto simples
    const hasHtml = html && html.trim() !== '';
    
    return (
        <div
            className={cn(
                'relative p-4 transition-all duration-200 cursor-pointer',
                'hover:ring-1 hover:ring-blue-200',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20'
            )}
            onClick={onSelect}
            data-block-id={data.id}
            data-block-type={data.type}
        >
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-sm z-10">
                    📄 Texto
                </div>
            )}
            
            {hasHtml ? (
                <div
                    className={`text-${fontSize} prose prose-sm max-w-none`}
                    style={{ 
                        color: textColor,
                        lineHeight,
                        marginBottom
                    }}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : (
                <p
                    className={`text-${fontSize}`}
                    style={{ 
                        color: textColor,
                        lineHeight,
                        marginBottom
                    }}
                >
                    {text || 'Texto não definido'}
                </p>
            )}
        </div>
    );
};

export default TextBlock;
