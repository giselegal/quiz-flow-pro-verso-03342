/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 *
 * Este template contém a configuração completa do quiz de estilo com:
 * - Etapa 1: Coleta de nome
 * - Etapas 2-11: 10 questões pontuadas (3 seleções obrigatórias)
 * - Etapa 12: Transição para questões estratégicas
 * - Etapas 13-18: 6 questões estratégicas (1 seleção obrigatória)
 * - Etapa 19: Transição para resultado
 * - Etapa 20: Página de resultado personalizada
 * - Etapa 21: Página de oferta
 * 
 * 🔧 CONFIGURAÇÕES GLOBAIS NOCODE INCLUÍDAS:
 * - SEO: Meta tags, Open Graph, descrições otimizadas
 * - Tracking: Google Analytics, Facebook Pixel, GTM
 * - UTM: Configuração completa para campanhas Facebook
 * - Webhooks: Integração com ferramentas externas
 * - Branding: Cores, fontes e identidade visual
 * - Legal: Políticas de privacidade e conformidade
 * - Persistência: Estrutura completa de armazenamento
 * - Analytics: Configuração de métricas e eventos
 * - Performance: Otimizações de velocidade e cacheamento
 */

import { Block } from '../types/editor';

// 🔧 PERFORMANCE E CACHE OTIMIZADO
const TEMPLATE_CACHE = new Map<string, any>();
const FUNNEL_TEMPLATE_CACHE = new Map<string, any>();

// 🚀 FUNÇÃO DE CARREGAMENTO OTIMIZADO PARA PERFORMANCE
export function getStepTemplate(stepId: string): any {
  if (TEMPLATE_CACHE.has(stepId)) {
    return TEMPLATE_CACHE.get(stepId);
  }

  // Get template from the complete template object
  const template = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (template) {
    TEMPLATE_CACHE.set(stepId, template);
    return template;
  }

  console.warn(`⚠️ Template ${stepId} not found`);
  return null;
}

// 🎯 NOVA FUNÇÃO: Template personalizado por funil
export function getPersonalizedStepTemplate(stepId: string, funnelId?: string): any {
  // Se não há funnelId, usar template padrão
  if (!funnelId) {
    return getStepTemplate(stepId);
  }

  const cacheKey = `${funnelId}:${stepId}`;

  // Verificar cache de funil personalizado
  if (FUNNEL_TEMPLATE_CACHE.has(cacheKey)) {
    return FUNNEL_TEMPLATE_CACHE.get(cacheKey);
  }

  // Obter template base
  const baseTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (!baseTemplate) {
    console.warn(`⚠️ Template ${stepId} not found for funnel ${funnelId}`);
    return null;
  }

  // 🔄 PERSONALIZAR TEMPLATE baseado no funnelId
  const personalizedTemplate = personalizeTemplateForFunnel(baseTemplate, funnelId, stepId);

  // Cache da versão personalizada
  FUNNEL_TEMPLATE_CACHE.set(cacheKey, personalizedTemplate);

  console.log(`✅ Template personalizado criado: ${stepId} para funil ${funnelId}`);
  return personalizedTemplate;
}

// 🎨 FUNÇÃO DE PERSONALIZAÇÃO baseada no funnelId
function personalizeTemplateForFunnel(template: any[], funnelId: string, _stepId: string): any[] {
  if (!Array.isArray(template)) return template;

  // Gerar seed único baseado no funnelId para consistência
  const funnelSeed = generateSeedFromFunnelId(funnelId);
  const variantName = getFunnelVariantName(funnelSeed);
  const themeColors = getFunnelThemeColor(funnelSeed);

  return template.map((block) => {
    const personalizedBlock = JSON.parse(JSON.stringify(block)); // Deep clone

    // 🎯 PERSONALIZAÇÃO 1: IDs únicos por funil
    if (personalizedBlock.id) {
      personalizedBlock.id = `${personalizedBlock.id}-fnl${funnelSeed}`;
    }

    // 🎯 PERSONALIZAÇÃO 2: Headers do quiz
    if (personalizedBlock.type === 'quiz-intro-header') {
      if (personalizedBlock.content?.title) {
        personalizedBlock.content.title = `${personalizedBlock.content.title} (${variantName})`;
      }
      if (personalizedBlock.properties) {
        personalizedBlock.properties.backgroundColor = themeColors.bg;
        personalizedBlock.properties.borderColor = themeColors.text;
      }
    }

    // 🎯 PERSONALIZAÇÃO 3: Blocos de texto - CONTEÚDO REALMENTE DIFERENTE
    if (personalizedBlock.type === 'text' && personalizedBlock.content?.text) {
      const originalText = personalizedBlock.content.text;

      // Criar variações reais baseadas no tipo de funil
      const textVariations = getTextVariationsForFunnel(originalText, variantName, funnelSeed);

      let hashNum = 0;
      for (let i = 0; i < funnelSeed.length; i++) {
        hashNum += funnelSeed.charCodeAt(i);
      }
      personalizedBlock.content.text = textVariations[hashNum % textVariations.length];

      // Personalizar cores do texto
      if (personalizedBlock.properties) {
        personalizedBlock.properties.color = themeColors.text;
      }
    }

    // 🎯 PERSONALIZAÇÃO 4: Questões com variações
    if (personalizedBlock.type === 'quiz-question' && personalizedBlock.content?.question) {
      const originalQuestion = personalizedBlock.content.question;
      personalizedBlock.content.question = getQuestionVariationForFunnel(originalQuestion, variantName);
    }

    // 🎯 PERSONALIZAÇÃO 5: Inputs do formulário
    if (personalizedBlock.type === 'form-input' && personalizedBlock.content?.placeholder) {
      personalizedBlock.content.placeholder = getPlaceholderVariationForFunnel(
        personalizedBlock.content.placeholder,
        variantName
      );
    }

    // 🎯 PERSONALIZAÇÃO 6: Botões e navegação
    if ((personalizedBlock.type === 'button' || personalizedBlock.type === 'quiz-navigation')
      && personalizedBlock.content?.text) {
      personalizedBlock.content.text = getButtonVariationForFunnel(
        personalizedBlock.content.text,
        variantName
      );

      if (personalizedBlock.properties?.style) {
        personalizedBlock.properties.style.backgroundColor = themeColors.text;
        personalizedBlock.properties.style.color = themeColors.bg;
      }
    }

    // 🎯 PERSONALIZAÇÃO 7: Cores globais nos estilos
    if (personalizedBlock.properties?.style) {
      if (personalizedBlock.properties.style.backgroundColor?.includes('#F8F9FA')) {
        personalizedBlock.properties.style.backgroundColor = themeColors.bg;
      }
      if (personalizedBlock.properties.style.color?.includes('#432818')) {
        personalizedBlock.properties.style.color = themeColors.text;
      }
    }

    return personalizedBlock;
  });
}

// � FUNÇÕES AUXILIARES PARA VARIAÇÕES DE CONTEÚDO

// Criar variações reais de texto baseadas no tipo de funil
function getTextVariationsForFunnel(originalText: string, variantName: string, _funnelSeed: string): string[] {
  // Preservar HTML tags se existirem
  const hasHtml = originalText.includes('<');

  if (hasHtml) {
    return [
      originalText, // Original
      originalText.replace(/Chega/g, `Chegou a hora`),
      originalText.replace(/guarda-roupa/g, `closet ${variantName.toLowerCase()}`),
      originalText.replace(/nada combina/g, `nada mais combina`),
      originalText.replace(/com você/g, `com seu estilo ${variantName}`)
    ];
  } else {
    return [
      originalText,
      `${originalText} [Versão ${variantName}]`,
      originalText.replace(/você/g, `você (${variantName})`),
      `🎯 ${variantName}: ${originalText}`,
      originalText.replace(/seu/g, `seu exclusivo`)
    ];
  }
}

// Variações para perguntas do quiz
function getQuestionVariationForFunnel(originalQuestion: string, variantName: string): string {
  const variations = [
    originalQuestion,
    `${originalQuestion} (Edição ${variantName})`,
    `[${variantName}] ${originalQuestion}`,
    originalQuestion.replace(/Qual/g, `${variantName} - Qual`),
    originalQuestion.replace(/Como/g, `${variantName} - Como`)
  ];

  return variations[originalQuestion.length % variations.length];
}

// Variações para placeholders
function getPlaceholderVariationForFunnel(originalPlaceholder: string, variantName: string): string {
  const variations = [
    originalPlaceholder,
    `${originalPlaceholder} (${variantName})`,
    originalPlaceholder.replace(/Digite/g, `Digite aqui`),
    originalPlaceholder.replace(/seu/g, `seu ${variantName.toLowerCase()}`),
    `✨ ${originalPlaceholder}`
  ];

  return variations[originalPlaceholder.length % variations.length];
}

// Variações para botões
function getButtonVariationForFunnel(originalText: string, variantName: string): string {
  const variations = [
    originalText,
    `${originalText} ${variantName}`,
    originalText.replace(/Continuar/g, `Avançar`),
    originalText.replace(/Próximo/g, `Seguir`),
    `🚀 ${originalText}`
  ];

  return variations[originalText.length % variations.length];
}

// 🎲 Gerar seed consistente a partir do funnelId
function generateSeedFromFunnelId(funnelId: string): string {
  let hash = 0;
  for (let i = 0; i < funnelId.length; i++) {
    const char = funnelId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).slice(0, 8); // Remover prefixo "fnl"
}

// 🎨 Obter nome da variante baseado no seed
function getFunnelVariantName(seed: string): string {
  const variants = [
    'Premium', 'Pro', 'Classic', 'Elite', 'Special',
    'Advanced', 'Custom', 'Exclusive', 'Deluxe', 'Ultimate'
  ];
  // Usar hash numérico do seed completo ao invés do primeiro char
  let hashNum = 0;
  for (let i = 0; i < seed.length; i++) {
    hashNum += seed.charCodeAt(i);
  }
  const index = hashNum % variants.length;
  return variants[index];
}

