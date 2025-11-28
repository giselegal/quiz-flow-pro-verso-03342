import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  ModularStepSchema,
  validateModularStep,
  validateModularSteps,
} from '@/core/schemas/modularStepSchema';
import { NavigationSchema } from '@/core/schemas/navigationSchema';
import { ValidationSchema } from '@/core/schemas/validationSchema';

describe('Schemas v4.0 - ModularStep', () => {
  const validStep = {
    templateVersion: '4.0',
    metadata: {
      id: 'step-01',
      name: 'Introdução',
      category: 'intro',
    },
    blocks: [
      {
        id: 'block-1',
        type: 'heading',
        content: { text: 'Bem-vindo' },
      },
    ],
    navigation: {
      nextStep: 'step-02',
      allowBack: true,
      autoAdvance: false,
      autoAdvanceDelay: 0,
    },
    validation: {
      required: [],
      rules: {},
      errorMessages: {},
    },
    theme: {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
    },
    behavior: {
      scoring: { enabled: false },
    },
  } as const;

  it('valida um step válido com validateModularStep', () => {
    const result = validateModularStep(validStep);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata.id).toBe('step-01');
    }
  });

  it('falha quando templateVersion inválida', () => {
    const invalid = { ...validStep, templateVersion: '3.9' };
    const parsed = validateModularStep(invalid);
    expect(parsed.success).toBe(false);
  });

  it('falha quando blocks está vazio', () => {
    const invalid = { ...validStep, blocks: [] };
    const parsed = validateModularStep(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validateModularSteps aceita array válido e rejeita item inválido', () => {
    const arr = [validStep, { ...validStep, metadata: { ...validStep.metadata, id: 'step-02' } }];
    const ok = validateModularSteps(arr);
    expect(ok.success).toBe(true);

    const badArr = [validStep, { ...validStep, blocks: [] }];
    const bad = validateModularSteps(badArr);
    expect(bad.success).toBe(false);
  });
});

describe('Schemas v4.0 - Navigation', () => {
  it('aceita navegação mínima válida', () => {
    const nav = {
      nextStep: 'step-02',
      allowBack: true,
      autoAdvance: false,
      autoAdvanceDelay: 0,
    };
    const result = NavigationSchema.safeParse(nav);
    expect(result.success).toBe(true);
  });

  it('rejeita autoAdvanceDelay negativo', () => {
    const nav = {
      nextStep: 'step-02',
      allowBack: true,
      autoAdvance: true,
      autoAdvanceDelay: -10,
    };
    const result = NavigationSchema.safeParse(nav);
    expect(result.success).toBe(false);
  });
});

describe('Schemas v4.0 - Validation', () => {
  it('aceita regras e mensagens padrão', () => {
    const v = {
      required: [],
      rules: {},
      errorMessages: {},
    };
    const result = ValidationSchema.safeParse(v);
    expect(result.success).toBe(true);
  });

  it('aceita required e uma regra simples', () => {
    const v = {
      required: ['block-1'],
      rules: {
        'block-1': { minItems: 1 },
      },
      errorMessages: { 'block-1': 'Selecione pelo menos uma opção' },
    };
    const result = ValidationSchema.safeParse(v);
    expect(result.success).toBe(true);
  });
});
