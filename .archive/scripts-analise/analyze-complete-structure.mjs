/**
 * 🔍 ANÁLISE COMPLETA DA ESTRUTURA
 * 
 * Analisa TODOS os sistemas críticos:
 * - Canvas System
 * - JSON Processing
 * - Renderer System
 * - Editor System
 * - Template System
 * - Block System
 * - Navigation System
 * - State Management
 * - Data Flow
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const analysis = {
  canvas: { files: [], issues: [], patterns: [] },
  json: { files: [], issues: [], patterns: [] },
  renderer: { files: [], issues: [], patterns: [] },
  editor: { files: [], issues: [], patterns: [] },
  template: { files: [], issues: [], patterns: [] },
  block: { files: [], issues: [], patterns: [] },
  navigation: { files: [], issues: [], patterns: [] },
  state: { files: [], issues: [], patterns: [] },
  dataFlow: { files: [], issues: [], patterns: [] },
};

const SYSTEM_PATTERNS = {
  canvas: /Canvas|canvas/i,
  json: /JSON\.parse|JSON\.stringify|\.json/i,
  renderer: /Renderer|renderer|render/i,
  editor: /Editor|editor/i,
  template: /Template|template/i,
  block: /Block|block/i,
  navigation: /Navigation|navigation|navigate/i,
  state: /State|state|useState|useContext/i,
  dataFlow: /Adapter|Bridge|Converter|adapter|bridge|converter/i,
};

const CRITICAL_CHECKS = {
  eagerLoading: /@\/templates\/quiz21StepsComplete|@\/templates\/imports/,
  incorrectImport: /@\/services\/templateService['"]/,
  circularDep: /import.*from ['"]\.\.\/.*['"].*import.*from ['"]\.\.\/.*['"]/,
  jsonParse: /JSON\.parse\(/,
  noErrorHandling: /JSON\.parse\([^)]+\)(?!\s*catch)/,
  syncOperations: /fs\.readFileSync|localStorage\.getItem/,
  directDOMAccess: /document\.getElementById|document\.querySelector/,
  inlineStyles: /style=\{\{/,
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
      analyzeFile(fullPath, relPath);
    }
  }
}

function analyzeFile(filePath, relPath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return;
  }
  
  // Classificar arquivo em sistemas
  for (const [system, pattern] of Object.entries(SYSTEM_PATTERNS)) {
    if (pattern.test(content) || pattern.test(relPath)) {
      analysis[system].files.push(relPath);
      
      // Verificar padrões críticos
      checkCriticalPatterns(system, relPath, content);
    }
  }
}

function checkCriticalPatterns(system, file, content) {
  const lines = content.split('\n');
  
  // Eager loading
  if (CRITICAL_CHECKS.eagerLoading.test(content)) {
    const match = lines.findIndex(l => CRITICAL_CHECKS.eagerLoading.test(l) && !l.trim().startsWith('//'));
    if (match !== -1) {
      analysis[system].issues.push({
        file,
        line: match + 1,
        type: 'EAGER_LOADING',
        severity: 'HIGH',
        message: 'Bundle completo carregado (usar lazy loading)',
      });
    }
  }
  
  // Import incorreto
  if (CRITICAL_CHECKS.incorrectImport.test(content)) {
    const match = lines.findIndex(l => CRITICAL_CHECKS.incorrectImport.test(l));
    if (match !== -1) {
      analysis[system].issues.push({
        file,
        line: match + 1,
        type: 'INCORRECT_IMPORT',
        severity: 'CRITICAL',
        message: 'Import incorreto (usar @/services/canonical/TemplateService)',
      });
    }
  }
  
  // JSON.parse sem error handling
  const jsonParseMatches = [];
  for (let i = 0; i < lines.length; i++) {
    if (CRITICAL_CHECKS.jsonParse.test(lines[i])) {
      // Verificar se há try-catch nas próximas 10 linhas antes
      let hasTryCatch = false;
      for (let j = Math.max(0, i - 10); j < i; j++) {
        if (/try\s*{/.test(lines[j])) {
          hasTryCatch = true;
          break;
        }
      }
      if (!hasTryCatch) {
        jsonParseMatches.push(i + 1);
      }
    }
  }
  
  if (jsonParseMatches.length > 0) {
    analysis[system].issues.push({
      file,
      line: jsonParseMatches[0],
      type: 'NO_ERROR_HANDLING',
      severity: 'MEDIUM',
      message: `${jsonParseMatches.length} JSON.parse sem try-catch`,
    });
  }
  
  // Padrões bons detectados
  if (content.includes('templateService.lazyLoadStep')) {
    analysis[system].patterns.push({
      file,
      type: 'LAZY_LOADING',
      message: '✅ Usa lazy loading',
    });
  }
  
  if (content.includes('UnifiedTemplateRegistry')) {
    analysis[system].patterns.push({
      file,
      type: 'UNIFIED_REGISTRY',
      message: '✅ Usa UnifiedTemplateRegistry',
    });
  }
  
  if (content.includes('useMemo') || content.includes('useCallback')) {
    analysis[system].patterns.push({
      file,
      type: 'PERFORMANCE',
      message: '✅ Usa memoization',
    });
  }
}

console.log('🔍 ANÁLISE COMPLETA DA ESTRUTURA\n');
console.log('═'.repeat(60));

scanDirectory(path.join(__dirname, 'src'));

// Relatório por sistema
const systems = [
  { key: 'canvas', name: '🎨 CANVAS SYSTEM' },
  { key: 'json', name: '📄 JSON PROCESSING' },
  { key: 'renderer', name: '🖼️  RENDERER SYSTEM' },
  { key: 'editor', name: '✏️  EDITOR SYSTEM' },
  { key: 'template', name: '📋 TEMPLATE SYSTEM' },
  { key: 'block', name: '🧱 BLOCK SYSTEM' },
  { key: 'navigation', name: '🧭 NAVIGATION SYSTEM' },
  { key: 'state', name: '🔄 STATE MANAGEMENT' },
  { key: 'dataFlow', name: '🔀 DATA FLOW' },
];

let totalFiles = 0;
let totalIssues = 0;
let criticalIssues = 0;

for (const { key, name } of systems) {
  const data = analysis[key];
  const uniqueFiles = [...new Set(data.files)];
  const issues = data.issues;
  
  totalFiles += uniqueFiles.length;
  totalIssues += issues.length;
  criticalIssues += issues.filter(i => i.severity === 'CRITICAL').length;
  
  console.log(`\n${name}`);
  console.log('─'.repeat(60));
  console.log(`📁 Arquivos: ${uniqueFiles.length}`);
  
  if (issues.length > 0) {
    console.log(`❌ Issues: ${issues.length}`);
    
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');
    
    if (critical.length > 0) {
      console.log(`   🔴 Críticos: ${critical.length}`);
      critical.slice(0, 3).forEach(i => {
        console.log(`      • ${i.file.split('/').pop()}:${i.line} - ${i.message}`);
      });
    }
    
    if (high.length > 0) {
      console.log(`   🟠 Altos: ${high.length}`);
      high.slice(0, 2).forEach(i => {
        console.log(`      • ${i.file.split('/').pop()}:${i.line} - ${i.message}`);
      });
    }
    
    if (medium.length > 0) {
      console.log(`   🟡 Médios: ${medium.length}`);
    }
  } else {
    console.log(`✅ Issues: 0`);
  }
  
  const goodPatterns = [...new Set(data.patterns.map(p => p.type))];
  if (goodPatterns.length > 0) {
    console.log(`✅ Padrões bons: ${goodPatterns.join(', ')}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('\n📊 RESUMO GERAL\n');
console.log(`📁 Total de arquivos analisados: ${totalFiles}`);
console.log(`❌ Total de issues: ${totalIssues}`);
console.log(`   🔴 Críticos: ${criticalIssues}`);
console.log(`   🟠 Altos: ${totalIssues - criticalIssues}`);

// Score de qualidade
const qualityScore = totalFiles > 0 ? ((totalFiles - totalIssues) / totalFiles * 100).toFixed(1) : 0;
console.log(`\n⭐ Score de Qualidade: ${qualityScore}%`);

if (qualityScore >= 95) {
  console.log('\n✅ ✅ ✅ ESTRUTURA EXCELENTE! ✅ ✅ ✅');
} else if (qualityScore >= 85) {
  console.log('\n✅ Estrutura boa, melhorias recomendadas');
} else if (qualityScore >= 70) {
  console.log('\n⚠️  Estrutura precisa de correções');
} else {
  console.log('\n❌ Estrutura precisa de refatoração significativa');
}

// Top 5 arquivos mais críticos
console.log('\n🎯 TOP 5 ARQUIVOS MAIS CRÍTICOS:\n');
const fileIssueCount = {};
for (const system of Object.values(analysis)) {
  for (const issue of system.issues) {
    fileIssueCount[issue.file] = (fileIssueCount[issue.file] || 0) + 1;
  }
}

const topFiles = Object.entries(fileIssueCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

topFiles.forEach(([file, count], i) => {
  console.log(`${i + 1}. ${file.split('/').pop()} - ${count} issues`);
});

console.log('\n');
process.exit(criticalIssues > 0 ? 1 : 0);
