import { styleConfigGisele } from '../../data/styles';
import type { QuizStep } from '../../data/quizSteps';

interface OfferStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
    };
    offerKey: string;
}

/**
 * 🎁 COMPONENTE DE OFERTA PERSONALIZADA
 * 
 * Exibe a oferta final personalizada (etapa 21) baseada nas respostas
 * estratégicas do usuário, com call-to-action otimizado.
 */
export default function OfferStep({
    data,
    userProfile,
    offerKey
}: OfferStepProps) {
    const offerContent = data.offerMap?.[offerKey];

    if (!offerContent) {
        return (
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                <div className="text-red-500 text-xl">
                    ❌ Erro: Oferta não encontrada para a chave "{offerKey}".
                </div>
            </div>
        );
    }

    // Verificação de segurança para o estilo
    let styleConfig = styleConfigGisele[userProfile.resultStyle];

    // Se não encontrar o estilo, usar o primeiro disponível como fallback
    if (!styleConfig) {
        console.warn(`⚠️ Estilo "${userProfile.resultStyle}" não encontrado no OfferStep, usando fallback`);
        const firstStyle = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstStyle];
    }

    const guideImage = styleConfig?.guideImage || data.image;

    return (
        <div className="bg-white rounded-xl shadow-2xl text-center max-w-5xl mx-auto overflow-hidden">
            {/* Header com Gradiente */}
            <div className="bg-gradient-to-r from-[#deac6d] to-[#c49548] text-white p-8">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl md:text-3xl font-bold playfair-display leading-tight">
                    {offerContent.title.replace('{userName}', userProfile.userName)}
                </h2>
            </div>

            {/* Conteúdo Principal */}
            <div className="p-6 md:p-12">
                <p className="text-lg md:text-xl font-medium mb-8 text-[#5b4135] leading-relaxed">
                    Transforme seu guarda-roupa e sua confiança com esta oferta exclusiva.
                </p>

                {/* Imagem do Guia */}
                {guideImage && (
                    <div className="mb-8 relative">
                        <img
                            src={guideImage}
                            alt="Oferta Especial - Guia de Estilo"
                            className="rounded-xl shadow-lg mx-auto w-full max-w-2xl"
                        />
                        {/* Badge de Desconto */}
                        <div className="absolute top-4 right-4 bg-[#bd0000] text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide transform rotate-12 shadow-lg">
                            Oferta Especial
                        </div>
                    </div>
                )}

                {/* Descrição da Oferta */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 rounded-xl mb-8 text-left">
                    <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-[#deac6d] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-white text-xl">💡</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-[#5b4135] mb-2">O que você vai receber:</h3>
                            <p className="text-base text-gray-700 leading-relaxed">{offerContent.description}</p>
                        </div>
                    </div>
                </div>

                {/* Depoimento */}
                <div className="bg-gradient-to-r from-[#deac6d]/10 to-[#c49548]/10 p-6 rounded-xl mb-8 border border-[#deac6d]/20">
                    <div className="text-3xl mb-3">💬</div>
                    <blockquote className="text-base text-gray-700 italic mb-3 leading-relaxed">
                        "{offerContent.testimonial.quote}"
                    </blockquote>
                    <cite className="font-semibold text-[#5b4135] not-italic">
                        — {offerContent.testimonial.author}
                    </cite>
                </div>

                {/* Urgência e Escassez */}
                <div className="mb-8 p-4 bg-[#bd0000]/10 border border-[#bd0000]/20 rounded-lg">
                    <p className="text-[#bd0000] font-bold text-sm uppercase tracking-wide mb-1">
                        ⏰ Oferta por tempo limitado
                    </p>
                    <p className="text-gray-700 text-sm">
                        Esta oferta personalizada expira em breve. Garante já a sua transformação!
                    </p>
                </div>

                {/* Call-to-Action */}
                <div className="space-y-4">
                    <a
                        href="#"
                        className="block bg-[#65c83a] hover:bg-[#5ab532] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl text-lg uppercase tracking-wide no-underline"
                    >
                        {offerContent.buttonText}
                    </a>

                    {/* Garantia */}
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                        <span className="mr-2">🛡️</span>
                        <span>Satisfação 100% garantida ou seu dinheiro de volta</span>
                    </div>
                </div>

                {/* Benefícios Adicionais */}
                <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-semibold text-[#5b4135] text-sm">Acesso Imediato</h4>
                        <p className="text-xs text-gray-600">Receba tudo por email agora</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">🎓</div>
                        <h4 className="font-semibold text-[#5b4135] text-sm">Método Exclusivo</h4>
                        <p className="text-xs text-gray-600">Baseado em seu resultado</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">💎</div>
                        <h4 className="font-semibold text-[#5b4135] text-sm">Conteúdo Premium</h4>
                        <p className="text-xs text-gray-600">Criado por especialistas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}