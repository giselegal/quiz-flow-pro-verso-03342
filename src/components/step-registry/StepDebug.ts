/**
 * 🧩 Debug avançado das etapas ("todas as peças da engrenagem")
 *
 * Gera uma tabela unificada no console com dados provenientes de:
 * - StepRegistry (nome, categoria/metadata, navegação, validação)
 * - quizSteps.ts (tipo da etapa, requiredSelections, nextStep)
 * - Derivações úteis (número, auto-avanço sugerido)
 */
import { stepRegistry } from './StepRegistry';
import { QUIZ_STEPS, type QuizStep } from '../../data/quizSteps';

type Row = {
  '#': number;
  ID: string;
  Nome: string;
  Tipo: QuizStep['type'] | 'N/A';
  Categoria: string;
  'Permite Próximo': '✅' | '❌';
  'Permite Anterior': '✅' | '❌';
  'Validação Obrigatória': '✅' | '❌';
  'Required Selections': number | '-';
  'Auto-Avanço (sugerido)': '✅' | '❌';
  'Próxima Etapa': string | '-';
  'Existe no Registry': '✅' | '❌';
  'Existe em QUIZ_STEPS': '✅' | '❌';
  'Alerta Tipo/Categoria': string | '-';
};

const getStepNumber = (id: string): number => {
  const m = String(id).match(/step-(\d{1,2})/i);
  return m ? parseInt(m[1], 10) : NaN;
};

const deriveAutoAdvance = (type: QuizStep['type'] | undefined, stepNumber: number): boolean => {
  // Regras operacionais do app (sugestão): perguntas avançam ao completar critério
  // - question (2–11) → auto-avanço ao atingir requiredSelections
  // - strategic-question (13–19) → auto-avanço após resposta única (implementação atual)
  if (type === 'question' && stepNumber >= 2 && stepNumber <= 11) return true;
  if (type === 'strategic-question' && stepNumber >= 13 && stepNumber <= 19) return true;
  return false;
};

export function printFullStepsDebug() {
  try {
    const rows: Row[] = [];
    const ids = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);

    for (const id of ids) {
      const n = getStepNumber(id);
      const reg = stepRegistry.get(id);
      const quiz: QuizStep | undefined = QUIZ_STEPS[id as keyof typeof QUIZ_STEPS];

      const tipo = quiz?.type ?? 'N/A';
      const categoria = reg?.config?.metadata?.category ?? 'N/A';
      const allowNext = reg?.config?.allowNavigation?.next ? '✅' : '❌';
      const allowPrev = reg?.config?.allowNavigation?.previous ? '✅' : '❌';
      const required = typeof quiz?.requiredSelections === 'number' ? quiz!.requiredSelections! : '-';
      const auto = deriveAutoAdvance(quiz?.type, n) ? '✅' : '❌';
      const next = quiz?.nextStep ?? '-';
      const existsReg = reg ? '✅' : '❌';
      const existsData = quiz ? '✅' : '❌';

      let alerta: Row['Alerta Tipo/Categoria'] = '-';
      if (quiz && categoria !== 'N/A') {
        // Inconsistências comuns: strategic-question (tipo) vs strategic (categoria) é esperado → não alertar
        const okStrategic = quiz.type === 'strategic-question' && categoria === 'strategic';
        const okQuestion = quiz.type === 'question' && categoria === 'question';
        const okIntro = quiz.type === 'intro' && categoria === 'intro';
        const okTrans = (quiz.type === 'transition' && categoria === 'transition') || (quiz.type === 'transition-result' && categoria === 'transition');
        const okResult = quiz.type === 'result' && categoria === 'result';
        const okOffer = quiz.type === 'offer' && categoria === 'offer';
        const aligned = okStrategic || okQuestion || okIntro || okTrans || okResult || okOffer;
        if (!aligned) alerta = `⚠️ Tipo '${tipo}' × Categoria '${categoria}'`;
      }

      rows.push({
        '#': n,
        ID: id,
        Nome: reg?.name ?? '-',
        Tipo: tipo,
        Categoria: categoria,
        'Permite Próximo': allowNext,
        'Permite Anterior': allowPrev,
        'Validação Obrigatória': reg?.config?.validation?.required ? '✅' : '❌',
        'Required Selections': required,
        'Auto-Avanço (sugerido)': auto,
        'Próxima Etapa': next,
        'Existe no Registry': existsReg,
        'Existe em QUIZ_STEPS': existsData,
        'Alerta Tipo/Categoria': alerta
      });
    }

    // Ordenar por número e imprimir
    rows.sort((a, b) => a['#'] - b['#']);
    console.log('🧩 Debug Completo de Etapas (StepRegistry × QUIZ_STEPS)');
    console.table(rows);
    console.log('💡 Dica: chame window.printFullStepsDebug() para reimprimir a qualquer momento.');
  } catch (e) {
    console.error('❌ Falha ao gerar debug completo de etapas:', e);
  }
}

// Expor no navegador para facilitar reexecução
if (typeof window !== 'undefined') {
  (window as any).printFullStepsDebug = printFullStepsDebug;
}
