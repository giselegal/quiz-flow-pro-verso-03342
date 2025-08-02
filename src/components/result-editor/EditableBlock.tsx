
import React from 'react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Copy, Trash } from 'lucide-react';
import HeaderBlockPreview from './block-previews/HeaderBlockPreview';
import HeadlineBlockPreview from './block-previews/HeadlineBlockPreview';
import TextBlockPreview from './block-previews/TextBlockPreview';
import ImageBlockPreview from './block-previews/ImageBlockPreview';
import BenefitsBlockPreview from './block-previews/BenefitsBlockPreview';
import PricingBlockPreview from './block-previews/PricingBlockPreview';
import GuaranteeBlockPreview from './block-previews/GuaranteeBlockPreview';
import CTABlockPreview from './block-previews/CTABlockPreview';
import StyleResultBlockPreview from './block-previews/StyleResultBlockPreview';
import SecondaryStylesBlockPreview from './block-previews/SecondaryStylesBlockPreview';
import HeroSectionBlockPreview from './block-previews/HeroSectionBlockPreview';
import ProductsBlockPreview from './block-previews/ProductsBlockPreview';
import TestimonialsBlockPreview from './block-previews/TestimonialsBlockPreview';
import SpacerBlockPreview from './block-previews/SpacerBlockPreview';
import VideoBlockPreview from './block-previews/VideoBlockPreview';
import TwoColumnBlockPreview from './block-previews/TwoColumnBlockPreview';
import IconBlockPreview from './block-previews/IconBlockPreview';
import FAQBlockPreview from './block-previews/FAQBlockPreview';
import CarouselBlockPreview from './block-previews/CarouselBlockPreview';
import CustomCodeBlockPreview from './block-previews/CustomCodeBlockPreview';
import AnimationBlockPreview from './block-previews/AnimationBlockPreview';

interface EditableBlockProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  isPreviewMode: boolean;
  onReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  primaryStyle: StyleResult;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  index,
  isSelected,
  onClick,
  isPreviewMode,
  onReorderBlocks,
  primaryStyle
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.id,
    data: {
      index,
      type: 'BLOCK'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isPreviewMode ? 'default' : 'pointer',
    border: isSelected && !isPreviewMode ? '2px solid #B89B7A' : isPreviewMode ? 'none' : '2px dashed #e2e2e2',
    borderRadius: '0.5rem',
    backgroundColor: isPreviewMode ? 'transparent' : isDragging ? '#f9f3e9' : 'white',
    position: 'relative' as const,
    zIndex: isSelected ? 1 : 0
  };
  
  // Ensure content is always an object with default values
  const safeContent = block.content || {};
  
  // Render the appropriate block preview based on type
  const renderBlockPreview = () => {
    switch (block.type) {
      case 'header':
        return <HeaderBlockPreview content={safeContent} />;
      case 'headline':
        return <HeadlineBlockPreview content={safeContent} />;
      case 'text':
        return <TextBlockPreview content={safeContent} />;
      case 'image':
        return <ImageBlockPreview content={safeContent} />;
      case 'benefits':
        return <BenefitsBlockPreview content={safeContent} />;
      case 'pricing':
        return <PricingBlockPreview content={safeContent} />;
      case 'guarantee':
        return <GuaranteeBlockPreview content={safeContent} />;
      case 'cta':
        return <CTABlockPreview content={safeContent} />;
      case 'style-result':
        return <StyleResultBlockPreview content={safeContent} primaryStyle={primaryStyle} />;
      case 'secondary-styles':
        return <SecondaryStylesBlockPreview content={safeContent} />;
      case 'hero-section':
        return <HeroSectionBlockPreview content={safeContent} primaryStyle={primaryStyle} />;
      case 'products':
        return <ProductsBlockPreview content={safeContent} />;
      case 'testimonials':
        return <TestimonialsBlockPreview content={safeContent} />;
      case 'spacer':
        return <SpacerBlockPreview content={safeContent} />;
      case 'video':
        return <VideoBlockPreview content={safeContent} />;
      case 'two-column':
        return <TwoColumnBlockPreview content={safeContent} />;
      case 'icon':
        return <IconBlockPreview content={safeContent} />;
      case 'faq':
        return <FAQBlockPreview content={safeContent} />;
      case 'carousel':
        return <CarouselBlockPreview content={safeContent} />;
      case 'custom-code':
        return <CustomCodeBlockPreview content={safeContent} />;
      case 'animation-block':
        return <AnimationBlockPreview content={safeContent} />;
      default:
        return <div>Tipo de bloco desconhecido: {block.type}</div>;
    }
  };
  
  if (isPreviewMode) {
    return (
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        {renderBlockPreview()}
      </div>
    );
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="p-3 group transition-all duration-200"
      {...attributes}
    >
      {!isPreviewMode && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#f9f3e9]">
            <Edit className="h-4 w-4 text-[#8F7A6A]" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#f9f3e9]">
            <Copy className="h-4 w-4 text-[#8F7A6A]" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600">
            <Trash className="h-4 w-4" />
          </Button>
          <div
            className="h-8 w-8 flex items-center justify-center cursor-move"
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-[#8F7A6A]" />
          </div>
        </div>
      )}
      
      {renderBlockPreview()}
    </div>
  );
};

export default EditableBlock;
