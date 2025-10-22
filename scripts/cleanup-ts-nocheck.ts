#!/usr/bin/env tsx
/**
 * 🧹 TYPESCRIPT CLEANUP TOOL - QUICK WIN #4
 * 
 * Remove @ts-nocheck e @ts-ignore de arquivos onde TypeScript
 * compila sem erros.
 * 
 * Estratégia:
 * 1. Identificar arquivos com @ts-nocheck/@ts-ignore
 * 2. Remover temporariamente a diretiva
 * 3. Verificar se compila
 * 4. Se sim, remover permanentemente
 * 5. Se não, reverter e logar
 * 
 * Usage:
 *   npx tsx scripts/cleanup-ts-nocheck.ts
 *   npx tsx scripts/cleanup-ts-nocheck.ts --dry-run (simula sem alterar)
 *   npx tsx scripts/cleanup-ts-nocheck.ts --aggressive (tenta fixar erros simples)
 * 
 * @version 1.0.0
 * @date 2025-10-22
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface TsCheckFile {
  path: string;
  hasNoCheck: boolean;
  hasIgnore: boolean;
  ignoreCount: number;
  canBeRemoved: boolean;
  errors?: string[];
}

const srcDir = path.join(process.cwd(), 'src');
const findings: TsCheckFile[] = [];

// Patterns para detectar
const TS_NOCHECK = /@ts-nocheck/;
const TS_IGNORE = /@ts-ignore/g;
const TS_EXPECT_ERROR = /@ts-expect-error/g;

// Arquivos a pular (críticos ou em refactoring)
const SKIP_FILES = [
  '__tests__',
  '.test.',
  '.spec.',
  '__archived__',
  'backup',
  'deprecated'
];

function shouldSkip(filePath: string): boolean {
  return SKIP_FILES.some(skip => filePath.includes(skip));
}

// Scan de arquivos
function scanDirectory(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', 'build'].includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      if (!shouldSkip(fullPath)) {
        scanFile(fullPath);
      }
    }
  }
}

function scanFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const hasNoCheck = TS_NOCHECK.test(content);
  const ignores = content.match(TS_IGNORE);
  const hasIgnore = ignores !== null;
  const ignoreCount = ignores?.length || 0;
  
  if (hasNoCheck || hasIgnore) {
    findings.push({
      path: path.relative(process.cwd(), filePath),
      hasNoCheck,
      hasIgnore,
      ignoreCount,
      canBeRemoved: false
    });
  }
}

// Verifica se arquivo compila sem diretivas
function canRemoveDirectives(file: TsCheckFile): boolean {
  const fullPath = path.join(process.cwd(), file.path);
  const originalContent = fs.readFileSync(fullPath, 'utf-8');
  
  // Remove diretivas temporariamente
  let cleanContent = originalContent
    .replace(TS_NOCHECK, '')
    .replace(TS_IGNORE, '')
    .replace(TS_EXPECT_ERROR, '');
  
  fs.writeFileSync(fullPath, cleanContent, 'utf-8');
  
  try {
    // Tenta compilar apenas este arquivo
    execSync(`npx tsc --noEmit ${fullPath}`, {
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    file.canBeRemoved = true;
    return true;
  } catch (error: any) {
    // Captura erros
    const errorOutput = error.stdout || error.stderr || '';
    file.errors = errorOutput.split('\n').slice(0, 5); // Primeiros 5 erros
    file.canBeRemoved = false;
    return false;
  } finally {
    // Restaura conteúdo original
    fs.writeFileSync(fullPath, originalContent, 'utf-8');
  }
}

// Limpa arquivo (remove diretivas permanentemente)
function cleanFile(file: TsCheckFile): void {
  const fullPath = path.join(process.cwd(), file.path);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  if (file.hasNoCheck) {
    content = content.replace(TS_NOCHECK, '');
  }
  
  if (file.hasIgnore) {
    content = content.replace(TS_IGNORE, '');
  }
  
  // Remove linhas vazias extras
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
}

// Relatório
function generateReport(dryRun: boolean): void {
  console.log(`\n📊 Encontrados ${findings.length} arquivos com diretivas TypeScript\n`);
  
  const withNoCheck = findings.filter(f => f.hasNoCheck);
  const withIgnore = findings.filter(f => f.hasIgnore);
  
  console.log(`📌 @ts-nocheck: ${withNoCheck.length} arquivos`);
  console.log(`📌 @ts-ignore: ${withIgnore.length} arquivos (${findings.reduce((sum, f) => sum + f.ignoreCount, 0)} total)\n`);
  
  // Testa quais podem ser removidos (sample de 10)
  console.log('🧪 Testando viabilidade de remoção (sample)...\n');
  
  const sampleFiles = findings.slice(0, 10);
  let removableCount = 0;
  
  sampleFiles.forEach(file => {
    process.stdout.write(`   Testando ${file.path}... `);
    if (canRemoveDirectives(file)) {
      console.log('✅ OK');
      removableCount++;
    } else {
      console.log('❌ Erros');
    }
  });
  
  const estimatedRemovable = Math.round((removableCount / sampleFiles.length) * findings.length);
  
  console.log(`\n📈 Estimativa: ~${estimatedRemovable}/${findings.length} arquivos podem ter diretivas removidas\n`);
  
  // Top files com mais @ts-ignore
  const topIgnores = findings
    .filter(f => f.ignoreCount > 0)
    .sort((a, b) => b.ignoreCount - a.ignoreCount)
    .slice(0, 5);
  
  if (topIgnores.length > 0) {
    console.log('🔥 Top 5 arquivos com mais @ts-ignore:');
    topIgnores.forEach(f => {
      console.log(`   • ${f.path}: ${f.ignoreCount}x`);
    });
  }
  
  if (!dryRun) {
    console.log('\n💡 Para limpar automaticamente os arquivos OK:');
    console.log('   npx tsx scripts/cleanup-ts-nocheck.ts --clean');
  }
}

// Limpeza automática
function autoClean(): void {
  console.log('🧹 Iniciando limpeza automática...\n');
  
  let cleaned = 0;
  let skipped = 0;
  
  findings.forEach((file, index) => {
    process.stdout.write(`\r[${index + 1}/${findings.length}] Processando... `);
    
    if (canRemoveDirectives(file)) {
      cleanFile(file);
      cleaned++;
    } else {
      skipped++;
    }
  });
  
  console.log(`\n\n✅ Limpeza concluída!`);
  console.log(`   • Limpos: ${cleaned} arquivos`);
  console.log(`   • Ignorados: ${skipped} arquivos (têm erros)`);
  console.log(`   • Taxa de sucesso: ${Math.round((cleaned / findings.length) * 100)}%`);
  
  console.log('\n⚠️  IMPORTANTE: Execute os testes:');
  console.log('   npm run build');
  console.log('   npm run test');
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const clean = args.includes('--clean');

console.log('🔍 Escaneando arquivos TypeScript...\n');
scanDirectory(srcDir);

if (clean && !dryRun) {
  autoClean();
} else {
  generateReport(dryRun);
}
