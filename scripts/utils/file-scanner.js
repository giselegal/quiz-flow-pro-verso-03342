/**
 * 🔍 FILE SCANNER UTILITY
 * Utilitários para escanear e modificar arquivos do projeto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Escaneia recursivamente um diretório por arquivos
 */
export function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      
      // Verificar se o arquivo/diretório existe (pular links simbólicos quebrados)
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      // Ignorar node_modules, dist, build, etc.
      if (item === 'node_modules' || item === 'dist' || item === 'build' || 
          item === '.git' || item === 'supabase' || item.startsWith('.')) {
        continue;
      }
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Lê conteúdo de arquivo
 */
export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Escreve conteúdo em arquivo
 */
export function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Cria backup de arquivo
 */
export function createBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Encontra imports em arquivo
 */
export function findImports(content, patterns) {
  const matches = [];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex, 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        pattern: pattern.name,
        match: match[0],
        fullMatch: match,
        index: match.index,
        deprecated: pattern.deprecated,
        replacement: pattern.replacement,
      });
    }
  }
  
  return matches;
}

/**
 * Substitui imports em arquivo
 */
export function replaceImports(content, replacements) {
  let newContent = content;
  
  // Ordenar por índice decrescente para não afetar índices anteriores
  replacements.sort((a, b) => b.index - a.index);
  
  for (const replacement of replacements) {
    const before = newContent.substring(0, replacement.index);
    const after = newContent.substring(replacement.index + replacement.match.length);
    newContent = before + replacement.replacement + after;
  }
  
  return newContent;
}

/**
 * Gera relatório de mudanças
 */
export function generateReport(results) {
  const report = {
    totalFiles: results.length,
    modifiedFiles: results.filter(r => r.modified).length,
    totalReplacements: results.reduce((sum, r) => sum + (r.replacements?.length || 0), 0),
    errors: results.filter(r => r.error).length,
    files: results,
  };
  
  return report;
}

/**
 * Imprime relatório formatado
 */
export function printReport(report, title) {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 ${title}`);
  console.log('='.repeat(80));
  console.log(`\n📁 Total de arquivos escaneados: ${report.totalFiles}`);
  console.log(`✏️  Arquivos modificados: ${report.modifiedFiles}`);
  console.log(`🔄 Total de substituições: ${report.totalReplacements}`);
  console.log(`❌ Erros: ${report.errors}`);
  
  if (report.modifiedFiles > 0) {
    console.log('\n📝 Arquivos modificados:');
    report.files
      .filter(f => f.modified)
      .forEach(f => {
        const relativePath = path.relative(PROJECT_ROOT, f.path);
        console.log(`\n  ${relativePath}`);
        f.replacements?.forEach(r => {
          console.log(`    - ${r.pattern}: ${r.deprecated} → ${r.replacement}`);
        });
      });
  }
  
  if (report.errors > 0) {
    console.log('\n❌ Erros:');
    report.files
      .filter(f => f.error)
      .forEach(f => {
        const relativePath = path.relative(PROJECT_ROOT, f.path);
        console.log(`  ${relativePath}: ${f.error}`);
      });
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

export { PROJECT_ROOT };
