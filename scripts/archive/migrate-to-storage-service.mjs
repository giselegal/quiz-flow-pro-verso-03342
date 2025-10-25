#!/usr/bin/env node
/**
 * Script para migrar localStorage para StorageService
 * 
 * Transforma:
 * localStorage.getItem('key') → StorageService.safeGetString('key')
 * localStorage.setItem('key', value) → StorageService.safeSetString('key', value)
 * JSON.parse(localStorage.getItem()) → StorageService.safeGetJSON()
 * localStorage.setItem(key, JSON.stringify()) → StorageService.safeSetJSON()
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Arquivos a ignorar (já são serviços de storage)
const IGNORE_FILES = [
    'StorageService.ts',
    'LocalStorageService.ts',
    'LocalStorageAdapter.ts',
    'LocalStorageManager.ts',
    'UnifiedStorageService.ts',
    'safeLocalStorage.ts',
    'StorageMigrationService.ts',
    'MigrationManager.ts',
    'dataMigration.ts',
    'FunnelDataMigration.ts',
    'storageOptimization.ts',
    'cleanStorage.ts',
    'localStorageMigration.ts',
];

// Estatísticas
let stats = {
    filesProcessed: 0,
    filesModified: 0,
    migrationsApplied: 0,
    importsAdded: 0,
    errors: 0,
    skipped: 0
};

/**
 * Verifica se deve ignorar o arquivo
 */
function shouldIgnore(filePath) {
    const basename = path.basename(filePath);
    return IGNORE_FILES.some(ignore => basename.includes(ignore));
}

/**
 * Verifica se o arquivo já importa StorageService
 */
function hasStorageServiceImport(content) {
    return /import\s+.*StorageService.*from/.test(content);
}

/**
 * Adiciona import do StorageService no topo do arquivo
 */
function addStorageServiceImport(content) {
    // Encontra a última linha de import
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
        }
    }

    const importStatement = "import { StorageService } from '@/services/core/StorageService';";

    if (lastImportIndex >= 0) {
        // Adiciona após o último import
        lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
        // Adiciona no início se não houver imports
        lines.unshift(importStatement);
    }

    return lines.join('\n');
}

/**
 * Migra padrões de localStorage para StorageService
 */
function migrateLocalStorage(content) {
    let modified = content;
    let count = 0;

    // Padrão 1: JSON.parse(localStorage.getItem('key'))
    // → StorageService.safeGetJSON<Type>('key')
    const jsonGetPattern = /JSON\.parse\(localStorage\.getItem\(['"]([^'"]+)['"]\)\s*\|\|\s*[^)]+\)/g;
    const jsonGetReplacement = "StorageService.safeGetJSON('$1')";
    if (jsonGetPattern.test(modified)) {
        modified = modified.replace(jsonGetPattern, jsonGetReplacement);
        count++;
    }

    // Padrão 2: JSON.parse(localStorage.getItem('key') || '{}')
    const jsonGetPattern2 = /JSON\.parse\(localStorage\.getItem\(['"]([^'"]+)['"]\)\s*\|\|\s*['"][^'"]*['"]\)/g;
    if (jsonGetPattern2.test(modified)) {
        modified = modified.replace(jsonGetPattern2, "StorageService.safeGetJSON('$1')");
        count++;
    }

    // Padrão 3: localStorage.setItem('key', JSON.stringify(value))
    // → StorageService.safeSetJSON('key', value)
    const jsonSetPattern = /localStorage\.setItem\(['"]([^'"]+)['"],\s*JSON\.stringify\(([^)]+)\)\)/g;
    if (jsonSetPattern.test(modified)) {
        modified = modified.replace(jsonSetPattern, "StorageService.safeSetJSON('$1', $2)");
        count++;
    }

    // Padrão 4: localStorage.getItem('key')
    // → StorageService.safeGetString('key')
    const getPattern = /localStorage\.getItem\(['"]([^'"]+)['"]\)/g;
    if (getPattern.test(modified)) {
        modified = modified.replace(getPattern, "StorageService.safeGetString('$1')");
        count++;
    }

    // Padrão 5: localStorage.setItem('key', value)
    // → StorageService.safeSetString('key', value)
    const setPattern = /localStorage\.setItem\(['"]([^'"]+)['"],\s*([^)]+)\)/g;
    if (setPattern.test(modified)) {
        modified = modified.replace(setPattern, "StorageService.safeSetString('$1', $2)");
        count++;
    }

    // Padrão 6: localStorage.removeItem('key')
    // → StorageService.safeRemove('key')
    const removePattern = /localStorage\.removeItem\(['"]([^'"]+)['"]\)/g;
    if (removePattern.test(modified)) {
        modified = modified.replace(removePattern, "StorageService.safeRemove('$1')");
        count++;
    }

    // Padrão 7: localStorage.clear()
    // Manter como está (não tem equivalente seguro)

    return { content: modified, count };
}

