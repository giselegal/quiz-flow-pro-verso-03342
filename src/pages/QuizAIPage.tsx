/**
 * 🤖 PÁGINA DO QUIZ COM IA INTEGRADA
 * 
 * Página especial que carrega o quiz de 21 etapas com 
 * sistema de IA ativado para geração de looks personalizados.
 */

import React, { Suspense } from 'react';
import { QuizErrorBoundary } from '@/components/RouteErrorBoundary';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';

const ModernUnifiedEditor = React.lazy(() => import('@/pages/editor/ModernUnifiedEditor'));

interface QuizAIPageProps {
    previewMode?: boolean;
}

export const QuizAIPage: React.FC<QuizAIPageProps> = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Header especial para Quiz com IA */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🤖</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Quiz de Estilo com IA
                                </h1>
                                <p className="text-sm text-gray-600">
                                    21 etapas + geração automática de looks personalizados
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                IA Ativa
                            </div>
                            <div className="text-sm text-gray-500">
                                DALL-E 3 + Gemini
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Área de aviso sobre funcionalidades de IA */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-2xl">✨</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Recursos de IA Disponíveis
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                    🎨 <span className="ml-1">Geração de looks personalizados</span>
                                </span>
                                <span className="flex items-center">
                                    🌈 <span className="ml-1">Paletas de cores automáticas</span>
                                </span>
                                <span className="flex items-center">
                                    💡 <span className="ml-1">Dicas de estilo inteligentes</span>
                                </span>
                                <span className="flex items-center">
                                    📊 <span className="ml-1">Análise de personalidade</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <QuizErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                    <div data-testid="quiz-ai-editor">
                        <UnifiedCRUDProvider funnelId="quiz21StepsComplete" autoLoad={true} context={FunnelContext.EDITOR}>
                            <ModernUnifiedEditor
                                funnelId="quiz21StepsComplete"
                                key="ai-quiz-editor"
                            />
                        </UnifiedCRUDProvider>
                    </div>
                </Suspense>
            </QuizErrorBoundary>

            {/* Footer com informações técnicas */}
            <div className="bg-gray-50 border-t">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span>📊 QuizCalculationEngine v2.0</span>
                            <span>🤖 FashionImageAI v1.0</span>
                            <span>🎨 21 etapas interativas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Status:</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Operacional</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAIPage;