/**
 * @file QuizEditorE2E.test.ts
 * @description Testes End-to-End do Editor Quiz-Estilo
 * 
 * Valida o fluxo completo do editor:
 * 1. Carregar funnel existente de produção
 * 2. Editar steps (simulando ações do usuário)
 * 3. Validar integridade dos dados
 * 4. Salvar como rascunho
 * 5. Publicar para produção
 * 6. Verificar round-trip de dados
 * 
 * @phase Fase 6: Testes End-to-End
 * @coverage 21 steps do quiz-estilo
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QUIZ_STEPS } from '@/data/quiz';
import { 
  convertStepToBlocks, 
  convertBlocksToStep, 
  validateRoundTrip 
} from '@/utils/quizConversionUtils';
import { 
  validateCompleteFunnel, 
  validateStyleIds, 
  validateNextStep, 
  validateOfferMap, 
  validateFormInput 
} from '@/utils/quizValidationUtils';
import type { QuizStep } from '@/types/quiz';
import type { Block } from '@/types/editor';

describe('Quiz Editor E2E Tests', () => {
  
  // ============================================================================
  // TEST GROUP 1: Carregar Funnel de Produção
  // ============================================================================
  
  describe('1. Carregar Funnel Existente', () => {
    
    it('deve carregar todos os 21 steps do quiz-estilo', () => {
      expect(QUIZ_STEPS).toBeDefined();
      expect(Array.isArray(QUIZ_STEPS)).toBe(true);
      expect(QUIZ_STEPS.length).toBe(21);
      
      // Verifica que todos os steps têm IDs corretos (step-01 a step-21)
      QUIZ_STEPS.forEach((step, index) => {
        const expectedId = `step-${String(index + 1).padStart(2, '0')}`;
        expect(step.id).toBe(expectedId);
      });
    });
    
    it('deve ter estrutura válida em cada step', () => {
      QUIZ_STEPS.forEach(step => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('blocks');
        expect(Array.isArray(step.blocks)).toBe(true);
        expect(step.blocks.length).toBeGreaterThan(0);
      });
    });
    
    it('deve converter todos os steps para blocos sem erros', () => {
      QUIZ_STEPS.forEach(step => {
        const blocks = convertStepToBlocks(step);
        
        expect(blocks).toBeDefined();
        expect(Array.isArray(blocks)).toBe(true);
        expect(blocks.length).toBeGreaterThan(0);
        
        // Verifica que cada bloco tem estrutura válida
        blocks.forEach(block => {
          expect(block).toHaveProperty('id');
          expect(block).toHaveProperty('type');
          expect(block).toHaveProperty('properties');
        });
      });
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 2: Editar Steps (Simular Ações do Usuário)
  // ============================================================================
  
  describe('2. Editar Steps no Editor', () => {
    
    it('deve editar step-01 (FormInput) - alterar campos', () => {
      const step01 = QUIZ_STEPS[0];
      const blocks = convertStepToBlocks(step01);
      
      // Simular edição: adicionar novo campo customizado
      const formInputBlock = blocks.find(b => b.type === 'form-input');
      expect(formInputBlock).toBeDefined();
      
      if (formInputBlock) {
        formInputBlock.properties.fields = [
          ...(formInputBlock.properties.fields || []),
          {
            type: 'email',
            label: 'E-mail Corporativo',
            placeholder: 'seu@email.com',
            required: true,
            name: 'corporateEmail'
          }
        ];
        
        // Converter de volta para step
        const editedStep = convertBlocksToStep(step01.id, blocks);
        
        expect(editedStep).toBeDefined();
        expect(editedStep.blocks).toBeDefined();
        
        // Verificar que o campo foi adicionado
        const editedFormInput = editedStep.blocks.find((b: Block) => b.type === 'form-input');
        expect(editedFormInput?.properties.fields).toHaveLength(
          (formInputBlock.properties.fields || []).length
        );
      }
    });
    
    it('deve editar step-02 (QuizOptions) - alterar opções', () => {
      const step02 = QUIZ_STEPS[1];
      const blocks = convertStepToBlocks(step02);
      
      // Simular edição: alterar título de uma opção
      const quizOptionsBlock = blocks.find(b => b.type === 'quiz-options');
      expect(quizOptionsBlock).toBeDefined();
      
      if (quizOptionsBlock && quizOptionsBlock.properties.options) {
        const originalTitle = quizOptionsBlock.properties.options[0].title;
        quizOptionsBlock.properties.options[0].title = 'Novo Título Editado';
        
        // Converter de volta
        const editedStep = convertBlocksToStep(step02.id, blocks);
        const editedBlock = editedStep.blocks.find((b: Block) => b.type === 'quiz-options');
        
        expect(editedBlock?.properties.options[0].title).toBe('Novo Título Editado');
        expect(editedBlock?.properties.options[0].title).not.toBe(originalTitle);
      }
    });
    
    it('deve editar step-10 (Testimonial) - trocar depoimento', () => {
      const step10 = QUIZ_STEPS[9];
      const blocks = convertStepToBlocks(step10);
      
      // Simular edição: trocar texto do depoimento
      const testimonialBlock = blocks.find(b => b.type === 'testimonial');
      expect(testimonialBlock).toBeDefined();
      
      if (testimonialBlock) {
        testimonialBlock.properties.text = 'Novo depoimento muito positivo!';
        testimonialBlock.properties.author = 'Cliente VIP';
        
        // Converter de volta
        const editedStep = convertBlocksToStep(step10.id, blocks);
        const editedBlock = editedStep.blocks.find((b: Block) => b.type === 'testimonial');
        
        expect(editedBlock?.properties.text).toBe('Novo depoimento muito positivo!');
        expect(editedBlock?.properties.author).toBe('Cliente VIP');
      }
    });
    
    it('deve editar step-21 (OfferMap) - atualizar ofertas', () => {
      const step21 = QUIZ_STEPS[20];
      const blocks = convertStepToBlocks(step21);
      
      // Simular edição: atualizar URL de oferta
      const offerMapBlock = blocks.find(b => b.type === 'offer-map');
      expect(offerMapBlock).toBeDefined();
      
      if (offerMapBlock && offerMapBlock.properties.offerMap) {
        const newOfferMap = { ...offerMapBlock.properties.offerMap };
        newOfferMap['romantico-baixo'] = 'https://nova-oferta-editada.com/romantico-baixo';
        offerMapBlock.properties.offerMap = newOfferMap;
        
        // Converter de volta
        const editedStep = convertBlocksToStep(step21.id, blocks);
        const editedBlock = editedStep.blocks.find((b: Block) => b.type === 'offer-map');
        
        expect(editedBlock?.properties.offerMap?.['romantico-baixo']).toBe(
          'https://nova-oferta-editada.com/romantico-baixo'
        );
      }
    });
    
    it('deve preservar variáveis {userName} após edição', () => {
      // Encontrar step com variável {userName}
      const stepWithVariable = QUIZ_STEPS.find(step => {
        const blocks = convertStepToBlocks(step);
        return blocks.some(block => 
          JSON.stringify(block).includes('{userName}')
        );
      });
      
      if (stepWithVariable) {
        const blocks = convertStepToBlocks(stepWithVariable);
        
        // Simular edição: alterar outro campo mas preservar variável
        const headingBlock = blocks.find(b => b.type === 'heading');
        if (headingBlock) {
          const originalText = headingBlock.properties.text;
          expect(originalText).toContain('{userName}');
          
          // Adicionar texto mas manter variável
          headingBlock.properties.text = `${originalText} - Atualizado!`;
          
          // Converter de volta
          const editedStep = convertBlocksToStep(stepWithVariable.id, blocks);
          const editedHeading = editedStep.blocks.find((b: Block) => b.type === 'heading');
          
          expect(editedHeading?.properties.text).toContain('{userName}');
          expect(editedHeading?.properties.text).toContain('Atualizado!');
        }
      }
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 3: Validar Integridade Após Edição
  // ============================================================================
  
  describe('3. Validar Integridade Após Edição', () => {
    
    it('deve validar funnel completo sem erros', () => {
      const validation = validateCompleteFunnel(QUIZ_STEPS);
      
      expect(validation.isValid).toBe(true);
      expect(validation.totalErrors).toBe(0);
      expect(validation.steps).toHaveLength(21);
    });
    
    it('deve validar style IDs em todas as opções', () => {
      QUIZ_STEPS.forEach(step => {
        const validation = validateStyleIds(step);
        
        if (validation.errors.length > 0) {
          console.log(`Erros em ${step.id}:`, validation.errors);
        }
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });
    });
    
    it('deve validar nextStep em todos os steps', () => {
      QUIZ_STEPS.forEach(step => {
        const validation = validateNextStep(step, QUIZ_STEPS);
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });
    });
    
    it('deve validar offerMap em step-21', () => {
      const step21 = QUIZ_STEPS[20];
      const validation = validateOfferMap(step21);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(0);
    });
    
    it('deve validar formInput em step-01', () => {
      const step01 = QUIZ_STEPS[0];
      const validation = validateFormInput(step01);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 4: Round-Trip (Salvar e Recuperar)
  // ============================================================================
  
  describe('4. Round-Trip de Dados', () => {
    
    it('deve fazer round-trip completo de todos os 21 steps', () => {
      QUIZ_STEPS.forEach(step => {
        const roundTripValidation = validateRoundTrip(step);
        
        if (!roundTripValidation.isValid) {
          console.error(`Round-trip falhou em ${step.id}:`, roundTripValidation.errors);
        }
        
        expect(roundTripValidation.isValid).toBe(true);
        expect(roundTripValidation.errors).toHaveLength(0);
      });
    });
    
    it('deve preservar propriedades críticas após round-trip', () => {
      QUIZ_STEPS.forEach(step => {
        const blocks = convertStepToBlocks(step);
        const reconstructed = convertBlocksToStep(step.id, blocks);
        
        // Verificar propriedades essenciais
        expect(reconstructed.id).toBe(step.id);
        expect(reconstructed.title).toBe(step.title);
        expect(reconstructed.blocks.length).toBe(blocks.length);
        
        // Verificar tipos de blocos
        step.blocks.forEach((originalBlock, index) => {
          expect(reconstructed.blocks[index].type).toBe(originalBlock.type);
        });
      });
    });
    
    it('deve preservar estrutura de opções em QuizOptions', () => {
      const stepsWithOptions = QUIZ_STEPS.filter(step => 
        step.blocks.some(b => b.type === 'quiz-options')
      );
      
      stepsWithOptions.forEach(step => {
        const blocks = convertStepToBlocks(step);
        const reconstructed = convertBlocksToStep(step.id, blocks);
        
        const originalOptions = step.blocks.find(b => b.type === 'quiz-options');
        const reconstructedOptions = reconstructed.blocks.find(b => b.type === 'quiz-options');
        
        if (originalOptions && reconstructedOptions) {
          expect(reconstructedOptions.properties.options).toHaveLength(
            originalOptions.properties.options?.length || 0
          );
          
          originalOptions.properties.options?.forEach((opt, idx) => {
            expect(reconstructedOptions.properties.options?.[idx].id).toBe(opt.id);
            expect(reconstructedOptions.properties.options?.[idx].title).toBe(opt.title);
          });
        }
      });
    });
    
    it('deve preservar offerMap completo em step-21', () => {
      const step21 = QUIZ_STEPS[20];
      const blocks = convertStepToBlocks(step21);
      const reconstructed = convertBlocksToStep(step21.id, blocks);
      
      const originalOfferMap = step21.blocks.find(b => b.type === 'offer-map');
      const reconstructedOfferMap = reconstructed.blocks.find(b => b.type === 'offer-map');
      
      expect(reconstructedOfferMap).toBeDefined();
      expect(reconstructedOfferMap?.properties.offerMap).toBeDefined();
      
      // Verificar todas as 4 variações obrigatórias
      const requiredKeys = ['romantico-baixo', 'romantico-alto', 'dramatico-baixo', 'dramatico-alto'];
      requiredKeys.forEach(key => {
        expect(reconstructedOfferMap?.properties.offerMap).toHaveProperty(key);
        expect(reconstructedOfferMap?.properties.offerMap?.[key]).toBe(
          originalOfferMap?.properties.offerMap?.[key]
        );
      });
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 5: Fluxo de Publicação
  // ============================================================================
  
  describe('5. Fluxo de Publicação', () => {
    
    let draftFunnel: QuizStep[];
    let publishedFunnel: QuizStep[];
    
    beforeEach(() => {
      // Simular salvamento como rascunho
      draftFunnel = JSON.parse(JSON.stringify(QUIZ_STEPS));
      
      // Simular edição no rascunho
      const blocks = convertStepToBlocks(draftFunnel[0]);
      const headingBlock = blocks.find(b => b.type === 'heading');
      if (headingBlock) {
        headingBlock.properties.text = 'Título EDITADO no Rascunho';
      }
      draftFunnel[0] = convertBlocksToStep(draftFunnel[0].id, blocks);
      
      // Simular publicação
      publishedFunnel = JSON.parse(JSON.stringify(draftFunnel));
    });
    
    it('deve salvar como rascunho sem perder dados', () => {
      expect(draftFunnel).toBeDefined();
      expect(draftFunnel).toHaveLength(21);
      
      const headingBlock = draftFunnel[0].blocks.find(b => b.type === 'heading');
      expect(headingBlock?.properties.text).toBe('Título EDITADO no Rascunho');
    });
    
    it('deve publicar rascunho para produção', () => {
      expect(publishedFunnel).toBeDefined();
      expect(publishedFunnel).toHaveLength(21);
      
      // Verificar que dados do rascunho foram publicados
      const headingBlock = publishedFunnel[0].blocks.find(b => b.type === 'heading');
      expect(headingBlock?.properties.text).toBe('Título EDITADO no Rascunho');
    });
    
    it('deve validar funnel publicado sem erros', () => {
      const validation = validateCompleteFunnel(publishedFunnel);
      
      expect(validation.isValid).toBe(true);
      expect(validation.totalErrors).toBe(0);
    });
    
    it('deve manter integridade da cadeia de navegação após publicação', () => {
      publishedFunnel.forEach(step => {
        const validation = validateNextStep(step, publishedFunnel);
        expect(validation.isValid).toBe(true);
      });
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 6: Casos de Uso Reais
  // ============================================================================
  
  describe('6. Casos de Uso Reais do Editor', () => {
    
    it('CASO 1: Usuário edita título de pergunta', () => {
      const step = QUIZ_STEPS[1]; // step-02
      const blocks = convertStepToBlocks(step);
      
      const headingBlock = blocks.find(b => b.type === 'heading');
      if (headingBlock) {
        headingBlock.properties.text = 'Nova Pergunta Editada pelo Usuário';
        
        const edited = convertBlocksToStep(step.id, blocks);
        const validation = validateNextStep(edited, QUIZ_STEPS);
        
        expect(validation.isValid).toBe(true);
        expect(edited.blocks.find(b => b.type === 'heading')?.properties.text).toBe(
          'Nova Pergunta Editada pelo Usuário'
        );
      }
    });
    
    it('CASO 2: Usuário adiciona nova opção de estilo', () => {
      const step = QUIZ_STEPS[2]; // step-03
      const blocks = convertStepToBlocks(step);
      
      const quizOptionsBlock = blocks.find(b => b.type === 'quiz-options');
      if (quizOptionsBlock && quizOptionsBlock.properties.options) {
        const newOption = {
          id: 'contemporaneo',
          title: 'Contemporâneo',
          description: 'Estilo moderno e atual',
          nextStep: 'step-04'
        };
        
        quizOptionsBlock.properties.options.push(newOption);
        
        const edited = convertBlocksToStep(step.id, blocks);
        const validation = validateStyleIds(edited);
        
        expect(validation.isValid).toBe(true);
        expect(edited.blocks.find(b => b.type === 'quiz-options')?.properties.options).toHaveLength(
          quizOptionsBlock.properties.options.length
        );
      }
    });
    
    it('CASO 3: Usuário personaliza mensagem de transição', () => {
      const step = QUIZ_STEPS[9]; // step-10 (Transition)
      const blocks = convertStepToBlocks(step);
      
      const transitionBlock = blocks.find(b => b.type === 'transition');
      if (transitionBlock) {
        transitionBlock.properties.text = 'Personalizando sua experiência...';
        transitionBlock.properties.duration = 2500;
        
        const edited = convertBlocksToStep(step.id, blocks);
        const roundTrip = validateRoundTrip(edited);
        
        expect(roundTrip.isValid).toBe(true);
        expect(edited.blocks.find(b => b.type === 'transition')?.properties.text).toBe(
          'Personalizando sua experiência...'
        );
      }
    });
    
    it('CASO 4: Usuário atualiza URL de oferta final', () => {
      const step = QUIZ_STEPS[20]; // step-21
      const blocks = convertStepToBlocks(step);
      
      const offerMapBlock = blocks.find(b => b.type === 'offer-map');
      if (offerMapBlock && offerMapBlock.properties.offerMap) {
        offerMapBlock.properties.offerMap['romantico-alto'] = 'https://nova-oferta-premium.com';
        
        const edited = convertBlocksToStep(step.id, blocks);
        const validation = validateOfferMap(edited);
        
        expect(validation.isValid).toBe(true);
        expect(edited.blocks.find(b => b.type === 'offer-map')?.properties.offerMap?.['romantico-alto']).toBe(
          'https://nova-oferta-premium.com'
        );
      }
    });
    
    it('CASO 5: Usuário adiciona campo de telefone no formulário', () => {
      const step = QUIZ_STEPS[0]; // step-01
      const blocks = convertStepToBlocks(step);
      
      const formInputBlock = blocks.find(b => b.type === 'form-input');
      if (formInputBlock && formInputBlock.properties.fields) {
        const phoneField = {
          type: 'tel',
          label: 'Telefone',
          placeholder: '(00) 00000-0000',
          required: false,
          name: 'phone'
        };
        
        formInputBlock.properties.fields.push(phoneField);
        
        const edited = convertBlocksToStep(step.id, blocks);
        const validation = validateFormInput(edited);
        
        expect(validation.isValid).toBe(true);
        expect(edited.blocks.find(b => b.type === 'form-input')?.properties.fields).toContainEqual(
          expect.objectContaining({ name: 'phone' })
        );
      }
    });
    
  });
  
  // ============================================================================
  // TEST GROUP 7: Testes de Stress e Edge Cases
  // ============================================================================
  
  describe('7. Testes de Stress e Edge Cases', () => {
    
    it('deve suportar múltiplas edições consecutivas no mesmo step', () => {
      let currentStep = QUIZ_STEPS[1];
      
      // Fazer 5 edições consecutivas
      for (let i = 0; i < 5; i++) {
        const blocks = convertStepToBlocks(currentStep);
        const headingBlock = blocks.find(b => b.type === 'heading');
        
        if (headingBlock) {
          headingBlock.properties.text = `Edição #${i + 1}`;
        }
        
        currentStep = convertBlocksToStep(currentStep.id, blocks);
        
        const validation = validateNextStep(currentStep, QUIZ_STEPS);
        expect(validation.isValid).toBe(true);
      }
      
      // Verificar edição final
      const finalHeading = currentStep.blocks.find(b => b.type === 'heading');
      expect(finalHeading?.properties.text).toBe('Edição #5');
    });
    
    it('deve lidar com todos os steps sendo editados simultaneamente', () => {
      const editedSteps = QUIZ_STEPS.map(step => {
        const blocks = convertStepToBlocks(step);
        const headingBlock = blocks.find(b => b.type === 'heading');
        
        if (headingBlock) {
          headingBlock.properties.text = `${step.id} - EDITADO`;
        }
        
        return convertBlocksToStep(step.id, blocks);
      });
      
      // Validar todos os steps editados
      const validation = validateCompleteFunnel(editedSteps);
      expect(validation.isValid).toBe(true);
      expect(validation.totalErrors).toBe(0);
      
      // Verificar que todos foram editados
      editedSteps.forEach(step => {
        const heading = step.blocks.find(b => b.type === 'heading');
        expect(heading?.properties.text).toContain('EDITADO');
      });
    });
    
    it('deve preservar dados após serialização JSON', () => {
      QUIZ_STEPS.forEach(step => {
        // Serializar e desserializar
        const serialized = JSON.stringify(step);
        const deserialized = JSON.parse(serialized);
        
        // Converter para blocos e de volta
        const blocks = convertStepToBlocks(deserialized);
        const reconstructed = convertBlocksToStep(step.id, blocks);
        
        // Validar round-trip
        const validation = validateRoundTrip(reconstructed);
        expect(validation.isValid).toBe(true);
      });
    });
    
    it('deve manter performance com grandes volumes de dados', () => {
      const start = performance.now();
      
      // Converter todos os 21 steps 100 vezes
      for (let i = 0; i < 100; i++) {
        QUIZ_STEPS.forEach(step => {
          const blocks = convertStepToBlocks(step);
          convertBlocksToStep(step.id, blocks);
        });
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Deve completar em menos de 5 segundos
      expect(duration).toBeLessThan(5000);
      
      console.log(`✅ Performance: ${duration.toFixed(2)}ms para 2100 conversões`);
    });
    
  });
  
});
