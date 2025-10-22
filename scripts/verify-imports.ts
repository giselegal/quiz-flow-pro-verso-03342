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
  line: number; // 1-based
  deprecated: string;
  canonical: string;
  category: string;
  importSource: string;
  importedNames: string[];
  lineIndex: number; // 0-based index in file lines
  aliasPath?: string;
}

type DeprecationMap = {
  canonical: string;
  category: string;
  aliasPath?: string;
};

// Mapeamento de imports deprecated → canônicos
const DEPRECATED_IMPORTS: Record<string, DeprecationMap> = {
  // Funnel Services
  'FunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services', aliasPath: '@/services/ServiceAliases' },
  'EnhancedFunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services', aliasPath: '@/services/ServiceAliases' },
  'FunnelUnifiedService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services', aliasPath: '@/services/ServiceAliases' },
  'TemplateFunnelService': { canonical: 'UnifiedCRUDService', category: 'Funnel Services', aliasPath: '@/services/ServiceAliases' },
  
  // Template Services
  'TemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  'JsonTemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  'TemplateEditorService': { canonical: 'UnifiedTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  'TemplateRuntimeService': { canonical: 'UnifiedTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  'customTemplateService': { canonical: 'UnifiedTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  'AIEnhancedHybridTemplateService': { canonical: 'HybridTemplateService', category: 'Template Services', aliasPath: '@/services/ServiceAliases' },
  
  // Storage Services
  'FunnelStorageAdapter': { canonical: 'UnifiedStorageService', category: 'Storage Services', aliasPath: '@/services/ServiceAliases' },
  'AdvancedFunnelStorage': { canonical: 'UnifiedStorageService', category: 'Storage Services', aliasPath: '@/services/ServiceAliases' },
  'funnelLocalStore': { canonical: 'UnifiedStorageService', category: 'Storage Services', aliasPath: '@/services/ServiceAliases' },
  'migratedFunnelLocalStore': { canonical: 'UnifiedStorageService', category: 'Storage Services', aliasPath: '@/services/ServiceAliases' },
  
  // Quiz Services
  'quizService': { canonical: 'Quiz21CompleteData', category: 'Quiz Services', aliasPath: '@/services/ServiceAliases' },
  'quizBuilderService': { canonical: 'Quiz21CompleteData', category: 'Quiz Services', aliasPath: '@/services/ServiceAliases' },
  'quizSupabaseService': { canonical: 'quizDataService', category: 'Quiz Services', aliasPath: '@/services/ServiceAliases' },
  
  // Analytics
  'compatibleAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services', aliasPath: '@/services/ServiceAliases' },
  'simpleAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services', aliasPath: '@/services/ServiceAliases' },
  'realTimeAnalytics': { canonical: 'AnalyticsService', category: 'Analytics Services', aliasPath: '@/services/ServiceAliases' },
  
  // Validation
  'migratedFunnelValidationService': { canonical: 'funnelValidationService', category: 'Validation Services', aliasPath: '@/services/ServiceAliases' },
  'pageStructureValidator': { canonical: 'funnelValidationService', category: 'Validation Services', aliasPath: '@/services/ServiceAliases' },
  'AlignmentValidator': { canonical: 'funnelValidationService', category: 'Validation Services', aliasPath: '@/services/ServiceAliases' },
  
  // Configuration
  'ConfigurationAPI': { canonical: 'ConfigurationService', category: 'Configuration Services', aliasPath: '@/services/ServiceAliases' },
  'canvasConfigurationService': { canonical: 'ConfigurationService', category: 'Configuration Services', aliasPath: '@/services/ServiceAliases' },
  'pageConfigService': { canonical: 'ConfigurationService', category: 'Configuration Services', aliasPath: '@/services/ServiceAliases' },
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
          const { canonical, category, aliasPath } = DEPRECATED_IMPORTS[cleanItem];
          findings.push({
            file: path.relative(process.cwd(), filePath),
            line: index + 1,
            deprecated: cleanItem,
            canonical,
            category,
            importSource: importPath,
            importedNames: importedItems,
            lineIndex: index,
            aliasPath
          });
        }
      });
    }
  });
}

