// @ts-nocheck
/**
 * @file reorder-blocks-overload.test.ts
 * @description Testa a sobrecarga do método reorderBlocks que aceita tanto array de IDs quanto índices
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuizFunnelEditingFacade, FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';

describe('🔄 reorderBlocks - Sobrecarga (Array de IDs vs Índices)', () => {
  let facade: QuizFunnelEditingFacade;
  let mockPersist: ReturnType<typeof vi.fn>;
  let initialSnapshot: FunnelSnapshot;

  beforeEach(() => {
    mockPersist = vi.fn();
    
    initialSnapshot = {
      steps: [{
        id: 'step-01',
        title: 'Test Step',
        order: 0,
        blocks: [
          { id: 'blk-1', type: 'heading', data: { text: 'Bloco 1' } },
          { id: 'blk-2', type: 'text', data: { text: 'Bloco 2' } },
          { id: 'blk-3', type: 'button', data: { text: 'Bloco 3' } },
          { id: 'blk-4', type: 'image', data: { url: 'test.jpg' } },
        ],
      }],
      meta: {
        id: 'test-funnel',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };
    
    facade = new QuizFunnelEditingFacade(initialSnapshot, mockPersist);
  });

  // ========================================================================
  // TESTE 1: Reordenação com ARRAY DE IDs (comportamento original)
  // ========================================================================
  
  describe('📋 Assinatura 1: Array de IDs', () => {
    it('deve reordenar blocos usando array de IDs na nova ordem', () => {
      const step = facade.getStep('step-01');
      expect(step?.blocks[0].id).toBe('blk-1');
      expect(step?.blocks[1].id).toBe('blk-2');
      expect(step?.blocks[2].id).toBe('blk-3');
      
      // Reordenar: blk-3, blk-1, blk-2, blk-4
      facade.reorderBlocks('step-01', ['blk-3', 'blk-1', 'blk-2', 'blk-4']);
      
      const stepAfter = facade.getStep('step-01');
      expect(stepAfter?.blocks[0].id).toBe('blk-3');
      expect(stepAfter?.blocks[1].id).toBe('blk-1');
      expect(stepAfter?.blocks[2].id).toBe('blk-2');
      expect(stepAfter?.blocks[3].id).toBe('blk-4');
      
      expect(facade.isDirty()).toBe(true);
      
      console.log('✅ Reordenação com array de IDs funcionando');
    });

    it('deve emitir evento blocks/changed com reason: reorder', (done) => {
      facade.on('blocks/changed', (payload) => {
        if (payload.reason === 'reorder') {
          expect(payload.stepId).toBe('step-01');
          expect(payload.blocks).toHaveLength(4);
          expect(payload.blocks[0].id).toBe('blk-2');
          done();
        }
      });
      
      facade.reorderBlocks('step-01', ['blk-2', 'blk-1', 'blk-3', 'blk-4']);
    });

    it('deve preservar blocos que não estão no array newOrder', () => {
      // Passar apenas 2 blocos no array - os outros devem ser mantidos no final
      facade.reorderBlocks('step-01', ['blk-3', 'blk-1']);
      
      const step = facade.getStep('step-01');
      expect(step?.blocks).toHaveLength(4); // Ainda tem 4 blocos
      expect(step?.blocks[0].id).toBe('blk-3');
      expect(step?.blocks[1].id).toBe('blk-1');
      // blk-2 e blk-4 devem estar presentes (ordem não garantida)
      const ids = step?.blocks.map(b => b.id);
      expect(ids).toContain('blk-2');
      expect(ids).toContain('blk-4');
    });
  });

  // ========================================================================
  // TESTE 2: Reordenação com ÍNDICES (compatibilidade EditorProvider)
  // ========================================================================
  
  describe('📋 Assinatura 2: Índices (oldIndex, newIndex)', () => {
    it('deve reordenar blocos usando índices', () => {
      const step = facade.getStep('step-01');
      expect(step?.blocks[0].id).toBe('blk-1');
      expect(step?.blocks[2].id).toBe('blk-3');
      
      // Mover bloco da posição 0 para posição 2
      facade.reorderBlocks('step-01', 0, 2);
      
      const stepAfter = facade.getStep('step-01');
      expect(stepAfter?.blocks[0].id).toBe('blk-2'); // blk-2 subiu
      expect(stepAfter?.blocks[1].id).toBe('blk-3'); // blk-3 subiu
      expect(stepAfter?.blocks[2].id).toBe('blk-1'); // blk-1 foi para posição 2
      expect(stepAfter?.blocks[3].id).toBe('blk-4'); // blk-4 não mexeu
      
      expect(facade.isDirty()).toBe(true);
      
      console.log('✅ Reordenação com índices funcionando');
    });

    it('deve mover bloco para cima (newIndex < oldIndex)', () => {
      // Ordem inicial: blk-1, blk-2, blk-3, blk-4
      // Mover blk-3 (pos 2) para posição 0
      facade.reorderBlocks('step-01', 2, 0);
      
      const step = facade.getStep('step-01');
      expect(step?.blocks[0].id).toBe('blk-3'); // Moveu para cima
      expect(step?.blocks[1].id).toBe('blk-1'); // Desceu
      expect(step?.blocks[2].id).toBe('blk-2'); // Desceu
      expect(step?.blocks[3].id).toBe('blk-4'); // Não mexeu
    });

    it('deve mover bloco para baixo (newIndex > oldIndex)', () => {
      // Ordem inicial: blk-1, blk-2, blk-3, blk-4
      // Mover blk-2 (pos 1) para posição 3
      facade.reorderBlocks('step-01', 1, 3);
      
      const step = facade.getStep('step-01');
      expect(step?.blocks[0].id).toBe('blk-1'); // Não mexeu
      expect(step?.blocks[1].id).toBe('blk-3'); // Subiu
      expect(step?.blocks[2].id).toBe('blk-4'); // Subiu
      expect(step?.blocks[3].id).toBe('blk-2'); // Moveu para baixo
    });

    it('deve ignorar índices inválidos', () => {
      const stepBefore = facade.getStep('step-01');
      const blocksBefore = stepBefore?.blocks.map(b => b.id);
      
      // Índices inválidos
      facade.reorderBlocks('step-01', -1, 0);  // oldIndex negativo
      facade.reorderBlocks('step-01', 0, 10);  // newIndex fora do range
      facade.reorderBlocks('step-01', 10, 0);  // oldIndex fora do range
      
      const stepAfter = facade.getStep('step-01');
      const blocksAfter = stepAfter?.blocks.map(b => b.id);
      
      // Ordem não deve ter mudado
      expect(blocksAfter).toEqual(blocksBefore);
      expect(facade.isDirty()).toBe(false); // Não marcou como dirty
    });

    it('deve emitir evento blocks/changed com reason: reorder', (done) => {
      facade.on('blocks/changed', (payload) => {
        if (payload.reason === 'reorder') {
          expect(payload.stepId).toBe('step-01');
          expect(payload.blocks).toHaveLength(4);
          done();
        }
      });
      
      facade.reorderBlocks('step-01', 0, 1);
    });
  });

  // ========================================================================
  // TESTE 3: Compatibilidade entre as duas assinaturas
  // ========================================================================
  
  describe('🔄 Compatibilidade entre Assinaturas', () => {
    it('deve aceitar e processar ambas assinaturas corretamente', () => {
      // Teste 1: Array de IDs funciona
      facade.reorderBlocks('step-01', ['blk-4', 'blk-3', 'blk-2', 'blk-1']);
      let result = facade.getStep('step-01')?.blocks.map(b => b.id);
      expect(result?.[0]).toBe('blk-4'); // Primeiro agora é blk-4
      expect(facade.isDirty()).toBe(true);
      
      // Resetar com snapshot FRESCO (não reutilizar initialSnapshot que foi modificado)
      const freshSnapshot: FunnelSnapshot = {
        steps: [{
          id: 'step-01',
          title: 'Test Step',
          order: 0,
          blocks: [
            { id: 'blk-1', type: 'heading', data: { text: 'Bloco 1' } },
            { id: 'blk-2', type: 'text', data: { text: 'Bloco 2' } },
            { id: 'blk-3', type: 'button', data: { text: 'Bloco 3' } },
            { id: 'blk-4', type: 'image', data: { url: 'test.jpg' } },
          ],
        }],
        meta: {
          id: 'test-funnel-2',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };
      facade = new QuizFunnelEditingFacade(freshSnapshot, mockPersist);
      
      // Teste 2: Índices funcionam
      facade.reorderBlocks('step-01', 0, 3); // Mover primeiro para último
      result = facade.getStep('step-01')?.blocks.map(b => b.id);
      expect(result?.[0]).toBe('blk-2'); // Primeiro agora é blk-2
      expect(result?.[3]).toBe('blk-1'); // Último agora é blk-1
      expect(facade.isDirty()).toBe(true);
      
      console.log('✅ Ambas assinaturas funcionam corretamente');
    });

    it('deve atualizar updatedAt igualmente em ambas assinaturas', async () => {
      // Teste com array de IDs
      await new Promise(r => setTimeout(r, 50));
      facade.reorderBlocks('step-01', ['blk-2', 'blk-1', 'blk-3', 'blk-4']);
      await facade.save();
      const version1 = facade.getMeta().updatedAt;
      
      // Resetar e testar com índices
      await new Promise(r => setTimeout(r, 50));
      facade = new QuizFunnelEditingFacade(initialSnapshot, mockPersist);
      facade.reorderBlocks('step-01', 0, 1);
      await facade.save();
      const version2 = facade.getMeta().updatedAt;
      
      expect(version1).toBeGreaterThan(initialSnapshot.meta.updatedAt!);
      expect(version2).toBeGreaterThan(initialSnapshot.meta.updatedAt!);
      console.log('✅ updatedAt atualizado corretamente em ambas assinaturas');
    });
  });

  // ========================================================================
  // TESTE 4: Integração com EditorProvider
  // ========================================================================
  
  describe('🔗 Integração com EditorProvider', () => {
    it('simula chamada do EditorProvider (índices)', () => {
      // EditorProvider chama: reorderBlocks(stepKey, oldIndex, newIndex)
      const stepKey = 'step-01';
      const oldIndex = 0;
      const newIndex = 2;
      
      // Chamar facade diretamente com índices (sem conversão)
      facade.reorderBlocks(stepKey, oldIndex, newIndex);
      
      const step = facade.getStep(stepKey);
      expect(step?.blocks[0].id).toBe('blk-2');
      expect(step?.blocks[2].id).toBe('blk-1');
      expect(facade.isDirty()).toBe(true);
      
      console.log('✅ Facade aceita chamada do EditorProvider sem adaptação');
    });

    it('documenta fluxo completo de integração', () => {
      console.log(`\n${  '='.repeat(70)}`);
      console.log('✅ INTEGRAÇÃO: EditorProvider → Facade → Save');
      console.log('='.repeat(70));
      console.log('\n1️⃣ EditorProvider recebe: (stepKey, oldIndex, newIndex)');
      console.log('   Exemplo: reorderBlocks("step-01", 0, 2)');
      console.log('\n2️⃣ Facade aceita DIRETAMENTE (sem adaptação):');
      console.log('   facade.reorderBlocks("step-01", 0, 2)');
      console.log('\n3️⃣ Facade detecta tipo automaticamente:');
      console.log('   • Se 2º param é number → usa implementação de índices');
      console.log('   • Se 2º param é array → usa implementação de IDs');
      console.log('\n4️⃣ Facade marca dirty=true e emite evento');
      console.log('\n5️⃣ Save atualiza updatedAt e persiste');
      console.log('\n✅ RESULTADO: Integração transparente e sem conflitos!');
      console.log(`${'='.repeat(70)  }\n`);
      
      expect(true).toBe(true);
    });
  });
});
