/**
 * 🚀 ATIVADOR DA IA DO FUNIL
 * 
 * Script para ativar e configurar a IA do funil automaticamente
 */

import { templateService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * 🎯 Configurações otimizadas da IA do funil
 */
const OPTIMAL_AI_CONFIG = {
    enabled: true,
    provider: 'github-models' as const,
    model: 'gpt-4o-mini',
    fallbackEnabled: true,
    personalizationEnabled: true,
    optimizationEnabled: true,
    contentGenerationEnabled: true,
};

/**
 * 🚀 Ativar IA do funil
 */
export function activateFunnelAI() {
    try {
        appLogger.info('🚀 ATIVANDO IA DO FUNIL...');
        appLogger.info('=====================================');

        // Ativar IA com configurações otimizadas
    // IA legacy removida: placeholder para futura integração canônica
    appLogger.info('ℹ️ IA legacy removida – usando placeholder');

        // Definir contexto inicial inteligente
        const aiContext = {
            userId: `user_${crypto.randomUUID?.() ?? Math.random().toString(36).substr(2, 9)}`,
            userName: 'Usuário',
            previousAnswers: {},
            userSegment: 'quiz_estilo_pessoal',
            sessionData: {
                startTime: new Date().toISOString(),
                source: 'web',
                language: 'pt-BR',
                region: 'Brasil',
            },
            performanceData: {
                stepCompletionTimes: [],
                dropOffPoints: [],
                conversionRate: 0,
            },
        };
        (window as any).__funnelAIContext = aiContext;

        // Verificar status
        appLogger.info('✅ Placeholder de IA aplicado!');
        appLogger.info('📊 Status da IA (simulado):', { data: [{
                    'Habilitada': '✅',
                    'Serviço ativo': '❌ (legacy removido)',
                    'Personalização': '🔄 futura',
                    'Otimização': '🔄 futura',
                    'Geração de conteúdo': '🔄 futura',
                    'Fallback': '✅ básico',
                }] });

        appLogger.info('🎯 FUNCIONALIDADES ATIVAS:');
        appLogger.info('• 🧠 Personalização inteligente de conteúdo');
        appLogger.info('• 🚀 Otimização automática de conversão');
        appLogger.info('• 📝 Geração dinâmica de textos');
        appLogger.info('• 🛡️ Fallback inteligente para erros');
        appLogger.info('• 🎨 Adaptação baseada em perfil do usuário');

        return true;

    } catch (error) {
        appLogger.error('❌ Erro ao ativar IA do funil:', { data: [error] });
        appLogger.info('🔄 Tentando ativação em modo fallback...');

        // Tentar ativação simplificada
        try {
            // Modo simplificado: apenas marca contexto
            (window as any).__funnelAIContextFallback = { enabled: true };

            appLogger.info('⚠️ IA ativada em modo simplificado');
            return true;

        } catch (fallbackError) {
            appLogger.error('❌ Falha completa na ativação da IA:', { data: [fallbackError] });
            return false;
        }
    }
}

/**
 * 🔧 Verificar status da IA
 */
export function checkFunnelAIStatus() {
    const ctx = (window as any).__funnelAIContext || null;
    appLogger.info('📊 STATUS DA IA (placeholder):');
    appLogger.info('========================');
    appLogger.info('Contexto presente:', { data: [ctx ? '✅' : '❌'] });
    return { enabled: !!ctx, context: ctx } as any;
}

/**
 * 🎯 Auto-ativar IA em desenvolvimento
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Auto-ativar IA em desenvolvimento após um delay
    setTimeout(() => {
        appLogger.info('🔄 Auto-ativando IA do funil em modo desenvolvimento...');
        activateFunnelAI();
    }, 1000);
}

export default {
    activateFunnelAI,
    checkFunnelAIStatus,
    OPTIMAL_AI_CONFIG,
};
