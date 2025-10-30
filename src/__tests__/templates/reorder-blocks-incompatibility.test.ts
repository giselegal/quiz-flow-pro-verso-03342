/**
 * @file PROBLEMA: Incompatibilidade de Assinaturas - reorderBlocks
 * 
 * ❌ PROBLEMA IDENTIFICADO:
 * 
 * 1. FunnelEditingFacade.reorderBlocks(stepId, newOrder: string[])
 *    - Recebe array de IDs dos blocos na NOVA ordem
 *    - Exemplo: ['blk-2', 'blk-1', 'blk-3']
 * 
 * 2. EditorProviderUnified.reorderBlocks(stepKey, oldIndex, newIndex)
 *    - Recebe índices (posição antiga e nova)
 *    - Exemplo: (0, 2) - move bloco da posição 0 para posição 2
 * 
 * 3. QuizModularProductionEditor
 *    - Chama: editorCtx.actions.reorderBlocks(selectedStep.id, oldIndex, newIndex)
 *    - Usa a assinatura do EditorProvider (índices)
 * 
 * ❌ RESULTADO: EditorProvider NÃO está usando Facade.reorderBlocks
 * 
 * ✅ SOLUÇÃO NECESSÁRIA:
 * 
 * Opção 1: Adaptar EditorProvider para converter índices → array de IDs
 * Opção 2: Adicionar sobrecarga no Facade para aceitar índices
 * Opção 3: Criar wrapper adapter que converte chamadas
 */

import { describe, it, expect } from 'vitest';

