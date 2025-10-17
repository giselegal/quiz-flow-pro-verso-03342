#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO: Drag-and-Drop não funciona
 * 
 * Investiga por que componentes não podem ser arrastados da coluna "Componentes" para o Canvas
 * 
 * CHECKLIST:
 * 1. ComponentLibraryPanel usa useDraggable com id: `lib:${type}`
 * 2. handleDragEnd detecta String(active.id).startsWith('lib:')
 * 3. DndContext está configurado com sensors
 * 4. DragOverlay renderiza preview
 * 5. Canvas tem droppable zones
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Helpers
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

console.log(bold('\n🔍 DIAGNÓSTICO: Drag-and-Drop\n'));

// Ler arquivos
const editorPath = join(projectRoot, 'src/components/editor/quiz/QuizModularProductionEditor.tsx');
const libraryPath = join(projectRoot, 'src/components/editor/quiz/components/ComponentLibraryPanel.tsx');

let editorContent, libraryContent;

try {
    editorContent = readFileSync(editorPath, 'utf-8');
    libraryContent = readFileSync(libraryPath, 'utf-8');
} catch (error) {
    console.error(red('Erro ao ler arquivos:'), error.message);
    process.exit(1);
}

let issueCount = 0;

console.log(bold('📋 PARTE 1: ComponentLibraryPanel (Draggable Source)\n'));

// 1. useDraggable
if (libraryContent.includes('useDraggable')) {
    console.log(`${green('✓')} useDraggable importado e usado`);
    
    // Verificar id format
    if (libraryContent.includes('lib:${component.type}')) {
        console.log(`${green('✓')} ID format: lib:\${component.type}`);
    } else {
        console.log(`${red('✗')} ID format incorreto (esperado: lib:\${component.type})`);
        issueCount++;
    }
    
    // Verificar atributos
    if (libraryContent.includes('{...attributes}') && libraryContent.includes('{...listeners}')) {
        console.log(`${green('✓')} Atributos e listeners aplicados ao botão`);
    } else {
        console.log(`${red('✗')} Atributos ou listeners faltando`);
        issueCount++;
    }
    
    // Verificar setNodeRef
    if (libraryContent.includes('ref={setNodeRef}')) {
        console.log(`${green('✓')} setNodeRef aplicado ao botão`);
    } else {
        console.log(`${red('✗')} setNodeRef não aplicado`);
        issueCount++;
    }
} else {
    console.log(`${red('✗')} useDraggable NÃO encontrado`);
    issueCount++;
}

console.log(bold('\n📋 PARTE 2: QuizModularProductionEditor (DndContext)\n'));

// 2. DndContext
if (editorContent.includes('import { DndContext')) {
    console.log(`${green('✓')} DndContext importado`);
} else {
    console.log(`${red('✗')} DndContext NÃO importado`);
    issueCount++;
}

// 3. Sensors
if (editorContent.includes('useSensors') && editorContent.includes('PointerSensor')) {
    console.log(`${green('✓')} Sensors configurados (PointerSensor)`);
    
    // Verificar activation constraint
    if (editorContent.includes('activationConstraint')) {
        const match = editorContent.match(/activationConstraint:\s*\{\s*distance:\s*(\d+)/);
        if (match) {
            console.log(`${green('✓')} Activation constraint: ${match[1]}px`);
        }
    }
} else {
    console.log(`${red('✗')} Sensors NÃO configurados`);
    issueCount++;
}

// 4. handleDragEnd
console.log(bold('\n📋 PARTE 3: handleDragEnd (Drop Handler)\n'));

if (editorContent.includes('const handleDragEnd')) {
    console.log(`${green('✓')} handleDragEnd definido`);
    
    // Verificar detecção lib:
    if (editorContent.includes("String(active.id).startsWith('lib:')")) {
        console.log(`${green('✓')} Detecta componentes da biblioteca (lib:)`);
        
        // Extrair lógica
        const match = editorContent.match(/if \(String\(active\.id\)\.startsWith\('lib:'\)\) \{([^}]+\{[^}]+\})+/s);
        if (match) {
            const logic = match[0];
            
            // Verificar steps
            if (logic.includes('const componentType') && logic.includes('.slice(4)')) {
                console.log(`${green('✓')} Extrai componentType com .slice(4)`);
            } else {
                console.log(`${yellow('⚠')} Extração de componentType pode estar incorreta`);
            }
            
            // Verificar criação de bloco
            if (logic.includes('const newBlock =')) {
                console.log(`${green('✓')} Cria novo bloco`);
            } else {
                console.log(`${red('✗')} Não cria novo bloco`);
                issueCount++;
            }
            
            // Verificar inserção
            if (logic.includes('updatedBlocks.splice(insertPosition')) {
                console.log(`${green('✓')} Insere bloco na posição correta`);
            } else {
                console.log(`${yellow('⚠')} Inserção pode estar incorreta`);
            }
            
            // Verificar setSteps
            if (logic.includes('setSteps(updatedSteps)')) {
                console.log(`${green('✓')} Atualiza steps com setSteps`);
            } else {
                console.log(`${red('✗')} Não atualiza steps`);
                issueCount++;
            }
        }
    } else {
        console.log(`${red('✗')} NÃO detecta componentes da biblioteca`);
        issueCount++;
    }
} else {
    console.log(`${red('✗')} handleDragEnd NÃO definido`);
    issueCount++;
}

