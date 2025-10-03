import React from 'react';
import type { EditableQuizStep } from '@/types/EditableQuizStep';
import QuizEstiloWrapper from './QuizEstiloWrapper';

interface EditorOfferStepProps {
    data: EditableQuizStep;
    userProfile?: {
        userName: string;
        resultStyle: string;
        secondaryStyles?: string[];
    };
    offerKey?: string;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * 🎁 OFFER STEP COM DESIGN DO /QUIZ-ESTILO
 * 
 * Versão para o editor que replica o visual exato do quiz de produção
 */
export default function EditorOfferStep({
    data,
    userProfile,
    offerKey = 'default',
    onEdit,
    isEditable = false
}: EditorOfferStepProps) {

    // Dados seguros com fallbacks
    const safeData = {
        title: data.title || 'Oferta Especial Para Você!',
        subtitle: data.subtitle || 'Consultoria de Imagem Personalizada',
        userName: userProfile?.userName || 'João',
        resultStyle: userProfile?.resultStyle || 'Clássico Elegante',
        description: data.description || 'Aprenda a valorizar seu estilo único com nossa consultoria especializada.',
        price: data.price || 'R$ 497,00',
        originalPrice: data.originalPrice || 'R$ 997,00',
        benefits: data.benefits || [
            'Análise completa do seu estilo',
            'Guia personalizado de cores',
            'Dicas de combinações exclusivas',
            'Suporte por 30 dias'
        ],
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'
    };

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false}>
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                {/* Título personalizado */}
                <h1
                    className="text-2xl md:text-3xl font-bold text-[#432818] mb-2"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    {safeData.userName}, agora que você descobriu que é
                </h1>

                <div className="bg-gradient-to-r from-[#B89B7A] to-[#A1835D] text-white p-4 rounded-lg mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">
                        {safeData.resultStyle}
                    </h2>
                </div>

                <h3 className="text-xl text-[#432818] font-semibold mb-8">
                    {safeData.title}
                </h3>

                {/* Imagem da oferta */}
                <div className="w-full max-w-sm mx-auto mb-6">
                    <img
                        src={safeData.image}
                        alt="Consultoria de Imagem"
                        className="w-full h-auto rounded-lg shadow-sm"
                    />
                </div>

                {/* Descrição */}
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    {safeData.description}
                </p>

                {/* Benefícios */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h4 className="text-lg font-semibold text-[#432818] mb-4">
                        O que você vai receber:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {safeData.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                <p className="text-sm text-[#432818]">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preços */}
                <div className="bg-gradient-to-br from-[#B89B7A] to-[#A1835D] text-white p-6 rounded-lg mb-8">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <span className="text-lg line-through opacity-75">{safeData.originalPrice}</span>
                        <span className="text-3xl font-bold">{safeData.price}</span>
                    </div>
                    <p className="text-sm opacity-90">Oferta especial por tempo limitado</p>
                </div>

                {/* Call to Action */}
                <button className="bg-[#432818] hover:bg-[#2d1a10] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 mb-4">
                    Quero Minha Consultoria Agora!
                </button>

                <p className="text-xs text-gray-500 mb-4">
                    🔒 Compra 100% segura • Garantia de 7 dias
                </p>

                {isEditable && (
                    <p className="text-xs text-blue-500">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}
            </div>
        </QuizEstiloWrapper>
    );
}