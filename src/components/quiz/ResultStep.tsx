import { useEffect, useState } from 'react';
import { styleConfigGisele } from '../../data/styles';
import { resolveStyleId } from '@/utils/styleIds';
import type { QuizStep } from '../../data/quizSteps';
import type { QuizScores } from '../../hooks/useQuizState';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';
import { ShoppingCart, Lock, Star, Shield, Clock } from 'lucide-react';

// Componentes modulares
import {
    HeroSection,
    SocialProofSection,
    OfferSection,
    GuaranteeSection
} from './result';

interface ResultStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
        secondaryStyles: string[];
    };
    scores?: QuizScores;
}

/**
 * 🏆 PÁGINA UNIFICADA DE RESULTADO + OFERTA
 * 
 * Combina o resultado do quiz com a página de vendas numa experiência única
 */
export default function ResultStep({
    data,
    userProfile,
    scores
}: ResultStepProps) {
    // Estados para interatividade
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    // Verificação de segurança para o estilo
    let styleConfig = styleConfigGisele[userProfile.resultStyle];

    // Se não encontrar o estilo, usar o primeiro disponível como fallback
    if (!styleConfig) {
        console.warn(`⚠️ Estilo "${userProfile.resultStyle}" não encontrado, usando fallback`);
        const firstStyle = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstStyle];
    }

    // Hooks para imagens com fallback
    const styleImage = useImageWithFallback(styleConfig?.imageUrl, {
        width: 400,
        height: 300,
        fallbackText: styleConfig?.name || 'Estilo',
        fallbackBgColor: '#f8f9fa',
        fallbackTextColor: '#6b7280'
    });

    const guideImage = useImageWithFallback(styleConfig?.guideImageUrl, {
        width: 600,
        height: 400,
        fallbackText: `Guia ${styleConfig?.name || 'Estilo'}`,
        fallbackBgColor: '#f1f5f9',
        fallbackTextColor: '#64748b'
    });    // Scroll para o topo quando carregar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!styleConfig) {
        // Fallback silencioso: usar primeiro estilo definido para evitar mensagem de erro visual
        const firstKey = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstKey];
    }

    // Processar estilos com porcentagens para as barras de progresso
    const processStylesWithPercentages = () => {
        if (!scores) return [];

        // Converter QuizScores para array de entradas (internamente sem acento)
        // A ORDEM AQUI DEFINE O DESEMPATE: primeiro aparece = primeira escolha do usuário
        const scoresEntries = [
            ['natural', scores.natural],
            ['classico', scores.classico],
            ['contemporaneo', scores.contemporaneo],
            ['elegante', scores.elegante],
            ['romantico', scores.romantico],
            ['sexy', scores.sexy],
            ['dramatico', scores.dramatico],
            ['criativo', scores.criativo]
        ] as [string, number][];

        // Calcular total de pontos
        const totalPoints = scoresEntries.reduce((sum, [, score]) => sum + score, 0);
        if (totalPoints === 0) return [];

        // Ordenar estilos por pontuação e calcular porcentagens
        // DESEMPATE: mantém ordem original (índice menor = escolhido primeiro)
        return scoresEntries
            .map(([styleKey, score], originalIndex) => {
                const displayKey = resolveStyleId(styleKey); // chave canônica (acentuada se existir)
                return {
                    key: styleKey,
                    displayKey: displayKey,
                    name: styleConfigGisele[displayKey]?.name || displayKey,
                    score,
                    percentage: ((score / totalPoints) * 100),
                    originalIndex // Preserva ordem original para desempate
                };
            })
            .filter(style => style.score > 0)
            .sort((a, b) => {
                // Ordenar por pontuação (decrescente)
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                // Em caso de EMPATE: menor índice (escolhido primeiro) vem antes
                return a.originalIndex - b.originalIndex;
            })
            .slice(0, 3); // ✅ Mostrar apenas TOP 3 estilos
    };

    const stylesWithPercentages = processStylesWithPercentages();

    // Estilos secundários para fallback
    const secondaryStyleNames = userProfile.secondaryStyles
        .map(styleId => styleConfigGisele[styleId]?.name)
        .filter(Boolean)
        .join(' e ');

    // Função para lidar com o CTA
    const handleCTAClick = () => {
        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'checkout_initiated', {
                'event_category': 'ecommerce',
                'event_label': `CTA_Click_${userProfile.resultStyle}`,
                'value': 497.00
            });
        }

        // Link da oferta: 5 Passos – Vista-se de Você
        window.open('https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912', '_blank');
    };
    // Dados para a seção de oferta (componente modular)
    const offerFeatures = [
        { icon: '✅', label: '31 Aulas Online (Acesso Imediato)', value: 'R$ 297,00' },
        { icon: '✅', label: 'Bônus: Guia de Visagismo Facial (PDF)', value: 'R$ 67,00' },
        { icon: '✅', label: 'Bônus: Peças-Chave + Inventário', value: 'R$ 83,00' }
    ];

    const offerPricing = {
        current: 97,
        original: 447,
        installments: { quantity: 8, value: 14.11 },
        discount: 78
    };

    // Dados para a seção de prova social (componente modular)
    const testimonials = [
        {
            name: "Maria Silva",
            role: "Advogada",
            quote: "Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!",
            rating: 5
        },
        {
            name: "Ana Costa",
            role: "Empresária",
            quote: "O guia me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.",
            rating: 5
        },
        {
            name: "Julia Santos",
            role: "Designer",
            quote: "Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!",
            rating: 5
        }
    ]; discount: 78
};

