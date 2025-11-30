/**
 * Teste de Validação do Template Gold Standard V4
 * 
 * Valida que quiz21-v4-gold.json passa 100% nas validações Zod
 * 
 * @vitest
 */

import { describe, it, expect } from 'vitest';
import { validateQuizSchema } from '@/schemas/quiz-schema.zod';
import goldTemplate from '@/../public/templates/quiz21-v4-gold.json';

describe('Quiz V4 Gold Standard - Validação Zod', () => {
  it('deve ser um JSON válido', () => {
    expect(goldTemplate).toBeDefined();
    expect(typeof goldTemplate).toBe('object');
  });

  it('deve ter estrutura básica correta', () => {
    expect(goldTemplate.version).toBe('4.0.0');
    expect(goldTemplate.schemaVersion).toBe('1.0');
    expect(goldTemplate.metadata).toBeDefined();
    expect(goldTemplate.theme).toBeDefined();
    expect(goldTemplate.settings).toBeDefined();
    expect(goldTemplate.steps).toBeDefined();
    expect(Array.isArray(goldTemplate.steps)).toBe(true);
  });

  it('metadata deve estar no formato correto', () => {
    const { metadata } = goldTemplate;
    
    expect(metadata.id).toBe('quiz21StepsComplete');
    expect(metadata.name).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.author).toBeTruthy();
    
    // Verificar formato ISO 8601 completo
    expect(metadata.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(metadata.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('theme.colors não deve ter placeholders', () => {
    const { theme } = goldTemplate;
    
    // Verificar formato hex color
    expect(theme.colors.primary).toMatch(/^#[0-9A-F]{6}$/i);
    expect(theme.colors.primary).toBe('#B89B7A');
    expect(theme.colors.secondary).toBe('#432818');
    
    // Garantir que não há placeholders
    const themeStr = JSON.stringify(theme);
    expect(themeStr).not.toContain('{{theme');
    expect(themeStr).not.toContain('{{asset');
  });

  it('todos os steps devem ter IDs válidos', () => {
    goldTemplate.steps.forEach((step, index) => {
      expect(step.id).toMatch(/^step-\d{2}$/);
      expect(step.order).toBeGreaterThanOrEqual(1);
      expect(step.order).toBeLessThanOrEqual(50);
      expect(step.blocks).toBeDefined();
      expect(step.blocks.length).toBeGreaterThan(0);
    });
  });

  it('todos os blocks devem ter content definido', () => {
    goldTemplate.steps.forEach(step => {
      step.blocks.forEach(block => {
        expect(block.content).toBeDefined();
        expect(typeof block.content).toBe('object');
        expect(block.order).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('validation.required deve ser boolean nos steps', () => {
    goldTemplate.steps.forEach(step => {
      if (step.validation) {
        expect(typeof step.validation.required).toBe('boolean');
        expect(step.validation.rules).toBeDefined();
        expect(typeof step.validation.rules).toBe('object');
      }
    });
  });

  it('não deve conter placeholders em properties', () => {
    const templateStr = JSON.stringify(goldTemplate);
    
    // Contar placeholders restantes
    const placeholders = templateStr.match(/\{\{[^}]+\}\}/g);
    
    if (placeholders) {
      console.warn('⚠️ Placeholders encontrados:', placeholders);
      expect(placeholders.length).toBe(0);
    }
  });

  it('deve passar na validação Zod completa', () => {
    const result = validateQuizSchema(goldTemplate);
    
    if (!result.success) {
      console.error('❌ Erros de validação Zod:');
      result.errors.forEach((error: any) => {
        console.error(`   - ${error.path.join('.')}: ${error.message}`);
      });
    }
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if (result.warnings && result.warnings.length > 0) {
      console.warn('⚠️ Warnings:', result.warnings);
    }
  });

  it('deve ter blockLibrary definida', () => {
    expect(goldTemplate.blockLibrary).toBeDefined();
    expect(typeof goldTemplate.blockLibrary).toBe('object');
    
    // Verificar alguns blocos essenciais
    const essentialBlocks = [
      'intro-logo-header',
      'question-title',
      'options-grid'
    ];
    
    essentialBlocks.forEach(blockType => {
      expect(goldTemplate.blockLibrary[blockType]).toBeDefined();
      expect(goldTemplate.blockLibrary[blockType].component).toBeTruthy();
    });
  });

  it('navigation.nextStep deve ser string ou null', () => {
    goldTemplate.steps.forEach((step, index) => {
      const { navigation } = step;
      
      if (navigation && navigation.nextStep !== undefined) {
        const isLastStep = index === goldTemplate.steps.length - 1;
        
        if (isLastStep) {
          expect(navigation.nextStep).toBeNull();
        } else {
          expect(typeof navigation.nextStep).toBe('string');
          expect(navigation.nextStep).toMatch(/^step-\d{2}$/);
        }
      }
    });
  });

  it('deve ter 21 steps conforme especificação', () => {
    expect(goldTemplate.steps.length).toBe(21);
    
    // Verificar ordem sequencial
    goldTemplate.steps.forEach((step, index) => {
      expect(step.order).toBe(index + 1);
    });
  });

  it('settings.scoring deve estar configurado corretamente', () => {
    const { scoring } = goldTemplate.settings;
    
    expect(scoring.enabled).toBe(true);
    expect(scoring.method).toBe('category-points');
    expect(Array.isArray(scoring.categories)).toBe(true);
    expect(scoring.categories.length).toBeGreaterThan(0);
  });
});

describe('Quiz V4 Gold Standard - Performance', () => {
  it('deve ser parseável em menos de 100ms', () => {
    const start = performance.now();
    const parsed = JSON.parse(JSON.stringify(goldTemplate));
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
    expect(parsed).toBeDefined();
  });

  it('deve ter tamanho otimizado (< 100KB)', () => {
    const size = JSON.stringify(goldTemplate).length;
    const sizeKB = size / 1024;
    
    console.log(`📊 Tamanho do arquivo: ${sizeKB.toFixed(2)} KB`);
    expect(sizeKB).toBeLessThan(100);
  });
});
