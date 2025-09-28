/**
 * 🔗 SISTEMA DE INTERPOLAÇÃO PARA IA
 * 
 * Conecta os resultados do QuizCalculationEngine com o FashionAI
 * para gerar conteúdo personalizado baseado no estilo calculado.
 */

import type { QuizResult } from '@/types/ai-quiz-result';

// Mapeamento de estilos para prompts de IA otimizados
export const AI_STYLE_PROMPTS: Record<string, string> = {
    natural: 'Casual comfortable outfit with natural fabrics, earth tones, relaxed fit, minimalist accessories, effortless style',
    classico: 'Classic timeless outfit with structured pieces, neutral colors, elegant blazer, quality materials, refined details',
    contemporaneo: 'Modern contemporary outfit with current trends, clean lines, practical pieces, urban sophistication',
    elegante: 'Sophisticated elegant outfit with luxury materials, impeccable tailoring, refined silhouette, premium quality',
    romantico: 'Romantic feminine outfit with soft flowing fabrics, delicate details, pastel colors, gentle silhouettes',
    sexy: 'Sensual confident outfit with body-conscious fit, bold colors, strategic styling, elegant femininity',
    dramatico: 'Dramatic statement outfit with bold geometric shapes, strong contrasts, architectural lines, urban edge',
    criativo: 'Creative artistic outfit with unique patterns, vibrant colors, unconventional combinations, experimental style'
};

// Paletas de cores específicas para cada estilo
export const AI_COLOR_PALETTES: Record<string, string[]> = {
    natural: ['#8B7355', '#A0956B', '#E6D7C3', '#F5F0E8', '#7D8471'],
    classico: ['#2C3E50', '#34495E', '#BDC3C7', '#ECF0F1', '#8B9DC3'],
    contemporaneo: ['#3498DB', '#2ECC71', '#95A5A6', '#F8F9FA', '#E74C3C'],
    elegante: ['#1A1A1A', '#8B4513', '#D4AF37', '#FFFEF7', '#2C2C2C'],
    romantico: ['#FF69B4', '#FFB6C1', '#E6E6FA', '#FFF0F5', '#DDA0DD'],
    sexy: ['#DC143C', '#8B0000', '#000000', '#FFFFFF', '#FF1493'],
    dramatico: ['#000000', '#FF0000', '#FFFFFF', '#C0C0C0', '#FFD700'],
    criativo: ['#FF4500', '#32CD32', '#FF1493', '#FFD700', '#9370DB']
};

// Dicas de estilo personalizadas
export const AI_STYLE_TIPS: Record<string, string[]> = {
    natural: [
        'Priorize tecidos como algodão, linho e malhas naturais',
        'Aposte em cores terrosas: bege, marrom, verde oliva',
        'Escolha peças confortáveis e com movimento livre',
        'Use acessórios minimalistas e funcionais'
    ],
    classico: [
        'Invista em blazers bem estruturados e alfaiataria',
        'Cores neutras são suas aliadas: preto, navy, bege',
        'Escolha peças atemporais que durem anos',
        'Foque na qualidade dos tecidos e cortes impecáveis'
    ],
    contemporaneo: [
        'Combine peças básicas com elementos modernos',
        'Experimente cortes diferenciados e linhas limpas',
        'Use acessórios que elevem looks básicos',
        'Mantenha-se atualizada com tendências sutis'
    ],
    elegante: [
        'Invista em peças de qualidade superior',
        'Menos é mais: prefira qualidade à quantidade',
        'Use cortes que valorizem sua silhueta',
        'Escolha acessórios refinados e discretos'
    ],
    romantico: [
        'Babados, rendas e detalhes delicados são perfeitos',
        'Cores suaves: rosa, lavanda, pêssego, off-white',
        'Tecidos fluidos e com movimento natural',
        'Acessórios femininos completam o look'
    ],
    sexy: [
        'Valorize suas curvas com cortes estratégicos',
        'Use decotes e fendas com elegância',
        'Cores intensas como vermelho e preto são ideais',
        'Saltos altos e acessórios marcantes'
    ],
    dramatico: [
        'Peças statement são suas protagonistas',
        'Contraste forte entre cores e texturas',
        'Acessórios grandes e impactantes',
        'Experimente silhuetas geométricas'
    ],
    criativo: [
        'Misture texturas e padrões inesperados',
        'Cores vibrantes e estampas ousadas',
        'Combine peças de estilos diferentes',
        'Use a moda como forma de expressão artística'
    ]
};

/**
 * Interface para dados interpolados da IA
 */
export interface AIInterpolationData {
    styleType: string;
    styleName: string;
    aiPrompt: string;
    colorPalette: string[];
    styleTips: string[];
    percentage: number;
    description: string;
    secondaryStyles?: {
        name: string;
        percentage: number;
    }[];
}

/**
 * Processa resultado do quiz para uso com IA
 */
