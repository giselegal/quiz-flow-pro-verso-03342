/**
 * V3Renderer - Renderiza templates JSON v3.0
 * 
 * Componente central que orquestra a renderização de templates v3.0
 * com sections componíveis, design system e analytics integrados.
 * 
 * @version 1.0.0
 * @date 2025-10-12
 * @author Quiz Flow Pro
 */

import React, { Suspense, useMemo, useCallback, useEffect } from 'react';
import type {
    TemplateV3,
    UserData,
} from '@/types/template-v3.types';
import { SectionsContainer } from '@/components/sections/SectionRenderer';

// ============================================================================
// TYPES
// ============================================================================

export interface V3RendererProps {
    /** Template JSON v3.0 completo */
    template: TemplateV3;

    /** Dados do usuário do quiz (opcional) */
    userData?: UserData;

    /** Callback para eventos de analytics (opcional) */
    onAnalytics?: (eventName: string, data: Record<string, any>) => void;

    /** CSS classes adicionais */
    className?: string;

    /** ID do container principal */
    containerId?: string;

    /** Modo de renderização (default: 'full') */
    mode?: 'full' | 'preview' | 'editor';
}

interface V3RendererState {
    hasError: boolean;
    error?: Error;
    isReady: boolean;
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

/**
 * Skeleton loader para o template completo
 */
const TemplateLoadingSkeleton: React.FC = () => {
    return (
        <div className="template-loading-skeleton animate-pulse" aria-label="Carregando template">
            {/* Hero skeleton */}
            <div
                className="skeleton-section"
                style={{
                    height: '400px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s ease-in-out infinite',
                    marginBottom: '3rem',
                    borderRadius: '0.75rem',
                }}
            />

            {/* Content sections skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="skeleton-section"
                    style={{
                        height: '200px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s ease-in-out infinite',
                        marginBottom: '2rem',
                        borderRadius: '0.75rem',
                        animationDelay: `${i * 0.1}s`,
                    }}
                />
            ))}

            <style>{`
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

/**
 * Error boundary para o template completo
 */
class V3RendererErrorBoundary extends React.Component<
    { children: React.ReactNode; templateId: string },
    V3RendererState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            isReady: true,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<V3RendererState> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`[V3Renderer] Error in template ${this.props.templateId}:`, error);
        console.error('[V3Renderer] Error info:', errorInfo);

        // Enviar para serviço de tracking de erros (Sentry, etc)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                contexts: {
                    template: {
                        id: this.props.templateId,
                        errorInfo: errorInfo.componentStack,
                    },
                },
            });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="v3-renderer-error"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        background: '#fff3cd',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '600px',
                            padding: '2rem',
                            background: '#fff',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h1 style={{ color: '#856404', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            ⚠️ Erro ao Carregar Template
                        </h1>

                        <p style={{ color: '#856404', marginBottom: '1rem' }}>
                            Desculpe, ocorreu um erro ao carregar esta página. Por favor, tente novamente.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                            }}
                        >
                            Recarregar Página
                        </button>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{ marginTop: '1.5rem' }}>
                                <summary
                                    style={{
                                        cursor: 'pointer',
                                        color: '#856404',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Detalhes do Erro (Dev Only)
                                </summary>
                                <pre
                                    style={{
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        overflow: 'auto',
                                        color: '#333',
                                    }}
                                >
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ============================================================================
// ANALYTICS HELPER
// ============================================================================

/**
 * Hook para gerenciar analytics do template
 */
const useV3Analytics = (
    template: TemplateV3,
    userData: UserData | undefined,
    onAnalytics?: (eventName: string, data: Record<string, any>) => void
) => {
    // Track page view ao montar
    useEffect(() => {
        if (!onAnalytics) return;

        const eventData = {
            templateId: template.metadata.id,
            templateVersion: template.templateVersion,
            userId: userData?.email || 'anonymous',
            timestamp: new Date().toISOString(),
            utmParams: new URLSearchParams(window.location.search).toString(),
        };

        onAnalytics('page_view', eventData);

        // Track pixel de visualização
        if (template.analytics?.pixelId) {
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'ViewContent', {
                    content_name: template.metadata.name,
                    content_category: template.metadata.category,
                });
            }
        }
    }, [template, userData, onAnalytics]);

    // Callback para tracking de sections
    const handleSectionView = useCallback(
        (sectionId: string) => {
            if (!onAnalytics) return;

            onAnalytics('section_viewed', {
                sectionId,
                templateId: template.metadata.id,
                timestamp: new Date().toISOString(),
            });
        },
        [template.metadata.id, onAnalytics]
    );

    // Track scroll depth
    useEffect(() => {
        if (!onAnalytics) return;

        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
            const scrollPercentage = Math.round(
                ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
            );

            if (scrollPercentage > maxScrollDepth) {
                maxScrollDepth = scrollPercentage;

                // Track em intervalos de 25%
                if ([25, 50, 75, 100].includes(scrollPercentage)) {
                    onAnalytics('scroll_depth', {
                        depth: scrollPercentage,
                        templateId: template.metadata.id,
                    });
                }
            }
        };

        window.addEventListener('scroll', trackScrollDepth, { passive: true });
        return () => window.removeEventListener('scroll', trackScrollDepth);
    }, [template.metadata.id, onAnalytics]);

    // Track time on page
    useEffect(() => {
        if (!onAnalytics) return;

        const startTime = Date.now();

        return () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000); // em segundos

            onAnalytics('time_on_page', {
                seconds: timeOnPage,
                templateId: template.metadata.id,
            });
        };
    }, [template.metadata.id, onAnalytics]);

    return {
        handleSectionView,
    };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * V3Renderer - Componente principal para renderizar templates v3.0
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <V3Renderer
 *   template={step20v3Template}
 *   userData={{ name: "João", styleName: "Clássico" }}
 * />
 * 
 * // Com analytics
 * <V3Renderer
 *   template={template}
 *   userData={userData}
 *   onAnalytics={(event, data) => {
 *     console.log('Analytics:', event, data);
 *     gtag('event', event, data);
 *   }}
 * />
 * 
 * // Modo preview (sem analytics)
 * <V3Renderer
 *   template={template}
 *   mode="preview"
 * />
 * ```
 */
export const V3Renderer: React.FC<V3RendererProps> = ({
    template,
    userData,
    onAnalytics,
    className = '',
    containerId = 'v3-renderer-root',
    mode = 'full',
}) => {
    // Analytics tracking
    const { handleSectionView } = useV3Analytics(
        template,
        userData,
        mode === 'full' ? onAnalytics : undefined // Desabilitar analytics em preview/editor
    );

    // Memoizar container style (CSS variables do theme)
    const containerStyle = useMemo(() => {
        const cssVariables: Record<string, string> = {};

        // Injetar CSS variables do theme
        if (template.theme) {
            // Colors
            Object.entries(template.theme.colors).forEach(([key, value]) => {
                cssVariables[`--color-${key}`] = value;
            });

            // Fonts
            cssVariables['--font-heading'] = template.theme.fonts.heading;
            cssVariables['--font-body'] = template.theme.fonts.body;

            // Spacing
            Object.entries(template.theme.spacing).forEach(([key, value]) => {
                cssVariables[`--spacing-${key}`] = value;
            });

            // Border Radius
            Object.entries(template.theme.borderRadius).forEach(([key, value]) => {
                cssVariables[`--radius-${key}`] = value;
            });
        }

        // Layout configuration
        if (template.layout) {
            cssVariables['--container-max-width'] = template.layout.maxWidth || '1280px';
            cssVariables['--container-background'] = template.layout.backgroundColor || 'transparent';
        }

        return cssVariables as React.CSSProperties;
    }, [template.theme, template.layout]);

    // Validação básica do template
    if (!template || !template.sections || template.sections.length === 0) {
        console.error('[V3Renderer] Invalid template:', template);

        return (
            <div className="v3-renderer-error" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#dc3545' }}>
                    ⚠️ Template inválido ou vazio
                </p>
            </div>
        );
    }

    return (
        <V3RendererErrorBoundary templateId={template.metadata.id}>
            <div
                id={containerId}
                className={`v3-renderer v3-renderer--${mode} ${className}`}
                style={containerStyle}
                data-template-id={template.metadata.id}
                data-template-version={template.templateVersion}
                data-template-category={template.metadata.category}
            >
                <Suspense fallback={<TemplateLoadingSkeleton />}>
                    {/* Container principal de sections */}
                    <SectionsContainer
                        sections={template.sections}
                        theme={template.theme}
                        offer={template.offer}
                        userData={userData}
                        onSectionView={mode === 'full' ? handleSectionView : undefined}
                        className="v3-sections-main"
                    />
                </Suspense>

                {/* Dev info */}
                {process.env.NODE_ENV === 'development' && mode === 'full' && (
                    <div
                        className="v3-renderer-dev-info"
                        style={{
                            position: 'fixed',
                            bottom: '1rem',
                            right: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            zIndex: 9999,
                        }}
                    >
                        <div>Template: {template.metadata.id}</div>
                        <div>Version: {template.templateVersion}</div>
                        <div>Sections: {template.sections.filter(s => s.enabled).length}</div>
                    </div>
                )}
            </div>
        </V3RendererErrorBoundary>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * V3PreviewRenderer - Versão simplificada para preview
 * Sem analytics, sem error boundaries pesados
 */
export const V3PreviewRenderer: React.FC<Omit<V3RendererProps, 'mode'>> = (props) => {
    return <V3Renderer {...props} mode="preview" />;
};

/**
 * V3EditorRenderer - Versão para o editor
 * Com controles extras e modo de edição
 */
export const V3EditorRenderer: React.FC<Omit<V3RendererProps, 'mode'>> = (props) => {
    return <V3Renderer {...props} mode="editor" />;
};

// Default export
export default V3Renderer;
