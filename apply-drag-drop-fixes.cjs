#!/usr/bin/env node

/**
 * 🔧 Aplicar correções no drag & drop entre blocos
 * 
 * Problemas identificados:
 * 1. Drop zones quase invisíveis (h-3, border-transparent)
 * 2. Cálculo errado de blockIndex (usa array filtrado)
 * 3. Detecção de drop zone filtra por parentId incorretamente
 */

const fs = require('fs');
const path = require('path');

const BLOCK_ROW_PATH = path.join(__dirname, 'src/components/editor/quiz/components/BlockRow.tsx');
const EDITOR_PATH = path.join(__dirname, 'src/components/editor/quiz/QuizModularProductionEditor.tsx');

console.log('🔧 Aplicando correções no drag & drop...\n');

// ===== CORREÇÃO 1: BlockRow.tsx - Tornar drop zones visíveis =====
console.log('📝 Corrigindo BlockRow.tsx...');
let blockRowContent = fs.readFileSync(BLOCK_ROW_PATH, 'utf8');

// Substituir className do drop zone para tornar mais visível
const oldDropZoneClassName = `className={cn(
                'h-3 -my-1.5 relative transition-all duration-200 border-2 rounded',
                isOver
                    ? 'bg-blue-100 border-blue-400 border-dashed'
                    : 'border-transparent hover:bg-blue-50 hover:border-blue-300 hover:border-dashed'
            )}`;

const newDropZoneClassName = `className={cn(
                'h-8 -my-2 relative transition-all duration-200 border-2 rounded-md',
                isOver
                    ? 'bg-blue-100 border-blue-400 border-dashed shadow-lg'
                    : 'bg-gray-50 border-gray-300 border-dashed opacity-40 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400'
            )}`;

if (blockRowContent.includes('h-3 -my-1.5')) {
    blockRowContent = blockRowContent.replace(
        /className=\{cn\(\s*'h-3 -my-1\.5 relative transition-all duration-200 border-2 rounded',[\s\S]*?'\)/,
        newDropZoneClassName
    );
    console.log('  ✅ Drop zone agora mais visível (h-8, sempre com borda)');
} else {
    console.log('  ⚠️  Não encontrou h-3 -my-1.5 (pode já estar corrigido)');
}

// Corrigir cálculo de blockIndex
const oldBlockIndex = `const blockIndex = allBlocks.filter(b => !b.parentId).findIndex(b => b.id === block.id);`;
const newBlockIndex = `const blockIndex = allBlocks.findIndex(b => b.id === block.id);`;

if (blockRowContent.includes('allBlocks.filter(b => !b.parentId).findIndex')) {
    blockRowContent = blockRowContent.replace(oldBlockIndex, newBlockIndex);
    console.log('  ✅ Cálculo de blockIndex corrigido (usa índice real)');
} else {
    console.log('  ⚠️  Não encontrou filter+findIndex (pode já estar corrigido)');
}

fs.writeFileSync(BLOCK_ROW_PATH, blockRowContent);

// ===== CORREÇÃO 2: QuizModularProductionEditor.tsx - Detecção de drop zone =====
console.log('\n📝 Corrigindo QuizModularProductionEditor.tsx...');
let editorContent = fs.readFileSync(EDITOR_PATH, 'utf8');

// Adicionar logs de debug
const oldDropZoneDetection = `if (over.id && String(over.id).startsWith('drop-before-')) {
                const targetBlockId = String(over.id).replace('drop-before-', '');
                const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId && !b.parentId);
                if (targetBlockIndex >= 0) {
                    insertPosition = targetBlockIndex; // Inserir ANTES do bloco
                    console.log(\`🎯 Drop zone detectado: inserindo ANTES do bloco \${targetBlockId} na posição \${insertPosition}\`);
                }
            }`;

const newDropZoneDetection = `if (over.id && String(over.id).startsWith('drop-before-')) {
                const targetBlockId = String(over.id).replace('drop-before-', '');
                console.log('🎯 DROP ZONE detectado:', { targetBlockId, allBlocks: currentStep.blocks.map(b => b.id) });
                
                const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId);
                if (targetBlockIndex >= 0) {
                    insertPosition = targetBlockIndex; // Inserir ANTES do bloco
                    console.log(\`✅ Inserindo ANTES do bloco "\${targetBlockId}" na posição \${insertPosition}\`);
                } else {
                    console.warn('❌ Bloco alvo não encontrado:', targetBlockId);
                }
            } else {
                console.log('🔍 DROP EVENT:', {
                    activeId: active.id,
                    overId: over?.id,
                    isLibraryComponent: String(active.id).startsWith('lib:'),
                    isDropZone: String(over?.id || '').startsWith('drop-before-')
                });
            }`;

if (editorContent.includes('drop-before-') && editorContent.includes('&& !b.parentId')) {
    // Remover filtro parentId e adicionar logs
    editorContent = editorContent.replace(
        /if \(over\.id && String\(over\.id\)\.startsWith\('drop-before-'\)\) \{[\s\S]*?console\.log\([^)]+\);\s*\}\s*\}/,
        newDropZoneDetection
    );
    console.log('  ✅ Detecção de drop zone corrigida (removido filtro parentId)');
    console.log('  ✅ Logs de debug adicionados');
} else {
    console.log('  ⚠️  Padrão não encontrado (pode já estar corrigido)');
}

fs.writeFileSync(EDITOR_PATH, editorContent);

console.log('\n✅ CORREÇÕES APLICADAS!\n');
console.log('📋 Próximos passos:');
console.log('   1. Recarregar o navegador (Ctrl+R)');
console.log('   2. Abrir DevTools (F12) → Console');
console.log('   3. Arrastar um componente da biblioteca para o canvas');
console.log('   4. Verificar logs no console:');
console.log('      - "🎯 DROP ZONE detectado"');
console.log('      - "✅ Inserindo ANTES do bloco..."');
console.log('   5. Confirmar que o bloco foi inserido na posição correta\n');
