/**
 * 🎯 CARREGADOR DE ETAPAS OTIMIZADO
 * ================================
 * 
 * Carrega as 21 etapas do funil otimizado com dados completos
 */

import { OPTIMIZED_FUNNEL_CONFIG } from '@/config/optimized21StepsFunnel';
import { FunnelStage, EditorBlock } from '@/types/editor';

/**
 * Carrega todas as 21 etapas otimizadas
 */
export const loadOptimized21Steps = (): FunnelStage[] => {
  if (!OPTIMIZED_FUNNEL_CONFIG?.steps) {
    console.warn('⚠️ OPTIMIZED_FUNNEL_CONFIG não encontrado');
    return [];
  }

  const stages: FunnelStage[] = OPTIMIZED_FUNNEL_CONFIG.steps.map((stepConfig, index) => ({
    id: stepConfig.id,
    name: stepConfig.name,
    order: stepConfig.order,
    type: stepConfig.type as any,
    description: stepConfig.description,
    isActive: index === 0,
    metadata: {
      blocksCount: stepConfig.blocks?.length || 0,
      lastModified: new Date(),
      isCustom: false,
      isOptimized: true,
      stepData: stepConfig,
      templateBlocks: stepConfig.blocks?.map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
        content: {},
        position: { x: 0, y: 0 },
        size: { width: 100, height: 'auto' },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          isTemplate: true,
          isOptimized: true
        }
      })) || []
    }
  }));

  console.log(`🎯 Carregadas ${stages.length} etapas otimizadas`);
  
  // Debug das etapas
  stages.forEach(stage => {
    console.log(`  📋 Etapa ${stage.order}: ${stage.name} (${stage.metadata.blocksCount} blocos)`);
  });

  return stages;
};

/**
 * Carrega blocos iniciais para uma etapa específica
 */
export const loadStepBlocks = (stepId: string): EditorBlock[] => {
  const stepConfig = OPTIMIZED_FUNNEL_CONFIG?.steps.find(step => step.id === stepId);
  
  if (!stepConfig?.blocks) {
    console.warn(`⚠️ Blocos não encontrados para etapa ${stepId}`);
    return [];
  }

  const blocks: EditorBlock[] = stepConfig.blocks.map((blockConfig, index) => ({
    id: blockConfig.id,
    type: blockConfig.type,
    properties: blockConfig.properties || {},
    content: {},
    position: { x: 0, y: index * 100 },
    size: { width: 100, height: 'auto' },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: false,
      isOptimized: true,
      stepId: stepId,
      order: index
    }
  }));

  console.log(`🎯 Carregados ${blocks.length} blocos para etapa ${stepId}`);
  return blocks;
};

/**
 * Obtém informações da etapa específica
 */
export const getStepInfo = (stepId: string) => {
  const stepConfig = OPTIMIZED_FUNNEL_CONFIG?.steps.find(step => step.id === stepId);
  
  if (!stepConfig) {
    console.warn(`⚠️ Configuração não encontrada para etapa ${stepId}`);
    return null;
  }

  return {
    id: stepConfig.id,
    name: stepConfig.name,
    description: stepConfig.description,
    order: stepConfig.order,
    type: stepConfig.type,
    blocksCount: stepConfig.blocks?.length || 0,
    hasQuestionData: !!stepConfig.questionData,
    questionData: stepConfig.questionData,
    blocks: stepConfig.blocks || []
  };
};

/**
 * Carrega dados do quiz
 */
export const getQuizData = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.quizData || null;
};

/**
 * Carrega configurações de cálculo
 */
export const getCalculationConfig = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.calculations || null;
};

/**
 * Carrega configurações de conversão
 */
export const getConversionConfig = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.conversion || null;
};

export default {
  loadOptimized21Steps,
  loadStepBlocks,
  getStepInfo,
  getQuizData,
  getCalculationConfig,
  getConversionConfig
};