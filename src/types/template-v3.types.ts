/**
 * Template v3.0 Type Definitions
 * 
 * Sistema de types para templates v3.0 com suporte a:
 * - Design System (theme)
 * - Sistema de Ofertas (offer)
 * - Arquitetura de Sections
 * 
 * @version 3.0.0
 * @date 2025-10-12
 */

// ============================================================================
// TEMPLATE V3 - Estrutura Principal
// ============================================================================

/**
 * Template v3.0 completo
 */
export interface TemplateV3 {
    /** Versão do template */
    templateVersion: "3.0";

    /** Metadados do template */
    metadata: MetadataV3;

    /** Sistema de ofertas integrado */
    offer: OfferSystem;

    /** Sistema de design tokens */
    theme: ThemeSystem;

    /** Configuração de layout */
    layout: LayoutConfig;

    /** Array de sections componentes */
    sections: Section[];

    /** Regras de validação */
    validation: ValidationRules;

    /** Configuração de analytics */
    analytics: AnalyticsConfig;
}

// ============================================================================
// METADATA
// ============================================================================

/**
 * Metadados expandidos v3.0
 */
export interface MetadataV3 {
    /** ID único do template */
    id: string;

    /** Nome amigável */
    name: string;

    /** Descrição detalhada */
    description: string;

    /** Categoria do template */
    category: TemplateCategory;

    /** Tags para busca/filtro */
    tags: string[];

    /** Data de criação (ISO 8601) */
    createdAt: string;

    /** Data de última atualização (ISO 8601) */
    updatedAt: string;

    /** Autor/criador do template */
    author: string;
}

/**
 * Categorias de templates
 */
export type TemplateCategory =
    | "quiz-question"    // Perguntas do quiz
    | "quiz-result"      // Página de resultado
    | "quiz-final"       // Página final/thank you
    | "landing-page"     // Landing pages
    | "opt-in"           // Páginas de captura
    | "sales-page";      // Páginas de vendas

// ============================================================================
// OFFER SYSTEM
// ============================================================================

/**
 * Sistema completo de ofertas
 */
export interface OfferSystem {
    /** Nome do produto */
    productName: string;

    /** Nome do mentor/criador */
    mentor: string;

    /** Título profissional do mentor */
    mentorTitle: string;

    /** Descrição do produto */
    description: string;

    /** Sistema de precificação */
    pricing: PricingSystem;

    /** Links relevantes */
    links: OfferLinks;

    /** Garantia do produto */
    guarantee: GuaranteeConfig;

    /** Features/características */
    features: ProductFeatures;
}

/**
 * Sistema de precificação
 */
export interface PricingSystem {
    /** Preço original */
    originalPrice: number;

    /** Preço promocional/atual */
    salePrice: number;

    /** Moeda (ISO 4217) */
    currency: "BRL" | "USD" | "EUR";

    /** Opções de parcelamento */
    installments: {
        /** Número de parcelas */
        count: number;
        /** Valor por parcela */
        value: number;
    };

    /** Informações de desconto */
    discount: {
        /** Percentual de desconto */
        percentage: number;
        /** Label do desconto */
        label: string;
    };
}

/**
 * Links da oferta
 */
export interface OfferLinks {
    /** URL do checkout */
    checkout: string;

    /** URL da página de vendas (opcional) */
    salesPage: string | null;
}

/**
 * Configuração de garantia
 */
export interface GuaranteeConfig {
    /** Dias de garantia */
    days: number;

    /** Descrição da garantia */
    description: string;
}

/**
 * Features do produto
 */
export interface ProductFeatures {
    /** Total de aulas/módulos */
    totalLessons: number;

    /** Tipo de acesso */
    accessType: string;

    /** Formato do produto */
    format: string;

    /** Features adicionais */
    [key: string]: string | number;
}

// ============================================================================
// THEME SYSTEM
// ============================================================================

/**
 * Sistema de design tokens
 */
export interface ThemeSystem {
    /** Paleta de cores */
    colors: ColorPalette;

    /** Sistema de tipografia */
    fonts: FontSystem;

    /** Espaçamento padronizado */
    spacing: SpacingSystem;

    /** Border radius */
    borderRadius: BorderRadiusSystem;
}

/**
 * Paleta de cores
 */
export interface ColorPalette {
    /** Cor primária */
    primary: string;