// 🌈 Obter cores temáticas baseadas no funil
function getFunnelThemeColor(seed: string): { bg: string, text: string } {
  const themes = [
    { bg: '#f3f4f6', text: '#374151' }, // Gray
    { bg: '#fef3c7', text: '#92400e' }, // Yellow
    { bg: '#dbeafe', text: '#1e40af' }, // Blue
    { bg: '#d1fae5', text: '#065f46' }, // Green
    { bg: '#fce7f3', text: '#be185d' }, // Pink
    { bg: '#e0e7ff', text: '#3730a3' }, // Indigo
    { bg: '#fed7d7', text: '#c53030' }, // Red
    { bg: '#c6f6d5', text: '#2d3748' }, // Light Green
  ];
  // Usar hash diferente para cores (soma dos char codes * posição)
  let colorHash = 0;
  for (let i = 0; i < seed.length; i++) {
    colorHash += seed.charCodeAt(i) * (i + 1);
  }
  const index = colorHash % themes.length;
  return themes[index];
}

// 🔧 ESTRUTURA COMPLETA DE PERSISTÊNCIA JSON  
export const FUNNEL_PERSISTENCE_SCHEMA = {
  // Metadados básicos
  id: 'quiz21StepsComplete',
  name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
  description: 'Template completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e ofertas.',
  version: '2.0.0',
  category: 'quiz',
  templateType: 'quiz-complete',

  // Configurações de persistência  
  persistence: {
    enabled: true,
    storage: ['localStorage', 'supabase', 'session'] as const,
    autoSave: true,
    autoSaveInterval: 30000, // 30 segundos
    compression: true,
    encryption: false,
    backupEnabled: true,
    lazyLoading: true, // ✨ NOVO: Carregamento sob demanda
    cacheEnabled: true, // ✨ NOVO: Cache inteligente

    // Estrutura de dados para armazenamento
    dataStructure: {
      funnel_data: {
        id: 'string',
        name: 'string',
        description: 'string',
        category: 'string',
        user_id: 'string?',
        is_published: 'boolean',
        created_at: 'timestamp',
        updated_at: 'timestamp',

        // Dados do funil
        settings: 'FunnelSettings',
        steps: 'FunnelStep[]',
        blocks: 'Block[]',
        metadata: 'FunnelMetadata',

        // Dados da sessão do usuário
        user_session: {
          userName: 'string',
          email: 'string?',
          phone: 'string?',
          startedAt: 'timestamp',
          completedAt: 'timestamp?',
          currentStep: 'number',
          progress: 'number',

          // Respostas do quiz
          quiz_answers: {
            question_id: 'string',
            selected_options: 'string[]',
            scores: 'Record<string, number>',
            timestamp: 'timestamp'
          },

          // Respostas estratégicas
          strategic_answers: {
            question_id: 'string',
            answer: 'string',
            timestamp: 'timestamp'
          },

          // Resultado final
          result: {
            primary_style: 'string',
            secondary_styles: 'string[]',
            total_score: 'number',
            style_scores: 'Record<string, number>',
            personalized_recommendations: 'string[]'
          }
        }
      }
    }
  },

  // Configurações de analytics e tracking
  analytics: {
    enabled: true,
    realTime: true,
    trackingId: 'GA4-XXXXXXXXX', // Para ser configurado

    // Eventos personalizados
    events: [
      'funnel_started',
      'step_completed',
      'quiz_question_answered',
      'strategic_question_answered',
      'result_calculated',
      'offer_viewed',
      'conversion_completed',
      'user_drop_off',
      'session_timeout'
    ],

    // Métricas de performance
    performance: {
      trackPageLoad: true,
      trackInteractions: true,
      trackScrollDepth: true,
      trackTimeOnStep: true,
      trackCompletionRate: true
    },

    // Configurações de heatmap e session recording
    heatmap: {
      enabled: true,
      hotjarId: '1234567', // Para ser configurado
      recordSessions: true,
      trackClicks: true,
      trackScrolls: true
    }
  }
};

