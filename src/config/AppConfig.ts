/**
 * 🌐 CONFIGURAÇÕES GLOBAIS DO APLICATIVO
 * 
 * Este arquivo contém APENAS configurações que se aplicam a TODO o aplicativo,
 * independente de qual funil está ativo.
 * 
 * ❌ NÃO inclua aqui: configurações específicas de funis
 * ✅ Inclua aqui: configurações que afetam todo o site/app
 */

// ============================================================================
// CONFIGURAÇÕES DE SEO GLOBAIS
// ============================================================================

export interface GlobalSEOConfig {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string[];
    defaultOgImage: string;
    defaultFavicon: string;
    charset: string;
    language: string;
    viewport: string;
}

export const GLOBAL_SEO_CONFIG: GlobalSEOConfig = {
    siteName: 'Quiz Sell Genius',
    defaultTitle: 'Quiz Sell Genius - Transforme Seu Negócio com Quizzes',
    defaultDescription: 'Plataforma completa para criação e gerenciamento de quizzes interativos que convertem visitantes em clientes.',
    defaultKeywords: ['quiz', 'marketing', 'conversão', 'leads', 'negócio'],
    defaultOgImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    defaultFavicon: '/favicon.ico',
    charset: 'UTF-8',
    language: 'pt-BR',
    viewport: 'width=device-width, initial-scale=1.0'
};

// ============================================================================
// CONFIGURAÇÕES DE DOMÍNIO E HOSTING
// ============================================================================

export interface DomainConfig {
    primaryDomain: string;
    alternativeDomains: string[];
    ssl: boolean;
    enforceHTTPS: boolean;
    www: boolean;
    subdomainHandling: 'redirect' | 'allow' | 'ignore';
}

export const DOMAIN_CONFIG: DomainConfig = {
    primaryDomain: 'quiz-sell-genius.com',
    alternativeDomains: ['quizsellgenius.com', 'quiz-genius.com'],
    ssl: true,
    enforceHTTPS: true,
    www: false, // preferir sem www
    subdomainHandling: 'allow'
};

// ============================================================================
// CONFIGURAÇÕES DE ANALYTICS GLOBAIS
// ============================================================================

export interface GlobalAnalyticsConfig {
    googleAnalytics: {
        measurementId: string;
        enabled: boolean;
        trackPageViews: boolean;
        trackEvents: boolean;
    };
    googleTagManager: {
        containerId: string;
        enabled: boolean;
    };
    enableCookieConsent: boolean;
    privacyMode: boolean;
}

export const GLOBAL_ANALYTICS_CONFIG: GlobalAnalyticsConfig = {
    googleAnalytics: {
        measurementId: 'GA-GLOBAL-MEASUREMENT-ID',
        enabled: true,
        trackPageViews: true,
        trackEvents: true
    },
    googleTagManager: {
        containerId: 'GTM-GLOBAL-CONTAINER',
        enabled: true
    },
    enableCookieConsent: true,
    privacyMode: true
};

// ============================================================================
// CONFIGURAÇÕES DE BRANDING GLOBAIS
// ============================================================================

export interface GlobalBrandingConfig {
    companyName: string;
    logoUrl: string;
    logoAlt: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: {
        primary: string;
        secondary: string;
        mono: string;
    };
    favicon: string;
    appleTouchIcon: string;
}

export const GLOBAL_BRANDING_CONFIG: GlobalBrandingConfig = {
    companyName: 'Quiz Sell Genius',
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: 'Quiz Sell Genius - Logo',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    accentColor: '#28a745',
    fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Playfair Display, serif',
        mono: 'Fira Code, monospace'
    },
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png'
};

// ============================================================================
// CONFIGURAÇÕES LEGAIS E COMPLIANCE
// ============================================================================

export interface LegalConfig {
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    companyPhone: string;
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
    cookiePolicyUrl: string;
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    showCookieBanner: boolean;
}

export const LEGAL_CONFIG: LegalConfig = {
    companyName: 'Quiz Sell Genius Ltda',
    companyAddress: 'São Paulo, SP, Brasil',
    companyEmail: 'contato@quiz-sell-genius.com',
    companyPhone: '+55 11 99999-9999',
    privacyPolicyUrl: '/privacy-policy',
    termsOfServiceUrl: '/terms-of-service',
    cookiePolicyUrl: '/cookie-policy',
    gdprCompliant: true,
    ccpaCompliant: true,
    showCookieBanner: true
};

// ============================================================================
// CONFIGURAÇÕES DE AMBIENTE
// ============================================================================

export interface EnvironmentConfig {
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
    apiUrl: string;
    cdnUrl: string;
    enableDevTools: boolean;
    enablePerformanceMonitoring: boolean;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    return {
        environment: isDev ? 'development' : isProd ? 'production' : 'staging',
        debug: isDev,
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        cdnUrl: import.meta.env.VITE_CDN_URL || '',
        enableDevTools: isDev,
        enablePerformanceMonitoring: !isDev
    };
};

// ============================================================================
// CONFIGURAÇÃO PRINCIPAL DO APP
// ============================================================================

export interface AppConfig {
    seo: GlobalSEOConfig;
    domain: DomainConfig;
    analytics: GlobalAnalyticsConfig;
    branding: GlobalBrandingConfig;
    legal: LegalConfig;
    environment: EnvironmentConfig;
}

/**
 * 🌐 CONFIGURAÇÃO GLOBAL DO APLICATIVO
 * 
 * Esta é a configuração master que se aplica a todo o aplicativo.
 * Funis individuais podem herdar e sobrescrever configurações específicas.
 */
export const APP_CONFIG: AppConfig = {
    seo: GLOBAL_SEO_CONFIG,
    domain: DOMAIN_CONFIG,
    analytics: GLOBAL_ANALYTICS_CONFIG,
    branding: GLOBAL_BRANDING_CONFIG,
    legal: LEGAL_CONFIG,
    environment: getEnvironmentConfig()
};

// ============================================================================
// HELPERS E UTILITIES
// ============================================================================

/**
 * Obtém configuração global por seção
 */
export function getGlobalConfig<T extends keyof AppConfig>(section: T): AppConfig[T] {
    return APP_CONFIG[section];
}

/**
 * Verifica se está em ambiente de desenvolvimento
 */
export function isDevelopment(): boolean {
    return APP_CONFIG.environment.environment === 'development';
}

/**
 * Verifica se está em ambiente de produção
 */
export function isProduction(): boolean {
    return APP_CONFIG.environment.environment === 'production';
}

/**
 * Obtém URL completa com domínio
 */
export function getFullUrl(path: string = ''): string {
    const protocol = APP_CONFIG.domain.ssl ? 'https' : 'http';
    const domain = APP_CONFIG.domain.primaryDomain;
    return `${protocol}://${domain}${path}`;
}

/**
 * Gera meta tags básicas
 */
export function generateBasicMetaTags() {
    const seo = APP_CONFIG.seo;
    return {
        charset: seo.charset,
        viewport: seo.viewport,
        title: seo.defaultTitle,
        description: seo.defaultDescription,
        keywords: seo.defaultKeywords.join(', '),
        'og:title': seo.defaultTitle,
        'og:description': seo.defaultDescription,
        'og:image': seo.defaultOgImage,
        'og:url': getFullUrl(),
        'og:type': 'website',
        'og:site_name': seo.siteName
    };
}

// Export default para conveniência
export default APP_CONFIG;
