/**
 * Section Renderer
 * 
 * Componente central que renderiza sections v3.0
 * Usa lazy loading e mapeia section.type para componentes React
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React, { Suspense } from 'react';
import type {
    Section,
    SectionType,
    ThemeSystem,
    OfferSystem,
    UserData,
} from '@/types/template-v3.types';

// ============================================================================
// LAZY IMPORTS - Code splitting por section
// ============================================================================

const HeroSection = React.lazy(() => import('./HeroSection').then(m => ({ default: m.HeroSection })));
const StyleProfileSection = React.lazy(() => import('./StyleProfileSection'));
const CTAButton = React.lazy(() => import('./CTAButton'));
const TransformationSection = React.lazy(() => import('./TransformationSection'));
const MethodStepsSection = React.lazy(() => import('./MethodStepsSection'));
const BonusSection = React.lazy(() => import('./BonusSection'));
const SocialProofSection = React.lazy(() => import('./SocialProofSection'));
const OfferSection = React.lazy(() => import('./OfferSection'));
const GuaranteeSection = React.lazy(() => import('./GuaranteeSection'));

// ============================================================================
// TYPES
// ============================================================================

interface SectionRendererProps {
    /** Section a ser renderizada */
    section: Section;

    /** Theme system do template */
    theme: ThemeSystem;

    /** Offer system do template */
    offer: OfferSystem;

    /** Dados do usuário (opcional) */
    userData?: UserData;

    /** Callback para tracking analytics (opcional) */
    onSectionView?: (sectionId: string) => void;

    /** CSS classes adicionais (opcional) */
    className?: string;
}

// ============================================================================
// COMPONENT MAP
// ============================================================================

/**
 * Mapeamento de section types para componentes React
 */
const SECTION_COMPONENT_MAP: Record<SectionType, React.ComponentType<any>> = {
    HeroSection,
    StyleProfileSection,
    CTAButton,
    TransformationSection,
    MethodStepsSection,
    BonusSection,
    SocialProofSection,
    OfferSection,
    GuaranteeSection,
};

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

/**
 * Skeleton loader enquanto section carrega
 */
const SectionSkeleton: React.FC<{ type?: SectionType }> = ({ type }) => {
    return (
        <div
            className="section-skeleton animate-pulse"
            role="status"
            aria-label="Carregando seção"
            style={{
                minHeight: '200px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
            }}
        >
            <style>
                {`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
            </style>
            <span className="sr-only">Carregando {type}...</span>
        </div>
    );
};

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class SectionErrorBoundary extends React.Component<
    { children: React.ReactNode; sectionId: string },
    ErrorBoundaryState
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`Error in section ${this.props.sectionId}:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="section-error"
                    style={{
                        padding: '2rem',
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '0.5rem',
                        margin: '1rem 0',
                    }}
                >
                    <h3 style={{ color: '#856404', margin: 0, marginBottom: '0.5rem' }}>
                        ⚠️ Erro ao carregar section
                    </h3>
                    <p style={{ color: '#856404', margin: 0, fontSize: '0.875rem' }}>
                        ID: {this.props.sectionId}
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            overflow: 'auto',
                        }}>
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * SectionRenderer - Renderiza sections v3.0 dinamicamente
 * 
 * @example
 * ```tsx
 * <SectionRenderer
 *   section={section}
 *   theme={template.theme}
 *   offer={template.offer}
 *   userData={{ name: "João", styleName: "Clássico" }}
 *   onSectionView={(id) => console.log('Viewed:', id)}
 * />
 * ```
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    section,
    theme,
    offer,
    userData,
    onSectionView,
    className,
}) => {
    // Intersection Observer para tracking de visualizações
    const sectionRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!onSectionView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onSectionView(section.id);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [section.id, onSectionView]);

    // Section desabilitada - não renderiza
    if (!section.enabled) {
        return null;
    }

    // Buscar componente do mapa
    const Component = SECTION_COMPONENT_MAP[section.type];

    // Section type desconhecido
    if (!Component) {
        console.warn(`Unknown section type: ${section.type}`);

        return (
            <div
                ref={sectionRef}
                className={`section-unknown ${className || ''}`}
                data-section-id={section.id}
                data-section-type={section.type}
                style={{
                    padding: '2rem',
                    background: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '0.5rem',
                    margin: '1rem 0',
                }}
            >
                <p style={{ color: '#721c24', margin: 0 }}>
                    ⚠️ Section type não implementado: <strong>{section.type}</strong>
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <pre style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#fff',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        overflow: 'auto',
                    }}>
                        {JSON.stringify(section, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    // Renderizar section com error boundary e suspense
    return (
        <div
            ref={sectionRef}
            className={`section-wrapper section-${section.type} ${className || ''}`}
            data-section-id={section.id}
            data-section-order={section.order}
            style={{
                marginBottom: 'var(--spacing-section, 3rem)',
            }}
        >
            <SectionErrorBoundary sectionId={section.id}>
                <Suspense fallback={<SectionSkeleton type={section.type} />}>
                    <Component
                        // Props da section
                        {...section.props}

                        // Props do sistema
                        theme={theme}
                        offer={offer}
                        userData={userData}

                        // Metadata
                        sectionId={section.id}
                        sectionTitle={section.title}
                    />
                </Suspense>
            </SectionErrorBoundary>
        </div>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Renderiza múltiplas sections em ordem
 * 
 * @example
 * ```tsx
 * <SectionsContainer
 *   sections={template.sections}
 *   theme={template.theme}
 *   offer={template.offer}
 * />
 * ```
 */
export const SectionsContainer: React.FC<{
    sections: Section[];
    theme: ThemeSystem;
    offer: OfferSystem;
    userData?: UserData;
    onSectionView?: (sectionId: string) => void;
    className?: string;
}> = ({
    sections,
    theme,
    offer,
    userData,
    onSectionView,
    className,
}) => {
        // Filtrar apenas sections habilitadas e ordenar
        const activeSections = React.useMemo(() => {
            return sections
                .filter(section => section.enabled)
                .sort((a, b) => a.order - b.order);
        }, [sections]);

        // CSS variables do theme
        const cssVariables = React.useMemo(() => {
            const vars: Record<string, string> = {};

            // Colors
            Object.entries(theme.colors).forEach(([key, value]) => {
                vars[`--color-${key}`] = value;
            });

            // Fonts
            vars['--font-heading'] = theme.fonts.heading;
            vars['--font-body'] = theme.fonts.body;

            // Spacing
            Object.entries(theme.spacing).forEach(([key, value]) => {
                vars[`--spacing-${key}`] = value;
            });

            // Border Radius
            Object.entries(theme.borderRadius).forEach(([key, value]) => {
                vars[`--radius-${key}`] = value;
            });

            return vars;
        }, [theme]);

        return (
            <div
                className={`sections-container ${className || ''}`}
                style={cssVariables as React.CSSProperties}
            >
                {activeSections.map((section) => (
                    <SectionRenderer
                        key={section.id}
                        section={section}
                        theme={theme}
                        offer={offer}
                        userData={userData}
                        onSectionView={onSectionView}
                    />
                ))}
            </div>
        );
    };

// Default export
export default SectionRenderer;