// 🌐 CONFIGURAÇÕES GLOBAIS NOCODE EXPANDIDAS
export const QUIZ_GLOBAL_CONFIG = {
  // SEO Configuration - Otimizada para conversão
  seo: {
    title: 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
    description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança. Consultoria de imagem profissional.',
    keywords: 'estilo pessoal, consultoria de imagem, quiz de estilo, moda feminina, guarda-roupa, personal stylist, Gisele Galvão, quiz interativo, descobrir estilo, transformação visual',

    // Open Graph otimizado para redes sociais
    ogTitle: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
    ogDescription: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante. Transforme seu guarda-roupa e se vista com mais confiança.',
    ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
    ogType: 'website',
    ogLocale: 'pt_BR',

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterTitle: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
    twitterDescription: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante.',
    twitterImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
    twitterSite: '@giselegaalvao',

    // Meta tags técnicas
    favicon: '/favicon.ico',
    canonicalUrl: 'https://quiz-sell-genius.com/',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '#B89B7A',

    // Structured Data (JSON-LD) para SEO
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Quiz de Estilo Pessoal',
      description: 'Descubra seu estilo predominante através de perguntas personalizadas',
      author: {
        '@type': 'Person',
        name: 'Gisele Galvão',
        url: 'https://giselegaalvao.com'
      },
      provider: {
        '@type': 'Organization',
        name: 'Gisele Galvão - Consultoria de Imagem',
        url: 'https://giselegaalvao.com'
      }
    },

    customMetaTags: `
      <meta name="author" content="Gisele Galvão">
      <meta name="robots" content="index, follow">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="theme-color" content="#B89B7A">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="default">
      <meta name="format-detection" content="telephone=no">
      <link rel="canonical" href="https://quiz-sell-genius.com/">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://www.google-analytics.com">
      <link rel="prefetch" href="https://res.cloudinary.com/dqljyf76t/">
    `
  },

  // Domain & Hosting - Configuração completa de domínios
  domain: {
    primaryDomain: 'quiz-sell-genius.com',
    customDomains: [
      'quiz-descubra-seu-estilo.com',
      'estilopessoal.gisele.com',
      'quiz.giselegaalvao.com'
    ],
    ssl: true,
    enforceHTTPS: true,

    // Configurações de CDN
    cdn: {
      enabled: true,
      provider: 'cloudflare',
      regions: ['US', 'BR', 'EU'],
      cacheSettings: {
        static: '30d',
        dynamic: '1h',
        api: '5m'
      }
    },

    // Redirecionamentos
    redirects: `
      /quiz -> /
      /estilo -> /
      /descobrir-estilo -> /
      /quiz-style -> /
      /style-quiz -> /
      /consultoria -> /resultado
    `,

    // Configurações de CORS
    cors: {
      allowedOrigins: ['https://giselegaalvao.com', 'https://quiz-sell-genius.com'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },

  // Tracking & Analytics - Configuração completa de rastreamento
  tracking: {
    // Google Analytics 4
    googleAnalytics: {
      measurementId: 'GA4-XXXXXXXXX', // Para ser configurado
      enhanced: true,
      demographics: true,
      advertising: true,

      // Eventos personalizados
      customEvents: [
        'quiz_started',
        'quiz_completed',
        'step_completed',
        'offer_viewed',
        'conversion'
      ]
    },

    // Facebook Pixel
    facebookPixel: {
      pixelId: '123456789012345', // Para ser configurado
      enabled: true,

      // Eventos do Facebook
      events: [
        'PageView',
        'ViewContent',
        'CompleteRegistration',
        'Lead',
        'Purchase'
      ],

      // Configurações avançadas
      advanced: {
        automaticMatching: true,
        firstPartyData: true,
        serverSideEvents: false
      }
    },

    // Google Tag Manager
    googleTagManager: {
      containerId: 'GTM-XXXXXXX', // Para ser configurado
      enabled: true,
      dataLayer: 'dataLayer',

      // Configurações personalizadas
      custom: {
        trackFormSubmissions: true,
        trackClicks: true,
        trackScrollDepth: true,
        trackFileDownloads: true
      }
    },

    // Hotjar para heatmaps
    hotjar: {
      siteId: '1234567', // Para ser configurado
      enabled: true,

      // Configurações de privacy
      respectDNT: true,
      cookieless: false,

      // Configurações de recording
      sessionRecording: {
        enabled: true,
        sampleRate: 100,
        recordConsoleErrors: true
      }
    },

    // Scripts personalizados
    customScripts: `
      <!-- Criativo Ads Tracking -->
      <script>
        window.criativoTracking = {
          campaign: 'quiz_style_abtest_2025',
          source: 'facebook',
          medium: 'cpc',
          version: '2.0.0'
        };
        
        // Tracking personalizado para etapas do quiz
        window.quizTracking = {
          trackStepCompletion: function(step, data) {
            gtag('event', 'quiz_step_completed', {
              'custom_step': step,
              'custom_data': JSON.stringify(data)
            });
          },
          
          trackQuizCompletion: function(result) {
            gtag('event', 'quiz_completed', {
              'custom_primary_style': result.primaryStyle,
              'custom_score': result.totalScore
            });
            
            // Facebook Pixel
            fbq('track', 'CompleteRegistration', {
              content_name: 'Quiz de Estilo Pessoal',
              status: 'completed'
            });
          }
        };
      </script>
    `,

    enableTracking: true,
    privacyCompliant: true,
    gdprCompliant: true
  },

  // UTM & Campaign - Integração com campanhas de marketing
  campaign: {
    defaultSource: 'facebook',
    defaultMedium: 'cpc',
    defaultCampaign: 'quiz_style_abtest_2025',
    autoUTM: true,
    trackingPrefix: 'qsq',

    // Configurações de attribution
    attribution: {
      window: 30, // dias
      model: 'last_click',
      crossDevice: true
    },

    // Parâmetros UTM personalizados
    customParameters: [
      'creative_id',
      'ad_set_id',
      'placement',
      'audience'
    ],

    // Referência ao arquivo UTM existente
    utmConfigPath: '/src/config/utmConfig.js',

    // Configurações de A/B testing
    abTesting: {
      enabled: true,
      platform: 'facebook',

      variants: [
        {
          id: 'variant_a',
          name: 'Quiz Focus',
          traffic: 50,
          utmContent: 'quiz_focus'
        },
        {
          id: 'variant_b',
          name: 'Result Focus',
          traffic: 50,
          utmContent: 'result_focus'
        }
      ]
    }
  },

  // Webhooks & Integrations - Integrações com ferramentas externas
  webhooks: {
    // Configurações gerais
    enableWebhooks: true,
    secretKey: 'your-webhook-secret-key-here',
    timeout: 10000, // 10 segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo

    // URLs de webhook por evento
    endpoints: {
      leadCapture: 'https://hooks.zapier.com/hooks/catch/123456/lead-capture/',
      formSubmission: 'https://hooks.zapier.com/hooks/catch/123456/form-submit/',
      purchaseComplete: 'https://hooks.zapier.com/hooks/catch/123456/purchase/',
      quizComplete: 'https://hooks.zapier.com/hooks/catch/123456/quiz-complete/',
      stepCompleted: 'https://hooks.zapier.com/hooks/catch/123456/step-completed/',
      userDropOff: 'https://hooks.zapier.com/hooks/catch/123456/user-drop-off/'
    },

    // Configurações específicas para cada evento
    events: {
      leadCapture: {
        fields: ['userName', 'email', 'phone', 'quizScore', 'resultStyle', 'timestamp'],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        includeMetadata: true
      },

      quizComplete: {
        fields: [
          'userName', 'email', 'answers', 'score', 'resultStyle',
          'secondaryStyles', 'recommendations', 'timestamp', 'sessionDuration'
        ],
        method: 'POST',
        includeTimestamp: true,
        includeUserAgent: true,
        includeReferrer: true
      },

      stepCompleted: {
        fields: ['stepId', 'stepName', 'timeSpent', 'answers', 'timestamp'],
        method: 'POST',
        batchMode: true,
        batchSize: 10
      }
    },

    // Integrações específicas
    integrations: {
      // Zapier
      zapier: {
        enabled: true,
        webhookUrl: 'https://hooks.zapier.com/hooks/catch/123456/main/',
        fields: ['all']
      },

      // ActiveCampaign
      activeCampaign: {
        enabled: false,
        apiUrl: 'https://youraccountname.api-us1.com',
        apiKey: '', // Para ser configurado
        listId: '', // Para ser configurado
        tags: ['quiz-lead', 'style-interested']
      },

      // Mailchimp
      mailchimp: {
        enabled: false,
        apiKey: '', // Para ser configurado
        audienceId: '', // Para ser configurado
        tags: ['quiz-completed', 'style-quiz']
      },

      // RD Station
      rdStation: {
        enabled: false,
        token: '', // Para ser configurado
        eventName: 'quiz_completed'
      }
    }
  },

  // Branding & Design - Identidade visual completa
  branding: {
    // Cores primárias
    colors: {
      primary: '#B89B7A',
      secondary: '#432818',
      accent: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',

      // Gradientes
      gradients: {
        primary: 'linear-gradient(135deg, #B89B7A, #D4C2A8)',
        accent: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
        warm: 'linear-gradient(135deg, #B89B7A, #432818)'
      },

      // Backgrounds
      backgrounds: {
        primary: '#FAF9F7',
        secondary: '#FFFFFF',
        card: '#FEFEFE',
        border: '#E6DDD4'
      }
    },

    // Tipografia
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', serif",

      // Tamanhos
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },

      // Pesos
      weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },

    // Logos e imagens
    assets: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Gisele Galvão - Consultoria de Imagem',
      faviconUrl: '/favicon.ico',

      // Imagens padrão
      defaultImages: {
        placeholder: 'https://via.placeholder.com/400x300/B89B7A/FFFFFF?text=Carregando...',
        error: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Erro+ao+carregar'
      }
    },

    // Layout e espaçamento
    layout: {
      maxWidth: '1200px',
      containerPadding: '1rem',

      // Breakpoints responsivos
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },

      // Espaçamentos
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    },

    // CSS customizado
    customCSS: `
      :root {
        --brand-primary: #B89B7A;
        --brand-secondary: #432818;
        --brand-accent: #3B82F6;
        --brand-bg: #FAF9F7;
        --brand-border: #E6DDD4;
        --brand-shadow: rgba(184, 155, 122, 0.1);
        --brand-gradient: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
      }
      
      .quiz-container {
        font-family: var(--brand-font-family);
        background-color: var(--brand-bg);
        min-height: 100vh;
      }
      
      .brand-gradient {
        background: var(--brand-gradient);
      }
      
      .brand-shadow {
        box-shadow: 0 4px 6px -1px var(--brand-shadow), 0 2px 4px -1px var(--brand-shadow);
      }
      
      .brand-glow {
        box-shadow: 0 0 20px var(--brand-shadow);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .animate-pulse, .animate-bounce, .animate-spin {
          animation: none;
        }
      }
    `
  },

  // Legal & Compliance - Conformidade legal completa
  legal: {
    // URLs de políticas
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    cookiePolicyUrl: '/cookies',

    // Configurações de cookies
    cookies: {
      showBanner: true,
      bannerText: 'Este site utiliza cookies para melhorar sua experiência e personalizar o conteúdo. Ao continuar navegando, você concorda com nossa política de cookies.',
      acceptText: 'Aceitar todos',
      rejectText: 'Recusar opcionais',
      settingsText: 'Configurar',

      // Categorias de cookies
      categories: {
        necessary: {
          name: 'Essenciais',
          description: 'Necessários para o funcionamento básico do site',
          required: true
        },
        analytics: {
          name: 'Analíticos',
          description: 'Nos ajudam a entender como você usa o site',
          required: false
        },
        marketing: {
          name: 'Marketing',
          description: 'Usados para personalizar anúncios e conteúdo',
          required: false
        }
      }
    },

    // Conformidade GDPR/LGPD
    dataProtection: {
      gdprCompliant: true,
      lgpdCompliant: true,

      // Direitos do usuário
      userRights: [
        'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
      ],

      // Configurações de consentimento
      consent: {
        explicit: true,
        granular: true,
        withdrawable: true,
        recordKeeping: true
      }
    },

    // Informações da empresa
    companyInfo: {
      name: 'Gisele Galvão - Consultoria de Imagem',
      legalName: 'Gisele Galvão ME',
      cnpj: '00.000.000/0001-00', // Para ser configurado
      address: {
        street: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '00000-000',
        country: 'Brasil'
      },
      contact: {
        phone: '(11) 99999-9999',
        email: 'contato@giselegaalvao.com',
        website: 'https://giselegaalvao.com'
      }
    },

    // Disclaimers
    disclaimers: {
      quiz: 'Os resultados deste quiz são baseados em suas respostas e têm caráter orientativo.',
      consultation: 'Para uma análise completa, recomendamos uma consultoria personalizada.',
      results: 'Os resultados podem variar de pessoa para pessoa.'
    }
  },

  // A/B Testing Configuration - Testes A/B avançados
  abTesting: {
    enabled: true,

    // Configurações globais
    settings: {
      cookieDuration: 30, // dias
      trafficSplit: 'equal',
      statisticalSignificance: 0.95,
      minimumSampleSize: 100
    },

    // Testes ativos
    activeTests: [
      {
        id: 'homepage_variant_2025',
        name: 'Homepage Quiz vs Landing',
        status: 'active',
        trafficPercentage: 100,

        variants: [
          {
            id: 'control',
            name: 'Quiz Direto',
            path: '/',
            weight: 50,
            description: 'Página com quiz interativo direto'
          },
          {
            id: 'landing',
            name: 'Landing Page',
            path: '/landing',
            weight: 50,
            description: 'Landing page com apresentação + quiz'
          }
        ],

        goals: [
          {
            name: 'quiz_completion',
            type: 'conversion',
            priority: 'primary'
          },
          {
            name: 'email_capture',
            type: 'conversion',
            priority: 'secondary'
          }
        ]
      }
    ]
  },

  // Performance & Optimization - Otimizações de performance
  performance: {
    // Configurações de cache
    caching: {
      enableBrowserCache: true,
      enableServiceWorker: true,
      cacheStrategy: 'stale-while-revalidate',

      // TTL por tipo de resource
      cacheTTL: {
        static: 2592000, // 30 dias
        images: 604800,  // 7 dias
        api: 300,        // 5 minutos
        html: 3600       // 1 hora
      }
    },

    // Compressão
    compression: {
      enableGzip: true,
      enableBrotli: true,
      compressionLevel: 6
    },

    // Otimização de imagens
    images: {
      enableLazyLoading: true,
      enableWebP: true,
      enableAVIF: true,

      // Formatos por device
      responsive: {
        mobile: { width: 375, format: 'webp' },
        tablet: { width: 768, format: 'webp' },
        desktop: { width: 1200, format: 'webp' }
      },

      // CDN settings
      cdn: {
        provider: 'cloudinary',
        baseUrl: 'https://res.cloudinary.com/dqljyf76t/',
        transformations: 'f_auto,q_auto'
      }
    },

    // Preloading crítico
    criticalResources: [
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ],

    // Configurações de loading
    loading: {
      showSkeletons: true,
      showProgressBar: true,
      enablePrefetch: true,
      enablePreconnect: true
    },

    // Monitoramento de performance
    monitoring: {
      enableWebVitals: true,
      reportToGA: true,

      // Thresholds de alerta
      thresholds: {
        LCP: 2500,  // Largest Contentful Paint
        FID: 100,   // First Input Delay
        CLS: 0.1    // Cumulative Layout Shift
      }
    }
  },

  // Configurações de segurança
  security: {
    // Headers de segurança
    headers: {
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' *.google-analytics.com *.googletagmanager.com *.facebook.net *.hotjar.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.cloudinary.com *.google-analytics.com *.facebook.com *.hotjar.com; connect-src 'self' *.google-analytics.com *.hotjar.com *.supabase.co;",
      frameOptions: 'DENY',
      contentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },

    // Rate limiting
    rateLimiting: {
      enabled: true,
      requests: 100,
      window: 3600000, // 1 hora
      skipSuccessfulRequests: true
    },

    // Validation
    inputValidation: {
      enableXSSProtection: true,
      enableSQLInjectionProtection: true,
      maxInputLength: 1000,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp']
    }
  }
};

