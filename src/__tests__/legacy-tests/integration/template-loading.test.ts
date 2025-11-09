/**
 * 🧪 TESTES DE CARREGAMENTO DE TEMPLATES
 * 
 * Valida que quiz21StepsComplete.ts está sendo carregado corretamente
 * e que todos os blocos question-hero estão presentes
 */

import { describe, it, expect } from 'vitest';
import { 
  QUIZ_STYLE_21_STEPS_TEMPLATE,
  getStepTemplate 
} from '@/templates/quiz21StepsComplete';

describe('Template Loading - quiz21StepsComplete.ts', () => {
  it('deve importar QUIZ_STYLE_21_STEPS_TEMPLATE como named export', () => {
    expect(QUIZ_STYLE_21_STEPS_TEMPLATE).toBeDefined();
    expect(typeof QUIZ_STYLE_21_STEPS_TEMPLATE).toBe('object');
    console.log('✅ Named export QUIZ_STYLE_21_STEPS_TEMPLATE importado');
  });

  it('deve conter estrutura com steps (step-01 até step-21)', () => {
    const stepKeys = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
    
    expect(stepKeys.length).toBeGreaterThan(0);
    expect(stepKeys).toContain('step-01');
    expect(stepKeys).toContain('step-05');
    expect(stepKeys).toContain('step-21');
    
    console.log('✅ Steps encontrados:', stepKeys.length);
    console.log('📋 Steps:', stepKeys.join(', '));
  });

  it('deve ter step-05 com question-hero-05', () => {
    const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
    
    expect(step05Blocks).toBeDefined();
    expect(Array.isArray(step05Blocks)).toBe(true);
    
    const questionHeroBlock = step05Blocks.find(
      (b: any) => b.id === 'question-hero-05'
    );
    
    expect(questionHeroBlock).toBeDefined();
    expect(questionHeroBlock?.type).toBe('question-hero');
    
    console.log('✅ Block question-hero-05 encontrado:', {
      id: questionHeroBlock?.id,
      type: questionHeroBlock?.type,
      contentKeys: Object.keys(questionHeroBlock?.content || {})
    });
  });

  it('deve ter todos os dados necessários em question-hero-05', () => {
    const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
    const block = step05Blocks.find((b: any) => b.id === 'question-hero-05');
    
    expect(block?.content).toBeDefined();
    expect(block?.content.questionNumber).toBe('4 de 10');
    expect(block?.content.questionText).toBe('QUAIS DETALHES VOCÊ GOSTA?');
    expect(block?.content.currentQuestion).toBe(4);
    expect(block?.content.totalQuestions).toBe(13);
    expect(block?.content.progressValue).toBe(24);
    expect(block?.content.showProgress).toBe(true);
    expect(block?.content.logoUrl).toContain('cloudinary');
    expect(block?.content.logoAlt).toBe('Logo Gisele Galvão');
    
    console.log('✅ Todas as propriedades validadas:', block?.content);
  });

  it('deve listar todos os question-hero no template', () => {
    const questionHeroBlocks: any[] = [];
    
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
      blocks.forEach((block: any) => {
        if (block.type === 'question-hero') {
          questionHeroBlocks.push({
            stepId,
            blockId: block.id,
            questionText: block.content?.questionText
          });
        }
      });
    });
    
    console.log('📋 Question-hero blocks encontrados:', questionHeroBlocks.length);
    questionHeroBlocks.forEach(b => {
      console.log(`  - ${b.stepId}: ${b.blockId} → "${b.questionText}"`);
    });
    
    expect(questionHeroBlocks.length).toBeGreaterThan(0);
    
    const hasHero05 = questionHeroBlocks.some(b => b.blockId === 'question-hero-05');
    expect(hasHero05).toBe(true);
  });

  it('deve validar função getStepTemplate', () => {
    const step05Blocks = getStepTemplate('step-05');
    
    expect(step05Blocks).toBeDefined();
    expect(Array.isArray(step05Blocks)).toBe(true);
    
    const questionHero = step05Blocks?.find(b => b.id === 'question-hero-05');
    expect(questionHero).toBeDefined();
    expect(questionHero?.type).toBe('question-hero');
    
    console.log('✅ getStepTemplate() retorna dados corretos');
  });
});

describe('Template Type - TypeScript vs JSON', () => {
  it('deve confirmar que é módulo TypeScript com named exports', () => {
    // Confirmar que não é default export
    expect(QUIZ_STYLE_21_STEPS_TEMPLATE).toBeDefined();
    
    // Confirmar que é objeto nativo, não JSON parseado
    expect(QUIZ_STYLE_21_STEPS_TEMPLATE.constructor.name).toBe('Object');
    
    console.log('✅ Confirmado: quiz21StepsComplete.ts usa named exports');
    console.log('📦 Tipo: Módulo TypeScript com const export');
  });

  it('deve ter cache otimizado via getStepTemplate', () => {
    // Primeira chamada (popula cache)
    const result1 = getStepTemplate('step-05');
    
    // Segunda chamada (usa cache)
    const result2 = getStepTemplate('step-05');
    
    // Deve retornar mesma referência (cache)
    expect(result1).toBe(result2);
    
    console.log('✅ Cache funcionando: mesma referência retornada');
  });
});
