// Enhanced Block Registry - Stub Implementation
export const enhancedBlockRegistry = {
  blocks: {
    text: {
      type: 'text',
      name: 'Text Block',
      component: 'TextBlock'
    },
    button: {
      type: 'button', 
      name: 'Button Block',
      component: 'ButtonBlock'
    },
    image: {
      type: 'image',
      name: 'Image Block', 
      component: 'ImageBlock'
    }
  }
};

export const ENHANCED_BLOCK_REGISTRY = enhancedBlockRegistry;

export const getEnhancedBlockComponent = (type: string) => {
  return enhancedBlockRegistry.blocks[type as keyof typeof enhancedBlockRegistry.blocks] || null;
};

export default enhancedBlockRegistry;