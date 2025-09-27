'use client';

import React, { useState } from 'react';

/**
 * 🎯 ETAPA 2 - PRIMEIRA PERGUNTA DO QUIZ
 * 
 * Componente direto para a primeira pergunta sobre estilo pessoal
 */

interface Step2DirectProps {
    userName: string;
    onAnswer: (answer: string) => void;
}

export default function Step2Direct({ userName, onAnswer }: Step2DirectProps) {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const options = [
        {
            id: 'natural',
            text: 'Conforto e praticidade em primeiro lugar',
            description: 'Prefiro roupas confortáveis e funcionais no dia a dia'
        },
        {
            id: 'elegante',
            text: 'Sofisticação e elegância',
            description: 'Gosto de looks mais elaborados e refinados'
        },
        {
            id: 'contemporaneo',
            text: 'Tendências e modernidade',
            description: 'Sempre atenta às últimas tendências da moda'
        },
        {
            id: 'classico',
            text: 'Tradição e atemporalidade',
            description: 'Prefiro peças clássicas que nunca saem de moda'
        }
    ];

    const handleSubmit = () => {
        if (selectedOption && !isSubmitting) {
            setIsSubmitting(true);
            console.log('✅ STEP 2: Resposta selecionada:', selectedOption);

            setTimeout(() => {
                onAnswer(selectedOption);
                setIsSubmitting(false);
            }, 300);
        }
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
                {/* Header com saudação personalizada */}
                <header className="text-center space-y-4">
                    <div className="h-[3px] bg-[#B89B7A] rounded-full mx-auto" style={{ width: '200px' }} />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#432818]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Oi, <span className="text-[#B89B7A]">{userName}</span>! 👋
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Vamos começar descobrindo suas preferências de estilo...
                    </p>
                </header>

                {/* Pergunta */}
                <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-center text-[#432818]">
                        O que mais representa você no dia a dia?
                    </h2>

                    {/* Opções */}
                    <div className="space-y-3">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedOption(option.id)}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${selectedOption === option.id
                                        ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-[#B89B7A]/50 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${selectedOption === option.id
                                            ? 'border-[#B89B7A] bg-[#B89B7A]'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedOption === option.id && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#432818]">{option.text}</p>
                                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Botão de continuar */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedOption || isSubmitting}
                        className={`w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 ${selectedOption && !isSubmitting
                                ? 'bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg'
                                : 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                            </span>
                        ) : (
                            'Continuar ➡️'
                        )}
                    </button>
                </section>

                {/* Indicador de progresso */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">Etapa 2 de 21</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div className="bg-[#B89B7A] h-1 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                </div>
            </div>
        </main>
    );
}