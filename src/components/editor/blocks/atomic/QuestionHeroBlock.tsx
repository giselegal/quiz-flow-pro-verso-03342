/**
 * 🔥 COMPONENTE ATÔMICO: QuestionHeroBlock
 * 
 * Componente crítico para o funcionamento do quiz.
 * Usado em: step-04-v3, step-05-v3, step-06-v3, step-07-v3, step-08-v3, step-09-v3, step-10-v3, step-11-v3, step-13-v3, step-14-v3, step-15-v3, step-16-v3, step-17-v3, step-18-v3
 * 
 * Gerado automaticamente pelo script de correção.
 */

import React from 'react';
import type { BlockComponentProps } from '@/types/blockTypes';

export interface QuestionHeroBlockProps extends BlockComponentProps {
    // Props específicas podem ser adicionadas aqui
}

export default function QuestionHeroBlock({
    data,
    isSelected = false,
    isEditable = false,
    onSelect,
    onUpdate
}: QuestionHeroBlockProps) {
    const { imageUrl, title, description } = data.props || {};
    const {
        height = '200px',
        objectFit = 'cover',
        borderRadius = '8px',
        backgroundColor = '#f8fafc'
    } = data.props || {}; return (
        <div className="question-hero mb-6">
            {imageUrl ? (
                <div
                    className="hero-image-container"
                    style={{
                        height,
                        borderRadius,
                        overflow: 'hidden',
                        backgroundColor
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={title || 'Hero da pergunta'}
                        className="w-full h-full object-cover"
                        style={{ objectFit }}
                    />
                </div>
            ) : (
                <div
                    className="hero-placeholder flex items-center justify-center text-gray-500"
                    style={{
                        height,
                        borderRadius,
                        backgroundColor,
                        border: '2px dashed #d1d5db'
                    }}
                >
                    <span>Imagem Hero da Pergunta</span>
                </div>
            )}

            {title && (
                <h3 className="hero-title mt-4 text-lg font-semibold text-center">
                    {title}
                </h3>
            )}

            {description && (
                <p className="hero-description mt-2 text-gray-600 text-center">
                    {description}
                </p>
            )}
        </div>
    );
}

// Configuração do componente
QuestionHeroBlock.displayName = 'QuestionHeroBlock';
QuestionHeroBlock.blockType = 'question-hero';