// 5. DndContext wrapping
console.log(bold('\n📋 PARTE 4: DndContext Wrapping\n'));

if (editorContent.includes('<DndContext')) {
    console.log(`${green('✓')} DndContext renderizado`);
    
    // Verificar props
    if (editorContent.includes('sensors={sensors}')) {
        console.log(`${green('✓')} Props: sensors={sensors}`);
    } else {
        console.log(`${red('✗')} sensors prop faltando`);
        issueCount++;
    }
    
    if (editorContent.includes('onDragStart={handleDragStart}')) {
        console.log(`${green('✓')} Props: onDragStart={handleDragStart}`);
    } else {
        console.log(`${yellow('⚠')} onDragStart pode estar faltando`);
    }
    
    if (editorContent.includes('onDragEnd={handleDragEnd}')) {
        console.log(`${green('✓')} Props: onDragEnd={handleDragEnd}`);
    } else {
        console.log(`${red('✗')} onDragEnd prop faltando`);
        issueCount++;
    }
    
    if (editorContent.includes('collisionDetection={closestCenter}')) {
        console.log(`${green('✓')} Props: collisionDetection={closestCenter}`);
    } else {
        console.log(`${yellow('⚠')} collisionDetection pode estar faltando`);
    }
} else {
    console.log(`${red('✗')} DndContext NÃO renderizado`);
    issueCount++;
}

// 6. DragOverlay
console.log(bold('\n📋 PARTE 5: DragOverlay (Visual Feedback)\n'));

if (editorContent.includes('<DragOverlay>')) {
    console.log(`${green('✓')} DragOverlay renderizado`);
    
    // Verificar conteúdo
    if (editorContent.includes("String(activeId).startsWith('lib:')")) {
        console.log(`${green('✓')} Renderiza preview para lib: components`);
    } else {
        console.log(`${yellow('⚠')} Preview para lib: pode estar faltando`);
    }
} else {
    console.log(`${yellow('⚠')} DragOverlay pode estar faltando (opcional mas recomendado)`);
}

// 7. Canvas droppable zones
console.log(bold('\n📋 PARTE 6: Canvas Droppable Zones\n'));

if (editorContent.includes('useDroppable')) {
    console.log(`${green('✓')} useDroppable usado no canvas`);
} else {
    console.log(`${yellow('⚠')} useDroppable pode não estar sendo usado (handleDragEnd ainda deve funcionar)`);
}

// 8. Verificar se ComponentLibraryPanel está dentro do DndContext
console.log(bold('\n📋 PARTE 7: Hierarquia de Componentes\n'));

// Procurar pela estrutura
const dndContextMatch = editorContent.match(/<DndContext[^>]*>(.*?)<\/DndContext>/s);
if (dndContextMatch) {
    const dndContent = dndContextMatch[1];
    
    if (dndContent.includes('ComponentLibraryPanel') || dndContent.includes('libraryPanel')) {
        console.log(`${green('✓')} ComponentLibraryPanel está dentro do DndContext`);
    } else {
        console.log(`${red('✗')} ComponentLibraryPanel NÃO está dentro do DndContext`);
        console.log(`${red('   → ISSO É CRÍTICO! Draggables devem estar dentro do DndContext')}`);
        issueCount++;
    }
} else {
    console.log(`${yellow('⚠')} Não foi possível verificar hierarquia (arquivo muito grande)`);
}

// RESULTADO
console.log(bold('\n' + '='.repeat(60)));
console.log(bold('RESULTADO DO DIAGNÓSTICO'));
console.log(bold('='.repeat(60)));

if (issueCount === 0) {
    console.log(`\n${green('✅ TODAS AS VERIFICAÇÕES PASSARAM!')}`);
    console.log(`\nO drag-and-drop DEVE estar funcionando.`);
    console.log(`\n${bold('Possíveis causas se ainda não funciona:')}`);
    console.log(`  1. ${yellow('Erro de runtime no navegador')} - Verificar console do DevTools`);
    console.log(`  2. ${yellow('CSS z-index')} - Alguma camada pode estar bloqueando`);
    console.log(`  3. ${yellow('Evento preventDefault()')} - Algum handler pode estar bloqueando`);
    console.log(`  4. ${yellow('Erro de build')} - Limpar cache e rebuildar`);
} else {
    console.log(`\n${red(`✗ ${issueCount} PROBLEMA(S) ENCONTRADO(S)`)}`);
    console.log(`\nRevise os itens marcados com ${red('✗')} acima.`);
}

console.log(bold('\n🎯 PRÓXIMOS PASSOS:\n'));
console.log(`1. ${yellow('Abrir DevTools')} (F12) no navegador`);
console.log(`2. ${yellow('Ir para aba Console')}`);
console.log(`3. ${yellow('Tentar arrastar componente')}`);
console.log(`4. ${yellow('Ver se há erros JavaScript')}`);
console.log(`5. ${yellow('Verificar se handleDragStart é chamado')}`);
console.log(`6. ${yellow('Verificar se handleDragEnd é chamado')}`);
console.log('');

process.exit(issueCount > 0 ? 1 : 0);
