/**
 * 🧪 TESTES E2E: Drag & Drop entre Blocos - Jornada do Usuário
 * 
 * Simula a jornada completa:
 * 1. Usuário abre editor
 * 2. Seleciona um step
 * 3. Arrasta componente da biblioteca
 * 4. Vê drop zones aparecerem
 * 5. Solta em posição específica
 * 6. Verifica resultado no canvas
 * 
 * Usa Playwright ou Cypress-like API
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ========================================
// SIMULAÇÃO DE JORNADA DO USUÁRIO
// ========================================

interface UserAction {
  type: 'click' | 'drag' | 'drop' | 'hover' | 'wait';
  target?: string;
  from?: string;
  to?: string;
  duration?: number;
}

interface EditorState {
  selectedStepId: string | null;
  blocks: Array<{ id: string; type: string; order: number }>;
  isDragging: boolean;
  dropZonesVisible: boolean;
  lastAction: string;
}

/**
 * Mock do Editor State Machine
 */
class EditorStateMachine {
  private state: EditorState = {
    selectedStepId: null,
    blocks: [],
    isDragging: false,
    dropZonesVisible: false,
    lastAction: 'init',
  };

  selectStep(stepId: string): void {
    this.state.selectedStepId = stepId;
    this.state.lastAction = `selected-step-${stepId}`;
  }

  loadBlocks(blocks: Array<{ id: string; type: string; order: number }>): void {
    this.state.blocks = blocks;
    this.state.lastAction = 'blocks-loaded';
  }

  startDrag(componentType: string): void {
    this.state.isDragging = true;
    this.state.dropZonesVisible = true;
    this.state.lastAction = `drag-start-${componentType}`;
  }

  endDrag(): void {
    this.state.isDragging = false;
    this.state.dropZonesVisible = false;
    this.state.lastAction = 'drag-end';
  }

  dropComponent(componentType: string, position: number): void {
    const newBlock = {
      id: `${this.state.selectedStepId}-${componentType}-${Date.now()}`,
      type: componentType,
      order: position,
    };

    // Inserir na posição
    const updated = [...this.state.blocks];
    updated.splice(position, 0, newBlock);

    // Reordenar
    updated.forEach((b, i) => { b.order = i; });

    this.state.blocks = updated;
    this.state.lastAction = `dropped-${componentType}-at-${position}`;
    this.endDrag();
  }

  getState(): EditorState {
    return { ...this.state };
  }

  getBlockIds(): string[] {
    return this.state.blocks.map(b => b.id);
  }

  getBlockAtIndex(index: number) {
    return this.state.blocks[index];
  }
}

// ========================================
// CENÁRIOS DE USUÁRIO
// ========================================

