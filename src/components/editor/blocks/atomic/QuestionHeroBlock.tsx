/**
 * 🔥 COMPONENTE ATÔMICO: QuestionHeroBlock
 * 
 * Componente crítico para o funcionamento do quiz.
 * Usado em: step-04-v3, step-05-v3, step-06-v3, step-07-v3, step-08-v3, step-09-v3, step-10-v3, step-11-v3, step-13-v3, step-14-v3, step-15-v3, step-16-v3, step-17-v3, step-18-v3
 * 
 * Gerado automaticamente pelo script de correção.
 */

import React from 'react';
import type { Block } from '@/types/editor';

export interface QuestionHeroBlockProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
}

export default function QuestionHeroBlock({
    block,
    isSelected = false,
    isEditable = false,
    onSelect,
    onOpenProperties,
}: QuestionHeroBlockProps) {
    const { imageUrl, title, description } = block.properties || block.content || {};
    const {
        height = '200px',
        objectFit = 'cover',
        borderRadius = '8px',
        backgroundColor = '#f8fafc',
    } = block.properties || block.content || {}; return (
        <div className="question-hero mb-6">
            {imageUrl ? (
                <div
                    className="hero-image-container"
                    style={{
                        height,
                        borderRadius,
                        overflow: 'hidden',
                        backgroundColor,
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
                        border: '2px dashed #d1d5db',
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
