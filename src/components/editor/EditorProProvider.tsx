import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// 🎯 Base providers
import { SimpleBuilderProvider } from './SimpleBuilderProviderFixed';

// 🤖 Sistemas IA avançados
import { FunnelAIAgent, type FunnelTemplate } from '@/services/FunnelAIAgent';
import { UnifiedCalculationEngine } from '@/utils/UnifiedCalculationEngine';
import { ABTestService } from '@/services/abTestService';

// 🎨 Brand Kit
import { useBrandKit } from '@/hooks/useBrandKit';

// 📊 Analytics
import { useAnalytics } from '@/hooks/useAnalytics';

// 🎯 Types
import { Block, Step } from '@/types/editor';
import { QuizResult } from '@/types/quiz';

/**
 * 🚀 EDITOR PRO PROVIDER - Sistema híbrido que combina:
 * 
 * ✅ SimpleBuilderProvider (funcionalidades básicas)
 * ✅ TemplatesIA + FunnelAIAgent (geração IA)
 * ✅ UnifiedCalculationEngine (cálculos ML)
 * ✅ BrandKit (identidade visual)
 * ✅ Analytics (métricas em tempo real)
 * ✅ A/B Testing (otimização)
 */

interface EditorProContextValue {
    // 🎯 Funcionalidades básicas (do SimpleBuilderProvider)
    steps: Record<string, Step>;
    currentStep: number;
    selectedBlockId: string | null;

    // 🤖 Funcionalidades IA
    generateAISteps: (prompt: string, config?: any) => Promise<Step[]>;
    applyTemplate: (template: FunnelTemplate) => Promise<void>;

    // 🧮 Cálculos avançados
    calculateResults: (answers: any[]) => QuizResult;

    // 🎨 Brand Kit
    brandKit: any;
    applyBrandKit: (kit: any) => void;

    // 📊 Analytics
    analytics: any;
    trackEvent: (event: string, data?: any) => void;

    // 🧪 A/B Testing
    createABTest: (config: any) => Promise<void>;

    // 🔄 Estados
    isLoading: boolean;
    error: string | null;
}

const EditorProContext = createContext<EditorProContextValue | null>(null);

interface EditorProProviderProps {
    children: ReactNode;
    funnelId?: string;
}

const EditorProProvider: React.FC<EditorProProviderProps> = ({
    children,
    funnelId
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🎨 Brand Kit hook
    const brandKitHook = useBrandKit();

    // 📊 Analytics hook
    const analyticsHook = useAnalytics();

    // 🧮 Calculation engine instance
    const [calculationEngine] = useState(() => new UnifiedCalculationEngine());

    // 🤖 AI Agent instance
    const [aiAgent] = useState(() => new FunnelAIAgent());

    // 🤖 Geração IA de steps
    const generateAISteps = async (prompt: string, config?: any): Promise<Step[]> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🤖 Gerando steps com IA:', { prompt, config });

            // Usar FunnelAIAgent para geração inteligente
            const aiSteps = await aiAgent.generateIntelligentSteps(prompt, config);

            console.log('✅ Steps IA gerados:', aiSteps);
            analyticsHook.trackEvent('ai_steps_generated', {
                prompt,
                stepCount: aiSteps.length,
                funnelId
            });

            return aiSteps;
        } catch (err: any) {
            console.error('❌ Erro na geração IA:', err);
            setError(`Erro na geração IA: ${err.message}`);

            // Fallback para steps básicos se IA falhar
            console.log('🔄 Fallback para geração básica...');
            return generateFallbackSteps();
        } finally {
            setIsLoading(false);
        }
    };

    // 🎨 Aplicar template
    const applyTemplate = async (template: FunnelTemplate): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🎨 Aplicando template:', template.meta.name);

            // Aplicar design do template ao Brand Kit
            if (template.design) {
                brandKitHook.updateColors({
                    primary: template.design.primaryColor,
                    secondary: template.design.secondaryColor,
                    accent: template.design.accentColor
                });
            }

            // Aplicar estrutura do template
            if (template.structure) {
                // Implementar aplicação da estrutura
                console.log('📋 Aplicando estrutura do template...');
            }

            analyticsHook.trackEvent('template_applied', {
                templateId: template.meta.name,
                funnelId
            });

        } catch (err: any) {
            console.error('❌ Erro ao aplicar template:', err);
            setError(`Erro ao aplicar template: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 🧮 Cálculos avançados
    const calculateResults = (answers: any[]): QuizResult => {
        try {
            console.log('🧮 Calculando resultados com ML:', answers);

            const results = calculationEngine.calculateResults(answers, {
                includeUserData: true,
                tieBreakStrategy: 'highest-score',
                debug: process.env.NODE_ENV === 'development'
            });

            analyticsHook.trackEvent('results_calculated', {
                answerCount: answers.length,
                resultType: results.style,
                funnelId
            });

            return results;
        } catch (err: any) {
            console.error('❌ Erro no cálculo:', err);
            setError(`Erro no cálculo: ${err.message}`);

            // Fallback para cálculo simples
            return {
                style: 'default',
                points: 0,
                percentage: 0,
                confidence: 0.5
            };
        }
    };

    // 🧪 Criar A/B Test
    const createABTest = async (config: any): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🧪 Criando A/B Test:', config);

            const abTest = await ABTestService.createTest({
                name: config.name || `Teste A/B - ${new Date().toLocaleDateString()}`,
                quiz_id: funnelId || 'default',
                description: config.description || 'Teste automático criado pelo Editor IA Pro',
                traffic_split: config.trafficSplit || 50,
                variants: config.variants || [],
                settings: config.settings || {}
            });

            console.log('✅ A/B Test criado:', abTest);
            analyticsHook.trackEvent('ab_test_created', {
                testId: abTest.id,
                funnelId
            });

        } catch (err: any) {
            console.error('❌ Erro ao criar A/B Test:', err);
            setError(`Erro ao criar A/B Test: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔄 Fallback steps quando IA falha
    const generateFallbackSteps = (): Step[] => {
        console.log('🔄 Gerando steps de fallback...');
        return [
            {
                id: 'step-1',
                title: 'Bem-vindo',
                blocks: []
            },
            {
                id: 'step-2',
                title: 'Pergunta 1',
                blocks: []
            }
        ];
    };

    const contextValue: EditorProContextValue = {
        // 🎯 Estados básicos (serão integrados com SimpleBuilderProvider)
        steps: {},
        currentStep: 1,
        selectedBlockId: null,

        // 🤖 Funcionalidades IA
        generateAISteps,
        applyTemplate,

        // 🧮 Cálculos
        calculateResults,

        // 🎨 Brand Kit
        brandKit: brandKitHook.brandKit,
        applyBrandKit: brandKitHook.applyBrandKit,

        // 📊 Analytics
        analytics: analyticsHook.analytics,
        trackEvent: analyticsHook.trackEvent,

        // 🧪 A/B Testing
        createABTest,

        // 🔄 Estados
        isLoading,
        error
    };

    return (
        <EditorProContext.Provider value={contextValue}>
            {/* 🎯 Wrapper com SimpleBuilderProvider para funcionalidades básicas */}
            <SimpleBuilderProvider funnelId={funnelId}>
                {children}
            </SimpleBuilderProvider>
        </EditorProContext.Provider>
    );
};

// 🎯 Hook para usar o contexto
export const useEditorProContext = (): EditorProContextValue => {
    const context = useContext(EditorProContext);
    if (!context) {
        throw new Error('useEditorProContext deve ser usado dentro de EditorProProvider');
    }
    return context;
};

export default EditorProProvider;