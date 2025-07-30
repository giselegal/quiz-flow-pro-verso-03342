import type { BlockData } from '../types/blocks';

/**
 * Template de 21 Etapas com Componentes INDIVIDUALIZADOS
 * Cada elemento é um componente independente e modular
 * Facilita edição granular e personalização
 */
export function loadQuiz21EtapasIndividualizado(): BlockData[] {
  const blocks: BlockData[] = [
    // === ETAPA 1: INTRODUÇÃO COM COMPONENTES INDIVIDUAIS ===
    {
      id: 'etapa-1-titulo',
      type: 'title-standalone',
      properties: {
        text: 'Descubra Seu Estilo Pessoal',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },

    {
      id: 'etapa-1-subtitulo',
      type: 'subtitle-standalone',
      properties: {
        text: 'Um quiz completo para descobrir o estilo que combina com você',
        color: '#666666'
      }
    },

    {
      id: 'etapa-1-descricao',
      type: 'text-paragraph',
      properties: {
        content: 'Responda perguntas e receba um guia personalizado baseado no seu perfil único',
        size: 'base',
        color: '#374151'
      }
    },

    {
      id: 'etapa-1-imagem',
      type: 'single-image',
      properties: {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Descoberta de Estilo Pessoal',
        width: '75%',
        borderRadius: 'lg'
      }
    },

    {
      id: 'etapa-1-botao',
      type: 'single-button',
      properties: {
        text: 'Começar Quiz',
        style: 'primary',
        size: 'lg'
      }
    },

    {
      id: 'etapa-1-divisor',
      type: 'divider-line',
      properties: {
        style: 'solid',
        thickness: '2px',
        color: '#E5E7EB',
        width: '50%'
      }
    },

    // === ETAPA 2: PRIMEIRA QUESTÃO INDIVIDUALIZADA ===
    {
      id: 'etapa-2-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão 1 de 10',
        size: 'h3',
        color: '#3B82F6',
        alignment: 'center'
      }
    },

    {
      id: 'etapa-2-pergunta',
      type: 'text-paragraph',
      properties: {
        content: 'Qual dessas opções melhor descreve seu estilo atual?',
        size: 'lg',
        color: '#1a1a1a'
      }
    },

    {
      id: 'etapa-2-opcao-1',
      type: 'single-button',
      properties: {
        text: '✨ Elegante e sofisticado',
        style: 'outline',
        size: 'md'
      }
    },

    {
      id: 'etapa-2-opcao-2',
      type: 'single-button',
      properties: {
        text: '👕 Casual e confortável',
        style: 'outline',
        size: 'md'
      }
    },

    {
      id: 'etapa-2-espacamento',
      type: 'spacing-block',
      properties: {
        height: '30px'
      }
    },

    // === ETAPA 3: SEÇÃO DE ESTATÍSTICAS ===
    {
      id: 'etapa-3-titulo',
      type: 'title-standalone',
      properties: {
        text: 'Análise de Estilo',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },

    {
      id: 'etapa-3-stats',
      type: 'stats-counter',
      properties: {
        title: 'Seu Perfil Atual',
        stats: [
          { label: 'Elegância', value: 85, suffix: '%' },
          { label: 'Criatividade', value: 72, suffix: '%' },
          { label: 'Conforto', value: 90, suffix: '%' }
        ],
        layout: 'horizontal'
      }
    },

    // === ETAPA 4: DEPOIMENTO INDIVIDUAL ===
    {
      id: 'etapa-4-titulo',
      type: 'title-standalone',
      properties: {
        text: 'O que nossos clientes dizem',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },

    {
      id: 'etapa-4-depoimento',
      type: 'testimonial-card',
      properties: {
        name: 'Maria Silva',
        role: 'Designer',
        content: 'O quiz me ajudou a entender melhor meu estilo pessoal!',
        rating: 5
      }
    },

    // === ETAPA 5: RESULTADO VISUAL ===
    {
      id: 'etapa-5-card-estilo',
      type: 'style-card-inline',
      properties: {
        styleName: 'Elegante Moderno',
        percentage: 85,
        description: 'Você combina sofisticação com toques contemporâneos',
        showStars: true,
        showProgress: true,
        cardSize: 'medium'
      }
    },

    // === ETAPA 6: CALL TO ACTION FINAL ===
    {
      id: 'etapa-6-titulo',
      type: 'title-standalone',
      properties: {
        text: 'Transforme Seu Estilo Agora',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },

    {
      id: 'etapa-6-botao-principal',
      type: 'single-button',
      properties: {
        text: 'Quero Meu Guia Personalizado',
        style: 'primary',
        size: 'lg'
      }
    },

    {
      id: 'etapa-6-icone',
      type: 'icon-standalone',
      properties: {
        iconName: 'Star',
        size: 'xl',
        color: '#3B82F6'
      }
    }
  ];

  return blocks;
}
