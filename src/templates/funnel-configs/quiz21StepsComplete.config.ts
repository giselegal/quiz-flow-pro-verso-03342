/**
 * 🎯 CONFIGURAÇÕES ESPECÍFICAS DO FUNIL: Quiz de Estilo 21 Etapas
 * 
 * Este arquivo contém APENAS configurações específicas deste funil.
 * Configurações globais do app estão em src/config/AppConfig.ts
 * 
 * ✅ Inclua aqui: configurações que são únicas para este funil
 * ❌ NÃO inclua: configurações que se aplicam a todo o app
 */

import type { AppConfig } from '@/config/AppConfig';

// ============================================================================
// TIPOS PARA CONFIGURAÇÃO DE FUNIL
// ============================================================================

export interface FunnelSEOOverrides {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}

export interface FunnelThemeConfig {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundGradient?: string;
    fontFamily?: string;
    customCSS?: string;
}

export interface FunnelTrackingConfig {
    facebookPixel?: string;
    googleAnalytics?: string;
    hotjar?: string;
    customEvents?: Record<string, any>;
}

export interface FunnelUTMConfig {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
}

export interface FunnelWebhooksConfig {
    leadCapture?: string;
    formSubmission?: string;
    quizComplete?: string;
    purchaseComplete?: string;
    enabled: boolean;
}

export interface FunnelConfig {
    // Metadados do funil
    funnel: {
        id: string;
        name: string;
        description: string;
        category: string;
        version: string;
        author: string;
        createdAt: string;
        updatedAt: string;
    };

    // Sobrescritas de SEO específicas do funil
    seo?: FunnelSEOOverrides;

    // Configurações de tema específicas
    theme?: FunnelThemeConfig;

    // Tracking específico do funil
    tracking?: FunnelTrackingConfig;

    // UTMs específicas desta campanha
    utm: FunnelUTMConfig;

    // Webhooks específicos do funil
    webhooks?: FunnelWebhooksConfig;

    // Configurações de comportamento
    behavior: {
        autoAdvance: boolean;
        autoAdvanceDelay: number;
        showProgress: boolean;
        allowBackward: boolean;
        saveProgress: boolean;
        requiredFieldsValidation: boolean;
    };

    // Configurações de resultado
    results: {
        enableEmailCapture: boolean;
        enableSocialSharing: boolean;
        enablePDFDownload: boolean;
        enableResultEmail: boolean;
        customResultUrl?: string;
    };
}

// ============================================================================
// CONFIGURAÇÃO DO FUNIL: QUIZ DE ESTILO 21 ETAPAS
// ============================================================================

export const QUIZ21_STEPS_CONFIG: FunnelConfig = {
    // Metadados do funil
    funnel: {
        id: 'quiz21StepsComplete',
        name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
        description: 'Quiz completo para descoberta de estilo pessoal com 21 etapas otimizadas',
        category: 'style-assessment',
        version: '2.1.0',
        author: 'Gisele Galvão',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-09-10T00:00:00.000Z'
    },

    // SEO específico deste funil (sobrescreve global quando necessário)
    seo: {
        title: 'Descubra Seu Estilo Pessoal - Quiz Completo | Gisele Galvão',
        description: 'Descubra seu estilo predominante através do nosso quiz personalizado de 21 etapas e transforme seu guarda-roupa com confiança.',
        keywords: [
            'estilo pessoal',
            'consultoria de estilo',
            'moda feminina',
            'quiz de estilo',
            'gisele galvão',
            'personal stylist',
            'guarda-roupa',
            'autoestima',
            'consultoria de imagem'
        ],
        ogTitle: 'Quiz de Estilo Pessoal - Descubra seu estilo em 5 minutos',
        ogDescription: 'Faça o quiz da consultora Gisele Galvão e descubra seu estilo predominante. Resultado imediato + dicas personalizadas!',
        ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/quiz-estilo-og-image.jpg'
    },

    // Tema visual específico do funil
    theme: {
        primaryColor: '#B89B7A',
        secondaryColor: '#8F7A6A',
        accentColor: '#D4C4B0',
        backgroundGradient: 'linear-gradient(135deg, #F6F3EF 0%, #FFFFFF 100%)',
        fontFamily: 'Playfair Display, serif',
        customCSS: `
      .quiz-container {
        background: linear-gradient(135deg, #F6F3EF 0%, #FFFFFF 100%);
        min-height: 100vh;
      }
      .question-card {
        box-shadow: 0 8px 32px rgba(184, 155, 122, 0.1);
        border-radius: 20px;
      }
      .option-button:hover {
        background-color: #F3E8E6;
        border-color: #B89B7A;
      }
    `
    },

    // Tracking específico do funil
    tracking: {
        facebookPixel: 'FB_PIXEL_QUIZ_STYLE_SPECIFIC',
        hotjar: 'HOTJAR_QUIZ_STYLE_ID',
        customEvents: {
            quiz_started: 'quiz_style_started',
            quiz_completed: 'quiz_style_completed',
            result_viewed: 'style_result_viewed',
            email_captured: 'style_email_captured',
            pdf_downloaded: 'style_pdf_downloaded'
        }
    },

    // UTMs específicas desta campanha
    utm: {
        source: 'gisele_galvao_organic',
        medium: 'quiz',
        campaign: 'quiz_estilo_pessoal_2025',
        term: 'descobrir_estilo',
        content: 'quiz_21_etapas'
    },

    // Webhooks específicos do funil
    webhooks: {
        leadCapture: 'https://hooks.zapier.com/hooks/catch/123456/quiz-style-lead/',
        quizComplete: 'https://hooks.zapier.com/hooks/catch/123456/quiz-style-complete/',
        enabled: false // Desabilitado por padrão
    },

    // Configurações de comportamento
    behavior: {
        autoAdvance: false,
        autoAdvanceDelay: 3000,
        showProgress: true,
        allowBackward: true,
        saveProgress: true,
        requiredFieldsValidation: true
    },

    // Configurações de resultado
    results: {
        enableEmailCapture: true,
        enableSocialSharing: true,
        enablePDFDownload: true,
        enableResultEmail: true,
        customResultUrl: undefined // Usa padrão do sistema
    }
};

