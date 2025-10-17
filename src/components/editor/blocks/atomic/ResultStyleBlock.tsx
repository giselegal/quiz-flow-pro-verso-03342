import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultStyleBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // Ler de content primeiro, fallback para properties
    const styleName = block.content?.styleName || block.properties?.styleName || 'Estilo';
    const percentage = block.content?.percentage || block.properties?.percentage || 0;
    const description = block.content?.description || block.properties?.description || '';
    const color = block.properties?.color || '#3B82F6';
    const showBar = block.properties?.showBar !== false;

    return (
        <div
            className={`p-6 rounded-lg border mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-semibold" style={{ color }}>
                    {styleName}
                </h3>
                <span className="text-2xl font-bold" style={{ color }}>
                    {percentage}%
                </span>
            </div>

            {showBar && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                            backgroundColor: color,
                            width: `${percentage}%`
                        }}
                    />
                </div>
            )}

            {description && (
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            )}
        </div>
    );
}
