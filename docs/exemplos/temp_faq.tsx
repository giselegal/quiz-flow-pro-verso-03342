// @ts-nocheck
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Edit3 } from 'lucide-react';

interface FAQBlockProps {
  cardStyle: 'modern' | 'classic' | 'flat' | 'glassmorphic';
  // ... resto das props
}

const FAQBlock: React.FC<FAQBlockProps> = ({
  cardStyle = 'modern',
  // ... resto das props
}) => {
  const getCardStyleClasses = (isHighlight: boolean = false) => {
    const baseClasses = 'transition-all duration-300 cursor-pointer';
    let styleClasses = '';

    switch (cardStyle) {
      case 'modern':
      default:
        styleClasses =
          'bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg hover:border-[#B89B7A]/30';
        break;
      case 'classic':
        styleClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md';
        break;
      case 'flat':
        styleClasses = 'bg-transparent border-b border-gray-200 rounded-none hover:bg-gray-50';
        break;
      case 'glassmorphic':
        styleClasses =
          'bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:shadow-xl';
        break;
    }

    if (isHighlight) {
      styleClasses += ' border-[#B89B7A]/40 bg-[#FAF9F7]';
    }

    return `${baseClasses} ${styleClasses}`;
  };

  // ... resto do código
};

export default FAQBlock;
