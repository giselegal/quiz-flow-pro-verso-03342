/**
 * 🧪 TESTES: Drag & Drop entre Blocos no Canvas
 * 
 * Valida:
 * - Detecção de drop zones
 * - Inserção precisa em posições específicas
 * - Reordenação automática de blocos
 * - Cálculo correto de índices
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ========================================
// TIPOS
// ========================================

interface Block {
  id: string;
  type: string;
  order: number;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  parentId?: string | null;
}

interface Step {
  id: string;
  type: string;
  blocks: Block[];
}

interface DropZoneData {
  dropZone: 'before' | 'after';
  blockId: string;
  stepId: string;
  insertIndex: number;
}

interface DragEvent {
  active: { id: string };
  over: { id: string; data?: { current?: DropZoneData } } | null;
}

// ========================================
// HELPERS - Simulam lógica do Editor
// ========================================

/**
 * Simula o handleDragEnd do QuizModularProductionEditor
 */
function handleDragEndSimulation(
  event: DragEvent,
  steps: Step[],
  currentStepId: string,
  COMPONENT_LIBRARY: Array<{ type: string; blockType?: string; defaultProps?: any; defaultContent?: any }>,
): Step[] {
  const { active, over } = event;
  
  if (!over) return steps;
  
  const currentStep = steps.find(s => s.id === currentStepId);
  if (!currentStep) return steps;

  // Verifica se é um componente da biblioteca
  if (String(active.id).startsWith('lib:')) {
    const componentType = String(active.id).slice(4);
    const component = COMPONENT_LIBRARY.find(c => c.type === componentType || c.blockType === componentType);
    
    if (!component) return steps;

    // Criar novo bloco
    const newBlockId = `${currentStepId}-${component.type}-${Date.now()}`;
    const newBlock: Block = {
      id: newBlockId,
      type: component.blockType || component.type,
      order: 0,
      properties: { ...component.defaultProps },
      content: { ...(component.defaultContent || {}) },
      parentId: null,
    };

    // Determinar posição de inserção
    let insertPosition = currentStep.blocks.filter(b => !b.parentId).length; // Default: final

    // 🎯 Detectar drop zones (drop-before-{blockId})
    if (String(over.id).startsWith('drop-before-')) {
      const targetBlockId = String(over.id).replace('drop-before-', '');
      const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId && !b.parentId);
      if (targetBlockIndex >= 0) {
        insertPosition = targetBlockIndex;
      }
    } else if (over.id !== 'canvas-end' && !String(over.id).startsWith('container-slot:')) {
      // Dropped sobre outro bloco - inserir APÓS ele
      const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === over.id);
      if (targetBlockIndex >= 0) {
        insertPosition = targetBlockIndex + 1;
      }
    }

    // Inserir bloco na posição
    const updatedBlocks = [...currentStep.blocks];
    updatedBlocks.splice(insertPosition, 0, newBlock);

    // Reordenar todos os blocos
    updatedBlocks.forEach((block, idx) => {
      block.order = idx;
    });

    // Atualizar step
    return steps.map(step =>
      step.id === currentStepId
        ? { ...step, blocks: updatedBlocks }
        : step,
    );
  }

  return steps;
}

/**
 * Calcula o índice de um bloco na lista de blocos top-level
 */
function getBlockIndex(blocks: Block[], blockId: string): number {
  return blocks.filter(b => !b.parentId).findIndex(b => b.id === blockId);
}

// ========================================
// FIXTURES
// ========================================

const MOCK_COMPONENT_LIBRARY = [
  { type: 'heading', blockType: 'heading', defaultProps: { level: 2 }, defaultContent: { text: 'Título' } },
  { type: 'paragraph', blockType: 'paragraph', defaultProps: {}, defaultContent: { text: 'Texto' } },
  { type: 'image', blockType: 'image', defaultProps: {}, defaultContent: { url: 'https://example.com/img.jpg' } },
  { type: 'button', blockType: 'button', defaultProps: {}, defaultContent: { text: 'Clique aqui' } },
];

function createMockStep(stepId: string, blockCount: number = 3): Step {
  return {
    id: stepId,
    type: 'question',
    blocks: Array.from({ length: blockCount }, (_, i) => ({
      id: `block-${i + 1}`,
      type: i % 2 === 0 ? 'heading' : 'paragraph',
      order: i,
      parentId: null,
    })),
  };
}

// ========================================
// TESTES
// ========================================

