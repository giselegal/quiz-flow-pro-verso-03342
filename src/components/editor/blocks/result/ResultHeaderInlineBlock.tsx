import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Header } from '@/components/result/Header';

/**
 * ResultHeaderInlineBlock - Header component for result pages
 * Modular header component with logo, user name and progress
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ResultHeaderInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    logoHeight = 40,
    logoWidth = 'auto',
    userName = '',
    showUserName = true,
    backgroundColor = '#ffffff',
    borderColor = '#e5e7eb',
    showBorder = true,
    containerWidth = 'full',
    spacing = 'normal',
    marginTop = 0,
    marginBottom = 0,
  } = block?.properties ?? {};

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm': containerWidth === 'small',
      'max-w-md': containerWidth === 'medium',
      'max-w-lg': containerWidth === 'large',
      'max-w-full': containerWidth === 'full',
    },
    {
      'py-2': spacing === 'small',
      'py-4': spacing === 'normal',
      'py-6': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-2': marginTop <= 8,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-2': marginBottom <= 8,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50',
    className
  );

  const headerStyle = {
    backgroundColor,
    ...(showBorder && { borderColor, borderWidth: '1px', borderStyle: 'solid' }),
  };

  return (
    <div className={containerClasses} onClick={onClick} style={headerStyle}>
      <Header
        logo={logoUrl}
        logoAlt={logoAlt}
        logoHeight={logoHeight}
        logoWidth={logoWidth}
        userName={showUserName ? userName : undefined}
        className="border-none p-0"
      />
    </div>
  );
};

export default ResultHeaderInlineBlock;
