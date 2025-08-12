// @ts-nocheck
/**
 * 🔄 SCRIPT DE MIGRAÇÃO - TIMESTAMP PARA SEMÂNTICO
 *
 * Este script migra IDs timestamp existentes para o Sistema 1 (IDs Semânticos)
 * mantendo a funcionalidade e melhorando a escalabilidade.
 */

import {
  generateSemanticId,
  isSemanticId,
  QuizStyleIds,
  StepTemplateIds,
} from './semanticIdGenerator';

// ═══════════════════════════════════════════════
// 🎯 MIGRAÇÃO DE COMPONENTES ESPECÍFICOS
// ═══════════════════════════════════════════════

/**
 * Migra componentes do ResultHeader para IDs semânticos
 */
export function migrateResultHeaderComponent(resultHeaderData: {
  userName: string;
  customTitle?: string;
  id?: string;
}): {
  id: string;
  userName: string;
  customTitle?: string;
} {
  // Se já tem ID semântico, retorna como está
  if (resultHeaderData.id && isSemanticId(resultHeaderData.id)) {
    console.log('✅ ResultHeader já tem ID semântico:', resultHeaderData.id);
    return resultHeaderData as any;
  }

  // Gera novo ID semântico baseado no userName
  const newId = StepTemplateIds.result.header(resultHeaderData.userName);

  console.log('🔄 Migrando ResultHeader:', {
    oldId: resultHeaderData.id || 'sem-id',
    newId,
    userName: resultHeaderData.userName,
  });

  return {
    ...resultHeaderData,
    id: newId,
  };
}

/**
 * Migra dados de quiz para IDs semânticos
 */
export function migrateQuizData(quizData: {
  questions: Array<{
    id?: string;
    text: string;
    options: Array<{
      id?: string;
      text: string;
      value: string;
      category?: string;
    }>;
  }>;
  userId?: string;
}): typeof quizData {
  console.log('🔄 Iniciando migração de quiz data...');

  const migratedQuestions = quizData.questions.map((question, questionIndex) => {
    // Gerar ID semântico para questão
    const questionId =
      question.id && isSemanticId(question.id)
        ? question.id
        : generateSemanticId({
            context: 'quiz',
            type: 'question',
            identifier: `q${questionIndex + 1}`,
          });

    // Migrar opções
    const migratedOptions = question.options.map((option, optionIndex) => {
      const optionId =
        option.id && isSemanticId(option.id)
          ? option.id
          : generateSemanticId({
              context: 'quiz',
              type: 'option',
              identifier: `q${questionIndex + 1}-option-${optionIndex + 1}`,
            });

      return {
        ...option,
        id: optionId,
      };
    });

    return {
      ...question,
      id: questionId,
      options: migratedOptions,
    };
  });

  return {
    ...quizData,
    questions: migratedQuestions,
  };
}

/**
 * Migra blocos de editor para IDs semânticos
 */
export function migrateEditorBlocks(
  blocks: Array<{
    id?: string;
    type: string;
    stageId?: string;
    order?: number;
    content?: any;
    properties?: any;
  }>,
  stageId: string = 'default'
): typeof blocks {
  console.log('🔄 Migrando blocos do editor...');

  return blocks.map((block, index) => {
    // Se já tem ID semântico, mantém
    if (block.id && isSemanticId(block.id)) {
      return block;
    }

    // Gera novo ID semântico
    const newId = generateSemanticId({
      context: stageId,
      type: 'block',
      identifier: `${block.type}-${(block.order || index) + 1}`,
    });

    console.log('🔄 Migrando bloco:', {
      oldId: block.id || 'sem-id',
      newId,
      type: block.type,
    });

    return {
      ...block,
      id: newId,
    };
  });
}

// ═══════════════════════════════════════════════
// 🧮 MIGRAÇÃO DE RESULTADOS E CÁLCULOS
// ═══════════════════════════════════════════════

/**
 * Migra dados de resultado do quiz para IDs semânticos
 */
export function migrateQuizResults(results: {
  userId: string;
  primaryStyle?: {
    id?: string;
    category: string;
    score: number;
  };
  secondaryStyles?: Array<{
    id?: string;
    category: string;
    score: number;
  }>;
  calculationData?: {
    id?: string;
    timestamp: number;
    responses: any[];
  };
}): typeof results {
  console.log('🔄 Migrando resultados do quiz...');

  const migratedResult = { ...results };

  // Migrar estilo primário
  if (migratedResult.primaryStyle) {
    migratedResult.primaryStyle = {
      ...migratedResult.primaryStyle,
      id: QuizStyleIds.results.primary(results.userId),
    };
  }

  // Migrar estilos secundários
  if (migratedResult.secondaryStyles) {
    migratedResult.secondaryStyles = migratedResult.secondaryStyles.map((style, index) => ({
      ...style,
      id: generateSemanticId({
        context: 'result',
        type: 'secondary-style',
        identifier: `${results.userId}-${index + 1}`,
      }),
    }));
  }

  // Migrar dados de cálculo
  if (migratedResult.calculationData) {
    migratedResult.calculationData = {
      ...migratedResult.calculationData,
      id: QuizStyleIds.results.calculation(results.userId),
    };
  }

  return migratedResult;
}