describe('🎯 E2E: Jornada do Usuário - Drag & Drop', () => {
  let editor: EditorStateMachine;

  beforeEach(() => {
    editor = new EditorStateMachine();
  });

  describe('✅ Cenário 1: Usuário Iniciante - Primeira Inserção', () => {
    it('deve permitir inserir primeiro componente em step vazio', () => {
      // 1. Usuário abre editor
      expect(editor.getState().lastAction).toBe('init');

      // 2. Seleciona step vazio
      editor.selectStep('step-intro');
      editor.loadBlocks([]);

      expect(editor.getState().selectedStepId).toBe('step-intro');
      expect(editor.getState().blocks.length).toBe(0);

      // 3. Arrasta "Título" da biblioteca
      editor.startDrag('heading');
      
      expect(editor.getState().isDragging).toBe(true);
      expect(editor.getState().dropZonesVisible).toBe(true);

      // 4. Solta no canvas (posição 0, único lugar disponível)
      editor.dropComponent('heading', 0);

      // 5. Verifica resultado
      expect(editor.getState().blocks.length).toBe(1);
      expect(editor.getState().blocks[0].type).toBe('heading');
      expect(editor.getState().blocks[0].order).toBe(0);
      expect(editor.getState().isDragging).toBe(false);
    });
  });

  describe('✅ Cenário 2: Usuário Experiente - Inserção Precisa', () => {
    it('deve inserir componente ENTRE blocos existentes', () => {
      // Setup: Step com 3 blocos
      editor.selectStep('step-question');
      editor.loadBlocks([
        { id: 'block-1', type: 'heading', order: 0 },
        { id: 'block-2', type: 'paragraph', order: 1 },
        { id: 'block-3', type: 'button', order: 2 },
      ]);

      // 1. Usuário quer inserir imagem ENTRE parágrafo e botão
      editor.startDrag('image');

      // 2. Passa mouse sobre drop zone antes do botão (posição 2)
      // (validação visual não simulada aqui)

      // 3. Solta componente
      editor.dropComponent('image', 2);

      // 4. Verifica ordem final: heading, paragraph, IMAGE, button
      const blockTypes = editor.getState().blocks.map(b => b.type);
      expect(blockTypes).toEqual(['heading', 'paragraph', 'image', 'button']);

      // 5. Verifica índices
      const orders = editor.getState().blocks.map(b => b.order);
      expect(orders).toEqual([0, 1, 2, 3]);
    });

    it('deve inserir múltiplos componentes em sequência', () => {
      editor.selectStep('step-1');
      editor.loadBlocks([
        { id: 'block-1', type: 'heading', order: 0 },
      ]);

      // Inserção 1: Paragraph no início
      editor.startDrag('paragraph');
      editor.dropComponent('paragraph', 0);
      expect(editor.getState().blocks.length).toBe(2);

      // Inserção 2: Image no final
      editor.startDrag('image');
      editor.dropComponent('image', 2);
      expect(editor.getState().blocks.length).toBe(3);

      // Inserção 3: Button no meio (posição 1)
      editor.startDrag('button');
      editor.dropComponent('button', 1);
      expect(editor.getState().blocks.length).toBe(4);

      // Ordem final esperada: paragraph, button, heading, image
      const types = editor.getState().blocks.map(b => b.type);
      expect(types).toEqual(['paragraph', 'button', 'heading', 'image']);
    });
  });

  describe('✅ Cenário 3: Usuário Corrigindo Estrutura', () => {
    it('deve permitir reorganizar blocos inserindo novos entre eles', () => {
      // Setup: Estrutura inicial incorreta
      editor.selectStep('step-fix');
      editor.loadBlocks([
        { id: 'title', type: 'heading', order: 0 },
        { id: 'button', type: 'button', order: 1 }, // Falta descrição!
      ]);

      // Usuário percebe que falta descrição entre título e botão
      editor.startDrag('paragraph');
      editor.dropComponent('paragraph', 1); // Entre title e button

      // Estrutura corrigida
      const types = editor.getState().blocks.map(b => b.type);
      expect(types).toEqual(['heading', 'paragraph', 'button']);
    });

    it('deve adicionar múltiplos elementos complementares', () => {
      editor.selectStep('step-enhance');
      editor.loadBlocks([
        { id: 'title', type: 'heading', order: 0 },
        { id: 'cta', type: 'button', order: 1 },
      ]);

      // Adicionar imagem após título
      editor.startDrag('image');
      editor.dropComponent('image', 1);

      // Adicionar descrição após imagem
      editor.startDrag('paragraph');
      editor.dropComponent('paragraph', 2);

      // Adicionar spacer antes do botão
      editor.startDrag('spacer');
      editor.dropComponent('spacer', 3);

      // Estrutura final rica
      const types = editor.getState().blocks.map(b => b.type);
      expect(types).toEqual(['heading', 'image', 'paragraph', 'spacer', 'button']);
    });
  });

  describe('✅ Cenário 4: Edge Cases do Mundo Real', () => {
    it('deve lidar com cancelamento de drag (drop fora do canvas)', () => {
      editor.selectStep('step-cancel');
      editor.loadBlocks([
        { id: 'block-1', type: 'heading', order: 0 },
      ]);

      const initialBlockCount = editor.getState().blocks.length;

      // Inicia drag
      editor.startDrag('paragraph');
      expect(editor.getState().isDragging).toBe(true);

      // Usuário solta fora do canvas (simula cancelamento)
      editor.endDrag();
      
      // Nenhum bloco foi adicionado
      expect(editor.getState().blocks.length).toBe(initialBlockCount);
      expect(editor.getState().isDragging).toBe(false);
    });

    it('deve inserir no início mesmo quando há muitos blocos', () => {
      // Setup: 10 blocos
      const manyBlocks = Array.from({ length: 10 }, (_, i) => ({
        id: `block-${i}`,
        type: i % 2 === 0 ? 'heading' : 'paragraph',
        order: i,
      }));

      editor.selectStep('step-many');
      editor.loadBlocks(manyBlocks);

      // Inserir novo heading no topo
      editor.startDrag('heading');
      editor.dropComponent('heading', 0);

      // Primeiro bloco deve ser o novo
      expect(editor.getBlockAtIndex(0).type).toBe('heading');
      expect(editor.getState().blocks.length).toBe(11);
    });

    it('deve manter performance com muitas drop zones', () => {
      // Setup: 50 blocos (cenário extremo)
      const manyBlocks = Array.from({ length: 50 }, (_, i) => ({
        id: `block-${i}`,
        type: 'paragraph',
        order: i,
      }));

      editor.selectStep('step-performance');
      editor.loadBlocks(manyBlocks);

      const startTime = performance.now();

      // Inserir no meio (posição 25)
      editor.startDrag('image');
      editor.dropComponent('image', 25);

      const endTime = performance.now();
      const operationTime = endTime - startTime;

      // Deve completar em menos de 10ms
      expect(operationTime).toBeLessThan(10);
      expect(editor.getState().blocks.length).toBe(51);
      expect(editor.getBlockAtIndex(25).type).toBe('image');
    });
  });

  describe('✅ Cenário 5: Validação de Estado Final', () => {
    it('ordem deve ser sempre sequencial sem gaps', () => {
      editor.selectStep('step-validate');
      editor.loadBlocks([
        { id: 'a', type: 'heading', order: 0 },
        { id: 'b', type: 'paragraph', order: 1 },
      ]);

      // Múltiplas inserções
      editor.dropComponent('image', 1);
      editor.dropComponent('button', 0);
      editor.dropComponent('spacer', 3);

      // Verificar ordem sequencial
      const orders = editor.getState().blocks.map(b => b.order);
      expect(orders).toEqual([0, 1, 2, 3, 4]); // Sem gaps

      // Verificar unicidade
      const uniqueOrders = new Set(orders);
      expect(uniqueOrders.size).toBe(orders.length);
    });

    it('IDs devem ser únicos e seguir convenção', () => {
      editor.selectStep('step-ids');
      editor.loadBlocks([]);

      editor.dropComponent('heading', 0);
      editor.dropComponent('paragraph', 1);
      editor.dropComponent('button', 2);

      const ids = editor.getBlockIds();
      
      // Todos únicos
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      // Seguem padrão: stepId-type-timestamp
      ids.forEach(id => {
        expect(id).toMatch(/^step-ids-(heading|paragraph|button)-\d+$/);
      });
    });
  });

  describe('✅ Cenário 6: Fluxo Completo Real', () => {
    it('deve simular criação completa de uma página de quiz', () => {
      // 1. Selecionar step intro
      editor.selectStep('step-intro');
      editor.loadBlocks([]);

      // 2. Construir estrutura passo a passo
      const buildSteps = [
        { component: 'heading', position: 0, expectedType: 'heading' },
        { component: 'image', position: 1, expectedType: 'image' },
        { component: 'paragraph', position: 2, expectedType: 'paragraph' },
        { component: 'spacer', position: 3, expectedType: 'spacer' },
        { component: 'button', position: 4, expectedType: 'button' },
      ];

      buildSteps.forEach((step, index) => {
        editor.startDrag(step.component);
        editor.dropComponent(step.component, step.position);

        // Validar após cada inserção
        expect(editor.getState().blocks.length).toBe(index + 1);
        expect(editor.getBlockAtIndex(step.position).type).toBe(step.expectedType);
      });

      // 3. Validação final da estrutura completa
      const finalTypes = editor.getState().blocks.map(b => b.type);
      expect(finalTypes).toEqual(['heading', 'image', 'paragraph', 'spacer', 'button']);

      // 4. Todas as ordens devem estar corretas
      const finalOrders = editor.getState().blocks.map(b => b.order);
      expect(finalOrders).toEqual([0, 1, 2, 3, 4]);

      // 5. Estado final limpo
      expect(editor.getState().isDragging).toBe(false);
      expect(editor.getState().dropZonesVisible).toBe(false);
    });
  });
});