// Verificar se estamos em ambiente de desenvolvimento real do Vite
const IS_TEST = false; // Forçar template completo para debugging

console.log('🔍 Template loading:', {
  NODE_ENV: import.meta.env?.MODE || 'unknown',
  DEV: import.meta.env?.DEV || false,
  IS_TEST,
  willUseMinimalTemplate: IS_TEST
});

// Template mínimo para testes: 21 etapas com 1 bloco simples cada
const MINIMAL_TEST_TEMPLATE: Record<string, Block[]> = (() => {
  const t: Record<string, Block[]> = {};
  for (let i = 1; i <= 21; i++) {
    t[`step-${i}`] = [{ id: `t-${i}`, type: 'text', order: 0, content: {}, properties: {} } as any];
  }
  return t;
})();

export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = IS_TEST ? MINIMAL_TEST_TEMPLATE : {
  // 🎯 ETAPA 1: COLETA DO NOME
  'step-1': [
    {
      id: 'step1-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        // Wrapper do cabeçalho (sem título/subtítulo/descrição)
        showLogo: true,
        showProgress: false,
        showNavigation: false,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        animation: 'fadeIn',
        animationDuration: '0.8s',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: false,
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        // Layout refinado
        contentMaxWidth: 640,
        progressHeight: 8,
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['content', 'style', 'layout', 'behavior'],
        },
      },
    },
    {
      id: 'step1-title',
      type: 'text',
      order: 1,
      content: {
        text: '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Chega</span> <span style="font-family: \'Playfair Display\', serif;">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">nada combina com você.</span>',
      },
      properties: {
        fontSize: 'text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        textAlign: 'center',
        color: '#432818',
        lineHeight: 'leading-tight',
        maxWidth: '640px',
        marginTop: 12,
        marginBottom: 10,
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['content', 'style', 'layout'],
        },
      },
    },
    {
      id: 'step1-subtitle',
      type: 'text',
      order: 2,
      content: {
        text: '',
      },
      properties: {
        fontSize: 'text-lg md:text-xl',
        fontWeight: 'font-normal',
        textAlign: 'center',
        color: '#432818',
        lineHeight: 'leading-relaxed',
        maxWidth: '640px',
        marginTop: 6,
        marginBottom: 16,
      },
    },
    {
      id: 'step1-intro-image',
      type: 'image',
      order: 3,
      content: {},
      properties: {
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        alt: 'Descubra seu estilo predominante',
        width: 'auto',
        height: 'auto',
        maxWidth: 'lg',
        alignment: 'center',
        borderRadius: 'large',
        marginTop: 8,
        marginBottom: 12,
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['content', 'style', 'layout'],
        },
      },
    },
    {
      id: 'step1-decorative-bar',
      type: 'decorative-bar',
      order: 4,
      content: {},
      properties: {
        // Centralizada e limitada à largura do conteúdo
        width: 'min(640px, 100%)',
        height: 4,
        color: '#B89B7A',
        gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
        borderRadius: 3,
        marginTop: 12,
        marginBottom: 24,
        showShadow: true,
        backgroundColor: '#B89B7A',
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['style', 'layout'],
        },
      },
    },
    {
      id: 'step1-lead-form',
      type: 'form-container',
      order: 5,
      content: {
        title: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        requiredMessage: 'Por favor, digite seu nome para continuar',
        validationMessage: 'Digite seu nome para continuar',
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        fieldType: 'text',
        required: true,
        autoAdvanceOnComplete: true,
        dataKey: 'userName',
        backgroundColor: '#FFFFFF',
        borderColor: '#B89B7A',
        textColor: '#432818',
        labelColor: '#432818',
        buttonBackgroundColor: '#B89B7A',
        buttonTextColor: '#FFFFFF',
        fontSize: '16',
        borderRadius: '8',
        marginTop: 16,
        marginBottom: 16,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        // 🔗 INTEGRAÇÃO SUPABASE para coleta de nome
        saveToSupabase: true,
        supabaseTable: 'quiz_users',
        supabaseColumn: 'name',
        minLength: 2,
        maxLength: 50,
      },
      properties: {
        // ID opcional para integração com o container
        elementId: 'step1-form-container',
        targetButtonId: 'intro-cta-button',
        // Auto-advance diretamente no container (ou no botão filho)
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 600,
        // Aparência do container
        backgroundColor: '#FFFFFF',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        supabaseConfig: {
          enabled: true,
          table: 'quiz_users',
          column: 'name',
        },
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['content', 'behavior', 'style', 'layout'],
        },
        // Filhos do container: input + botão
        children: [
          {
            id: 'intro-name-input',
            type: 'form-input',
            properties: {
              label: 'Como posso te chamar?',
              placeholder: 'Digite seu primeiro nome aqui...',
              name: 'userName',
              inputType: 'text',
              required: true,
              fullWidth: true,
              backgroundColor: '#FFFFFF',
              borderColor: '#B89B7A',
              textColor: '#432818',
              labelColor: '#432818',
              fontSize: '16',
              fontFamily: 'inherit',
              fontWeight: '400',
              borderRadius: '8',
              marginTop: 8,
              marginBottom: 8,
              // 🔗 COLETA DE NOME PARA RESULTADO FINAL
              minLength: 2,
              maxLength: 50,
              saveToSupabase: true,
              supabaseTable: 'quiz_users',
              supabaseColumn: 'name',
              // Para uso no resultado final
              storeAsUserName: true,
              resultDisplayKey: 'userName',
            },
          },
          {
            id: 'intro-cta-button',
            type: 'button-inline',
            properties: {
              text: 'Quero Descobrir meu Estilo Agora!',
              requiresValidInput: true,
              action: 'next-step',
              nextStepId: 'step-2',
              autoAdvanceOnComplete: true,
              autoAdvanceDelay: 600,
              // Estilo do botão alinhado ao template
              backgroundColor: '#B89B7A',
              textColor: '#FFFFFF',
              borderColor: '#B89B7A',
              fontSize: '16',
              fontFamily: 'inherit',
              fontWeight: '500',
              borderRadius: 8,
              hoverOpacity: 90,
              effectType: 'none',
              shadowType: 'none',
              showDisabledState: true,
              disabledText: 'Digite seu nome para continuar',
              disabledOpacity: 60,
            },
          },
        ],
      },
    },
    {
      id: 'step1-legal-notice',
      type: 'legal-notice',
      order: 6,
      content: {},
      properties: {
        // Texto principal e links legais
        copyrightText:
          '© 2025 Gisele Galvão - Todos os direitos reservados. Suas informações são seguras.',
        privacyText: 'Política de Privacidade',
        termsText: 'Termos de Uso',
        privacyLinkUrl: '/privacy',
        termsLinkUrl: '/terms',
        showPrivacyLink: true,
        showTermsLink: true,
        // Estilo
        fontSize: 'text-xs',
        textAlign: 'center',
        textColor: '#9CA3AF',
        linkColor: '#B89B7A',
        marginTop: 32,
        marginBottom: 8,
        // 🔧 CONFIGURAÇÕES DE PAINEL MODERNO
        propertiesPanelConfig: {
          enabled: true,
          inlineEditingDisabled: true,
          categories: ['content', 'style', 'layout'],
        },
      },
    },
    {

      id: 'step1-footer',
      type: 'text',
      order: 7,
      content: {
        text: '2025 - Gisele Galvão - Todos os direitos reservados',
      },
      properties: {
        fontSize: '12px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 24,
      },
    },
  ],

  // =============================================================
  // 🔧 EDIT AQUI: ETAPA 2 (Questão 1) - TIPO DE ROUPA FAVORITA
  // Onde editar:
  // - content.question: texto da pergunta
  // - content.options: lista de opções (id, text, imageUrl)
  // - properties: regras de seleção (requiredSelections, maxSelections, etc.)
  // Observação: o componente OptionsGrid lê primeiro properties.options;
  // se estiver vazio, usa content.options (onde este template define as opções).
  // =============================================================
  // 🎯 ETAPA 2: QUESTÃO 1 - TIPO DE ROUPA FAVORITA
  'step-2': [
    {
      id: 'step2-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 1 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step2-question',
      type: 'options-grid',
      order: 4,
      content: {
        question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        options: [
          {
            id: 'natural_q1',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
          },
          {
            id: 'classico_q1',
            text: 'Discrição, caimento clássico e sobriedade',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
          },
          {
            id: 'contemporaneo_q1',
            text: 'Praticidade com um toque de estilo atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
          },
          {
            id: 'elegante_q1',
            text: 'Elegância refinada, moderna e sem exageros',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
          },
          {
            id: 'romantico_q1',
            text: 'Delicadeza em tecidos suaves e fluidos',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
          },
          {
            id: 'sexy_q1',
            text: 'Sensualidade com destaque para o corpo',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
          },
          {
            id: 'dramatico_q1',
            text: 'Impacto visual com peças estruturadas e assimétricas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
          },
          {
            id: 'criativo_q1',
            text: 'Mix criativo com formas ousadas e originais',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
          },
        ],
      },
      properties: {
        questionId: 'q1_roupa_favorita',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        // Pontuação por opção
        scoreValues: {
          natural_q1: 1,
          classico_q1: 1,
          contemporaneo_q1: 1,
          elegante_q1: 1,
          romantico_q1: 1,
          sexy_q1: 1,
          dramatico_q1: 1,
          criativo_q1: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 3: QUESTÃO 2 - PERSONALIDADE (CORRIGIDO - MOVIDO PARA POSIÇÃO CORRETA)
  'step-3': [
    {
      id: 'step3-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 2 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 20,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step3-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'RESUMA A SUA PERSONALIDADE:',
        options: [
          {
            id: 'natural_q2',
            text: 'Informal, espontânea, alegre, essencialista',
          },
          {
            id: 'classico_q2',
            text: 'Conservadora, séria, organizada',
          },
          {
            id: 'contemporaneo_q2',
            text: 'Informada, ativa, prática',
          },
          {
            id: 'elegante_q2',
            text: 'Exigente, sofisticada, seletiva',
          },
          {
            id: 'romantico_q2',
            text: 'Feminina, meiga, delicada, sensível',
          },
          {
            id: 'sexy_q2',
            text: 'Glamorosa, vaidosa, sensual',
          },
          {
            id: 'dramatico_q2',
            text: 'Cosmopolita, moderna e audaciosa',
          },
          {
            id: 'criativo_q2',
            text: 'Exótica, aventureira, livre',
          },
        ],
      },
      properties: {
        questionId: 'q2_personalidade',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q2: 1,
          classico_q2: 1,
          contemporaneo_q2: 1,
          elegante_q2: 1,
          romantico_q2: 1,
          sexy_q2: 1,
          dramatico_q2: 1,
          criativo_q2: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 4: QUESTÃO 3 - QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  'step-4': [
    {
      id: 'step4-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 3 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 30,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step4-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: 'natural_q3',
            text: 'Visual leve, despojado e natural',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
          },
          {
            id: 'classico_q3',
            text: 'Visual clássico e tradicional',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
          },
          {
            id: 'contemporaneo_q3',
            text: 'Visual casual com toque atual',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
          },
          {
            id: 'elegante_q3',
            text: 'Visual refinado e imponente',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
          },
          {
            id: 'romantico_q3',
            text: 'Visual romântico, feminino e delicado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
          },
          {
            id: 'sexy_q3',
            text: 'Visual sensual, com saia justa e decote',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
          },
          {
            id: 'dramatico_q3',
            text: 'Visual marcante e urbano (jeans + jaqueta)',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
          },
          {
            id: 'criativo_q3',
            text: 'Visual criativo, colorido e ousado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
          },
        ],
      },
      properties: {
        questionId: 'q3_visual_identificacao',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q3: 1,
          classico_q3: 1,
          contemporaneo_q3: 1,
          elegante_q3: 1,
          romantico_q3: 1,
          sexy_q3: 1,
          dramatico_q3: 1,
          criativo_q3: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 5: QUESTÃO 4 - QUAIS DETALHES VOCÊ GOSTA?
  'step-5': [
    {
      id: 'step5-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 4 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 40,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step5-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAIS DETALHES VOCÊ GOSTA?',
        options: [
          {
            id: 'natural_q4',
            text: 'Poucos detalhes, básico e prático',
          },
          {
            id: 'classico_q4',
            text: 'Bem discretos e sutis, clean e clássico',
          },
          {
            id: 'contemporaneo_q4',
            text: 'Básico, mas com um toque de estilo',
          },
          {
            id: 'elegante_q4',
            text: 'Detalhes refinados, chic e que deem status',
          },
          {
            id: 'romantico_q4',
            text: 'Detalhes delicados, laços, babados',
          },
          {
            id: 'sexy_q4',
            text: 'Roupas que valorizem meu corpo: couro, zíper, fendas',
          },
          {
            id: 'dramatico_q4',
            text: 'Detalhes marcantes, firmeza e peso',
          },
          {
            id: 'criativo_q4',
            text: 'Detalhes diferentes do convencional, produções ousadas',
          },
        ],
      },
      properties: {
        questionId: 'q4_detalhes',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q4: 1,
          classico_q4: 1,
          contemporaneo_q4: 1,
          elegante_q4: 1,
          romantico_q4: 1,
          sexy_q4: 1,
          dramatico_q4: 1,
          criativo_q4: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 6: QUESTÃO 5 - QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
  'step-6': [
    {
      id: 'step6-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 5 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 50,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step6-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: 'natural_q5',
            text: 'Estampas clean, com poucas informações',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
          },
          {
            id: 'classico_q5',
            text: 'Estampas clássicas e atemporais',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
          },
          {
            id: 'contemporaneo_q5',
            text: 'Atemporais, mas que tenham uma pegada atual e moderna',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
          },
          {
            id: 'elegante_q5',
            text: 'Estampas clássicas e atemporais, mas sofisticadas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
          },
          {
            id: 'romantico_q5',
            text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
          },
          {
            id: 'sexy_q5',
            text: 'Estampas de animal print, como onça, zebra e cobra',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
          },
          {
            id: 'dramatico_q5',
            text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
          },
          {
            id: 'criativo_q5',
            text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
          },
        ],
      },
      properties: {
        questionId: 'q5_estampas',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q5: 1,
          classico_q5: 1,
          contemporaneo_q5: 1,
          elegante_q5: 1,
          romantico_q5: 1,
          sexy_q5: 1,
          dramatico_q5: 1,
          criativo_q5: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 7: QUESTÃO 6 - QUAL CASACO É SEU FAVORITO?
  'step-7': [
    {
      id: 'step7-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 6 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 60,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step7-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAL CASACO É SEU FAVORITO?',
        options: [
          {
            id: 'natural_q6',
            text: 'Cardigã bege confortável e casual',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp',
          },
          {
            id: 'classico_q6',
            text: 'Blazer verde estruturado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp',
          },
          {
            id: 'contemporaneo_q6',
            text: 'Trench coat bege tradicional',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp',
          },
          {
            id: 'elegante_q6',
            text: 'Blazer branco refinado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp',
          },
          {
            id: 'romantico_q6',
            text: 'Casaco pink vibrante e moderno',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp',
          },
          {
            id: 'sexy_q6',
            text: 'Jaqueta vinho de couro estilosa',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp',
          },
          {
            id: 'dramatico_q6',
            text: 'Jaqueta preta estilo rocker',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp',
          },
          {
            id: 'criativo_q6',
            text: 'Casaco estampado criativo e colorido',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp',
          },
        ],
      },
      properties: {
        questionId: 'q6_casaco',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q6: 1,
          classico_q6: 1,
          contemporaneo_q6: 1,
          elegante_q6: 1,
          romantico_q6: 1,
          sexy_q6: 1,
          dramatico_q6: 1,
          criativo_q6: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 8: QUESTÃO 7 - QUAL ESTILO DE CALÇA MAIS COMBINA COM VOCÊ?
  'step-8': [
    {
      id: 'step8-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 7 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 70,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step8-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAL SUA CALÇA FAVORITA?',
        options: [
          {
            id: 'natural_q7',
            text: 'Calça fluida acetinada bege',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp',
          },
          {
            id: 'classico_q7',
            text: 'Calça de alfaiataria cinza',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp',
          },
          {
            id: 'contemporaneo_q7',
            text: 'Jeans reto e básico',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp',
          },
          {
            id: 'elegante_q7',
            text: 'Calça reta bege de tecido',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp',
          },
          {
            id: 'romantico_q7',
            text: 'Calça ampla rosa alfaiatada',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp',
          },
          {
            id: 'sexy_q7',
            text: 'Legging preta de couro',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp',
          },
          {
            id: 'dramatico_q7',
            text: 'Calça reta preta de couro',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp',
          },
          {
            id: 'criativo_q7',
            text: 'Calça estampada floral leve e ampla',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp',
          },
        ],
      },
      properties: {
        questionId: 'q7_calca',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q7: 1,
          classico_q7: 1,
          contemporaneo_q7: 1,
          elegante_q7: 1,
          romantico_q7: 1,
          sexy_q7: 1,
          dramatico_q7: 1,
          criativo_q7: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 9: QUESTÃO 8 - SAPATOS
  'step-9': [
    {
      id: 'step9-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 8 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 80,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step9-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        options: [
          {
            id: 'natural_q8',
            text: 'Tênis nude casual e confortável',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp',
          },
          {
            id: 'classico_q8',
            text: 'Scarpin nude de salto baixo',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp',
          },
          {
            id: 'contemporaneo_q8',
            text: 'Sandália dourada com salto bloco',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp',
          },
          {
            id: 'elegante_q8',
            text: 'Scarpin nude salto alto e fino',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp',
          },
          {
            id: 'romantico_q8',
            text: 'Sandália anabela off white',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp',
          },
          {
            id: 'sexy_q8',
            text: 'Sandália rosa de tiras finas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp',
          },
          {
            id: 'dramatico_q8',
            text: 'Scarpin preto moderno com vinil transparente',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp',
          },
          {
            id: 'criativo_q8',
            text: 'Scarpin colorido estampado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp',
          },
        ],
      },
      properties: {
        questionId: 'q8_sapatos',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q8: 1,
          classico_q8: 1,
          contemporaneo_q8: 1,
          elegante_q8: 1,
          romantico_q8: 1,
          sexy_q8: 1,
          dramatico_q8: 1,
          criativo_q8: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 10: QUESTÃO 9 - ACESSÓRIOS (TEXTO)
  'step-10': [
    {
      id: 'step10-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 9 de 10',
        subtitle: '',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 90,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step10-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        options: [
          {
            id: 'natural_q9',
            text: 'Pequenos e discretos, às vezes nem uso',
            imageUrl:
              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'classico_q9',
            text: 'Brincos pequenos e discretos. Corrente fininha',
            imageUrl:
              'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'contemporaneo_q9',
            text: 'Acessórios que elevem meu look com um toque moderno',
            imageUrl:
              'https://images.unsplash.com/photo-1571295051928-5feaf8bde4aa?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'elegante_q9',
            text: 'Acessórios sofisticados, joias ou semijoias',
            imageUrl:
              'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'romantico_q9',
            text: 'Peças delicadas e com um toque feminino',
            imageUrl:
              'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'sexy_q9',
            text: 'Brincos longos, colares que valorizem minha beleza',
            imageUrl:
              'https://images.unsplash.com/photo-1618164435735-413d3b066c1a?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'dramatico_q9',
            text: 'Acessórios pesados, que causem um impacto',
            imageUrl:
              'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
          {
            id: 'criativo_q9',
            text: 'Acessórios diferentes, grandes e marcantes',
            imageUrl:
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=center&fm=jpg&q=85',
          },
        ],
      },
      properties: {
        questionId: 'q9_acessorios',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q9: 1,
          classico_q9: 1,
          contemporaneo_q9: 1,
          elegante_q9: 1,
          romantico_q9: 1,
          sexy_q9: 1,
          dramatico_q9: 1,
          criativo_q9: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 11: QUESTÃO 10 - TECIDOS
  'step-11': [
    {
      id: 'step11-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 10 de 10',
        subtitle: 'Descubra seu Estilo Predominante',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
        showLogo: true,
        showProgress: true,
        showNavigation: true,
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 100,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step11-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
        options: [
          {
            id: 'natural_q10',
            text: 'São fáceis de cuidar',
          },
          {
            id: 'classico_q10',
            text: 'São de excelente qualidade',
          },
          {
            id: 'contemporaneo_q10',
            text: 'São fáceis de cuidar e modernos',
          },
          {
            id: 'elegante_q10',
            text: 'São sofisticados',
          },
          {
            id: 'romantico_q10',
            text: 'São delicados',
          },
          {
            id: 'sexy_q10',
            text: 'São perfeitos ao meu corpo',
          },
          {
            id: 'dramatico_q10',
            text: 'São diferentes, e trazem um efeito para minha roupa',
          },
          {
            id: 'criativo_q10',
            text: 'São exclusivos, criam identidade no look',
          },
        ],
      },
      properties: {
        questionId: 'q10_tecidos',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q10: 1,
          classico_q10: 1,
          contemporaneo_q10: 1,
          elegante_q10: 1,
          romantico_q10: 1,
          sexy_q10: 1,
          dramatico_q10: 1,
          criativo_q10: 1,
        },
      },
    },
  ],
  // 🎯 ETAPA 12: TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
  'step-12': [
    // Header compacto com progresso (mantém identidade e responsividade)
    {
      id: 'step12-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        progressValue: 12,
      },
      properties: {
        showLogo: true,
        logoWidth: 96,
        logoHeight: 96,
        showProgress: true,
        progressValue: 12,
        progressTotal: 100,
        progressBarColor: '#B89B7A',
        progressBarThickness: 6,
        backgroundColor: '#FFFFFF',
        textColor: '#432818',
        containerWidth: 'full',
        spacing: 'small',
        marginBottom: 16,
      },
    },
    // Título da transição
    {
      id: 'step12-transition-title',
      type: 'text-inline',
      order: 1,
      content: {
        content: '🕐 Enquanto calculamos o seu resultado...',
      },
      properties: {
        content: '🕐 Enquanto calculamos o seu resultado...',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 8,
      },
    },
    // Texto 1
    {
      id: 'step12-transition-text-1',
      type: 'text-inline',
      order: 2,
      content: {
        content:
          'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
      },
      properties: {
        content:
          'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#1A1818',
      },
    },
    // Texto 2
    {
      id: 'step12-transition-text-2',
      type: 'text-inline',
      order: 3,
      content: {
        content:
          'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
      },
      properties: {
        content:
          'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#1A1818',
        marginBottom: 16,
      },
    },
    // Destaque
    {
      id: 'step12-transition-callout',
      type: 'text-inline',
      order: 4,
      content: {
        content: '💬 Responda com sinceridade. Isso é só entre você e a sua nova versão.',
      },
      properties: {
        content: '💬 Responda com sinceridade. Isso é só entre você e a sua nova versão.',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#432818',
        backgroundColor: '#B89B7A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      },
    },
    // Primeira questão estratégica (auto-avançar em 250ms)
    {
      id: 'step12-options-grid',
      type: 'options-grid',
      order: 5,
      content: {
        question:
          'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
        options: [
          { id: 'q12_opt1', text: 'Me sinto desconectada da mulher que sou hoje' },
          { id: 'q12_opt2', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
          { id: 'q12_opt3', text: 'Às vezes acerto, às vezes erro' },
          { id: 'q12_opt4', text: 'Me sinto segura, mas sei que posso evoluir' },
        ],
      },
      properties: {
        questionId: 'qs1_autoavaliacao',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        selectionStyle: 'glow',
        animationType: 'scale',
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        gridGap: 12,
        responsiveColumns: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 250,
      },
    },
  ],

  // 🎯 ETAPA 13: QUESTÃO ESTRATÉGICA 1 - AUTOAVALIAÇÃO
  'step-13': [
    {
      id: 'step13-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
        options: [
          { id: 'q13_opt1', text: 'Me sinto desconectada da mulher que sou hoje' },
          { id: 'q13_opt2', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
          { id: 'q13_opt3', text: 'Às vezes acerto, às vezes erro' },
          { id: 'q13_opt4', text: 'Me sinto segura, mas sei que posso evoluir' },
        ],
      },
      properties: {
        questionId: 'qs1_autoavaliacao',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 14: QUESTÃO ESTRATÉGICA 2 - DESAFIO PRINCIPAL
  'step-14': [
    {
      id: 'step14-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'O que mais te desafia na hora de se vestir?',
        options: [
          { id: 'q14_opt1', text: 'Tenho peças, mas não sei como combiná-las' },
          { id: 'q14_opt2', text: 'Compro por impulso e me arrependo depois' },
          { id: 'q14_opt3', text: 'Minha imagem não reflete quem eu sou' },
          { id: 'q14_opt4', text: 'Perco tempo e acabo usando sempre os mesmos looks' },
        ],
      },
      properties: {
        questionId: 'qs2_desafio',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 15: QUESTÃO ESTRATÉGICA 3 - FREQUÊNCIA DE INDECISÃO
  'step-15': [
    {
      id: 'step15-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Com que frequência você se pega pensando: “Com que roupa eu vou?” — mesmo com o guarda-roupa cheio?',
        options: [
          { id: 'q15_opt1', text: 'Quase todos os dias — é sempre uma indecisão' },
          { id: 'q15_opt2', text: 'Sempre que tenho um compromisso importante' },
          { id: 'q15_opt3', text: 'Às vezes, mas me sinto limitada nas escolhas' },
          { id: 'q15_opt4', text: 'Raramente — já me sinto segura ao me vestir' },
        ],
      },
      properties: {
        questionId: 'qs3_frequencia',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 16: QUESTÃO ESTRATÉGICA 4 - INVESTIMENTO
  'step-16': [
    {
      id: 'step16-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?',
        options: [
          { id: 'q16_opt1', text: 'Sim! Se existisse algo assim, eu quero' },
          { id: 'q16_opt2', text: 'Sim, mas teria que ser no momento certo' },
          { id: 'q16_opt3', text: 'Tenho dúvidas se funcionaria pra mim' },
          { id: 'q16_opt4', text: 'Não, prefiro continuar como estou' },
        ],
      },
      properties: {
        questionId: 'qs4_material',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 17: QUESTÃO ESTRATÉGICA 5 - PREÇO
  'step-17': [
    {
      id: 'step17-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
        options: [
          { id: 'q17_opt1', text: 'Sim! Por esse resultado, vale muito' },
          { id: 'q17_opt2', text: 'Sim, mas só se eu tiver certeza de que funciona pra mim' },
          { id: 'q17_opt3', text: 'Talvez — depende do que está incluso' },
          { id: 'q17_opt4', text: 'Não, ainda não estou pronta para investir' },
        ],
      },
      properties: {
        questionId: 'qs5_preco',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 18: QUESTÃO ESTRATÉGICA 6 - OBJETIVO PRINCIPAL
  'step-18': [
    {
      id: 'step18-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'Qual desses resultados você mais gostaria de alcançar?',
        options: [
          { id: 'q18_opt1', text: 'Montar looks com mais facilidade e confiança' },
          { id: 'q18_opt2', text: 'Usar o que já tenho e me sentir estilosa' },
          { id: 'q18_opt3', text: 'Comprar com mais consciência e sem culpa' },
          { id: 'q18_opt4', text: 'Ser admirada pela imagem que transmito' },
          { id: 'q18_opt5', text: 'Resgatar peças esquecidas e criar novos looks com estilo' },
        ],
      },
      properties: {
        questionId: 'qs6_objetivo',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1200,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: false,
      },
    },
  ],

  // 🎯 ETAPA 19: TRANSIÇÃO PARA RESULTADO
  'step-19': [
    {
      id: 'step19-wrapper',
      type: 'connected-template-wrapper',
      order: 0,
      content: {},
      properties: {
        wrapperConfig: {
          stepNumber: 19,
          stepType: 'result',
          sessionId: 'default-session',
          enableHooks: true,
          trackingEnabled: true,
          validationEnabled: false,
        },
        className: 'w-full',
        backgroundColor: 'transparent',
        // Children renderizados dentro do wrapper conectado
        children: [
          {
            id: 'step19-overlay',
            type: 'form-container',
            properties: {
              elementId: 'step19-overlay',
              className: 'fixed inset-0 bg-[#fffaf7] z-50 flex items-center justify-center p-4',
              children: [
                {
                  id: 'step19-card',
                  type: 'form-container',
                  properties: {
                    className: 'max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg space-y-6',
                    children: [
                      {
                        id: 'step19-title',
                        type: 'text-inline',
                        properties: {
                          content: 'Obrigada por compartilhar.',
                          fontSize: 'text-2xl md:text-3xl',
                          fontWeight: 'font-bold',
                          textAlign: 'center',
                          color: '#432818',
                        },
                      },
                      {
                        id: 'step19-p1',
                        type: 'text-inline',
                        properties: {
                          content:
                            'Chegar até aqui já mostra que você está pronta para se olhar com mais **amor**, se vestir com mais **intenção** e deixar sua imagem comunicar quem você é de verdade — com **leveza**, **presença** e **propósito**.',
                          fontSize: 'text-base md:text-lg',
                          textAlign: 'left',
                          color: '#3a3a3a',
                        },
                      },
                      {
                        id: 'step19-p2',
                        type: 'text-inline',
                        properties: {
                          content:
                            'Agora, é hora de revelar o seu **Estilo Predominante** — e os seus **Estilos Complementares**. E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com **leveza** e **confiança** — todos os dias.',
                          fontSize: 'text-base md:text-lg',
                          textAlign: 'left',
                          color: '#3a3a3a',
                        },
                      },
                      {
                        id: 'step19-p3',
                        type: 'text-inline',
                        properties: {
                          content:
                            'Ah, e lembra do valor que mencionamos? Prepare-se para uma **surpresa**: o que você vai receber vale muito mais do que imagina — e vai custar muito menos do que você esperava.',
                          fontSize: 'text-base md:text-lg',
                          textAlign: 'left',
                          color: '#3a3a3a',
                        },
                      },
                      {
                        id: 'step19-cta',
                        type: 'button-inline',
                        properties: {
                          text: 'Vamos ao resultado?',
                          variant: 'custom',
                          size: 'large',
                          action: 'next-step',
                          nextStepId: 'step-20',
                          backgroundColor: '#B89B7A',
                          textColor: '#FFFFFF',
                          borderColor: '#B89B7A',
                          className: 'max-w-sm mx-auto',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],

  // 🎯 ETAPA 20: RESULTADO PERSONALIZADO + OFERTA (Teste A)
  'step-20': [
    {
      id: 'step20-result-header',
      type: 'result-header-inline',
      order: 0,
      content: {
        title: '{userName}, seu estilo predominante é:',
        subtitle: 'Estilo {resultStyle}',
        description:
          'Com base nas suas respostas, identificamos que seu estilo predominante é o {resultStyle}.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/result_style_photo_kjsdlq.webp',
        styleGuideImageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/style_guide_examples_mdkeud.webp',
        showBothImages: true,
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 380,
        imageHeight: 380,
        borderRadius: 16,
        boxShadow: 'md',
        padding: 24,
        marginBottom: 24,
      },
    },
    // Urgência no topo (variante A)
    {
      id: 'step20-urgency-top',
      type: 'urgency-timer-inline',
      order: 1,
      content: {
        title: 'Oferta especial liberada por tempo limitado',
        urgencyMessage: 'Aproveite antes que acabe!',
      },
      properties: {
        initialMinutes: 15,
        backgroundColor: '#dc2626',
        textColor: '#ffffff',
        pulseColor: '#fbbf24',
        showAlert: true,
        spacing: 'md',
        marginTop: 8,
        marginBottom: 16,
      },
    },
    {
      id: 'step20-style-card',
      type: 'style-card-inline',
      order: 5,
      content: {
        title: 'Características do seu estilo',
        description: 'O estilo {resultStyle} se caracteriza por:',
        features: [
          'Personalidade: {resultPersonality}',
          'Cores: {resultColors}',
          'Tecidos: {resultFabrics}',
          'Estampas: {resultPrints}',
          'Acessórios: {resultAccessories}',
        ],
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'left',
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 24,
        showIcon: true,
        iconName: 'sparkles',
        iconColor: '#3B82F6',
      },
    },
    // 🤖 BLOCO DE IA - GERAÇÃO DE LOOKS PERSONALIZADOS
    {
      id: 'step20-ai-fashion-generator',
      type: 'fashion-ai-generator',
      order: 5.5,
      content: {
        title: '✨ Seus looks personalizados com IA',
        subtitle: 'Baseado no seu estilo {resultStyle}, nossa IA criou looks exclusivos para você',
        description: 'Veja como aplicar seu estilo na prática com sugestões personalizadas',
        loadingMessage: 'Gerando seus looks personalizados... 🎨',
        errorMessage: 'Ops! Não conseguimos gerar as imagens agora. Tente novamente em alguns minutos.',
      },
      properties: {
        // Configuração da IA
        styleType: '{resultStyle}', // Interpola o resultado calculado
        generateOnLoad: true,
        autoGenerate: true,

        // Provedores de IA (em ordem de prioridade)
        providers: ['dalle3', 'gemini', 'stable-diffusion'],
        fallbackProvider: 'gemini',

        // Configurações visuais
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,

        // Configurações de geração
        imageCount: 3,
        imageSize: 'large', // 512x512
        showColorPalette: true,
        showStyleTips: true,

        // Configurações de exibição
        layout: 'grid', // grid | carousel
        columns: 3,
        spacing: 16,
        showLoadingState: true,
        showErrorState: true,

        // Configurações avançadas
        cacheResults: true,
        retryAttempts: 2,
        timeout: 30000, // 30 segundos

        // Prompts personalizados por estilo
        stylePrompts: {
          natural: 'Casual comfortable outfit, earth tones, natural fabrics, relaxed fit, minimalist accessories',
          classico: 'Classic elegant outfit, timeless pieces, neutral colors, structured blazer, quality materials',
          contemporaneo: 'Modern contemporary outfit, current trends, practical pieces, clean lines, urban style',
          elegante: 'Sophisticated elegant outfit, luxury materials, refined details, impeccable fit, premium quality',
          romantico: 'Romantic feminine outfit, soft fabrics, delicate details, pastel colors, flowing silhouettes',
          sexy: 'Sensual confident outfit, body-conscious fit, bold colors, strategic cutouts, elegant sensuality',
          dramatico: 'Dramatic statement outfit, bold pieces, strong contrasts, geometric shapes, urban edge',
          criativo: 'Creative unique outfit, bold patterns, vibrant colors, unconventional combinations, artistic flair'
        },

        // Configurações de cores por estilo
        colorPalettes: {
          natural: ['#8B7355', '#A0956B', '#E6D7C3', '#F5F0E8'],
          classico: ['#2C3E50', '#34495E', '#BDC3C7', '#ECF0F1'],
          contemporaneo: ['#ffffffff', '#2ECC71', '#95A5A6', '#F8F9FA'],
          elegante: ['#1A1A1A', '#8B4513', '#D4AF37', '#FFFEF7'],
          romantico: ['#FF69B4', '#FFB6C1', '#E6E6FA', '#FFF0F5'],
          sexy: ['#DC143C', '#8B0000', '#000000', '#FFFFFF'],
          dramatico: ['#000000', '#FF0000', '#FFFFFF', '#C0C0C0'],
          criativo: ['#FF4500', '#32CD32', '#FF1493', '#FFD700']
        }
      },
    },
    {
      id: 'step20-secondary-styles',
      type: 'secondary-styles',
      order: 6,
      content: {
        title: 'Seus estilos complementares',
        subtitle: 'Você também apresenta elementos destes estilos:',
        secondaryStyles: [
          {
            name: '{secondaryStyle1}',
            percentage: '{secondaryPercentage1}%',
            description: '{secondaryDescription1}',
          },
          {
            name: '{secondaryStyle2}',
            percentage: '{secondaryPercentage2}%',
            description: '{secondaryDescription2}',
          },
        ],
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 24,
      },
    },
    // Antes e Depois (transformação)
    {
      id: 'step20-before-after',
      type: 'before-after-inline',
      order: 7,
      content: {
        title: 'Sua transformação é possível',
        subtitle: 'Veja o impacto de aplicar seu estilo no dia a dia',
        beforeLabel: 'ANTES',
        afterLabel: 'DEPOIS',
      },
      properties: {
        layoutStyle: 'side-by-side',
        showComparison: true,
        marginTop: 12,
        marginBottom: 20,
      },
    },
    // Bônus (lista/grids)
    {
      id: 'step20-bonuses',
      type: 'bonus',
      order: 8,
      content: {
        title: 'Bônus de transformação inclusos',
      },
      properties: {
        showImages: true,
        marginTop: 8,
        marginBottom: 16,
      },
    },
    // Depoimentos (prova social)
    {
      id: 'step20-testimonials',
      type: 'testimonials',
      order: 6,
      content: {
        title: 'Resultados reais de alunas',
      },
      properties: {
        layout: 'grid',
        showQuotes: true,
        backgroundColor: '#F0F9FF',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      },
    },
    // Ancoragem de valor (comparativo de valores)
    {
      id: 'step20-value-anchoring',
      type: 'value-anchoring',
      order: 7,
      content: {
        title: 'Tudo o que você recebe hoje',
      },
      properties: {
        showPricing: true,
        marginTop: 8,
        marginBottom: 16,
      },
    },
    // Compra segura
    {
      id: 'step20-secure-purchase',
      type: 'secure-purchase',
      order: 8,
      content: {
        title: 'Compra 100% segura e protegida',
      },
      properties: {
        showFeatures: true,
        marginTop: 8,
        marginBottom: 16,
      },
    },
    // Garantia
    {
      id: 'step20-guarantee',
      type: 'guarantee',
      order: 9,
      content: {
        title: 'Garantia incondicional de 7 dias',
        description:
          'Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu dinheiro.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/guarantee_seal_klsjda.webp',
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        imageWidth: 150,
        imageHeight: 150,
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 24,
        borderColor: '#3B82F6',
        borderWidth: '2px',
        borderStyle: 'dashed',
      },
    },
    // Mentora
    {
      id: 'step20-mentor',
      type: 'mentor-section-inline',
      order: 10,
      content: {
        mentorName: 'Gisele Galvão',
        mentorTitle: 'Consultora de Imagem e Estilo',
      },
      properties: {
        marginTop: 8,
        marginBottom: 16,
      },
    },
    {
      id: 'step20-cta',
      type: 'button-inline',
      order: 11,
      content: {},
      properties: {
        text: 'Quero saber mais sobre meu estilo',
        action: 'next-step',
        nextStepId: 'step-21',
        // Estilo do botão
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderColor: '#3B82F6',
        borderRadius: 8,
        fontSize: '18',
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 16,
        // Efeitos visuais
        shadowType: 'medium',
        effectType: 'none',
        hoverOpacity: 92,
      },
    },
    // Contador adicional (variante B) próximo ao CTA
    {
      id: 'step20-urgency-bottom',
      type: 'urgency-timer-inline',
      order: 12,
      content: {
        title: 'Essa condição especial termina em:',
        urgencyMessage: 'Garanta agora enquanto está disponível.',
      },
      properties: {
        initialMinutes: 12,
        backgroundColor: '#7c2d12',
        textColor: '#ffffff',
        pulseColor: '#f59e0b',
        showAlert: true,
        spacing: 'sm',
        marginTop: 8,
        marginBottom: 8,
      },
    },
  ],

  // 🎯 ETAPA 21: PÁGINA DE OFERTA (Teste B)
  'step-21': [
    {
      id: 'step21-offer-header',
      type: 'quiz-offer-cta-inline',
      order: 0,
      content: {
        title: 'Libere todo o potencial do seu estilo pessoal',
        subtitle:
          'Descubra como montar looks que realçam sua beleza natural e expressam sua personalidade!',
        description:
          'Parabéns por descobrir seu estilo predominante! Este é só o primeiro passo. Que tal aprofundar esse conhecimento e transformar seu guarda-roupa?',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/offer_image_main_jkldsd.webp',
        buttonText: 'Quero transformar meu estilo agora',
        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial',
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 500,
        imageHeight: 300,
        buttonColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        borderRadius: 16,
        boxShadow: 'lg',
        padding: 32,
        marginBottom: 32,
        highlightColor: '#F59E0B',
        showPrice: true,
        regularPrice: 'R$ 197,00',
        salePrice: 'R$ 97,00',
        showTimer: true,
        timerDuration: 900,
        timerLabel: 'Esta oferta expira em:',
      },
    },
    {
      id: 'step21-benefits',
      type: 'benefits',
      order: 1,
      content: {
        title: 'O que você vai receber',
        benefits: [
          {
            id: 'benefit1',
            title: 'E-book Completo de Estilo Pessoal',
            description:
              'Guia detalhado com todas as características do seu estilo e como aplicá-las no dia a dia.',
            icon: 'book',
          },
          {
            id: 'benefit2',
            title: 'Paleta de Cores Personalizada',
            description:
              'Descubra exatamente quais cores valorizam seu tom de pele, cabelo e olhos.',
            icon: 'palette',
          },
          {
            id: 'benefit3',
            title: 'Guia de Compras Inteligentes',
            description: 'Aprenda a investir nas peças certas e economizar dinheiro.',
            icon: 'shopping-bag',
          },
          {
            id: 'benefit4',
            title: 'Acesso ao Grupo VIP',
            description: 'Participe da nossa comunidade exclusiva com dicas semanais e suporte.',
            icon: 'users',
          },
        ],
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'left',
        showIcons: true,
        iconColor: '#3B82F6',
        layout: 'cards',
        borderRadius: 12,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
      },
    },
    {
      id: 'step21-testimonials',
      type: 'testimonials',
      order: 2,
      content: {
        title: 'O que dizem nossas clientes',
        testimonials: [
          {
            id: 'testimonial1',
            quote:
              'Finalmente entendi meu estilo e parei de gastar dinheiro com roupas que não combinavam comigo.',
            author: 'Márcia Silva',
            authorTitle: '38 anos, Advogada',
            rating: 5,
          },
          {
            id: 'testimonial2',
            quote:
              'Economizei muito dinheiro depois que aprendi a comprar apenas o que realmente combina com meu estilo.',
            author: 'Carolina Mendes',
            authorTitle: '42 anos, Empresária',
            rating: 5,
          },
          {
            id: 'testimonial3',
            quote:
              'Hoje me visto com mais confiança e praticidade, sem perder tempo pensando no que vestir.',
            author: 'Juliana Costa',
            authorTitle: '35 anos, Professora',
            rating: 5,
          },
        ],
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        layout: 'card',
        showQuotes: true,
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
      },
    },
    {
      id: 'step21-guarantee',
      type: 'guarantee',
      order: 3,
      content: {
        title: 'Garantia incondicional de 7 dias',
        description:
          'Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu dinheiro.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/guarantee_seal_klsjda.webp',
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        imageWidth: 150,
        imageHeight: 150,
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
        borderColor: '#3B82F6',
        borderWidth: '2px',
        borderStyle: 'dashed',
      },
    },
    {
      id: 'step21-final-cta',
      type: 'button',
      order: 4,
      content: {
        buttonText: 'Quero transformar meu estilo agora',
        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial',
      },
      properties: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: 8,
        width: '100%',
        padding: '16px 24px',
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 32,
        showShadow: true,
      },
    },
    {
      id: 'step21-footer',
      type: 'text',
      order: 5,
      content: {
        text: '© 2025 Gisele Galvão - Todos os direitos reservados',
      },
      properties: {
        fontSize: '12px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 32,
      },
    },
  ],
};

// Lista completa das questões do quiz

export const QUIZ_QUESTIONS_COMPLETE: Record<number, string> = {
  1: 'Coleta do nome',
  2: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
  3: 'RESUMA A SUA PERSONALIDADE:',
  4: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
  5: 'QUAIS DETALHES VOCÊ GOSTA?',
  6: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
  7: 'QUAL CASACO É SEU FAVORITO?',
  8: 'QUAL SUA CALÇA FAVORITA?',
  9: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
  10: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
  11: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
  12: 'Página de transição para questões estratégicas',
  13: 'Como você se vê hoje?',
  14: 'O que mais te desafia na hora de se vestir?',
  15: 'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
  16: 'Pense no quanto você já gastou com roupas que não usa...',
  17: 'Se esse conteúdo completo custasse R$ 97,00...',
  18: 'Qual desses resultados você mais gostaria de alcançar?',
  19: 'Página de transição para resultado',
  20: 'Página de resultado personalizada',
  21: 'Página de oferta direta',
};

// 🎯 FORMATO PARA REGISTRY - ADAPTADOR  
export const quiz21StepsCompleteTemplate = {
  config: {
    globalConfig: {
      theme: {
        primaryColor: "#0066CC",
        secondaryColor: "#FF6B35",
        accentColor: "#4ECDC4"
      },
      navigation: {
        allowBack: true,
        showProgress: true
      },
      analytics: {
        enabled: true,
        trackingId: "quiz21-analytics"
      }
    },
    seo: {
      title: "Descubra Seu Estilo Pessoal - Quiz Completo",
      description: "Quiz completo para descobrir seu estilo pessoal único com 21 etapas otimizadas",
      keywords: ["quiz", "estilo pessoal", "moda", "personalização"]
    },
    tracking: {
      googleAnalytics: "GA_MEASUREMENT_ID",
      facebookPixel: "FB_PIXEL_ID",
      customEvents: {
        "quiz_start": "Quiz iniciado",
        "quiz_complete": "Quiz finalizado"
      }
    }
  },
  steps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).map((stepKey, index) => {
    const stepBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

    // Determinar o tipo do step baseado no conteúdo
    let stepType: 'intro' | 'question' | 'transition' | 'result' | 'offer' = 'question';
    if (index === 0) stepType = 'intro';
    else if (stepKey.includes('transition') || stepKey.includes('Transition')) stepType = 'transition';
    else if (stepKey.includes('result') || stepKey.includes('Result')) stepType = 'result';
    else if (stepKey.includes('offer') || stepKey.includes('Offer')) stepType = 'offer';

    // Extrair título do primeiro bloco se disponível
    let title = `Etapa ${index + 1}`;
    if (stepBlocks && stepBlocks.length > 0) {
      const firstBlock = stepBlocks[0];
      if (firstBlock.content?.title) {
        title = firstBlock.content.title;
      } else if (firstBlock.content?.question) {
        title = firstBlock.content.question;
      }
    }

    return {
      stepNumber: index + 1,
      type: stepType,
      title: title,
      subtitle: stepType === 'question' ? 'Selecione suas preferências' : undefined,
      blocks: stepBlocks || [],
      validation: stepType === 'question' ? {
        required: true,
        minSelections: stepKey.includes('strategic') ? 1 : 3,
        maxSelections: stepKey.includes('strategic') ? 1 : 3
      } : undefined,
      navigation: {
        nextButton: stepType === 'offer' ? 'Finalizar' : 'Continuar',
        autoAdvance: false,
        autoAdvanceDelay: 0
      }
    };
  })
};

// 🎯 DEFAULT EXPORT PARA REGISTRY COMPATIBILITY
export default quiz21StepsCompleteTemplate;
