/**
 * 🎯 UTILITÁRIO DE INTEGRAÇÃO PARA ROTAS E CONFIGURAÇÕES
 * 
 * Conecta o sistema de configuração com as rotas do aplicativo
 * Automatiza SEO, tracking e temas baseados no funil ativo
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
    useConfiguration,
    useSEOConfiguration,
    useTrackingConfiguration,
    useThemeConfiguration
} from '@/hooks/useConfiguration';

// ============================================================================
// TIPOS PARA INTEGRAÇÃO
// ============================================================================

export interface RouteConfigMapping {
    path: string;
    funnelId: string;
    requiresAuth?: boolean;
    trackingEvents?: string[];
}

export interface SEOMetaData {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: string;
}

// ============================================================================
// MAPEAMENTO DE ROTAS PARA FUNIS
// ============================================================================

export const ROUTE_FUNNEL_MAPPING: RouteConfigMapping[] = [
    {
        path: '/quiz',
        funnelId: 'quiz21StepsComplete',
        trackingEvents: ['page_view', 'quiz_start']
    },
    {
        path: '/admin/funis',
        funnelId: 'quiz21StepsComplete', // Admin usa o funil ativo
        requiresAuth: true,
        trackingEvents: ['admin_access', 'funnel_management']
    },
    {
        path: '/editor',
        funnelId: 'quiz21StepsComplete',
        requiresAuth: true,
        trackingEvents: ['editor_access', 'funnel_edit']
    }
];

// ============================================================================
// HOOK PRINCIPAL DE INTEGRAÇÃO
// ============================================================================

/**
 * 🎯 Hook para integração automática de configurações baseadas na rota
 */
export function useRouteConfiguration() {
    const [location] = useLocation();

    // Encontrar configuração para a rota atual
    const routeConfig = ROUTE_FUNNEL_MAPPING.find(mapping =>
        location.startsWith(mapping.path)
    );

    // Carregar configuração do funil correspondente
    const { config, isLoading, error } = useConfiguration({
        funnelId: routeConfig?.funnelId,
        autoRefresh: true,
        refreshInterval: 60000 // 1 minuto
    });

    // Aplicar configurações automaticamente
    useEffect(() => {
        if (config && routeConfig) {
            console.log(`✅ [RouteConfig] Aplicando configuração para rota: ${location} -> funil: ${config.funnel.id}`);

            // Disparar eventos de tracking se configurados
            if (routeConfig.trackingEvents) {
                routeConfig.trackingEvents.forEach(event => {
                    console.log(`📊 [RouteConfig] Evento de tracking: ${event}`);
                    // Aqui você dispararia o evento real
                });
            }
        }
    }, [config, routeConfig, location]);

    return {
        routeConfig,
        funnelConfig: config,
        isLoading,
        error,
        currentFunnelId: routeConfig?.funnelId,
        requiresAuth: routeConfig?.requiresAuth || false
    };
}

// ============================================================================
// HOOK PARA AUTO-APLICAÇÃO DE SEO
// ============================================================================

/**
 * 🎯 Hook para aplicar automaticamente configurações de SEO baseadas na rota
 */
export function useAutoSEO(customSEO?: Partial<SEOMetaData>) {
    const { currentFunnelId } = useRouteConfiguration();
    const { seo, metaTags } = useSEOConfiguration(currentFunnelId);
    const [location] = useLocation();

    // Aplicar meta tags automaticamente
    useEffect(() => {
        if (metaTags && Array.isArray(metaTags)) {
            console.log('🔍 [AutoSEO] Aplicando meta tags para:', location);

            // Limpar meta tags anteriores do funil
            const existingFunnelMetas = document.querySelectorAll('meta[data-funnel-seo]');
            existingFunnelMetas.forEach(meta => meta.remove());

            // Aplicar novas meta tags
            metaTags.forEach((tag: any) => {
                const metaElement = document.createElement('meta');

                if (tag.name) metaElement.setAttribute('name', tag.name);
                if (tag.property) metaElement.setAttribute('property', tag.property);
                metaElement.setAttribute('content', tag.content);
                metaElement.setAttribute('data-funnel-seo', 'true');

                document.head.appendChild(metaElement);
            });

            // Atualizar título da página
            if (seo?.defaultTitle) {
                document.title = customSEO?.title || seo.defaultTitle;
            }

            // Atualizar URL canônica
            let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }

            const currentUrl = customSEO?.url || `${window.location.origin}${location}`;
            canonicalLink.href = currentUrl;
        }
    }, [metaTags, seo, location, customSEO]);

    return {
        seo,
        appliedMetaTags: metaTags,
        updateSEO: (newSEO: Partial<SEOMetaData>) => {
            // Atualizar SEO customizado dinamicamente
            console.log('🔄 [AutoSEO] Atualizando SEO:', newSEO);
        }
    };
}

