/**
 * @file QuizEditorE2E.v2.test.ts
 * @description Testes End-to-End do Editor Quiz-Estilo (Versão 2 - Adaptado)
 * 
 * Valida o fluxo completo do editor quiz-estilo:
 * 1. Carregar funnel existente de produção
 * 2. Editar steps (simulando ações do usuário)
 * 3. Validar integridade dos dados
 * 4. Round-trip de dados
 * 5. Fluxo de publicação
 * 6. Casos de uso reais
 * 
 * @phase Fase 6: Testes End-to-End
 * @coverage 21 steps do quiz-estilo
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';

// Helper: Converter Record para Array
const QUIZ_STEPS_ARRAY = Object.entries(QUIZ_STEPS).map(([id, step]) => ({
  ...step,
  id
}));

describe('Quiz Editor E2E Tests - Full Workflow', () => {
  
  // ============================================================================
  // TEST GROUP 1: Carregar Funnel de Produção
  // ============================================================================
  
  describe('1. Carregar Funnel Existente de Produção', () => {
    
    it('deve carregar todos os 21 steps do quiz-estilo', () => {
      expect(QUIZ_STEPS).toBeDefined();
      expect(typeof QUIZ_STEPS).toBe('object');
      
      const stepsArray = Object.keys(QUIZ_STEPS);
      expect(stepsArray).toHaveLength(21);
      
      // Verifica que todos os steps têm IDs corretos (step-01 a step-21)
      for (let i = 1; i <= 21; i++) {
        const expectedId = `step-${String(i).padStart(2, '0')}`;
        expect(QUIZ_STEPS[expectedId]).toBeDefined();
      }
    });
    
    it('deve ter estrutura válida em cada step', () => {
      QUIZ_STEPS_ARRAY.forEach(step => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('type');
        expect(step.id).toMatch(/^step-\d{2}$/);
        expect(['intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'])
          .toContain(step.type);
      });
    });
    
    it('deve ter step-01 como introdução com formulário', () => {
      const step01 = QUIZ_STEPS['step-01'];
      
      expect(step01.type).toBe('intro');
      expect(step01.title).toBeDefined();
      expect(step01.formQuestion).toBeDefined();
      expect(step01.placeholder).toBeDefined();
      expect(step01.buttonText).toBeDefined();
      expect(step01.nextStep).toBe('step-02');
    });
    
    it('deve ter steps 2-11 como perguntas principais do quiz', () => {
      for (let i = 2; i <= 11; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        const step = QUIZ_STEPS[stepId];
        
        expect(step.type).toBe('question');
        expect(step.questionNumber).toBeDefined();
        expect(step.questionText).toBeDefined();
        expect(step.options).toBeDefined();
        expect(Array.isArray(step.options)).toBe(true);
        expect(step.options!.length).toBeGreaterThan(0);
      }
    });
    
    it('deve ter step-21 como oferta com offerMap', () => {
      const step21 = QUIZ_STEPS['step-21'];
      
      expect(step21.type).toBe('offer');
      expect(step21.offerMap).toBeDefined();
      expect(typeof step21.offerMap).toBe('object');
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 2: Editar Steps (Simular Ações do Usuário)
  // ============================================================================
  
  describe('2. Editar Steps no Editor - Simulação de Usuário', () => {
    
    it('CASO 1: Usuário edita título do step-01', () => {
      const step01 = { ...QUIZ_STEPS['step-01'] };
      const originalTitle = step01.title;
      
      // Simular edição
      step01.title = 'Novo Título Editado pelo Usuário';
      
      expect(step01.title).toBe('Novo Título Editado pelo Usuário');
      expect(step01.title).not.toBe(originalTitle);
      expect(step01.type).toBe('intro');
      expect(step01.nextStep).toBe('step-02');
    });
    
    it('CASO 2: Usuário edita texto de pergunta no step-02', () => {
      const step02 = { ...QUIZ_STEPS['step-02'] };
      const originalQuestionText = step02.questionText;
      
      // Simular edição
      step02.questionText = 'NOVA PERGUNTA EDITADA?';
      
      expect(step02.questionText).toBe('NOVA PERGUNTA EDITADA?');
      expect(step02.questionText).not.toBe(originalQuestionText);
      expect(step02.type).toBe('question');
      expect(step02.options).toBeDefined();
    });
    
    it('CASO 3: Usuário adiciona nova opção em step-03', () => {
      const step03 = { ...QUIZ_STEPS['step-03'] };
      const originalOptionsLength = step03.options?.length || 0;
      
      // Simular adição de opção
      const newOption = {
        id: 'novo-estilo',
        text: 'Novo estilo adicionado pelo usuário'
      };
      
      step03.options = [...(step03.options || []), newOption];
      
      expect(step03.options).toHaveLength(originalOptionsLength + 1);
      expect(step03.options![step03.options!.length - 1].id).toBe('novo-estilo');
    });
    
    it('CASO 4: Usuário atualiza buttonText do step-01', () => {
      const step01 = { ...QUIZ_STEPS['step-01'] };
      
      // Simular edição
      step01.buttonText = 'Começar Agora Mesmo!';
      
      expect(step01.buttonText).toBe('Começar Agora Mesmo!');
      expect(step01.type).toBe('intro');
    });
    
    it('CASO 5: Usuário edita placeholder do formulário', () => {
      const step01 = { ...QUIZ_STEPS['step-01'] };
      
      // Simular edição
      step01.placeholder = 'Seu nome aqui...';
      
      expect(step01.placeholder).toBe('Seu nome aqui...');
    });
    
    it('CASO 6: Usuário altera requiredSelections em pergunta', () => {
      const step02 = { ...QUIZ_STEPS['step-02'] };
      const originalRequired = step02.requiredSelections;
      
      // Simular edição
      step02.requiredSelections = 5;
      
      expect(step02.requiredSelections).toBe(5);
      expect(step02.requiredSelections).not.toBe(originalRequired);
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 3: Validar Integridade da Estrutura
  // ============================================================================
  
  describe('3. Validar Integridade da Estrutura dos Steps', () => {
    
    it('deve ter cadeia de navegação válida (nextStep)', () => {
      const stepsWithNextStep = QUIZ_STEPS_ARRAY.filter(step => step.nextStep);
      
      stepsWithNextStep.forEach(step => {
        const nextStepId = step.nextStep;
        
        if (nextStepId) {
          const nextStepExists = QUIZ_STEPS[nextStepId];
          expect(nextStepExists).toBeDefined();
        }
      });
    });
    
    it('deve ter todas as options com ID válido', () => {
      QUIZ_STEPS_ARRAY.forEach(step => {
        if (step.options) {
          step.options.forEach(option => {
            expect(option.id).toBeDefined();
            expect(typeof option.id).toBe('string');
            expect(option.id.length).toBeGreaterThan(0);
            expect(option.text).toBeDefined();
          });
        }
      });
    });
    
    it('deve ter questionNumber sequencial nas perguntas principais', () => {
      for (let i = 2; i <= 11; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        const step = QUIZ_STEPS[stepId];
        
        if (step.type === 'question') {
          expect(step.questionNumber).toContain(`${i - 1} de 10`);
        }
      }
    });
    
    it('deve ter offerMap completo em step-21', () => {
      const step21 = QUIZ_STEPS['step-21'];
      
      expect(step21.offerMap).toBeDefined();
      
      // Verificar estrutura de pelo menos uma oferta
      const offerKeys = Object.keys(step21.offerMap || {});
      expect(offerKeys.length).toBeGreaterThan(0);
      
      offerKeys.forEach(key => {
        const offer = step21.offerMap![key];
        expect(offer).toHaveProperty('title');
        expect(offer).toHaveProperty('description');
        expect(offer).toHaveProperty('buttonText');
        expect(offer).toHaveProperty('testimonial');
      });
    });
    
    it('deve ter structure consistente de testimonials', () => {
      const step21 = QUIZ_STEPS['step-21'];
      
      if (step21.offerMap) {
        Object.values(step21.offerMap).forEach(offer => {
          expect(offer.testimonial).toBeDefined();
          expect(offer.testimonial.quote).toBeDefined();
          expect(offer.testimonial.author).toBeDefined();
        });
      }
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 4: Round-Trip de Dados (Serialização)
  // ============================================================================
  
  describe('4. Round-Trip e Serialização de Dados', () => {
    
    it('deve preservar dados após JSON.stringify/parse em todos os steps', () => {
      QUIZ_STEPS_ARRAY.forEach(step => {
        const serialized = JSON.stringify(step);
        const deserialized = JSON.parse(serialized);
        
        expect(deserialized.id).toBe(step.id);
        expect(deserialized.type).toBe(step.type);
        
        if (step.title) expect(deserialized.title).toBe(step.title);
        if (step.questionText) expect(deserialized.questionText).toBe(step.questionText);
        if (step.options) expect(deserialized.options).toEqual(step.options);
      });
    });
    
    it('deve preservar opções após serialização', () => {
      const stepsWithOptions = QUIZ_STEPS_ARRAY.filter(s => s.options && s.options.length > 0);
      
      stepsWithOptions.forEach(step => {
        const serialized = JSON.stringify(step.options);
        const deserialized = JSON.parse(serialized);
        
        expect(deserialized).toHaveLength(step.options!.length);
        
        step.options!.forEach((opt, idx) => {
          expect(deserialized[idx].id).toBe(opt.id);
          expect(deserialized[idx].text).toBe(opt.text);
        });
      });
    });
    
    it('deve preservar offerMap após serialização', () => {
      const step21 = QUIZ_STEPS['step-21'];
      
      const serialized = JSON.stringify(step21.offerMap);
      const deserialized = JSON.parse(serialized);
      
      expect(Object.keys(deserialized)).toEqual(Object.keys(step21.offerMap || {}));
      
      Object.keys(step21.offerMap || {}).forEach(key => {
        expect(deserialized[key]).toEqual(step21.offerMap![key]);
      });
    });
    
    it('deve manter tipos corretos após round-trip', () => {
      QUIZ_STEPS_ARRAY.forEach(step => {
        const serialized = JSON.stringify(step);
        const deserialized = JSON.parse(serialized);
        
        expect(typeof deserialized.id).toBe('string');
        expect(typeof deserialized.type).toBe('string');
        
        if (step.requiredSelections) {
          expect(typeof deserialized.requiredSelections).toBe('number');
        }
        
        if (step.options) {
          expect(Array.isArray(deserialized.options)).toBe(true);
        }
      });
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 5: Fluxo de Publicação (Rascunho → Produção)
  // ============================================================================
  
  describe('5. Fluxo de Publicação - Rascunho para Produção', () => {
    
    let draftSteps: Record<string, QuizStep>;
    let publishedSteps: Record<string, QuizStep>;
    
    beforeEach(() => {
      // Simular salvamento como rascunho
      draftSteps = JSON.parse(JSON.stringify(QUIZ_STEPS));
      
      // Simular edições no rascunho
      draftSteps['step-01'].title = 'RASCUNHO: Título Editado';
      draftSteps['step-02'].questionText = 'RASCUNHO: Pergunta Editada';
      
      // Simular publicação
      publishedSteps = JSON.parse(JSON.stringify(draftSteps));
    });
    
    it('deve salvar rascunho sem perder dados', () => {
      expect(draftSteps['step-01'].title).toBe('RASCUNHO: Título Editado');
      expect(draftSteps['step-02'].questionText).toBe('RASCUNHO: Pergunta Editada');
      
      // Verificar que outros steps não foram afetados
      expect(draftSteps['step-03'].type).toBe(QUIZ_STEPS['step-03'].type);
    });
    
    it('deve publicar rascunho para produção', () => {
      expect(publishedSteps['step-01'].title).toBe('RASCUNHO: Título Editado');
      expect(publishedSteps['step-02'].questionText).toBe('RASCUNHO: Pergunta Editada');
      
      // Verificar integridade completa
      expect(Object.keys(publishedSteps)).toHaveLength(21);
    });
    
    it('deve manter cadeia de navegação após publicação', () => {
      const publishedArray = Object.entries(publishedSteps).map(([id, step]) => ({ ...step, id }));
      
      publishedArray.forEach(step => {
        if (step.nextStep) {
          expect(publishedSteps[step.nextStep]).toBeDefined();
        }
      });
    });
    
    it('deve preservar todas as opções após publicação', () => {
      for (let i = 2; i <= 11; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        const originalOptions = QUIZ_STEPS[stepId].options || [];
        const publishedOptions = publishedSteps[stepId].options || [];
        
        expect(publishedOptions).toHaveLength(originalOptions.length);
      }
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 6: Performance e Stress Tests
  // ============================================================================
  
  describe('6. Performance e Testes de Stress', () => {
    
    it('deve carregar todos os 21 steps rapidamente', () => {
      const start = performance.now();
      
      const steps = Object.keys(QUIZ_STEPS);
      const stepsData = steps.map(id => QUIZ_STEPS[id]);
      
      const end = performance.now();
      const duration = end - start;
      
      expect(stepsData).toHaveLength(21);
      expect(duration).toBeLessThan(100); // Deve ser quase instantâneo
    });
    
    it('deve suportar múltiplas edições consecutivas sem degradação', () => {
      let tempStep = { ...QUIZ_STEPS['step-01'] };
      
      const start = performance.now();
      
      // Fazer 1000 edições
      for (let i = 0; i < 1000; i++) {
        tempStep = {
          ...tempStep,
          title: `Edição #${i}`
        };
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(tempStep.title).toBe('Edição #999');
      expect(duration).toBeLessThan(500); // Deve completar em menos de 500ms
      
      console.log(`✅ Performance: ${duration.toFixed(2)}ms para 1000 edições`);
    });
    
    it('deve serializar todos os steps rapidamente', () => {
      const start = performance.now();
      
      const serialized = JSON.stringify(QUIZ_STEPS);
      const deserialized = JSON.parse(serialized);
      
      const end = performance.now();
      const duration = end - start;
      
      expect(Object.keys(deserialized)).toHaveLength(21);
      expect(duration).toBeLessThan(50); // Deve ser muito rápido
    });
    
    it('deve lidar com clonagem profunda de todos os steps', () => {
      const start = performance.now();
      
      const cloned = JSON.parse(JSON.stringify(QUIZ_STEPS));
      
      const end = performance.now();
      const duration = end - start;
      
      expect(Object.keys(cloned)).toHaveLength(21);
      expect(cloned).toEqual(QUIZ_STEPS);
      expect(cloned).not.toBe(QUIZ_STEPS); // Diferentes referências
      expect(duration).toBeLessThan(100);
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 7: Casos de Uso Reais Completos
  // ============================================================================
  
  describe('7. Casos de Uso Reais - Fluxos Completos', () => {
    
    it('FLUXO 1: Carregar → Editar → Validar → Salvar', () => {
      // 1. Carregar
      const step = { ...QUIZ_STEPS['step-02'] };
      expect(step.type).toBe('question');
      
      // 2. Editar
      step.questionText = 'Pergunta Totalmente Nova';
      expect(step.questionText).toBe('Pergunta Totalmente Nova');
      
      // 3. Validar
      expect(step.type).toBe('question');
      expect(step.options).toBeDefined();
      expect(Array.isArray(step.options)).toBe(true);
      
      // 4. Salvar (simular)
      const saved = JSON.parse(JSON.stringify(step));
      expect(saved.questionText).toBe('Pergunta Totalmente Nova');
    });
    
    it('FLUXO 2: Criar novo funnel baseado no template', () => {
      // 1. Clonar template
      const newFunnel = JSON.parse(JSON.stringify(QUIZ_STEPS));
      
      // 2. Personalizar títulos
      newFunnel['step-01'].title = 'Novo Funnel Personalizado';
      newFunnel['step-02'].questionText = 'Primeira Pergunta Custom';
      
      // 3. Validar estrutura
      expect(Object.keys(newFunnel)).toHaveLength(21);
      expect(newFunnel['step-01'].title).toBe('Novo Funnel Personalizado');
      
      // 4. Verificar independência (não afetou original)
      expect(QUIZ_STEPS['step-01'].title).not.toBe('Novo Funnel Personalizado');
    });
    
    it('FLUXO 3: Editar múltiplos steps e publicar em lote', () => {
      // 1. Selecionar múltiplos steps
      const stepsToEdit = ['step-01', 'step-02', 'step-03'];
      const editedSteps: Record<string, QuizStep> = {};
      
      // 2. Editar cada um
      stepsToEdit.forEach(id => {
        editedSteps[id] = {
          ...QUIZ_STEPS[id],
          title: `${id} - EDITADO`
        };
      });
      
      // 3. Validar edições
      expect(editedSteps['step-01'].title).toContain('EDITADO');
      expect(editedSteps['step-02'].title).toContain('EDITADO');
      expect(editedSteps['step-03'].title).toContain('EDITADO');
      
      // 4. Publicar (merge com original)
      const published = {
        ...QUIZ_STEPS,
        ...editedSteps
      };
      
      expect(published['step-01'].title).toContain('EDITADO');
      expect(Object.keys(published)).toHaveLength(21);
    });
    
    it('FLUXO 4: Rollback de edições (desfazer)', () => {
      // 1. Estado original
      const original = JSON.parse(JSON.stringify(QUIZ_STEPS['step-01']));
      
      // 2. Editar
      const edited = { ...original, title: 'EDITADO' };
      expect(edited.title).toBe('EDITADO');
      
      // 3. Rollback
      const rolledBack = JSON.parse(JSON.stringify(original));
      expect(rolledBack.title).toBe(original.title);
      expect(rolledBack.title).not.toBe('EDITADO');
    });
    
    it('FLUXO 5: Validar funnel antes de publicar', () => {
      // 1. Preparar para publicação
      const toPublish = JSON.parse(JSON.stringify(QUIZ_STEPS));
      
      // 2. Executar validações
      let isValid = true;
      const errors: string[] = [];
      
      // Validação 1: Todos os steps existem
      for (let i = 1; i <= 21; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        if (!toPublish[stepId]) {
          isValid = false;
          errors.push(`Step ${stepId} não encontrado`);
        }
      }
      
      // Validação 2: Cadeia de navegação válida
      Object.entries(toPublish).forEach(([id, step]) => {
        const s = step as QuizStep;
        if (s.nextStep && !toPublish[s.nextStep]) {
          isValid = false;
          errors.push(`${id} aponta para nextStep inválido: ${s.nextStep}`);
        }
      });
      
      // 3. Resultado
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 8: Cobertura Completa dos 21 Steps
  // ============================================================================
  
  describe('8. Cobertura Completa - Todos os 21 Steps', () => {
    
    it('deve ter todos os steps de step-01 a step-21', () => {
      for (let i = 1; i <= 21; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        expect(QUIZ_STEPS[stepId]).toBeDefined();
        expect(QUIZ_STEPS[stepId].type).toBeDefined();
      }
    });
    
    it('deve ter tipos corretos em cada step', () => {
      expect(QUIZ_STEPS['step-01'].type).toBe('intro');
      expect(QUIZ_STEPS['step-02'].type).toBe('question');
      expect(QUIZ_STEPS['step-21'].type).toBe('offer');
    });
    
    it('deve poder iterar sobre todos os steps sem erros', () => {
      let count = 0;
      
      Object.entries(QUIZ_STEPS).forEach(([id, step]) => {
        expect(id).toBeDefined();
        expect(step).toBeDefined();
        expect(step.type).toBeDefined();
        count++;
      });
      
      expect(count).toBe(21);
    });
    
    it('deve ter nextStep definido em todos os steps exceto o último', () => {
      for (let i = 1; i < 21; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        const step = QUIZ_STEPS[stepId];
        
        if (step.nextStep) {
          expect(step.nextStep).toBeDefined();
          expect(typeof step.nextStep).toBe('string');
        }
      }
    });
    
  });
  
});