describe('❌ INCOMPATIBILIDADE: reorderBlocks Signatures', () => {
  it('documenta o problema de assinaturas incompatíveis', () => {
    console.log(`\n${  '='.repeat(80)}`);
    console.log('❌ PROBLEMA: facade.reorderBlocks NÃO está sendo usado corretamente');
    console.log('='.repeat(80));
    
    console.log('\n📋 ASSINATURAS ATUAIS:');
    console.log('\n1️⃣ FunnelEditingFacade.reorderBlocks:');
    console.log('   interface: reorderBlocks(stepId: string, newOrder: string[]): void');
    console.log('   exemplo:   facade.reorderBlocks("step-01", ["blk-2", "blk-1", "blk-3"])');
    console.log('   tipo:      Recebe ARRAY DE IDs na nova ordem');
    
    console.log('\n2️⃣ EditorProviderUnified.reorderBlocks:');
    console.log('   interface: reorderBlocks(stepKey: string, oldIndex: number, newIndex: number): Promise<void>');
    console.log('   exemplo:   actions.reorderBlocks("step-01", 0, 2)');
    console.log('   tipo:      Recebe ÍNDICES (posição antiga e nova)');
    
    console.log('\n3️⃣ QuizModularProductionEditor (linha 2958):');
    console.log('   chamada:   editorCtx.actions.reorderBlocks(selectedStep.id, oldIndex, newIndex)');
    console.log('   tipo:      Usa assinatura do EditorProvider (ÍNDICES)');
    
    console.log('\n❌ CONCLUSÃO:');
    console.log('   • EditorProvider NÃO está delegando para Facade.reorderBlocks');
    console.log('   • EditorProvider usa stateManager.reorderBlocks (implementação local)');
    console.log('   • Facade.reorderBlocks NÃO é chamado no fluxo de edição');
    
    console.log('\n🔍 EVIDÊNCIAS:');
    console.log('   • EditorProviderUnified.tsx linha 315:');
    console.log('     await stateManager.reorderBlocks(normalizeStepKey(stepKey), oldIndex, newIndex);');
    console.log('   • NÃO chama facade em nenhum momento');
    console.log('   • Facade e EditorProvider operam INDEPENDENTEMENTE');
    
    console.log(`\n${  '='.repeat(80)}`);
    
    // Este teste sempre passa - é documentação do problema
    expect(true).toBe(true);
  });
  
  it('demonstra como DEVERIA funcionar', () => {
    console.log(`\n${  '='.repeat(80)}`);
    console.log('✅ SOLUÇÃO: Como integrar corretamente');
    console.log('='.repeat(80));
    
    console.log('\n📋 OPÇÃO 1: Adapter no EditorProvider');
    console.log('```typescript');
    console.log('const reorderBlocks = useCallback(async (stepKey: string, oldIndex: number, newIndex: number) => {');
    console.log('  if (facade) {');
    console.log('    // Obter blocos atuais do step');
    console.log('    const step = facade.getStep(stepKey);');
    console.log('    if (!step) return;');
    console.log('    ');
    console.log('    // Converter índices para array de IDs');
    console.log('    const blocks = step.blocks.slice();');
    console.log('    const [moved] = blocks.splice(oldIndex, 1);');
    console.log('    blocks.splice(newIndex, 0, moved);');
    console.log('    const newOrder = blocks.map(b => b.id);');
    console.log('    ');
    console.log('    // Chamar facade com array de IDs');
    console.log('    facade.reorderBlocks(stepKey, newOrder);');
    console.log('    await facade.save();');
    console.log('  } else {');
    console.log('    // Fallback para stateManager');
    console.log('    await stateManager.reorderBlocks(normalizeStepKey(stepKey), oldIndex, newIndex);');
    console.log('  }');
    console.log('}, [facade, stateManager, normalizeStepKey]);');
    console.log('```');
    
    console.log('\n📋 OPÇÃO 2: Sobrecarga no Facade');
    console.log('```typescript');
    console.log('// Em FunnelEditingFacade.ts:');
    console.log('reorderBlocks(stepId: FunnelStepID, newOrder: FunnelBlockID[]): void;');
    console.log('reorderBlocks(stepId: FunnelStepID, oldIndex: number, newIndex: number): void;');
    console.log('');
    console.log('reorderBlocks(stepId: FunnelStepID, newOrderOrOldIndex: FunnelBlockID[] | number, newIndex?: number): void {');
    console.log('  const step = this.state.steps.find(s => s.id === stepId);');
    console.log('  if (!step) return;');
    console.log('  ');
    console.log('  // Se recebeu array de IDs');
    console.log('  if (Array.isArray(newOrderOrOldIndex)) {');
    console.log('    const newOrder = newOrderOrOldIndex;');
    console.log('    // Implementação existente...');
    console.log('  }');
    console.log('  // Se recebeu índices');
    console.log('  else if (typeof newOrderOrOldIndex === "number" && typeof newIndex === "number") {');
    console.log('    const oldIndex = newOrderOrOldIndex;');
    console.log('    const blocks = step.blocks.slice();');
    console.log('    const [moved] = blocks.splice(oldIndex, 1);');
    console.log('    blocks.splice(newIndex, 0, moved);');
    console.log('    const newOrder = blocks.map(b => b.id);');
    console.log('    this.reorderBlocks(stepId, newOrder); // Chama versão array');
    console.log('  }');
    console.log('}');
    console.log('```');
    
    console.log('\n📋 OPÇÃO 3: Wrapper Adapter (mais limpo)');
    console.log('```typescript');
    console.log('// Em EditorProviderUnified.tsx:');
    console.log('const reorderBlocksByIndices = useCallback((stepKey: string, oldIndex: number, newIndex: number) => {');
    console.log('  if (!facade) return stateManager.reorderBlocks(stepKey, oldIndex, newIndex);');
    console.log('  ');
    console.log('  const step = facade.getStep(stepKey);');
    console.log('  if (!step) return;');
    console.log('  ');
    console.log('  const blocks = step.blocks.slice();');
    console.log('  const [moved] = blocks.splice(oldIndex, 1);');
    console.log('  blocks.splice(newIndex, 0, moved);');
    console.log('  ');
    console.log('  facade.reorderBlocks(stepKey, blocks.map(b => b.id));');
    console.log('  return facade.save();');
    console.log('}, [facade, stateManager]);');
    console.log('```');
    
    console.log('\n✅ RECOMENDAÇÃO: Opção 2 (Sobrecarga no Facade)');
    console.log('   • Mantém compatibilidade com ambos os estilos');
    console.log('   • Facade aceita tanto array de IDs quanto índices');
    console.log('   • Não precisa modificar EditorProvider');
    console.log('   • Mais flexível para diferentes casos de uso');
    
    console.log(`\n${  '='.repeat(80)  }\n`);
    
    expect(true).toBe(true);
  });
});
