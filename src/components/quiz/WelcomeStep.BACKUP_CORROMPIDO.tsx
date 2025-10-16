# 🎨 GUIA COMPLETO: Como Criar Componentes Separados(Como IntroStep)

    > ** Tutorial passo a passo para criar novos steps no Quiz Flow Pro **  
> Data: 16 de Outubro de 2025

---

## 📋 ÍNDICE

1.[Visão Geral](#visão - geral)
2.[Anatomia de um Step Component](#anatomia - de - um - step - component)
3.[Passo a Passo Completo](#passo - a - passo - completo)
4.[Exemplo Prático: WelcomeStep](#exemplo - prático - welcomestep)
5.[Integração no Sistema](#integração - no - sistema)
6.[Checklist de Validação](#checklist - de - validação)
7.[Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

### O que vamos criar ?
    Um novo step component seguindo o padrão do `IntroStep`, incluindo:
- ✅ Componente React com TypeScript
    - ✅ Interface de props tipada
        - ✅ Fallbacks e proteções
            - ✅ Adapter para o sistema
                - ✅ Registro no StepRegistry
                    - ✅ Dados no QUIZ_STEPS
                        - ✅ Lazy loading configurado

### Estrutura de Arquivos
    ```
src/
├── components/quiz/
│   └── WelcomeStep.tsx           # 1️⃣ Componente principal
├── components/step-registry/
│   └── ProductionStepsRegistry.tsx  # 2️⃣ Adapter
├── data/
│   └── quizSteps.ts              # 3️⃣ Dados
└── components/editor/unified/
    └── UnifiedStepRenderer.tsx   # 4️⃣ Lazy loading
```

---

## 🔍 ANATOMIA DE UM STEP COMPONENT

### Estrutura Básica do IntroStep

    ```tsx
// 1. IMPORTS
import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

// 2. INTERFACE DE PROPS
interface IntroStepProps {
    data: QuizStep;                        // Dados do step
    onNameSubmit?: (name: string) => void; // Callback principal
}

// 3. COMPONENTE
export default function IntroStep({ data, onNameSubmit }: IntroStepProps) {
    
    // 4. ESTADO LOCAL
    const [nome, setNome] = useState('');
    
    // 5. FALLBACK DE DADOS
    const safeData = data || {
        type: 'intro',
        title: 'Título padrão',
        // ... outros campos
    };
    
    // 6. HANDLERS
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!nome.trim()) return;
        
        if (typeof onNameSubmit === 'function') {
            try {
                onNameSubmit(nome.trim());
            } catch (err) {
                console.error('Erro:', err);
            }
        }
    };
    
    // 7. RENDERIZAÇÃO
    return (
        <main className="min-h-screen">
            {/* Seu JSX aqui */}
        </main>
    );
}
```

### Componentes da Anatomia

    | Parte | Descrição | Obrigatório |
| -------| -----------| -------------|
| ** Imports ** | React, tipos, utilitários | ✅ Sim |
| ** Interface Props ** | Tipagem TypeScript | ✅ Sim |
| ** Estado Local ** | useState para dados temporários | ⚠️ Se necessário |
| ** Fallback ** | Dados padrão se props falharem | ✅ Sim |
| ** Handlers ** | Funções de evento | ✅ Sim |
| ** Renderização ** | JSX com design system | ✅ Sim |

    ---

## 🚀 PASSO A PASSO COMPLETO

### ETAPA 1: Criar o Componente Principal

    ** Arquivo:** `src/components/quiz/WelcomeStep.tsx`

        ```tsx
'use client';

import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

/**
 * 🏠 WELCOME STEP
 * 
 * Step de boas-vindas personalizado
 * Exibe mensagem de boas-vindas e botão para continuar
 */

interface WelcomeStepProps {
    data: QuizStep;
    onContinue?: () => void; // Callback para avançar
}

export default function WelcomeStep({ data, onContinue }: WelcomeStepProps) {
    // ============================================================================
    // ESTADO LOCAL
    // ============================================================================
    const [isReady, setIsReady] = useState(false);

    // ============================================================================
    // FALLBACK DE DADOS (PROTEÇÃO CRÍTICA)
    // ============================================================================
    const safeData = data || {
        type: 'welcome',
        title: 'Bem-vindo(a) ao Quiz!',
        subtitle: 'Vamos começar a descobrir seu estilo',
        description: 'Este quiz foi desenvolvido especialmente para você.',
        buttonText: 'Começar Agora',
        image: 'https://via.placeholder.com/400x300',
        backgroundColor: '#ffffff',
        textColor: '#432818',
        accentColor: '#B89B7A',
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================
    const handleContinue = () => {
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
    };

    // ============================================================================
    // RENDERIZAÇÃO
    // ============================================================================
    return (
        <main
            className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
            style={{ 
                backgroundColor: safeData.backgroundColor,
                color: safeData.textColor 
            }}
        >
            {/* Container principal */}
            <div className="w-full max-w-md mx-auto space-y-8">
                
                {/* Imagem */}
                {safeData.image && (
                    <div className="flex justify-center">
                        <img
                            src={safeData.image}
                            alt={safeData.title}
                            className="w-full max-w-sm rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {/* Título */}
                <h1 
                    className="text-3xl font-bold text-center"
                    style={{ 
                        fontFamily: '"Playfair Display", serif',
                        color: safeData.accentColor 
                    }}
                >
                    {safeData.title}
                </h1>

                {/* Subtítulo */}
                {safeData.subtitle && (
                    <h2 className="text-xl text-center font-semibold">
                        {safeData.subtitle}
                    </h2>
                )}

                {/* Descrição */}
                {safeData.description && (
                    <p className="text-center text-base leading-relaxed opacity-80">
                        {safeData.description}
                    </p>
                )}

                {/* Checkbox de confirmação */}
                <div className="flex items-center justify-center space-x-3">
                    <input
                        type="checkbox"
                        id="ready-checkbox"
                        checked={isReady}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        className="w-5 h-5 rounded border-2 cursor-pointer"
                        style={{ 
                            accentColor: safeData.accentColor,
                            borderColor: safeData.accentColor 
                        }}
                    />
                    <label 
                        htmlFor="ready-checkbox" 
                        className="text-sm font-medium cursor-pointer select-none"
                    >
                        Estou pronto(a) para começar
                    </label>
                </div>

                {/* Botão de continuar */}
                <button
                    onClick={handleContinue}
                    disabled={!isReady}
                    className={`w - full py - 4 px - 6 text - lg font - semibold rounded - lg transition - all duration - 300 ${
    isReady
        ? 'shadow-lg hover:shadow-xl hover:scale-105'
        : 'opacity-50 cursor-not-allowed'
} `}
                    style={{
                        backgroundColor: isReady ? safeData.accentColor : '#cccccc',
                        color: '#ffffff'
                    }}
                >
                    {safeData.buttonText || 'Continuar'}
                </button>

                {/* Informação adicional */}
                <p className="text-xs text-center opacity-60">
                    Leva apenas 3 minutos • 100% gratuito
                </p>
            </div>

            {/* Footer */}
            <footer className="mt-auto pt-8 text-center">
                <p className="text-xs opacity-50">
                    © {new Date().getFullYear()} Todos os direitos reservados
                </p>
            </footer>
        </main>
    );
}
```

---

### ETAPA 2: Criar o Adapter

    ** Arquivo:** `src/components/step-registry/ProductionStepsRegistry.tsx`

Adicione no final do arquivo:

    ```tsx
/**
 * 🏠 WELCOME STEP ADAPTER
 * Converte WelcomeStep para BaseStepProps
 */
const WelcomeStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    // Converter props do StepRegistry para props do WelcomeStep
    const adaptedProps = {
        data: {
            id: stepId,
            type: 'welcome' as const,
            title: data.title || 'Bem-vindo(a) ao Quiz!',
            subtitle: data.subtitle || 'Vamos começar',
            description: data.description || '',
            buttonText: data.buttonText || 'Começar Agora',
            image: data.image || '',
            backgroundColor: data.backgroundColor || '#ffffff',
            textColor: data.textColor || '#432818',
            accentColor: data.accentColor || '#B89B7A',
            ...data
        },
        onContinue: () => {
            console.log('[WelcomeStep] Avançando para próxima etapa');
            // Salvar que usuário confirmou estar pronto
            onSave({ welcomeConfirmed: true });
            onNext();
        },
        ...otherProps
    };

    return <OriginalWelcomeStep {...adaptedProps} />;
};

// No início do arquivo, adicione o import:
// import OriginalWelcomeStep from '@/components/quiz/WelcomeStep';

// No final, adicione ao export:
export {
    IntroStepAdapter,
    QuestionStepAdapter,
    StrategicQuestionStepAdapter,
    TransitionStepAdapter,
    ResultStepAdapter,
    OfferStepAdapter,
    WelcomeStepAdapter, // ← NOVO
};
```

---

### ETAPA 3: Adicionar Dados no QUIZ_STEPS

    ** Arquivo:** `src/data/quizSteps.ts`

        ```tsx
export const QUIZ_STEPS: Record<string, QuizStep> = {
    'step-01': {
        type: 'intro',
        title: '...',
        // ... dados existentes
    },

    // ⭐ NOVO STEP
    'step-00': {
        type: 'welcome',
        title: '👋 Bem-vindo(a) ao Quiz de Estilo!',
        subtitle: 'Descubra seu estilo pessoal em minutos',
        description: 'Este quiz foi desenvolvido por especialistas em consultoria de imagem e vai te ajudar a entender qual estilo combina mais com você.',
        buttonText: 'Vamos Começar!',
        image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_400,c_limit/v1752443943/welcome-image.png',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        accentColor: '#B89B7A',
        nextStep: 'step-01',
    },

    'step-02': {
        type: 'question',
        // ... dados existentes
    },
    
    // ... outros steps
};

// Atualizar também STEP_ORDER:
export const STEP_ORDER = [
    'step-00', // ← NOVO
    'step-01',
    'step-02',
    // ... outros
];
```

---

### ETAPA 4: Configurar Lazy Loading

    ** Arquivo:** `src/components/editor/unified/UnifiedStepRenderer.tsx`

        ```tsx
const LazyStepComponents = {
    // ⭐ NOVO STEP
    'step-00': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.WelcomeStepAdapter }))
    ),
    
    // Steps existentes
    'step-01': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.IntroStepAdapter }))
    ),
    
    'step-02': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.QuestionStepAdapter }))
    ),
    
    // ... outros steps
} as const;
```

---

### ETAPA 5: Registrar no StepRegistry(Opcional)

    ** Arquivo:** `src/components/step-registry/StepRegistry.ts`

        ```tsx
import { stepRegistry } from './StepRegistry';
import { WelcomeStepAdapter } from './ProductionStepsRegistry';

// Registrar o novo step
export function registerProductionSteps() {
    // ⭐ NOVO STEP
    stepRegistry.register('step-00', WelcomeStepAdapter, {
        name: 'Welcome Step',
        category: 'intro',
        description: 'Step de boas-vindas inicial',
        icon: '👋',
        version: '1.0.0'
    });

    // Steps existentes
    stepRegistry.register('step-01', IntroStepAdapter, {
        name: 'Intro Step',
        category: 'intro',
        description: 'Captura nome do usuário',
        icon: '🏠',
        version: '1.0.0'
    });
    
    // ... outros registros
}
```

---

## 💡 EXEMPLO PRÁTICO: WelcomeStep Completo

Vou criar um exemplo mais completo com features avançadas:

<function_calls>
    <invoke name="create_file">
        <parameter name="content">'use client';

            import React, {useState, useEffect} from 'react';
            import type {QuizStep} from '../../data/quizSteps';
            import {motion} from 'framer-motion';

            /**
             * 🏠 WELCOME STEP - EXEMPLO COMPLETO
             * 
             * Step de boas-vindas com animações e features avançadas
             * Baseado no padrão do IntroStep
             */

            interface WelcomeStepProps {
                data: QuizStep;
    onContinue?: () => void;
            userName?: string; // Nome do usuário se já capturado
            showAnimation?: boolean; // Se deve mostrar animações
}

            export default function WelcomeStep({
                data,
                onContinue,
                userName,
                showAnimation = true
            }: WelcomeStepProps) {

    // ============================================================================
    // ESTADO LOCAL
    // ============================================================================
    const [isReady, setIsReady] = useState(false);
            const [hasRead, setHasRead] = useState(false);
            const [scrollProgress, setScrollProgress] = useState(0);

            // ============================================================================
            // FALLBACK DE DADOS
            // ============================================================================
            const safeData = data || {
                type: 'welcome',
            title: 'Bem-vindo(a) ao Quiz!',
            subtitle: 'Vamos começar a descobrir seu estilo',
            description: 'Este quiz foi desenvolvido especialmente para você.',
            buttonText: 'Começar Agora',
            image: 'https://via.placeholder.com/400x300',
            backgroundColor: '#FAF9F7',
            textColor: '#432818',
            accentColor: '#B89B7A',
            features: [
            '✅ 3 minutos para completar',
            '✅ Resultado personalizado',
            '✅ 100% gratuito'
            ]
    };

    // ============================================================================
    // EFEITOS
    // ============================================================================

    // Detectar scroll para liberar botão
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

            setScrollProgress(scrollPercentage);

            // Considerar "lido" se scrollou 80% ou mais
            if (scrollPercentage >= 80) {
                setHasRead(true);
            }
        };

            window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-liberar botão após 3 segundos (fallback)
    useEffect(() => {
        const timer = setTimeout(() => {
                setHasRead(true);
        }, 3000);
        
        return () => clearTimeout(timer);
    }, []);

    // ============================================================================
    // HANDLERS
    // ============================================================================
    
    const handleContinue = () => {
        if (!isReady) {
                alert('Por favor, confirme que está pronto(a) para começar');
            return;
        }

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
    };

            // ============================================================================
            // RENDERIZAÇÃO
            // ============================================================================

            // Variantes de animação
            const containerVariants = {
                hidden: {opacity: 0, y: 20 },
            visible: {
                opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            staggerChildren: 0.1 
            }
        }
    };

            const itemVariants = {
                hidden: {opacity: 0, y: 10 },
            visible: {opacity: 1, y: 0 }
    };

            return (
            <main
                className="flex flex-col items-center justify-start min-h-screen px-4 py-8"
                style={{
                    backgroundColor: safeData.backgroundColor,
                    color: safeData.textColor
                }}
            >
                {/* Progress bar de scroll */}
                <div
                    className="fixed top-0 left-0 h-1 z-50 transition-all duration-300"
                    style={{
                        width: `${scrollProgress}%`,
                        backgroundColor: safeData.accentColor
                    }}
                />

                {/* Container principal com animação */}
                <motion.div
                    className="w-full max-w-2xl mx-auto space-y-8"
                    variants={showAnimation ? containerVariants : undefined}
                    initial={showAnimation ? "hidden" : undefined}
                    animate={showAnimation ? "visible" : undefined}
                >

                    {/* Saudação personalizada */}
                    {userName && (
                        <motion.div
                            className="text-center"
                            variants={itemVariants}
                        >
                            <p className="text-lg font-semibold" style={{ color: safeData.accentColor }}>
                                Olá, {userName}! 👋
                            </p>
                        </motion.div>
                    )}

                    {/* Imagem principal */}
                    {safeData.image && (
                        <motion.div
                            className="flex justify-center"
                            variants={itemVariants}
                        >
                            <img
                                src={safeData.image}
                                alt={safeData.title}
                                className="w-full max-w-md rounded-2xl shadow-2xl"
                                loading="lazy"
                            />
                        </motion.div>
                    )}

                    {/* Título */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-center leading-tight"
                        style={{
                            fontFamily: '"Playfair Display", serif',
                            color: safeData.accentColor
                        }}
                        variants={itemVariants}
                    >
                        {safeData.title}
                    </motion.h1>

                    {/* Subtítulo */}
                    {safeData.subtitle && (
                        <motion.h2
                            className="text-xl md:text-2xl text-center font-semibold"
                            variants={itemVariants}
                        >
                            {safeData.subtitle}
                        </motion.h2>
                    )}

                    {/* Descrição */}
                    {safeData.description && (
                        <motion.p
                            className="text-center text-base md:text-lg leading-relaxed opacity-80 max-w-xl mx-auto"
                            variants={itemVariants}
                        >
                            {safeData.description}
                        </motion.p>
                    )}

                    {/* Features/Benefícios */}
                    {safeData.features && safeData.features.length > 0 && (
                        <motion.div
                            className="bg-white/50 rounded-xl p-6 space-y-3"
                            variants={itemVariants}
                        >
                            {safeData.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <span className="text-2xl">{feature.split(' ')[0]}</span>
                                    <span className="text-sm md:text-base">
                                        {feature.split(' ').slice(1).join(' ')}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}

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
                                : 'Leia toda a página primeiro...'}
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
                <footer className="mt-auto pt-8 text-center">
                    <p className="text-xs opacity-50">
                        © {new Date().getFullYear()} Todos os direitos reservados
                    </p>
                </footer>
            </main>
            );
}