describe('🎯 Drag & Drop entre Blocos no Canvas', () => {
  let mockSteps: Step[];
  let currentStepId: string;

  beforeEach(() => {
    currentStepId = 'step-1';
    mockSteps = [createMockStep(currentStepId, 3)];
  });

  describe('✅ Detecção de Drop Zones', () => {
    it('deve detectar drop zone "before" corretamente', () => {
      const event: DragEvent = {
        active: { id: 'lib:image' },
        over: { id: 'drop-before-block-2' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      // Deve ter 4 blocos agora (3 originais + 1 novo)
      expect(step.blocks.length).toBe(4);

      // O novo bloco deve estar na posição 1 (antes de block-2)
      const newBlock = step.blocks.find(b => b.type === 'image')!;
      expect(newBlock.order).toBe(1);

      // block-2 deve ter sido movido para ordem 2
      const block2 = step.blocks.find(b => b.id === 'block-2')!;
      expect(block2.order).toBe(2);
    });

    it('deve inserir no início quando drop zone é do primeiro bloco', () => {
      const event: DragEvent = {
        active: { id: 'lib:button' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      const newBlock = step.blocks.find(b => b.type === 'button')!;
      expect(newBlock.order).toBe(0);
      expect(step.blocks[0].id).toBe(newBlock.id);
    });

    it('deve inserir antes do último bloco quando drop zone é dele', () => {
      const event: DragEvent = {
        active: { id: 'lib:paragraph' },
        over: { id: 'drop-before-block-3' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      const newBlock = step.blocks.find(b => b.type === 'paragraph' && b.id.includes('step-1'))!;
      expect(newBlock.order).toBe(2); // Antes do block-3 que agora está em ordem 3
    });
  });

  describe('✅ Inserção em Posições Específicas', () => {
    it('deve inserir no meio da lista mantendo ordem correta', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-block-2' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      // Verificar ordem final: block-1, novo-heading, block-2, block-3
      expect(step.blocks.map(b => b.order)).toEqual([0, 1, 2, 3]);
      
      const blockIds = step.blocks.map(b => b.id);
      expect(blockIds[0]).toBe('block-1');
      expect(blockIds[2]).toBe('block-2');
      expect(blockIds[3]).toBe('block-3');
    });

    it('deve inserir no final quando drop zone é "canvas-end"', () => {
      const event: DragEvent = {
        active: { id: 'lib:image' },
        over: { id: 'canvas-end' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      const newBlock = step.blocks[step.blocks.length - 1];
      expect(newBlock.type).toBe('image');
      expect(newBlock.order).toBe(3);
    });

    it('deve inserir múltiplos blocos mantendo ordem sequencial', () => {
      let result = mockSteps;

      // Inserir heading antes de block-2
      result = handleDragEndSimulation(
        { active: { id: 'lib:heading' }, over: { id: 'drop-before-block-2' } },
        result,
        currentStepId,
        MOCK_COMPONENT_LIBRARY,
      );

      // Inserir image antes do novo heading
      const newHeadingId = result[0].blocks.find(b => b.type === 'heading' && b.id.includes('step-1'))!.id;
      result = handleDragEndSimulation(
        { active: { id: 'lib:image' }, over: { id: `drop-before-${newHeadingId}` } },
        result,
        currentStepId,
        MOCK_COMPONENT_LIBRARY,
      );

      const step = result.find(s => s.id === currentStepId)!;
      expect(step.blocks.length).toBe(5);
      expect(step.blocks.map(b => b.order)).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('✅ Reordenação Automática', () => {
    it('deve reordenar todos os blocos após inserção', () => {
      const event: DragEvent = {
        active: { id: 'lib:button' },
        over: { id: 'drop-before-block-2' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      // Todos os blocos devem ter ordem sequencial 0, 1, 2, 3
      const orders = step.blocks.map(b => b.order);
      expect(orders).toEqual([0, 1, 2, 3]);
      
      // Não deve haver gaps ou duplicatas
      expect(new Set(orders).size).toBe(orders.length);
    });

    it('deve manter order consistente após múltiplas inserções', () => {
      let result = mockSteps;

      // 3 inserções consecutivas
      const insertions = [
        { active: { id: 'lib:heading' }, over: { id: 'drop-before-block-1' } },
        { active: { id: 'lib:paragraph' }, over: { id: 'drop-before-block-2' } },
        { active: { id: 'lib:image' }, over: { id: 'canvas-end' } },
      ];

      insertions.forEach(event => {
        result = handleDragEndSimulation(event, result, currentStepId, MOCK_COMPONENT_LIBRARY);
      });

      const step = result.find(s => s.id === currentStepId)!;
      const orders = step.blocks.map(b => b.order);
      
      expect(orders).toEqual([0, 1, 2, 3, 4, 5]);
      expect(step.blocks.length).toBe(6);
    });
  });

  describe('✅ Cálculo de Índices', () => {
    it('getBlockIndex deve retornar índice correto para blocos top-level', () => {
      const step = mockSteps[0];
      
      expect(getBlockIndex(step.blocks, 'block-1')).toBe(0);
      expect(getBlockIndex(step.blocks, 'block-2')).toBe(1);
      expect(getBlockIndex(step.blocks, 'block-3')).toBe(2);
    });

    it('getBlockIndex deve ignorar blocos com parentId', () => {
      const stepWithChildren: Step = {
        id: 'step-1',
        type: 'question',
        blocks: [
          { id: 'parent-1', type: 'container', order: 0, parentId: null },
          { id: 'child-1', type: 'heading', order: 0, parentId: 'parent-1' },
          { id: 'parent-2', type: 'container', order: 1, parentId: null },
          { id: 'child-2', type: 'paragraph', order: 0, parentId: 'parent-2' },
        ],
      };

      expect(getBlockIndex(stepWithChildren.blocks, 'parent-1')).toBe(0);
      expect(getBlockIndex(stepWithChildren.blocks, 'parent-2')).toBe(1);
      expect(getBlockIndex(stepWithChildren.blocks, 'child-1')).toBe(-1);
    });
  });

  describe('✅ Validação de Drop ID', () => {
    it('deve retornar steps inalterado quando over é null', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: null,
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      expect(result).toEqual(mockSteps);
    });

    it('deve retornar steps inalterado quando componente não existe', () => {
      const event: DragEvent = {
        active: { id: 'lib:nonexistent' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      expect(result).toEqual(mockSteps);
    });

    it('deve retornar steps inalterado quando step não existe', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, 'nonexistent-step', MOCK_COMPONENT_LIBRARY);
      expect(result).toEqual(mockSteps);
    });

    it('deve tratar drop-before com blockId inválido', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-nonexistent-block' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;

      // Deve inserir no final quando block não é encontrado
      const newBlock = step.blocks[step.blocks.length - 1];
      expect(newBlock.type).toBe('heading');
    });
  });

  describe('✅ Propriedades do Novo Bloco', () => {
    it('deve criar bloco com ID único baseado em timestamp', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;
      const newBlock = step.blocks.find(b => b.id.includes('heading'))!;

      expect(newBlock.id).toMatch(/^step-1-heading-\d+$/);
      expect(newBlock.id).toContain('step-1');
      expect(newBlock.id).toContain('heading');
    });

    it('deve copiar defaultProps do componente para o novo bloco', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;
      const newBlock = step.blocks.find(b => b.type === 'heading' && b.id.includes('step-1'))!;

      expect(newBlock.properties).toEqual({ level: 2 });
    });

    it('deve copiar defaultContent do componente para o novo bloco', () => {
      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'drop-before-block-1' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;
      const newBlock = step.blocks.find(b => b.type === 'heading' && b.id.includes('step-1'))!;

      expect(newBlock.content).toEqual({ text: 'Título' });
    });

    it('deve definir parentId como null para blocos top-level', () => {
      const event: DragEvent = {
        active: { id: 'lib:button' },
        over: { id: 'drop-before-block-2' },
      };

      const result = handleDragEndSimulation(event, mockSteps, currentStepId, MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === currentStepId)!;
      const newBlock = step.blocks.find(b => b.type === 'button')!;

      expect(newBlock.parentId).toBeNull();
    });
  });

  describe('✅ Cenários Edge Case', () => {
    it('deve lidar com step vazio (sem blocos)', () => {
      const emptyStep: Step = { id: 'empty-step', type: 'intro', blocks: [] };
      const steps = [emptyStep];

      const event: DragEvent = {
        active: { id: 'lib:heading' },
        over: { id: 'canvas-end' },
      };

      const result = handleDragEndSimulation(event, steps, 'empty-step', MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === 'empty-step')!;

      expect(step.blocks.length).toBe(1);
      expect(step.blocks[0].order).toBe(0);
    });

    it('deve lidar com step contendo apenas 1 bloco', () => {
      const singleBlockStep: Step = {
        id: 'single',
        type: 'question',
        blocks: [{ id: 'only-block', type: 'heading', order: 0, parentId: null }],
      };

      const event: DragEvent = {
        active: { id: 'lib:paragraph' },
        over: { id: 'drop-before-only-block' },
      };

      const result = handleDragEndSimulation(event, [singleBlockStep], 'single', MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === 'single')!;

      expect(step.blocks.length).toBe(2);
      expect(step.blocks[0].type).toBe('paragraph');
      expect(step.blocks[1].id).toBe('only-block');
    });

    it('deve lidar com blocos que têm children (containers)', () => {
      const stepWithContainers: Step = {
        id: 'step-containers',
        type: 'question',
        blocks: [
          { id: 'container-1', type: 'container', order: 0, parentId: null },
          { id: 'child-1', type: 'heading', order: 0, parentId: 'container-1' },
          { id: 'container-2', type: 'container', order: 1, parentId: null },
        ],
      };

      const event: DragEvent = {
        active: { id: 'lib:button' },
        over: { id: 'drop-before-container-2' },
      };

      const result = handleDragEndSimulation(event, [stepWithContainers], 'step-containers', MOCK_COMPONENT_LIBRARY);
      const step = result.find(s => s.id === 'step-containers')!;

      // Deve ter 4 blocos: container-1, child-1, novo button, container-2
      expect(step.blocks.length).toBe(4);
      
      // O button deve estar na posição 1 (entre os containers)
      const topLevelBlocks = step.blocks.filter(b => !b.parentId);
      expect(topLevelBlocks.length).toBe(3);
      expect(topLevelBlocks[1].type).toBe('button');
    });
  });
});
