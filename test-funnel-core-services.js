/**
 * 🧪 TESTE DE FUNCIONALIDADE DOS SERVIÇOS CORE
 * 
 * Teste rápido para validar que todos os serviços estão funcionando
 */

import { funnelServices, checkServicesHealth } from './src/core/funnel/services/index';
import { generateTestSettings } from './src/core/funnel/services/SettingsService';
import { migrateLegacyFunnelData } from './src/core/funnel/services/LocalStorageService';

// ============================================================================
// TESTE PRINCIPAL
// ============================================================================

async function testFunnelCoreServices() {
    console.log('🧪 Iniciando testes dos serviços core...');

    // 1. Teste de health check
    console.log('\n📊 Verificando saúde dos serviços...');
    const health = await checkServicesHealth();
    console.log('Health status:', health);

    // 2. Teste do TemplateService
    console.log('\n🎨 Testando TemplateService...');
    try {
        const templates = await funnelServices.templates.getTemplates();
        console.log(`✅ TemplateService: ${templates.length} templates encontrados`);
    } catch (error) {
        console.error('❌ Erro no TemplateService:', error);
    }

    // 3. Teste do ComponentsService
    console.log('\n🧩 Testando ComponentsService...');
    try {
        const components = funnelServices.components.getComponents();
        console.log(`✅ ComponentsService: ${Object.keys(components).length} tipos de componentes`);
    } catch (error) {
        console.error('❌ Erro no ComponentsService:', error);
    }

    // 4. Teste do SettingsService
    console.log('\n⚙️ Testando SettingsService...');
    try {
        const defaultSettings = funnelServices.settings.getDefaultSettings();
        const testSettings = generateTestSettings('test-funnel');
        console.log('✅ SettingsService: Configurações geradas com sucesso');
        console.log('Theme:', defaultSettings.theme?.primaryColor);
        console.log('Test theme:', testSettings.theme?.primaryColor);
    } catch (error) {
        console.error('❌ Erro no SettingsService:', error);
    }

    // 5. Teste do LocalStorageService
    console.log('\n💾 Testando LocalStorageService...');
    try {
        const isAvailable = funnelServices.localStorage.isStorageAvailable();
        const stats = funnelServices.localStorage.getStorageStats();
        console.log(`✅ LocalStorageService: Disponível=${isAvailable}, Itens=${stats.totalItems}`);

        // Migrar dados legacy se necessário
        const migrated = migrateLegacyFunnelData();
        if (migrated > 0) {
            console.log(`🔄 ${migrated} itens legacy migrados`);
        }
    } catch (error) {
        console.error('❌ Erro no LocalStorageService:', error);
    }

    // 6. Teste do PublishingService
    console.log('\n🚀 Testando PublishingService...');
    try {
        const previewUrl = funnelServices.publishing.generatePreviewUrl('test-funnel');
        const stats = funnelServices.publishing.getPublishingStats();
        console.log(`✅ PublishingService: Preview URL gerada`);
        console.log(`URL: ${previewUrl}`);
        console.log(`Deployments: ${stats.totalDeployments}`);
    } catch (error) {
        console.error('❌ Erro no PublishingService:', error);
    }

    // 7. Teste integrado
    console.log('\n🔗 Testando integração...');
    try {
        // Criar um estado de funil fictício
        const testFunnelState = {
            id: 'test-integration',
            metadata: {
                name: 'Teste de Integração',
                description: 'Funil para teste de integração dos serviços',
                category: 'teste',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0.0'
            },
            steps: [
                {
                    id: 'step-1',
                    name: 'Introdução',
                    type: 'intro',
                    order: 0,
                    isRequired: true,
                    isVisible: true,
                    components: [],
                    settings: {
                        autoAdvance: false,
                        autoAdvanceDelay: 0,
                        showProgress: true,
                        allowSkip: false,
                        validation: {
                            required: false,
                            customRules: []
                        }
                    }
                }
            ],
            currentStep: 0,
            completedSteps: [],
            data: {},
            settings: funnelServices.settings.getDefaultSettings(),
            events: [],
            status: 'draft' as const,
            analytics: {
                sessions: 0,
                completions: 0,
                abandonments: 0,
                averageTime: 0,
                stepAnalytics: {}
            }
        };

        // Salvar configurações
        const settingsSaved = await funnelServices.settings.saveSettings(
            testFunnelState.id,
            testFunnelState.settings
        );

        // Salvar no localStorage
        const localSaved = funnelServices.localStorage.saveFunnel(
            testFunnelState.id,
            testFunnelState
        );

        console.log(`✅ Integração: Settings=${settingsSaved}, Local=${localSaved}`);
    } catch (error) {
        console.error('❌ Erro na integração:', error);
    }

    console.log('\n🎉 Testes concluídos!');
}

// ============================================================================
// EXECUTAR SE FOR CHAMADO DIRETAMENTE
// ============================================================================

if (typeof window !== 'undefined') {
    // No browser
    window.testFunnelCoreServices = testFunnelCoreServices;
    console.log('🧪 Teste disponível em: window.testFunnelCoreServices()');
} else {
    // Node.js (se aplicável)
    testFunnelCoreServices().catch(console.error);
}

export { testFunnelCoreServices };
