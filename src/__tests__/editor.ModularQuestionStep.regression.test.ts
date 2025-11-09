/**
 * 🔒 TESTES DE REGRESSÃO: Garantir que ModularQuestionStep não é usado
 * 
 * Este arquivo contém testes que verificam que a correção crítica foi aplicada
 * corretamente e que o código deprecado (ModularQuestionStep) não está sendo usado.
 * 
 * VALIDAÇÕES:
 * 1. ModularQuestionStep retorna null (deprecado)
 * 2. ProductionStepsRegistry NÃO importa de quiz-modular
 * 3. BlockTypeRenderer é usado em todos os adapters
 * 4. Código legado não está presente no código de produção
 * 5. Imports dinâmicos (require) não são usados
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ============================================================================
// SUITE 1: Validação de Componentes Deprecados
// ============================================================================

describe('🔒 REGRESSÃO: Componentes Deprecados', () => {
    
    it('ModularQuestionStep deve retornar null', () => {
        const { ModularQuestionStep } = require('@/components/quiz-modular');
        
        const result = ModularQuestionStep({
            data: { stepId: 'step-02', answers: {} },
            blocks: []
        });
        
        // ✅ VALIDAÇÃO: Componente deprecado retorna null
        expect(result).toBeNull();
    });

    it('ModularStrategicQuestionStep deve retornar null', () => {
        const { ModularStrategicQuestionStep } = require('@/components/quiz-modular');
        
        const result = ModularStrategicQuestionStep({
            data: { stepId: 'step-13', answers: {} },
            blocks: []
        });
        
        // ✅ VALIDAÇÃO: Componente deprecado retorna null
        expect(result).toBeNull();
    });

    it('quiz-modular/index.ts deve ter warnings de deprecação', () => {
        const filePath = resolve(__dirname, '../../components/core/quiz-modular/index.ts');
        const content = readFileSync(filePath, 'utf-8');

        // ✅ VALIDAÇÃO: Warnings de deprecação estão presentes
        expect(content).toContain('⚠️ DEPRECATED');
        expect(content).toContain('console.warn');
        expect(content).toContain('return null');
    });
});

// ============================================================================
// SUITE 2: Validação de Imports Corretos
// ============================================================================

describe('✅ CORREÇÃO: Imports Corretos no ProductionStepsRegistry', () => {
    
    const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
    
    let registryContent: string;
    
    beforeAll(() => {
        registryContent = readFileSync(registryPath, 'utf-8');
    });

    it('NÃO deve importar de @/components/quiz-modular', () => {
        // ✅ VALIDAÇÃO: Não há imports de quiz-modular
        expect(registryContent).not.toContain("from '@/components/quiz-modular'");
        expect(registryContent).not.toContain('from "@/components/quiz-modular"');
    });

    it('NÃO deve usar require para importar quiz-modular', () => {
        // ✅ VALIDAÇÃO: Não há require dinâmico de quiz-modular
        expect(registryContent).not.toContain("require('@/components/quiz-modular')");
        expect(registryContent).not.toContain('require("@/components/quiz-modular")');
    });

    it('NÃO deve referenciar ModularQuestionStep', () => {
        // ✅ VALIDAÇÃO: Não há referências a ModularQuestionStep
        expect(registryContent).not.toContain('ModularQuestionStep');
    });

    it('NÃO deve referenciar ModularStrategicQuestionStep', () => {
        // ✅ VALIDAÇÃO: Não há referências a ModularStrategicQuestionStep
        expect(registryContent).not.toContain('ModularStrategicQuestionStep');
    });

    it('DEVE importar BlockTypeRenderer', () => {
        // ✅ VALIDAÇÃO: BlockTypeRenderer é importado corretamente
        expect(registryContent).toContain('BlockTypeRenderer');
        expect(registryContent).toContain('@/components/editor/quiz/renderers/BlockTypeRenderer');
    });

    it('DEVE usar React.lazy para BlockTypeRenderer', () => {
        // ✅ VALIDAÇÃO: Lazy loading está implementado
        expect(registryContent).toContain('React.lazy');
        expect(registryContent).toContain('import(');
    });

    it('DEVE usar Suspense com fallback', () => {
        // ✅ VALIDAÇÃO: Suspense está sendo usado
        expect(registryContent).toContain('Suspense');
        expect(registryContent).toContain('fallback');
    });

    it('DEVE ter LoadingSpinner para estados de carregamento', () => {
        // ✅ VALIDAÇÃO: Loading states estão implementados
        expect(registryContent).toContain('LoadingSpinner');
        expect(registryContent).toContain('Carregando pergunta');
    });

    it('DEVE ter ErrorMessage para estados de erro', () => {
        // ✅ VALIDAÇÃO: Error states estão implementados
        expect(registryContent).toContain('ErrorMessage');
        expect(registryContent).toContain('Nenhum bloco encontrado');
    });
});

// ============================================================================
// SUITE 3: Validação da Estrutura de Adapters
// ============================================================================

describe('🏗️ ESTRUTURA: Adapters Corrigidos', () => {
    
    const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
    let registryContent: string;
    
    beforeAll(() => {
        registryContent = readFileSync(registryPath, 'utf-8');
    });

    it('QuestionStepAdapter deve usar loadTemplate', () => {
        // ✅ VALIDAÇÃO: Template loading está implementado
        expect(registryContent).toContain('loadTemplate');
        expect(registryContent).toContain('setTemplateBlocks');
        expect(registryContent).toContain('setLoading');
    });

    it('QuestionStepAdapter deve ter useState para templateBlocks', () => {
        // ✅ VALIDAÇÃO: State management correto
        expect(registryContent).toMatch(/useState<.*\[\]>/);
        expect(registryContent).toContain('templateBlocks');
    });

    it('QuestionStepAdapter deve mapear blocos para BlockTypeRenderer', () => {
        // ✅ VALIDAÇÃO: Rendering correto dos blocos
        expect(registryContent).toContain('templateBlocks.map');
        expect(registryContent).toContain('<BlockTypeRenderer');
    });

    it('QuestionStepAdapter deve passar sessionData corretamente', () => {
        // ✅ VALIDAÇÃO: SessionData formatado corretamente
        expect(registryContent).toContain('sessionData={{');
        expect(registryContent).toContain('answers:');
        expect(registryContent).toContain('userName:');
    });

    it('QuestionStepAdapter deve ter onUpdate callback', () => {
        // ✅ VALIDAÇÃO: Callbacks estão implementados
        expect(registryContent).toContain('onUpdate={(blockId, updates)');
        expect(registryContent).toContain('updates.answers');
        expect(registryContent).toContain('onSave');
    });

    it('QuestionStepAdapter deve suportar modo editable e preview', () => {
        // ✅ VALIDAÇÃO: Modos corretos implementados
        expect(registryContent).toContain('mode={isEditable');
        expect(registryContent).toMatch(/['"]editable['"]/);
        expect(registryContent).toMatch(/['"]preview['"]/);
    });

    it('StrategicQuestionStepAdapter deve ter mesma estrutura que QuestionStepAdapter', () => {
        // ✅ VALIDAÇÃO: Strategic adapter foi corrigido também
        const strategicAdapterMatch = registryContent.match(/export const StrategicQuestionStepAdapter.*?\};/s);
        expect(strategicAdapterMatch).toBeTruthy();
        
        if (strategicAdapterMatch) {
            const strategicCode = strategicAdapterMatch[0];
            expect(strategicCode).toContain('loadTemplate');
            expect(strategicCode).toContain('BlockTypeRenderer');
            expect(strategicCode).not.toContain('ModularStrategicQuestionStep');
        }
    });
});

// ============================================================================
// SUITE 4: Validação de Outros Arquivos Críticos
// ============================================================================

describe('📁 ARQUIVOS: Validação de Código de Produção', () => {
    
    it('UnifiedStepRenderer NÃO deve importar de quiz-modular', () => {
        const filePath = resolve(__dirname, '../../components/editor/unified/UnifiedStepRenderer.tsx');
        const content = readFileSync(filePath, 'utf-8');

        // ✅ VALIDAÇÃO: UnifiedStepRenderer usa ProductionStepsRegistry
        expect(content).not.toContain("from '@/components/quiz-modular'");
        expect(content).not.toContain('ModularQuestionStep');
    });

    it('QuizApp NÃO deve usar componentes deprecados', () => {
        const filePath = resolve(__dirname, '../../components/quiz/QuizApp.tsx');
        const content = readFileSync(filePath, 'utf-8');

        // ✅ VALIDAÇÃO: QuizApp não usa código legado
        expect(content).not.toContain("require('@/components/quiz-modular')");
        expect(content).not.toContain('ModularQuestionStep');
    });

    it('main.tsx NÃO deve ter imports de quiz-modular', () => {
        const filePath = resolve(__dirname, '../../main.tsx');
        const content = readFileSync(filePath, 'utf-8');

        // ✅ VALIDAÇÃO: Entry point limpo
        expect(content).not.toContain('@/components/quiz-modular');
    });
});

// ============================================================================
// SUITE 5: Validação de Padrões de Código
// ============================================================================

describe('🎨 PADRÕES: Code Quality', () => {
    
    const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
    let registryContent: string;
    
    beforeAll(() => {
        registryContent = readFileSync(registryPath, 'utf-8');
    });

    it('NÃO deve ter comentários // TODO relacionados à correção', () => {
        // ✅ VALIDAÇÃO: Todos os TODOs foram resolvidos
        expect(registryContent).not.toContain('// TODO: Fix ModularQuestionStep');
        expect(registryContent).not.toContain('// FIXME: ModularQuestionStep');
    });

    it('NÃO deve ter console.log de debug', () => {
        // ✅ VALIDAÇÃO: Código limpo sem debug logs
        const debugLogs = registryContent.match(/console\.log/g);
        expect(debugLogs).toBeNull();
    });

    it('DEVE ter comentários explicativos nos adapters', () => {
        // ✅ VALIDAÇÃO: Código documentado
        expect(registryContent).toContain('/**');
        expect(registryContent).toContain('*/');
    });

    it('DEVE ter tratamento de erro para loadTemplate', () => {
        // ✅ VALIDAÇÃO: Error handling implementado
        expect(registryContent).toContain('catch');
        expect(registryContent).toContain('console.error');
    });

    it('DEVE usar TypeScript types corretamente', () => {
        // ✅ VALIDAÇÃO: Types estão declarados
        expect(registryContent).toContain(': React.FC');
        expect(registryContent).toContain('interface');
    });
});

