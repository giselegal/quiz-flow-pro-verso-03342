// @ts-nocheck
/**
 * STUB: Validação básica de blocos
 */
import { Block } from '@/types/editor';

export const validateBlock = (block: Block): boolean => {
  return block && 
         typeof block.id === 'string' && 
         typeof block.type === 'string' && 
         typeof block.order === 'number';
};

export const validateBlockContent = (block: Block): boolean => {
  if (!block) return false;
  
  switch (block.type) {
    case 'text':
    case 'headline':
      return !!(block.content?.text || block.properties?.text);
    
    case 'image':
      return !!(block.content?.src || block.properties?.src);
    
    case 'button':
      return !!(block.content?.text || block.properties?.text);
    
    default:
      return true;
  }
};

export default { validateBlock, validateBlockContent };