return (
    <div className="min-h-screen bg-[#fffaf7] relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#a08966]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-3 sm:px-5 py-6 md:py-8 max-w-5xl relative z-10">

            {/* ====================== SEÇÃO 1: RESULTADO DO QUIZ ====================== */}
            <div className="bg-white p-5 sm:p-6 md:p-12 rounded-lg shadow-lg text-center mb-10 md:mb-12">
                {/* Celebração */}
                <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🎉</div>

                {/* Saudação Personalizada */}
                <p className="text-lg sm:text-xl text-gray-700 mb-2">
                    Olá, <span className="font-semibold text-[#B89B7A]">{userProfile.userName}</span>!
                </p>

                {/* Título com Hierarquia Clara */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#432818] mb-3">
                    Seu Estilo Predominante é:
                </h1>

                {/* Nome do Estilo */}
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#B89B7A] playfair-display mb-6 md:mb-8">
                    {styleConfig.name}
                </p>

                <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-start md:items-center">
                    {/* Coluna da Imagem */}
                    <div className="order-2 md:order-1">
                        <div className="max-w-sm mx-auto relative">
                            {styleImage.isLoading ? (
                                <div className="w-full h-auto rounded-lg shadow-md bg-gray-100 animate-pulse flex items-center justify-center min-h-[260px] sm:min-h-[300px] md:min-h-[300px]">
                                    <span className="text-gray-500">Carregando...</span>
                                </div>
                            ) : (
                                <div className="w-full aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                                    <img
                                        src={styleImage.src}
                                        alt={`Estilo ${styleConfig.name}`}
                                        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${styleImage.isFallback ? 'border-2 border-dashed border-gray-300' : ''}`}
                                        loading="eager"
                                    />
                                </div>
                            )}
                            {/* Cantos decorativos */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
                        </div>
                    </div>

                    {/* Coluna do Texto */}
                    <div className="order-1 md:order-2 text-left">
                        {/* Parágrafo Introdutório Emocional */}
                        <div className="mb-5 p-4 bg-gradient-to-br from-[#B89B7A]/5 to-[#a08966]/5 rounded-lg border-l-4 border-[#B89B7A]">
                            <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                                Esse é o estilo que mais traduz a sua essência.
                                Ele revela muito sobre como você se conecta com o mundo
                                e a forma como expressa sua energia.
                            </p>
                        </div>

                        {/* Description do styleConfig */}
                        <p className="text-sm sm:text-base md:text-lg mb-5 md:mb-6 text-gray-800 leading-relaxed tracking-normal">
                            {styleConfig.description}
                        </p>

                        {/* Transição para Estilos Complementares */}
                        <div className="mb-4 text-center">
                            <p className="text-base sm:text-lg font-semibold text-[#432818]">
                                Mas lembre-se: você não é só um estilo.
                            </p>
                        </div>

                        {/* Barras de Progresso ou Estilos Complementares */}
                        {stylesWithPercentages.length > 0 && (
                            <div className="mb-6 p-4 bg-[#B89B7A]/10 rounded-lg border border-[#B89B7A]/20">
                                <h4 className="font-semibold text-[#432818] mb-2 text-sm sm:text-base">
                                    Além do <span className="text-[#B89B7A]">{stylesWithPercentages[0].name}</span>, você também tem traços de:
                                </h4>
                                <div className="space-y-2 sm:space-y-3">
                                    {stylesWithPercentages.map((style, index) => (
                                        <div key={style.key} className="relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <span
                                                    className={`text-xs sm:text-sm font-medium ${index === 0 ? 'text-[#432818]' : 'text-gray-600'}`}
                                                >
                                                    {index === 0 && '👑 '}{style.name}
                                                </span>
                                                <span className="text-xs sm:text-sm text-[#B89B7A] font-medium">
                                                    {style.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0
                                                        ? 'bg-gradient-to-r from-[#B89B7A] to-[#a08966]'
                                                        : index === 1
                                                            ? 'bg-gradient-to-r from-[#B89B7A]/80 to-[#a08966]/80'
                                                            : 'bg-gradient-to-r from-[#B89B7A]/60 to-[#a08966]/60'
                                                        }`}
                                                    style={{
                                                        width: `${style.percentage}%`,
                                                        animationDelay: `${index * 0.2}s`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mensagem de Fechamento - Singularidade */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-[#B89B7A]/10 to-[#a08966]/10 rounded-lg text-center border border-[#B89B7A]/20">
                            <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                                <span className="text-lg mr-1">✨</span>
                                <span className="italic">É a mistura desses elementos que torna a sua imagem única.</span>
                            </p>
                        </div>

                        {/* Fallback para estilos secundários caso não haja scores */}
                        {stylesWithPercentages.length === 0 && secondaryStyleNames && (
                            <div className="mb-6 p-4 bg-[#B89B7A]/10 rounded-lg border border-[#B89B7A]/20">
                                <h4 className="font-semibold text-[#432818] mb-2">Estilos Complementares:</h4>
                                <p className="text-sm text-gray-700">
                                    Você também tem influências de: <span className="font-medium text-[#B89B7A]">{secondaryStyleNames}</span>
                                </p>
                            </div>
                        )}

                        {/* Keywords */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[#432818] mb-2 sm:mb-3">Palavras que te definem:</h4>
                            <div className="flex flex-wrap gap-2">
                                {(styleConfig.keywords || []).map((keyword: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-[#B89B7A] text-white text-sm rounded-full font-medium"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Perguntas Persuasivas (specialTips) */}
                        {styleConfig.specialTips && styleConfig.specialTips.length > 0 && (
                            <div className="mb-6 p-4 bg-gradient-to-br from-[#B89B7A]/5 to-[#a08966]/5 rounded-lg border border-[#B89B7A]/30">
                                <h4 className="font-semibold text-[#432818] mb-3 sm:mb-4 text-base sm:text-lg">
                                    💭 Você já se perguntou...
                                </h4>
                                <ul className="space-y-3">
                                    {styleConfig.specialTips.map((tip: string, index: number) => (
                                        <li key={index} className="text-sm sm:text-base text-gray-700 flex items-start leading-relaxed">
                                            <span className="text-[#B89B7A] mr-2 text-lg flex-shrink-0">❓</span>
                                            <span className="italic">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Texto de Transição + CTA Imediato (OTIMIZAÇÃO DE CONVERSÃO) */}
                        <div className="mb-8 text-center">
                            <div className="mb-6 p-5 bg-gradient-to-r from-[#B89B7A]/10 to-[#a08966]/10 rounded-lg border border-[#B89B7A]/20">
                                <p className="text-base sm:text-lg text-[#432818] font-semibold mb-2">
                                    <span className="text-2xl mr-2">💡</span>
                                    Decodifique sua Imagem de Sucesso em 5 Passos
                                </p>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Método completo: Autoconhecimento + estratégia visual 👇
                                </p>
                            </div>

                            {/* CTA Principal (MOVIDO PARA CIMA - após perguntas) */}
                            <button
                                onClick={handleCTAClick}
                                className="bg-gradient-to-r from-[#B89B7A] to-[#a08966] text-white py-4 px-8 rounded-lg shadow-xl transition-all duration-300 text-lg font-bold hover:scale-105 transform w-full sm:w-auto hover:shadow-2xl"
                                onMouseEnter={() => setIsButtonHovered(true)}
                                onMouseLeave={() => setIsButtonHovered(false)}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <ShoppingCart className={`w-6 h-6 transition-transform duration-300 ${isButtonHovered ? 'scale-110 animate-bounce' : ''}`} />
                                    Quero Destravar Minha Imagem
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Imagem do Guia (MOVIDA PARA BAIXO - após CTA) */}
                <div className="mt-6 md:mt-8 text-center">
                    {guideImage.isLoading ? (
                        <div className="mx-auto max-w-md w-full rounded-lg shadow-md bg-gray-100 animate-pulse flex items-center justify-center min-h-[320px] sm:min-h-[360px] md:min-h-[400px]">
                            <span className="text-gray-500">Carregando guia...</span>
                        </div>
                    ) : (
                        <div className="relative mx-auto max-w-md aspect-[4/5] rounded-lg overflow-hidden shadow-md w-[93%] sm:w-full">
                            <img
                                src={guideImage.src}
                                alt={`Guia de Estilo ${styleConfig.name}`}
                                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${guideImage.isFallback ? 'border-2 border-dashed border-gray-300' : ''}`}
                                loading="lazy"
                            />
                            {guideImage.isFallback && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-white text-center p-4">
                                        <p className="text-sm">📷 Imagem do guia será carregada em breve</p>
                                        <button
                                            onClick={guideImage.retry}
                                            className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
                                        >
                                            Tentar novamente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ====================== SEÇÃO 2: TRANSFORMAÇÃO E VALOR ====================== */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-lg mb-10 md:mb-12">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#432818] mb-5 md:mb-6 tracking-tight">
                        Transforme Sua Imagem, <span className="text-[#B89B7A]">Revele Sua Essência</span>
                    </h2>
                    <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg">
                        Seu estilo é uma ferramenta poderosa. Não se trata apenas de
                        roupas, mas de comunicar quem você é e aspira ser. Com a
                        orientação certa, você pode:
                    </p>

                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 max-w-4xl mx-auto mb-6 md:mb-8">
                        {[
                            { text: "Construir looks com intenção e identidade visual", icon: "🎯" },
                            { text: "Utilizar cores, modelagens e tecidos a seu favor", icon: "🎨" },
                            { text: "Alinhar sua imagem aos seus objetivos profissionais", icon: "💼" },
                            { text: "Desenvolver um guarda-roupa funcional e inteligente", icon: "👗" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center text-left p-4 bg-[#B89B7A]/5 rounded-lg">
                                <span className="text-2xl mr-4">{item.icon}</span>
                                <span className="text-gray-700">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ====================== SEÇÃO 3: PROVA SOCIAL ====================== */}
            <SocialProofSection
                title="Veja os Resultados de Quem Já Transformou Sua Imagem"
                testimonials={testimonials}
                stats={[]} // Sem stats por enquanto, apenas testimonials
            />

            {/* ====================== SEÇÃO 4: OFERTA E PREÇO ====================== */}
            <OfferSection
                title="Método 5 Passos – Vista-se de Você"
                subtitle="Por Gisele Galvão | Consultora de Imagem e Branding Pessoal"
                description="Autoconhecimento + estratégia visual para transformar sua imagem"
                features={offerFeatures}
                pricing={offerPricing}
                cta={{
                    text: "✨ Começar Minha Transformação Agora",
                    onClick: handleCTAClick
                }}
                countdown={{
                    enabled: false // Removido countdown - usando mensagem estática
                }}
                urgencyNote="⚡ Esta é uma oferta exclusiva para você que completou o diagnóstico"
                returnPriceNote="O preço volta para R$ 447,00 quando você sair desta página"
            />

            {/* ====================== SEÇÃO 5: GARANTIA ====================== */}
            <GuaranteeSection
                days={7}
                title="Garantia de Satisfação Total"
                description="Você tem 7 dias para testar o guia. Se não ficar 100% satisfeita, devolvemos seu investimento sem perguntas."
                urgencyNote="⚡ Esta é uma oferta exclusiva para você que completou o diagnóstico"
                returnPriceNote="O preço volta para R$ 447,00 quando você sair desta página"
            />
        </div>
    </div>
);