    /** Cor secundária */
    secondary: string;

    /** Cor de fundo */
    background: string;

    /** Cor do texto */
    text: string;

    /** Cor de destaque */
    accent: string;

    /** Cor de sucesso/conversão */
    success: string;

    /** Cor de aviso/urgência */
    warning: string;

    /** Cores adicionais */
    [key: string]: string;
}

/**
 * Sistema de tipografia
 */
export interface FontSystem {
    /** Font para headings */
    heading: string;

    /** Font para body text */
    body: string;

    /** Fallback fonts */
    fallback: string;
}

/**
 * Sistema de espaçamento
 */
export interface SpacingSystem {
    /** Espaçamento entre sections */
    section: string;

    /** Espaçamento entre blocks */
    block: string;

    /** Espaçamentos adicionais */
    [key: string]: string;
}

/**
 * Sistema de border radius
 */
export interface BorderRadiusSystem {
    /** Radius pequeno */
    small: string;

    /** Radius médio */
    medium: string;

    /** Radius grande */
    large: string;

    /** Radius adicionais */
    [key: string]: string;
}

// ============================================================================
// SECTIONS
// ============================================================================

/**
 * Section component
 */
export interface Section {
    /** ID único da section */
    id: string;

    /** Tipo do componente */
    type: SectionType;

    /** Se está habilitada */
    enabled: boolean;

    /** Ordem de renderização */
    order: number;

    /** Título da section (opcional) */
    title?: string;

    /** Props específicas do componente */
    props: SectionProps;
}

/**
 * Tipos de sections disponíveis
 */
export type SectionType =
    | "HeroSection"
    | "StyleProfileSection"
    | "CTAButton"
    | "TransformationSection"
    | "MethodStepsSection"
    | "BonusSection"
    | "SocialProofSection"
    | "OfferSection"
    | "GuaranteeSection";

/**
 * Props base para todas as sections
 */
export interface BaseSectionProps {
    /** Classes CSS customizadas */
    className?: string;

    /** Estilos inline customizados */
    style?: React.CSSProperties;

    /** ID para tracking analytics */
    trackingId?: string;
}

/**
 * Props genéricas de sections
 * Cada section type terá suas próprias props específicas
 */
export type SectionProps =
    | HeroSectionProps
    | StyleProfileSectionProps
    | CTAButtonProps
    | TransformationSectionProps
    | MethodStepsSectionProps
    | BonusSectionProps
    | SocialProofSectionProps
    | OfferSectionProps
    | GuaranteeSectionProps;

// ============================================================================
// SECTION PROPS - Específicas por tipo
// ============================================================================

/**
 * Props do HeroSection
 */
export interface HeroSectionProps extends BaseSectionProps {
    /** Exibir celebração */
    showCelebration: boolean;

    /** Emoji de celebração */
    celebrationEmoji: string;

    /** Tipo de animação */
    celebrationAnimation: "bounce" | "fade" | "scale";

    /** Formato do greeting */
    greetingFormat: string;

    /** Formato do título */
    titleFormat: string;

    /** Formato do nome do estilo */
    styleNameDisplay: string;

    /** Cores customizadas */
    colors: {
        greeting: string;
        greetingHighlight: string;
        title: string;
        styleName: string;
    };

    /** Espaçamento customizado */
    spacing: {
        padding: string;
        marginBottom: string;
    };
}

/**
 * Props do StyleProfileSection
 */
export interface StyleProfileSectionProps extends BaseSectionProps {
    /** Layout da section */
    layout: "cards" | "list" | "grid";

    /** Mostrar características */
    showCharacteristics: boolean;

    /** Mostrar cores do estilo */
    showColors: boolean;

    /** Características do perfil */
    characteristics: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
}

/**
 * Props do CTAButton
 */
export interface CTAButtonProps extends BaseSectionProps {
    /** Texto do botão */
    label: string;

    /** URL de destino */
    href: string;

    /** Variante visual */
    variant: "primary" | "secondary" | "outline";

    /** Tamanho do botão */
    size: "small" | "medium" | "large";

    /** Ícone (opcional) */
    icon?: string;

    /** Animação */
    animation?: "pulse" | "shake" | "none";

    /** Configuração de tracking */
    tracking?: {
        event: string;
        category: string;
    };
}

