/**
 * 🔄 Quiz Adapter - Converte formatos antigos para V4
 * 
 * Resolve incompatibilidade entre:
 * - Formato antigo: steps: { "step-01": [...blocos], "step-02": [...blocos] }
 * - Formato novo: steps: [{ id: "step-01", blocks: [...] }, { id: "step-02", blocks: [...] }]
 */

import type { QuizSchema, QuizStep } from '@/schemas/quiz-schema.zod';

interface LegacyQuizFormat {
  id: string;
  name: string;
  description?: string;
  version: string;
  type: string;
  metadata?: any;
  steps: Record<string, any[]>; // ❌ Formato antigo: objeto com arrays
}

/**
 * Converte quiz do formato antigo (objeto) para V4 (array)
 */
export function adaptLegacyQuizToV4(legacy: LegacyQuizFormat | QuizSchema): QuizSchema {
  // Se já está no formato correto (array), retorna direto
  if (Array.isArray(legacy.steps)) {
    console.log('✅ Quiz já está no formato V4 (steps é array)');
    return legacy as QuizSchema;
  }

  console.log('🔄 Convertendo quiz de formato legado (objeto) para V4 (array)...');
  console.log('📦 Steps no formato antigo:', Object.keys(legacy.steps));

  // Converter objeto para array
  const stepsArray: QuizStep[] = Object.entries(legacy.steps).map(([stepId, blocks], index) => {
    const stepOrder = parseInt(stepId.replace(/\D/g, '')) || index + 1;
    
    return {
      id: stepId,
      type: 'intro' as const,
      order: stepOrder,
      title: `Step ${stepOrder}`,
      blocks: blocks.map((block, blockIndex) => ({
        ...block,
        order: block.order ?? blockIndex,
        metadata: block.metadata || {
          editable: true,
          reorderable: true,
          reusable: true,
          deletable: true,
        },
      })),
      navigation: {
        allowBack: true,
        autoAdvance: false,
      },
      validation: {
        required: false,
        minBlocks: 0,
        customRules: [],
      },
      version: 1,
    };
  });

  console.log('✅ Conversão completa:', {
    totalSteps: stepsArray.length,
    stepsIds: stepsArray.map(s => s.id),
    firstStepBlocks: stepsArray[0]?.blocks?.length || 0,
  });

  return {
    ...legacy,
    steps: stepsArray,
  } as QuizSchema;
}

/**
 * Converte quiz do formato V4 (array) para legado (objeto)
 * Útil para compatibilidade retroativa
 */
export function adaptV4QuizToLegacy(quiz: QuizSchema): LegacyQuizFormat {
  if (!Array.isArray(quiz.steps)) {
    console.log('⚠️ Quiz já está no formato legado');
    return quiz as any;
  }

  const stepsObject: Record<string, any[]> = {};
  
  quiz.steps.forEach(step => {
    stepsObject[step.id] = step.blocks || [];
  });

  return {
    ...quiz,
    steps: stepsObject,
  } as any;
}

/**
 * Detecta automaticamente o formato e normaliza para V4
 */
export function normalizeQuizFormat(quiz: any): QuizSchema {
  if (!quiz || !quiz.steps) {
    throw new Error('Quiz inválido: propriedade "steps" não encontrada');
  }

  // Detectar formato
  const isLegacyFormat = !Array.isArray(quiz.steps);
  
  if (isLegacyFormat) {
    console.log('🔍 Formato legado detectado - convertendo para V4...');
    return adaptLegacyQuizToV4(quiz);
  }

  console.log('✅ Formato V4 detectado - nenhuma conversão necessária');
  return quiz as QuizSchema;
}
