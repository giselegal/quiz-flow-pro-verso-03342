import { Block, BlockType } from '@/types/editor';
import { nanoid } from 'nanoid';
import { getBlockDefinition } from '@/core/blocks/registry';

/**
 * 🔧 Utilitários para geração de IDs e manipulação de blocos
 */

/**
 * Gera um ID único e consistente para blocos
 */
export const generateBlockId = (componentType: string): string => {
  return `block-${componentType}-${nanoid(8)}`;
};

/**
 * Calcula a próxima ordem para um bloco em uma lista
 */
export const getNextBlockOrder = (blocks: Block[]): number => {
  return (blocks?.length || 0) + 1;
};

/**
 * Cria um bloco a partir de um tipo de componente
 */
export const createBlockFromComponent = (
  componentType: BlockType,
  existingBlocks: Block[] = []
): Block => {
  const def = getBlockDefinition(componentType as any);
  const defaults = def?.defaultProps || {};
  return {
    id: generateBlockId(componentType),
    type: componentType,
    order: getNextBlockOrder(existingBlocks),
    content: {},
    properties: { ...defaults },
  };
};

/**
 * Duplica um bloco existente com novo ID e ordem
 */
export const duplicateBlock = (blockToDuplicate: Block, existingBlocks: Block[] = []): Block => {
  return {
    ...blockToDuplicate,
    id: generateBlockId(`${blockToDuplicate.type}-copy`),
    order: getNextBlockOrder(existingBlocks),
  };
};

/**
 * Função segura para clipboard com fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para ambientes não-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Logger condicional para desenvolvimento
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 [QuizEditor] ${message}`, ...args);
  }
};

/**
 * Valida se um JSON é um estado válido do editor
 */
export const validateEditorJSON = (jsonString: string): { valid: boolean; error?: string } => {
  try {
    const parsed = JSON.parse(jsonString);

    // Verificações básicas de estrutura
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'JSON deve ser um objeto' };
    }

    if (!parsed.stepBlocks || typeof parsed.stepBlocks !== 'object') {
      return { valid: false, error: 'JSON deve conter stepBlocks' };
    }

    if (typeof parsed.currentStep !== 'number' || parsed.currentStep < 1) {
      return { valid: false, error: 'currentStep deve ser um número positivo' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'JSON inválido: ' + (err as Error).message };
  }
};
