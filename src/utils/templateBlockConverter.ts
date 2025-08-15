/**
 * Conversor de Templates - TSX para JSON Blocks Editáveis
 * Converte configurações dos ConnectedStep templates em blocos editáveis
 */

import type { Block, BlockType } from '@/types/editor';

interface TemplateBlockConfig {
  id: string;
  type: string;
  properties: Record<string, any>;
  [key: string]: any;
}

/**
 * Converte configuração de template TSX em bloco editável
 */
export const convertTemplateBlockToEditorBlock = (
  config: TemplateBlockConfig,
  index: number = 0,
  stageId?: string
): Block => {
  // Criar ID único se não fornecido
  const blockId = config.id || `${stageId || 'block'}-${index + 1}`;
  
  // Extrair propriedades do objeto properties
  const { properties = {}, ...otherProps } = config;
  
  // Mesclar propriedades do template com outras propriedades
  const content = {
    ...properties,
    ...otherProps,
  };

  // Remover campos que não devem estar no content
  const cleanContent: Record<string, any> = { ...content };
  if ('id' in cleanContent) delete cleanContent.id;
  if ('type' in cleanContent) delete cleanContent.type;
  if ('properties' in cleanContent) delete cleanContent.properties;

  const block: Block = {
    id: blockId,
    type: config.type as BlockType,
    content: cleanContent,
    order: index + 1,
    properties: properties,
  };

  return block;
};

/**
 * Converte array de configurações de template em blocos editáveis
 */
export const convertTemplateConfigsToBlocks = (
  configs: TemplateBlockConfig[],
  stageId?: string
): Block[] => {
  if (!Array.isArray(configs)) {
    console.warn('convertTemplateConfigsToBlocks: configs não é um array:', configs);
    return [];
  }

  return configs.map((config, index) => {
    try {
      return convertTemplateBlockToEditorBlock(config, index, stageId);
    } catch (error) {
      console.error(`Erro ao converter bloco ${index}:`, error, config);
      // Retornar bloco de fallback
      return {
        id: `${stageId || 'block'}-error-${index}`,
        type: 'text-inline',
        content: {
          content: `Erro ao carregar bloco: ${config.type || 'unknown'}`,
          color: '#ef4444',
        },
        order: index + 1,
        properties: {},
      };
    }
  });
};

/**
 * Valida se uma configuração é válida
 */
export const isValidTemplateConfig = (config: any): config is TemplateBlockConfig => {
  return (
    config &&
    typeof config === 'object' &&
    typeof config.type === 'string' &&
    config.type.length > 0
  );
};

/**
 * Normaliza propriedades dos templates antigos
 */
export const normalizeTemplateProperties = (properties: Record<string, any>): Record<string, any> => {
  const normalized = { ...properties };

  // Converter onClick handlers para eventos
  if (normalized.onClick && typeof normalized.onClick === 'function') {
    // Converter função para evento customizado
    const originalHandler = normalized.onClick;
    normalized.onClickEvent = 'quiz-button-click';
    normalized.clickHandler = originalHandler.toString();
    delete normalized.onClick;
  }

  // Normalizar valores boolean
  Object.keys(normalized).forEach(key => {
    if (normalized[key] === 'true') normalized[key] = true;
    if (normalized[key] === 'false') normalized[key] = false;
  });

  return normalized;
};

export default {
  convertTemplateBlockToEditorBlock,
  convertTemplateConfigsToBlocks,
  isValidTemplateConfig,
  normalizeTemplateProperties,
};