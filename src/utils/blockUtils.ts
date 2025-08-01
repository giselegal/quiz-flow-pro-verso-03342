/**
 * Utilitários para manipulação segura de blocos
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
