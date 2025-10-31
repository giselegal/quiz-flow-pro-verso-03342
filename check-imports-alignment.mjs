/**
 * 🔍 VERIFICADOR DE ALINHAMENTO DE IMPORTS
 * 
 * Verifica se todos os imports estão usando os caminhos corretos e consistentes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issues = [];
let totalFiles = 0;
let filesChecked = 0;

// Padrões corretos esperados
const CORRECT_PATTERNS = {
  templateService: "@/services/canonical/TemplateService",
  templateRegistry: "@/services/UnifiedTemplateRegistry",
  templateLoader: "@/services/editor/TemplateLoader",
  embeddedTemplates: "@templates/embedded",
};

// Padrões incorretos/obsoletos
const INCORRECT_PATTERNS = {
  templateService: [
    "@/services/templateService",
    "@/services/core/TemplateService",
    "../services/templateService",
  ],
  embeddedTemplates: [
    "@/templates/quiz21StepsComplete",
    "@/templates/imports",
  ],
};

function scanDirectory(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);
    
    // Skip node_modules, dist, etc
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath, relPath);
    } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
      totalFiles++;
      checkFile(fullPath, relPath);
    }
  }
}

function checkFile(filePath, relPath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  filesChecked++;
  
  // Verificar imports incorretos de templateService
  for (const incorrectPath of INCORRECT_PATTERNS.templateService) {
    const regex = new RegExp(`from ['"]${incorrectPath.replace(/[/]/g, '\\/')}['"]`, 'g');
    if (regex.test(content)) {
      issues.push({
        file: relPath,
        type: 'IMPORT_INCORRETO',
        severity: 'CRITICO',
        found: incorrectPath,
        correct: CORRECT_PATTERNS.templateService,
        line: getLineNumber(content, incorrectPath),
      });
    }
  }
  
  // Verificar imports eager de templates completos (fora de debug/)
  if (!relPath.includes('/debug/') && !relPath.includes('/tools/')) {
    for (const incorrectPath of INCORRECT_PATTERNS.embeddedTemplates) {
      const regex = new RegExp(`from ['"]${incorrectPath.replace(/[/]/g, '\\/')}['"]`, 'g');
      if (regex.test(content)) {
        // Ignorar comentários
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(incorrectPath) && !line.trim().startsWith('//') && !line.includes('/*')) {
            issues.push({
              file: relPath,
              type: 'EAGER_LOADING',
              severity: 'ALTO',
              found: incorrectPath,
              correct: 'Lazy loading via templateService.lazyLoadStep()',
              line: i + 1,
            });
          }
        }
      }
    }
  }
  
  // Verificar uso correto de UnifiedTemplateRegistry
  if (content.includes('UnifiedTemplateRegistry') && !content.includes("from '@/services/UnifiedTemplateRegistry'")) {
    if (!content.includes('export class UnifiedTemplateRegistry')) {
      issues.push({
        file: relPath,
        type: 'IMPORT_FALTANDO',
        severity: 'MEDIO',
        found: 'UnifiedTemplateRegistry usado sem import',
        correct: CORRECT_PATTERNS.templateRegistry,
        line: getLineNumber(content, 'UnifiedTemplateRegistry'),
      });
    }
  }
  
  // Verificar uso de @templates/embedded fora de UnifiedTemplateRegistry
  if (content.includes("@templates/embedded") && !relPath.includes('UnifiedTemplateRegistry.ts')) {
    issues.push({
      file: relPath,
      type: 'EMBEDDED_DIRETO',
      severity: 'MEDIO',
      found: '@templates/embedded',
      correct: 'Usar templateRegistry.getStep() ao invés de importar diretamente',
      line: getLineNumber(content, '@templates/embedded'),
    });
  }
}

function getLineNumber(content, search) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(search)) {
      return i + 1;
    }
  }
  return '?';
}

console.log('🔍 VERIFICANDO ALINHAMENTO DE IMPORTS...\n');
console.log('📁 Diretório:', path.join(__dirname, 'src'));
console.log('');

scanDirectory(path.join(__dirname, 'src'));

console.log(`✅ Arquivos verificados: ${filesChecked}/${totalFiles}`);
console.log('');

if (issues.length === 0) {
  console.log('✅ ✅ ✅ TODOS OS IMPORTS ESTÃO ALINHADOS! ✅ ✅ ✅');
  console.log('');
  console.log('Padrões corretos em uso:');
  for (const [key, value] of Object.entries(CORRECT_PATTERNS)) {
    console.log(`  ✅ ${key}: ${value}`);
  }
  process.exit(0);
} else {
  console.log(`❌ ENCONTRADOS ${issues.length} PROBLEMAS DE ALINHAMENTO:\n`);
  
  // Agrupar por severidade
  const criticos = issues.filter(i => i.severity === 'CRITICO');
  const altos = issues.filter(i => i.severity === 'ALTO');
  const medios = issues.filter(i => i.severity === 'MEDIO');
  
  if (criticos.length > 0) {
    console.log('🔴 CRÍTICOS (precisam correção imediata):');
    criticos.forEach((issue, i) => {
      console.log(`\n${i + 1}. ${issue.file}:${issue.line}`);
      console.log(`   Tipo: ${issue.type}`);
      console.log(`   ❌ Encontrado: ${issue.found}`);
      console.log(`   ✅ Correto: ${issue.correct}`);
    });
    console.log('');
  }
  
  if (altos.length > 0) {
    console.log('🟠 ALTOS (impactam performance):');
    altos.forEach((issue, i) => {
      console.log(`\n${i + 1}. ${issue.file}:${issue.line}`);
      console.log(`   Tipo: ${issue.type}`);
      console.log(`   ❌ Encontrado: ${issue.found}`);
      console.log(`   ✅ Correto: ${issue.correct}`);
    });
    console.log('');
  }
  
  if (medios.length > 0) {
    console.log('🟡 MÉDIOS (melhorias recomendadas):');
    medios.forEach((issue, i) => {
      console.log(`\n${i + 1}. ${issue.file}:${issue.line}`);
      console.log(`   Tipo: ${issue.type}`);
      console.log(`   ❌ Encontrado: ${issue.found}`);
      console.log(`   ✅ Correto: ${issue.correct}`);
    });
    console.log('');
  }
  
  console.log(`\n📊 RESUMO:`);
  console.log(`   🔴 Críticos: ${criticos.length}`);
  console.log(`   🟠 Altos: ${altos.length}`);
  console.log(`   🟡 Médios: ${medios.length}`);
  console.log(`   📁 Total de arquivos: ${filesChecked}`);
  console.log(`   ❌ Arquivos com problemas: ${new Set(issues.map(i => i.file)).size}`);
  
  process.exit(criticos.length > 0 ? 1 : 0);
}
