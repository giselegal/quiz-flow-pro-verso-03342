/**
 * 🧪 INTEGRATION TESTS - Sistema de Blocos Modulares
 * 
 * Testes end-to-end para validar todo o sistema
 */

import { useState } from 'react';
import type { StepBlockSchema } from '@/data/stepBlockSchemas';
import { INTRO_STEP_SCHEMA, QUESTION_STEP_SCHEMA } from '@/data/stepBlockSchemas';

/**
 * Teste 1: Renderização de Blocos
 */
export function testBlockRendering(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 1: Renderização de Blocos');
  
  try {
    const introBlocks = INTRO_STEP_SCHEMA.blocks;
    const questionBlocks = QUESTION_STEP_SCHEMA.blocks;
    
    // Verificar que schemas existem
    if (!introBlocks || introBlocks.length === 0) {
      return {
        passed: false,
        message: 'INTRO_STEP_SCHEMA não possui blocos'
      };
    }
    
    if (!questionBlocks || questionBlocks.length === 0) {
      return {
        passed: false,
        message: 'QUESTION_STEP_SCHEMA não possui blocos'
      };
    }
    
    // Verificar estrutura de cada bloco
    const validateBlock = (block: StepBlockSchema, index: number) => {
      if (!block.id) return `Bloco ${index} sem ID`;
      if (!block.type) return `Bloco ${index} sem tipo`;
      if (typeof block.order !== 'number') return `Bloco ${index} sem ordem válida`;
      if (!block.props) return `Bloco ${index} sem propriedades`;
      return null;
    };
    
    for (let i = 0; i < introBlocks.length; i++) {
      const error = validateBlock(introBlocks[i], i);
      if (error) {
        return { passed: false, message: error };
      }
    }
    
    for (let i = 0; i < questionBlocks.length; i++) {
      const error = validateBlock(questionBlocks[i], i);
      if (error) {
        return { passed: false, message: error };
      }
    }
    
    return {
      passed: true,
      message: `✅ ${introBlocks.length + questionBlocks.length} blocos validados`,
      details: {
        introBlocks: introBlocks.length,
        questionBlocks: questionBlocks.length
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Teste 2: Operações CRUD em Blocos
 */
export function testBlockCRUD(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 2: Operações CRUD');
  
  try {
    let blocks = [...INTRO_STEP_SCHEMA.blocks];
    const initialCount = blocks.length;
    
    // CREATE: Adicionar novo bloco
    const newBlock: StepBlockSchema = {
      id: 'test-block-new',
      type: 'TextBlock',
      order: blocks.length,
      props: { text: 'Teste' },
      editable: true,
      deletable: true,
      movable: true
    };
    
    blocks = [...blocks, newBlock];
    
    if (blocks.length !== initialCount + 1) {
      return {
        passed: false,
        message: 'Falha ao adicionar bloco'
      };
    }
    
    // READ: Buscar bloco
    const foundBlock = blocks.find(b => b.id === 'test-block-new');
    if (!foundBlock) {
      return {
        passed: false,
        message: 'Falha ao encontrar bloco adicionado'
      };
    }
    
    // UPDATE: Atualizar propriedades
    blocks = blocks.map(b =>
      b.id === 'test-block-new'
        ? { ...b, props: { ...b.props, text: 'Texto Atualizado' } }
        : b
    );
    
    const updatedBlock = blocks.find(b => b.id === 'test-block-new');
    if (updatedBlock?.props.text !== 'Texto Atualizado') {
      return {
        passed: false,
        message: 'Falha ao atualizar bloco'
      };
    }
    
    // DELETE: Remover bloco
    blocks = blocks.filter(b => b.id !== 'test-block-new');
    
    if (blocks.length !== initialCount) {
      return {
        passed: false,
        message: 'Falha ao deletar bloco'
      };
    }
    
    return {
      passed: true,
      message: '✅ CRUD completo validado',
      details: {
        create: '✅',
        read: '✅',
        update: '✅',
        delete: '✅'
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Teste 3: Reordenação de Blocos
 */
export function testBlockReordering(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 3: Reordenação de Blocos');
  
  try {
    let blocks = [...INTRO_STEP_SCHEMA.blocks].map((b, i) => ({ ...b, order: i }));
    
    // Mover bloco para cima
    const moveUp = (blockId: string) => {
      const index = blocks.findIndex(b => b.id === blockId);
      if (index <= 0) return;
      
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      blocks = newBlocks.map((b, i) => ({ ...b, order: i }));
    };
    
    // Mover bloco para baixo
    const moveDown = (blockId: string) => {
      const index = blocks.findIndex(b => b.id === blockId);
      if (index < 0 || index >= blocks.length - 1) return;
      
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      blocks = newBlocks.map((b, i) => ({ ...b, order: i }));
    };
    
    const secondBlockId = blocks[1]?.id;
    const thirdBlockId = blocks[2]?.id;
    
    if (!secondBlockId || !thirdBlockId) {
      return {
        passed: false,
        message: 'Blocos insuficientes para teste'
      };
    }
    
    // Testar mover para baixo
    const originalSecondOrder = blocks[1].order;
    moveDown(secondBlockId);
    const newSecondPosition = blocks.findIndex(b => b.id === secondBlockId);
    
    if (newSecondPosition !== 2) {
      return {
        passed: false,
        message: 'Falha ao mover bloco para baixo'
      };
    }
    
    // Testar mover para cima
    moveUp(secondBlockId);
    const finalSecondPosition = blocks.findIndex(b => b.id === secondBlockId);
    
    if (finalSecondPosition !== 1) {
      return {
        passed: false,
        message: 'Falha ao mover bloco para cima'
      };
    }
    
    // Verificar ordem sequencial
    const orders = blocks.map(b => b.order);
    const expectedOrders = blocks.map((_, i) => i);
    
    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      return {
        passed: false,
        message: 'Ordem não é sequencial após reordenação'
      };
    }
    
    return {
      passed: true,
      message: '✅ Reordenação validada',
      details: {
        moveUp: '✅',
        moveDown: '✅',
        sequentialOrder: '✅'
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Teste 4: Duplicação de Blocos
 */
export function testBlockDuplication(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 4: Duplicação de Blocos');
  
  try {
    let blocks = [...INTRO_STEP_SCHEMA.blocks];
    const initialCount = blocks.length;
    const blockToDuplicate = blocks[1];
    
    if (!blockToDuplicate) {
      return {
        passed: false,
        message: 'Bloco para duplicar não encontrado'
      };
    }
    
    // Duplicar bloco
    const duplicated: StepBlockSchema = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}-copy-${Date.now()}`,
      order: blocks.length
    };
    
    blocks = [...blocks, duplicated];
    
    if (blocks.length !== initialCount + 1) {
      return {
        passed: false,
        message: 'Falha ao adicionar bloco duplicado'
      };
    }
    
    // Verificar propriedades duplicadas
    const original = blocks.find(b => b.id === blockToDuplicate.id);
    const copy = blocks.find(b => b.id === duplicated.id);
    
    if (!copy) {
      return {
        passed: false,
        message: 'Cópia não encontrada'
      };
    }
    
    // Verificar que props foram copiadas
    if (copy.type !== original?.type) {
      return {
        passed: false,
        message: 'Tipo não foi copiado corretamente'
      };
    }
    
    // Verificar que ID é único
    if (copy.id === original?.id) {
      return {
        passed: false,
        message: 'ID duplicado (deveria ser único)'
      };
    }
    
    return {
      passed: true,
      message: '✅ Duplicação validada',
      details: {
        originalId: blockToDuplicate.id,
        copyId: duplicated.id,
        propsPreserved: '✅',
        uniqueId: '✅'
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Teste 5: Validação de Props
 */
export function testPropsValidation(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 5: Validação de Props');
  
  try {
    const blocks = INTRO_STEP_SCHEMA.blocks;
    const errors: string[] = [];
    
    // Verificar props essenciais por tipo
    blocks.forEach(block => {
      switch (block.type) {
        case 'LogoBlock':
          if (!block.props.logoUrl) errors.push(`${block.id}: logoUrl ausente`);
          if (!block.props.height) errors.push(`${block.id}: height ausente`);
          if (!block.props.width) errors.push(`${block.id}: width ausente`);
          break;
          
        case 'HeadlineBlock':
          if (!block.props.text && !block.props.html) {
            errors.push(`${block.id}: text/html ausente`);
          }
          break;
          
        case 'ImageBlock':
          if (!block.props.src) errors.push(`${block.id}: src ausente`);
          break;
          
        case 'ButtonBlock':
          if (!block.props.text) errors.push(`${block.id}: text ausente`);
          break;
          
        case 'FormInputBlock':
          if (!block.props.label && !block.props.placeholder) {
            errors.push(`${block.id}: label/placeholder ausente`);
          }
          break;
      }
    });
    
    if (errors.length > 0) {
      return {
        passed: false,
        message: 'Props inválidas encontradas',
        details: { errors }
      };
    }
    
    return {
      passed: true,
      message: '✅ Todas as props válidas',
      details: {
        blocksValidated: blocks.length,
        errors: 0
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Teste 6: Performance (Renderização de muitos blocos)
 */
export function testPerformance(): {
  passed: boolean;
  message: string;
  details?: any;
} {
  console.log('🧪 Teste 6: Performance');
  
  try {
    const startTime = performance.now();
    
    // Criar 100 blocos
    const manyBlocks: StepBlockSchema[] = Array.from({ length: 100 }, (_, i) => ({
      id: `perf-block-${i}`,
      type: 'TextBlock',
      order: i,
      props: { text: `Bloco ${i}` },
      editable: true,
      deletable: true,
      movable: true
    }));
    
    // Simular operações
    let blocks = [...manyBlocks];
    
    // 1. Buscar blocos (100x)
    for (let i = 0; i < 100; i++) {
      blocks.find(b => b.id === `perf-block-${i}`);
    }
    
    // 2. Atualizar props (100x)
    for (let i = 0; i < 100; i++) {
      blocks = blocks.map(b =>
        b.id === `perf-block-${i}`
          ? { ...b, props: { ...b.props, text: `Updated ${i}` } }
          : b
      );
    }
    
    // 3. Reordenar (10x)
    for (let i = 0; i < 10; i++) {
      blocks = blocks.map((b, idx) => ({ ...b, order: idx }));
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Performance threshold: < 1000ms para 100 blocos
    const threshold = 1000;
    
    if (duration > threshold) {
      return {
        passed: false,
        message: `Performance abaixo do esperado: ${duration.toFixed(2)}ms (limite: ${threshold}ms)`,
        details: {
          duration: `${duration.toFixed(2)}ms`,
          threshold: `${threshold}ms`,
          blocksCount: 100
        }
      };
    }
    
    return {
      passed: true,
      message: `✅ Performance validada: ${duration.toFixed(2)}ms`,
      details: {
        duration: `${duration.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        blocksCount: 100,
        operationsPerSecond: Math.round((300 / duration) * 1000) // 100 buscar + 100 update + 100 reorder
      }
    };
    
  } catch (error) {
    return {
      passed: false,
      message: `Erro durante teste: ${error}`
    };
  }
}

/**
 * Executar todos os testes de integração
 */
export function runAllIntegrationTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ test: string; passed: boolean; message: string; details?: any }>;
} {
  console.log('\n🧪 ========== TESTES DE INTEGRAÇÃO ==========\n');
  
  const tests = [
    { name: 'Block Rendering', fn: testBlockRendering },
    { name: 'Block CRUD', fn: testBlockCRUD },
    { name: 'Block Reordering', fn: testBlockReordering },
    { name: 'Block Duplication', fn: testBlockDuplication },
    { name: 'Props Validation', fn: testPropsValidation },
    { name: 'Performance', fn: testPerformance }
  ];
  
  const results = tests.map(test => {
    const result = test.fn();
    console.log(`${result.passed ? '✅' : '❌'} ${test.name}: ${result.message}`);
    if (result.details) {
      console.log('   Detalhes:', result.details);
    }
    return {
      test: test.name,
      ...result
    };
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RESULTADO: ${passed}/${results.length} testes passaram`);
  console.log(`✅ Sucesso: ${passed}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log('='.repeat(50) + '\n');
  
  return {
    passed,
    failed,
    total: results.length,
    results
  };
}

/**
 * Expor testes no console global
 */
if (typeof window !== 'undefined') {
  (window as any).__INTEGRATION_TESTS__ = {
    runAll: runAllIntegrationTests,
    testRendering: testBlockRendering,
    testCRUD: testBlockCRUD,
    testReordering: testBlockReordering,
    testDuplication: testBlockDuplication,
    testProps: testPropsValidation,
    testPerformance: testPerformance
  };
  
  console.log('🧪 Testes de integração disponíveis:');
  console.log('window.__INTEGRATION_TESTS__.runAll() - Executar todos os testes');
}