// Gera relatório
function generateReport(categoriesFilter?: Set<string>): void {
  if (findings.length === 0) {
    console.log('✅ Nenhum import deprecated encontrado!');
    return;
  }
  const filtered = categoriesFilter
    ? findings.filter(f => categoriesFilter.has(f.category))
    : findings;
  
  console.log(`\n🔍 Encontrados ${filtered.length} imports deprecated\n`);
  
  // Agrupa por categoria
  const byCategory: Record<string, DeprecatedImport[]> = {};
  filtered.forEach(finding => {
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
  console.log(`Total de arquivos afetados: ${new Set(filtered.map(f => f.file)).size}`);
  console.log(`Total de imports deprecated: ${filtered.length}`);
  console.log('\nTop 5 imports mais usados:');
  
  const counts: Record<string, number> = {};
  filtered.forEach(f => {
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
  console.log('   # Dica: filtrar por categoria, ex.: --category "Template Services"');
}

// Auto-fix de imports
function autoFixImports(categoriesFilter?: Set<string>): void {
  console.log('🔧 Iniciando migração automática...\n');
  
  const filtered = categoriesFilter
    ? findings.filter(f => categoriesFilter.has(f.category))
    : findings;

  // Agrupar por arquivo e linha para edições precisas
  const grouped: Record<string, Record<number, DeprecatedImport[]>> = {};
  for (const f of filtered) {
    grouped[f.file] ||= {};
    grouped[f.file][f.lineIndex] ||= [];
    grouped[f.file][f.lineIndex].push(f);
  }

  const fileChanges: Record<string, number> = {};

  for (const [relFile, linesMap] of Object.entries(grouped)) {
    const filePath = path.join(process.cwd(), relFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const [idxStr, occurrences] of Object.entries(linesMap)) {
      const idx = Number(idxStr);
      const line = lines[idx];
      if (!line) continue;

      // Obtém import source e lista de itens
      const importSource = occurrences[0].importSource;
      const importedItems = occurrences[0].importedNames.slice();

      // Monta mapa de renomeações desta linha
      const renameMap = new Map<string, string>();
      occurrences.forEach(o => renameMap.set(o.deprecated, o.canonical));

      // Renomeia apenas dentro das chaves
      const beforeBrace = line.substring(0, line.indexOf('{'));
      const insideBrace = line.match(/{([^}]*)}/)?.[1] || '';
      const afterBrace = line.substring(line.indexOf('}') + 1);

      const items = insideBrace.split(',').map(s => s.trim()).filter(Boolean);
      const newItems = items.map(item => {
        const clean = item.split(/\s+as\s+/)[0].trim();
        if (renameMap.has(clean)) {
          return item.replace(clean, renameMap.get(clean)!);
        }
        return item;
      });

      // Decidir se devemos trocar o path para o alias barrel
      let newAfterBrace = afterBrace;
      const allAreDeprecated = importedItems.every(n => DEPRECATED_IMPORTS[n]);
      const aliasPath = occurrences[0].aliasPath || (DEPRECATED_IMPORTS[occurrences[0].deprecated]?.aliasPath);
      if (aliasPath && allAreDeprecated) {
        newAfterBrace = afterBrace.replace(/from\s+['"][^'"]+['"]/,
          `from '${aliasPath}'`);
      }

      lines[idx] = `${beforeBrace}{ ${newItems.join(', ')} }${newAfterBrace}`;

      fileChanges[relFile] = (fileChanges[relFile] || 0) + 1;
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }

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
const categoryArgIndex = args.findIndex(a => a === '--category' || a === '--categories');
let categoriesFilter: Set<string> | undefined = undefined;
if (categoryArgIndex !== -1 && args[categoryArgIndex + 1]) {
  const raw = args[categoryArgIndex + 1];
  categoriesFilter = new Set(
    raw.split(',').map(s => s.trim()).filter(Boolean)
  );
  console.log(`🎯 Filtro de categoria: ${Array.from(categoriesFilter).join(', ')}`);
}

console.log('🔍 Verificando imports deprecated...\n');
scanDirectory(srcDir);

if (autoFix) {
  autoFixImports(categoriesFilter);
} else {
  generateReport(categoriesFilter);
}