export function interpolateQuizResultForAI(
    quizResult: QuizResult | null,
    fallbackStyle: string = 'elegante'
): AIInterpolationData {
    if (!quizResult || !quizResult.primaryStyle) {
        // Fallback quando não há resultado
        return {
            styleType: fallbackStyle,
            styleName: AI_STYLE_PROMPTS[fallbackStyle] ? fallbackStyle.charAt(0).toUpperCase() + fallbackStyle.slice(1) : 'Elegante',
            aiPrompt: AI_STYLE_PROMPTS[fallbackStyle] || AI_STYLE_PROMPTS.elegante,
            colorPalette: AI_COLOR_PALETTES[fallbackStyle] || AI_COLOR_PALETTES.elegante,
            styleTips: AI_STYLE_TIPS[fallbackStyle] || AI_STYLE_TIPS.elegante,
            percentage: 100,
            description: 'Estilo padrão selecionado'
        };
    }

    const primaryStyle = quizResult.primaryStyle;
    const styleKey = primaryStyle.category.toLowerCase();

    return {
        styleType: styleKey,
        styleName: primaryStyle.name,
        aiPrompt: AI_STYLE_PROMPTS[styleKey] || AI_STYLE_PROMPTS.elegante,
        colorPalette: AI_COLOR_PALETTES[styleKey] || AI_COLOR_PALETTES.elegante,
        styleTips: AI_STYLE_TIPS[styleKey] || AI_STYLE_TIPS.elegante,
        percentage: primaryStyle.percentage,
        description: primaryStyle.description,
        secondaryStyles: quizResult.secondaryStyles?.map(style => ({
            name: style.name,
            percentage: style.percentage
        }))
    };
}

/**
 * Interpola string com variáveis do resultado do quiz
 */
export function interpolateQuizVariables(
    text: string,
    quizResult: QuizResult | null,
    additionalVars: Record<string, string> = {}
): string {
    if (!quizResult) {
        return text.replace(/{[^}]+}/g, '---');
    }

    const variables: Record<string, string> = {
        resultStyle: quizResult.primaryStyle.name,
        resultPercentage: quizResult.primaryStyle.percentage.toString(),
        resultDescription: quizResult.primaryStyle.description,
        secondaryStyle1: quizResult.secondaryStyles?.[0]?.name || '',
        secondaryPercentage1: quizResult.secondaryStyles?.[0]?.percentage?.toString() || '0',
        secondaryStyle2: quizResult.secondaryStyles?.[1]?.name || '',
        secondaryPercentage2: quizResult.secondaryStyles?.[1]?.percentage?.toString() || '0',
        totalScore: quizResult.totalScore.toString(),
        ...additionalVars
    };

    let interpolatedText = text;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        interpolatedText = interpolatedText.replace(regex, value);
    });

    return interpolatedText;
}

/**
 * Gera configuração completa para o bloco de IA
 */
export function generateAIBlockConfig(
    quizResult: QuizResult | null,
    userName: string = ''
): {
    content: any;
    properties: any;
    aiData: AIInterpolationData;
} {
    const aiData = interpolateQuizResultForAI(quizResult);

    const baseContent = {
        title: '✨ Seus looks personalizados com IA',
        subtitle: `Baseado no seu estilo ${aiData.styleName}, nossa IA criou looks exclusivos para você`,
        description: 'Veja como aplicar seu estilo na prática com sugestões personalizadas',
        loadingMessage: 'Gerando seus looks personalizados... 🎨',
        errorMessage: 'Ops! Não conseguimos gerar as imagens agora. Tente novamente em alguns minutos.'
    };

    const baseProperties = {
        styleType: aiData.styleType,
        generateOnLoad: true,
        autoGenerate: true,
        providers: ['dalle3', 'gemini', 'stable-diffusion'],
        fallbackProvider: 'gemini',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        imageCount: 3,
        imageSize: 'large',
        showColorPalette: true,
        showStyleTips: true,
        layout: 'grid',
        columns: 3,
        spacing: 16,
        showLoadingState: true,
        showErrorState: true,
        cacheResults: true,
        retryAttempts: 2,
        timeout: 30000,
        stylePrompts: AI_STYLE_PROMPTS,
        colorPalettes: AI_COLOR_PALETTES
    };

    // Interpola variáveis no conteúdo
    const content = {
        ...baseContent,
        title: interpolateQuizVariables(baseContent.title, quizResult, { userName }),
        subtitle: interpolateQuizVariables(baseContent.subtitle, quizResult, { userName }),
        description: interpolateQuizVariables(baseContent.description, quizResult, { userName })
    };

    return {
        content,
        properties: baseProperties,
        aiData
    };
}

/**
 * Hook para usar dados de interpolação da IA
 */
export function useAIInterpolation(quizResult: QuizResult | null) {
    const aiData = interpolateQuizResultForAI(quizResult);

    return {
        aiData,
        interpolateText: (text: string, additionalVars?: Record<string, string>) =>
            interpolateQuizVariables(text, quizResult, additionalVars),
        generateBlockConfig: (userName?: string) =>
            generateAIBlockConfig(quizResult, userName)
    };
}