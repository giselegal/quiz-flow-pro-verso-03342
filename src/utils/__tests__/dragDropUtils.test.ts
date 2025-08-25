import { validateDrop } from '../dragDropUtils';
import { Block } from '@/types/editor';

describe('validateDrop', () => {
  const mockBlocks: Block[] = [
    {
      id: 'block-text-abcd1234',
      type: 'text',
      order: 1,
      content: { text: 'Test block' },
    },
    {
      id: 'block-image-efgh5678',
      type: 'image',
      order: 2,
      content: { url: 'test.jpg', alt: 'Test image' },
    },
  ];

  describe('sidebar-component drag', () => {
    const sidebarActive = {
      id: 'sidebar-item-text',
      data: {
        current: {
          type: 'sidebar-component',
          blockType: 'text',
        },
      },
    } as any;

    it('should validate drop on canvas-drop-zone', () => {
      const over = { id: 'canvas-drop-zone' } as any;
      const result = validateDrop(sidebarActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('add');
    });

    it('should validate drop on drop-zone-N', () => {
      const over = { id: 'drop-zone-1' } as any;
      const result = validateDrop(sidebarActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('add');
    });

    it('should validate drop on existing block (nanoid format)', () => {
      const over = { id: 'block-text-abcd1234' } as any;
      const result = validateDrop(sidebarActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('add');
    });

    it('should validate drop on existing block (UUID format)', () => {
      const mockBlocksUUID: Block[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          type: 'text',
          order: 1,
          content: { text: 'Test block' },
        },
      ];
      
      const over = { id: '550e8400-e29b-41d4-a716-446655440000' } as any;
      const result = validateDrop(sidebarActive, over, mockBlocksUUID);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('add');
    });

    it('should reject drop without blockType', () => {
      const invalidActive = {
        id: 'sidebar-item-text',
        data: {
          current: {
            type: 'sidebar-component',
            // missing blockType
          },
        },
      } as any;
      
      const over = { id: 'canvas-drop-zone' } as any;
      const result = validateDrop(invalidActive, over, mockBlocks);
      
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Componente sem blockType');
    });
  });

  describe('canvas-block drag', () => {
    const canvasActive = {
      id: 'block-text-abcd1234',
      data: {
        current: {
          type: 'canvas-block',
          blockId: 'block-text-abcd1234',
        },
      },
    } as any;

    it('should validate reorder on drop-zone-N', () => {
      const over = { id: 'drop-zone-1' } as any;
      const result = validateDrop(canvasActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('reorder');
    });

    it('should validate reorder on canvas-drop-zone', () => {
      const over = { id: 'canvas-drop-zone' } as any;
      const result = validateDrop(canvasActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('reorder');
    });

    it('should validate reorder on another block', () => {
      const over = { id: 'block-image-efgh5678' } as any;
      const result = validateDrop(canvasActive, over, mockBlocks);
      
      expect(result.isValid).toBe(true);
      expect(result.action).toBe('reorder');
    });

    it('should reject reorder if source block not found', () => {
      const invalidActive = {
        id: 'nonexistent-block',
        data: {
          current: {
            type: 'canvas-block',
            blockId: 'nonexistent-block',
          },
        },
      } as any;
      
      const over = { id: 'canvas-drop-zone' } as any;
      const result = validateDrop(invalidActive, over, mockBlocks);
      
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Bloco de origem não encontrado');
    });
  });

  it('should reject drop with no over target', () => {
    const active = {
      id: 'sidebar-item-text',
      data: {
        current: {
          type: 'sidebar-component',
          blockType: 'text',
        },
      },
    } as any;
    
    const result = validateDrop(active, null, mockBlocks);
    
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Nenhuma zona de drop válida');
  });

  it('should reject drop with invalid drag data', () => {
    const active = {
      id: 'sidebar-item-text',
      data: {
        current: null,
      },
    } as any;
    
    const over = { id: 'canvas-drop-zone' } as any;
    const result = validateDrop(active, over, mockBlocks);
    
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Dados de drag inválidos');
  });
});