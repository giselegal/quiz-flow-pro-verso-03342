// @ts-nocheck
/**
 * 🎯 SISTEMA DE IDs SEMÂNTICOS - IMPLEMENTAÇÃO COMPLETA
 *
 * Este sistema substitui o uso de Date.now() e Math.random() por IDs
 * semânticos previsíveis, duplicáveis e escaláveis.
 */

// ═══════════════════════════════════════════════
// 🧩 TIPOS E INTERFACES
// ═══════════════════════════════════════════════

export interface SemanticIdConfig {
  context: string; // "quiz", "result", "step01", etc.
  type: string; // "question", "option", "block", etc.
  identifier: string; // "estilo-preferido", "classico", etc.
  index?: number; // Para sequências: 1, 2, 3...
}

export interface DuplicationContext {
  originalId: string;
  newContext: string;
  preserveType: boolean;
  copyNumber?: number;
}

// ═══════════════════════════════════════════════
// 🎯 GERADOR PRINCIPAL DE IDs SEMÂNTICOS
// ═══════════════════════════════════════════════

/**
 * Gera ID semântico baseado em contexto e tipo
 */
export function generateSemanticId(config: SemanticIdConfig): string {
  const { context, type, identifier, index } = config;

  const parts = [context, type, identifier];

  if (index !== undefined) {
    parts.push(index.toString());
  }

  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Gera ID para componentes de quiz
 */
export function generateQuizComponentId(
  context: string,
  componentType: string,
  index?: number
): string {
  return generateSemanticId({
    context: `quiz-${context}`,
    type: componentType,
    identifier: index ? `item-${index}` : 'default',
  });
}

/**
 * Gera ID para questões e opções
 */
export function generateQuestionId(questionNumber: number, questionType: string = 'style'): string {
  return generateSemanticId({
    context: 'quiz',
    type: 'question',
    identifier: `q${questionNumber}-${questionType}`,
  });
}

export function generateOptionId(
  questionNumber: number,
  optionType: string,
  optionIndex?: number
): string {
  const identifier = optionIndex
    ? `q${questionNumber}-${optionType}-${optionIndex}`
    : `q${questionNumber}-${optionType}`;

  return generateSemanticId({
    context: 'quiz',
    type: 'option',
    identifier,
  });
}

/**
 * Gera ID para blocos de editor
 */
export function generateBlockId(stageId: string, blockType: string, order?: number): string {
  const identifier = order ? `${blockType}-${order}` : blockType;

  return generateSemanticId({
    context: stageId,
    type: 'block',
    identifier,
  });
}

/**
 * Gera ID para resultados
 */
export function generateResultId(userId: string, resultType: string): string {
  return generateSemanticId({
    context: 'result',
    type: resultType,
    identifier: userId,
  });
}

// ═══════════════════════════════════════════════
// 🔄 SISTEMA DE DUPLICAÇÃO INTELIGENTE
// ═══════════════════════════════════════════════

/**
 * Duplica ID mantendo semântica e evitando conflitos
 */
export function duplicateSemanticId(originalId: string, context: DuplicationContext): string {
  const { newContext, copyNumber = 1, preserveType } = context;

  // Parse do ID original
  const parts = originalId.split('-');

  if (parts.length < 3) {
    // Fallback para IDs não semânticos
    return generateSemanticId({
      context: newContext,
      type: 'duplicated',
      identifier: `copy-${copyNumber}`,
    });
  }

  const [originalContext, type, ...identifierParts] = parts;
  const identifier = identifierParts.join('-');

  return generateSemanticId({
    context: newContext,
    type: preserveType ? type : 'copy',
    identifier: `${identifier}-copy-${copyNumber}`,
  });
}

/**
 * Gera próximo ID em sequência
 */
export function generateNextSequenceId(baseId: string, existingIds: string[]): string {
  const baseParts = baseId.split('-');
  const baseWithoutNumber = baseParts.slice(0, -1).join('-');

  // Encontrar próximo número disponível
  let nextNumber = 1;
  while (existingIds.includes(`${baseWithoutNumber}-${nextNumber}`)) {
    nextNumber++;
  }

  return `${baseWithoutNumber}-${nextNumber}`;
}

// ═══════════════════════════════════════════════
// 🎯 CONVERTERS PARA MIGRAÇÃO
// ═══════════════════════════════════════════════

/**
 * Converte ID timestamp para semântico
 */
export function convertTimestampToSemantic(timestampId: string, config: SemanticIdConfig): string {
  // Detectar padrões timestamp
  if (timestampId.includes('Date.now()') || /\d{13}/.test(timestampId)) {
    console.warn(`🔄 Convertendo timestamp ID: ${timestampId}`);
    return generateSemanticId(config);
  }

  return timestampId; // Já é semântico
}

/**
 * Migra mapeamento de IDs timestamp para semântico
 */
export function migrateIdMapping(
  oldMapping: Record<string, any>,
  contextPrefix: string
): Record<string, any> {
  const newMapping: Record<string, any> = {};

  Object.entries(oldMapping).forEach(([key, value], index) => {
    const newKey = generateSemanticId({
      context: contextPrefix,
      type: 'migrated',
      identifier: `item-${index + 1}`,
    });

    newMapping[newKey] = value;
  });

  return newMapping;
}

// ═══════════════════════════════════════════════
// 🧮 UTILITÁRIOS DE VALIDAÇÃO E ANÁLISE
// ═══════════════════════════════════════════════

/**
 * Valida se ID é semântico
 */
export function isSemanticId(id: string): boolean {
  // ID semântico deve ter pelo menos 3 partes separadas por hífen
  const parts = id.split('-');
  return parts.length >= 3 && !parts.some(part => /^\d{10,}$/.test(part));
}

/**
 * Extrai informações de ID semântico
 */
export function parseSemanticId(id: string): SemanticIdConfig | null {
  if (!isSemanticId(id)) return null;

  const parts = id.split('-');
  const [context, type, ...identifierParts] = parts;

  return {
    context,
    type,
    identifier: identifierParts.join('-'),
  };
}

/**
 * Estatísticas de IDs em uma coleção
 */
export function analyzeIdCollection(ids: string[]): {
  semantic: number;
  timestamp: number;
  total: number;
  semanticRatio: number;
} {
  const semantic = ids.filter(isSemanticId).length;
  const timestamp = ids.length - semantic;
  const total = ids.length;
  const semanticRatio = total > 0 ? (semantic / total) * 100 : 0;

  return { semantic, timestamp, total, semanticRatio };
}

// ═══════════════════════════════════════════════
// 🚀 HELPERS ESPECÍFICOS DO DOMÍNIO
// ═══════════════════════════════════════════════

/**
 * IDs específicos para Quiz de Estilo
 */
export const QuizStyleIds = {
  questions: {
    personality: () => generateQuestionId(1, 'personality'),
    style: () => generateQuestionId(2, 'style'),
    colors: () => generateQuestionId(3, 'colors'),
    outfit: () => generateQuestionId(4, 'outfit'),
  },

  options: {
    classic: (questionNum: number) => generateOptionId(questionNum, 'classic'),
    romantic: (questionNum: number) => generateOptionId(questionNum, 'romantic'),
    modern: (questionNum: number) => generateOptionId(questionNum, 'modern'),
    creative: (questionNum: number) => generateOptionId(questionNum, 'creative'),
  },

  results: {
    primary: (userId: string) => generateResultId(userId, 'primary-style'),
    secondary: (userId: string) => generateResultId(userId, 'secondary-styles'),
    calculation: (userId: string) => generateResultId(userId, 'calculation-data'),
  },
};

/**
 * IDs específicos para Steps/Templates
 */
export const StepTemplateIds = {
  step01: {
    intro: () => generateBlockId('step01', 'intro', 1),
    form: () => generateBlockId('step01', 'form', 2),
    cta: () => generateBlockId('step01', 'cta', 3),
  },

  result: {
    header: (userName: string) =>
      generateSemanticId({
        context: 'result',
        type: 'header',
        identifier: userName.toLowerCase().replace(/\s+/g, '-'),
      }),
    styleCard: (styleName: string) =>
      generateSemanticId({
        context: 'result',
        type: 'style-card',
        identifier: styleName.toLowerCase().replace(/\s+/g, '-'),
      }),
  },
};

export default {
  generateSemanticId,
  generateQuizComponentId,
  generateQuestionId,
  generateOptionId,
  generateBlockId,
  generateResultId,
  duplicateSemanticId,
  generateNextSequenceId,
  convertTimestampToSemantic,
  migrateIdMapping,
  isSemanticId,
  parseSemanticId,
  analyzeIdCollection,
  QuizStyleIds,
  StepTemplateIds,
};
