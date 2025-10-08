/**
 * 🏆 RESULT BLOCK - Bloco de Resultado/Score
 * 
 * Bloco para exibir resultados do quiz com pontuação
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { Badge } from '@/components/ui/badge';

interface ResultBlockProps {
    title?: string;
    description?: string;
    score?: number;
    maxScore?: number;
    category?: string;
    showPercentage?: boolean;
    color?: string;
}

export const ResultBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
}) => {
    const props = data.props as ResultBlockProps;

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    // Calcula porcentagem
    const percentage = props.score && props.maxScore
        ? Math.round((props.score / props.maxScore) * 100)
        : 0;

    return (
        <div
            onClick={handleClick}
            className={`
        relative p-6 rounded-lg transition-all
        border-2 border-dashed
        ${isEditable ? 'cursor-pointer hover:bg-accent/10' : ''}
        ${isSelected ? 'ring-2 ring-primary shadow-sm bg-accent/5 border-primary' : 'border-border'}
      `}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full" />
            )}

            <div className="text-center space-y-4">
                {/* Badge de categoria */}
                {props.category && (
                    <Badge variant="secondary" className="mb-2">
                        {props.category}
                    </Badge>
                )}

                {/* Título do resultado */}
                {props.title && (
                    <h3
                        className="text-2xl font-bold"
                        style={{ color: props.color || '#432818' }}
                    >
                        {props.title}
                    </h3>
                )}

                {/* Pontuação */}
                {props.score !== undefined && props.maxScore && (
                    <div className="space-y-2">
                        <div className="text-4xl font-bold text-primary">
                            {props.score}/{props.maxScore}
                        </div>

                        {props.showPercentage && (
                            <div className="text-lg text-muted-foreground">
                                {percentage}%
                            </div>
                        )}
                    </div>
                )}

                {/* Descrição */}
                {props.description && (
                    <p className="text-muted-foreground">
                        {props.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResultBlock;
