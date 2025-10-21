/**
 * 🔄 STEP DATA MIGRATION UTILITIES
 * 
 * Utilitários para migrar dados de blocos para step.metadata
 * Converte estrutura de blocos do editor para props dos componentes de step
 */

import { EditableQuizStep, BlockComponent } from '@/components/editor/quiz/types';
import { normalizeBlockType } from '@/utils/blockNormalization';

const ensureArray = <T,>(val: unknown): T[] => Array.isArray(val) ? (val as T[]) : [];
const getType = (b: Partial<BlockComponent>): string => normalizeBlockType(String(b?.type || '').toLowerCase());

/**
 * Extrai dados de perguntas de um bloco quiz-options
 */
const extractQuestionData = (blocks: BlockComponent[]) => {
  const list = ensureArray<BlockComponent>(blocks);
  const quizOptionsBlock = list.find(b => {
    const t = getType(b);
    return t === 'options-grid' || String(b?.type || '').toLowerCase() === 'quiz-options';
  });
  
  if (!quizOptionsBlock) return {};

  const content = (quizOptionsBlock as any).content || {};
  const properties = (quizOptionsBlock as any).properties || {};

  return {
    questionNumber: properties.questionNumber || content.questionNumber,
    questionText: content.question || properties.question,
    requiredSelections: properties.requiredSelections || content.requiredSelections || 1,
    options: ensureArray<any>(properties.options || content.options),
  };
};

/**
 * Extrai dados de formulário de um bloco form-input
 */
const extractFormData = (blocks: BlockComponent[]) => {
  const list = ensureArray<BlockComponent>(blocks);
  const formBlock = list.find(b => getType(b) === 'form-input');
  
  if (!formBlock) return {};

  const properties = (formBlock as any).properties || {};
  const content = (formBlock as any).content || {};

  return {
    formQuestion: properties.label || content.label,
    placeholder: properties.placeholder || content.placeholder,
  };
};

/**
 * Extrai imagens de um bloco
 */
const extractImage = (blocks: BlockComponent[]) => {
  const list = ensureArray<BlockComponent>(blocks);
  const imageBlock = list.find(b => {
    const t = getType(b);
    return t === 'image' || t === 'image-inline' || t === 'image-display-inline' || t === 'hero-image';
  });
  
  if (!imageBlock) return {};

  const properties = (imageBlock as any).properties || {};
  const content = (imageBlock as any).content || {};

  return {
    image: properties.src || content.src || properties.imageUrl || content.imageUrl,
  };
};

/**
 * Extrai texto/título de blocos de conteúdo
 */
const extractText = (blocks: BlockComponent[]) => {
  const list = ensureArray<BlockComponent>(blocks);
  const textBlock = list.find(b => {
    const t = getType(b);
    return t === 'text' || t === 'text-inline' || t === 'heading' || t === 'heading-inline';
  });
  
  if (!textBlock) return {};

  const properties = (textBlock as any).properties || {};
  const content = (textBlock as any).content || {};

  return {
    title: properties.text || content.text || properties.title || content.title,
    text: properties.description || content.description,
  };
};

/**
 * Extrai dados de botão
 */
const extractButton = (blocks: BlockComponent[]) => {
  const list = ensureArray<BlockComponent>(blocks);
  const buttonBlock = list.find(b => {
    const t = getType(b);
    return t === 'button' || t === 'button-inline' || t === 'cta-button';
  });
  
  if (!buttonBlock) return {};

  const properties = (buttonBlock as any).properties || {};
  const content = (buttonBlock as any).content || {};

  return {
    buttonText: properties.text || content.text || properties.label || content.label,
  };
};

/**
 * Migra blocos para step.metadata
 * Consolidada todos os dados relevantes dos blocos em um objeto metadata estruturado
 */
export const migrateBlocksToStepMetadata = (step: EditableQuizStep): EditableQuizStep => {
  const blocks = ensureArray<BlockComponent>((step as any)?.blocks);

  // Extrair dados de diferentes tipos de blocos
  const questionData = extractQuestionData(blocks);
  const formData = extractFormData(blocks);
  const imageData = extractImage(blocks);
  const textData = extractText(blocks);
  const buttonData = extractButton(blocks);

  // Consolidar metadata
  const metadata = {
    ...textData,
    ...questionData,
    ...formData,
    ...imageData,
    ...buttonData,
    // Preservar metadata existente
    ...(step.metadata || {}),
  };

  return {
    ...step,
    metadata,
  };
};

/**
 * Migra múltiplos steps de uma vez
 */
export const migrateAllSteps = (steps: EditableQuizStep[]): EditableQuizStep[] => {
  return steps.map(migrateBlocksToStepMetadata);
};

/**
 * Verifica se um step precisa de migração
 */
export const needsMigration = (step: EditableQuizStep): boolean => {
  const hasBlocks = Array.isArray((step as any)?.blocks) && (step as any).blocks.length > 0;
  const hasMetadata = step.metadata && Object.keys(step.metadata).length > 0;
  
  return hasBlocks && !hasMetadata;
};

/**
 * Migração inteligente: só migra se necessário
 */
export const smartMigration = (step: EditableQuizStep): EditableQuizStep => {
  if (needsMigration(step)) {
    return migrateBlocksToStepMetadata(step);
  }
  return step;
};
