
import React from 'react';
import { QuizComponentData, QuizComponentType } from '@/types/quizBuilder';
import { HeadlinePropertyEditor } from './HeadlinePropertyEditor';
import { TextPropertyEditor } from './TextPropertyEditor';
import { ImagePropertyEditor } from './ImagePropertyEditor';
import { CTAPropertyEditor } from './CTAPropertyEditor';
import { VideoPropertyEditor } from './VideoPropertyEditor';
import { DividerPropertyEditor } from './DividerPropertyEditor';
import { SpacerPropertyEditor } from './SpacerPropertyEditor';
import { BenefitsPropertyEditor } from './BenefitsPropertyEditor';
import { FAQPropertyEditor } from './FAQPropertyEditor';
import { TestimonialPropertyEditor } from './TestimonialPropertyEditor';
import { PricingPropertyEditor } from './PricingPropertyEditor';
import { GuaranteePropertyEditor } from './GuaranteePropertyEditor';
import { HeaderPropertyEditor } from './HeaderPropertyEditor';
import { HeroSectionPropertyEditor } from './HeroSectionPropertyEditor';
import { StyleResultPropertyEditor } from './StyleResultPropertyEditor';

interface PropertyEditorRouterProps {
  component: QuizComponentData;
  onUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
}

export const PropertyEditorRouter: React.FC<PropertyEditorRouterProps> = ({
  component,
  onUpdate
}) => {
  const handleDataUpdate = (dataUpdates: any) => {
    onUpdate(component.id, {
      data: { ...component.data, ...dataUpdates }
    });
  };

  const handleStyleUpdate = (styleUpdates: any) => {
    onUpdate(component.id, {
      style: { ...component.style, ...styleUpdates }
    });
  };

  const handleFullUpdate = (updates: Partial<QuizComponentData>) => {
    onUpdate(component.id, updates);
  };

  const commonProps = {
    component,
    onDataUpdate: handleDataUpdate,
    onStyleUpdate: handleStyleUpdate,
    onUpdate: handleFullUpdate
  };

  switch (component.type) {
    case 'headline':
      return <HeadlinePropertyEditor {...commonProps} />;
    
    case 'text':
      return <TextPropertyEditor {...commonProps} />;
    
    case 'image':
      return <ImagePropertyEditor {...commonProps} />;
    
    case 'header':
      return <HeaderPropertyEditor {...commonProps} />;
    
    case 'hero-section':
      return <HeroSectionPropertyEditor {...commonProps} />;
    
    case 'button':
    case 'cta':
      return <CTAPropertyEditor {...commonProps} />;
    
    case 'video':
      return <VideoPropertyEditor {...commonProps} />;
    
    case 'divider':
      return <DividerPropertyEditor {...commonProps} />;
    
    case 'spacer':
      return <SpacerPropertyEditor {...commonProps} />;
    
    case 'benefits':
    case 'benefitsList':
      return <BenefitsPropertyEditor {...commonProps} />;
    
    case 'faq':
      return <FAQPropertyEditor {...commonProps} />;
    
    case 'testimonials':
      return <TestimonialPropertyEditor {...commonProps} />;
    
    case 'pricing':
      return <PricingPropertyEditor {...commonProps} />;
    
    case 'guarantee':
      return <GuaranteePropertyEditor {...commonProps} />;
    
    case 'style-result':
    case 'quizResult':
      return <StyleResultPropertyEditor {...commonProps} />;
    
    default:
      return (
        <div className="p-4 border border-[#B89B7A]/20 rounded-md bg-[#FAF9F7]">
          <p className="text-[#8F7A6A] text-center">
            Editor de propriedades para: <strong>{component.type}</strong>
          </p>
          <p className="text-xs text-[#8F7A6A] text-center mt-2">
            Use os campos básicos abaixo para editar este componente.
          </p>
        </div>
      );
  }
};
