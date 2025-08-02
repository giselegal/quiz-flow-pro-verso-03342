
/**
 * Utilitários para manipulação segura de blocos
 * Versão aprimorada para prevenir erros de propriedades undefined
 */

/**
 * Extrai propriedades de forma segura de um bloco
 * @param block - O bloco do qual extrair as propriedades
 * @returns As propriedades do bloco ou um objeto vazio se undefined
 */
export const safeGetBlockProperties = (block: any) => {
  if (!block) {
    console.warn('⚠️ Bloco undefined recebido em safeGetBlockProperties');
    return {};
  }
  
  if (!block.properties) {
    console.warn(`⚠️ Propriedades undefined no bloco ${block.id} (tipo: ${block.type})`);
    return {};
  }
  
  return block.properties;
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
      id: 'default-block',
      type: 'text-inline',
      properties: {}
    };
  }

  return {
    ...block,
    id: block.id || `block-${Date.now()}`,
    type: block.type || 'text-inline',
    properties: block.properties || {}
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
      isValid: isValidBlock(block)
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
      children: [
        `Erro no componente: ${blockType}`,
        error && ` - ${error}`
      ].filter(Boolean).join('')
    }
  };
};
