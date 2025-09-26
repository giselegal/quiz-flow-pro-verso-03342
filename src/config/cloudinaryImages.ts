/**
 * 🖼️ CONFIGURAÇÕES CENTRALIZADAS DE IMAGENS CLOUDINARY
 * 
 * Todas as URLs otimizadas para logos, imagens principais e assets do projeto
 */

// === CONFIGURAÇÕES BASE ===
export const CLOUDINARY_CONFIG = {
    // Cloud name principal (logo e imagens gerais)
    MAIN_CLOUD: 'dqljyf76t',

    // Cloud name alternativo (imagens específicas)  
    ALT_CLOUD: 'der8kogzu'
};

// === URLS BASE ===
const MAIN_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.MAIN_CLOUD}/image/upload/`;

// === IDs DAS IMAGENS ===
export const IMAGE_IDS = {
    // Logo da marca
    LOGO: 'v1744911572/LOGO_DA_MARCA_GISELE_r14oz2',

    // Imagem principal da intro (nova)
    INTRO_MAIN: 'v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up'
};

// === LOGO OTIMIZADO (Multi-formato) ===
export const LOGO_URLS = {
    webp: `${MAIN_BASE_URL}f_webp,q_70,w_120,h_50,c_fit/${IMAGE_IDS.LOGO}.webp`,
    png: `${MAIN_BASE_URL}f_png,q_70,w_120,h_50,c_fit/${IMAGE_IDS.LOGO}.png`,

    // Variações de tamanho
    small: {
        webp: `${MAIN_BASE_URL}f_webp,q_70,w_80,h_35,c_fit/${IMAGE_IDS.LOGO}.webp`,
        png: `${MAIN_BASE_URL}f_png,q_70,w_80,h_35,c_fit/${IMAGE_IDS.LOGO}.png`
    },

    large: {
        webp: `${MAIN_BASE_URL}f_webp,q_80,w_200,h_85,c_fit/${IMAGE_IDS.LOGO}.webp`,
        png: `${MAIN_BASE_URL}f_png,q_80,w_200,h_85,c_fit/${IMAGE_IDS.LOGO}.png`
    }
};

// === IMAGEM PRINCIPAL DA INTRO (Multi-formato) ===
export const INTRO_IMAGE_URLS = {
    // Formato PNG original (alta qualidade)
    png: `${MAIN_BASE_URL}f_png,q_85,w_300,c_limit/${IMAGE_IDS.INTRO_MAIN}.png`,

    // WebP otimizado (boa compatibilidade)
    webp: `${MAIN_BASE_URL}f_webp,q_85,w_300,c_limit/${IMAGE_IDS.INTRO_MAIN}.webp`,

    // AVIF moderno (melhor compressão)
    avif: `${MAIN_BASE_URL}f_avif,q_85,w_300,c_limit/${IMAGE_IDS.INTRO_MAIN}.avif`,

    // Variações de tamanho
    mobile: {
        png: `${MAIN_BASE_URL}f_png,q_80,w_250,c_limit/${IMAGE_IDS.INTRO_MAIN}.png`,
        webp: `${MAIN_BASE_URL}f_webp,q_80,w_250,c_limit/${IMAGE_IDS.INTRO_MAIN}.webp`,
        avif: `${MAIN_BASE_URL}f_avif,q_80,w_250,c_limit/${IMAGE_IDS.INTRO_MAIN}.avif`
    },

    desktop: {
        png: `${MAIN_BASE_URL}f_png,q_90,w_400,c_limit/${IMAGE_IDS.INTRO_MAIN}.png`,
        webp: `${MAIN_BASE_URL}f_webp,q_90,w_400,c_limit/${IMAGE_IDS.INTRO_MAIN}.webp`,
        avif: `${MAIN_BASE_URL}f_avif,q_90,w_400,c_limit/${IMAGE_IDS.INTRO_MAIN}.avif`
    }
};

// === FUNÇÕES UTILITÁRIAS ===

/**
 * Gera URL otimizada do logo com parâmetros customizados
 */
export function generateLogoUrl(options: {
    format?: 'webp' | 'png';
    width?: number;
    height?: number;
    quality?: number;
} = {}) {
    const { format = 'webp', width = 120, height = 50, quality = 70 } = options;
    return `${MAIN_BASE_URL}f_${format},q_${quality},w_${width},h_${height},c_fit/${IMAGE_IDS.LOGO}.${format}`;
}

/**
 * Gera URL otimizada da imagem principal com parâmetros customizados
 */
export function generateIntroImageUrl(options: {
    format?: 'png' | 'webp' | 'avif';
    width?: number;
    quality?: number;
} = {}) {
    const { format = 'webp', width = 300, quality = 85 } = options;
    return `${MAIN_BASE_URL}f_${format},q_${quality},w_${width},c_limit/${IMAGE_IDS.INTRO_MAIN}.${format}`;
}

// === EXPORTS PARA COMPATIBILIDADE ===

// URLs estáticas pré-otimizadas para uso direto (compatível com exemplo ideal)
export const STATIC_LOGO_IMAGE_URLS = {
    webp: LOGO_URLS.webp,
    png: LOGO_URLS.png
};

export const STATIC_INTRO_IMAGE_URLS = {
    avif: INTRO_IMAGE_URLS.avif,
    webp: INTRO_IMAGE_URLS.webp,
    png: INTRO_IMAGE_URLS.png
};

// Configuração para o exemplo ideal
export const LOGO_BASE_URL = MAIN_BASE_URL;
export const LOGO_IMAGE_ID = IMAGE_IDS.LOGO;

export const INTRO_IMAGE_BASE_URL = MAIN_BASE_URL;
export const INTRO_IMAGE_ID = IMAGE_IDS.INTRO_MAIN;