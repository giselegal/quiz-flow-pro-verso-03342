#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO DE ARQUITETURA - CLI
 * 
 * Script para análise de gargalos e performance da arquitetura
 * 
 * Uso:
 *   node scripts/diagnostico-cli.mjs
 *   npm run diagnostico
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

const results = {
  duplicates: [],
  largeFoles: [],
  circularDeps: [],
  unusedFiles: [],
  bottlenecks: []
};

console.log(`${colors.blue}${colors.bright}`);
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     🔍 DIAGNÓSTICO DE ARQUITETURA - Quiz Flow Pro        ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log(colors.reset);

// ============================================================================
// TESTE 1: DETECTAR ARQUIVOS DUPLICADOS
// ============================================================================
console.log(`\n${colors.bright}📦 1. Detectando arquivos duplicados...${colors.reset}`);

const fileMap = new Map();
const duplicates = [];

function scanDirectory(dir, pattern) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && 
          !file.name.includes('node_modules') && 
          !file.name.includes('dist') &&
          !file.name.includes('legacy')) {
        scanDirectory(fullPath, pattern);
      }
    } else if (file.isFile() && pattern.test(file.name)) {
      const key = file.name;
      if (fileMap.has(key)) {
        fileMap.get(key).push(fullPath);
      } else {
        fileMap.set(key, [fullPath]);
      }
    }
  }
}

scanDirectory(path.join(rootDir, 'src'), /FunnelService|TemplateService|EditorContext/);

for (const [name, paths] of fileMap) {
  if (paths.length > 1) {
    duplicates.push({ name, paths, count: paths.length });
    console.log(`${colors.yellow}⚠️  ${name} encontrado em ${paths.length} locais:${colors.reset}`);
    paths.forEach(p => console.log(`   → ${p.replace(rootDir, '')}`));
  }
}

if (duplicates.length === 0) {
  console.log(`${colors.green}✅ Nenhum arquivo duplicado encontrado${colors.reset}`);
} else {
  results.duplicates = duplicates;
  results.bottlenecks.push({
    type: 'Arquivos Duplicados',
    count: duplicates.length,
    severity: 'high'
  });
}

// ============================================================================
// TESTE 2: DETECTAR ARQUIVOS GRANDES
// ============================================================================
console.log(`\n${colors.bright}📊 2. Analisando tamanho de arquivos...${colors.reset}`);

const largeFiles = [];
const sizeThreshold = 100 * 1024; // 100KB

function scanFileSize(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && 
          !file.name.includes('node_modules') && 
          !file.name.includes('dist')) {
        scanFileSize(fullPath);
      }
    } else if (file.isFile() && /\.(ts|tsx|js|jsx)$/.test(file.name)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > sizeThreshold) {
        largeFiles.push({
          path: fullPath.replace(rootDir, ''),
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2)
        });
      }
    }
  }
}

scanFileSize(path.join(rootDir, 'src'));
largeFiles.sort((a, b) => b.size - a.size);

console.log(`Encontrados ${largeFiles.length} arquivos > 100KB:`);
largeFiles.slice(0, 10).forEach(file => {
  console.log(`${colors.yellow}⚠️  ${file.path} (${file.sizeKB}KB)${colors.reset}`);
});

if (largeFiles.length > 0) {
  results.largeFiles = largeFiles;
  results.bottlenecks.push({
    type: 'Arquivos Grandes',
    count: largeFiles.length,
    severity: 'medium'
  });
}

// ============================================================================
// TESTE 3: DETECTAR IMPORTS PROBLEMÁTICOS
// ============================================================================
console.log(`\n${colors.bright}🔗 3. Analisando imports...${colors.reset}`);

const importIssues = [];

function analyzeImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
    
    const issues = [];
    imports.forEach(imp => {
      // Detectar imports de legacy
      if (imp.includes('/legacy/')) {
        issues.push({ type: 'legacy-import', line: imp });
      }
      // Detectar imports duplicados dentro do mesmo arquivo
      const count = imports.filter(i => i === imp).length;
      if (count > 1) {
        issues.push({ type: 'duplicate-import', line: imp });
      }
      // Detectar imports circulares (simplificado)
      if (imp.includes('..')) {
        issues.push({ type: 'relative-import', line: imp });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function scanImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && 
          !file.name.includes('node_modules') && 
          !file.name.includes('dist')) {
        scanImports(fullPath);
      }
    } else if (file.isFile() && /\.(ts|tsx)$/.test(file.name)) {
      const issues = analyzeImports(fullPath);
      if (issues.length > 0) {
        importIssues.push({
          file: fullPath.replace(rootDir, ''),
          issues
        });
      }
    }
  }
}

scanImports(path.join(rootDir, 'src'));

