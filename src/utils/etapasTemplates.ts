import type { BlockData } from '../types/blocks';

/**
 * Templates das 21 etapas REAIS do funil de produção
 * Baseado no conteúdo real do QuizPage.tsx e dados de produção
 */

// ETAPA 1: Introdução do Quiz Real
export function getEtapa1Template(): BlockData[] {
  return [
    {
      id: 'etapa1-titulo',
      type: 'title-standalone',
      properties: {
        text: 'Descubra Seu Estilo Pessoal',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa1-subtitulo',
      type: 'subtitle-standalone',
      properties: {
        text: 'Um quiz completo para descobrir o estilo que combina com você',
        color: '#666666'
      }
    },
    {
      id: 'etapa1-imagem',
      type: 'single-image',
      properties: {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Descoberta de Estilo',
        width: '75%',
        borderRadius: 'lg'
      }
    },
    {
      id: 'etapa1-botao',
      type: 'single-button',
      properties: {
        text: 'Começar Quiz',
        style: 'primary',
        size: 'lg'
      }
    }
  ];
}

// ETAPA 2: Primeira Questão Real - "QUAL O SEU TIPO DE ROUPA FAVORITA?"
export function getEtapa2Template(): BlockData[] {
  return [
    {
      id: 'etapa2-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão 1 de 10',
        size: 'h3',
        color: '#3B82F6',
        alignment: 'center'
      }
    },
    {
      id: 'etapa2-pergunta',
      type: 'title-standalone',
      properties: {
        text: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa2-opcao1',
      type: 'single-button',
      properties: {
        text: 'Conforto, leveza e praticidade no vestir',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa2-opcao2',
      type: 'single-button',
      properties: {
        text: 'Discrição, caimento clássico e sobriedade',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa2-opcao3',
      type: 'single-button',
      properties: {
        text: 'Praticidade com um toque de estilo atual',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa2-opcao4',
      type: 'single-button',
      properties: {
        text: 'Elegância refinada, moderna e sem exageros',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}

// ETAPA 3: Segunda Questão Real - "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?"
export function getEtapa3Template(): BlockData[] {
  return [
    {
      id: 'etapa3-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão 2 de 10',
        size: 'h3',
        color: '#3B82F6',
        alignment: 'center'
      }
    },
    {
      id: 'etapa3-pergunta',
      type: 'title-standalone',
      properties: {
        text: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa3-opcao1',
      type: 'single-button',
      properties: {
        text: 'Visual leve, despojado e natural',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa3-opcao2',
      type: 'single-button',
      properties: {
        text: 'Visual clássico e tradicional',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa3-opcao3',
      type: 'single-button',
      properties: {
        text: 'Visual casual com toque atual',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa3-opcao4',
      type: 'single-button',
      properties: {
        text: 'Visual refinado e imponente',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}

// ETAPA 12: Primeira Questão Estratégica Real
export function getEtapa12Template(): BlockData[] {
  return [
    {
      id: 'etapa12-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão Estratégica 1',
        size: 'h3',
        color: '#9333EA',
        alignment: 'center'
      }
    },
    {
      id: 'etapa12-pergunta',
      type: 'title-standalone',
      properties: {
        text: 'Como você se sente em relação ao seu estilo pessoal hoje?',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa12-imagem',
      type: 'single-image',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
        alt: 'Estilo Pessoal',
        width: '50%',
        borderRadius: 'md'
      }
    },
    {
      id: 'etapa12-opcao1',
      type: 'single-button',
      properties: {
        text: 'Completamente perdida, não sei o que combina comigo',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa12-opcao2',
      type: 'single-button',
      properties: {
        text: 'Tenho algumas ideias, mas não sei como aplicá-las',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa12-opcao3',
      type: 'single-button',
      properties: {
        text: 'Conheço meu estilo, mas quero refiná-lo',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}

// ETAPA 13: Segunda Questão Estratégica Real
export function getEtapa13Template(): BlockData[] {
  return [
    {
      id: 'etapa13-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão Estratégica 2',
        size: 'h3',
        color: '#9333EA',
        alignment: 'center'
      }
    },
    {
      id: 'etapa13-pergunta',
      type: 'title-standalone',
      properties: {
        text: 'Qual é o maior desafio que você enfrenta ao se vestir?',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa13-imagem',
      type: 'single-image',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp',
        alt: 'Desafios de Estilo',
        width: '50%',
        borderRadius: 'md'
      }
    },
    {
      id: 'etapa13-opcao1',
      type: 'single-button',
      properties: {
        text: 'Nunca sei o que combina com o quê',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa13-opcao2',
      type: 'single-button',
      properties: {
        text: 'Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa13-opcao3',
      type: 'single-button',
      properties: {
        text: 'Não consigo criar looks diferentes com as peças que tenho',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}

// ETAPA 18: Questão de Preço Real
export function getEtapa18Template(): BlockData[] {
  return [
    {
      id: 'etapa18-numero',
      type: 'title-standalone',
      properties: {
        text: 'Questão Estratégica 6',
        size: 'h3',
        color: '#9333EA',
        alignment: 'center'
      }
    },
    {
      id: 'etapa18-pergunta',
      type: 'title-standalone',
      properties: {
        text: 'Quanto você estaria disposta a investir em um guia completo de estilo personalizado?',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa18-imagem',
      type: 'single-image',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp',
        alt: 'Investimento em Estilo',
        width: '50%',
        borderRadius: 'md'
      }
    },
    {
      id: 'etapa18-opcao1',
      type: 'single-button',
      properties: {
        text: 'Menos de R$100',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa18-opcao2',
      type: 'single-button',
      properties: {
        text: 'Entre R$100 e R$300',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa18-opcao3',
      type: 'single-button',
      properties: {
        text: 'Entre R$300 e R$500',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: 'etapa18-opcao4',
      type: 'single-button',
      properties: {
        text: 'Mais de R$500',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}

// ETAPA 21: CTA Final Real
export function getEtapa21Template(): BlockData[] {
  return [
    {
      id: 'etapa21-titulo',
      type: 'title-standalone',
      properties: {
        text: 'Qual desses resultados você mais gostaria de alcançar?',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center'
      }
    },
    {
      id: 'etapa21-imagem',
      type: 'single-image',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/t_Antes%20e%20Depois%20-%20de%20Descobrir%20seu%20Estilo/v1745459978/20250423_1704_Transforma%C3%A7%C3%A3o_no_Closet_Moderno_simple_compose_01jsj3xvy6fpfb6pyd5shg5eak_1_appany.webp',
        alt: 'Transformação de Estilo',
        width: '75%',
        borderRadius: 'lg'
      }
    },
    {
      id: 'etapa21-opcao1',
      type: 'single-button',
      properties: {
        text: 'Montar looks com mais facilidade e confiança',
        style: 'primary',
        size: 'lg'
      }
    },
    {
      id: 'etapa21-opcao2',
      type: 'single-button',
      properties: {
        text: 'Usar o que já tenho e me sentir estilosa',
        style: 'primary',
        size: 'lg'
      }
    },
    {
      id: 'etapa21-opcao3',
      type: 'single-button',
      properties: {
        text: 'Comprar com mais consciência e sem culpa',
        style: 'primary',
        size: 'lg'
      }
    },
    {
      id: 'etapa21-opcao4',
      type: 'single-button',
      properties: {
        text: 'Ser admirada pela imagem que transmito',
        style: 'primary',
        size: 'lg'
      }
    }
  ];
}

// Função para obter template de qualquer etapa
export function getEtapaTemplate(etapaId: string): BlockData[] {
  switch (etapaId) {
    case 'etapa-1': return getEtapa1Template();
    case 'etapa-2': return getEtapa2Template();
    case 'etapa-3': return getEtapa3Template();
    case 'etapa-12': return getEtapa12Template();
    case 'etapa-13': return getEtapa13Template();
    case 'etapa-14': return getEtapa14Template();
    case 'etapa-21': return getEtapa21Template();
    
    // Para etapas 4-11, 15-20 usar template de questão básica
    default:
      if (etapaId.match(/etapa-[4-9]|etapa-1[01]|etapa-1[5-9]|etapa-20/)) {
        return getQuestaoBasicaTemplate(etapaId);
      }
      return [];
  }
}

// Template padrão para questões básicas
function getQuestaoBasicaTemplate(etapaId: string): BlockData[] {
  const numeroEtapa = etapaId.replace('etapa-', '');
  return [
    {
      id: `${etapaId}-numero`,
      type: 'title-standalone',
      properties: {
        text: `Questão ${numeroEtapa} de 21`,
        size: 'h3',
        color: '#3B82F6',
        alignment: 'center'
      }
    },
    {
      id: `${etapaId}-pergunta`,
      type: 'text-paragraph',
      properties: {
        content: 'Sua pergunta personalizada aqui...',
        size: 'lg',
        color: '#1a1a1a'
      }
    },
    {
      id: `${etapaId}-opcao1`,
      type: 'single-button',
      properties: {
        text: 'Opção A',
        style: 'outline',
        size: 'md'
      }
    },
    {
      id: `${etapaId}-opcao2`,
      type: 'single-button',
      properties: {
        text: 'Opção B',
        style: 'outline',
        size: 'md'
      }
    }
  ];
}
