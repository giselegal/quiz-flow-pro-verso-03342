import React from 'react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * AccessibilitySkipLinkBlock
 * Link de pulo para acessibilidade que permite ir direto ao conteúdo.
 */
const AccessibilitySkipLinkBlock: React.FC<BlockComponentProps> = ({ block }) => {
  const props = (block?.properties || {}) as {
    target?: string;
    text?: string;
    className?: string;
  };

  const target = props.target || '#main';
  const text = props.text || 'Pular para o conteúdo';
  const className =
    props.className ||
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-3 py-2 rounded-md';

  return (
    <a href={target} className={className} aria-label={text}>
      {text}
    </a>
  );
};

export default AccessibilitySkipLinkBlock;
