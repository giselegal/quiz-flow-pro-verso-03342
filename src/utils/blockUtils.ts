// @ts-nocheck
/**
 * Utilitários para manipulação segura de blocos do editor
 */

import { generateSemanticId } from './semanticIdGenerator';

/**
 * Extrai propriedades de forma segura de um bloco
 * @param block - O bloco do qual extrair as propriedades
 * @returns As propriedades do bloco ou um objeto vazio se undefined
 */
export const safeGetBlockProperties = (block: any): Record<string, any> => {
  if (!block) {
    console.warn('⚠️ Bloco undefined ou null');
    return {};
  }

  const blockId = block.id || 'unknown';

  // Tentar diferentes caminhos para as propriedades
  let properties = block.content || block.properties || block.data || {};

  if (!properties || typeof properties !== 'object') {
    console.warn(`⚠️ Propriedades undefined no bloco ${blockId} (tipo: ${block.type})`);
    properties = {};
  }

  // Debug log para entender a estrutura
  console.log(`🧱 Block ${blockId} properties:`, {
    hasContent: !!block.content,
    hasProperties: !!block.properties,
    hasData: !!block.data,
    finalProps: properties,
  });

  return properties;
};

/**
 * Verifica se um bloco tem as propriedades mínimas necessárias
 * @param block - O bloco a ser validado
 * @returns true se o bloco é válido, false caso contrário
 */
export const isValidBlock = (block: any): boolean => {
  return !!(block && block.id && block.type);
};

/**
 * Inicializa um bloco com propriedades padrão seguras
 * @param block - O bloco a ser inicializado
 * @returns Bloco com propriedades garantidas
 */
export const initializeSafeBlock = (block: any) => {
  if (!block) {
    return {
      id: generateSemanticId({
        context: 'editor',
        type: 'block',
        identifier: 'default',
        index: 1,
      }),
      type: 'text-inline',
      properties: {},
    };
  }

  return {
    ...block,
    id:
      block.id ||
      generateSemanticId({
        context: 'editor',
        type: 'block',
        identifier: block.type || 'unknown',
        index: 1,
      }),
    type: block.type || 'text-inline',
    properties: block.properties || {},
  };
};

/**
 * Valida se as propriedades de um bloco são seguras para uso
 * @param properties - As propriedades a serem validadas
 * @returns true se são seguras, false caso contrário
 */
export const validateBlockProperties = (properties: any): boolean => {
  if (!properties || typeof properties !== 'object') {
    return false;
  }

  return true;
};

/**
 * Registra informações de debug sobre um bloco
 * @param componentName - Nome do componente que está renderizando o bloco
 * @param block - O bloco sendo renderizado
 */
export const logBlockDebug = (componentName: string, block: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🧱 ${componentName} - Debug:`, {
      blockId: block?.id,
      blockType: block?.type,
      hasProperties: !!block?.properties,
      propertiesKeys: block?.properties ? Object.keys(block.properties) : [],
      isValid: isValidBlock(block),
    });
  }
};

/**
 * Cria um componente de fallback seguro quando há erro
 * @param blockType - Tipo do bloco que falhou
 * @param error - Erro que ocorreu
 * @returns Elemento React de fallback
 */
export const createSafeFallback = (blockType: string, error?: string) => {
  return {
    type: 'div',
    props: {
      className: 'p-4 bg-red-50 border border-red-200 rounded-lg text-red-700',
      children: [`Erro no componente: ${blockType}`, error && ` - ${error}`]
        .filter(Boolean)
        .join(''),
    },
  };
};

// Função helper para obter valores com fallback
export const getBlockValue = (block: any, key: string, defaultValue: any = '') => {
  const properties = safeGetBlockProperties(block);
  return properties[key] !== undefined ? properties[key] : defaultValue;
};

// Função para atualizar propriedades de um bloco de forma segura
export const updateBlockProperties = (block: any, updates: Record<string, any>) => {
  if (!block) return block;

  const currentProperties = safeGetBlockProperties(block);
  const newProperties = { ...currentProperties, ...updates };

  // Atualizar no caminho correto (content, properties, ou data)
  if (block.content !== undefined) {
    return { ...block, content: newProperties };
  } else if (block.properties !== undefined) {
    return { ...block, properties: newProperties };
  } else if (block.data !== undefined) {
    return { ...block, data: newProperties };
  } else {
    // Fallback - criar content se não existir
    return { ...block, content: newProperties };
  }
};
