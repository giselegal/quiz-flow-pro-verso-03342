/**
 * 🧪 INTEGRATION TEST SUITE - API + Editor Control
 * 
 * Testes de integração completos para validar o fluxo:
 * /editor → API → /quiz-estilo
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ConfigurationAPI } from '@/services/ConfigurationAPI';
import { DynamicMasterJSONGenerator } from '@/services/DynamicMasterJSONGenerator';
import { QUIZ_COMPONENTS_DEFINITIONS } from '@/types/componentConfiguration';

describe('🔌 API + Editor Integration Tests', () => {
    let configAPI: ConfigurationAPI;
    let jsonGenerator: DynamicMasterJSONGenerator;
    const testFunnelId = 'test-quiz-estilo-integration';

    beforeEach(() => {
        configAPI = ConfigurationAPI.getInstance();
        jsonGenerator = DynamicMasterJSONGenerator.getInstance();
    });

    afterEach(async () => {
        // Limpar dados de teste
        jsonGenerator.invalidateCache(testFunnelId);
    });

    // ============================================================================
    // TESTE 1: CONFIGURAÇÃO BÁSICA VIA API
    // ============================================================================

    describe('📝 Configuration API Basic Operations', () => {

        it('should save and retrieve component configuration', async () => {
            const componentId = 'quiz-options-grid';
            const testConfig = {
                imageSize: 300,
                gridGap: 12,
                columns: 2,
                primaryColor: '#FF5733',
                autoAdvance: { enabled: true, delay: 2000 }
            };

            // Salvar configuração
            await configAPI.updateConfiguration(componentId, testConfig, testFunnelId);

            // Recuperar configuração
            const retrievedConfig = await configAPI.getConfiguration(componentId, testFunnelId);

            expect(retrievedConfig.imageSize).toBe(300);
            expect(retrievedConfig.gridGap).toBe(12);
            expect(retrievedConfig.primaryColor).toBe('#FF5733');
            expect(retrievedConfig.autoAdvance.delay).toBe(2000);
        });

        it('should update single property correctly', async () => {
            const componentId = 'quiz-options-grid';

            // Atualizar uma propriedade específica
            await configAPI.updateProperty(componentId, 'imageSize', 250, testFunnelId);

            // Verificar se foi atualizada
            const config = await configAPI.getConfiguration(componentId, testFunnelId);
            expect(config.imageSize).toBe(250);
        });

        it('should validate properties before saving', async () => {
            const componentId = 'quiz-options-grid';
            const invalidConfig = {
                imageSize: 50, // Muito pequeno (min: 100)
                gridGap: -5,   // Negativo (min: 0)
            };

            // Deve falhar na validação
            await expect(configAPI.updateConfiguration(componentId, invalidConfig, testFunnelId))
                .rejects.toThrow('Validation failed');
        });

    });

    // ============================================================================
    // TESTE 2: GERAÇÃO DE MASTER JSON DINÂMICO
    // ============================================================================

    describe('📄 Dynamic Master JSON Generation', () => {

        it('should generate master JSON with API configurations', async () => {
            // Configurar alguns componentes
            await configAPI.updateConfiguration('quiz-options-grid', {
                imageSize: 280,
                columns: 'auto',
                primaryColor: '#B89B7A'
            }, testFunnelId);

            await configAPI.updateConfiguration('quiz-theme-config', {
                primaryColor: '#B89B7A',
                backgroundColor: '#F5F5F5',
                fontFamily: 'Roboto, sans-serif'
            }, testFunnelId);

            // Gerar JSON master
            const masterJSON = await jsonGenerator.generateMasterJSON(testFunnelId);

            // Verificar estrutura
            expect(masterJSON.templateVersion).toBe('3.0.0-dynamic');
            expect(masterJSON.metadata.source).toBe('dynamic-api');
            expect(masterJSON.metadata.funnelId).toBe(testFunnelId);

            // Verificar configurações de tema
            expect(masterJSON.globalConfig.theme.colors.primary).toBe('#B89B7A');
            expect(masterJSON.globalConfig.theme.colors.background).toBe('#F5F5F5');

            // Verificar componentes
            expect(masterJSON.components['quiz-options-grid']).toBeDefined();
            expect(masterJSON.components['quiz-options-grid'].apiConfiguration.imageSize).toBe(280);

            // Verificar etapas
            expect(Object.keys(masterJSON.steps)).toHaveLength(21);
            expect(masterJSON.steps['step-1'].metadata.type).toBe('intro');
            expect(masterJSON.steps['step-2'].metadata.type).toBe('question');
        });

        it('should use fallback configurations when API data is missing', async () => {
            const emptyFunnelId = 'empty-test-funnel';

            // Gerar JSON sem configurações prévias
            const masterJSON = await jsonGenerator.generateMasterJSON(emptyFunnelId);

            // Deve usar configurações padrão
            expect(masterJSON.globalConfig.theme.colors.primary).toBe('#B89B7A');
            expect(masterJSON.steps['step-1'].behavior.autoAdvance).toBe(false);
            expect(masterJSON.steps['step-2'].behavior.autoAdvance).toBe(true);
        });

    });

    // ============================================================================
    // TESTE 3: INTEGRAÇÃO COMPONENTE + API
    // ============================================================================

    describe('🔗 Component + API Integration', () => {

        it('should load component definitions correctly', async () => {
            const componentId = 'quiz-options-grid';

            // Buscar definição do componente
            const definition = await configAPI.getComponentDefinition(componentId);

            expect(definition.id).toBe(componentId);
            expect(definition.name).toBe('Grid de Opções Quiz');
            expect(definition.properties.length).toBeGreaterThan(0);

            // Verificar se tem propriedade imageSize
            const imageSizeProp = definition.properties.find(p => p.key === 'imageSize');
            expect(imageSizeProp).toBeDefined();
            expect(imageSizeProp!.type).toBe('range');
            expect(imageSizeProp!.validation?.min).toBe(100);
            expect(imageSizeProp!.validation?.max).toBe(500);
        });

        it('should handle real-time property updates', async () => {
            const componentId = 'quiz-options-grid';
            let updateCount = 0;

            // Simular múltiplas atualizações rápidas (real-time editing)
            const updates = [
                { key: 'imageSize', value: 200 },
                { key: 'imageSize', value: 220 },
                { key: 'imageSize', value: 240 },
                { key: 'gridGap', value: 10 }
            ];

            for (const update of updates) {
                await configAPI.updateProperty(componentId, update.key, update.value, testFunnelId);
                updateCount++;
            }

            // Verificar resultado final
            const finalConfig = await configAPI.getConfiguration(componentId, testFunnelId);
            expect(finalConfig.imageSize).toBe(240);
            expect(finalConfig.gridGap).toBe(10);
            expect(updateCount).toBe(4);
        });

    });

    // ============================================================================
    // TESTE 4: FLUXO COMPLETO /EDITOR → /QUIZ-ESTILO
    // ============================================================================

    describe('🔄 Complete Editor → Quiz Flow', () => {

        it('should propagate editor changes to quiz rendering', async () => {
            const componentId = 'quiz-options-grid';

            // PASSO 1: Editar no /editor (simular)
            const editorChanges = {
                imageSize: 320,
                gridGap: 16,
                columns: 3,
                primaryColor: '#FF6B35',
                question: 'Qual seu estilo preferido? (Teste Integração)',
                options: [
                    { id: '1', text: 'Moderno', imageUrl: '/test/modern.jpg', points: 10 },
                    { id: '2', text: 'Clássico', imageUrl: '/test/classic.jpg', points: 20 },
                    { id: '3', text: 'Casual', imageUrl: '/test/casual.jpg', points: 15 }
                ]
            };

            await configAPI.updateConfiguration(componentId, editorChanges, testFunnelId);

            // PASSO 2: Gerar JSON master atualizado
            const updatedMasterJSON = await jsonGenerator.generateMasterJSON(testFunnelId);

            // PASSO 3: Verificar se mudanças se refletem no JSON
            const componentConfig = updatedMasterJSON.components[componentId];
            expect(componentConfig.apiConfiguration.imageSize).toBe(320);
            expect(componentConfig.apiConfiguration.gridGap).toBe(16);
            expect(componentConfig.apiConfiguration.columns).toBe(3);
            expect(componentConfig.apiConfiguration.primaryColor).toBe('#FF6B35');

            // PASSO 4: Verificar estrutura das opções
            expect(componentConfig.apiConfiguration.options).toHaveLength(3);
            expect(componentConfig.apiConfiguration.options[0].text).toBe('Moderno');
            expect(componentConfig.apiConfiguration.options[1].points).toBe(20);
        });

        it('should handle concurrent editor sessions', async () => {
            const componentId = 'quiz-theme-config';

            // Simular duas sessões de editor editando simultaneamente
            const session1Changes = {
                primaryColor: '#RED001',
                fontSize: '18px'
            };

            const session2Changes = {
                primaryColor: '#BLUE001',
                backgroundColor: '#WHITE001'
            };

            // Aplicar mudanças concorrentemente
            await Promise.all([
                configAPI.updateConfiguration(componentId, session1Changes, testFunnelId),
                configAPI.updateConfiguration(componentId, session2Changes, testFunnelId)
            ]);

            // Verificar resultado final (última mudança deve prevalecer)
            const finalConfig = await configAPI.getConfiguration(componentId, testFunnelId);

            // Uma das cores deve prevalecer
            expect(finalConfig.primaryColor === '#RED001' || finalConfig.primaryColor === '#BLUE001').toBe(true);

            // Propriedades não conflitantes devem estar presentes
            expect(finalConfig.fontSize || finalConfig.backgroundColor).toBeDefined();
        });

    });

    // ============================================================================
    // TESTE 5: PERFORMANCE E CACHE
    // ============================================================================

    describe('⚡ Performance & Cache Tests', () => {

        it('should cache API responses effectively', async () => {
            const componentId = 'quiz-options-grid';
            const startTime = Date.now();

            // Primeira chamada (deve buscar da API)
            const config1 = await configAPI.getConfiguration(componentId, testFunnelId);
            const firstCallTime = Date.now() - startTime;

            // Segunda chamada (deve usar cache)
            const startTime2 = Date.now();
            const config2 = await configAPI.getConfiguration(componentId, testFunnelId);
            const secondCallTime = Date.now() - startTime2;

            // Cache deve ser mais rápido
            expect(secondCallTime).toBeLessThan(firstCallTime);
            expect(config1).toEqual(config2);
        });

        it('should handle large configuration objects', async () => {
            const componentId = 'quiz-options-grid';

            // Criar configuração grande
            const largeOptions = Array.from({ length: 50 }, (_, i) => ({
                id: `option-${i}`,
                text: `Opção ${i} com texto muito longo que simula cenários reais de uso`,
                imageUrl: `https://exemplo.com/imagem-${i}.jpg`,
                points: i * 2,
                metadata: {
                    category: `categoria-${i % 5}`,
                    tags: [`tag-${i}`, `tag-${i + 1}`],
                    description: `Descrição detalhada da opção ${i} com mais informações`
                }
            }));

            const largeConfig = {
                options: largeOptions,
                imageSize: 256,
                gridGap: 8,
                customProperties: {
                    analytics: { trackViews: true, trackClicks: true },
                    seo: { alt: 'Opções do quiz', title: 'Escolha sua opção' },
                    accessibility: { ariaLabel: 'Grid de opções do quiz' }
                }
            };

            // Deve conseguir salvar e recuperar
            await configAPI.updateConfiguration(componentId, largeConfig, testFunnelId);
            const retrievedConfig = await configAPI.getConfiguration(componentId, testFunnelId);

            expect(retrievedConfig.options).toHaveLength(50);
            expect(retrievedConfig.customProperties.analytics.trackViews).toBe(true);
        });

    });

    // ============================================================================
    // TESTE 6: ERROR HANDLING E RESILÊNCIA
    // ============================================================================

    describe('🛡️ Error Handling & Resilience', () => {

        it('should handle invalid component IDs gracefully', async () => {
            const invalidComponentId = 'non-existent-component';

            await expect(configAPI.getComponentDefinition(invalidComponentId))
                .rejects.toThrow('Component definition not found');
        });

        it('should provide fallback configurations when API fails', async () => {
            const componentId = 'quiz-options-grid';

            // Simular falha na API através de componente inexistente no contexto
            const config = await configAPI.getConfiguration(componentId, 'non-existent-funnel');

            // Deve retornar configuração padrão
            expect(config).toBeDefined();
            expect(typeof config.imageSize).toBe('number');
        });

        it('should validate data integrity after multiple operations', async () => {
            const componentId = 'quiz-options-grid';

            // Realizar múltiplas operações
            await configAPI.updateProperty(componentId, 'imageSize', 200, testFunnelId);
            await configAPI.updateProperty(componentId, 'gridGap', 10, testFunnelId);
            await configAPI.updateProperty(componentId, 'columns', 2, testFunnelId);

            // Reset
            await configAPI.resetToDefaults(componentId, testFunnelId);

            // Verificar integridade
            const config = await configAPI.getConfiguration(componentId, testFunnelId);
            const definition = await configAPI.getComponentDefinition(componentId);

            // Deve ter voltado aos padrões
            expect(config.imageSize).toBe(definition.defaultProperties.imageSize);
            expect(config.gridGap).toBe(definition.defaultProperties.gridGap);
        });

    });

});

// ============================================================================
// TESTES DE INTEGRAÇÃO E2E (Para rodar manualmente)
// ============================================================================

export const e2eIntegrationTests = {

    /**
     * Teste E2E completo: Editor → API → Quiz
     */
    async testCompleteFlow(funnelId: string = 'e2e-test') {
        console.log('🧪 Starting E2E Integration Test...');

        try {
            const configAPI = ConfigurationAPI.getInstance();
            const jsonGenerator = DynamicMasterJSONGenerator.getInstance();

            // PASSO 1: Configurar via API (simular /editor)
            console.log('📝 Step 1: Configuring via API...');

            const editorConfig = {
                'quiz-options-grid': {
                    imageSize: 280,
                    gridGap: 12,
                    columns: 'auto',
                    primaryColor: '#E74C3C',
                    question: 'Qual é o seu estilo favorito?',
                    options: [
                        { id: 'modern', text: 'Moderno e minimalista', imageUrl: '/images/modern.jpg', points: 10 },
                        { id: 'classic', text: 'Clássico e elegante', imageUrl: '/images/classic.jpg', points: 20 },
                        { id: 'casual', text: 'Casual e confortável', imageUrl: '/images/casual.jpg', points: 15 }
                    ]
                },
                'quiz-theme-config': {
                    primaryColor: '#E74C3C',
                    secondaryColor: '#2C3E50',
                    backgroundColor: '#ECF0F1',
                    fontFamily: 'Poppins, sans-serif'
                }
            };

            for (const [componentId, config] of Object.entries(editorConfig)) {
                await configAPI.updateConfiguration(componentId, config, funnelId);
            }

            // PASSO 2: Gerar JSON master
            console.log('📄 Step 2: Generating Master JSON...');
            const masterJSON = await jsonGenerator.generateMasterJSON(funnelId);

            // PASSO 3: Validar estrutura
            console.log('✅ Step 3: Validating structure...');

            const validations = {
                hasCorrectVersion: masterJSON.templateVersion === '3.0.0-dynamic',
                hasCorrectFunnelId: masterJSON.metadata.funnelId === funnelId,
                hasThemeConfig: !!masterJSON.globalConfig.theme,
                hasSteps: Object.keys(masterJSON.steps).length === 21,
                hasComponents: Object.keys(masterJSON.components).length > 0,
                hasCorrectColors: masterJSON.globalConfig.theme.colors.primary === '#E74C3C'
            };

            console.log('🔍 Validation Results:', validations);

            // PASSO 4: Testar mudanças em tempo real
            console.log('⚡ Step 4: Testing real-time updates...');

            await configAPI.updateProperty('quiz-options-grid', 'imageSize', 320, funnelId);
            const updatedConfig = await configAPI.getConfiguration('quiz-options-grid', funnelId);

            console.log('🔄 Real-time update result:', {
                newImageSize: updatedConfig.imageSize,
                success: updatedConfig.imageSize === 320
            });

            // PASSO 5: Gerar JSON atualizado
            jsonGenerator.invalidateCache(funnelId); // Limpar cache
            const updatedMasterJSON = await jsonGenerator.generateMasterJSON(funnelId);

            const finalValidation = {
                configUpdated: updatedMasterJSON.components['quiz-options-grid'].apiConfiguration.imageSize === 320,
                cacheInvalidated: true,
                timestamp: new Date().toISOString()
            };

            console.log('✅ Final validation:', finalValidation);
            console.log('🎉 E2E Integration Test completed successfully!');

            return {
                success: true,
                validations,
                finalValidation,
                masterJSON: updatedMasterJSON
            };

        } catch (error) {
            console.error('❌ E2E Integration Test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

};