/**
 * 🎨 FOOTER BLOCK - Atomic Component
 * 
 * Rodapé com copyright e links
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface FooterBlockProps {
  text?: string;
  align?: 'left' | 'center' | 'right';
  size?: string;
  color?: string;
  links?: Array<{
    text: string;
    url: string;
  }>;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const FooterBlock = memo(({
  text = '',
  align = 'center',
  size = 'text-xs',
  color = 'text-gray-500',
  links = [],
  className = '',
  mode = 'preview'
}: FooterBlockProps) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  return (
    <footer className={cn('w-full space-y-2', className)}>
      {text && (
        <p className={cn(size, color, alignClass)}>
          {text}
        </p>
      )}
      
      {links.length > 0 && (
        <div className={cn('flex gap-4', alignClass)}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={cn(size, 'text-[#B89B7A] hover:underline')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
});

FooterBlock.displayName = 'FooterBlock';
