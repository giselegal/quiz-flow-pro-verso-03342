import { useEffect, useState } from 'react';
import { styleConfigGisele } from '../../data/styles';
import { resolveStyleId } from '@/utils/styleIds';
import type { QuizStep } from '../../data/quizSteps';
import type { QuizScores } from '../../hooks/useQuizState';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';
import { ShoppingCart, Lock, Star, Shield, Clock } from 'lucide-react';

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
        return (
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                <div className="text-red-500 text-xl">
                    ❌ Erro: Nenhum estilo disponível. Reinicie o quiz.
                </div>
            </div>
        );
    }

    // Processar estilos com porcentagens para as barras de progresso
    const processStylesWithPercentages = () => {
        if (!scores) return [];

        // Converter QuizScores para array de entradas (internamente sem acento)
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
        return scoresEntries
            .map(([styleKey, score]) => {
                const displayKey = resolveStyleId(styleKey); // chave canônica (acentuada se existir)
                return {
                    key: styleKey,
                    displayKey: displayKey,
                    name: styleConfigGisele[displayKey]?.name || displayKey,
                    score,
                    percentage: ((score / totalPoints) * 100)
                };
            })
            .filter(style => style.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Mostrar apenas os top 5
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
                'event_label': `CTA_Click_${userProfile.resultStyle}`
            });
        }

        // Aqui você pode adicionar o link real de checkout
        window.open('https://pay.hotmart.com/seu-link-aqui', '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fffaf7] to-[#faf5f0] relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#deac6d]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#c19952]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">

                {/* ====================== SEÇÃO 1: RESULTADO DO QUIZ ====================== */}
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center mb-12">
                    {/* Celebração */}
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>

                    {/* Título Principal */}
                    <h1 className="text-3xl md:text-4xl font-bold playfair-display mb-2 text-[#deac6d]">
                        {data.title?.replace('{userName}', userProfile.userName)}
                    </h1>

                    {/* Nome do Estilo */}
                    <p className="text-2xl md:text-3xl font-bold text-[#5b4135] playfair-display mb-8">
                        {styleConfig.name}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Coluna da Imagem */}
                        <div className="order-2 md:order-1">
                            <div className="max-w-sm mx-auto relative">
                                {styleImage.isLoading ? (
                                    <div className="w-full h-auto rounded-lg shadow-md bg-gray-100 animate-pulse flex items-center justify-center min-h-[300px]">
                                        <span className="text-gray-500">Carregando...</span>
                                    </div>
                                ) : (
                                    <img
                                        src={styleImage.src}
                                        alt={`Estilo ${styleConfig.name}`}
                                        className={`w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ${styleImage.isFallback ? 'border-2 border-dashed border-gray-300' : ''
                                            }`}
                                        loading="eager"
                                    />
                                )}
                                {/* Cantos decorativos */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#deac6d]"></div>
                                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#deac6d]"></div>
                            </div>
                        </div>

                        {/* Coluna do Texto */}
                        <div className="order-1 md:order-2 text-left">
                            <h3 className="text-xl font-bold text-[#5b4135] mb-4">Seu Perfil de Estilo:</h3>
                            <p className="text-base md:text-lg mb-6 text-gray-800 leading-relaxed">
                                {styleConfig.description}
                            </p>

                            {/* Barras de Progresso ou Estilos Complementares */}
                            {stylesWithPercentages.length > 0 && (
                                <div className="mb-6 p-4 bg-[#deac6d]/10 rounded-lg border border-[#deac6d]/20">
                                    <h4 className="font-semibold text-[#5b4135] mb-4">Seu Perfil de Estilos:</h4>
                                    <div className="space-y-3">
                                        {stylesWithPercentages.map((style, index) => (
                                            <div key={style.key} className="relative">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span
                                                        className={`text-sm font-medium ${index === 0
                                                            ? 'text-[#5b4135]'
                                                            : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {index === 0 && '👑 '}{style.name}
                                                    </span>
                                                    <span className="text-sm text-[#deac6d] font-medium">
                                                        {style.percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0
                                                            ? 'bg-gradient-to-r from-[#deac6d] to-[#c19952]'
                                                            : index === 1
                                                                ? 'bg-gradient-to-r from-[#deac6d]/80 to-[#c19952]/80'
                                                                : 'bg-gradient-to-r from-[#deac6d]/60 to-[#c19952]/60'
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

                            {/* Fallback para estilos secundários caso não haja scores */}
                            {stylesWithPercentages.length === 0 && secondaryStyleNames && (
                                <div className="mb-6 p-4 bg-[#deac6d]/10 rounded-lg border border-[#deac6d]/20">
                                    <h4 className="font-semibold text-[#5b4135] mb-2">Estilos Complementares:</h4>
                                    <p className="text-sm text-gray-700">
                                        Você também tem influências de: <span className="font-medium text-[#deac6d]">{secondaryStyleNames}</span>
                                    </p>
                                </div>
                            )}

                            {/* Keywords */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-[#5b4135] mb-3">Palavras que te definem:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(styleConfig.keywords || []).map((keyword: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[#deac6d] text-white text-sm rounded-full font-medium"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imagem do Guia */}
                    <div className="mt-8 text-center">
                        {guideImage.isLoading ? (
                            <div className="mx-auto max-w-md w-full rounded-lg shadow-md bg-gray-100 animate-pulse flex items-center justify-center min-h-[400px]">
                                <span className="text-gray-500">Carregando guia...</span>
                            </div>
                        ) : (
                            <div className="relative mx-auto max-w-md">
                                <img
                                    src={guideImage.src}
                                    alt={`Guia de Estilo ${styleConfig.name}`}
                                    className={`mx-auto max-w-md w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ${guideImage.isFallback ? 'border-2 border-dashed border-gray-300' : ''
                                        }`}
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
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-12">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#5b4135] mb-6">
                            Transforme Sua Imagem, <span className="text-[#deac6d]">Revele Sua Essência</span>
                        </h2>
                        <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto text-lg">
                            Seu estilo é uma ferramenta poderosa. Não se trata apenas de
                            roupas, mas de comunicar quem você é e aspira ser. Com a
                            orientação certa, você pode:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                            {[
                                { text: "Construir looks com intenção e identidade visual", icon: "🎯" },
                                { text: "Utilizar cores, modelagens e tecidos a seu favor", icon: "🎨" },
                                { text: "Alinhar sua imagem aos seus objetivos profissionais", icon: "💼" },
                                { text: "Desenvolver um guarda-roupa funcional e inteligente", icon: "👗" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center text-left p-4 bg-[#deac6d]/5 rounded-lg">
                                    <span className="text-2xl mr-4">{item.icon}</span>
                                    <span className="text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Primeiro CTA */}
                        <button
                            onClick={handleCTAClick}
                            className="bg-gradient-to-r from-[#deac6d] to-[#c19952] text-white py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg font-semibold hover:scale-105 transform"
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                        >
                            <span className="flex items-center justify-center gap-3">
                                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                                Quero Transformar Minha Imagem
                            </span>
                        </button>
                    </div>
                </div>

                {/* ====================== SEÇÃO 3: PROVA SOCIAL ====================== */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-12">
                    <h3 className="text-2xl font-bold text-center text-[#5b4135] mb-8">
                        Veja os Resultados de Quem Já Transformou Sua Imagem
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Maria Silva",
                                role: "Advogada",
                                text: "Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!",
                                rating: 5
                            },
                            {
                                name: "Ana Costa",
                                role: "Empresária",
                                text: "O guia me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.",
                                rating: 5
                            },
                            {
                                name: "Julia Santos",
                                role: "Designer",
                                text: "Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!",
                                rating: 5
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-[#deac6d]/5 p-6 rounded-lg">
                                <div className="flex mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#deac6d] text-[#deac6d]" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-semibold text-[#5b4135]">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ====================== SEÇÃO 4: OFERTA E PREÇO ====================== */}
                <div className="bg-gradient-to-br from-[#deac6d]/10 to-[#c19952]/5 p-6 md:p-8 rounded-lg shadow-lg mb-12 border-2 border-[#deac6d]/20">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#5b4135] mb-4">
                            O Guia de Estilo Completo
                        </h2>
                        <p className="text-lg text-gray-700 mb-8">Especialmente criado para o seu estilo {styleConfig.name}</p>

                        {/* Countdown de urgência */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-2 text-red-600">
                                <Clock className="w-5 h-5" />
                                <span className="font-semibold">Oferta expira ao sair desta página</span>
                            </div>
                        </div>

                        {/* Componentes de valor */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-[#deac6d]/20 max-w-lg mx-auto mb-8">
                            <h4 className="text-xl font-semibold text-[#5b4135] mb-4">O Que Você Recebe Hoje</h4>

                            <div className="space-y-3 mb-6 text-left">
                                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                                    <span>✅ Guia Principal de Estilo {styleConfig.name}</span>
                                    <span className="font-medium">R$ 79,00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                                    <span>✅ Bônus: Peças-chave do seu tipo</span>
                                    <span className="font-medium">R$ 67,00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                                    <span>✅ Bônus: Guia de Cores Personalizadas</span>
                                    <span className="font-medium">R$ 49,00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 pt-4 font-bold text-lg border-t-2 border-[#deac6d]">
                                    <span>Valor Total</span>
                                    <div className="relative">
                                        <span className="line-through text-gray-500">R$ 195,00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <p className="text-green-700 uppercase font-bold text-sm mb-2">OFERTA ESPECIAL {styleConfig.name.toUpperCase()}</p>
                                <p className="text-4xl font-bold text-green-600 mb-1">R$ 39,00</p>
                                <p className="text-sm text-gray-600">ou 5x de R$ 8,83</p>
                                <div className="mt-3">
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        🔥 80% de desconto - HOJE APENAS
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Principal */}
                        <button
                            onClick={handleCTAClick}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-6 px-8 rounded-lg shadow-xl transition-all duration-300 text-xl font-bold hover:scale-105 transform mb-4"
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                        >
                            <span className="flex items-center justify-center gap-3">
                                <ShoppingCart className={`w-6 h-6 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                                GARANTIR MEU GUIA {styleConfig.name.toUpperCase()} AGORA
                            </span>
                        </button>

                        {/* Elementos de segurança */}
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mt-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>Compra Segura</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-green-500" />
                                <span>Dados Protegidos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====================== SEÇÃO 5: GARANTIA ====================== */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-[#5b4135] mb-4">
                            Garantia de Satisfação Total
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Você tem <strong>7 dias</strong> para testar o guia. Se não ficar 100% satisfeita,
                                devolvemos seu investimento sem perguntas.
                            </p>
                        </div>

                        <p className="text-[#deac6d] font-semibold">
                            ⚡ Esta é uma oferta exclusiva para o seu estilo {styleConfig.name}
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            O preço volta para R$ 195,00 quando você sair desta página
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}