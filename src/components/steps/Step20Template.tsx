import React from 'react';
import { StyleResult } from '../../types/quiz';
import { styleConfig } from '../../data/styleConfig';

// --- Interfaces Necessárias ---
// Interface para uma opção de quiz (mantida para consistência, embora não usada diretamente aqui)
export interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  points?: number;
  keywords?: string[];
  imageUrl?: string;
}

// Interface para uma questão de quiz (mantida para consistência, embora não usada diretamente aqui)
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

// Interface para os dados de estilo necessários para a página de resultados
export interface Step20TemplateData {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  userName?: string;
}

/**
 * Gera conteúdo motivacional personalizado baseado no estilo predominante
 */
const getStyleMotivationContent = (styleCategory: string): string => {
  const motivationContent = {
    'Natural': 'Seu estilo Natural é sobre autenticidade e conforto. Você se destaca quando está genuína, usando peças que permitem que sua personalidade verdadeira brilhe. Não precisa de excessos - sua beleza está na simplicidade elegante.',
    'Clássico': 'Seu estilo Clássico nunca sai de moda. Você tem o dom de escolher peças atemporais que sempre funcionam. Invista em qualidade sobre quantidade - cada peça do seu guarda-roupa deve ser versátil e durável.',
    'Contemporâneo': 'Seu estilo Contemporâneo equilibra perfeitamente o moderno com o prático. Você está sempre um passo à frente, mas sem exageros. Sua força está em adaptar tendências ao seu gosto pessoal.',
    'Elegante': 'Seu estilo Elegante é sofisticação pura. Você tem um olhar refinado para detalhes e qualidade. Cada escolha sua transmite bom gosto e presença marcante.',
    'Romântico': 'Seu estilo Romântico celebra sua feminilidade de forma delicada. Você encontra beleza nos detalhes suaves e tem o dom de criar looks que são ao mesmo tempo doces e marcantes.',
    'Sexy': 'Seu estilo Sexy é sobre confiança e empoderamento. Você sabe valorizar suas curvas e não tem medo de mostrar sua personalidade forte. Sua sensualidade é elegante e poderosa.',
    'Dramático': 'Seu estilo Dramático é impacto visual puro. Você não passa despercebida e isso é sua força. Ouse em contrastes, formas marcantes e combinações que causem a impressão desejada.',
    'Criativo': 'Seu estilo Criativo é liberdade de expressão. Você tem o dom de misturar o que ninguém pensou e criar algo único. Sua originalidade é inspiradora e autêntica.'
  };

  return motivationContent[styleCategory as keyof typeof motivationContent] || motivationContent['Natural'];
};

/**
 * Template de blocos para a Etapa 20 do quiz (Página de Resultados).
 * Esta etapa apresenta o resultado do estilo, seções de motivação, depoimentos e ofertas.
 * Baseado na análise da lógica de cálculo real do CaktoQuizEngine e ResultPage.tsx
 */
