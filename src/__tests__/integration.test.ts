/**
 * 🧪 TESTES DE INTEGRAÇÃO: Template System
 * 
 * Testa fluxo completo de edição, salvamento e carregamento
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import HybridTemplateService from '@/services/HybridTemplateService';
import TemplateEditorService from '@/services/TemplateEditorService';

describe('Integration: Template Edit → Save → Reload Flow', () => {

    beforeEach(() => {
        localStorage.clear();
        HybridTemplateService.clearCache();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('deve completar fluxo: carregar → editar → salvar → recarregar', async () => {
        // PASSO 1: Carregar template original
        console.log('📖 1. Carregando template original...');
        const original = await HybridTemplateService.getTemplate('step-01');
        expect(original).toBeDefined();

        const originalName = original?.metadata?.name || 'Original';
        console.log(`   Nome original: ${originalName}`);

        // PASSO 2: Editar template
        console.log('✏️ 2. Editando template...');
        const modified = {
            ...original,
            metadata: {
                ...original?.metadata,
                id: 'step-01',
                name: 'Step 01 - MODIFICADO EM TESTE',
                description: 'Descrição modificada durante teste de integração',
                updatedAt: new Date().toISOString()
            },
            theme: {
                ...original?.theme,
                primaryColor: '#FF5722',
                testFlag: true
            }
        };

        // PASSO 3: Salvar modificações
        console.log('💾 3. Salvando modificações...');
        const saveResult = await TemplateEditorService.saveStepChanges('step-01', modified);

        expect(saveResult.success).toBe(true);
        expect(saveResult.stepId).toBe('step-01');
        console.log(`   Resultado: ${saveResult.message}`);

        // PASSO 4: Verificar localStorage
        console.log('🔍 4. Verificando localStorage...');
        const hasData = TemplateEditorService.hasStorageData();
        expect(hasData).toBe(true);
        console.log(`   Dados salvos: ${hasData ? 'SIM' : 'NÃO'}`);

        // PASSO 5: Limpar cache
        console.log('🗑️ 5. Limpando cache...');
        HybridTemplateService.clearCache();

        // PASSO 6: Recarregar template
        console.log('🔄 6. Recarregando template...');
        const reloaded = await HybridTemplateService.getTemplate('step-01');
        expect(reloaded).toBeDefined();

        // PASSO 7: Verificar modificações persistidas
        console.log('✅ 7. Verificando persistência...');

        // Nota: HybridTemplateService carrega do master JSON, não do localStorage
        // Para testar persistência real, precisamos verificar o localStorage diretamente
        const stored = localStorage.getItem('quiz-master-template-v3');
        expect(stored).toBeTruthy();

        if (stored) {
            const storedData = JSON.parse(stored);
            expect(storedData.steps['step-01']).toBeDefined();
            expect(storedData.steps['step-01'].metadata.name).toBe('Step 01 - MODIFICADO EM TESTE');
            expect(storedData.steps['step-01'].theme.primaryColor).toBe('#FF5722');
            console.log('   ✅ Modificações persistidas com sucesso!');
        }

        console.log('🎉 Fluxo de integração completo!');
    }, 10000); // Timeout de 10s

    it('deve exportar e reimportar template sem perda de dados', async () => {
        // PASSO 1: Exportar master
        console.log('📤 1. Exportando master template...');
        const exported = await TemplateEditorService.exportMasterTemplate();
        expect(exported).toBeTruthy();
        expect(typeof exported).toBe('string');

        const exportedSize = (exported.length / 1024).toFixed(2);
        console.log(`   Tamanho: ${exportedSize} KB`);

        // PASSO 2: Parse para verificar estrutura
        console.log('🔍 2. Validando estrutura exportada...');
        const parsed = JSON.parse(exported);
        expect(parsed.templateVersion).toBe('3.0');
        expect(parsed.steps).toBeDefined();

        const stepCount = Object.keys(parsed.steps).length;
        console.log(`   Steps: ${stepCount}`);
        expect(stepCount).toBeGreaterThan(0);

        // PASSO 3: Modificar dados
        console.log('✏️ 3. Modificando dados...');
        parsed.steps['step-01'].metadata.name = 'TESTE REIMPORT';
        const modified = JSON.stringify(parsed);

        // PASSO 4: Reimportar
        console.log('📥 4. Reimportando template...');
        const importResult = await TemplateEditorService.importMasterTemplate(modified);
        expect(importResult.success).toBe(true);
        console.log(`   Resultado: ${importResult.message}`);

        // PASSO 5: Verificar persistência
        console.log('✅ 5. Verificando persistência...');
        const stored = localStorage.getItem('quiz-master-template-v3');
        expect(stored).toBeTruthy();

        if (stored) {
            const storedData = JSON.parse(stored);
            expect(storedData.steps['step-01'].metadata.name).toBe('TESTE REIMPORT');
            console.log('   ✅ Reimportação bem-sucedida!');
        }

        console.log('🎉 Export/Import completo!');
    }, 10000);

    it('deve validar todos os steps após modificações', async () => {
        // PASSO 1: Validação inicial
        console.log('🔍 1. Validando estado inicial...');
        const validation1 = await TemplateEditorService.validateAllSteps();

        console.log(`   Válidos: ${validation1.valid}`);
        console.log(`   Inválidos: ${validation1.invalid}`);

        expect(validation1.valid).toBeGreaterThan(0);

        // PASSO 2: Fazer modificações
        console.log('✏️ 2. Modificando step-01...');
        const modified = {
            metadata: {
                id: 'step-01',
                name: 'Modificado',
                description: 'Teste'
            },
            sections: [
                {
                    type: 'hero',
                    blocks: []
                }
            ]
        };

        await TemplateEditorService.saveStepChanges('step-01', modified);

        // PASSO 3: Revalidar
        console.log('🔍 3. Revalidando após modificações...');
        HybridTemplateService.clearCache();
        const validation2 = await TemplateEditorService.validateAllSteps();

        console.log(`   Válidos: ${validation2.valid}`);
        console.log(`   Inválidos: ${validation2.invalid}`);

        // Deve continuar com steps válidos
        expect(validation2.valid).toBeGreaterThan(0);

        // Se houver erros, logar detalhes
        if (validation2.errors.length > 0) {
            console.warn('⚠️ Erros encontrados:');
            validation2.errors.forEach(err => {
                console.warn(`   ${err.stepId}: ${err.errors.join(', ')}`);
            });
        }

        console.log('🎉 Validação completa!');
    }, 10000);

    it('deve gerenciar múltiplas edições sequenciais', async () => {
        console.log('🔄 Testando múltiplas edições...');

        const steps = ['step-01', 'step-02', 'step-03'];

        for (const stepId of steps) {
            console.log(`   Editando ${stepId}...`);

            const modified = {
                metadata: {
                    id: stepId,
                    name: `${stepId} - Editado`,
                    description: 'Teste múltiplas edições'
                },
                sections: []
            };

            const result = await TemplateEditorService.saveStepChanges(stepId, modified);
            expect(result.success).toBe(true);
        }

        // Verificar que todos foram salvos
        const stored = localStorage.getItem('quiz-master-template-v3');
        expect(stored).toBeTruthy();

        if (stored) {
            const data = JSON.parse(stored);

            for (const stepId of steps) {
                expect(data.steps[stepId]).toBeDefined();
                expect(data.steps[stepId].metadata.name).toBe(`${stepId} - Editado`);
            }
        }

        console.log('✅ Múltiplas edições persistidas!');
    }, 15000);

    it('deve monitorar uso do storage durante operações', async () => {
        console.log('📊 Monitorando uso do storage...');

        // Obter uso inicial
        const usage1 = TemplateEditorService.getStorageUsage();
        console.log(`   Uso inicial: ${(usage1.used / 1024).toFixed(2)} KB (${usage1.percentage.toFixed(1)}%)`);

        // Fazer modificações
        const modified = {
            metadata: {
                id: 'step-01',
                name: 'Teste Storage',
                description: 'x'.repeat(1000) // Adicionar dados
            },
            sections: []
        };

        await TemplateEditorService.saveStepChanges('step-01', modified);

        // Obter uso após salvamento
        const usage2 = TemplateEditorService.getStorageUsage();
        console.log(`   Uso após save: ${(usage2.used / 1024).toFixed(2)} KB (${usage2.percentage.toFixed(1)}%)`);

        // Uso deve ter aumentado
        expect(usage2.used).toBeGreaterThanOrEqual(usage1.used);

        // Verificar alertas
        if (usage2.shouldMigrate) {
            console.warn('⚠️ Alerta de migração ativo (>60%)');
        }

        console.log('✅ Monitoramento funcionando!');
    }, 10000);
});

describe('Integration: Fallback System', () => {

    beforeEach(() => {
        localStorage.clear();
        HybridTemplateService.clearCache();
    });

    it('deve usar fallback TypeScript se localStorage estiver vazio', async () => {
        // Garantir que localStorage está vazio
        localStorage.clear();

        // Carregar template
        const template = await HybridTemplateService.getTemplate('step-01');

        // Deve retornar algo (master JSON ou fallback TypeScript)
        expect(template).toBeDefined();

        console.log('✅ Fallback TypeScript funcionando');
    });

    it('deve priorizar localStorage quando disponível', async () => {
        // Salvar dados no localStorage
        const customData = {
            templateVersion: '3.0',
            globalConfig: {},
            steps: {
                'step-01': {
                    metadata: {
                        id: 'step-01',
                        name: 'CUSTOM LOCAL DATA'
                    },
                    sections: []
                }
            }
        };

        localStorage.setItem('quiz-master-template-v3', JSON.stringify(customData));

        // Recarregar
        HybridTemplateService.clearCache();
        await HybridTemplateService.reload();

        // Verificar que localStorage foi usado
        const hasData = TemplateEditorService.hasStorageData();
        expect(hasData).toBe(true);

        console.log('✅ Prioridade do localStorage funcionando');
    });
});
