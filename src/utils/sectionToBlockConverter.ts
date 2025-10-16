/**
 * 🔄 CONVERSOR DE SECTIONS → BLOCKS
 * 
 * Converte sections v3.0 do step-20 para blocos do editor
 */

import { Block } from '@/types/editor';

export function convertSectionsToBlocks(sections: any[]): Block[] {
  const blocks: Block[] = [];
  
  sections.forEach((section, index) => {
    switch (section.type) {
      case 'ResultCalculationSection': {
        // Section de cálculo - não precisa renderizar no editor
        // A lógica de cálculo acontece antes da exibição
        break;
      }
      
      case 'HeroSection': {
        // Parabéns/Greeting
        blocks.push({
          id: `${section.id}-greeting`,
          type: 'result-congrats',
          order: section.order * 10,
          properties: {
            showUserName: section.props?.showCelebration ?? true,
            fontSize: '2xl',
            fontWeight: 'semibold',
            textAlign: 'center',
            color: section.props?.colors?.greeting || 'text',
            animation: section.props?.celebrationAnimation || 'bounce'
          },
          content: {
            text: section.props?.greetingFormat || 'Olá, {userName}!',
            emoji: section.props?.celebrationEmoji || '🎉'
          }
        });
        
        // Título principal
        blocks.push({
          id: `${section.id}-title`,
          type: 'result-title',
          order: section.order * 10 + 1,
          properties: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center',
            color: section.props?.colors?.title || 'secondary'
          },
          content: {
            text: section.props?.titleFormat || 'Seu Estilo Predominante é:'
          }
        });
        
        // Nome do estilo
        blocks.push({
          id: `${section.id}-style-name`,
          type: 'result-style-name',
          order: section.order * 10 + 2,
          properties: {
            fontSize: '5xl',
            fontWeight: 'bold',
            textAlign: 'center',
            color: section.props?.colors?.styleName || 'primary',
            showGradient: true
          },
          content: {
            text: section.props?.styleNameDisplay || '{styleName}'
          }
        });
        break;
      }
      
      case 'StyleProfileSection': {
        // Imagem do estilo
        if (section.props?.showStyleImage) {
          blocks.push({
            id: `${section.id}-image`,
            type: 'result-image',
            order: section.order * 10,
            properties: {
              aspectRatio: section.props?.styleImage?.aspectRatio || '4/5',
              borderRadius: '8px',
              maxWidth: '400px',
              showDecorations: section.props?.styleImage?.showDecorations ?? true
            },
            content: {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
              alt: 'Estilo {resultStyle}'
            }
          });
        }
        
        // Texto introdutório
        if (section.props?.showIntroText && section.props?.introText?.text) {
          blocks.push({
            id: `${section.id}-intro`,
            type: 'result-text',
            order: section.order * 10 + 1,
            properties: {
              fontSize: 'lg',
              textAlign: 'center',
              fontStyle: section.props.introText.style || 'normal',
              backgroundColor: section.props.introText.background || 'transparent',
              padding: '1rem',
              borderLeft: section.props.introText.borderLeft
            },
            content: {
              text: section.props.introText.text
            }
          });
        }
        
        // Descrição do estilo
        if (section.props?.showDescription) {
          blocks.push({
            id: `${section.id}-description`,
            type: 'result-description',
            order: section.order * 10 + 2,
            properties: {
              fontSize: 'base',
              textAlign: 'left'
            },
            content: {
              text: '{styleDescription}' // Será substituído dinamicamente
            }
          });
        }
        
        // Texto de transição
        if (section.props?.showTransitionText && section.props?.transitionText) {
          blocks.push({
            id: `${section.id}-transition`,
            type: 'result-text',
            order: section.order * 10 + 3,
            properties: {
              fontSize: 'lg',
              textAlign: 'center',
              fontWeight: 'medium',
              marginY: '2rem'
            },
            content: {
              text: section.props.transitionText
            }
          });
        }
        
        // Barras de progresso (estilos secundários)
        if (section.props?.showProgressBars) {
          blocks.push({
            id: `${section.id}-progress`,
            type: 'result-progress-bars',
            order: section.order * 10 + 4,
            properties: {
              showTop: section.props.progressBars?.topCount || 3,
              showPercentage: section.props.progressBars?.showPercentage ?? true,
              animationDelay: section.props.progressBars?.animationDelay || 200,
              title: section.props.progressBars?.titleFormat || 'Além do {primaryStyle}, você também tem traços de:'
            },
            content: {
              scores: [] // Será preenchido dinamicamente
            }
          });
        }
        
        // Keywords/Tags
        if (section.props?.showKeywords) {
          blocks.push({
            id: `${section.id}-keywords`,
            type: 'result-keywords',
            order: section.order * 10 + 5,
            properties: {
              title: section.props.keywords?.title || 'Palavras que te definem:',
              tagColor: section.props.keywords?.tagColor || 'primary',
              tagStyle: section.props.keywords?.tagStyle || 'rounded-full'
            },
            content: {
              keywords: [] // Será preenchido dinamicamente
            }
          });
        }
        
        // Perguntas persuasivas
        if (section.props?.showPersuasiveQuestions) {
          blocks.push({
            id: `${section.id}-questions`,
            type: 'result-questions',
            order: section.order * 10 + 6,
            properties: {
              title: section.props.persuasiveQuestions?.title || '💭 Você já se perguntou...',
              icon: section.props.persuasiveQuestions?.icon || '❓',
              fontStyle: section.props.persuasiveQuestions?.style || 'italic',
              backgroundColor: section.props.persuasiveQuestions?.background || 'primary/5',
              borderColor: section.props.persuasiveQuestions?.border || 'primary/30'
            },
            content: {
              questions: [] // Será preenchido dinamicamente
            }
          });
        }
        
        // Mensagem de fechamento
        if (section.props?.showClosingMessage && section.props?.closingMessage?.text) {
          blocks.push({
            id: `${section.id}-closing`,
            type: 'result-text',
            order: section.order * 10 + 7,
            properties: {
              fontSize: 'lg',
              textAlign: section.props.closingMessage.textAlign || 'center',
              fontStyle: section.props.closingMessage.style || 'normal',
              fontWeight: section.props.closingMessage.fontWeight || 'normal',
              backgroundColor: section.props.closingMessage.background || 'transparent',
              padding: '1.5rem',
              marginY: '2rem'
            },
            content: {
              text: section.props.closingMessage.text
            }
          });
        }
        
        // Imagem do guia
        if (section.props?.showGuideImage) {
          blocks.push({
            id: `${section.id}-guide-image`,
            type: 'result-image',
            order: section.order * 10 + 8,
            properties: {
              aspectRatio: section.props.guideImage?.aspectRatio || '4/5',
              maxWidth: section.props.guideImage?.maxWidth || '28rem',
              centered: section.props.guideImage?.centered ?? true,
              borderRadius: '8px'
            },
            content: {
              url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
              alt: 'Guia de Imagem e Estilo'
            }
          });
        }
        break;
      }
      
      case 'CTAButton': {
        if (section.enabled) {
          blocks.push({
            id: section.id,
            type: 'result-cta',
            order: section.order * 10,
            properties: {
              text: section.props?.text || 'Descobrir Mais',
              icon: section.props?.icon,
              iconAnimation: section.props?.iconAnimation,
              style: section.props?.style || 'gradient',
              size: section.props?.size || 'large',
              fullWidthMobile: section.props?.fullWidthMobile ?? true,
              gradientFrom: section.props?.colors?.from || 'primary',
              gradientTo: section.props?.colors?.to || 'accent'
            },
            content: {
              url: '#checkout',
              transition: section.props?.transition
            }
          });
        }
        break;
      }
      
      case 'TransformationSection': {
        blocks.push({
          id: `${section.id}-title`,
          type: 'result-section-title',
          order: section.order * 10,
          properties: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center',
            highlightWords: section.props?.highlightWords || [],
            highlightColor: section.props?.highlightColor || 'primary'
          },
          content: {
            text: section.props?.mainTitle || 'Transformação'
          }
        });
        
        if (section.props?.subtitle) {
          blocks.push({
            id: `${section.id}-subtitle`,
            type: 'result-text',
            order: section.order * 10 + 1,
            properties: {
              fontSize: 'lg',
              textAlign: 'center',
              color: 'muted-foreground'
            },
            content: {
              text: section.props.subtitle
            }
          });
        }
        
        // Benefits/Features grid
        if (section.props?.benefits && Array.isArray(section.props.benefits)) {
          blocks.push({
            id: `${section.id}-benefits`,
            type: 'result-benefits',
            order: section.order * 10 + 2,
            properties: {
              layout: section.props.layout || 'grid-2x2',
              columns: 2
            },
            content: {
              items: section.props.benefits.map((b: any) => ({
                icon: b.icon,
                text: b.text,
                description: b.description
              }))
            }
          });
        }
        break;
      }
    }
  });
  
  return blocks.sort((a, b) => a.order - b.order);
}