// ═══════════════════════════════════════════════
// 🚀 MIGRAÇÃO EM LOTE
// ═══════════════════════════════════════════════

/**
 * Executa migração completa de um projeto
 */
export function migrateProjectToSemanticIds(projectData: {
  quiz?: any;
  editor?: any;
  results?: any;
  components?: any[];
}): typeof projectData {
  console.log('🚀 Iniciando migração completa do projeto...');

  const migrated = { ...projectData };

  // Migrar dados do quiz
  if (migrated.quiz) {
    migrated.quiz = migrateQuizData(migrated.quiz);
  }

  // Migrar blocos do editor
  if (migrated.editor?.blocks) {
    migrated.editor.blocks = migrateEditorBlocks(
      migrated.editor.blocks,
      migrated.editor.stageId || 'default'
    );
  }

  // Migrar resultados
  if (migrated.results) {
    migrated.results = migrateQuizResults(migrated.results);
  }

  // Migrar componentes genéricos
  if (migrated.components) {
    migrated.components = migrated.components.map((component, index) => {
      if (component.id && isSemanticId(component.id)) {
        return component;
      }

      return {
        ...component,
        id: generateSemanticId({
          context: component.context || 'app',
          type: component.type || 'component',
          identifier: `item-${index + 1}`,
        }),
      };
    });
  }

  console.log('✅ Migração completa finalizada!');
  return migrated;
}

// ═══════════════════════════════════════════════
// 🔍 VALIDAÇÃO E ESTATÍSTICAS
// ═══════════════════════════════════════════════

/**
 * Valida se migração foi bem sucedida
 */
export function validateMigration(data: any): {
  isValid: boolean;
  semanticIds: number;
  timestampIds: number;
  totalIds: number;
  semanticRatio: number;
  issues: string[];
} {
  const issues: string[] = [];
  let semanticIds = 0;
  let timestampIds = 0;
  let totalIds = 0;

  function analyzeObject(obj: any, path: string = ''): void {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.id && typeof obj.id === 'string') {
      totalIds++;
      if (isSemanticId(obj.id)) {
        semanticIds++;
      } else {
        timestampIds++;
        issues.push(`ID não-semântico encontrado em ${path}: ${obj.id}`);
      }
    }

    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        analyzeObject(obj[key], path ? `${path}.${key}` : key);
      }
    });
  }

  analyzeObject(data);

  const semanticRatio = totalIds > 0 ? (semanticIds / totalIds) * 100 : 100;
  const isValid = semanticRatio >= 95; // 95% ou mais IDs semânticos

  return {
    isValid,
    semanticIds,
    timestampIds,
    totalIds,
    semanticRatio,
    issues,
  };
}

/**
 * Gera relatório de migração
 */
export function generateMigrationReport(data: any): string {
  const validation = validateMigration(data);

  const report = `
📊 RELATÓRIO DE MIGRAÇÃO - SISTEMA 1 (IDs Semânticos)
${'='.repeat(60)}

📈 ESTATÍSTICAS:
• Total de IDs analisados: ${validation.totalIds}
• IDs semânticos: ${validation.semanticIds} (${validation.semanticRatio.toFixed(1)}%)
• IDs timestamp: ${validation.timestampIds}

${validation.isValid ? '✅' : '❌'} STATUS: ${validation.isValid ? 'MIGRAÇÃO BEM SUCEDIDA' : 'MIGRAÇÃO INCOMPLETA'}

${
  validation.issues.length > 0
    ? `
⚠️ PROBLEMAS ENCONTRADOS:
${validation.issues.map(issue => `• ${issue}`).join('\n')}
`
    : '🎉 NENHUM PROBLEMA ENCONTRADO!'
}

🚀 BENEFÍCIOS OBTIDOS:
• Duplicação 100% confiável
• IDs únicos sempre
• Rastreabilidade perfeita
• Persistência consistente
• Código mais limpo
`;

  return report;
}

export default {
  migrateResultHeaderComponent,
  migrateQuizData,
  migrateEditorBlocks,
  migrateQuizResults,
  migrateProjectToSemanticIds,
  validateMigration,
  generateMigrationReport,
};
