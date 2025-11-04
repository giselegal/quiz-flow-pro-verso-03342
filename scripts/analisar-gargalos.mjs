#!/usr/bin/env node
/**
 * 🔍 Script de Análise de Gargalos
 * 
 * Analisa o projeto e gera métricas sobre os gargalos identificados.
 * Útil para acompanhar o progresso das correções.
 * 
 * Uso:
 *   node scripts/analisar-gargalos.mjs
 *   node scripts/analisar-gargalos.mjs --json > metrics.json
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const projectRoot = process.cwd();
const srcDir = join(projectRoot, 'src');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Função para contar linhas em um arquivo
function countLines(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
}

// Função para buscar padrão em arquivos
function searchInFiles(pattern, directory) {
  const results = [];
  
  function walk(dir) {
    try {
      const files = readdirSync(dir);
      
      for (const file of files) {
        const filePath = join(dir, file);
        
        try {
          const stat = statSync(filePath);
          
          if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules') {
              walk(filePath);
            }
          } else if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(file))) {
            try {
              const content = readFileSync(filePath, 'utf-8');
              const matches = content.match(pattern);
              if (matches) {
                results.push({
                  file: filePath.replace(projectRoot + '/', ''),
                  count: matches.length,
                });
              }
            } catch {
              // Ignore files we can't read
            }
          }
        } catch {
          // Ignore symlinks, broken files, etc.
        }
      }
    } catch {
      // Ignore directories we can't read
    }
  }
  
  walk(directory);
  return results;
}

// Função para contar arquivos em um diretório
function countFiles(directory, extension = null) {
  let count = 0;
  let totalSize = 0;
  
  function walk(dir) {
    try {
      const files = readdirSync(dir);
      
      for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
          if (!file.startsWith('.') && file !== 'node_modules') {
            walk(filePath);
          }
        } else {
          if (!extension || extname(file) === extension) {
            count++;
            totalSize += stat.size;
          }
        }
      }
    } catch {
      // Ignore directories we can't read
    }
  }
  
  walk(directory);
  return { count, totalSize };
}

// Análise de console logs
function analyzeConsoleLogs() {
  console.log(`${colors.blue}📊 Analisando console logs...${colors.reset}`);
  
  const consolePattern = /console\.(log|warn|error|debug)/g;
  const results = searchInFiles(consolePattern, srcDir);
  
  const totalFiles = results.length;
  const totalOccurrences = results.reduce((sum, r) => sum + r.count, 0);
  
  console.log(`   Arquivos com console.*: ${colors.red}${totalFiles}${colors.reset}`);
  console.log(`   Total de ocorrências: ${colors.red}${totalOccurrences}${colors.reset}`);
  
  if (totalFiles > 0) {
    console.log(`   ${colors.yellow}⚠️  Usar logger centralizado ao invés de console.*${colors.reset}`);
  }
  
  return { totalFiles, totalOccurrences };
}

// Análise de TODOs
function analyzeTodos() {
  console.log(`${colors.blue}📊 Analisando TODOs/FIXMEs...${colors.reset}`);
  
  const todoPattern = /TODO|FIXME|HACK/g;
  const results = searchInFiles(todoPattern, srcDir);
  
  const totalFiles = results.length;
  const totalOccurrences = results.reduce((sum, r) => sum + r.count, 0);
  
  console.log(`   Arquivos com TODOs: ${colors.yellow}${totalFiles}${colors.reset}`);
  console.log(`   Total de ocorrências: ${colors.yellow}${totalOccurrences}${colors.reset}`);
  
  if (totalOccurrences > 200) {
    console.log(`   ${colors.yellow}⚠️  Débito técnico alto${colors.reset}`);
  }
  
  return { totalFiles, totalOccurrences };
}

// Análise de arquivos DEPRECATED
function analyzeDeprecated() {
  console.log(`${colors.blue}📊 Analisando arquivos DEPRECATED...${colors.reset}`);
  
  const deprecatedPattern = /DEPRECATED|@deprecated/g;
  const results = searchInFiles(deprecatedPattern, srcDir);
  
  const totalFiles = results.length;
  
  console.log(`   Arquivos deprecated: ${colors.yellow}${totalFiles}${colors.reset}`);
  
  if (totalFiles > 0) {
    console.log(`   ${colors.yellow}⚠️  Revisar e remover código obsoleto${colors.reset}`);
  }
  
  return { totalFiles };
}

// Análise de services
function analyzeServices() {
  console.log(`${colors.blue}📊 Analisando services...${colors.reset}`);
  
  const servicesDir = join(srcDir, 'services');
  const { count, totalSize } = countFiles(servicesDir);
  
  console.log(`   Total de arquivos: ${colors.cyan}${count}${colors.reset}`);
  console.log(`   Tamanho total: ${colors.cyan}${(totalSize / 1024 / 1024).toFixed(2)} MB${colors.reset}`);
  
  if (count > 50) {
    console.log(`   ${colors.yellow}⚠️  Muitos services, considerar consolidação${colors.reset}`);
  }
  
  return { count, totalSize };
}

// Análise de hooks
function analyzeHooks() {
  console.log(`${colors.blue}📊 Analisando hooks...${colors.reset}`);
  
  const hooksDir = join(srcDir, 'hooks');
  const { count, totalSize } = countFiles(hooksDir);
  
  console.log(`   Total de arquivos: ${colors.cyan}${count}${colors.reset}`);
  console.log(`   Tamanho total: ${colors.cyan}${(totalSize / 1024 / 1024).toFixed(2)} MB${colors.reset}`);
  
  if (count > 100) {
    console.log(`   ${colors.yellow}⚠️  Muitos hooks, considerar consolidação${colors.reset}`);
  }
  
  return { count, totalSize };
}

// Análise de bundle size (se dist existe)
function analyzeBundleSize() {
  console.log(`${colors.blue}📊 Analisando bundle size...${colors.reset}`);
  
  const distDir = join(projectRoot, 'dist', 'assets');
  
  try {
    const files = readdirSync(distDir);
    let totalSize = 0;
    const chunks = [];
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = join(distDir, file);
        const stat = statSync(filePath);
        totalSize += stat.size;
        
        chunks.push({
          name: file,
          size: stat.size,
        });
      }
    }
    
    // Ordenar por tamanho
    chunks.sort((a, b) => b.size - a.size);
    
    console.log(`   Total de chunks: ${colors.cyan}${chunks.length}${colors.reset}`);
    console.log(`   Bundle total: ${colors.cyan}${(totalSize / 1024 / 1024).toFixed(2)} MB${colors.reset}`);
    
    // Top 5 maiores chunks
    console.log(`   ${colors.magenta}Top 5 maiores chunks:${colors.reset}`);
    chunks.slice(0, 5).forEach((chunk, i) => {
      const sizeMB = (chunk.size / 1024 / 1024).toFixed(2);
      const color = chunk.size > 500 * 1024 ? colors.red : colors.green;
      console.log(`   ${i + 1}. ${chunk.name.substring(0, 30)}: ${color}${sizeMB} MB${colors.reset}`);
    });
    
    return { totalSize, chunks: chunks.slice(0, 10) };
  } catch {
    console.log(`   ${colors.yellow}ℹ️  Bundle não encontrado (rode 'npm run build' primeiro)${colors.reset}`);
    return null;
  }
}

// Score geral
function calculateScore(metrics) {
  let score = 100;
  
  // Penalidades
  if (metrics.consoleLogs.totalFiles > 100) score -= 20;
  else if (metrics.consoleLogs.totalFiles > 50) score -= 10;
  
  if (metrics.todos.totalOccurrences > 300) score -= 15;
  else if (metrics.todos.totalOccurrences > 200) score -= 10;
  
  if (metrics.deprecated.totalFiles > 50) score -= 15;
  else if (metrics.deprecated.totalFiles > 20) score -= 10;
  
  if (metrics.services.count > 100) score -= 20;
  else if (metrics.services.count > 50) score -= 10;
  
  if (metrics.hooks.count > 150) score -= 15;
  else if (metrics.hooks.count > 100) score -= 10;
  
  return Math.max(0, score);
}

// Função principal
async function main() {
  const isJson = process.argv.includes('--json');
  
  if (!isJson) {
    console.log(`\n${colors.green}🔍 ANÁLISE DE GARGALOS - QUIZ FLOW PRO${colors.reset}\n`);
    console.log(`${colors.cyan}Diretório: ${projectRoot}${colors.reset}\n`);
  }
  
  const metrics = {
    consoleLogs: analyzeConsoleLogs(),
    todos: analyzeTodos(),
    deprecated: analyzeDeprecated(),
    services: analyzeServices(),
    hooks: analyzeHooks(),
    bundleSize: analyzeBundleSize(),
    timestamp: new Date().toISOString(),
  };
  
  const score = calculateScore(metrics);
  metrics.score = score;
  
  if (isJson) {
    console.log(JSON.stringify(metrics, null, 2));
  } else {
    console.log(`\n${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.green}📊 SCORE GERAL: ${score}/100${colors.reset}`);
    
    if (score >= 80) {
      console.log(`${colors.green}✅ Excelente! Projeto em boa forma.${colors.reset}`);
    } else if (score >= 60) {
      console.log(`${colors.yellow}⚠️  Projeto precisa de melhorias.${colors.reset}`);
    } else {
      console.log(`${colors.red}🔴 Projeto com débito técnico crítico!${colors.reset}`);
    }
    
    console.log(`${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    
    console.log(`${colors.cyan}💡 Dicas:${colors.reset}`);
    console.log(`   1. Execute 'npm run build' para analisar bundle size`);
    console.log(`   2. Veja GARGALOS_IDENTIFICADOS_2025-11-04.md para detalhes`);
    console.log(`   3. Siga GUIA_IMPLEMENTACAO_GARGALOS.md para correções`);
    console.log(`   4. Use '--json' para output JSON`);
    console.log();
  }
}

main().catch(console.error);
