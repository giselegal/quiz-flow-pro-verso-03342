import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import type { Block } from '@/types/editor';

/**
 * Hidrata um array de blocks normalizados (v3) com dados canônicos do QUIZ_STEPS.
 * Garante que textos de pergunta, contadores e opções venham de quizSteps.ts.
 */
export function hydrateBlocksWithQuizSteps(stepId: string, blocks: Block[] = []): Block[] {
  const step: QuizStep | undefined = (QUIZ_STEPS as any)[stepId];
  if (!step || !Array.isArray(blocks) || blocks.length === 0) return blocks;

  const req = step.requiredSelections;
  const isStrategic = step.type === 'strategic-question';

  const mapOption = (opt: any, idx: number) => ({
    id: opt?.id ?? `opt-${idx + 1}`,
    text: opt?.text ?? '',
    imageUrl: opt?.image ?? opt?.imageUrl ?? undefined,
    value: opt?.id ?? `opt-${idx + 1}`,
  });

  return blocks.map((b, idx) => {
    if (!b || typeof b !== 'object') return b;
    const p = (b as any).properties || {};
    const cloned: Block = {
      ...b,
      properties: { ...p },
    } as Block;

    const blockType = String(b.type || '').toLowerCase();
    
    if (blockType === 'question-number') {
      if (step.questionNumber) {
        (cloned as any).properties.questionNumber = step.questionNumber;
      }
    } else if (blockType === 'question-text') {
      const qt = step.questionText || (step.type === 'intro' ? step.title : undefined);
      if (qt) {
        (cloned as any).properties.questionText = qt;
      }
    } else if (blockType === 'question-instructions') {
      const effectiveReq = req ?? (isStrategic ? 1 : undefined);
      if (typeof effectiveReq === 'number') {
        (cloned as any).properties.requiredSelections = effectiveReq;
      }
    } else if (blockType === 'options-grid' || blockType === 'quiz-options') {
        const options = Array.isArray(step.options) ? step.options.map(mapOption) : [];
        if (options.length > 0) {
          (cloned as any).properties.options = options;
        }
        const effectiveReq = req ?? (isStrategic ? 1 : undefined);
        if (typeof effectiveReq === 'number') {
          (cloned as any).properties.requiredSelections = effectiveReq;
          (cloned as any).properties.multipleSelection = effectiveReq > 1;
          // Em perguntas estratégicas forçar single selection
          if (isStrategic) (cloned as any).properties.multipleSelection = false;
        }
        // Assegurar questionId consistente
      if (!(cloned as any).properties.questionId) {
        (cloned as any).properties.questionId = stepId;
      }
      
      console.log(`🔧 Hydrated options-grid with ${options.length} options for ${stepId}`);
    } else if (blockType === 'question-progress') {
      // Se desejar, podemos deduzir o stepNumber a partir do ID para robustez
      const match = stepId.match(/step-(\d+)/);
      const num = match ? parseInt(match[1], 10) : undefined;
      if (num && (cloned as any).properties && (cloned as any).properties.stepNumber == null) {
        (cloned as any).properties.stepNumber = num;
      }
    }

    return cloned;
  });
}

export default hydrateBlocksWithQuizSteps;
