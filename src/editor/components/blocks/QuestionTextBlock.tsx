/**
 * 🎯 QUESTION TEXT BLOCK - Bloco de Texto de Pergunta
 * 
 * Componente modular para exibir texto de perguntas do quiz.
 * Consome 100% das propriedades do JSON.
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const QuestionTextBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
}) => {
    const {
        text = 'Pergunta',
        number,
        fontSize = 'xl',
        fontWeight = 'bold',
        textAlign = 'center',
        color = '#432818',
        className: customClassName
    } = data.props;

    return (
        <div
            className={cn(
                'question-text-block relative p-4 transition-all duration-200',
                isEditable && 'cursor-pointer hover:bg-gray-50',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30',
                customClassName
            )}
            onClick={isEditable ? onSelect : undefined}
            data-block-id={data.id}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
                    ❓ Pergunta
                </div>
            )}

            {/* Número da pergunta */}
            {number && (
                <div className="flex justify-center mb-3">
                    <Badge variant="outline" className="text-xs">
                        {number}
                    </Badge>
                </div>
            )}

            {/* Texto da pergunta */}
            <div
                className={cn(
                    `text-${fontSize}`,
                    `font-${fontWeight}`,
                    `text-${textAlign}`,
                    'uppercase tracking-wide'
                )}
                style={{ color }}
            >
                {text}
            </div>
        </div>
    );
};

export default QuestionTextBlock;