/**
 * Props do TransformationSection
 */
export interface TransformationSectionProps extends BaseSectionProps {
    /** Layout da transformação */
    layout: "side-by-side" | "timeline" | "slider";

    /** Estado "antes" */
    before: {
        title: string;
        description: string;
        image?: string;
    };

    /** Estado "depois" */
    after: {
        title: string;
        description: string;
        image?: string;
    };
}

/**
 * Props do MethodStepsSection
 */
export interface MethodStepsSectionProps extends BaseSectionProps {
    /** Layout dos steps */
    layout: "vertical" | "horizontal" | "grid";

    /** Steps do método */
    steps: Array<{
        number: number;
        title: string;
        description: string;
        icon?: string;
    }>;
}

/**
 * Props do BonusSection
 */
export interface BonusSectionProps extends BaseSectionProps {
    /** Layout dos bônus */
    layout: "cards" | "list";

    /** Lista de bônus */
    bonuses: Array<{
        title: string;
        description: string;
        value?: string;
        icon?: string;
    }>;
}

/**
 * Props do SocialProofSection
 */
export interface SocialProofSectionProps extends BaseSectionProps {
    /** Layout dos depoimentos */
    layout: "carousel" | "grid" | "masonry";

    /** Depoimentos */
    testimonials: Array<{
        name: string;
        role?: string;
        avatar?: string;
        text: string;
        rating?: number;
    }>;
}

/**
 * Props do OfferSection
 */
export interface OfferSectionProps extends BaseSectionProps {
    /** Layout da oferta */
    layout: "card" | "inline" | "split";

    /** Mostrar desconto */
    showDiscount: boolean;

    /** Mostrar features */
    showFeatures: boolean;
}

/**
 * Props do GuaranteeSection
 */
export interface GuaranteeSectionProps extends BaseSectionProps {
    /** Ícone da garantia */
    icon?: string;

    /** Variante visual */
    variant: "badge" | "card" | "banner";
}

// ============================================================================
// LAYOUT & CONFIG
// ============================================================================

/**
 * Configuração de layout
 */
export interface LayoutConfig {
    /** Largura do container */
    containerWidth: "full" | "wide" | "narrow";

    /** Largura máxima */
    maxWidth: string;

    /** Espaçamento geral */
    spacing: "compact" | "comfortable" | "spacious";

    /** Cor de fundo */
    backgroundColor: string;
}

/**
 * Regras de validação
 */
export interface ValidationRules {
    /** Campos obrigatórios */
    required?: string[];

    /** Validação customizada */
    custom?: Record<string, (value: any) => boolean>;
}

/**
 * Configuração de analytics
 */
export interface AnalyticsConfig {
    /** ID do Google Analytics */
    gaId?: string;

    /** ID do Facebook Pixel */
    fbPixelId?: string;

    /** Eventos customizados */
    customEvents?: Array<{
        name: string;
        trigger: string;
    }>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * User data para personalização
 */
export interface UserData {
    /** Nome do usuário */
    name?: string;

    /** Email */
    email?: string;

    /** Resultado do quiz */
    styleName?: string;

    /** Respostas do quiz */
    answers?: Record<string, any>;

    /** Dados adicionais */
    [key: string]: any;
}

/**
 * CSS Variables geradas do theme
 */
export interface CSSVariables {
    "--color-primary": string;
    "--color-secondary": string;
    "--color-background": string;
    "--color-text": string;
    "--color-accent": string;
    "--color-success": string;
    "--color-warning": string;
    "--font-heading": string;
    "--font-body": string;
    "--spacing-section": string;
    "--spacing-block": string;
    "--radius-small": string;
    "--radius-medium": string;
    "--radius-large": string;
    [key: string]: string;
}

/**
 * Resultado da detecção de versão
 */
export type TemplateVersion = "1.0" | "2.0" | "2.1" | "3.0";

/**
 * Template unificado (v2 ou v3)
 */
export type AnyTemplate = TemplateV2 | TemplateV3;

/**
 * Template v2.0 (para compatibilidade)
 */
export interface TemplateV2 {
    templateVersion?: "2.0" | "2.1" | "1.0";
    metadata?: Record<string, any>;
    layout?: Record<string, any>;
    blocks?: Array<Record<string, any>>;
    validation?: Record<string, any>;
    analytics?: Record<string, any>;
}
