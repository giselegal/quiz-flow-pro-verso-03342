/**
 * 🔄 BLOCK TYPE MAPPER
 *
 * Mapeia tipos de bloco do template v3.0 (sections) para tipos conhecidos pelo editor
 * sem alterar dados de conteúdo. Preserva o tipo original em properties._originalType
 */

export const BLOCK_TYPE_MAP: Record<string, string> = {
    // Intro blocks - agora mapeados para blocos atômicos específicos
    'intro-hero': 'intro-logo', // Mapeia para o componente de logo
    'welcome-form': 'intro-form', // Mapeia para o componente de formulário

    // Question blocks
    'question-hero': 'quiz-question-header',
    'options-grid': 'options-grid', // já existe

    // Transition blocks
    'transition-hero': 'transition-hero', // já existe no registry
    'transition-content': 'text',

    // Result blocks
    'result-header': 'result-header', // já existe no registry
    'result-content': 'text',
    'result-card': 'result-card', // container estilizado existente

    // Offer blocks
    'offer-hero': 'offer-hero', // já existe no registry
    'offer-hero-section': 'offer-hero', // variação vista em backups
    'offer-cta': 'button',

    // ====== Step 20/21 aliases (v3 → editor registry) ======
    // CTA principal da oferta
    'CTAButton': 'cta-inline',

    // Seções de prova social, benefícios e garantia
    'BonusSection': 'benefits-list',
    'SocialProofSection': 'testimonials',
    'GuaranteeSection': 'guarantee',

    // Elementos de ancoragem de valor, segurança e urgência
    'ValueAnchor': 'value-anchoring',
    'SecurePurchase': 'secure-purchase',
    'UrgencyTimer': 'urgency-timer-inline',

    // Preços (variações)
    'PricingInline': 'pricing-inline',
    'Pricing': 'pricing-inline',
    'pricing-inline': 'pricing-inline',
    'pricing': 'pricing',

    // ====== Mapeamentos adicionais do master JSON (step-20/21 e afins) ======
    // Seções de alto nível personalizadas do template v3 consolidado
    'HeroSection': 'result-header',
    'StyleProfileSection': 'result-characteristics',
    'TransformationSection': 'benefits-list',
    // SocialProofSection / GuaranteeSection / BonusSection já mapeados acima
    'OfferSection': 'offer-hero',
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
