
import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { CraftToolbox } from './CraftToolbox';
import { CraftSettings } from './CraftSettings';
import { CraftTopbar } from './CraftTopbar';
import { CraftCanvas } from './CraftCanvas';

// Importar todos os componentes Craft
import { CraftTextBlock } from './blocks/CraftTextBlock';
import { CraftHeadingBlock } from './blocks/CraftHeadingBlock';
import { CraftImageBlock } from './blocks/CraftImageBlock';
import { CraftButtonBlock } from './blocks/CraftButtonBlock';
import { CraftQuizStartBlock } from './blocks/CraftQuizStartBlock';
import { CraftQuizQuestionBlock } from './blocks/CraftQuizQuestionBlock';
import { CraftQuizTransitionBlock } from './blocks/CraftQuizTransitionBlock';
import { CraftQuizResultBlock } from './blocks/CraftQuizResultBlock';
import { CraftOfferBlock } from './blocks/CraftOfferBlock';
import { CraftContainer } from './blocks/CraftContainer';
import { CraftFormBlock } from './blocks/CraftFormBlock';
import { CraftSpacerBlock } from './blocks/CraftSpacerBlock';
import { CraftVideoBlock } from './blocks/CraftVideoBlock';
import { CraftTestimonialBlock } from './blocks/CraftTestimonialBlock';
import { CraftPricingBlock } from './blocks/CraftPricingBlock';
import { CraftCountdownBlock } from './blocks/CraftCountdownBlock';
import { CraftFAQBlock } from './blocks/CraftFAQBlock';
import { CraftProgressBlock } from './blocks/CraftProgressBlock';
import { CraftSocialProofBlock } from './blocks/CraftSocialProofBlock';
import { CraftBonusBlock } from './blocks/CraftBonusBlock';
import { CraftGuaranteeBlock } from './blocks/CraftGuaranteeBlock';

interface CraftEditorProps {
  funnelId?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

export const CraftEditor: React.FC<CraftEditorProps> = ({
  funnelId,
  initialContent,
  onSave
}) => {
  const resolver = {
    CraftTextBlock,
    CraftHeadingBlock,
    CraftImageBlock,
    CraftButtonBlock,
    CraftQuizStartBlock,
    CraftQuizQuestionBlock,
    CraftQuizTransitionBlock,
    CraftQuizResultBlock,
    CraftOfferBlock,
    CraftContainer,
    CraftFormBlock,
    CraftSpacerBlock,
    CraftVideoBlock,
    CraftTestimonialBlock,
    CraftPricingBlock,
    CraftCountdownBlock,
    CraftFAQBlock,
    CraftProgressBlock,
    CraftSocialProofBlock,
    CraftBonusBlock,
    CraftGuaranteeBlock
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Editor
        resolver={resolver}
        onRender={({ render }) => (
          <div className="flex flex-1 overflow-hidden">
            {/* Toolbox lateral esquerda */}
            <div className="w-80 border-r bg-white">
              <CraftToolbox />
            </div>
            
            {/* Canvas central */}
            <div className="flex-1 flex flex-col">
              <CraftTopbar onSave={onSave} />
              <div className="flex-1 overflow-auto">
                <CraftCanvas>
                  <Frame>
                    <Element
                      canvas
                      is={CraftContainer}
                      className="min-h-screen p-4"
                    >
                      {initialContent ? (
                        <div dangerouslySetInnerHTML={{ __html: initialContent }} />
                      ) : (
                        <CraftTextBlock text="Clique para editar ou arraste componentes da barra lateral" />
                      )}
                    </Element>
                  </Frame>
                </CraftCanvas>
              </div>
            </div>
            
            {/* Painel de propriedades direita */}
            <div className="w-80 border-l bg-white">
              <CraftSettings />
            </div>
          </div>
        )}
      />
    </div>
  );
};
