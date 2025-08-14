/**
 * Step20Template - Complete Result Page with Personalized Data Integration
 * Template for comprehensive result page that integrates with Step20Result component
 * UPDATED: Now supports dynamic personalization based on quiz results
 * 
 * Usage:
 * - Static: getStep20Template() - uses default values
 * - Dynamic: getStep20Template({ userName: 'Maria', styleCategory: 'Natural', sessionId: 'abc123' })
 * - With Step20Result: Use the Step20Result component directly for full interactivity
 */
export const getStep20Template = (userData?: { 
  userName?: string; 
  styleCategory?: string;
  primaryStyleConfig?: any;
  sessionId?: string;
}) => {
  console.log('📋 Step20Template - Personalized Result Page carregado!', userData);
  
  // Use dynamic data if available, fallback to defaults
  const userName = userData?.userName || '';
  const styleCategory = userData?.styleCategory || 'Elegante';
  const sessionId = userData?.sessionId || 'demo-session';
  
  return [
    {
      id: 'step20-result-header',
      type: 'result-header-inline',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoHeight: 40,
        userName: userName,
        showUserName: userName ? true : false,
        backgroundColor: '#ffffff',
        containerWidth: 'full',
        spacing: 'normal',
        marginBottom: 0
      }
    },
    {
      id: 'step20-personalized-hook',
      type: 'personalized-hook-inline',
      properties: {
        styleCategory: styleCategory,
        userName: userName,
        title: userName 
          ? `${userName}, Seu Estilo ${styleCategory} foi Revelado! ✨`
          : `Seu Estilo ${styleCategory} foi Revelado! ✨`,
        subtitle: 'Agora que descobrimos sua essência estilística, é hora de transformar isso em looks poderosos que comunicam exatamente quem você é.',
        ctaText: 'Quero Transformar Minha Imagem',
        ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
        showCTA: true,
        backgroundColor: '#ffffff',
        accentColor: '#B89B7A',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 16
      }
    },
    {
      id: 'step20-urgency-countdown-a',
      type: 'urgency-countdown-inline',
      properties: {
        title: '⏰ Oferta Especial por Tempo Limitado!',
        subtitle: 'Esta página expira em:',
        countdownMinutes: 30,
        urgencyMessage: 'Não perca esta oportunidade única de transformar sua imagem com seu guia personalizado',
        backgroundColor: '#fff3cd',
        borderColor: '#ffc107',
        accentColor: '#dc3545',
        containerWidth: 'large',
        spacing: 'normal',
        marginBottom: 24,
        animated: true
      }
    },
    {
      id: 'step20-style-guides-visual',
      type: 'style-guides-visual-inline',
      properties: {
        primaryStyleCategory: styleCategory,
        primaryGuideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/GUIA_ELEGANTE_bcksfq.webp',
        primaryStylePercentage: 75,
        showProgress: true,
        showSecondaryThumbnails: true,
        showExclusiveBadge: true,
        badgeText: userName ? `Exclusivo para ${userName}` : 'Exclusivo',
        badgeColor: '#B89B7A',
        description: userName 
          ? `Seu guia de estilo personalizado ${userName}, baseado nas suas respostas do quiz`
          : 'Seu guia de estilo personalizado baseado nas suas respostas do quiz',
        backgroundColor: '#ffffff',
        borderColor: '#B89B7A',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-motivation-section',
      type: 'motivation-section-inline',
      properties: {
        title: 'Transforme Sua Imagem, Revele Sua Essência',
        subtitle: 'Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.',
        motivationText: 'Com a orientação certa, você pode transformar completamente a forma como o mundo te vê e, mais importante, como você se vê.',
        benefits: [
          'Construir looks com intenção e identidade visual marcante',
          'Utilizar cores, modelagens e tecidos que realmente te favorecem',
          'Alinhar sua imagem aos seus objetivos pessoais e profissionais',
          'Desenvolver um guarda-roupa funcional e inteligente, sem desperdícios'
        ],
        showMotivationText: true,
        showIcons: true,
        backgroundColor: '#f9f4ef',
        accentColor: '#B89B7A',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-before-after-transformation',
      type: 'before-after-transformation-inline',
      properties: {
        title: 'Veja as Transformações Reais',
        subtitle: 'Mulheres que aplicaram seu guia de estilo e transformaram completamente sua imagem pessoal e profissional',
        showTestimonials: true,
        backgroundColor: '#ffffff',
        accentColor: '#B89B7A',
        textColor: '#432818',
        containerWidth: 'xxlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-bonus-section',
      type: 'bonus-section-inline',
      properties: {
        title: 'Bônus Exclusivos para Você',
        subtitle: 'Além do guia principal, você receberá estas ferramentas complementares para potencializar sua jornada de transformação:',
        showValues: true,
        showHighlights: true,
        backgroundColor: '#ffffff',
        accentColor: '#B89B7A',
        containerWidth: 'xxlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-testimonials',
      type: 'testimonials-inline',
      properties: {
        title: 'O Que Nossas Clientes Dizem',
        subtitle: 'Depoimentos reais de mulheres que transformaram sua imagem e autoestima com nosso guia',
        showRatings: true,
        showProfession: true,
        showBeforeAfter: true,
        showHighlight: true,
        layout: 'grid',
        backgroundColor: '#ffffff',
        accentColor: '#B89B7A',
        containerWidth: 'xxlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-guarantee-section',
      type: 'guarantee-section-inline',
      properties: {
        title: '100% Garantido ou Seu Dinheiro de Volta',
        subtitle: 'Experimente nosso guia por 7 dias completos. Se não ficar completamente satisfeita, devolvemos seu investimento.',
        guaranteeDays: 7,
        showSealImage: true,
        showTrustBadges: true,
        backgroundColor: '#f8fffe',
        borderColor: '#10b981',
        accentColor: '#10b981',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-mentor-section',
      type: 'mentor-section-inline',
      properties: {
        mentorName: 'Gisele Galvão',
        mentorTitle: 'Consultora de Imagem & Personal Stylist',
        mentorImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/GISELE_MENTOR_FOTO_PROFISSIONAL_r14oz2.webp',
        mentorDescription: 'Com mais de 10 anos de experiência em consultoria de imagem, Gisele já transformou a vida de mais de 2.000 mulheres, ajudando-as a descobrir seu estilo único e elevar sua autoestima.',
        showCredentials: true,
        showAchievements: true,
        showTestimonial: true,
        backgroundColor: '#ffffff',
        accentColor: '#B89B7A',
        containerWidth: 'xxlarge',
        spacing: 'large',
        marginBottom: 32
      }
    },
    {
      id: 'step20-final-value-proposition',
      type: 'final-value-proposition-inline',
      properties: {
        title: 'Vista-se de Você — na Prática',
        subtitle: 'Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção.',
        description: 'O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir com autenticidade e transformar sua imagem em ferramenta de poder.',
        originalPrice: 175,
        currentPrice: 39,
        discount: 78,
        installments: '5x de R$ 8,83',
        benefits: [
          'Looks com intenção e identidade visual marcante',
          'Cores, modelagens e tecidos que realmente te favorecem', 
          'Imagem alinhada aos seus objetivos pessoais e profissionais',
          'Guarda-roupa funcional e inteligente, sem compras por impulso'
        ],
        valueStack: [
          { item: 'Guia Principal de Estilo Personalizado', value: 79 },
          { item: 'Bônus - Peças-chave do Guarda-roupa', value: 67 },
          { item: 'Bônus - Visagismo e Harmonia Facial', value: 29 }
        ],
        ctaText: 'GARANTIR MEU GUIA PERSONALIZADO AGORA',
        ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
        urgencyMessage: '⚡ Esta oferta expira ao sair desta página',
        backgroundColor: '#ffffff',
        accentColor: '#458B74',
        primaryColor: '#B89B7A',
        textColor: '#432818',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 0
      }
    }
  ];
};

export default getStep20Template;