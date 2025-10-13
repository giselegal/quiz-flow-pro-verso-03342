import { readFileSync } from 'fs';

const content = readFileSync('src/components/editor/blocks/EnhancedBlockRegistry.tsx', 'utf8');

// Extrair o objeto ENHANCED_BLOCK_REGISTRY
const registryStart = content.indexOf('export const ENHANCED_BLOCK_REGISTRY');
const registryEnd = content.indexOf('};', registryStart) + 2;
const registrySection = content.substring(registryStart, registryEnd);

// Extrair todas as linhas com chaves
const lines = registrySection.split('\n');
const entries = [];
const keyCount = {};

lines.forEach((line, idx) => {
    // Ignorar comentários e linhas vazias
    if (line.trim().startsWith('//') || !line.trim() || line.includes('====')) return;

    // Capturar chaves: 'key': ou key:
    const match = line.match(/^\s*'([^']+)':\s*(.+?),?\s*(?:\/\/.*)?$/) ||
        line.match(/^\s*([a-zA-Z0-9-*]+):\s*(.+?),?\s*(?:\/\/.*)?$/);

    if (match) {
        const key = match[1];
        const value = match[2].trim().replace(/,\s*$/, '');

        entries.push({ key, value, line: idx + 1 });
        keyCount[key] = (keyCount[key] || 0) + 1;
    }
});

console.log('📊 ANÁLISE COMPLETA DE DUPLICAÇÕES NO REGISTRY\n');
console.log('═══════════════════════════════════════════════\n');

console.log(`Total de entradas: ${entries.length}`);
console.log(`Chaves únicas: ${Object.keys(keyCount).length}\n`);

// 1. DUPLICATAS EXATAS (mesmo key aparece 2x)
const duplicateKeys = Object.entries(keyCount).filter(([k, v]) => v > 1);

if (duplicateKeys.length > 0) {
    console.log('🚨 DUPLICATAS EXATAS (ERRO - MESMO KEY 2X):\n');
    duplicateKeys.forEach(([key, count]) => {
        console.log(`  ❌ '${key}' aparece ${count}x`);
        const occurrences = entries.filter(e => e.key === key);
        occurrences.forEach((occ, i) => {
            console.log(`     [${i + 1}] linha ${occ.line}: ${occ.value}`);
        });
        console.log('');
    });
} else {
    console.log('✅ Nenhuma duplicata exata encontrada!\n');
}

// 2. ALIASES INTENCIONAIS (keys diferentes → mesmo componente)
console.log('═══════════════════════════════════════════════\n');
console.log('🔄 ALIASES INTENCIONAIS (OK - Keys diferentes, mesmo componente):\n');

const componentMap = {};
entries.forEach(entry => {
    // Extrair o nome do componente (não lazy imports)
    const componentMatch = entry.value.match(/^([A-Z][a-zA-Z0-9]+)$/);
    if (componentMatch) {
        const component = componentMatch[1];
        if (!componentMap[component]) componentMap[component] = [];
        componentMap[component].push(entry.key);
    }
});

const aliasGroups = Object.entries(componentMap).filter(([c, keys]) => keys.length > 1);

if (aliasGroups.length > 0) {
    aliasGroups.forEach(([component, keys]) => {
        console.log(`  📦 ${component} (${keys.length} aliases):`);
        keys.forEach(k => console.log(`     → '${k}'`));
        console.log('');
    });
} else {
    console.log('  Nenhum alias de componente estático encontrado.\n');
}

// 3. LAZY IMPORTS PARA MESMO ARQUIVO
console.log('═══════════════════════════════════════════════\n');
console.log('📂 LAZY IMPORTS PARA O MESMO ARQUIVO:\n');

const lazyImportMap = {};
entries.forEach(entry => {
    const lazyMatch = entry.value.match(/lazy\(\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/);
    if (lazyMatch) {
        const path = lazyMatch[1];
        if (!lazyImportMap[path]) lazyImportMap[path] = [];
        lazyImportMap[path].push(entry.key);
    }
});

const sharedLazyImports = Object.entries(lazyImportMap).filter(([p, keys]) => keys.length > 1);

if (sharedLazyImports.length > 0) {
    sharedLazyImports.forEach(([path, keys]) => {
        console.log(`  📦 ${path.replace('@/components/editor/blocks/', '')}`);
        console.log(`     (${keys.length} aliases)`);
        keys.forEach(k => console.log(`     → '${k}'`));
        console.log('');
    });
} else {
    console.log('  ✅ Cada lazy import aponta para arquivo único.\n');
}

// 4. RESUMO FINAL
console.log('═══════════════════════════════════════════════\n');
console.log('📋 RESUMO:\n');

console.log(`  Total de registros: ${entries.length}`);
console.log(`  Chaves únicas: ${Object.keys(keyCount).length}`);
console.log(`  Duplicatas exatas: ${duplicateKeys.length} ${duplicateKeys.length === 0 ? '✅' : '❌'}`);
console.log(`  Aliases intencionais: ${aliasGroups.length} grupos`);
console.log(`  Lazy imports compartilhados: ${sharedLazyImports.length} arquivos\n`);

if (duplicateKeys.length > 0) {
    console.log('⚠️  AÇÃO NECESSÁRIA: Remover duplicatas exatas!\n');
    process.exit(1);
} else {
    console.log('✅ REGISTRY ESTÁ CORRETO - Apenas aliases intencionais encontrados!\n');
    process.exit(0);
}