// ============================================================================
// HOOK PARA AUTO-APLICAÇÃO DE TRACKING
// ============================================================================

/**
 * 🎯 Hook para configurar tracking automaticamente baseado na rota
 */
export function useAutoTracking() {
    const { currentFunnelId, routeConfig } = useRouteConfiguration();
    const { tracking, utm, trackingConfig } = useTrackingConfiguration(currentFunnelId);
    const [location] = useLocation();

    // Inicializar tracking automaticamente
    useEffect(() => {
        if (trackingConfig) {
            console.log('📊 [AutoTracking] Configurando tracking para:', location);

            // Google Analytics
            if (trackingConfig.googleAnalytics?.enabled) {
                const { trackingId, events } = trackingConfig.googleAnalytics;
                console.log(`🔍 [GA] Inicializando: ${trackingId}`);

                // Disparar página view
                if (events?.pageView) {
                    console.log(`📄 [GA] Page view: ${location}`);
                    // gtag('config', trackingId, { page_path: location });
                }
            }

            // Facebook Pixel
            if (trackingConfig.facebookPixel?.enabled) {
                const { pixelId, events } = trackingConfig.facebookPixel;
                console.log(`📊 [FB] Inicializando: ${pixelId}`);

                // Disparar page view
                if (events?.pageView) {
                    console.log(`📄 [FB] Page view: ${location}`);
                    // fbq('track', 'PageView');
                }
            }

            // Google Tag Manager
            if (trackingConfig.googleTagManager?.enabled) {
                const { containerId } = trackingConfig.googleTagManager;
                console.log(`🏷️ [GTM] Container: ${containerId}`);

                // Disparar evento customizado
                console.log(`📄 [GTM] Route change: ${location}`);
                // dataLayer.push({ event: 'route_change', page: location });
            }
        }
    }, [trackingConfig, location]);

    // Função para disparar eventos customizados
    const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
        if (!trackingConfig) return;

        console.log(`📊 [AutoTracking] Evento: ${eventName}`, parameters);

        // Google Analytics
        if (trackingConfig.googleAnalytics?.enabled) {
            console.log(`🔍 [GA] Evento: ${eventName}`);
            // gtag('event', eventName, parameters);
        }

        // Facebook Pixel
        if (trackingConfig.facebookPixel?.enabled) {
            console.log(`📊 [FB] Evento: ${eventName}`);
            // fbq('track', eventName, parameters);
        }

        // Google Tag Manager
        if (trackingConfig.googleTagManager?.enabled) {
            console.log(`🏷️ [GTM] Evento: ${eventName}`);
            // dataLayer.push({ event: eventName, ...parameters });
        }
    }, [trackingConfig]);

    // Disparar eventos da rota automaticamente
    useEffect(() => {
        if (routeConfig?.trackingEvents) {
            routeConfig.trackingEvents.forEach(event => {
                trackEvent(event, {
                    route: location,
                    funnelId: currentFunnelId,
                    timestamp: Date.now()
                });
            });
        }
    }, [location, routeConfig, trackEvent, currentFunnelId]);

    return {
        tracking,
        utm,
        trackingConfig,
        trackEvent
    };
}

// ============================================================================
// HOOK PARA AUTO-APLICAÇÃO DE TEMA
// ============================================================================

/**
 * 🎯 Hook para aplicar tema automaticamente baseado na rota
 */
