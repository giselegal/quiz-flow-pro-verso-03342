/**
 * 🧩 Debug avançado das etapas ("todas as peças da engrenagem")
 *
 * Gera uma tabela unificada no console com dados provenientes de:
 * - StepRegistry (nome, categoria/metadata, navegação, validação)
 * - TemplateService (tipo da etapa, requiredSelections, nextStep)
 * - Derivações úteis (número, auto-avanço sugerido)
 */
import { stepRegistry } from './StepRegistry';
import type { QuizStepV3 as QuizStep } from '@/types/quiz';
import { getStepTemplate } from '@/templates/imports';
import { TemplateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

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
    const allSteps = TemplateService.getInstance().getAllStepsSync();

    for (const id of ids) {
      const n = getStepNumber(id);
      const reg = stepRegistry.get(id);
      const quiz: QuizStep | undefined = allSteps[id as keyof typeof allSteps];

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
        'Alerta Tipo/Categoria': alerta,
      });
    }

    // Ordenar por número e imprimir
    rows.sort((a, b) => a['#'] - b['#']);
    // Exibir a tabela com índice sendo o próprio ID (step-XX) para evitar duas colunas de índice
    const table = Object.fromEntries(
      rows.map(({ ['#']: _num, ...rest }) => [rest.ID, rest]),
    );
    appLogger.info('🧩 Debug Completo de Etapas (StepRegistry × QUIZ_STEPS)');
    console.table(table);
    appLogger.info('💡 Dica: chame window.printFullStepsDebug() para reimprimir a qualquer momento.');
  } catch (e) {
    appLogger.error('❌ Falha ao gerar debug completo de etapas:', { data: [e] });
  }
}

// Compat: alguns pontos importam uma função "profunda"; mapeamos para a principal
export function printFullStepsDebugDeep() {
  return printFullStepsDebug();
}

// Expor no navegador para facilitar reexecução
if (typeof window !== 'undefined') {
  (window as any).printFullStepsDebug = printFullStepsDebug;
}

type DeepRow = Row & {
  'Fonte do Template': 'registry' | 'ts' | '-';
  'Tem Sections?': '✅' | '❌';
  'Qtde de Blocos': number;
  'Componentes (types)': string;
  'Renderer (StepComponent)': string;
};

/**
 * Versão completa: inclui origem do template, blocos e nomes dos componentes
 * e imprime o JSON efetivo de cada step em grupos colapsados no console.
 */
export async function printDeepDebug() {
  try {
    const ids = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
    const allSteps = TemplateService.getInstance().getAllStepsSync();

    const rows: DeepRow[] = [];
    for (const id of ids) {
      const n = getStepNumber(id);
      const reg = stepRegistry.get(id);
      const quiz: QuizStep | undefined = allSteps[id as keyof typeof allSteps];

      const tipo = quiz?.type ?? 'N/A';
      const categoria = reg?.config?.metadata?.category ?? 'N/A';
      const allowNext = reg?.config?.allowNavigation?.next ? '✅' : '❌';
      const allowPrev = reg?.config?.allowNavigation?.previous ? '✅' : '❌';
      const required = typeof quiz?.requiredSelections === 'number' ? quiz!.requiredSelections! : '-';
      const auto = deriveAutoAdvance(quiz?.type, n) ? '✅' : '❌';
      const next = quiz?.nextStep ?? '-';
      const existsReg = reg ? '✅' : '❌';
      const existsData = quiz ? '✅' : '❌';

      let alerta: DeepRow['Alerta Tipo/Categoria'] = '-';
      if (quiz && categoria !== 'N/A') {
        const okStrategic = quiz.type === 'strategic-question' && categoria === 'strategic';
        const okQuestion = quiz.type === 'question' && categoria === 'question';
        const okIntro = quiz.type === 'intro' && categoria === 'intro';
        const okTrans = (quiz.type === 'transition' && categoria === 'transition') || (quiz.type === 'transition-result' && categoria === 'transition');
        const okResult = quiz.type === 'result' && categoria === 'result';
        const okOffer = quiz.type === 'offer' && categoria === 'offer';
        const aligned = okStrategic || okQuestion || okIntro || okTrans || okResult || okOffer;
        if (!aligned) alerta = `⚠️ Tipo '${tipo}' × Categoria '${categoria}'`;
      }

      // Carregar template efetivo do step (preferindo registry)
      let fonte: DeepRow['Fonte do Template'] = '-';
      let hasSections: DeepRow['Tem Sections?'] = '❌';
      let blocksCount = 0;
      let componentsList = '';
      let effectiveStep: any = null;
      try {
        const { step, source } = getStepTemplate(id);
        fonte = source;
        effectiveStep = step;
        let blocks: any[] = [];
        if (Array.isArray(step?.blocks)) {
          blocks = step.blocks;
        } else if (Array.isArray(step?.sections)) {
          hasSections = '✅';
          const { convertSectionsToBlocks } = await import('@/lib/utils/sectionToBlockConverter');
          blocks = convertSectionsToBlocks(step.sections);
        }
        // Enriquecer a identificação de fonte: se veio do registry mas aparenta ser JSON v3, marcar como registry(json-v3)
        if (fonte === 'registry') {
          const looksLikeV3 = !!(effectiveStep && (effectiveStep.templateVersion === '3.0' || Array.isArray((effectiveStep as any).sections)));
          if (looksLikeV3) {
            fonte = 'registry';
            // adiciona um rótulo visível no console de grupo
          }
        }
        blocksCount = Array.isArray(blocks) ? blocks.length : 0;
        const types = Array.from(new Set((blocks || []).map(b => String(b?.type || '').trim()).filter(Boolean)));
        componentsList = types.join(', ');
      } catch (e) {
        // ignora erro por step
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
        'Alerta Tipo/Categoria': alerta,
        'Fonte do Template': fonte,
        'Tem Sections?': hasSections,
        'Qtde de Blocos': blocksCount,
        'Componentes (types)': componentsList,
        'Renderer (StepComponent)': reg?.component ? (reg.component as any)?.name || 'anonymous' : 'N/A',
      });

      // Imprimir JSON efetivo de cada step em grupo colapsado
      try {
        const extra = (effectiveStep && (effectiveStep as any).templateVersion === '3.0') ? ' • json-v3' : '';
        console.groupCollapsed(`📄 JSON ${id} (fonte: ${fonte}${extra})`);
        appLogger.info(String(effectiveStep));
        console.groupEnd();
      } catch { }
    }

    rows.sort((a, b) => a['#'] - b['#']);
    // Exibir a tabela com índice sendo o próprio ID (step-XX) para evitar duas colunas de índice
    const table = Object.fromEntries(
      rows.map(({ ['#']: _num, ...rest }) => [rest.ID, rest]),
    );
    appLogger.info('🧩 Debug Completo (Profundo) • StepRegistry × QUIZ_STEPS × Template');
    console.table(table);
    appLogger.info('💡 Dica: chame window.printFullStepsDebugDeep() para reimprimir esta versão completa.');
  } catch (e) {
    appLogger.error('❌ Falha ao gerar debug profundo de etapas:', { data: [e] });
  }
}

if (typeof window !== 'undefined') {
  (window as any).printFullStepsDebugDeep = printDeepDebug;
}