/**
 * Processa um arquivo
 */
function processFile(filePath) {
    stats.filesProcessed++;

    try {
        // Ignora arquivos de storage
        if (shouldIgnore(filePath)) {
            stats.skipped++;
            return false;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Verifica se tem localStorage
        if (!content.includes('localStorage.')) {
            return false;
        }

        // Aplica migrações
        const { content: migratedContent, count } = migrateLocalStorage(content);

        if (count === 0) {
            return false;
        }

        content = migratedContent;

        // Adiciona import se necessário
        if (!hasStorageServiceImport(content)) {
            content = addStorageServiceImport(content);
            stats.importsAdded++;
        }

        // Salva arquivo
        fs.writeFileSync(filePath, content, 'utf8');

        stats.filesModified++;
        stats.migrationsApplied += count;

        const relativePath = path.relative(rootDir, filePath);
        console.log(`✅ ${relativePath}`);
        console.log(`   → ${count} migrações aplicadas\n`);

        return true;
    } catch (error) {
        stats.errors++;
        console.error(`❌ Erro ao processar ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Varre recursivamente um diretório
 */
function walkDir(dir, callback) {
    try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);

            try {
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    if (!['node_modules', 'dist', 'build', '.git', '__tests__'].includes(file)) {
                        walkDir(filePath, callback);
                    }
                } else if (stat.isFile()) {
                    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                        callback(filePath);
                    }
                }
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.warn(`⚠️  Ignorando ${filePath}: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.warn(`⚠️  Erro ao ler diretório ${dir}: ${err.message}`);
    }
}

/**
 * Main
 */
console.log('🔧 Migrando localStorage para StorageService\n');
console.log('📁 Diretório fonte:', srcDir);
console.log('─'.repeat(80));

// Processa apenas arquivos críticos primeiro
const criticalDirs = [
    path.join(srcDir, 'contexts'),
    path.join(srcDir, 'hooks'),
    path.join(srcDir, 'services'),
];

for (const dir of criticalDirs) {
    if (fs.existsSync(dir)) {
        console.log(`\n📂 Processando: ${path.relative(rootDir, dir)}\n`);
        walkDir(dir, processFile);
    }
}

console.log('─'.repeat(80));
console.log('\n📊 RESULTADO:\n');
console.log(`  Arquivos processados: ${stats.filesProcessed}`);
console.log(`  Arquivos modificados: ${stats.filesModified}`);
console.log(`  Migrações aplicadas: ${stats.migrationsApplied}`);
console.log(`  Imports adicionados: ${stats.importsAdded}`);
console.log(`  Arquivos ignorados: ${stats.skipped}`);
console.log(`  Erros: ${stats.errors}`);

if (stats.filesModified > 0) {
    console.log('\n✅ Sucesso! Migrações aplicadas.');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Execute: npm run build');
    console.log('  2. Teste a aplicação');
    console.log('  3. Revise as mudanças: git diff');
    process.exit(0);
} else {
    console.log('\n✨ Nenhuma migração necessária nos arquivos processados.');
    process.exit(0);
}
