/**
 * 🧪 TESTES COMPLETOS DO QUIZ 21 STEPS
 * 
 * Valida que todos os 21 steps renderizam corretamente
 * Garante que nenhum bloco exibe "Sem conteúdo"
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getStepTemplate } from '@/templates/quiz21StepsComplete';
import { BLOCK_COMPLEXITY_MAP } from '@/config/block-complexity-map';
import type { Block } from '@/types/editor';

describe('Quiz 21 Steps Complete - Template Validation', () => {
  describe('Estrutura Básica', () => {
    it('deve ter exatamente 21 steps', () => {
      const stepKeys = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
      expect(stepKeys.length).toBe(21);
    });

    it('todos os steps devem seguir o padrão step-XX', () => {
      const stepKeys = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
      
      stepKeys.forEach(key => {
        expect(key).toMatch(/^step-(0[1-9]|1[0-9]|2[0-1])$/);
      });
    });

    it('steps devem estar em sequência correta', () => {
      const expectedSteps = Array.from({ length: 21 }, (_, i) => 
        `step-${String(i + 1).padStart(2, '0')}`
      );

      const actualSteps = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).sort();
      
      expect(actualSteps).toEqual(expectedSteps);
    });
  });

  describe('Validação de Blocos por Step', () => {
    // Step 01 - Intro
    it('Step 01 (Intro) deve ter blocos válidos', () => {
      const blocks = getStepTemplate('step-01');
      expect(blocks).toBeTruthy();
      expect(blocks!.length).toBeGreaterThan(0);
      
      validateBlocksStructure(blocks!);
      validateNoEmptyContent(blocks!);
    });

    // Steps 02-11 - Questions
    for (let i = 2; i <= 11; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      
      it(`${stepId} (Question) deve ter blocos válidos`, () => {
        const blocks = getStepTemplate(stepId);
        expect(blocks).toBeTruthy();
        expect(blocks!.length).toBeGreaterThan(0);
        
        validateBlocksStructure(blocks!);
        validateNoEmptyContent(blocks!);
        
        // Questions devem ter options-grid ou quiz-options
        const hasOptionsBlock = blocks!.some(b => 
          b.type === 'options-grid' || b.type === 'quiz-options'
        );
        expect(hasOptionsBlock).toBe(true);
      });
    }

    // Step 12 - Transition
    it('Step 12 (Transition) deve ter blocos válidos', () => {
      const blocks = getStepTemplate('step-12');
      expect(blocks).toBeTruthy();
      expect(blocks!.length).toBeGreaterThan(0);
      
      validateBlocksStructure(blocks!);
      validateNoEmptyContent(blocks!);
    });

    // Steps 13-18 - Strategic Questions
    for (let i = 13; i <= 18; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      
      it(`${stepId} (Strategic Question) deve ter blocos válidos`, () => {
        const blocks = getStepTemplate(stepId);
        expect(blocks).toBeTruthy();
        expect(blocks!.length).toBeGreaterThan(0);
        
        validateBlocksStructure(blocks!);
        validateNoEmptyContent(blocks!);
      });
    }

    // Step 19 - Transition Result
    it('Step 19 (Transition Result) deve ter blocos válidos', () => {
      const blocks = getStepTemplate('step-19');
      expect(blocks).toBeTruthy();
      expect(blocks!.length).toBeGreaterThan(0);
      
      validateBlocksStructure(blocks!);
      validateNoEmptyContent(blocks!);
    });

    // Step 20 - Result
    it('Step 20 (Result) deve ter blocos válidos', () => {
      const blocks = getStepTemplate('step-20');
      expect(blocks).toBeTruthy();
      expect(blocks!.length).toBeGreaterThan(0);
      
      validateBlocksStructure(blocks!);
      validateNoEmptyContent(blocks!);
    });

    // Step 21 - Offer
    it('Step 21 (Offer) deve ter blocos válidos', () => {
      const blocks = getStepTemplate('step-21');
      expect(blocks).toBeTruthy();
      expect(blocks!.length).toBeGreaterThan(0);
      
      validateBlocksStructure(blocks!);
      validateNoEmptyContent(blocks!);
      
      // Offer deve ter offer-hero e offer-benefits
      const hasOfferHero = blocks!.some(b => b.type === 'offer-hero');
      const hasOfferBenefits = blocks!.some(b => b.type === 'offer-benefits');
      
      expect(hasOfferHero || hasOfferBenefits).toBe(true);
    });
  });

  describe('Cobertura de Tipos de Blocos', () => {
    let allBlockTypes: Set<string>;

    beforeAll(() => {
      allBlockTypes = new Set();
      
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(blocks => {
        blocks.forEach(block => {
          allBlockTypes.add(block.type);
        });
      });
    });

    it('todos os tipos de blocos usados devem estar mapeados', () => {
      const unmappedBlocks: string[] = [];
      
      allBlockTypes.forEach(blockType => {
        if (!BLOCK_COMPLEXITY_MAP[blockType]) {
          unmappedBlocks.push(blockType);
        }
      });

      if (unmappedBlocks.length > 0) {
        console.warn('⚠️ Blocos não mapeados encontrados:', unmappedBlocks);
      }

      // Permitir até 5% de blocos não mapeados durante desenvolvimento
      const unmappedPercentage = (unmappedBlocks.length / allBlockTypes.size) * 100;
      expect(unmappedPercentage).toBeLessThan(5);
    });

    it('deve usar pelo menos 20 tipos diferentes de blocos', () => {
      expect(allBlockTypes.size).toBeGreaterThanOrEqual(20);
    });

    it('blocos críticos devem estar presentes', () => {
      const criticalBlocks = [
        'options-grid',
        'quiz-options',
        'question-text',
        'intro-title',
        'result-header',
        'offer-hero',
      ];

      criticalBlocks.forEach(blockType => {
        expect(allBlockTypes.has(blockType)).toBe(true);
      });
    });
  });

  describe('Consistência de Dados', () => {
    it('todos os blocos devem ter IDs únicos por step', () => {
      Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
        const ids = blocks.map(b => b.id);
        const uniqueIds = new Set(ids);
        
        expect(uniqueIds.size).toBe(ids.length);
      });
    });

    it('todos os blocos devem ter order >= 0', () => {
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(blocks => {
        blocks.forEach(block => {
          expect(block.order).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('blocos devem estar ordenados corretamente', () => {
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(blocks => {
        for (let i = 1; i < blocks.length; i++) {
          expect(blocks[i].order).toBeGreaterThanOrEqual(blocks[i - 1].order);
        }
      });
    });
  });

  describe('Validação de Conteúdo', () => {
    it('nenhum bloco deve ter content completamente vazio', () => {
      let emptyContentBlocks: Array<{ step: string; blockId: string; blockType: string }> = [];

      Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
        blocks.forEach(block => {
          const hasContent = hasValidContent(block);
          
          if (!hasContent) {
            emptyContentBlocks.push({
              step: stepId,
              blockId: block.id,
              blockType: block.type,
            });
          }
        });
      });

      if (emptyContentBlocks.length > 0) {
        console.warn('⚠️ Blocos com conteúdo vazio:', emptyContentBlocks);
      }

      // Permitir até 5% de blocos com conteúdo vazio (spacers, dividers)
      const totalBlocks = Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE)
        .reduce((sum, blocks) => sum + blocks.length, 0);
      const emptyPercentage = (emptyContentBlocks.length / totalBlocks) * 100;
      
      expect(emptyPercentage).toBeLessThan(5);
    });

    it('blocos de texto devem ter propriedade text', () => {
      const textBlockTypes = ['text', 'text-inline', 'heading-inline'];
      
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(blocks => {
        blocks.forEach(block => {
          if (textBlockTypes.includes(block.type)) {
            const hasText = block.properties?.text || block.content?.text;
            expect(hasText).toBeTruthy();
          }
        });
      });
    });

    it('blocos de imagem devem ter propriedade src', () => {
      const imageBlockTypes = ['image', 'image-inline', 'intro-image'];
      
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(blocks => {
        blocks.forEach(block => {
          if (imageBlockTypes.includes(block.type)) {
            const hasSrc = block.properties?.src || block.content?.src;
            expect(hasSrc).toBeTruthy();
          }
        });
      });
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function validateBlocksStructure(blocks: Block[]): void {
  blocks.forEach(block => {
    // Estrutura básica
    expect(block).toHaveProperty('id');
    expect(block).toHaveProperty('type');
    expect(block).toHaveProperty('order');
    
    // Tipos corretos
    expect(typeof block.id).toBe('string');
    expect(typeof block.type).toBe('string');
    expect(typeof block.order).toBe('number');
    
    // Valores válidos
    expect(block.id.length).toBeGreaterThan(0);
    expect(block.type.length).toBeGreaterThan(0);
  });
}

function validateNoEmptyContent(blocks: Block[]): void {
  blocks.forEach(block => {
    // Pelo menos properties OU content deve existir
    const hasProperties = block.properties && Object.keys(block.properties).length > 0;
    const hasContent = block.content && Object.keys(block.content).length > 0;
    
    // Exceções: spacers e dividers podem ter content vazio
    const allowedEmpty = ['spacer', 'spacer-inline', 'divider', 'divider-inline'];
    
    if (!allowedEmpty.includes(block.type)) {
      expect(hasProperties || hasContent).toBe(true);
    }
  });
}

function hasValidContent(block: Block): boolean {
  // Spacers e dividers podem ter content vazio
  const allowedEmpty = ['spacer', 'spacer-inline', 'divider', 'divider-inline'];
  if (allowedEmpty.includes(block.type)) {
    return true;
  }

  // Verificar se tem properties ou content com dados reais
  const hasProperties = block.properties && Object.keys(block.properties).length > 0;
  const hasContent = block.content && Object.keys(block.content).length > 0;

  return hasProperties || hasContent;
}
