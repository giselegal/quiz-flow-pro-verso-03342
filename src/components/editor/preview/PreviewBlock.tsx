
import React from 'react';
import { Block } from '@/types/editor';
import { HeadlineBlock, TextBlock, BenefitsBlock, CTABlock, PricingBlock, GuaranteeBlock, TestimonialsBlock, HeroBlock, HeaderBlock } from './blocks';

interface PreviewBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
}

export const PreviewBlock: React.FC<PreviewBlockProps> = ({
  block,
  isSelected = false,
  onClick
}) => {
  const baseClasses = `
    relative transition-all duration-200 cursor-pointer
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md'}
  `;

  const renderBlockContent = () => {
    switch (block.type) {
      case 'headline':
        return <HeadlineBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'text':
        return <TextBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'header':
        return <HeaderBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'hero':
        return <HeroBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'benefits':
        // Ensure items is a string array for benefits
        const items = Array.isArray(block.content.items) 
          ? block.content.items.filter((item): item is string => typeof item === 'string')
          : [];
        
        return (
          <BenefitsBlock
            content={{
              ...block.content,
              items
            }}
            onClick={onClick || (() => {})}
          />
        );
      
      case 'testimonials':
        return <TestimonialsBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'pricing':
        return <PricingBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'guarantee':
        return <GuaranteeBlock content={block.content} onClick={onClick || (() => {})} />;
      
      case 'cta':
        return <CTABlock content={block.content} onClick={onClick || (() => {})} />;
      
      default:
        return (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">Tipo de bloco não suportado: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className={baseClasses} onClick={onClick}>
      {renderBlockContent()}
    </div>
  );
};
