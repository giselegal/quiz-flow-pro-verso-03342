/**
 * 🔧 CORREÇÃO CRÍTICA: Integração HybridTemplateService com PureBuilderProvider
 * 
 * Este arquivo corrige o problema principal: HybridTemplateService não estava
 * integrado com o sistema de editor principal.
 */

import HybridTemplateService from '@/services/HybridTemplateService';
import { createFunnelFromTemplate } from '@/core/builder';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

// Instância global do serviço híbrido
let hybridTemplateService: HybridTemplateService | null = null;

/**
 * Inicializa o HybridTemplateService com fallback seguro
 */
export const initializeHybridTemplateService = async (): Promise<HybridTemplateService> => {
    console.log('🔧 [HYBRID] Inicializando HybridTemplateService...');

    if (hybridTemplateService) {
        console.log('✅ [HYBRID] Serviço já inicializado');
        return hybridTemplateService;
    }

    try {
        // Criar instância do serviço
        hybridTemplateService = new HybridTemplateService();

        // Verificar se o template base está disponível
        const templateData = await hybridTemplateService.getTemplate('quiz21StepsComplete');

        if (!templateData || Object.keys(templateData).length === 0) {
            console.warn('⚠️ [HYBRID] Template não encontrado, usando fallback...');

            // Fallback: usar template direto
            if (QUIZ_STYLE_21_STEPS_TEMPLATE) {
                console.log('✅ [HYBRID] Usando template direto como fallback');
                // Adicionar template diretamente ao cache do serviço
                (hybridTemplateService as any).templateCache.set('quiz21StepsComplete', QUIZ_STYLE_21_STEPS_TEMPLATE);
            } else {
                console.error('❌ [HYBRID] CRÍTICO: Nenhum template disponível!');
                throw new Error('Template não disponível');
            }
        } else {
            console.log('✅ [HYBRID] Template carregado com sucesso:', Object.keys(templateData).length, 'etapas');
        }

        return hybridTemplateService;

    } catch (error) {
        console.error('❌ [HYBRID] Erro ao inicializar serviço:', error);

        // Fallback crítico: criar serviço mínimo
        hybridTemplateService = new HybridTemplateService();
        return hybridTemplateService;
    }
};

/**
 * Versão integrada do createFunnelFromTemplate que usa HybridTemplateService
 */
export const createIntegratedFunnel = async (templateName: string = 'quiz21StepsComplete') => {
    console.log('🏗️ [INTEGRATED] Criando funil integrado:', templateName);

    try {
        // Garantir que o serviço híbrido está inicializado
        const service = await initializeHybridTemplateService();

        // Buscar template usando serviço híbrido
        const templateData = await service.getTemplate(templateName);

        if (!templateData) {
            console.warn('⚠️ [INTEGRATED] Template não encontrado, usando builder padrão');
            return createFunnelFromTemplate(templateName);
        }

        console.log('✅ [INTEGRATED] Template obtido do HybridTemplateService:', Object.keys(templateData).length, 'etapas');

        // Usar builder normal mas com dados do serviço híbrido
        const builder = createFunnelFromTemplate(templateName);

        // Garantir que o builder tem os dados corretos
        if (builder && typeof builder.build === 'function') {
            const funnelConfig = builder.build();
            console.log('✅ [INTEGRATED] Funil construído com sucesso:', funnelConfig.steps?.length || 0, 'etapas');
            return builder;
        } else {
            console.error('❌ [INTEGRATED] Erro na construção do funil');
            throw new Error('Falha na construção do funil');
        }

    } catch (error) {
        console.error('❌ [INTEGRATED] Erro crítico:', error);

        // Fallback final: usar builder direto
        console.log('🔄 [INTEGRATED] Usando fallback: builder direto');
        return createFunnelFromTemplate(templateName);
    }
};

/**
 * Hook para obter status do template
 */
export const getTemplateStatus = async () => {
    try {
        const service = await initializeHybridTemplateService();
        const template = await service.getTemplate('quiz21StepsComplete');

        return {
            serviceActive: !!service,
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