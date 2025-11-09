import { describe, it, expect } from 'vitest';
import hydrateSectionsWithQuizSteps from '@/lib/utils/hydrators/hydrateSectionsWithQuizSteps';
import { TemplateService } from '@/services/canonical/TemplateService';

type Section = { type: string; id?: string; content?: any; style?: any; animation?: any };

function findSection(sections: Section[], type: string): Section | undefined {
  return sections.find((s) => s.type === type);
}

describe('hydrateSectionsWithQuizSteps', () => {
  it('hidrata step-03 (question) preenchendo question-hero e options-grid com regras de seleção', () => {
    const stepId = 'step-03';
    const baseSections: Section[] = [
      { type: 'question-hero', id: 'q-hero-03', content: {} },
      { type: 'options-grid', id: 'options-03', content: {} },
    ];

    const hydrated = hydrateSectionsWithQuizSteps(stepId, baseSections);
    expect(Array.isArray(hydrated)).toBe(true);
    expect(hydrated.length).toBe(baseSections.length);

    const hero = findSection(hydrated, 'question-hero');
    const grid = findSection(hydrated, 'options-grid');
    expect(hero).toBeTruthy();
    expect(grid).toBeTruthy();

    // Textos do hero
    expect(hero!.content?.questionText).toBe(TemplateService.getInstance().getAllStepsSync()[stepId].questionText);
    // step-03 possui questionNumber '2 de 10'
    expect(hero!.content?.questionNumber).toBe(TemplateService.getInstance().getAllStepsSync()[stepId].questionNumber);

    // Opções mapeadas
    const stepOptions = TemplateService.getInstance().getAllStepsSync()[stepId].options || [];
    const mappedOptions = grid!.content?.options || [];
    expect(mappedOptions.length).toBe(stepOptions.length);
    // Verifica que cada opção tem id/text e imageUrl (quando imagem não existe, pode ficar undefined)
    mappedOptions.forEach((opt: any, idx: number) => {
      expect(opt.id).toBe(stepOptions[idx].id);
      expect(opt.text).toBe(stepOptions[idx].text);
      // step-03 não tem imagens; imageUrl pode ser undefined
      expect(Object.prototype.hasOwnProperty.call(opt, 'imageUrl')).toBe(true);
    });

    // Regras de seleção: step-03 requiredSelections=3 → múltipla seleção, min=max=3
    expect(grid!.content?.multipleSelection).toBe(true);
    expect(grid!.content?.minSelections).toBe(3);
    expect(grid!.content?.maxSelections).toBe(3);
  });

  it('hidrata step-13 (strategic-question) com seleção única (min=max=1) e opções mapeadas', () => {
    const stepId = 'step-13';
    const baseSections: Section[] = [
      { type: 'question-hero', id: 'q-hero-13', content: {} },
      { type: 'options-grid', id: 'options-13', content: {} },
    ];

    const hydrated = hydrateSectionsWithQuizSteps(stepId, baseSections);
    expect(hydrated.length).toBe(2);

    const hero = findSection(hydrated, 'question-hero');
    const grid = findSection(hydrated, 'options-grid');
    expect(hero).toBeTruthy();
    expect(grid).toBeTruthy();

    // Textos do hero (questionText obrigatório)
    expect(hero!.content?.questionText).toBe(TemplateService.getInstance().getAllStepsSync()[stepId].questionText);
    // strategic-question normalmente não tem questionNumber — se ausente, não deve quebrar
    // Apenas verifica que não inserimos um valor inválido
    expect(hero!.content?.questionNumber === undefined || typeof hero!.content?.questionNumber === 'string').toBe(true);

    // Opções mapeadas
    const stepOptions = TemplateService.getInstance().getAllStepsSync()[stepId].options || [];
    const mappedOptions = grid!.content?.options || [];
    expect(mappedOptions.length).toBe(stepOptions.length);
    mappedOptions.forEach((opt: any, idx: number) => {
      expect(opt.id).toBe(stepOptions[idx].id);
      expect(opt.text).toBe(stepOptions[idx].text);
    });

    // Regras de seleção: strategic-question → seleção única
    expect(grid!.content?.multipleSelection).toBe(false);
    expect(grid!.content?.minSelections).toBe(1);
    expect(grid!.content?.maxSelections).toBe(1);
  });
});