// ============================================================================
// SUITE 6: Validação de Integridade do Sistema
// ============================================================================

describe('🔐 INTEGRIDADE: Sistema Completo', () => {
    
    it('Todos os 6 adapters devem estar exportados', async () => {
        const registry = await import('@/components/step-registry/ProductionStepsRegistry');

        // ✅ VALIDAÇÃO: Todos os adapters existem
        expect(registry.IntroStepAdapter).toBeDefined();
        expect(registry.QuestionStepAdapter).toBeDefined();
        expect(registry.TransitionStepAdapter).toBeDefined();
        expect(registry.StrategicQuestionStepAdapter).toBeDefined();
        expect(registry.ResultStepAdapter).toBeDefined();
        expect(registry.OfferStepAdapter).toBeDefined();
    });

    it('BlockTypeRenderer deve estar acessível', async () => {
        const { BlockTypeRenderer } = await import('@/components/editor/quiz/renderers/BlockTypeRenderer');

        // ✅ VALIDAÇÃO: BlockTypeRenderer existe
        expect(BlockTypeRenderer).toBeDefined();
        expect(typeof BlockTypeRenderer).toBe('function');
    });

    it('loadTemplate deve estar acessível', async () => {
        const { loadTemplate } = await import('@/templates/imports');

        // ✅ VALIDAÇÃO: loadTemplate existe
        expect(loadTemplate).toBeDefined();
        expect(typeof loadTemplate).toBe('function');
    });

    it('Componentes de UI (LoadingSpinner, ErrorMessage) devem existir', async () => {
        const ui = await import('@/components/ui');

        // ✅ VALIDAÇÃO: Componentes de UI existem
        expect(ui.LoadingSpinner).toBeDefined();
        expect(ui.ErrorMessage).toBeDefined();
    });
});

