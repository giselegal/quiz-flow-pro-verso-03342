
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
import { ComparisonPropertyEditor } from './ComparisonPropertyEditor';
import { NewsletterPropertyEditor } from './NewsletterPropertyEditor';
import { FeatureGridPropertyEditor } from './FeatureGridPropertyEditor';
import { SocialProofPropertyEditor } from './SocialProofPropertyEditor';
import { ContactPropertyEditor } from './ContactPropertyEditor';
import { StatsPropertyEditor } from './StatsPropertyEditor';
import { CountdownPropertyEditor } from './CountdownPropertyEditor';
import { ChecklistPropertyEditor } from './ChecklistPropertyEditor';
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
    
    case 'button':
    case 'cta':
      return <CTAPropertyEditor {...commonProps} />;
    
    case 'video':
      return <VideoPropertyEditor {...commonProps} />;
    
    case 'divider':
      return <DividerPropertyEditor {...commonProps} />;
    
    case 'spacer':
      return <SpacerPropertyEditor {...commonProps} />;
    
    case 'benefitsList':
      return <BenefitsPropertyEditor {...commonProps} />;
    
    case 'faq':
      return <FAQPropertyEditor {...commonProps} />;
    
    case 'multipleChoice':
    case 'singleChoice':
      return <TestimonialPropertyEditor {...commonProps} />;
    
    case 'scale':
      return <PricingPropertyEditor {...commonProps} />;
    
    case 'openEnded':
      return <GuaranteePropertyEditor {...commonProps} />;
    
    case 'date':
      return <ComparisonPropertyEditor {...commonProps} />;
    
    case 'stageCover':
      return <NewsletterPropertyEditor {...commonProps} />;
    
    case 'stageQuestion':
      return <FeatureGridPropertyEditor {...commonProps} />;
    
    case 'stageResult':
      return <SocialProofPropertyEditor {...commonProps} />;
    
    case 'quizResult':
      return <StyleResultPropertyEditor {...commonProps} />;
    
    case 'header':
      return <ContactPropertyEditor {...commonProps} />;
    
    case 'section':
      return <StatsPropertyEditor {...commonProps} />;
    
    case 'columns':
      return <CountdownPropertyEditor {...commonProps} />;
    
    case 'choice':
      return <ChecklistPropertyEditor {...commonProps} />;
    
    case 'result':
      return <StyleResultPropertyEditor {...commonProps} />;
    
    default:
      return (
        <div className="p-4 border border-[#B89B7A]/20 rounded-md bg-[#FAF9F7]">
          <p className="text-[#8F7A6A] text-center">
            Editor de propriedades não implementado para: <strong>{component.type}</strong>
          </p>
          <p className="text-xs text-[#8F7A6A] text-center mt-2">
            Este tipo de componente ainda não possui um editor específico.
          </p>
        </div>
      );
  }
};
