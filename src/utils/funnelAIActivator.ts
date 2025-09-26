/**
 * 🚀 ATIVADOR DA IA DO FUNIL
 * 
 * Script para ativar e configurar a IA do funil automaticamente
 */

import { AIEnhancedHybridTemplateService } from '../services/AIEnhancedHybridTemplateService';

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
        AIEnhancedHybridTemplateService.enableAI(OPTIMAL_AI_CONFIG);
        
        // Definir contexto inicial inteligente
        AIEnhancedHybridTemplateService.setAIContext({
            userProfile: {
                interests: ['estilo', 'moda', 'beleza'],
                previousResponses: {},
                demographics: {
                    language: 'pt-BR',
                    region: 'Brasil'
                }
            },
            sessionData: {
                startTime: new Date(),
                source: 'web'
            }
        });
        
        // Verificar status
        const status = AIEnhancedHybridTemplateService.getAIStatus();
        
        console.log('✅ IA DO FUNIL ATIVADA!');
        console.log('📊 Status da IA:', {
            'Habilitada': status.enabled ? '✅' : '❌',
            'Serviço ativo': status.hasService ? '✅' : '❌',
            'Personalização': status.config.personalizationEnabled ? '✅' : '❌',
            'Otimização': status.config.optimizationEnabled ? '✅' : '❌',
            'Geração de conteúdo': status.config.contentGenerationEnabled ? '✅' : '❌',
            'Fallback': status.config.fallbackEnabled ? '✅' : '❌'
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
            AIEnhancedHybridTemplateService.enableAI({
                enabled: true,
                fallbackEnabled: true,
                personalizationEnabled: false,
                optimizationEnabled: false,
                contentGenerationEnabled: false,
            });
            
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
    const status = AIEnhancedHybridTemplateService.getAIStatus();
    
    console.log('📊 STATUS DA IA DO FUNIL:');
    console.log('========================');
    console.log('Habilitada:', status.enabled ? '✅' : '❌');
    console.log('Serviço ativo:', status.hasService ? '✅' : '❌');
    console.log('Configurações:', status.config);
    
    return status;
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
    OPTIMAL_AI_CONFIG
};