import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * 🖼️ SimpleImageBlock - Versão simples para o ModularV1Editor
 */
const SimpleImageBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    onClick,
    className = '',
}) => {
    const imageSrc = block?.content?.src || block?.properties?.src;

    return (
        <div
            className={`
        py-2 px-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-blue-400 bg-blue-50/30' : 'hover:bg-gray-50/50'}
        ${className}
      `}
            onClick={onClick}
        >
            <div style={{ textAlign: 'center' }}>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={block?.content?.alt || 'Imagem'}
                        className="max-w-full h-auto mx-auto"
                    />
                ) : (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 rounded">
                        <p className="text-gray-500">📷 Imagem não configurada</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleImageBlock;