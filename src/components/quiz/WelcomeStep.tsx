'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { QuizStep } from '../../data/quizSteps';

/**
 * 🏠 WELCOME STEP
 * 
 * Step de boas-vindas personalizado com features avançadas:
 * - Animações com Framer Motion
 * - Scroll progress bar
 * - Detecção de leitura completa
 * - Checkbox de confirmação
 * - Validações robustas
 * - Fallbacks de dados
 */

interface WelcomeStepProps {
    data: QuizStep;
    userName?: string;
    onContinue?: () => void;
}

export default function WelcomeStep({ data, userName, onContinue }: WelcomeStepProps) {
    // ============================================================================
    // ESTADO LOCAL
    // ============================================================================
    const [isReady, setIsReady] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // ============================================================================
    // FALLBACK DE DADOS (PROTEÇÃO CRÍTICA)
    // ============================================================================
    const safeData = data || {
        type: 'welcome',
        title: 'Bem-vindo(a) ao Quiz!',
        subtitle: 'Vamos começar a descobrir seu estilo',
        description: 'Este quiz foi desenvolvido especialmente para você.',
        buttonText: 'Começar Agora',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        accentColor: '#B89B7A',
        features: [
            '✨ Descoberta do seu estilo único',
            '🎨 Recomendações personalizadas',
            '💡 Insights sobre suas preferências',
            '🚀 Resultado em 3 minutos'
        ]
    };

    // ============================================================================
    // EFEITOS
    // ============================================================================

    // Detectar scroll para ativar checkbox
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            setScrollProgress(progress);

            // Se rolou mais de 80%, considera que leu tudo
            if (progress > 80 && !hasRead) {
                setHasRead(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Chamar uma vez ao montar

        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasRead]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleContinue = () => {
        console.log('🎯 [WelcomeStep] Avançando...');

        if (typeof onContinue === 'function') {
            try {
                onContinue();
            } catch (err) {
                console.error('❌ [WelcomeStep] Erro ao executar onContinue:', err);
            }
        } else {
            console.warn('⚠️ [WelcomeStep] onContinue não fornecido');
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsReady(checked);
        console.log('✅ [WelcomeStep] Checkbox:', checked ? 'Marcado' : 'Desmarcado');
    };

    // ============================================================================
    // ANIMAÇÕES (Framer Motion)
    // ============================================================================

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    // ============================================================================
    // RENDERIZAÇÃO
    // ============================================================================

    return (
        <main
            className="min-h-screen relative"
            style={{
                backgroundColor: safeData.backgroundColor,
                color: safeData.textColor
            }}
        >
            {/* Barra de progresso de scroll */}
            <div
                className="fixed top-0 left-0 h-1 z-50 transition-all duration-200"
                style={{
                    width: `${scrollProgress}%`,
                    backgroundColor: safeData.accentColor,
                    boxShadow: scrollProgress > 0 ? '0 0 10px rgba(184, 155, 122, 0.5)' : 'none'
                }}
            />

            {/* Container principal */}
            <motion.div
                className="flex flex-col items-center justify-center px-4 py-12 md:py-16 max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Saudação personalizada */}
                {userName && (
                    <motion.div
                        className="text-center mb-6"
                        variants={itemVariants}
                    >
                        <p className="text-lg md:text-xl font-medium" style={{ color: safeData.accentColor }}>
                            Olá, {userName}! 👋
                        </p>
                    </motion.div>
                )}

                {/* Imagem principal */}
                {safeData.image && (
                    <motion.div
                        className="w-full max-w-2xl mb-8"
                        variants={itemVariants}
                    >
                        <img
                            src={safeData.image}
                            alt={safeData.title}
                            className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                            style={{ maxHeight: '400px' }}
                        />
                    </motion.div>
                )}

                {/* Título principal */}
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        color: safeData.accentColor,
                        lineHeight: '1.2'
                    }}
                    variants={itemVariants}
                >
                    {safeData.title}
                </motion.h1>

                {/* Subtítulo */}
                {safeData.subtitle && (
                    <motion.h2
                        className="text-xl md:text-2xl text-center font-semibold mb-6 max-w-2xl"
                        variants={itemVariants}
                    >
                        {safeData.subtitle}
                    </motion.h2>
                )}

                {/* Descrição */}
                {safeData.description && (
                    <motion.p
                        className="text-base md:text-lg text-center leading-relaxed opacity-80 mb-8 max-w-2xl"
                        variants={itemVariants}
                    >
                        {safeData.description}
                    </motion.p>
                )}

                {/* Lista de features/benefícios */}
                {safeData.features && Array.isArray(safeData.features) && safeData.features.length > 0 && (
                    <motion.div
                        className="w-full max-w-2xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                        variants={itemVariants}
                    >
                        {safeData.features.map((feature: string, index: number) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg shadow-sm"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            >
                                <span className="text-2xl">{feature.split(' ')[0]}</span>
                                <span className="text-sm md:text-base">{feature.substring(feature.indexOf(' ') + 1)}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Card de ação */}
                <motion.div
                    className="w-full max-w-md space-y-6 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
                    variants={itemVariants}
                >
                    {/* Separador */}
                    <motion.div
                        className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                        variants={itemVariants}
                    />

                    {/* Checkbox de confirmação */}
                    <motion.div
                        className="flex items-center justify-center space-x-3 p-4 bg-white/30 rounded-lg"
                        variants={itemVariants}
                    >
                        <input
                            type="checkbox"
                            id="ready-checkbox"
                            checked={isReady}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                            disabled={!hasRead}
                            className="w-5 h-5 rounded border-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                                accentColor: safeData.accentColor,
                                borderColor: safeData.accentColor
                            }}
                        />
                        <label
                            htmlFor="ready-checkbox"
                            className={`text-sm md:text-base font-medium select-none ${hasRead ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                        >
                            {hasRead
                                ? 'Estou pronto(a) para começar'
                                : 'Role a página para ler tudo...'}
                        </label>
                    </motion.div>

                    {/* Botão de continuar */}
                    <motion.button
                        onClick={handleContinue}
                        disabled={!isReady || !hasRead}
                        className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 ${isReady && hasRead
                                ? 'shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                        style={{
                            backgroundColor: (isReady && hasRead) ? safeData.accentColor : '#cccccc',
                            color: '#ffffff'
                        }}
                        variants={itemVariants}
                        whileHover={isReady && hasRead ? { scale: 1.02 } : {}}
                        whileTap={isReady && hasRead ? { scale: 0.98 } : {}}
                    >
                        {safeData.buttonText || 'Continuar'}
                    </motion.button>

                    {/* Informação adicional */}
                    <motion.div
                        className="text-center space-y-2"
                        variants={itemVariants}
                    >
                        <p className="text-xs md:text-sm opacity-60">
                            ⏱️ Leva apenas 3 minutos • 🔒 Dados seguros • 💯 100% gratuito
                        </p>
                        <p className="text-xs opacity-50">
                            Mais de 10.000 pessoas já descobriram seu estilo
                        </p>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <footer className="mt-12 pt-8 text-center">
                    <p className="text-xs opacity-50">
                        © {new Date().getFullYear()} Quiz Flow Pro • Todos os direitos reservados
                    </p>
                </footer>
            </motion.div>
        </main>
    );
}
