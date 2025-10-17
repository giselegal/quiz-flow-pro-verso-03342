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
        
        // Título principal → result-header
        blocks.push({
          id: `${section.id}-title`,
          type: 'result-header',
          order: section.order * 10 + 1,
          properties: {
            title: section.props?.titleFormat || 'Seu Estilo Predominante é:',
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          content: {}
        });
        
        // Nome do estilo → result-main
        blocks.push({
          id: `${section.id}-style-name`,
          type: 'result-main',
          order: section.order * 10 + 2,
          properties: {
            styleName: '{styleName}',
            percentage: 100,
            showGradient: true,
            fontSize: '5xl',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          content: {}
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
        
        // Texto introdutório → result-description
        if (section.props?.showIntroText && section.props?.introText?.text) {
          blocks.push({
            id: `${section.id}-intro`,
            type: 'result-description',
            order: section.order * 10 + 1,
            properties: {
              fontSize: 'lg',
              textAlign: 'center',
              maxWidth: '700px'
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
        
        // Texto de transição → result-description
        if (section.props?.showTransitionText && section.props?.transitionText) {
          blocks.push({
            id: `${section.id}-transition`,
            type: 'result-description',
            order: section.order * 10 + 3,
            properties: {
              fontSize: 'lg',
              textAlign: 'center',
              maxWidth: '700px'
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
        
        // Keywords/Tags → result-characteristics
        if (section.props?.showKeywords) {
          blocks.push({
            id: `${section.id}-keywords`,
            type: 'result-characteristics',
            order: section.order * 10 + 5,
            properties: {
              title: section.props.keywords?.title || 'Palavras que te definem:',
              items: [] // Será preenchido dinamicamente
            },
            content: {}
          });
        }
        
        // Perguntas persuasivas → result-description
        if (section.props?.showPersuasiveQuestions) {
          const questions = section.props.persuasiveQuestions?.questions || [];
          const questionText = (section.props.persuasiveQuestions?.title || '💭 Você já se perguntou...') + 
            '\n\n' + questions.join('\n');
          
          blocks.push({
            id: `${section.id}-questions`,
            type: 'result-description',
            order: section.order * 10 + 6,
            properties: {
              fontSize: 'base',
              textAlign: 'left',
              maxWidth: '700px'
            },
            content: {
              text: questionText
            }
          });
        }
        
        // Mensagem de fechamento → result-description
        if (section.props?.showClosingMessage && section.props?.closingMessage?.text) {
          blocks.push({
            id: `${section.id}-closing`,
            type: 'result-description',
            order: section.order * 10 + 7,
            properties: {
              fontSize: 'lg',
              textAlign: section.props.closingMessage.textAlign || 'center',
              maxWidth: '700px'
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
        // Título da seção → result-header
        blocks.push({
          id: `${section.id}-title`,
          type: 'result-header',
          order: section.order * 10,
          properties: {
            title: section.props?.mainTitle || 'Transformação',
            subtitle: section.props?.subtitle,
            fontSize: '3xl',
            textAlign: 'center'
          },
          content: {}
        });
        
        // Benefits/Features → result-characteristics
        if (section.props?.benefits && Array.isArray(section.props.benefits)) {
          blocks.push({
            id: `${section.id}-benefits`,
            type: 'result-characteristics',
            order: section.order * 10 + 1,
            properties: {
              title: 'Benefícios',
              items: section.props.benefits.map((b: any) => 
                `${b.icon || '✨'} ${b.text}${b.description ? ': ' + b.description : ''}`
              )
            },
            content: {}
          });
        }
        break;
      }
    }
  });
  
  return blocks.sort((a, b) => a.order - b.order);
}
