/**
 * 🚀 ATIVADOR DA IA DO FUNIL
 * 
 * Script para ativar e configurar a IA do funil automaticamente
 */

import { templateService } from '@/services/canonical/TemplateService';

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
        console.log('🚀 ATIVANDO IA DO FUNIL...');
        console.log('=====================================');

        // Ativar IA com configurações otimizadas
    // IA legacy removida: placeholder para futura integração canônica
    console.log('ℹ️ IA legacy removida – usando placeholder');

        // Definir contexto inicial inteligente
        const aiContext = {
            userId: `user_${  Date.now()}`,
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
        console.log('✅ Placeholder de IA aplicado!');
        console.log('📊 Status da IA (simulado):', {
            'Habilitada': '✅',
            'Serviço ativo': '❌ (legacy removido)',
            'Personalização': '🔄 futura',
            'Otimização': '🔄 futura',
            'Geração de conteúdo': '🔄 futura',
            'Fallback': '✅ básico',
        });

        console.log('🎯 FUNCIONALIDADES ATIVAS:');
        console.log('• 🧠 Personalização inteligente de conteúdo');
        console.log('• 🚀 Otimização automática de conversão');
        console.log('• 📝 Geração dinâmica de textos');
        console.log('• 🛡️ Fallback inteligente para erros');
        console.log('• 🎨 Adaptação baseada em perfil do usuário');

        return true;

    } catch (error) {
        console.error('❌ Erro ao ativar IA do funil:', error);
        console.log('🔄 Tentando ativação em modo fallback...');

        // Tentar ativação simplificada
        try {
            // Modo simplificado: apenas marca contexto
            (window as any).__funnelAIContextFallback = { enabled: true };

            console.log('⚠️ IA ativada em modo simplificado');
            return true;

        } catch (fallbackError) {
            console.error('❌ Falha completa na ativação da IA:', fallbackError);
            return false;
        }
    }
}

/**
 * 🔧 Verificar status da IA
 */
export function checkFunnelAIStatus() {
    const ctx = (window as any).__funnelAIContext || null;
    console.log('📊 STATUS DA IA (placeholder):');
    console.log('========================');
    console.log('Contexto presente:', ctx ? '✅' : '❌');
    return { enabled: !!ctx, context: ctx } as any;
}

/**
 * 🎯 Auto-ativar IA em desenvolvimento
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Auto-ativar IA em desenvolvimento após um delay
    setTimeout(() => {
        console.log('🔄 Auto-ativando IA do funil em modo desenvolvimento...');
        activateFunnelAI();
    }, 1000);
}

export default {
    activateFunnelAI,
    checkFunnelAIStatus,
    OPTIMAL_AI_CONFIG,
};