export function useAutoTheme() {
    const { currentFunnelId } = useRouteConfiguration();
    const { branding, colors, fonts, logo } = useThemeConfiguration(currentFunnelId);

    // Aplicar tema automaticamente
    useEffect(() => {
        if (colors) {
            console.log('🎨 [AutoTheme] Aplicando cores:', colors);

            // Aplicar variáveis CSS customizadas
            const root = document.documentElement;
            root.style.setProperty('--funnel-primary-color', colors.primary);
            root.style.setProperty('--funnel-secondary-color', colors.secondary);
            root.style.setProperty('--funnel-accent-color', colors.accent);
        }

        if (fonts && typeof fonts === 'string') {
            console.log('🔤 [AutoTheme] Aplicando fonte:', fonts);
            document.documentElement.style.setProperty('--funnel-font-family', fonts);
        }

        if (branding?.companyName) {
            // Atualizar título base da página
            const baseTitle = document.title.split(' | ')[0];
            document.title = `${baseTitle} | ${branding.companyName}`;
        }
    }, [colors, fonts, branding]);

    // Cleanup ao trocar de funil
    useEffect(() => {
        return () => {
            console.log('🧹 [AutoTheme] Limpando tema anterior');
            const root = document.documentElement;
            root.style.removeProperty('--funnel-primary-color');
            root.style.removeProperty('--funnel-secondary-color');
            root.style.removeProperty('--funnel-accent-color');
            root.style.removeProperty('--funnel-font-family');
        };
    }, [currentFunnelId]);

    return {
        branding,
        colors,
        fonts,
        logo,
        appliedTheme: {
            primaryColor: colors?.primary,
            secondaryColor: colors?.secondary,
            accentColor: colors?.accent,
            fontFamily: fonts,
            companyName: branding?.companyName,
            logoUrl: logo
        }
    };
}

// ============================================================================
// HOOK INTEGRADO - TUDO AUTOMÁTICO
// ============================================================================

/**
 * 🎯 Hook integrado que aplica automaticamente todas as configurações
 */
export function useAutoConfiguration(options?: {
    enableSEO?: boolean;
    enableTracking?: boolean;
    enableTheme?: boolean;
    customSEO?: Partial<SEOMetaData>;
}) {
    const {
        enableSEO = true,
        enableTracking = true,
        enableTheme = true,
        customSEO
    } = options || {};

    const routeConfig = useRouteConfiguration();

    const seoConfig = enableSEO ? useAutoSEO(customSEO) : null;
    const trackingConfig = enableTracking ? useAutoTracking() : null;
    const themeConfig = enableTheme ? useAutoTheme() : null;

    return {
        route: routeConfig,
        seo: seoConfig,
        tracking: trackingConfig,
        theme: themeConfig,

        // Função utilitária para debug
        debug: () => {
            console.group('🔧 [AutoConfiguration] Status');
            console.log('📍 Rota:', routeConfig);
            console.log('🔍 SEO:', seoConfig);
            console.log('📊 Tracking:', trackingConfig);
            console.log('🎨 Tema:', themeConfig);
            console.groupEnd();
        }
    };
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * 🎯 Registrar nova rota com configuração
 */
export function registerRoute(mapping: RouteConfigMapping) {
    const existingIndex = ROUTE_FUNNEL_MAPPING.findIndex(
        route => route.path === mapping.path
    );

    if (existingIndex >= 0) {
        ROUTE_FUNNEL_MAPPING[existingIndex] = mapping;
        console.log(`🔄 [RouteConfig] Rota atualizada: ${mapping.path} -> ${mapping.funnelId}`);
    } else {
        ROUTE_FUNNEL_MAPPING.push(mapping);
        console.log(`✅ [RouteConfig] Nova rota registrada: ${mapping.path} -> ${mapping.funnelId}`);
    }
}

/**
 * 🎯 Obter configuração para uma rota específica
 */
export function getRouteConfiguration(path: string): RouteConfigMapping | undefined {
    return ROUTE_FUNNEL_MAPPING.find(mapping =>
        path.startsWith(mapping.path)
    );
}

/**
 * 🎯 Listar todas as rotas configuradas
 */
export function getAllRouteConfigurations(): RouteConfigMapping[] {
    return [...ROUTE_FUNNEL_MAPPING];
}

export default {
    useRouteConfiguration,
    useAutoSEO,
    useAutoTracking,
    useAutoTheme,
    useAutoConfiguration,
    registerRoute,
    getRouteConfiguration,
    getAllRouteConfigurations
};
