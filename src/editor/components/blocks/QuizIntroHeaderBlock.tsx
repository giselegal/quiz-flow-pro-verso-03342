/**
 * 🎯 QUIZ INTRO HEADER - Componente Modular
 * 
 * Header principal da etapa de introdução do quiz.
 * Consome 100% das propriedades do JSON.
 * Editável via painel de propriedades (não inline).
 */

import React from 'react';
import { BlockComponentProps } from '@/editor/registry/BlockRegistry';
import { cn } from '@/lib/utils';

const QuizIntroHeaderBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect
}) => {
    // Extrair propriedades do JSON
    const title = data.content?.title || 'Título não definido';
    const subtitle = data.content?.subtitle || '';
    const alignment = data.properties?.alignment || 'center';
    const fontSize = data.properties?.fontSize || '2xl';
    const fontWeight = data.properties?.fontWeight || 'bold';
    const textColor = data.properties?.textColor || '#432818';
    const backgroundColor = data.properties?.backgroundColor || 'transparent';

    return (
        <div
            className={cn(
                'relative p-6 transition-all duration-200 cursor-pointer',
                'hover:ring-1 hover:ring-blue-300',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30',
                isEditable && 'cursor-pointer'
            )}
            style={{ backgroundColor }}
            onClick={onSelect}
            data-block-id={data.id}
            data-block-type={data.type}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm z-10">
                    📝 Header Selecionado
                </div>
            )}

            {/* Conteúdo do header */}
            <div className={`text-${alignment}`}>
                <h1
                    className={cn(
                        `text-${fontSize}`,
                        `font-${fontWeight}`,
                        'mb-2'
                    )}
                    style={{ color: textColor }}
                >
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-lg text-gray-600 mt-2">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Hover info - só aparece se editável */}
            {isEditable && !isSelected && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        Clique para editar
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizIntroHeaderBlock;