// ============================================================================
// HELPERS PARA MERGE COM CONFIGURAÇÕES GLOBAIS
// ============================================================================

/**
 * Mescla configuração do funil com configuração global do app
 */
export function mergeFunnelWithAppConfig(
    funnelConfig: FunnelConfig,
    appConfig: AppConfig
): AppConfig & { funnel: FunnelConfig['funnel'] } {
    return {
        // Configurações globais do app como base
        seo: {
            ...appConfig.seo,
            // Sobrescrever com configurações específicas do funil
            ...(funnelConfig.seo && {
                defaultTitle: funnelConfig.seo.title || appConfig.seo.defaultTitle,
                defaultDescription: funnelConfig.seo.description || appConfig.seo.defaultDescription,
                defaultKeywords: funnelConfig.seo.keywords || appConfig.seo.defaultKeywords,
                defaultOgImage: funnelConfig.seo.ogImage || appConfig.seo.defaultOgImage
            })
        },

        // Configurações de domínio permanecem globais
        domain: appConfig.domain,

        // Analytics global + específico do funil
        analytics: {
            ...appConfig.analytics,
            ...(funnelConfig.tracking && {
                // Adicionar tracking específico se fornecido
                facebookPixel: funnelConfig.tracking.facebookPixel || appConfig.analytics.googleAnalytics.measurementId
            })
        },

        // Branding global + tema do funil
        branding: {
            ...appConfig.branding,
            ...(funnelConfig.theme && {
                primaryColor: funnelConfig.theme.primaryColor || appConfig.branding.primaryColor,
                secondaryColor: funnelConfig.theme.secondaryColor || appConfig.branding.secondaryColor,
                accentColor: funnelConfig.theme.accentColor || appConfig.branding.accentColor,
                fontFamily: {
                    ...appConfig.branding.fontFamily,
                    primary: funnelConfig.theme.fontFamily || appConfig.branding.fontFamily.primary
                }
            })
        },

        // Configurações legais permanecem globais
        legal: appConfig.legal,

        // Configurações de ambiente permanecem globais
        environment: appConfig.environment,

        // Adicionar dados específicos do funil
        funnel: funnelConfig.funnel
    };
}

/**
 * Gera UTMs completas para o funil
 */
export function generateFunnelUTMs(funnelConfig: FunnelConfig): Record<string, string> {
    const utm = funnelConfig.utm;
    return {
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        ...(utm.term && { utm_term: utm.term }),
        ...(utm.content && { utm_content: utm.content })
    };
}

/**
 * Gera configuração de tracking para o funil
 */
export function generateFunnelTracking(funnelConfig: FunnelConfig) {
    const tracking = funnelConfig.tracking;
    if (!tracking) return {};

    return {
        events: tracking.customEvents || {},
        pixels: {
            ...(tracking.facebookPixel && { facebook: tracking.facebookPixel }),
            ...(tracking.googleAnalytics && { google: tracking.googleAnalytics })
        },
        ...(tracking.hotjar && { hotjar: tracking.hotjar })
    };
}

// Export da configuração principal
export default QUIZ21_STEPS_CONFIG;
