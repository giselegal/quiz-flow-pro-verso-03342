
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { UniversalBlockRenderer, isBlockTypeRegistered } from '../blocks/BlockRegistry';
import { HeaderBlock } from './blocks/HeaderBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { HeadlineBlock } from './blocks/HeadlineBlock';
import { TextBlock } from './blocks/TextBlock';
import { BenefitsBlock } from './blocks/BenefitsBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { PricingBlock } from './blocks/PricingBlock';
import { GuaranteeBlock } from './blocks/GuaranteeBlock';
import { CTABlock } from './blocks/CTABlock';

interface BlockRendererProps {
  block: EditorBlock;
  onSelect: () => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onSelect }) => {
  // Check if it's a modern block registered in BlockRegistry
  if (isBlockTypeRegistered(block.type)) {
    return (
      <UniversalBlockRenderer
        type={block.type}
        block={block}
        onClick={onSelect}
        className="cursor-pointer"
      />
    );
  }

  // Legacy blocks - maintain existing logic for backward compatibility
  switch (block.type) {
    case 'header':
      return <HeaderBlock content={block.content} onClick={onSelect} />;
    case 'hero-section':
      return <HeroBlock content={block.content} onClick={onSelect} />;
    case 'bonus-carousel':
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <h3 className="font-medium text-[#432818]">Carrossel de Bônus</h3>
          <p className="text-sm text-[#8F7A6A]">Clique para editar este carrossel</p>
        </div>
      );
    case 'headline':
      return <HeadlineBlock content={block.content} onClick={onSelect} />;
    case 'text':
      return <TextBlock content={block.content} onClick={onSelect} />;
    case 'benefits':
      return <BenefitsBlock content={block.content} onClick={onSelect} />;
    case 'testimonials':
      return <TestimonialsBlock content={block.content} onClick={onSelect} />;
    case 'pricing':
      return <PricingBlock content={block.content} onClick={onSelect} />;
    case 'guarantee':
      return <GuaranteeBlock content={block.content} onClick={onSelect} />;
    case 'cta':
      return <CTABlock content={block.content} onClick={onSelect} />;
    case 'products':
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <h3 className="font-medium text-[#432818]">Produtos</h3>
          <p className="text-sm text-[#8F7A6A]">Clique para editar esta seção de produtos</p>
        </div>
      );
    case 'style-result':
    case 'secondary-styles':
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <h3 className="font-medium text-[#432818]">{block.type === 'style-result' ? 'Estilo Principal' : 'Estilos Secundários'}</h3>
          <p className="text-sm text-[#8F7A6A]">Clique para editar esta seção</p>
        </div>
      );
    default:
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <p className="text-[#8F7A6A]">Bloco do tipo: {block.type}</p>
        </div>
      );
  }
};