// ============================================================================
// SUITE 7: Testes de Smoke (Validação Rápida)
// ============================================================================

describe('💨 SMOKE: Validação Rápida de Correção', () => {
    
    it('✅ CORREÇÃO APLICADA: QuestionStepAdapter não usa ModularQuestionStep', () => {
        const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
        const content = readFileSync(registryPath, 'utf-8');

        // ✅ VALIDAÇÃO FINAL: Correção foi aplicada
        expect(content).not.toContain('ModularQuestionStep');
        expect(content).toContain('BlockTypeRenderer');
        expect(content).toContain('loadTemplate');
        expect(content).toContain('React.lazy');
        expect(content).toContain('Suspense');
    });

    it('✅ CORREÇÃO APLICADA: StrategicQuestionStepAdapter não usa ModularStrategicQuestionStep', () => {
        const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
        const content = readFileSync(registryPath, 'utf-8');

        // ✅ VALIDAÇÃO FINAL: Correção foi aplicada
        expect(content).not.toContain('ModularStrategicQuestionStep');
        expect(content).toContain('BlockTypeRenderer');
    });

    it('✅ NENHUMA REGRESSÃO: quiz-modular ainda existe mas está deprecado', () => {
        const { ModularQuestionStep, ModularStrategicQuestionStep } = require('@/components/quiz-modular');

        // ✅ VALIDAÇÃO: Componentes deprecados ainda existem mas retornam null
        expect(ModularQuestionStep({})).toBeNull();
        expect(ModularStrategicQuestionStep({})).toBeNull();
    });

    it('✅ SISTEMA FUNCIONAL: ProductionStepsRegistry pode ser importado sem erros', async () => {
        // ✅ VALIDAÇÃO: Import não gera erros
        const registry = await import('@/components/step-registry/ProductionStepsRegistry');
        expect(registry).toBeDefined();
    });
});

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