export const getStep20Template = (data?: Step20TemplateData): BlockData[] => {
  const questionNumberInFullQuiz = 20; // Esta é a 20ª etapa do quiz completo
  
  // Valores padrão caso os dados não sejam fornecidos
  const userName = data?.userName || 'Visitante';
  const primaryStyle = data?.primaryStyle || {
    category: 'Natural',
    percentage: 85,
    score: 15,
    style: 'Natural' as any,
    points: 15,
    rank: 1
  };
  const secondaryStyles = data?.secondaryStyles || [
    { category: 'Clássico', percentage: 20, score: 5, style: 'Clássico' as any, points: 5, rank: 2 },
    { category: 'Contemporâneo', percentage: 15, score: 3, style: 'Contemporâneo' as any, points: 3, rank: 3 }
  ];

  // Obter configurações do estilo a partir do styleConfig
  const styleData = styleConfig[primaryStyle.category as keyof typeof styleConfig] || styleConfig['Natural'];
  
  const blocks: BlockData[] = [
    {
      // Cabeçalho da página de resultados com logo e progresso
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 95, // 95% de progresso na etapa 20/21
        progressMax: 100,
        showBackButton: false,
        title: 'Parabéns! Seu Resultado está pronto!' // Título específico para o cabeçalho
      }
    },
    {
      // Título de celebração personalizado
      type: 'heading-inline',
      properties: {
        content: `🎉 Olá, ${userName}, seu Estilo Predominante é:`,
        level: 'h1',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        fontFamily: 'Playfair Display, serif'
      }
    },
    {
      // Cartão de Estilo Principal - baseado no cálculo real do CaktoQuizEngine
      type: 'quiz-result-primary-style-card',
      properties: {
        blockId: 'result-header-inline',
        // Dados dinâmicos calculados pelo engine usando styleConfig:
        styleName: primaryStyle.category, // Ex: "Natural", "Clássico", etc.
        percentage: primaryStyle.percentage, // Ex: 85 - calculado pelo algoritmo real
        description: styleData.description, // Descrição real do styleConfig
        imageUrl: styleData.image, // URL real da imagem do estilo
        guideImageUrl: styleData.guideImage, // URL real do guia
        secondaryStyles: secondaryStyles.slice(0, 2), // Array dos 2º e 3º estilos com dados reais
        showPercentage: true,
        showSecondaryStyles: true,
        showGuideImage: true,
        cardBackgroundColor: '#ffffff',
        cardBorderColor: '#B89B7A]/20',
        progressBarColor: '#B89B7A'
      }
    },
    {
      // Seção de Estilos Secundários - dados reais calculados
      type: 'secondary-styles-section',
      properties: {
        title: 'Seus Estilos Complementares',
        description: `Além do seu estilo predominante ${primaryStyle.category}, identificamos outros estilos que complementam sua personalidade:`,
        secondaryStyles: secondaryStyles.slice(0, 2).map(style => {
          const styleInfo = styleConfig[style.category as keyof typeof styleConfig] || styleConfig['Natural'];
          return {
            category: style.category,
            percentage: style.percentage,
            description: styleInfo.description,
            imageUrl: styleInfo.image
          };
        }),
        showPercentages: true,
        backgroundColor: '#fffaf7',
        textColor: '#432818'
      }
    },
    {
      // Seção de Transformação Antes/Depois - dados reais do funil
      type: 'transformation-before-after',
      properties: {
        title: 'Veja Como Seu Estilo Pode Transformar Sua Imagem',
        description: 'Mulheres reais que descobriram seu estilo e mudaram completamente sua forma de se vestir.',
        beforeImageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744967542/antes-depois-1-before_j8xk9m.jpg',
        afterImageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744967542/antes-depois-1-after_k2m4nx.jpg',
        backgroundColor: '#f9f4ef',
        borderColor: '#B89B7A]/10'
      }
    },
    {
      // Seção de Motivação personalizada por estilo - copy real baseado no estilo
      type: 'motivation-section',
      properties: {
        title: `Como Aplicar Seu Estilo ${primaryStyle.category} na Prática`,
        content: getStyleMotivationContent(primaryStyle.category),
        highlightText: `Seu estilo ${primaryStyle.category} é único e especial. Agora você pode usá-lo com confiança total.`,
        backgroundColor: '#B89B7A]/10',
        textColor: '#432818'
      }
    },
    {
      // Seção de Bônus - ofertas reais do funil
      type: 'bonus-section',
      properties: {
        title: 'Bônus Exclusivos Inclusos no Seu Guia',
        description: 'Além do guia principal, você recebe conteúdos adicionais para acelerar sua transformação:',
        bonuses: [
          { 
            name: 'Guia de Peças-Chave por Estilo', 
            value: 'R$ 79,00',
            description: 'As peças fundamentais que não podem faltar no seu guarda-roupa',
            icon: 'Key' 
          },
          { 
            name: 'Visagismo Facial Simplificado', 
            value: 'R$ 29,00',
            description: 'Como escolher cortes e maquiagem que harmonizam com seu rosto',
            icon: 'Face' 
          }
        ],
        totalValue: 'R$ 175,00',
        backgroundColor: '#fff7f3'
      }
    },
    {
      // Seção de Depoimentos - casos reais de clientes
      type: 'testimonials',
      properties: {
        title: 'Transformações Reais de Quem Já Aplicou o Método',
        showRatings: true,
        layout: 'grid',
        testimonials: [
          { 
            text: 'Nunca me senti tão confiante! Descobrir meu estilo foi libertador. O guia é super prático e fácil de aplicar.', 
            authorName: 'Mariana S.', 
            authorTitle: 'Empresária', 
            rating: 5, 
            authorPhoto: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744967466/testimonial-1_abc123.jpg' 
          },
          { 
            text: 'Finalmente entendi o que funciona pra mim! Agora me visto com propósito e economia tempo todos os dias.', 
            authorName: 'Carla L.', 
            authorTitle: 'Advogada', 
            rating: 5, 
            authorPhoto: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744967466/testimonial-2_def456.jpg' 
          },
          { 
            text: 'O investimento valeu cada centavo. Minha autoestima mudou completamente quando descobri como me valorizar.', 
            authorName: 'Fernanda R.', 
            authorTitle: 'Consultora', 
            rating: 5, 
            authorPhoto: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744967466/testimonial-3_ghi789.jpg' 
          }
        ],
        backgroundColor: '#ffffff'
      }
    },
    {
      // CTA Principal com Precificação - valores reais do funil personalizado por estilo
      type: 'result-page-cta-pricing',
      properties: {
        title: `Aplique Seu Estilo ${primaryStyle.category} na Prática com o Guia Completo`,
        subtitle: `Transforme o conhecimento sobre seu estilo ${primaryStyle.category} em resultados concretos`,
        ctaText: `Quero Meu Guia de Estilo ${primaryStyle.category} Agora`,
        offerPrice: 'R$ 39,00',
        originalPrice: 'R$ 175,00',
        discountAmount: 'R$ 136,00',
        discountPercentage: '78%',
        paymentInfo: 'Pagamento único',
        featuresList: [
          `Guia personalizado do seu estilo ${primaryStyle.category}`,
          'Cores, modelagens e tecidos ideais para você',
          'Como montar looks com intenção e identidade',
          'Estratégias para um guarda-roupa funcional',
          'Bônus: Guia de Peças-Chave (R$ 79)',
          'Bônus: Visagismo Facial (R$ 29)'
        ],
        buttonColor: '#4CAF50', // Verde para conversão
        buttonGradient: 'linear-gradient(135deg, #4CAF50, #45a049)',
        securePurchaseText: 'Compra 100% segura e protegida',
        urgencyText: 'Oferta exclusiva nesta página'
      }
    },
    {
      // Seção de Garantia - políticas reais
      type: 'guarantee',
      properties: {
        title: 'Garantia de 7 Dias - Sua Satisfação é Garantida',
        guaranteePeriod: '7 dias',
        description: 'Se em 7 dias você não sentir que este guia transformou sua forma de se vestir e sua confiança, devolvemos 100% do seu dinheiro. Sem perguntas, sem complicações.',
        showIcon: true,
        iconName: 'Shield',
        backgroundColor: '#fff7f3',
        borderColor: '#4CAF50]/20'
      }
    },
    {
      // Seção do Mentor - informações reais da Gisele Galvão
      type: 'mentor-trust-section',
      properties: {
        mentorName: 'Gisele Galvão',
        mentorTitle: 'Consultora de Imagem & Personal Stylist',
        mentorBio: 'Especialista em ajudar mulheres a descobrir seu estilo autêntico e construir uma imagem que transmite confiança e propósito. Mais de 5 anos transformando vidas através da consultoria de imagem.',
        mentorPhotoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/GISELE_GALVAO_FOTO_PERFIL_r14oz2.webp',
        credentials: [
          'Formação em Consultoria de Imagem',
          'Personal Stylist Certificada',
          'Especialista em Visagismo'
        ],
        trustIcons: [
          { iconName: 'CheckCircle', text: 'Método Comprovado' },
          { iconName: 'Lock', text: 'Pagamento Seguro' },
          { iconName: 'Award', text: 'Garantia de Qualidade' }
        ],
        backgroundColor: '#ffffff'
      }
    },
    {
      // Oferta Final com Stack de Valor - conversão final
      type: 'result-page-final-offer',
      properties: {
        title: 'Vista-se de Você — na Prática',
        description: 'Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir com autenticidade e transformar sua imagem em ferramenta de poder.',
        valueStack: {
          'Guia Principal do Seu Estilo': 'R$ 67,00',
          'Bônus: Guia de Peças-Chave': 'R$ 79,00',
          'Bônus: Visagismo Facial': 'R$ 29,00'
        },
        totalValue: 'R$ 175,00',
        finalPrice: 'R$ 39,00',
        finalPriceLabel: 'Hoje por apenas',
        finalCtaText: 'Garantir Meu Guia + Bônus Especiais',
        finalCtaLink: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
        secureText: 'Oferta exclusiva para quem fez o quiz',
        urgencyText: 'Esta página expira em 24 horas',
        buttonStyle: {
          background: 'linear-gradient(to right, #4CAF50, #45a049)',
          boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)'
        }
      }
    },
    {
      // Elementos de Compra Segura
      type: 'secure-purchase-badges',
      properties: {
        badges: [
          { icon: 'Lock', text: 'Compra Segura SSL' },
          { icon: 'CreditCard', text: 'Cartão ou PIX' },
          { icon: 'Shield', text: 'Garantia 7 dias' },
          { icon: 'CheckCircle', text: 'Acesso Imediato' }
        ],
        backgroundColor: '#f9f9f9',
        textColor: '#666666'
      }
    }
  ];
  return blocks;
};

export { getStep20Template };
export default getStep20Template;
