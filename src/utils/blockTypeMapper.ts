/**
 * 🔄 BLOCK TYPE MAPPER
 *
 * Mapeia tipos de bloco do template v3.0 (sections) para tipos conhecidos pelo editor
 * sem alterar dados de conteúdo. Preserva o tipo original em properties._originalType
 */

export const BLOCK_TYPE_MAP: Record<string, string> = {
    // ====== V3 SECTIONS → BLOCK TYPES (MAPEAMENTO COMPLETO) ======
    // Intro blocks - mapear para componentes completos usados no editor/preview
    // Gargalo #1: corrigir mapeamentos para blocos atômicos reais
    'intro-hero': 'intro-logo',    // ✅ Mapear para primeiro bloco atômico (logo/cabeçalho atômico)
    'welcome-form': 'intro-form',  // ✅ Mapear para componente correto do registro

    // Question blocks
    'question-hero': 'quiz-question-header',
    'question-title': 'heading-inline', // Título separado da questão (novo section v3)
    'options-grid': 'options-grid', // já existe

    // Common elements
    'text-inline': 'text-inline', // Mapeamento identidade
    'CTAButton': 'cta-inline', // CTA genérico usado em múltiplos steps

    // Transition blocks
    'transition-hero': 'transition-hero', // já existe no registry
    'transition-content': 'text',

    // Result blocks (Step 20 sections → componentes)
    'HeroSection': 'result-header',
    'StyleProfileSection': 'result-characteristics',
    'TransformationSection': 'benefits-list',
    'MethodStepsSection': 'benefits-list', // ou criar 'method-steps' dedicado
    'BonusSection': 'benefits-list',
    'SocialProofSection': 'testimonials',
    'OfferSection': 'offer-hero',
    'GuaranteeSection': 'guarantee',

    // Result blocks (legacy aliases)
    'result-header': 'result-header', // já existe no registry
    'result-content': 'text',
    'result-card': 'result-card', // container estilizado existente

    // Offer blocks
    'offer-hero': 'offer-hero', // já existe no registry
    'offer-hero-section': 'offer-hero', // variação vista em backups
    'offer-cta': 'button',

    // ====== Step 20/21 aliases (v3 → editor registry) ======
    // Elementos de ancoragem de valor, segurança e urgência
    'ValueAnchor': 'value-anchoring',
    'SecurePurchase': 'secure-purchase',
    'UrgencyTimer': 'urgency-timer-inline',

    // Preços (variações)
    'PricingInline': 'pricing-inline',
    'Pricing': 'pricing-inline',
    'pricing-inline': 'pricing-inline',
    'pricing': 'pricing',

    // Aliases/variações em minúsculo
    'heroSection': 'result-hero',
    'styleProfileSection': 'result-characteristics',
    'transformationSection': 'benefits-list',
    'socialProofSection': 'testimonials',
    'guaranteeSection': 'guarantee',
    'bonusSection': 'benefits-list',
    'offerSection': 'offer-hero',
};

export function mapBlockType(templateType: string): string {
    if (!templateType) return templateType;
    const key = String(templateType).trim();
    // Normalizar capitalização mais comum (começar minúsculo exceto casos específicos)
    const normalized = BLOCK_TYPE_MAP[key]
        || BLOCK_TYPE_MAP[key.charAt(0).toUpperCase() + key.slice(1)]
        || BLOCK_TYPE_MAP[key.charAt(0).toLowerCase() + key.slice(1)]
        || key;
    return normalized;
}

export function isCustomBlockType(type: string): boolean {
    return Object.prototype.hasOwnProperty.call(BLOCK_TYPE_MAP, type);
}
