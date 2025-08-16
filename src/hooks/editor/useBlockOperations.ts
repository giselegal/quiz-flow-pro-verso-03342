import { Block } from '@/types/editor';

export const useBlockOperations = () => {
  const createBlockFromType = (type: string): Block => {
    const blockId = `block-${Date.now()}-${Math.random()}`;
    
    const getDefaultContent = (blockType: string) => {
      switch (blockType) {
        case 'text':
        case 'text-inline':
          return { text: 'Digite seu texto aqui...', fontSize: 16, textColor: '#000000' };
        case 'heading':
        case 'heading-inline':
          return { title: 'Título Principal', subtitle: 'Subtítulo', textColor: '#000000', backgroundColor: 'transparent' };
        default:
          return {};
      }
    };

    return {
      id: blockId,
      type,
      order: 0,
      content: getDefaultContent(type),
      properties: {}, // Add missing properties field
    };
  };
};
