// @ts-nocheck
import React, { useState, useEffect } from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';
import { GalleryHorizontalEnd } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const CarouselBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const { images = [], autoplay = true, interval = 5000 } = block?.properties || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const { schedule, cancelAll } = useOptimizedScheduler();

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;

    const tick = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const loop = () => {
      schedule(`carousel:${block?.id || 'global'}`, () => {
        tick();
        loop();
      }, Math.max(500, interval || 5000));
    };
    loop();

    return () => cancelAll();
  }, [autoplay, images, interval, schedule, cancelAll, block?.id]);

  if (!images || images.length === 0) {
    return (
      <div
        className={`
          bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-all duration-200
          ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
          ${className}
        `}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <GalleryHorizontalEnd className="w-12 h-12 mb-4 opacity-50" />
        <p>Adicione imagens para o carrossel nas propriedades.</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-lg'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        className="w-full h-auto object-cover aspect-video"
        onError={e =>
          (e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Erro+Imagem')
        }
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_: any, idx: number) => (
            <span
              key={idx}
              className={`block w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-white' : 'bg-gray-400 opacity-75'}`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselBlock;
