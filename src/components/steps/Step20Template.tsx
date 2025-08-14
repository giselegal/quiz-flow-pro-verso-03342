/**
 * Step20Template - Result Page with Modular Components (UPDATED)
 * Template for result page using new modular result components
 */
export const getStep20Template = () => {
  console.log('📋 Step20Template - Modular Result Page carregado!');
  return [
    {
      id: 'step20-result-header',
      type: 'result-header-inline',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoHeight: 40,
        userName: '',
        showUserName: true,
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
        styleCategory: 'Elegante',
        userName: '',
        title: 'Seu Estilo {styleCategory} foi Revelado! ✨',
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
      id: 'step20-urgency-countdown',
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
        primaryStyleCategory: 'Elegante',
        primaryGuideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/GUIA_ELEGANTE_bcksfq.webp',
        primaryStylePercentage: 75,
        showProgress: true,
        showSecondaryThumbnails: true,
        showExclusiveBadge: true,
        badgeText: 'Exclusivo',
        badgeColor: '#B89B7A',
        description: 'Seu guia de estilo personalizado baseado nas suas respostas do quiz',
        backgroundColor: '#ffffff',
        borderColor: '#B89B7A',
        containerWidth: 'xlarge',
        spacing: 'large',
        marginBottom: 24
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
      id: 'step20-motivation-section',
      type: 'text-inline',
      properties: {
        content: '💎 **Sua jornada de transformação começa hoje!**\n\nCada guia é personalizado especificamente para seu estilo único, garantindo que você tenha as ferramentas certas, as cores ideais e as modelagens perfeitas para sua própria transformação extraordinária.',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#432818',
        backgroundColor: '#f9f4ef',
        containerWidth: 'large',
        spacing: 'large',
        marginBottom: 24
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
          { item: 'Guia Principal de Estilo', value: 79 },
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