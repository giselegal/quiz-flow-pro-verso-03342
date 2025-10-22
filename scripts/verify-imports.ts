#!/usr/bin/env tsx
/**
 * 🔍 IMPORT VERIFICATION TOOL - QUICK WIN #3
 * 
 * Verifica quais arquivos ainda usam serviços deprecated
 * e sugere migrações para serviços canônicos.
 * 
 * Usage:
 *   npx tsx scripts/verify-imports.ts
 *   npx tsx scripts/verify-imports.ts --fix (migra automaticamente)
 * 
 * @version 1.0.0
 * @date 2025-10-22
 */

import * as fs from 'fs';
import * as path from 'path';

interface DeprecatedImport {
  file: string;
  line: number;
  deprecated: string;
  canonical: string;
  category: string;
}

// Mapeamento de imports deprecated → canônicos
const DEPRECATED_IMPORTS = {
  // Funnel Services
  'FunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services' },
  'EnhancedFunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services' },
  'FunnelUnifiedService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services' },
  'TemplateFunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services' },
  
  // Template Services
  'TemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services' },
  'JsonTemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services' },
  'TemplateEditorService': { canonical: 'UnifiedTemplateService', category: 'Template Services' },
  'TemplateRuntimeService': { canonical: 'UnifiedTemplateService', category: 'Template Services' },
  'customTemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services' },
  'AIEnhancedHybridTemplateService': { canonical: 'HybridTemplateService', category: 'Template Services' },
  
  // Storage Services
  'FunnelStorageAdapter': { canonical: 'UnifiedStorageService', category: 'Storage Services' },
  'AdvancedFunnelStorage': { canonical: 'UnifiedStorageService', category: 'Storage Services' },
  'funnelLocalStore': { canonical: 'UnifiedStorageService', category: 'Storage Services' },
  'migratedFunnelLocalStore': { canonical: 'UnifiedStorageService', category: 'Storage Services' },
  
  // Quiz Services
  'quizService': { canonical: 'Quiz21CompleteData', category: 'Quiz Services' },
  'quizBuilderService': { canonical: 'Quiz21CompleteData', category: 'Quiz Services' },
  'quizSupabaseService': { canonical: 'quizDataService', category: 'Quiz Services' },
  
  // Analytics
  'compatibleAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services' },
  'simpleAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services' },
  'realTimeAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services' },
  
  // Validation
  'migratedFunnelValidationService': { canonical: 'funnelValidationService', category: 'Validation Services' },
  'pageStructureValidator': { canonical: 'funnelValidationService', category: 'Validation Services' },
  'AlignmentValidator': { canonical: 'funnelValidationService', category: 'Validation Services' },
  
  // Configuration
  'ConfigurationAPI': { canonical: 'ConfigurationService', category: 'Configuration Services' },
  'canvasConfigurationService': { canonical: 'ConfigurationService', category: 'Configuration Services' },
  'pageConfigService': { canonical: 'ConfigurationService', category: 'Configuration Services' },
};

const srcDir = path.join(process.cwd(), 'src');
const findings: DeprecatedImport[] = [];

// Busca recursiva em arquivos
function scanDirectory(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, dist, etc
      if (!['node_modules', 'dist', 'build', '__archived__', 'backup'].includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

// Analisa um arquivo
function scanFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Verifica imports deprecated
    const importMatch = line.match(/import\s+{[^}]*}\s+from\s+['"]([^'"]+)['"]/);
    
    if (importMatch) {
      const importPath = importMatch[1];
      const importedItems = line.match(/{([^}]+)}/)?.[1].split(',').map(s => s.trim()) || [];
      
      importedItems.forEach(item => {
        // Remove 'as' alias se existir
        const cleanItem = item.split(/\s+as\s+/)[0].trim();
        
        if (DEPRECATED_IMPORTS[cleanItem]) {
          const { canonical, category } = DEPRECATED_IMPORTS[cleanItem];
          findings.push({
            file: path.relative(process.cwd(), filePath),
            line: index + 1,
            deprecated: cleanItem,
            canonical,
            category
          });
        }
      });
    }
  });
}

// Gera relatório
function generateReport(): void {
  if (findings.length === 0) {
    console.log('✅ Nenhum import deprecated encontrado!');
    return;
  }
  
  console.log(`\n🔍 Encontrados ${findings.length} imports deprecated\n`);
  
  // Agrupa por categoria
  const byCategory: Record<string, DeprecatedImport[]> = {};
  findings.forEach(finding => {
    if (!byCategory[finding.category]) {
      byCategory[finding.category] = [];
    }
    byCategory[finding.category].push(finding);
  });
  
  // Exibe por categoria
  Object.entries(byCategory).forEach(([category, items]) => {
    console.log(`\n📦 ${category} (${items.length} ocorrências)`);
    console.log('─'.repeat(60));
    
    items.slice(0, 10).forEach(item => {
      console.log(`  📄 ${item.file}:${item.line}`);
      console.log(`     ❌ ${item.deprecated} → ✅ ${item.canonical}`);
    });
    
    if (items.length > 10) {
      console.log(`     ... e mais ${items.length - 10} ocorrências`);
    }
  });
  
  // Estatísticas
  console.log('\n\n📊 Estatísticas');
  console.log('─'.repeat(60));
  console.log(`Total de arquivos afetados: ${new Set(findings.map(f => f.file)).size}`);
  console.log(`Total de imports deprecated: ${findings.length}`);
  console.log('\nTop 5 imports mais usados:');
  
  const counts: Record<string, number> = {};
  findings.forEach(f => {
    counts[f.deprecated] = (counts[f.deprecated] || 0) + 1;
  });
  
  Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([name, count]) => {
      console.log(`  • ${name}: ${count}x`);
    });
  
  console.log('\n💡 Para migrar automaticamente, execute:');
  console.log('   npx tsx scripts/verify-imports.ts --fix');
}

// Auto-fix de imports
function autoFixImports(): void {
  console.log('🔧 Iniciando migração automática...\n');
  
  const fileChanges: Record<string, number> = {};
  
  findings.forEach(finding => {
    const filePath = path.join(process.cwd(), finding.file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace import deprecated → canonical
    const regex = new RegExp(`\\b${finding.deprecated}\\b`, 'g');
    content = content.replace(regex, finding.canonical);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    fileChanges[finding.file] = (fileChanges[finding.file] || 0) + 1;
  });
  
  console.log(`✅ Migrados ${Object.keys(fileChanges).length} arquivos`);
  Object.entries(fileChanges).slice(0, 20).forEach(([file, count]) => {
    console.log(`   • ${file}: ${count} alterações`);
  });
  
  console.log('\n⚠️  IMPORTANTE: Teste a aplicação antes de commitar!');
  console.log('   npm run build && npm run test');
}

// Main
const args = process.argv.slice(2);
const autoFix = args.includes('--fix');

console.log('🔍 Verificando imports deprecated...\n');
scanDirectory(srcDir);

if (autoFix) {
  autoFixImports();
} else {
  generateReport();
}
