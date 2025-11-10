/**
 * Mock da API de templates para testes de sincronização
 * Fornece implementações simuladas de template loaders
 */

import { vi } from 'vitest';

// Mock global para evitar erros de módulo não encontrado
vi.mock('@/templates/loaders/jsonStepLoader', () => ({
  loadStepFromJson: vi.fn(async (stepId: string, templateId: string) => {
    // Simular carregamento de JSON baseado no template ativo
    const stepNumber = parseInt(stepId.replace('step-', ''));
    
    if (stepNumber < 1 || stepNumber > 21) {
      throw new Error(`Step ${stepId} out of range`);
    }

    return [
      {
        id: `${stepId}-block-1`,
        type: 'heading',
        content: { text: `Step ${stepNumber} from ${templateId}` },
        order: 0,
      },
    ];
  }),
}));

vi.mock('@/services/templates/builtInTemplates', () => ({
  hasBuiltInTemplate: vi.fn((id: string) => 
    ['quiz21StepsComplete', 'custom-template', 'emagrecimento-funnel'].includes(id)
  ),
  getBuiltInTemplateById: vi.fn((id: string) => ({
    id,
    name: `Template ${id}`,
    totalSteps: 21,
  })),
  listBuiltInTemplateIds: vi.fn(() => ['quiz21StepsComplete', 'custom-template']),
}));

vi.mock('@/templates/registry', () => ({
  loadFullTemplate: vi.fn(async (templateId: string) => ({
    id: templateId,
    name: `Full Template ${templateId}`,
    totalSteps: 21,
    steps: {
      'step-01': [{ id: 'b1', type: 'heading', content: { text: 'Step 1' }, order: 0 }],
      'step-02': [{ id: 'b2', type: 'paragraph', content: { text: 'Step 2' }, order: 0 }],
    },
  })),
}));

export {};
