#!/usr/bin/env node
/**
 * FASE 2: Migrar localStorage em componentes e páginas
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

const IGNORE_FILES = [
  'StorageService.ts', 'LocalStorageService.ts', 'LocalStorageAdapter.ts',
  'LocalStorageManager.ts', 'UnifiedStorageService.ts', 'safeLocalStorage.ts',
  'StorageMigrationService.ts', 'MigrationManager.ts', 'dataMigration.ts',
  'FunnelDataMigration.ts', 'storageOptimization.ts', 'cleanStorage.ts',
  'localStorageMigration.ts',
];

let stats = { filesProcessed: 0, filesModified: 0, migrationsApplied: 0, importsAdded: 0, errors: 0, skipped: 0 };

function shouldIgnore(filePath) {
  const basename = path.basename(filePath);
  return IGNORE_FILES.some(ignore => basename.includes(ignore));
}

function hasStorageServiceImport(content) {
  return /import\s+.*StorageService.*from/.test(content);
}

function addStorageServiceImport(content) {
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  const importStatement = "import { StorageService } from '@/services/core/StorageService';";
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
  } else {
    lines.unshift(importStatement);
  }
  
  return lines.join('\n');
}

function migrateLocalStorage(content) {
  let modified = content;
  let count = 0;
  
  const patterns = [
    { regex: /JSON\.parse\(localStorage\.getItem\(['"]([^'"]+)['"]\)\s*\|\|\s*[^)]+\)/g, replacement: "StorageService.safeGetJSON('$1')" },
    { regex: /JSON\.parse\(localStorage\.getItem\(['"]([^'"]+)['"]\)\s*\|\|\s*['"][^'"]*['"]\)/g, replacement: "StorageService.safeGetJSON('$1')" },
    { regex: /localStorage\.setItem\(['"]([^'"]+)['"],\s*JSON\.stringify\(([^)]+)\)\)/g, replacement: "StorageService.safeSetJSON('$1', $2)" },
    { regex: /localStorage\.getItem\(['"]([^'"]+)['"]\)/g, replacement: "StorageService.safeGetString('$1')" },
    { regex: /localStorage\.setItem\(['"]([^'"]+)['"],\s*([^)]+)\)/g, replacement: "StorageService.safeSetString('$1', $2)" },
    { regex: /localStorage\.removeItem\(['"]([^'"]+)['"]\)/g, replacement: "StorageService.safeRemove('$1')" },
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(modified)) {
      modified = modified.replace(pattern.regex, pattern.replacement);
      count++;
    }
  }
  
  return { content: modified, count };
}

function processFile(filePath) {
  stats.filesProcessed++;
  
  try {
    if (shouldIgnore(filePath)) {
      stats.skipped++;
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('localStorage.')) {
      return false;
    }
    
    const { content: migratedContent, count } = migrateLocalStorage(content);
    
    if (count === 0) {
      return false;
    }
    
    content = migratedContent;
    
    if (!hasStorageServiceImport(content)) {
      content = addStorageServiceImport(content);
      stats.importsAdded++;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    stats.filesModified++;
    stats.migrationsApplied += count;
    
    const relativePath = path.relative(rootDir, filePath);
    console.log(`✅ ${relativePath} → ${count} migrações`);
    
    return true;
  } catch (error) {
    stats.errors++;
    console.error(`❌ ${filePath}:`, error.message);
    return false;
  }
}

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
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
          callback(filePath);
        }
      } catch (err) {
        if (err.code !== 'ENOENT') console.warn(`⚠️  ${filePath}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️  ${dir}: ${err.message}`);
  }
}

console.log('🔧 FASE 2: Migrando componentes e páginas\n');
console.log('─'.repeat(80));

const targetDirs = [
  path.join(srcDir, 'components'),
  path.join(srcDir, 'pages'),
  path.join(srcDir, 'utils'),
];

for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    console.log(`\n📂 ${path.relative(rootDir, dir)}\n`);
    walkDir(dir, processFile);
  }
}

console.log('\n' + '─'.repeat(80));
console.log('\n📊 RESULTADO FASE 2:\n');
console.log(`  Arquivos processados: ${stats.filesProcessed}`);
console.log(`  Arquivos modificados: ${stats.filesModified}`);
console.log(`  Migrações aplicadas: ${stats.migrationsApplied}`);
console.log(`  Imports adicionados: ${stats.importsAdded}`);
console.log(`  Ignorados: ${stats.skipped}`);
console.log(`  Erros: ${stats.errors}`);

process.exit(stats.errors > 0 ? 1 : 0);
