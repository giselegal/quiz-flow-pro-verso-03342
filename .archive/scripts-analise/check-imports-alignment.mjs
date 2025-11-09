/**
 * 🔍 VERIFICADOR DE ALINHAMENTO DE IMPORTS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issues = [];
let totalFiles = 0;
let filesChecked = 0;

const CORRECT_PATTERNS = {
  templateService: "@/services/canonical/TemplateService",
  templateRegistry: "@/services/UnifiedTemplateRegistry",
  templateLoader: "@/services/editor/TemplateLoader",
  embeddedTemplates: "@templates/embedded",
};

const INCORRECT_PATTERNS = {
  templateService: [
    "@/services/templateService",
    "@/services/core/TemplateService",
  ],
  embeddedTemplates: [
    "@/templates/quiz21StepsComplete",
    "@/templates/imports",
  ],
};

function scanDirectory(dir, relativePath = '') {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);
    
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath, relPath);
    } else if (entry.name.match(/\.(ts|tsx)$/)) {
      totalFiles++;
      checkFile(fullPath, relPath);
    }
  }
}

function checkFile(filePath, relPath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.warn(`⚠️ Não foi possível ler: ${relPath}`);
    return;
  }
  
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
  if (!relPath.includes('/debug/') && !relPath.includes('/tools/') && !relPath.includes('/__tests__/')) {
    for (const incorrectPath of INCORRECT_PATTERNS.embeddedTemplates) {
      const regex = new RegExp(`from ['"]${incorrectPath.replace(/[/]/g, '\\/')}['"]`, 'g');
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
          break;
        }
      }
    }
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

scanDirectory(path.join(__dirname, 'src'));

console.log(`✅ Arquivos verificados: ${filesChecked}/${totalFiles}\n`);

if (issues.length === 0) {
  console.log('✅ ✅ ✅ TODOS OS IMPORTS ESTÃO ALINHADOS! ✅ ✅ ✅\n');
  console.log('Padrões corretos em uso:');
  for (const [key, value] of Object.entries(CORRECT_PATTERNS)) {
    console.log(`  ✅ ${key}: ${value}`);
  }
  process.exit(0);
} else {
  console.log(`❌ ENCONTRADOS ${issues.length} PROBLEMAS:\n`);
  
  const criticos = issues.filter(i => i.severity === 'CRITICO');
  const altos = issues.filter(i => i.severity === 'ALTO');
  
  if (criticos.length > 0) {
    console.log('🔴 CRÍTICOS:\n');
    criticos.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ❌ ${issue.found}`);
      console.log(`   ✅ ${issue.correct}\n`);
    });
  }
  
  if (altos.length > 0) {
    console.log('🟠 ALTOS:\n');
    altos.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ❌ ${issue.found}`);
      console.log(`   ✅ ${issue.correct}\n`);
    });
  }
  
  console.log(`📊 RESUMO:`);
  console.log(`   🔴 Críticos: ${criticos.length}`);
  console.log(`   🟠 Altos: ${altos.length}`);
  console.log(`   📁 Arquivos verificados: ${filesChecked}`);
  console.log(`   ❌ Arquivos com problemas: ${new Set(issues.map(i => i.file)).size}`);
  
  process.exit(criticos.length > 0 ? 1 : 0);
}