// ========================================
// TESTES DE REGRESSÃO
// ========================================

describe('🎯 Testes de Regressão - Bugs Conhecidos', () => {
  let editor: EditorStateMachine;

  beforeEach(() => {
    editor = new EditorStateMachine();
  });

  it('[BUG-FIX] não deve duplicar blocos ao inserir', () => {
    editor.selectStep('step-bug');
    editor.loadBlocks([
      { id: 'original', type: 'heading', order: 0 },
    ]);

    editor.dropComponent('paragraph', 0);

    // Deve ter exatamente 2 blocos
    expect(editor.getState().blocks.length).toBe(2);
    
    // IDs devem ser diferentes
    const ids = editor.getBlockIds();
    expect(new Set(ids).size).toBe(2);
  });

  it('[BUG-FIX] não deve perder blocos ao reordenar', () => {
    editor.selectStep('step-reorder');
    editor.loadBlocks([
      { id: 'a', type: 'heading', order: 0 },
      { id: 'b', type: 'paragraph', order: 1 },
      { id: 'c', type: 'button', order: 2 },
    ]);

    const initialIds = editor.getBlockIds();

    // Inserir no meio
    editor.dropComponent('image', 1);

    // Todos os blocos originais devem estar presentes
    const finalIds = editor.getBlockIds();
    expect(finalIds).toContain(initialIds[0]);
    expect(finalIds).toContain(initialIds[1]);
    expect(finalIds).toContain(initialIds[2]);
  });

  it('[BUG-FIX] ordem não deve ter números negativos ou muito altos', () => {
    editor.selectStep('step-order-validation');
    editor.loadBlocks([
      { id: 'a', type: 'heading', order: 0 },
    ]);

    // Múltiplas inserções
    for (let i = 0; i < 10; i++) {
      editor.dropComponent('paragraph', i);
    }

    const orders = editor.getState().blocks.map(b => b.order);
    
    // Todos >= 0
    orders.forEach(order => expect(order).toBeGreaterThanOrEqual(0));
    
    // Máximo deve ser blocks.length - 1
    expect(Math.max(...orders)).toBe(editor.getState().blocks.length - 1);
  });
});
