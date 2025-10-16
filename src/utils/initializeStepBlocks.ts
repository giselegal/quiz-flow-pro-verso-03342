/**
 * 🎯 INITIALIZE STEP BLOCKS - Popular blocos a partir do template
 * 
 * Converte o template quiz21StepsComplete (estrutura de sections)
 * para blocos individuais flat para o novo sistema de blocos independentes.
 */

import { Block, BlockType } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

const BRAND_LOGO_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';

/**
 * Converte uma section do template para blocos individuais
 */
function sectionToBlocks(section: any, stepId: string, sectionIndex: number): Block[] {
  const blocks: Block[] = [];
  let blockOrder = sectionIndex * 10; // Espaçamento para permitir inserções

  switch (section.type) {
    case 'intro-hero': {
      // Logo
      if (section.content.logoUrl) {
        blocks.push({
          id: `${stepId}-logo-${blockOrder}`,
          type: 'image-inline',
          order: blockOrder++,
          content: {
            url: section.content.logoUrl,
            alt: section.content.logoAlt || 'Logo',
            width: `${section.content.logoWidth || 96}px`,
            height: `${section.content.logoHeight || 96}px`,
            objectFit: 'contain'
          },
          properties: {
            alignment: 'center',
            marginBottom: '16px'
          }
        });
      }

      // Title (headline principal)
      if (section.content.title) {
        blocks.push({
          id: `${stepId}-title-${blockOrder}`,
          type: 'heading-inline',
          order: blockOrder++,
          content: {
            text: section.content.title,
            level: 1,
            fontSize: '32px',
            color: '#432818',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '24px'
          }
        });
      }

      // Subtitle
      if (section.content.subtitle) {
        blocks.push({
          id: `${stepId}-subtitle-${blockOrder}`,
          type: 'text-inline',
          order: blockOrder++,
          content: {
            text: section.content.subtitle,
            fontSize: '18px',
            color: '#6B7280',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '24px'
          }
        });
      }

      // Image
      if (section.content.imageUrl) {
        blocks.push({
          id: `${stepId}-image-${blockOrder}`,
          type: 'image-inline',
          order: blockOrder++,
          content: {
            url: section.content.imageUrl,
            alt: section.content.imageAlt || 'Imagem',
            width: '100%',
            borderRadius: '12px',
            objectFit: 'cover'
          },
          properties: {
            marginBottom: '24px',
            maxWidth: '400px',
            alignment: 'center'
          }
        });
      }

      // Description
      if (section.content.description) {
        blocks.push({
          id: `${stepId}-description-${blockOrder}`,
          type: 'text-inline',
          order: blockOrder++,
          content: {
            text: section.content.description,
            fontSize: '16px',
            color: '#4B5563',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '32px'
          }
        });
      }
      break;
    }

    case 'welcome-form': {
      // Question text
      if (section.content.questionText) {
        blocks.push({
          id: `${stepId}-question-${blockOrder}`,
          type: 'heading-inline',
          order: blockOrder++,
          content: {
            text: section.content.questionText,
            level: 3,
            fontSize: '20px',
            color: '#432818',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '16px'
          }
        });
      }

      // Name input field
      if (section.content.showNameField) {
        blocks.push({
          id: `${stepId}-name-input-${blockOrder}`,
          type: 'form-input',
          order: blockOrder++,
          content: {
            label: section.content.nameLabel || 'Seu nome',
            placeholder: section.content.namePlaceholder || 'Digite seu nome',
            fieldType: 'text',
            required: true,
            fieldName: 'userName'
          },
          properties: {
            marginBottom: '24px'
          }
        });
      }

      // Submit button
      if (section.content.submitText) {
        blocks.push({
          id: `${stepId}-submit-btn-${blockOrder}`,
          type: 'button-inline',
          order: blockOrder++,
          content: {
            text: section.content.submitText,
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
          },
          properties: {
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        });
      }
      break;
    }

    case 'question-hero': {
      // Progress header (logo + progress bar)
      blocks.push({
        id: `${stepId}-progress-header-${blockOrder}`,
        type: 'progress-inline',
        order: blockOrder++,
        content: {
          showLogo: true,
          logoUrl: BRAND_LOGO_URL,
          logoWidth: '120px',
          progressEnabled: true,
          progressPercent: section.content.progressValue || 0,
          autoProgress: true,
          barHeight: '4px',
          barColor: '#B89B7A',
          barBackground: '#E5E7EB'
        },
        properties: {
          marginBottom: '32px',
          sticky: true
        }
      });

      // Question number
      if (section.content.questionNumber) {
        blocks.push({
          id: `${stepId}-question-number-${blockOrder}`,
          type: 'text-inline',
          order: blockOrder++,
          content: {
            text: `Pergunta ${section.content.questionNumber} de ${section.content.totalQuestions || 13}`,
            fontSize: '14px',
            color: '#9CA3AF',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '8px'
          }
        });
      }

      // Question title
      if (section.content.title) {
        blocks.push({
          id: `${stepId}-question-title-${blockOrder}`,
          type: 'heading-inline',
          order: blockOrder++,
          content: {
            text: section.content.title,
            level: 2,
            fontSize: '24px',
            color: '#432818',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '24px'
          }
        });
      }
      break;
    }

    case 'options-grid': {
      // Options grid block
      blocks.push({
        id: `${stepId}-options-grid-${blockOrder}`,
        type: 'options-grid',
        order: blockOrder++,
        content: {
          options: section.content.options || []
        },
        properties: {
          multiSelect: section.content.multiSelect !== false,
          requiredSelections: section.content.requiredSelections || 1,
          maxSelections: section.content.maxSelections || 3,
          autoAdvance: section.content.autoAdvance !== false,
          showImages: section.content.showImages !== false,
          layout: section.content.layout || 'auto',
          marginBottom: '24px'
        }
      });

      // Next button (se não auto-advance ou se explicitamente requisitado)
      if (!section.content.autoAdvance || section.content.showNextButton) {
        blocks.push({
          id: `${stepId}-next-btn-${blockOrder}`,
          type: 'button-inline',
          order: blockOrder++,
          content: {
            text: section.content.nextButtonText || 'Próxima',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
          },
          properties: {
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            enableButtonOnlyWhenValid: true
          }
        });
      }
      break;
    }

    case 'result-header': {
      // Result header
      if (section.content.title) {
        blocks.push({
          id: `${stepId}-result-title-${blockOrder}`,
          type: 'result-header-inline',
          order: blockOrder++,
          content: {
            title: section.content.title,
            subtitle: section.content.subtitle,
            userName: '{userName}',
            resultStyle: '{resultStyle}'
          },
          properties: {
            marginBottom: '32px'
          }
        });
      }
      break;
    }

    case 'result-cards': {
      // Style result cards
      blocks.push({
        id: `${stepId}-style-cards-${blockOrder}`,
        type: 'style-card-inline',
        order: blockOrder++,
        content: {
          styles: section.content.styles || []
        },
        properties: {
          marginBottom: '32px'
        }
      });
      break;
    }

    case 'offer-hero': {
      // Offer header
      if (section.content.title) {
        blocks.push({
          id: `${stepId}-offer-title-${blockOrder}`,
          type: 'heading-inline',
          order: blockOrder++,
          content: {
            text: section.content.title,
            level: 1,
            fontSize: '32px',
            color: '#432818',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '16px'
          }
        });
      }

      if (section.content.subtitle) {
        blocks.push({
          id: `${stepId}-offer-subtitle-${blockOrder}`,
          type: 'text-inline',
          order: blockOrder++,
          content: {
            text: section.content.subtitle,
            fontSize: '18px',
            color: '#6B7280',
            textAlign: 'center'
          },
          properties: {
            marginBottom: '32px'
          }
        });
      }
      break;
    }

    case 'pricing': {
      // Price display
      blocks.push({
        id: `${stepId}-price-${blockOrder}`,
        type: 'pricing-card-inline',
        order: blockOrder++,
        content: {
          regularPrice: section.content.regularPrice,
          salePrice: section.content.salePrice,
          currency: 'R$',
          period: section.content.period || 'one-time'
        },
        properties: {
          marginBottom: '24px'
        }
      });
      break;
    }

    case 'cta': {
      // CTA button
      if (section.content.buttonText) {
        blocks.push({
          id: `${stepId}-cta-btn-${blockOrder}`,
          type: 'button-inline',
          order: blockOrder++,
          content: {
            text: section.content.buttonText,
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: section.content.action || 'external-link',
            url: section.content.buttonUrl
          },
          properties: {
            width: '100%',
            padding: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }
        });
      }
      break;
    }

    default:
      console.warn(`⚠️ Section type não mapeado: ${section.type}`);
  }

  return blocks;
}

/**
 * Inicializa blocos para um step específico
 */
export function initializeStepBlocks(stepId: string): Block[] {
  const template = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  
  if (!template || !template.sections) {
    console.warn(`⚠️ Template não encontrado para ${stepId}`);
    return [];
  }

  const blocks: Block[] = [];
  
  template.sections.forEach((section: any, index: number) => {
    const sectionBlocks = sectionToBlocks(section, stepId, index);
    blocks.push(...sectionBlocks);
  });

  // Adicionar stepId a todos os blocos
  return blocks.map(block => ({
    ...block,
    stepId
  }));
}

/**
 * Inicializa blocos para todos os 21 steps
 */
export function initializeAllStepBlocks(): {
  blocks: Block[];
  blocksByStep: Record<string, string[]>;
} {
  const allBlocks: Block[] = [];
  const blocksByStep: Record<string, string[]> = {};

  // Gerar steps de 1 a 21
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const stepBlocks = initializeStepBlocks(stepId);
    
    allBlocks.push(...stepBlocks);
    blocksByStep[stepId] = stepBlocks.map(b => b.id);
  }

  console.log('✅ Blocos inicializados para 21 steps:', {
    totalBlocks: allBlocks.length,
    stepsWithBlocks: Object.keys(blocksByStep).length
  });

  return {
    blocks: allBlocks,
    blocksByStep
  };
}
