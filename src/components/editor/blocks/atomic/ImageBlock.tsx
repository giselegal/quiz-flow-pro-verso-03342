/**
 * 🎨 IMAGE BLOCK - Atomic Component
 * 
 * Imagens responsivas com aspect ratio e estilos
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface ImageBlockProps {
  src?: string;
  alt?: string;
  aspectRatio?: string;
  maxWidth?: string;
  rounded?: boolean;
  shadow?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  className?: string;
  mode?: 'edit' | 'preview';
}

export const ImageBlock = memo(({
  src = '',
  alt = 'Image',
  aspectRatio = '1',
  maxWidth = '300px',
  rounded = true,
  shadow = false,
  objectFit = 'cover',
  className = '',
  mode = 'preview'
}: ImageBlockProps) => {
  if (!src) return null;

  return (
    <div
      className={cn('mx-auto', className)}
      style={{ maxWidth }}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-auto',
          rounded && 'rounded-2xl',
          shadow && 'shadow-lg'
        )}
        style={{
          aspectRatio,
          objectFit
        }}
      />
    </div>
  );
});

ImageBlock.displayName = 'ImageBlock';
