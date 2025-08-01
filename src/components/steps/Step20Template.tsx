import React from 'react';

// --- Interfaces Necessárias ---
// Interface para uma opção de quiz
export interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  points?: number;
  keywords?: string[];
  imageUrl?: string;
}

// Interface para uma questão de quiz
export interface QuizQuestion {
  id: string;
  title: string;
  type: 'text';
  multiSelect: number;
  imageUrl?: string;
  options: QuizOption[];
  advanceMode?: 'manual' | 'auto';
}

// Interface simplificada para BlockData (representa um componente de UI)
export interface BlockData {
  type: string;
  properties: Record<string, any>;
  id?: string;
  order?: number;
}

/**
 * Template de blocos para a Etapa 20 do quiz (Resultado Personalizado).
 * Esta etapa mostra o resultado completo com o perfil de estilo do usuário.
 */
export const getStep20Template = (): BlockData[] => {
  const blocks: BlockData[] = [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: '🎉 SEU RESULTADO ESTÁ PRONTO!',
        level: 'h1',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: 'Parabéns! Você completou o Quiz de Estilo Gisele Galvão.',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'result-card',
      properties: {
        title: 'Seu Estilo Predominante',
        description: 'Baseado nas suas respostas, identificamos seu perfil de estilo único.',
        backgroundColor: '#F9F7F4',
        borderColor: '#B89B7A',
        padding: 24,
        marginBottom: 24
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'O que você vai receber:',
        level: 'h3',
        fontSize: 'text-xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-left',
        color: '#432818',
        marginBottom: 16
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: '✨ **Análise completa** do seu perfil de estilo\n📋 **Guia personalizado** com dicas específicas para você\n👗 **Sugestões de looks** que combinam com sua personalidade\n🛍️ **Lista de peças-chave** para renovar seu guarda-roupa\n💎 **Dicas de styling** para valorizar seus pontos fortes',
        fontSize: 'text-base',
        textAlign: 'text-left',
        color: '#3a3a3a',
        marginBottom: 24,
        whiteSpace: 'pre-line'
      }
    },
    {
      type: 'image-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        alt: 'Resultado do Quiz de Estilo',
        width: 150,
        height: 150,
        borderRadius: 'rounded-lg',
        marginBottom: 24,
        className: 'mx-auto'
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: 'Para receber seu resultado completo e personalizado, clique no botão abaixo:',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24
      }
    },
    {
      type: 'button-inline',
      properties: {
        text: 'Receber Meu Resultado Completo',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: false,
        requiresValidSelection: false
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: '🎁 **Bônus especial:** Você também receberá acesso exclusivo ao nosso Guia de Estilo com desconto especial!',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#B89B7A',
        marginTop: 16,
        fontWeight: 'font-medium'
      }
    }
  ];
  
  return blocks;
};

export default getStep20Template;