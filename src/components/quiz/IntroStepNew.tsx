'use client';

import React, { useState, useEffect } from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface IntroStepProps {
    data: QuizStep;
    onNameSubmit: (name: string) => void;
}

/**
 * QuizIntro - Componente baseado exatamente no modelo fornecido
 * Implementação fiel ao design da Etapa 1
 */
export default function IntroStep({ data, onNameSubmit }: IntroStepProps) {
    const [nome, setNome] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!nome.trim()) {
            setError('Por favor, digite seu nome para continuar');
            return;
        }

        setError('');
        onNameSubmit(nome);

        if (typeof window !== 'undefined' && 'performance' in window) {
            window.performance.mark('user-interaction');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && 'performance' in window) {
            window.performance.mark('component-mounted');
        }

        const reportLcpRendered = () => {
            if (typeof window !== 'undefined' && (window as any).QUIZ_PERF) {
                (window as any).QUIZ_PERF.mark('lcp_rendered');
            }
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(reportLcpRendered);
        });
    }, []);

    const logoUrls = {
        webp: 'https://res.cloudinary.com/der8kogzu/image/upload/f_webp,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.webp',
        png: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
    };

    const imageUrls = {
        avif: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        webp: 'https://res.cloudinary.com/der8kogzu/image/upload/f_webp,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.webp',
        png: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    };

    return (
        <main
            className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
            data-section="intro"
        >
            {/* Skip link para acessibilidade */}
            <a
                href="#quiz-form"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#432818] px-4 py-2 rounded-md shadow-md"
            >
                Pular para o formulário
            </a>

            <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
                {/* Logo centralizado */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                        <picture>
                            <source srcSet={logoUrls.webp} type="image/webp" />
                            <img
                                src={logoUrls.png}
                                alt="Logo Gisele Galvão"
                                className="h-auto mx-auto"
                                width={120}
                                height={50}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                style={{
                                    objectFit: 'contain',
                                    maxWidth: '120px',
                                    aspectRatio: '120 / 50',
                                }}
                            />
                        </picture>
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

                {/* Título principal */}
                <h1
                    className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 400,
                    }}
                >
                    <span style={{ color: '#B89B7A', fontWeight: 700 }}>Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com{' '}
                    <span style={{ color: '#B89B7A', fontWeight: 700 }}>Você</span>.
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
                        <div className="relative w-full h-full bg-[#F8F5F0]">
                            <picture>
                                <source srcSet={imageUrls.avif} type="image/avif" />
                                <source srcSet={imageUrls.webp} type="image/webp" />
                                <img
                                    src={data.image || imageUrls.png}
                                    alt="Descubra seu estilo predominante e transforme seu guarda-roupa"
                                    className="w-full h-full object-contain"
                                    width={300}
                                    height={204}
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    id="lcp-image"
                                    style={{
                                        maxWidth: '300px',
                                        maxHeight: '204px',
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </picture>
                        </div>
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
                <div id="quiz-form" className="mt-8">
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
                                NOME <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder={data.placeholder || "Digite seu nome"}
                                value={nome}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setNome(e.target.value);
                                    if (error) setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                className={`w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-offset-2 focus:ring-offset-[#FEFEFE] focus-visible:ring-offset-[#FEFEFE] ${error
                                        ? "border-red-500 focus:ring-red-500 focus-visible:ring-red-500"
                                        : "border-[#B89B7A] focus:ring-[#A1835D] focus-visible:ring-[#A1835D]"
                                    }`}
                                autoFocus
                                aria-required="true"
                                autoComplete="off"
                                inputMode="text"
                                maxLength={32}
                                aria-invalid={!!error}
                                aria-describedby={error ? "name-error" : undefined}
                                required
                            />
                            {error && (
                                <p id="name-error" className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={`w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 sm:py-3 sm:px-4 sm:text-base md:py-3.5 md:text-lg ${nome.trim()
                                    ? 'bg-[#B89B7A] text-white hover:bg-[#A1835D] active:bg-[#947645] hover:shadow-lg transform hover:scale-[1.01]'
                                    : 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed'
                                }`}
                            aria-disabled={!nome.trim()}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {nome.trim() ? (data.buttonText || 'Quero Descobrir meu Estilo Agora!') : 'Digite seu nome para continuar'}
                            </span>
                        </button>

                        <p className="text-xs text-center text-gray-500 pt-1">
                            Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa{' '}
                            <a
                                href="#"
                                className="text-[#B89B7A] hover:text-[#A1835D] underline focus:outline-none focus:ring-1 focus:ring-[#B89B7A] rounded"
                            >
                                política de privacidade
                            </a>
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
        </main>
    );
}