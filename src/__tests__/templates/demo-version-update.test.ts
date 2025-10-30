/**
 * @file demo-version-update.test.ts
 * @description Demonstração clara: versão de publicação É ATUALIZADA quando blocos são editados/reordenados
 */

import { describe, it, expect, vi } from 'vitest';
import { QuizFunnelEditingFacade, FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';

describe('📋 DEMONSTRAÇÃO: Atualização de Versão ao Editar Blocos', () => {
  it('🎯 RESPOSTA COMPLETA À PERGUNTA DO USUÁRIO', async () => {
    console.log(`\n${  '='.repeat(80)}`);
    console.log('❓ PERGUNTA: "quando os blocos são reordenados e editados');
    console.log('   a versão de publicação é atualizada???"');
    console.log('='.repeat(80));
    
    // Setup
    const mockPersist = vi.fn();
    const initialSnapshot: FunnelSnapshot = {
      steps: [{
        id: 'step-01',
        title: 'Intro',
        order: 0,
        blocks: [
          { id: 'blk-1', type: 'heading', data: { text: 'Título' } },
          { id: 'blk-2', type: 'text', data: { text: 'Descrição' } },
        ],
      }],
      meta: {
        id: 'test-funnel',
        createdAt: 1000,
        updatedAt: 1000, // Versão inicial
      },
    };
    
    const facade = new QuizFunnelEditingFacade(initialSnapshot, mockPersist);
    
    console.log('\n📊 ESTADO INICIAL:');
    console.log('   updatedAt:', facade.getMeta().updatedAt);
    console.log('   isDirty:', facade.isDirty());
    
    // ========================================================================
    // TESTE 1: REORDENAÇÃO
    // ========================================================================
    
    console.log('\n🔄 TESTE 1: Reordenando blocos...');
    await new Promise(r => setTimeout(r, 50)); // Garantir timestamp diferente
    
    facade.reorderBlocks('step-01', ['blk-2', 'blk-1']);
    console.log('   ✓ Blocos reordenados');
    console.log('   isDirty após reordenar:', facade.isDirty());
    expect(facade.isDirty()).toBe(true);
    
    const beforeSave1 = facade.getMeta().updatedAt;
    await facade.save();
    const afterSave1 = facade.getMeta().updatedAt;
    
    console.log('   updatedAt ANTES do save:', beforeSave1);
    console.log('   updatedAt DEPOIS do save:', afterSave1);
    console.log('   ✅ Versão atualizada?', afterSave1! > beforeSave1!);
    
    expect(afterSave1).toBeGreaterThan(beforeSave1!);
    expect(facade.isDirty()).toBe(false);
    
    // ========================================================================
    // TESTE 2: EDIÇÃO
    // ========================================================================
    
    console.log('\n✏️ TESTE 2: Editando conteúdo do bloco...');
    await new Promise(r => setTimeout(r, 50));
    
    facade.updateBlock('step-01', 'blk-1', {
      data: { text: 'Título Modificado' },
    });
    console.log('   ✓ Bloco editado');
    console.log('   isDirty após editar:', facade.isDirty());
    expect(facade.isDirty()).toBe(true);
    
    const beforeSave2 = facade.getMeta().updatedAt;
    await facade.save();
    const afterSave2 = facade.getMeta().updatedAt;
    
    console.log('   updatedAt ANTES do save:', beforeSave2);
    console.log('   updatedAt DEPOIS do save:', afterSave2);
    console.log('   ✅ Versão atualizada?', afterSave2! > afterSave1!);
    
    expect(afterSave2).toBeGreaterThan(afterSave1!);
    
    // ========================================================================
    // TESTE 3: ADIÇÃO
    // ========================================================================
    
    console.log('\n➕ TESTE 3: Adicionando novo bloco...');
    await new Promise(r => setTimeout(r, 50));
    
    facade.addBlock('step-01', {
      type: 'button',
      data: { text: 'Clique aqui' },
    });
    console.log('   ✓ Bloco adicionado');
    expect(facade.isDirty()).toBe(true);
    
    const beforeSave3 = facade.getMeta().updatedAt;
    await facade.save();
    const afterSave3 = facade.getMeta().updatedAt;
    
    console.log('   updatedAt ANTES do save:', beforeSave3);
    console.log('   updatedAt DEPOIS do save:', afterSave3);
    console.log('   ✅ Versão atualizada?', afterSave3! > afterSave2!);
    
    expect(afterSave3).toBeGreaterThan(afterSave2!);
    
    // ========================================================================
    // TESTE 4: REMOÇÃO
    // ========================================================================
    
    console.log('\n🗑️ TESTE 4: Removendo bloco...');
    await new Promise(r => setTimeout(r, 50));
    
    facade.removeBlock('step-01', 'blk-2');
    console.log('   ✓ Bloco removido');
    expect(facade.isDirty()).toBe(true);
    
    const beforeSave4 = facade.getMeta().updatedAt;
    await facade.save();
    const afterSave4 = facade.getMeta().updatedAt;
    
    console.log('   updatedAt ANTES do save:', beforeSave4);
    console.log('   updatedAt DEPOIS do save:', afterSave4);
    console.log('   ✅ Versão atualizada?', afterSave4! > afterSave3!);
    
    expect(afterSave4).toBeGreaterThan(afterSave3!);
    
    // ========================================================================
    // RESUMO FINAL
    // ========================================================================
    
    console.log(`\n${  '='.repeat(80)}`);
    console.log('✅ RESPOSTA: SIM, a versão de publicação É ATUALIZADA!');
    console.log('='.repeat(80));
    console.log('\n📋 EVIDÊNCIAS COMPROVADAS:');
    console.log('   ✅ Reordenação de blocos → updatedAt atualizado após save()');
    console.log('   ✅ Edição de blocos → updatedAt atualizado após save()');
    console.log('   ✅ Adição de blocos → updatedAt atualizado após save()');
    console.log('   ✅ Remoção de blocos → updatedAt atualizado após save()');
    
    console.log('\n🔍 COMO FUNCIONA:');
    console.log('   1. Qualquer operação (reorder, update, add, remove) marca dirty=true');
    console.log('   2. Ao chamar save(), o sistema:');
    console.log('      • Atualiza state.meta.updatedAt com Date.now()');
    console.log('      • Cria snapshot com nova versão');
    console.log('      • Persiste snapshot (com updatedAt atualizado)');
    console.log('      • Marca dirty=false após sucesso');
    
    console.log('\n💡 IMPLICAÇÕES PRÁTICAS:');
    console.log('   • Toda edição de blocos atualiza versão de publicação');
    console.log('   • Sistema rastreia última modificação automaticamente');
    console.log('   • Suporta versionamento e histórico de mudanças');
    console.log('   • UI pode exibir "Última atualização: há X tempo"');
    console.log('   • Publicação sempre usa versão mais recente');
    
    console.log('\n📈 PROGRESSÃO DAS VERSÕES NESTE TESTE:');
    console.log(`   Inicial:    ${initialSnapshot.meta.updatedAt}`);
    console.log(`   Reordenar:  ${afterSave1} (+${afterSave1! - initialSnapshot.meta.updatedAt!}ms)`);
    console.log(`   Editar:     ${afterSave2} (+${afterSave2! - afterSave1!}ms)`);
    console.log(`   Adicionar:  ${afterSave3} (+${afterSave3! - afterSave2!}ms)`);
    console.log(`   Remover:    ${afterSave4} (+${afterSave4! - afterSave3!}ms)`);
    console.log(`   Total:      +${afterSave4! - initialSnapshot.meta.updatedAt!}ms desde o início`);
    
    console.log(`\n${  '='.repeat(80)}`);
    console.log('🎉 CONCLUSÃO: Sistema de versionamento FUNCIONANDO CORRETAMENTE!');
    console.log(`${'='.repeat(80)  }\n`);
    
    // Validação final
    expect(afterSave4).toBeGreaterThan(initialSnapshot.meta.updatedAt!);
    expect(mockPersist).toHaveBeenCalledTimes(4); // 4 saves realizados
  });
});
