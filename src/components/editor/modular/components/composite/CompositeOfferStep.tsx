import React from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeOfferTestimonial {
    quote: string;
    author: string;
}

export interface CompositeOfferStepProps {
    title: string;
    subtitle?: string;
    description: string;
    userName?: string;
    resultStyle?: string;
    buttonText: string;
    image?: string;
    testimonial?: CompositeOfferTestimonial;
    price?: string;
    originalPrice?: string;
    benefits?: string[];
    ctaText?: string;
    secureNote?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    showEditableHint?: boolean;
}

const CompositeOfferStep: React.FC<CompositeOfferStepProps> = ({
    title,
    subtitle,
    description,
    userName = 'João',
    resultStyle = 'Clássico Elegante',
    buttonText,
    image,
    testimonial,
    price = '12x de R$ 97,00',
    originalPrice = 'De R$ 1.497,00',
    benefits = ['Acesso imediato ao método completo', 'Plano de ação personalizado', 'Suporte exclusivo por 30 dias'],
    ctaText = 'Oferta por tempo limitado',
    secureNote = 'Pagamento 100% seguro',
    backgroundColor = '#fffaf2',
    textColor = '#5b4135',
    accentColor = '#deac6d',
    showEditableHint = false,
}) => {
    const titleText = title.replace('{userName}', userName).replace('{resultStyle}', resultStyle);
    const subtitleText = (subtitle || '').replace('{userName}', userName).replace('{resultStyle}', resultStyle);
    const descriptionText = description.replace('{userName}', userName).replace('{resultStyle}', resultStyle);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false} className="py-12">
            <div className="bg-white rounded-xl shadow-2xl text-center max-w-5xl mx-auto overflow-hidden">
                <div
                    className="text-white p-8"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                    }}
                >
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-2xl md:text-3xl font-bold playfair-display leading-tight">
                        {titleText}
                    </h2>
                    {subtitle && (
                        <p className="mt-3 text-base md:text-lg" style={{ color: '#f8f4ef' }}>
                            {subtitleText}
                        </p>
                    )}
                </div>

                <div className="p-6 md:p-12" style={{ backgroundColor }}>
                    <p className="text-lg md:text-xl font-medium mb-8" style={{ color: textColor }}>
                        Transforme seu guarda-roupa e sua confiança com esta oferta exclusiva.
                    </p>

                    {image && (
                        <div className="mb-8 relative">
                            <img
                                src={image}
                                alt="Oferta Especial"
                                className="rounded-xl shadow-lg mx-auto w-full max-w-2xl"
                            />
                            {price && (
                                <div className="absolute top-4 right-4 bg-[#bd0000] text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide transform rotate-12 shadow-lg">
                                    Oferta Especial
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 rounded-xl mb-8 text-left">
                        <div className="flex items-start mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: accentColor }}>
                                <span className="text-white text-xl">💡</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-2" style={{ color: textColor }}>
                                    O que você vai receber:
                                </h3>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {descriptionText}
                                </p>
                            </div>
                        </div>
                    </div>

                    {testimonial && (
                        <div className="bg-gradient-to-r from-[#deac6d]/10 to-[#c49548]/10 p-6 rounded-xl mb-8 border" style={{ borderColor: `${accentColor}40` }}>
                            <div className="text-3xl mb-3">💬</div>
                            <blockquote className="text-base text-gray-700 italic mb-3 leading-relaxed">
                                "{testimonial.quote}"
                            </blockquote>
                            <cite className="font-semibold not-italic" style={{ color: textColor }}>
                                — {testimonial.author}
                            </cite>
                        </div>
                    )}

                    <div className="mb-8 p-4 rounded-lg border" style={{ borderColor: '#bd000020', backgroundColor: '#bd000010' }}>
                        <p className="font-bold text-sm uppercase tracking-wide mb-1" style={{ color: '#bd0000' }}>
                            ⏰ {ctaText}
                        </p>
                        <p className="text-gray-700 text-sm">
                            Esta oferta personalizada expira em breve. Garanta já a sua transformação!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="button"
                            className="block w-full md:w-auto mx-auto font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl text-lg uppercase tracking-wide"
                            style={{ backgroundColor: '#65c83a', color: '#ffffff' }}
                        >
                            {buttonText}
                        </button>

                        <div className="flex items-center justify-center text-gray-600 text-sm">
                            <span className="mr-2">🛡️</span>
                            <span>{secureNote}</span>
                        </div>
                    </div>

                    {(price || originalPrice) && (
                        <div className="mt-6 text-center">
                            {originalPrice && (
                                <p className="text-sm text-gray-500 line-through">{originalPrice}</p>
                            )}
                            {price && (
                                <p className="text-2xl font-bold" style={{ color: textColor }}>
                                    {price}
                                </p>
                            )}
                        </div>
                    )}

                    {benefits.length > 0 && (
                        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mb-2">{['📱', '🎓', '💎'][index % 3]}</div>
                                    <h4 className="font-semibold text-sm" style={{ color: textColor }}>
                                        {benefit}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    )}

                    {showEditableHint && (
                        <p className="text-xs text-blue-500 mt-6">
                            ✏️ Editável via Painel de Propriedades
                        </p>
                    )}
                </div>
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeOfferStep;
