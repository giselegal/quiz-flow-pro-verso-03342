/**
 * 🔥 COMPONENTE ATÔMICO: QuestionTitleBlock
 * 
 * Componente crítico para o funcionamento do quiz.
 * Usado em: step-02-v3, step-03-v3, step-04-v3, step-05-v3, step-06-v3, step-07-v3, step-08-v3, step-09-v3, step-10-v3, step-11-v3, step-13-v3, step-14-v3, step-15-v3, step-16-v3, step-17-v3, step-18-v3
 * 
 * Gerado automaticamente pelo script de correção.
 */

import React from 'react';
import type { InlineBlockProps } from '@/types/InlineBlockProps';
import type { BlockComponentProps } from '@/types/blockTypes';

export interface QuestionTitleBlockProps extends InlineBlockProps {
    // Props específicas podem ser adicionadas aqui
}

export default function QuestionTitleBlock({
    data,
    isSelected = false,
    isEditable = false,
    onSelect,
    onUpdate,
}: QuestionTitleBlockProps) {

    const { title = 'Título da Pergunta', subtitle } = data.props || {};
    const { fontSize = '24px', fontWeight = '600', textAlign = 'center' } = data.props || {};

    return (
        <div className="text-center mb-6">
            <h2
                className="text-gray-800"
                style={{ fontSize, fontWeight, textAlign }}
                dangerouslySetInnerHTML={{ __html: title }}
            />
            {subtitle && (
                <p className="text-gray-600 mt-2">{subtitle}</p>
            )}
        </div>
    );
}

// Configuração do componente
QuestionTitleBlock.displayName = 'QuestionTitleBlock';
QuestionTitleBlock.blockType = 'question-title';