console.log(`Encontrados ${importIssues.length} arquivos com problemas de import:`);
importIssues.slice(0, 5).forEach(issue => {
  console.log(`${colors.yellow}⚠️  ${issue.file}${colors.reset}`);
  issue.issues.forEach(i => {
    console.log(`   → ${i.type}: ${i.line.substring(0, 60)}...`);
  });
});

if (importIssues.length > 0) {
  results.bottlenecks.push({
    type: 'Problemas de Import',
    count: importIssues.length,
    severity: 'medium'
  });
}

// ============================================================================
// TESTE 4: VERIFICAR ESTRUTURA DE PASTAS
// ============================================================================
console.log(`\n${colors.bright}📁 4. Analisando estrutura de pastas...${colors.reset}`);

const srcStructure = {
  services: [],
  components: [],
  hooks: [],
  contexts: [],
  pages: []
};

function countFilesInDir(dir, type) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        count += countFilesInDir(fullPath, type);
      } else if (file.isFile() && /\.(ts|tsx)$/.test(file.name)) {
        count++;
      }
    }
    
    return count;
  } catch (error) {
    return 0;
  }
}

const directories = ['services', 'components', 'hooks', 'contexts', 'pages'];
for (const dir of directories) {
  const fullPath = path.join(rootDir, 'src', dir);
  if (fs.existsSync(fullPath)) {
    const count = countFilesInDir(fullPath, dir);
    srcStructure[dir] = count;
    console.log(`   /${dir}: ${count} arquivos`);
  }
}

// ============================================================================
// TESTE 5: VERIFICAR CONFIGURAÇÕES
// ============================================================================
console.log(`\n${colors.bright}⚙️  5. Verificando configurações...${colors.reset}`);

const configs = [
  { file: 'vite.config.ts', required: true },
  { file: 'tsconfig.json', required: true },
  { file: 'package.json', required: true },
  { file: '.env', required: false }
];

configs.forEach(config => {
  const exists = fs.existsSync(path.join(rootDir, config.file));
  if (exists) {
    console.log(`${colors.green}✅ ${config.file}${colors.reset}`);
  } else if (config.required) {
    console.log(`${colors.red}❌ ${config.file} (OBRIGATÓRIO)${colors.reset}`);
    results.bottlenecks.push({
      type: 'Configuração Faltando',
      file: config.file,
      severity: 'high'
    });
  } else {
    console.log(`${colors.yellow}⚠️  ${config.file} (opcional)${colors.reset}`);
  }
});

// ============================================================================
// RESUMO FINAL
// ============================================================================
console.log(`\n${colors.blue}${colors.bright}`);
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                    📊 RESUMO FINAL                        ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log(colors.reset);

console.log(`\n${colors.bright}Gargalos Encontrados: ${results.bottlenecks.length}${colors.reset}`);
results.bottlenecks.forEach(b => {
  const icon = b.severity === 'high' ? '🔴' : b.severity === 'medium' ? '🟡' : '🟢';
  console.log(`${icon} ${b.type}: ${b.count || 1}`);
});

console.log(`\n${colors.bright}Estatísticas:${colors.reset}`);
console.log(`   Arquivos duplicados: ${duplicates.length}`);
console.log(`   Arquivos grandes (>100KB): ${largeFiles.length}`);
console.log(`   Problemas de import: ${importIssues.length}`);
console.log(`   Total de components: ${srcStructure.components}`);
console.log(`   Total de services: ${srcStructure.services}`);

// Salvar relatório
const reportPath = path.join(rootDir, 'diagnostico-arquitetura.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    bottlenecks: results.bottlenecks.length,
    duplicates: duplicates.length,
    largeFiles: largeFiles.length,
    importIssues: importIssues.length
  },
  details: results,
  structure: srcStructure
}, null, 2));

console.log(`\n${colors.green}✅ Relatório salvo em: ${reportPath}${colors.reset}`);

// Recomendações
console.log(`\n${colors.magenta}${colors.bright}💡 RECOMENDAÇÕES:${colors.reset}`);

if (duplicates.length > 0) {
  console.log(`${colors.yellow}1. Consolidar arquivos duplicados em um único local${colors.reset}`);
}

if (largeFiles.length > 5) {
  console.log(`${colors.yellow}2. Considerar code splitting para arquivos grandes${colors.reset}`);
}

if (importIssues.length > 10) {
  console.log(`${colors.yellow}3. Refatorar imports para usar paths absolutos${colors.reset}`);
}

console.log(`\n${colors.blue}Para análise web detalhada, acesse:${colors.reset}`);
console.log(`${colors.bright}http://localhost:8080/diagnostico-arquitetura.html${colors.reset}\n`);

process.exit(results.bottlenecks.length > 0 ? 1 : 0);
