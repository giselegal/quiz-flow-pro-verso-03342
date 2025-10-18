import { QUIZ_STEPS } from '@/data/quizSteps';

type Section = any;

function ensure(obj: any, path: string[], defaultValue: any) {
  let ref = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!ref[key] || typeof ref[key] !== 'object') ref[key] = {};
    ref = ref[key];
  }
  const last = path[path.length - 1];
  if (ref[last] === undefined) ref[last] = defaultValue;
}

function setIf(ref: any, path: string[], value: any) {
  if (value === undefined || value === null) return;
  ensure(ref, path.slice(0, -1), {});
  let cursor = ref;
  for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
  cursor[path[path.length - 1]] = value;
}

function mapOptions(options: any[] | undefined) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, idx) => ({
    id: opt.id ?? `opt-${idx + 1}`,
    text: opt.text ?? '',
    imageUrl: opt.image ?? opt.imageUrl ?? undefined,
    value: opt.id ?? `opt-${idx + 1}`,
  }));
}

/**
 * Hidrata sections v3 com dados canônicos do QUIZ_STEPS (titulos, perguntas, opções, CTA...)
 * Sem efeitos colaterais: retorna novo array de sections.
 */
export function hydrateSectionsWithQuizSteps(stepId: string, sections: Section[] | undefined): Section[] {
  if (!Array.isArray(sections)) return [];
  const step = (QUIZ_STEPS as any)[stepId];
  if (!step) return sections;

  const type = step.type as
    | 'intro'
    | 'question'
    | 'strategic-question'
    | 'transition'
    | 'transition-result'
    | 'result'
    | 'offer';

  const cloned = sections.map(s => ({ ...s, content: s?.content ? { ...s.content } : undefined }));

  const find = (t: string) => cloned.find(sec => sec?.type === t);

  if (type === 'intro') {
    const hero = find('intro-hero');
    const form = find('welcome-form');
    if (hero) setIf(hero, ['content', 'title'], step.title);
    if (form) {
      setIf(form, ['content', 'questionText'], step.formQuestion);
      setIf(form, ['content', 'namePlaceholder'], step.placeholder);
      setIf(form, ['content', 'submitText'], step.buttonText);
    }
  }

  if (type === 'question' || type === 'strategic-question') {
    const hero = find('question-hero');
    const grid = find('options-grid');
    if (hero) {
      setIf(hero, ['content', 'questionText'], step.questionText);
      setIf(hero, ['content', 'questionNumber'], step.questionNumber);
    }
    if (grid) {
      const req = step.requiredSelections ?? (type === 'strategic-question' ? 1 : undefined);
      if (req !== undefined) {
        setIf(grid, ['content', 'multipleSelection'], req > 1 ? true : false);
        setIf(grid, ['content', 'minSelections'], req);
        setIf(grid, ['content', 'maxSelections'], req);
      } else if (type === 'strategic-question') {
        setIf(grid, ['content', 'multipleSelection'], false);
        setIf(grid, ['content', 'minSelections'], 1);
        setIf(grid, ['content', 'maxSelections'], 1);
      }
      const mapped = mapOptions(step.options);
      if (mapped.length > 0) setIf(grid, ['content', 'options'], mapped);
    }
  }

  if (type === 'transition' || type === 'transition-result') {
    const hero = find('transition-hero');
    const cta = find('CTAButton');
    if (hero) {
      setIf(hero, ['content', 'title'], step.title);
      // Preencher subtitle ou description (mantém existente se já houver)
      if (step.text) {
        if (hero.content?.subtitle === undefined) setIf(hero, ['content', 'subtitle'], step.text);
        else setIf(hero, ['content', 'description'], step.text);
      }
    }
    if (cta && step.showContinueButton) {
      setIf(cta, ['content', 'text'], step.continueButtonText ?? 'Continuar');
    }
  }

  if (type === 'offer') {
    // Mantém template como está; integração fina com offerMap pode ser aplicada em runtime/result.
  }

  if (type === 'result') {
    // Dados de resultado são dinâmicos; não hidratar aqui.
  }

  return cloned;
}

export default hydrateSectionsWithQuizSteps;
