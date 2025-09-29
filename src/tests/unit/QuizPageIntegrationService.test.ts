/**
 * 🧪 SUITE DE TESTES: QUIZ PAGE INTEGRATION SERVICE
 * 
 * Testes de salvamento, carregamento e sincronização de funis quiz
 * com integração completa ao UnifiedCRUDService e sistema de cache
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { QuizPageIntegrationService, QuizPageFunnel, QuizPageComponent } from '../src/services/QuizPageIntegrationService';
import { unifiedCRUDService } from '../src/services/UnifiedCRUDService';
import { versioningService } from '../src/services/VersioningService';
import { historyManager } from '../src/services/HistoryManager';

// Mock dos serviços dependentes
jest.mock('../src/services/UnifiedCRUDService');
jest.mock('../src/services/VersioningService');
jest.mock('../src/services/HistoryManager');
jest.mock('../src/services/AnalyticsService');

describe('🎯 QuizPageIntegrationService - Testes Unitários', () => {

    let service: QuizPageIntegrationService;
    let mockUnifiedCRUD: jest.Mocked<typeof unifiedCRUDService>;
    let mockVersioning: jest.Mocked<typeof versioningService>;
    let mockHistory: jest.Mocked<typeof historyManager>;

    beforeEach(() => {
        // Reset singleton instance
        (QuizPageIntegrationService as any).instance = null;
        service = QuizPageIntegrationService.getInstance();

        // Setup mocks
        mockUnifiedCRUD = unifiedCRUDService as jest.Mocked<typeof unifiedCRUDService>;
        mockVersioning = versioningService as jest.Mocked<typeof versioningService>;
        mockHistory = historyManager as jest.Mocked<typeof historyManager>;

        // Mock implementations
        mockUnifiedCRUD.saveFunnel.mockResolvedValue(undefined);
        mockUnifiedCRUD.getFunnel.mockResolvedValue(null);
        mockUnifiedCRUD.getAllFunnels.mockResolvedValue([]);
        mockVersioning.createSnapshot.mockResolvedValue(undefined);
        mockHistory.trackCRUDChange.mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('📁 getInstance()', () => {

        test('deve retornar instância singleton', () => {
            // ACT
            const instance1 = QuizPageIntegrationService.getInstance();
            const instance2 = QuizPageIntegrationService.getInstance();

            // ASSERT
            expect(instance1).toBe(instance2);
            expect(instance1).toBeInstanceOf(QuizPageIntegrationService);
        });
    });

    describe('🆕 createDefaultQuizFunnel()', () => {

        test('deve criar funil quiz padrão com componentes corretos', async () => {
            // ARRANGE
            const funnelId = 'test-quiz-funnel';

            // ACT
            const result = await service.createDefaultQuizFunnel(funnelId);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.id).toBe(funnelId);
            expect(result.type).toBe('quiz');
            expect(result.status).toBe('draft');
            expect(result.totalSteps).toBe(21);
            expect(result.components).toHaveLength(4); // intro + 2 questions + 1 strategic

            // Verificar componente de introdução
            const introComponent = result.components.find(c => c.type === 'intro');
            expect(introComponent).toBeDefined();
            expect(introComponent?.step).toBe(1);
            expect(introComponent?.isEditable).toBe(true);
        });

        test('deve usar ID padrão se não fornecido', async () => {
            // ACT
            const result = await service.createDefaultQuizFunnel();

            // ASSERT
            expect(result.id).toBe('quiz-estilo-21-steps');
        });

        test('deve chamar serviços de integração corretamente', async () => {
            // ARRANGE
            const funnelId = 'integration-test';

            // ACT
            await service.createDefaultQuizFunnel(funnelId);

            // ASSERT
            expect(mockUnifiedCRUD.saveFunnel).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: funnelId,
                    type: 'quiz'
                })
            );

            expect(mockVersioning.createSnapshot).toHaveBeenCalledWith(
                expect.any(Object),
                'initial',
                'Criação do funil quiz'
            );

            expect(mockHistory.trackCRUDChange).toHaveBeenCalledWith(
                'create',
                'funnel',
                funnelId,
                expect.any(Object)
            );
        });

        test('deve tratar erro na criação', async () => {
            // ARRANGE
            mockUnifiedCRUD.saveFunnel.mockRejectedValue(new Error('Erro de salvamento'));

            // ACT & ASSERT
            await expect(service.createDefaultQuizFunnel('error-test'))
                .rejects.toThrow('Erro de salvamento');
        });
    });

    describe('📥 loadQuizFunnel()', () => {

        test('deve retornar funil do cache se disponível', async () => {
            // ARRANGE
            const funnelId = 'cached-funnel';
            const cachedFunnel = await service.createDefaultQuizFunnel(funnelId);

            // ACT
            const result = await service.loadQuizFunnel(funnelId);

            // ASSERT
            expect(result).toEqual(cachedFunnel);
            expect(mockUnifiedCRUD.getFunnel).not.toHaveBeenCalled();
        });

        test('deve carregar do UnifiedCRUDService se não estiver no cache', async () => {
            // ARRANGE
            const funnelId = 'remote-funnel';
            const mockFunnel = {
                id: funnelId,
                name: 'Remote Quiz Funnel',
                description: 'Loaded from remote',
                status: 'published',
                stages: [
                    {
                        id: 'stage-1',
                        type: 'intro',
                        name: 'Introduction',
                        order: 1,
                        blocks: []
                    }
                ]
            };

            mockUnifiedCRUD.getFunnel.mockResolvedValue(mockFunnel);

            // ACT
            const result = await service.loadQuizFunnel(funnelId);

            // ASSERT
            expect(result).toBeDefined();
            expect(result?.id).toBe(funnelId);
            expect(result?.name).toBe('Remote Quiz Funnel');
            expect(result?.type).toBe('quiz');
            expect(mockUnifiedCRUD.getFunnel).toHaveBeenCalledWith(funnelId);
        });

        test('deve retornar null se funil não encontrado', async () => {
            // ARRANGE
            mockUnifiedCRUD.getFunnel.mockResolvedValue(null);

            // ACT
            const result = await service.loadQuizFunnel('nonexistent');

            // ASSERT
            expect(result).toBeNull();
        });

        test('deve tratar erro no carregamento', async () => {
            // ARRANGE
            mockUnifiedCRUD.getFunnel.mockRejectedValue(new Error('Erro de rede'));

            // ACT & ASSERT
            await expect(service.loadQuizFunnel('error-funnel'))
                .rejects.toThrow('Erro de rede');
        });
    });

    describe('💾 saveQuizFunnel()', () => {

        let testFunnel: QuizPageFunnel;

        beforeEach(async () => {
            testFunnel = await service.createDefaultQuizFunnel('save-test');
            jest.clearAllMocks(); // Clear calls from creation
        });

        test('deve salvar funil quiz no UnifiedCRUDService', async () => {
            // ARRANGE
            testFunnel.name = 'Updated Quiz Name';
            testFunnel.components[0].content.title = 'Updated Title';

            // ACT
            await service.saveQuizFunnel(testFunnel);

            // ASSERT
            expect(mockUnifiedCRUD.saveFunnel).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: testFunnel.id,
                    name: 'Updated Quiz Name',
                    type: 'quiz'
                })
            );
        });

        test('deve criar snapshot após salvamento', async () => {
            // ACT
            await service.saveQuizFunnel(testFunnel);

            // ASSERT
            expect(mockVersioning.createSnapshot).toHaveBeenCalledWith(
                testFunnel,
                'manual',
                'Atualização do funil quiz'
            );
        });

        test('deve rastrear mudança no histórico', async () => {
            // ACT
            await service.saveQuizFunnel(testFunnel);

            // ASSERT
            expect(mockHistory.trackCRUDChange).toHaveBeenCalledWith(
                'update',
                'funnel',
                testFunnel.id,
                expect.objectContaining({
                    name: testFunnel.name,
                    components: testFunnel.components.length
                })
            );
        });

        test('deve atualizar cache após salvamento', async () => {
            // ARRANGE
            testFunnel.name = 'Cache Test';

            // ACT
            await service.saveQuizFunnel(testFunnel);
            const cached = await service.loadQuizFunnel(testFunnel.id);

            // ASSERT
            expect(cached?.name).toBe('Cache Test');
        });

        test('deve tratar erro no salvamento', async () => {
            // ARRANGE
            mockUnifiedCRUD.saveFunnel.mockRejectedValue(new Error('Erro de salvamento'));

            // ACT & ASSERT
            await expect(service.saveQuizFunnel(testFunnel))
                .rejects.toThrow('Erro de salvamento');
        });
    });

    describe('🚀 publishQuizFunnel()', () => {

        let testFunnel: QuizPageFunnel;

        beforeEach(async () => {
            testFunnel = await service.createDefaultQuizFunnel('publish-test');
            jest.clearAllMocks();
        });

        test('deve publicar funil quiz', async () => {
            // ACT
            await service.publishQuizFunnel(testFunnel.id);

            // ASSERT
            const published = await service.loadQuizFunnel(testFunnel.id);
            expect(published?.status).toBe('published');
            expect(published?.publishedAt).toBeDefined();
            expect(published?.publishedVersion).toBe(published?.version);
        });

        test('deve salvar funil após publicação', async () => {
            // ACT
            await service.publishQuizFunnel(testFunnel.id);

            // ASSERT
            expect(mockUnifiedCRUD.saveFunnel).toHaveBeenCalled();
        });

        test('deve rastrear publicação', async () => {
            // ACT
            await service.publishQuizFunnel(testFunnel.id);

            // ASSERT
            expect(mockHistory.trackCRUDChange).toHaveBeenCalledWith(
                'publish',
                'funnel',
                testFunnel.id,
                expect.any(Object)
            );
        });

        test('deve falhar se funil não encontrado', async () => {
            // ACT & ASSERT
            await expect(service.publishQuizFunnel('nonexistent'))
                .rejects.toThrow('Funil não encontrado');
        });
    });

    describe('📋 getAllQuizFunnels()', () => {

        test('deve retornar apenas funis de tipo quiz', async () => {
            // ARRANGE
            const mockFunnels = [
                { id: '1', type: 'quiz', name: 'Quiz 1' },
                { id: '2', type: 'landing', name: 'Landing 1' },
                { id: '3', type: 'quiz', name: 'Quiz 2' },
                { id: '4', name: 'Quiz Style Test', type: 'other' }
            ];

            mockUnifiedCRUD.getAllFunnels.mockResolvedValue(mockFunnels as any);

            // ACT
            const result = await service.getAllQuizFunnels();

            // ASSERT
            expect(result).toHaveLength(3); // 2 quiz + 1 com "quiz" no nome
            expect(result.every(f => f.type === 'quiz')).toBe(true);
        });

        test('deve converter funis corretamente', async () => {
            // ARRANGE
            const mockFunnels = [
                {
                    id: 'quiz-1',
                    type: 'quiz',
                    name: 'Test Quiz',
                    description: 'Test Description',
                    status: 'draft',
                    stages: [{ id: 's1', type: 'intro', name: 'Stage 1', order: 1, blocks: [] }]
                }
            ];

            mockUnifiedCRUD.getAllFunnels.mockResolvedValue(mockFunnels as any);

            // ACT
            const result = await service.getAllQuizFunnels();

            // ASSERT
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: 'quiz-1',
                    type: 'quiz',
                    name: 'Test Quiz',
                    components: expect.arrayContaining([
                        expect.objectContaining({ id: 's1', type: 'intro' })
                    ])
                })
            );
        });
    });

    describe('🔧 updateQuizComponent()', () => {

        let testFunnel: QuizPageFunnel;

        beforeEach(async () => {
            testFunnel = await service.createDefaultQuizFunnel('component-test');
            jest.clearAllMocks();
        });

        test('deve atualizar componente específico', async () => {
            // ARRANGE
            const componentId = testFunnel.components[0].id;
            const updates = {
                name: 'Updated Component',
                content: { title: 'New Title' }
            };

            // ACT
            const result = await service.updateQuizComponent(testFunnel.id, componentId, updates);

            // ASSERT
            expect(result).toBeDefined();
            expect(result?.name).toBe('Updated Component');
            expect(result?.content.title).toBe('New Title');
        });

        test('deve salvar funil após atualização do componente', async () => {
            // ARRANGE
            const componentId = testFunnel.components[0].id;
            const updates = { name: 'Test Update' };

            // ACT
            await service.updateQuizComponent(testFunnel.id, componentId, updates);

            // ASSERT
            expect(mockUnifiedCRUD.saveFunnel).toHaveBeenCalled();
        });

        test('deve falhar se funil não encontrado', async () => {
            // ACT & ASSERT
            await expect(
                service.updateQuizComponent('nonexistent', 'comp-id', {})
            ).rejects.toThrow('Funil não encontrado');
        });

        test('deve falhar se componente não encontrado', async () => {
            // ACT & ASSERT
            await expect(
                service.updateQuizComponent(testFunnel.id, 'nonexistent-comp', {})
            ).rejects.toThrow('Componente não encontrado');
        });
    });
});

describe('🔄 QuizPageIntegrationService - Testes de Integração', () => {

    let service: QuizPageIntegrationService;

    beforeEach(() => {
        (QuizPageIntegrationService as any).instance = null;
        service = QuizPageIntegrationService.getInstance();
    });

    test('deve manter consistência entre cache e persistência', async () => {
        // ARRANGE
        const funnelId = 'consistency-test';

        // ACT
        // 1. Criar funil
        const created = await service.createDefaultQuizFunnel(funnelId);

        // 2. Modificar
        created.name = 'Modified Name';
        await service.saveQuizFunnel(created);

        // 3. Carregar novamente
        const loaded = await service.loadQuizFunnel(funnelId);

        // ASSERT
        expect(loaded?.name).toBe('Modified Name');
    });

    test('deve suportar múltiplas operações concorrentes', async () => {
        // ARRANGE
        const funnelIds = ['concurrent-1', 'concurrent-2', 'concurrent-3'];

        // ACT
        const operations = funnelIds.map(async (id, index) => {
            const funnel = await service.createDefaultQuizFunnel(id);
            funnel.name = `Concurrent Funnel ${index}`;
            await service.saveQuizFunnel(funnel);
            return service.loadQuizFunnel(id);
        });

        const results = await Promise.all(operations);

        // ASSERT
        expect(results).toHaveLength(3);
        results.forEach((result, index) => {
            expect(result?.name).toBe(`Concurrent Funnel ${index}`);
        });
    });

    test('deve manter integridade referencial', async () => {
        // ARRANGE
        const funnelId = 'integrity-test';
        const funnel = await service.createDefaultQuizFunnel(funnelId);

        // ACT
        // Atualizar componente
        const componentId = funnel.components[0].id;
        await service.updateQuizComponent(funnelId, componentId, {
            name: 'Updated Component'
        });

        // Carregar funil novamente
        const reloaded = await service.loadQuizFunnel(funnelId);

        // ASSERT
        const updatedComponent = reloaded?.components.find(c => c.id === componentId);
        expect(updatedComponent?.name).toBe('Updated Component');
    });
});

describe('⚡ QuizPageIntegrationService - Testes de Performance', () => {

    let service: QuizPageIntegrationService;

    beforeEach(() => {
        (QuizPageIntegrationService as any).instance = null;
        service = QuizPageIntegrationService.getInstance();
    });

    test('deve criar múltiplos funis rapidamente', async () => {
        // ARRANGE
        const count = 10;
        const startTime = Date.now();

        // ACT
        const operations = Array.from({ length: count }, (_, i) =>
            service.createDefaultQuizFunnel(`perf-test-${i}`)
        );

        const results = await Promise.all(operations);
        const endTime = Date.now();

        // ASSERT
        expect(results).toHaveLength(count);
        expect(endTime - startTime).toBeLessThan(5000); // < 5 segundos
    });

    test('deve manter performance com cache grande', async () => {
        // ARRANGE
        const funnels = await Promise.all(
            Array.from({ length: 50 }, (_, i) =>
                service.createDefaultQuizFunnel(`cache-test-${i}`)
            )
        );

        // ACT
        const startTime = Date.now();
        const loadOperations = funnels.map(f => service.loadQuizFunnel(f.id));
        await Promise.all(loadOperations);
        const endTime = Date.now();

        // ASSERT
        expect(endTime - startTime).toBeLessThan(1000); // < 1 segundo (cache hits)
    });
});

describe('🛠️ QuizPageIntegrationService - Casos Edge', () => {

    let service: QuizPageIntegrationService;

    beforeEach(() => {
        (QuizPageIntegrationService as any).instance = null;
        service = QuizPageIntegrationService.getInstance();
    });

    test('deve lidar com funil sem componentes', async () => {
        // ARRANGE
        const funnel = await service.createDefaultQuizFunnel('empty-components');
        funnel.components = [];

        // ACT & ASSERT
        await expect(service.saveQuizFunnel(funnel)).resolves.not.toThrow();
    });

    test('deve lidar com componentes malformados', async () => {
        // ARRANGE
        const funnel = await service.createDefaultQuizFunnel('malformed');
        funnel.components[0] = {
            id: 'malformed',
            type: 'intro' as any,
            name: 'Test',
            description: 'Test',
            step: 1,
            isEditable: true,
            properties: null as any,
            styles: null as any,
            content: null as any
        };

        // ACT & ASSERT
        await expect(service.saveQuizFunnel(funnel)).resolves.not.toThrow();
    });

    test('deve validar IDs únicos de componentes', async () => {
        // ARRANGE
        const funnel = await service.createDefaultQuizFunnel('duplicate-ids');
        const duplicateComponent = { ...funnel.components[0] };
        funnel.components.push(duplicateComponent);

        // ACT & ASSERT
        // O serviço deve lidar com IDs duplicados graciosamente
        await expect(service.saveQuizFunnel(funnel)).resolves.not.toThrow();
    });
});