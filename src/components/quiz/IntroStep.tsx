'use client';

import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface IntroStepProps {
    data: QuizStep;
    onNameSubmit?: (name: string) => void; // Tornado opcional para evitar crash em cenários de uso incorreto
}

export default function IntroStep({ data, onNameSubmit }: IntroStepProps) {
    const [nome, setNome] = useState('');

    // 🔍 DEBUG: Vamos ver exatamente o que está chegando
    console.log('🔍 IntroStepSimple - data recebido:', JSON.stringify(data, null, 2));
    console.log('🔍 IntroStepSimple - data existe?', !!data);
    console.log('🔍 IntroStepSimple - data.title:', data?.title);

    // 🚨 FALLBACK TOTAL se data não existir
    const safeData = data || {
        type: 'intro',
        title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!nome.trim()) return;

        if (typeof onNameSubmit === 'function') {
            try {
                onNameSubmit(nome.trim());
            } catch (err) {
                console.error('❌ [IntroStep] Erro ao executar onNameSubmit:', err);
            }
        } else {
            // Evita quebra total do funil e ajuda a diagnosticar ambiente onde a prop veio incorreta
            console.warn('⚠️ [IntroStep] onNameSubmit ausente ou não é função. Valor recebido:', onNameSubmit);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <main
            className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
            data-section="intro"
        >
            <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                        <img
                            src="https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png"
                            alt="Logo Gisele Galvão"
                            className="h-auto mx-auto"
                            width={132}
                            height={55}
                            style={{
                                objectFit: 'contain',
                                maxWidth: '132px',
                                aspectRatio: '132 / 55',
                            }}
                        />
                        {/* Barra dourada */}
                        <div
                            className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto"
                            style={{
                                width: '300px',
                                maxWidth: '90%',
                            }}
                        />
                    </div>
                </div>

                {/* Título principal - SEMPRE RENDERIZAR */}
                <h1
                    className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 400,
                    }}
                >
                    {safeData.title ? (
                        <span dangerouslySetInnerHTML={{ __html: safeData.title }} />
                    ) : (
                        <>
                            <span style={{ color: '#B89B7A', fontWeight: 700 }}>Chega</span> de um guarda-roupa lotado e da sensação de que{' '}
                            <span style={{ color: '#B89B7A', fontWeight: 700 }}>nada combina com você</span>.
                        </>
                    )}
                </h1>
            </header>

            <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
                {/* Imagem principal */}
                <div className="mt-2 w-full mx-auto flex justify-center">
                    <div
                        className="overflow-hidden rounded-lg shadow-sm"
                        style={{
                            aspectRatio: '1.47',
                            maxHeight: '204px',
                            width: '100%',
                            maxWidth: '300px'
                        }}
                    >
                        <img
                            src={safeData.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'}
                            alt="Descubra seu estilo predominante"
                            className="w-full h-full object-contain"
                            width={300}
                            height={204}
                            style={{
                                maxWidth: '300px',
                                maxHeight: '204px',
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>

                {/* Texto descritivo */}
                <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">
                    Em poucos minutos, descubra seu{' '}
                    <span className="font-semibold text-[#B89B7A]">
                        Estilo Predominante
                    </span>{' '}
                    — e aprenda a montar looks que realmente refletem sua{' '}
                    <span className="font-semibold text-[#432818]">
                        essência
                    </span>, com
                    praticidade e{' '}
                    <span className="font-semibold text-[#432818]">
                        confiança
                    </span>.
                </p>

                {/* Formulário */}
                <div className="mt-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full space-y-6"
                        autoComplete="off"
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-xs font-semibold text-[#432818] mb-1.5"
                            >
                                {safeData.formQuestion || 'NOME'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder={safeData.placeholder || "Digite seu nome"}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 border-[#B89B7A] focus:outline-none focus:ring-2 focus:ring-[#A1835D]"
                                autoFocus
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={`w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 ${nome.trim()
                                ? 'bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg'
                                : 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed'
                                }`}
                            disabled={!nome.trim()}
                        >
                            {safeData.buttonText || 'Quero Descobrir meu Estilo Agora!'}
                        </button>

                        <p className="text-xs text-center text-gray-500 pt-1">
                            Seu nome é necessário para personalizar sua experiência.
                        </p>
                    </form>
                </div>
            </section>

            {/* Rodapé */}
            <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
                </p>
            </footer>

            {/* Debug overlay removido para produção */}
        </main>
    );
}