describe('📊 RELATÓRIO: Status da Correção', () => {
    
    it('deve gerar relatório de status', () => {
        const registryPath = resolve(__dirname, '../../components/step-registry/ProductionStepsRegistry.tsx');
        const content = readFileSync(registryPath, 'utf-8');

        const report = {
            deprecated_components_removed: !content.includes('ModularQuestionStep'),
            block_type_renderer_used: content.includes('BlockTypeRenderer'),
            lazy_loading_implemented: content.includes('React.lazy'),
            error_handling_present: content.includes('catch') && content.includes('ErrorMessage'),
            loading_states_present: content.includes('LoadingSpinner'),
            suspense_implemented: content.includes('Suspense'),
            session_data_formatted: content.includes('sessionData={{'),
            template_loading_present: content.includes('loadTemplate'),
        };

        console.log('\n📊 RELATÓRIO DE CORREÇÃO:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Componentes deprecados removidos:', report.deprecated_components_removed);
        console.log('✅ BlockTypeRenderer usado:', report.block_type_renderer_used);
        console.log('✅ Lazy loading implementado:', report.lazy_loading_implemented);
        console.log('✅ Error handling presente:', report.error_handling_present);
        console.log('✅ Loading states presente:', report.loading_states_present);
        console.log('✅ Suspense implementado:', report.suspense_implemented);
        console.log('✅ SessionData formatado:', report.session_data_formatted);
        console.log('✅ Template loading presente:', report.template_loading_present);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // ✅ VALIDAÇÃO FINAL: Todos os critérios atendidos
        expect(Object.values(report).every(v => v === true)).toBe(true);
    });
});
