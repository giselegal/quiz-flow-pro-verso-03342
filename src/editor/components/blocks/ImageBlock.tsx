/**
 * 🎯 IMAGE BLOCK - Bloco de Imagem
 * 
 * Componente modular para exibir imagens.
 * Consome 100% das propriedades do JSON.
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';

export const ImageBlock: React.FC<BlockComponentProps> = ({
  data,
  isSelected,
  isEditable,
  onSelect,
}) => {
  const {
    src,
    alt = 'Imagem',
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    rounded = true,
    className: customClassName
  } = data.props;

  if (!src) {
    return (
      <div
        className={cn(
          'image-block relative p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg',
          'flex items-center justify-center',
          isEditable && 'cursor-pointer hover:border-gray-400',
          isSelected && 'ring-2 ring-blue-500 ring-offset-2',
          customClassName
        )}
        onClick={isEditable ? onSelect : undefined}
        data-block-id={data.id}
      >
        {isSelected && (
          <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
            🖼️ Imagem
          </div>
        )}
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Nenhuma imagem definida</div>
          <div className="text-xs mt-1">Clique para editar</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'image-block relative transition-all duration-200',
        isEditable && 'cursor-pointer hover:opacity-90',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        customClassName
      )}
      onClick={isEditable ? onSelect : undefined}
      data-block-id={data.id}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
          🖼️ Imagem
        </div>
      )}

      {/* Imagem */}
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height,
          objectFit: objectFit as any
        }}
        className={cn(
          rounded && 'rounded-lg',
          'w-full'
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
        }}
      />
    </div>
  );
};

export default ImageBlock;
