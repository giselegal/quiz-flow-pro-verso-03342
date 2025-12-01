import { describe, it, expect } from 'vitest';
import { migrateBlocksToStepMetadata, smartMigration, needsMigration } from '@/lib/utils/stepDataMigration';
import type { EditableQuizStep, BlockComponent } from '@/components/editor/quiz/types';

const makeStep = (blocks: Partial<BlockComponent>[], metadata?: Record<string, any>): EditableQuizStep => ({
  id: 's1',
  type: 'question',
  order: 1,
  blocks: blocks as any, // Cast necessário: BlockComponent.type é string, QuizBlock.type é literal union
  metadata,
  navigation: { nextStep: null },
  validation: { required: true },
  version: 1,
});

const block = (type: string, content: Record<string, any> = {}, properties: Record<string, any> = {}): BlockComponent => ({
  id: Math.random().toString(36).slice(2),
  type,
  order: 0,
  properties,
  content,
});

describe('stepDataMigration', () => {
  it('migra quiz-options (alias) e options-grid (canônico)', () => {
    const step1 = makeStep([
      block('quiz-options', { question: 'Pergunta A', options: [{ id: 'a' }] }, { requiredSelections: 2 }),
    ]);
    const out1 = migrateBlocksToStepMetadata(step1);
    expect(out1.metadata?.questionText).toBe('Pergunta A');
    expect(out1.metadata?.requiredSelections).toBe(2);
    expect(Array.isArray(out1.metadata?.options)).toBe(true);

    const step2 = makeStep([
      block('options-grid', { questionNumber: 3 }, { options: [{ id: 'x' }, { id: 'y' }] }),
    ]);
    const out2 = migrateBlocksToStepMetadata(step2);
    expect(out2.metadata?.questionNumber).toBe(3);
    expect(out2.metadata?.options?.length).toBe(2);
  });

  it('não quebra com blocks não-array ou valores inválidos', () => {
    const invalidStep = {
      id: 's2', type: 'question', order: 1,
      blocks: null,
    } as unknown as EditableQuizStep;

    const out = migrateBlocksToStepMetadata(invalidStep);
    expect(out.metadata).toBeDefined();
  });

  it('extrai imagem, texto, botão e formulário quando presentes', () => {
    const step = makeStep([
      block('image-inline', {}, { src: 'https://img' }),
      block('text-inline', { text: 'Título' }, {}),
      block('button', {}, { text: 'Avançar' }),
      block('form-input', { label: 'Seu nome' }, { placeholder: 'Digite' }),
    ]);

    const out = migrateBlocksToStepMetadata(step);
    expect(out.metadata?.image).toBe('https://img');
    expect(out.metadata?.title).toBe('Título');
    expect(out.metadata?.buttonText).toBe('Avançar');
    expect(out.metadata?.placeholder).toBe('Digite');
  });

  it('preserva metadata existente ao consolidar', () => {
    const step = makeStep([
      block('text', { text: 'Titulo' }),
    ], { foo: 'bar' });

    const out = migrateBlocksToStepMetadata(step);
    expect(out.metadata?.foo).toBe('bar');
    expect(out.metadata?.title).toBe('Titulo');
  });

  it('smartMigration migra apenas quando necessário', () => {
    const step = makeStep([ block('text', { text: 'A' }) ]);
    expect(needsMigration(step)).toBe(true);

    const smart = smartMigration(step);
    expect(smart.metadata?.title).toBe('A');

    // já tem metadata -> não migra novamente
    const step2 = { ...step, metadata: { done: true } };
    expect(needsMigration(step2 as EditableQuizStep)).toBe(false);
    const smart2 = smartMigration(step2 as EditableQuizStep);
    expect(smart2.metadata?.done).toBe(true);
  });
});
