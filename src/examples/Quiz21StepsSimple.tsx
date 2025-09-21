/**
 * 🎯 EXEMPLO PRÁTICO - COMO USAR O SIMPLE QUIZ CORE
 * 
 * Este arquivo mostra como migrar do sistema atual para o novo core limpo
 */

import React from 'react';
import SimpleQuizCore from '@/core/SimpleQuizCore';

/**
 * 🚀 COMPONENTE SIMPLIFICADO - SUBSTITUI TODA A COMPLEXIDADE ATUAL
 */
export const Quiz21StepsSimple: React.FC = () => {
    // ✅ Mock de dados para demonstração (depois conectar com template real)
    const steps = React.useMemo(() => [
        {
            id: 'step-1',
            title: 'Como você se descreveria?',
            type: 'question' as const,
            content: {
                type: 'multiple-choice',
                options: [
                    { label: 'Clássica e elegante', value: 'classic' },
                    { label: 'Moderna e ousada', value: 'modern' },
                    { label: 'Casual e confortável', value: 'casual' },
                    { label: 'Romântica e feminina', value: 'romantic' }
                ]
            }
        },
        {
            id: 'step-2',
            title: 'Qual seu tipo de corpo?',
            type: 'question' as const,
            content: {
                type: 'multiple-choice',
                options: [
                    { label: 'Ampulheta', value: 'hourglass' },
                    { label: 'Pera', value: 'pear' },
                    { label: 'Maçã', value: 'apple' },
                    { label: 'Retângulo', value: 'rectangle' }
                ]
            }
        },
        {
            id: 'result',
            title: 'Seu Perfil de Estilo!',
            type: 'result' as const,
            content: {
                title: 'Resultado Personalizado',
                description: 'Com base nas suas respostas, criamos um perfil exclusivo para você!',
                showAnswers: true
            }
        }
    ], []);

    // ✅ Handlers simples
    const handleStepChange = (step: number, answers: Record<string, any>) => {
        console.log(`📍 Step ${step + 1}:`, answers);

        // Aqui você pode adicionar analytics, persistência, etc
        // localStorage.setItem('quiz-progress', JSON.stringify({ step, answers }));
    };

    const handleComplete = (answers: Record<string, any>) => {
        console.log('🎉 Quiz completo!', answers);

        // Processar resultado final
        // enviarResultadoParaBackend(answers);
        // redirecionarParaResultado(answers);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <SimpleQuizCore
                        steps={steps}
                        onStepChange={handleStepChange}
                        onComplete={handleComplete}
                        className="bg-white rounded-lg shadow-lg p-8"
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * 📊 ROTA PARA TESTE IMEDIATO
 */
export const TestNewQuizCore: React.FC = () => {
    return (
        <div>
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                    🧪 Teste do Novo Core Simplificado
                </h2>
                <p className="text-yellow-700 text-sm">
                    Este é o novo sistema que substitui toda a complexidade atual.
                    Performance otimizada, zero contextos aninhados, código limpo.
                </p>
            </div>

            <Quiz21StepsSimple />
        </div>
    );
};

export default Quiz21StepsSimple;