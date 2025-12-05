/**
 * 🧪 Teste de Validação do Template quiz21-v4.json
 * 
 * Valida a estrutura do template canônico contra o QuizSchemaZ
 */

import { describe, expect, it } from 'vitest';
import { QuizSchemaZ, getSchemaErrors, type QuizStep, type QuizBlock } from '@/schemas/quiz-schema.zod';

// Importar o template JSON diretamente
import template from '@/data/templates/quiz21-v4.json';

describe('quiz21-v4.json Schema Validation', () => {
  it('should pass QuizSchemaZ validation', () => {
    const result = QuizSchemaZ.safeParse(template);
    
    if (!result.success) {
      console.error('Validation errors:', result.error.errors);
    }
    
    expect(result.success).toBe(true);
  });

  it('should have correct version format (semver)', () => {
    expect(template.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(template.schemaVersion).toMatch(/^\d+\.\d+$/);
  });

  it('should have 21 steps', () => {
    expect(template.steps).toHaveLength(21);
  });

  it('should have sequential step orders (1-21)', () => {
    const orders = template.steps.map((s: { order: number }) => s.order);
    const expected = Array.from({ length: 21 }, (_, i) => i + 1);
    expect(orders).toEqual(expected);
  });

  it('should have correct step types distribution', () => {
    const typeCount = template.steps.reduce((acc: Record<string, number>, step: { type: string }) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    expect(typeCount['intro']).toBe(1);
    expect(typeCount['question']).toBe(17);
    expect(typeCount['transition']).toBe(1);
    expect(typeCount['result']).toBe(1);
    expect(typeCount['offer']).toBe(1);
  });

  it('should have valid navigation chain', () => {
    template.steps.forEach((step: { navigation: { nextStep: string | null } }, index: number) => {
      if (index < template.steps.length - 1) {
        expect(step.navigation.nextStep).toBe(`step-${index + 2}`);
      } else {
        expect(step.navigation.nextStep).toBeNull();
      }
    });
  });

  it('should have at least 1 block per step', () => {
    template.steps.forEach((step: { blocks: unknown[] }) => {
      expect(step.blocks.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should have unique block IDs across all steps', () => {
    const allBlockIds = template.steps.flatMap((s: { blocks: Array<{ id: string }> }) => s.blocks.map((b: { id: string }) => b.id));
    const uniqueIds = new Set(allBlockIds);
    expect(uniqueIds.size).toBe(allBlockIds.length);
  });

  it('should have valid hex colors in theme', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    Object.values(template.theme.colors).forEach((color) => {
      expect(color).toMatch(hexPattern);
    });
  });

  it('should have all 4 result categories defined', () => {
    expect(template.results).toHaveProperty('classic');
    expect(template.results).toHaveProperty('modern');
    expect(template.results).toHaveProperty('romantic');
    expect(template.results).toHaveProperty('casual');
  });

  it('should have valid scoring settings', () => {
    expect(template.settings.scoring.enabled).toBe(true);
    expect(template.settings.scoring.method).toBe('category-points');
    expect(template.settings.scoring.categories).toEqual(['classic', 'modern', 'romantic', 'casual']);
  });

  it('should have ISO 8601 dates in metadata', () => {
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(template.metadata.createdAt).toMatch(isoPattern);
    expect(template.metadata.updatedAt).toMatch(isoPattern);
  });

  it('should return no schema errors', () => {
    const errors = getSchemaErrors(template);
    expect(errors).toHaveLength(0);
  });
});
