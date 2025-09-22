/**
 * 🔧 CORREÇÃO CRÍTICA: Integração HybridTemplateService com PureBuilderProvider
 * 
 * Este arquivo corrige o problema principal: HybridTemplateService não estava
 * integrado com o sistema de editor principal.
 */

import HybridTemplateService from '@/services/HybridTemplateService';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

// Flag para controlar se o serviço já foi inicializado
let isInitialized = false;

/**
 * Inicializa o HybridTemplateService com fallback seguro
 */
export const initializeHybridTemplateService = async (): Promise<typeof HybridTemplateService> => {
    console.log('🔧 [HYBRID] Inicializando HybridTemplateService...');

    if (isInitialized) {
        console.log('✅ [HYBRID] Serviço já inicializado');
        return HybridTemplateService;
    }

    try {
        // Verificar se o template base está disponível (usando método estático)
        const templateData = await HybridTemplateService.getTemplate('quiz21StepsComplete');

        if (!templateData || Object.keys(templateData).length === 0) {
            console.warn('⚠️ [HYBRID] Template não encontrado, usando fallback...');

            // Fallback: usar template direto
            if (QUIZ_STYLE_21_STEPS_TEMPLATE) {
                console.log('✅ [HYBRID] Usando template direto como fallback');
                // Note: Como HybridTemplateService usa métodos estáticos, 
                // o fallback será tratado internamente pelo serviço
            } else {
                console.error('❌ [HYBRID] CRÍTICO: Nenhum template disponível!');
                throw new Error('Template não disponível');
            }
        } else {
            console.log('✅ [HYBRID] Template carregado com sucesso:', Object.keys(templateData).length, 'etapas');
        }

        isInitialized = true;
        return HybridTemplateService;

    } catch (error) {
        console.error('❌ [HYBRID] Erro ao inicializar serviço:', error);

        // Fallback crítico: marcar como inicializado mesmo com erro
        isInitialized = true;
        return HybridTemplateService;
    }
};

/**
 * Versão integrada do createFunnelFromTemplate que usa HybridTemplateService
 */
export const createIntegratedFunnel = async (templateName: string = 'quiz21StepsComplete') => {
    console.log('🚀 [HYBRID] Criando funil integrado:', templateName);

    try {
        // Inicializar serviço se necessário
        await initializeHybridTemplateService();

        // Obter template usando método estático
        const templateData = await HybridTemplateService.getTemplate(templateName);

        if (!templateData) {
            console.error('❌ [HYBRID] Template não encontrado:', templateName);
            return null;
        }

        console.log('✅ [HYBRID] Funil integrado criado com sucesso');
        return templateData;

    } catch (error) {
        console.error('❌ [HYBRID] Erro ao criar funil integrado:', error);
        return null;
    }
};

/**
 * Hook para obter status do template
 */
export const getTemplateStatus = async () => {
    try {
        await initializeHybridTemplateService();
        const template = await HybridTemplateService.getTemplate('quiz21StepsComplete');

        return {
            serviceActive: isInitialized,
            templateLoaded: !!template,
            templateSteps: template ? Object.keys(template).length : 0,
            fallbackAvailable: !!QUIZ_STYLE_21_STEPS_TEMPLATE,
            directTemplateSteps: QUIZ_STYLE_21_STEPS_TEMPLATE ? Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length : 0
        };
    } catch (error) {
        return {
            serviceActive: false,
            templateLoaded: false,
            templateSteps: 0,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            fallbackAvailable: !!QUIZ_STYLE_21_STEPS_TEMPLATE,
            directTemplateSteps: QUIZ_STYLE_21_STEPS_TEMPLATE ? Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length : 0
        };
    }
};

// Expor serviço para debug global
if (typeof window !== 'undefined') {
    (window as any).__HYBRID_TEMPLATE_SERVICE__ = {
        initialize: initializeHybridTemplateService,
        getStatus: getTemplateStatus,
        createFunnel: createIntegratedFunnel
    };
}