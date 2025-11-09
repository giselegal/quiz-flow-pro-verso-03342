/**
 * 🔧 DIAGNOSTIC SCRIPT - SOMENTE DEV
 * 
 * Este script diagnostica carregamento de template usando dynamic import
 * para evitar incluir o template no bundle de produção.
 */

// Interface para evitar dependência de tipos
interface TemplateStep {
    id: string;
    type: string;
    content?: any;
}

interface TemplateDiagnosticResult {
    templateLoaded: boolean;
    stepCount: number;
    template: Record<string, TemplateStep[]> | null;
    source: 'dynamic-import' | 'error';
    error?: string;
}

/**
 * Executa diagnóstico do template usando dynamic import
 * IMPORTANTE: Só deve ser executado em ambiente DEV
 */
export default async function runTemplateDiagnostic(): Promise<TemplateDiagnosticResult> {
    // Verificar se está em DEV
    if (import.meta.env.PROD) {
        console.warn('⚠️ [DIAGNOSTIC] Diagnóstico desabilitado em produção');
        return {
            templateLoaded: false,
            stepCount: 0,
            template: null,
            source: 'error',
            error: 'Diagnóstico não disponível em produção',
        };
    }

    console.log('🔧 [DIAGNOSTIC] Testando carregamento do template...');

    try {
        // Dynamic import para evitar bundle bloat
        const templateModule = await import('../templates/quiz21StepsComplete');
        const QUIZ_STYLE_21_STEPS_TEMPLATE = templateModule.QUIZ_STYLE_21_STEPS_TEMPLATE;

        if (QUIZ_STYLE_21_STEPS_TEMPLATE) {
            console.log('✅ [DIAGNOSTIC] Template carregado com sucesso!');
            console.log('📊 [DIAGNOSTIC] Número de etapas:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length);

            // Verificar primeira etapa
            const firstStep = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE)[0];
            if (firstStep) {
                const firstStepBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[firstStep];
                console.log('🎯 [DIAGNOSTIC] Primeira etapa:', firstStep);
                console.log('🧩 [DIAGNOSTIC] Blocos na primeira etapa:', firstStepBlocks?.length || 0);

                if (firstStepBlocks && firstStepBlocks.length > 0) {
                    console.log('📝 [DIAGNOSTIC] Primeiro bloco:', {
                        id: firstStepBlocks[0]?.id,
                        type: firstStepBlocks[0]?.type,
                        hasContent: !!firstStepBlocks[0]?.content,
                    });
                }
            }

            // Verificar se todas as etapas têm blocos
            let emptySteps = 0;
            let totalBlocks = 0;

            Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
                if (!blocks || blocks.length === 0) {
                    emptySteps++;
                    console.log(`⚠️ [DIAGNOSTIC] Etapa vazia encontrada: ${stepKey}`);
                } else {
                    totalBlocks += blocks.length;
                }
            });

            console.log('📈 [DIAGNOSTIC] Estatísticas:', {
                totalSteps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
                emptySteps,
                totalBlocks,
                averageBlocksPerStep: totalBlocks / Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
            });

            // Testar se o módulo está acessível globalmente
            if (typeof window !== 'undefined') {
                (window as any).__DIAGNOSTIC_TEMPLATE__ = QUIZ_STYLE_21_STEPS_TEMPLATE;
                console.log('🌍 [DIAGNOSTIC] Template disponível em window.__DIAGNOSTIC_TEMPLATE__');
            }

            return {
                templateLoaded: true,
                stepCount: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
                template: QUIZ_STYLE_21_STEPS_TEMPLATE,
                source: 'dynamic-import',
            };
        } else {
            console.error('❌ [DIAGNOSTIC] Template não carregado! Verifique imports.');
            return {
                templateLoaded: false,
                stepCount: 0,
                template: null,
                source: 'error',
                error: 'Template vazio após import',
            };
        }
    } catch (error) {
        console.error('❌ [DIAGNOSTIC] Erro ao carregar template:', error);
        return {
            templateLoaded: false,
            stepCount: 0,
            template: null,
            source: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
    }
}
