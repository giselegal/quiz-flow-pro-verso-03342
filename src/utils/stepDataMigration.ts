/**
 * 🔄 STEP DATA MIGRATION UTILITIES
 * 
 * Utilitários para migrar dados de blocos para step.metadata
 * Converte estrutura de blocos do editor para props dos componentes de step
 */

import { EditableQuizStep, BlockComponent } from '@/components/editor/quiz/types';

/**
 * Extrai dados de perguntas de um bloco quiz-options
 */
const extractQuestionData = (blocks: BlockComponent[]) => {
  const quizOptionsBlock = blocks.find(b => b.type === 'quiz-options' || b.type === 'options-grid');
  
  if (!quizOptionsBlock) return {};

  const content = quizOptionsBlock.content || {};
  const properties = quizOptionsBlock.properties || {};

  return {
    questionNumber: properties.questionNumber || content.questionNumber,
    questionText: content.question || properties.question,
    requiredSelections: properties.requiredSelections || content.requiredSelections || 1,
    options: properties.options || content.options || [],
  };
};

/**
 * Extrai dados de formulário de um bloco form-input
 */
const extractFormData = (blocks: BlockComponent[]) => {
  const formBlock = blocks.find(b => b.type === 'form-input');
  
  if (!formBlock) return {};

  const properties = formBlock.properties || {};
  const content = formBlock.content || {};

  return {
    formQuestion: properties.label || content.label,
    placeholder: properties.placeholder || content.placeholder,
  };
};

/**
 * Extrai imagens de um bloco
 */
const extractImage = (blocks: BlockComponent[]) => {
  const imageBlock = blocks.find(b => b.type === 'image' || b.type === 'hero-image');
  
  if (!imageBlock) return {};

  const properties = imageBlock.properties || {};
  const content = imageBlock.content || {};

  return {
    image: properties.src || content.src || properties.imageUrl || content.imageUrl,
  };
};

/**
 * Extrai texto/título de blocos de conteúdo
 */
const extractText = (blocks: BlockComponent[]) => {
  const textBlock = blocks.find(b => b.type === 'text' || b.type === 'heading');
  
  if (!textBlock) return {};

  const properties = textBlock.properties || {};
  const content = textBlock.content || {};

  return {
    title: properties.text || content.text || properties.title || content.title,
    text: properties.description || content.description,
  };
};

/**
 * Extrai dados de botão
 */
const extractButton = (blocks: BlockComponent[]) => {
  const buttonBlock = blocks.find(b => b.type === 'button' || b.type === 'cta-button');
  
  if (!buttonBlock) return {};

  const properties = buttonBlock.properties || {};
  const content = buttonBlock.content || {};

  return {
    buttonText: properties.text || content.text || properties.label || content.label,
  };
};

/**
 * Migra blocos para step.metadata
 * Consolidada todos os dados relevantes dos blocos em um objeto metadata estruturado
 */
export const migrateBlocksToStepMetadata = (step: EditableQuizStep): EditableQuizStep => {
  const blocks = (step as any).blocks || [];

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
  const hasBlocks = (step as any).blocks && (step as any).blocks.length > 0;
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
