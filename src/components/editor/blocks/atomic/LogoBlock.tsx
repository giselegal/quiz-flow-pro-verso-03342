/**
 * 🎨 LOGO BLOCK - Atomic Component
 * 
 * Logo com barra decorativa opcional
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface LogoBlockProps {
  logoUrl?: string;
  height?: number;
  width?: number;
  showDecorator?: boolean;
  decoratorColor?: string;
  decoratorHeight?: number;
  alt?: string;
  mode?: 'edit' | 'preview';
}

export const LogoBlock = memo(({
  logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20GG-6w33qkEHxzZCbYI93W2BxxqxbFNr78.png',
  height = 55,
  width = 132,
  showDecorator = true,
  decoratorColor = '#B89B7A',
  decoratorHeight = 2,
  alt = 'Logo',
  mode = 'preview'
}: LogoBlockProps) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <img
        src={logoUrl}
        alt={alt}
        style={{ height: `${height}px`, width: `${width}px` }}
        className="object-contain"
      />
      
      {showDecorator && (
        <div
          className="w-full max-w-xs rounded-full"
          style={{
            height: `${decoratorHeight}px`,
            backgroundColor: decoratorColor
          }}
        />
      )}
    </div>
  );
});

LogoBlock.displayName = 'LogoBlock';
