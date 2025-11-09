import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useResultCalculations, ResultCalculations } from '@/hooks/useResultCalculations';
import { styleConfigGisele } from '@/data/styles';
import type { QuizScores } from '@/hooks/useQuizState';
import { interpolate as interpolateUtil, interpolateDeep } from '@/lib/utils/interpolate';
import { appLogger } from '@/lib/utils/logger';

/**
 * 🎯 RESULT CONTEXT
 * 
 * Context que fornece dados calculados e handlers para os blocos de resultado.
 * Centraliza a lógica de cálculo e state management.
 */

export interface UserProfile {
    userName: string;
    resultStyle: string;
    secondaryStyles: string[];
}

export interface StyleConfig {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    guideImageUrl?: string;
    characteristics?: string[];
    colors?: string[];
    fabrics?: string[];
    personality?: string[];
}

export interface ResultContextValue {
    // Dados calculados
    calculations: ResultCalculations;

    // Dados do usuário
    userProfile: UserProfile;

    // Scores brutos
    scores?: QuizScores;

    // Config do estilo principal
    styleConfig: StyleConfig;

    // Nomes dos estilos secundários
    secondaryStyleNames: string;

    // Detalhes dos dois estilos complementares (se existirem)
    complementaryStyles?: Array<StyleConfig & { id: string }>; // até 2

    // Handlers
    handleCTAClick: (customUrl?: string) => void;

    // Dados para ofertas
    offerData?: {
        features: Array<{ icon: string; label: string; value: string }>;
        pricing: {
            current: number;
            original: number;
            installments: { quantity: number; value: number };
            discount: number;
        };
        testimonials: Array<{
            name: string;
            role: string;
            quote: string;
            rating: number;
        }>;
    };

    // Interpolação de textos (placeholders)
    interpolateText: (template: string) => string;
}

const ResultContext = createContext<ResultContextValue | null>(null);

export interface ResultProviderProps {
    children: ReactNode;
    userProfile: UserProfile;
    scores?: QuizScores;
    offerUrl?: string;
    offerPrice?: number;
}

export const ResultProvider: React.FC<ResultProviderProps> = ({
    children,
    userProfile,
    scores,
    offerUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    offerPrice = 97,
}) => {
    // 🧮 EXECUTAR CÁLCULOS (memoizados)
    const calculations = useResultCalculations(scores, userProfile);

    // Buscar config do estilo principal
    const styleConfig = useMemo(() => {
        let config = styleConfigGisele[userProfile.resultStyle];

        // Fallback: usar primeiro estilo disponível
        if (!config) {
            appLogger.warn('⚠️ Estilo não encontrado, usando fallback', { resultStyle: userProfile.resultStyle });
            const firstStyle = Object.keys(styleConfigGisele)[0];
            config = styleConfigGisele[firstStyle];
        }

        return config;
    }, [userProfile.resultStyle]);

    // Nomes dos estilos secundários
    const secondaryStyleNames = useMemo(() => {
        return (userProfile.secondaryStyles || [])
            .map(styleId => styleConfigGisele[styleId]?.name)
            .filter(Boolean)
            .join(' e ');
    }, [userProfile.secondaryStyles]);

    // Até 2 estilos complementares detalhados
    const complementaryStyles = useMemo(() => {
        const ids = Array.isArray(userProfile.secondaryStyles) ? userProfile.secondaryStyles.slice(0, 2) : [];
        return ids
            .map((id) => ({ id, cfg: styleConfigGisele[id] }))
            .filter(({ cfg }) => !!cfg)
            .map(({ id, cfg }) => ({ ...(cfg as StyleConfig), id }));
    }, [userProfile.secondaryStyles]);

    // Handler do CTA (lógica de analytics e navegação)
    const handleCTAClick = (customUrl?: string) => {
        const targetUrl = customUrl || offerUrl;

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'checkout_initiated', {
                'event_category': 'ecommerce',
                'event_label': `CTA_Click_${userProfile.resultStyle}`,
                'value': offerPrice,
            });
        }

        // Abrir oferta
        window.open(targetUrl, '_blank');
    };

    // Dados da oferta (podem ser customizados via props no futuro)
    const offerData = useMemo(() => ({
        features: [
            { icon: '✅', label: '31 Aulas Online (Acesso Imediato)', value: 'R$ 297,00' },
            { icon: '✅', label: 'Bônus: Guia de Visagismo Facial (PDF)', value: 'R$ 67,00' },
            { icon: '✅', label: 'Bônus: Peças-Chave + Inventário', value: 'R$ 83,00' },
        ],
        pricing: {
            current: offerPrice,
            original: 447,
            installments: { quantity: 8, value: 14.11 },
            discount: 78,
        },
        testimonials: [
            {
                name: 'Maria Silva',
                role: 'Advogada',
                quote: 'Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!',
                rating: 5,
            },
            {
                name: 'Ana Costa',
                role: 'Empresária',
                quote: 'O guia me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.',
                rating: 5,
            },
            {
                name: 'Julia Santos',
                role: 'Designer',
                quote: 'Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!',
                rating: 5,
            },
        ],
    }), [offerPrice]);

    const value: ResultContextValue = {
        calculations,
        userProfile,
        scores,
        styleConfig,
        secondaryStyleNames,
        complementaryStyles,
        handleCTAClick,
        offerData,
        interpolateText: (template: string) => {
            const comp1 = complementaryStyles?.[0];
            const comp2 = complementaryStyles?.[1];
            const ctx = {
                // Dados do usuário
                username: userProfile.userName,
                userName: userProfile.userName,

                // Dados do estilo
                style: styleConfig?.name,
                styleName: styleConfig?.name,
                primaryStyle: styleConfig?.name,

                // Objetos aninhados
                user: { name: userProfile.userName },
                result: { styleName: styleConfig?.name },

                // Complementares em diferentes formas de acesso aos tokens
                comp1: comp1 ? { ...comp1, styleName: comp1.name } : undefined,
                comp2: comp2 ? { ...comp2, styleName: comp2.name } : undefined,
                complementary: complementaryStyles?.map(s => ({ ...s, styleName: s.name })) || [],

                // Aliases simples
                comp1Name: comp1?.name,
                comp2Name: comp2?.name,
                comp1Description: comp1?.description,
                comp2Description: comp2?.description,
                comp1Image: comp1?.imageUrl,
                comp2Image: comp2?.imageUrl,

                // CTAs - textos e URLs padrão
                ctaPrimaryText: 'Quero Transformar Meu Estilo Agora!',
                ctaPrimaryUrl: offerUrl,
                ctaSecondaryText: 'Conhecer a Metodologia Completa',
                ctaSecondaryUrl: offerUrl,

                calculations,
                styleConfig,
            };
            return interpolateUtil(template, ctx);
        },
    };

    return (
        <ResultContext.Provider value={value}>
            {children}
        </ResultContext.Provider>
    );
};

/**
 * Hook para consumir o ResultContext
 */
export const useResult = (): ResultContextValue => {
    const context = useContext(ResultContext);

    if (!context) {
        throw new Error('useResult deve ser usado dentro de ResultProvider');
    }

    return context;
};

/**
 * Hook opcional: retorna null quando não estiver dentro de um ResultProvider
 */
export const useResultOptional = (): ResultContextValue | null => {
    return useContext(ResultContext);
};
