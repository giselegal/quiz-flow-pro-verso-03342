import { describe, test, expect } from 'vitest';
import { modularJsonToEditorStepsSafe, editorStepsToModularJson } from '@/lib/modular-json';

describe('modular-json basic roundtrip', () => {
  test('minimal modular quiz roundtrip', () => {
    const minimal = {
      meta: { title: 'minimal' },
      steps: [
        {
          id: 'step-01',
          type: 'intro',
          order: 1,
          title: 'Welcome',
          nextStep: 'step-02',
          blocks: [
            {
              id: 'step-01-b1',
              type: 'heading',
              component: 'IntroHeader',
              order: 1,
              content: { titleHtml: '<h1>Welcome</h1>' }
            },
            {
              id: 'step-01-b2',
              type: 'form',
              component: 'NameCaptureForm',
              order: 2,
              props: { question: 'Como posso te chamar?', placeholder: 'Nome', buttonText: 'Começar', action: 'submit-name', successAction: 'next-step:step-02' }
            }
          ]
        }
      ]
    };

    const parsed = modularJsonToEditorStepsSafe(minimal);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      throw new Error('Parsing failed: ' + JSON.stringify(parsed, null, 2));
    }

    const editorSteps = parsed.steps;
    expect(Array.isArray(editorSteps)).toBe(true);
    expect(editorSteps.length).toBe(1);
    const exported = editorStepsToModularJson(editorSteps, { roundtrip: true });
    expect(exported).toHaveProperty('steps');
    expect(exported.steps[0]).toHaveProperty('id', 'step-01');
    expect(exported.steps[0]).toHaveProperty('blocks');
    expect(exported.steps[0].blocks.length).toBeGreaterThan(0);
  });

  test('supports children recursion in blocks', () => {
    const withChildren = {
      steps: [
        {
          id: 'step-10',
          type: 'question',
          blocks: [
            {
              id: 'container-1',
              type: 'container',
              order: 0,
              props: { layout: 'grid' },
              children: [
                { id: 'c1', type: 'text', order: 0, content: { text: 'Hello' } },
                { id: 'c2', type: 'button', order: 1, props: { text: 'Go' } }
              ]
            }
          ]
        }
      ]
    };
    const parsed = modularJsonToEditorStepsSafe(withChildren);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error('Parsing failed');
    const blocks = parsed.steps[0].blocks;
    expect(blocks[0].children?.length).toBe(2);
    const exported = editorStepsToModularJson(parsed.steps);
    expect(exported.steps[0].blocks?.[0].children?.length).toBe(2);
  });

  test('invalid root should return errors (safe path)', () => {
    const invalid: any = { steps: 'not-an-array' };
    const res = modularJsonToEditorStepsSafe(invalid);
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error('Expected validation to fail');
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
