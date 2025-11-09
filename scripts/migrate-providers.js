#!/usr/bin/env node

/**
 * 🔄 PROVIDER MIGRATION SCRIPT
 * 
 * Migra imports de providers deprecados para providers canônicos
 * 
 * USO:
 *   npm run migrate:providers [--dry-run] [--backup]
 *   
 * FLAGS:
 *   --dry-run: Mostra o que seria feito sem modificar arquivos
 *   --backup: Cria backup dos arquivos antes de modificar
 */

import fs from 'fs';
import path from 'path';
import {
  scanDirectory,
  readFile,
  writeFile,
  createBackup,
  findImports,
  replaceImports,
  generateReport,
  printReport,
  PROJECT_ROOT,
} from './utils/file-scanner.js';

// ============================================================================
// PROVIDER MIGRATION PATTERNS
// ============================================================================

const PROVIDER_PATTERNS = [
  // EditorProviderUnified → EditorProviderCanonical
  {
    name: 'EditorProviderUnified',
    deprecated: 'EditorProviderUnified',
    replacement: 'EditorProviderCanonical',
    regex: "import\\s*{([^}]*EditorProviderUnified[^}]*)}\\s*from\\s*['\"]@/components/editor['\"]",
  },
  {
    name: 'EditorProviderUnified (direct)',
    deprecated: 'EditorProviderUnified',
    replacement: 'EditorProviderCanonical',
    regex: "import\\s+EditorProviderUnified\\s+from\\s+['\"]@/components/editor/EditorProviderUnified['\"]",
  },
  
  // useEditorUnified → useEditorCanonical
  {
    name: 'useEditorUnified',
    deprecated: 'useEditorUnified',
    replacement: 'useEditorCanonical',
    regex: "import\\s*{([^}]*useEditorUnified[^}]*)}\\s*from\\s*['\"]@/components/editor['\"]",
  },
  
  // ConsolidatedProvider → UnifiedAppProvider
  {
    name: 'ConsolidatedProvider',
    deprecated: 'ConsolidatedProvider',
    replacement: 'UnifiedAppProvider',
    regex: "import\\s*{([^}]*ConsolidatedProvider[^}]*)}\\s*from\\s*['\"]@/providers['\"]",
  },
  {
    name: 'ConsolidatedProvider (direct)',
    deprecated: 'ConsolidatedProvider',
    replacement: 'UnifiedAppProvider',
    regex: "import\\s+ConsolidatedProvider\\s+from\\s+['\"]@/providers/ConsolidatedProvider['\"]",
  },
  
  // FunnelMasterProvider → UnifiedAppProvider (contexto dependente)
  {
    name: 'FunnelMasterProvider',
    deprecated: 'FunnelMasterProvider',
    replacement: 'UnifiedAppProvider',
    regex: "import\\s*{([^}]*FunnelMasterProvider[^}]*)}\\s*from\\s*['\"]@/providers['\"]",
  },
  
  // EditorProviderAdapter → EditorProviderCanonical
  {
    name: 'EditorProviderAdapter',
    deprecated: 'EditorProviderAdapter',
    replacement: 'EditorProviderCanonical',
    regex: "import\\s+EditorProviderAdapter\\s+from\\s+['\"]@/components/editor/EditorProviderMigrationAdapter['\"]",
  },
];

// ============================================================================
// JSX PATTERN REPLACEMENTS
// ============================================================================

const JSX_PATTERNS = [
  {
    name: 'EditorProviderUnified JSX',
    regex: /<EditorProviderUnified(\s+[^>]*)?>/g,
    replace: (match) => match.replace('EditorProviderUnified', 'EditorProviderCanonical'),
  },
  {
    name: 'EditorProviderUnified closing',
    regex: /<\/EditorProviderUnified>/g,
    replace: () => '</EditorProviderCanonical>',
  },
  {
    name: 'ConsolidatedProvider JSX',
    regex: /<ConsolidatedProvider(\s+[^>]*)?>/g,
    replace: (match) => match.replace('ConsolidatedProvider', 'UnifiedAppProvider'),
  },
  {
    name: 'ConsolidatedProvider closing',
    regex: /<\/ConsolidatedProvider>/g,
    replace: () => '</UnifiedAppProvider>',
  },
  {
    name: 'useEditorUnified calls',
    regex: /useEditorUnified\(/g,
    replace: () => 'useEditorCanonical(',
  },
];

// ============================================================================
// MAIN MIGRATION LOGIC
// ============================================================================

function migrateProviders(options = {}) {
  const { dryRun = false, backup = false } = options;
  
  console.log('🚀 Iniciando migração de providers...\n');
  
  if (dryRun) {
    console.log('⚠️  Modo DRY-RUN ativado (nenhum arquivo será modificado)\n');
  }
  
  if (backup) {
    console.log('💾 Modo BACKUP ativado (arquivos serão copiados antes de modificar)\n');
  }
  
  // Escanear src/ por arquivos TypeScript/JavaScript
  const srcDir = path.join(PROJECT_ROOT, 'src');
  const files = scanDirectory(srcDir);
  
  console.log(`📂 Escaneando ${files.length} arquivos...\n`);
  
  const results = [];
  
  for (const filePath of files) {
    try {
      const content = readFile(filePath);
      const imports = findImports(content, PROVIDER_PATTERNS);
      
      if (imports.length === 0) {
        results.push({ path: filePath, modified: false });
        continue;
      }
      
      // Criar backup se solicitado
      if (backup && !dryRun) {
        createBackup(filePath);
      }
      
      // Substituir imports
      let newContent = content;
      
      // Substituir imports
      for (const imp of imports) {
        const regex = new RegExp(imp.match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const replacement = imp.match.replace(imp.deprecated, imp.replacement);
        newContent = newContent.replace(regex, replacement);
      }
      
      // Substituir JSX patterns
      for (const pattern of JSX_PATTERNS) {
        newContent = newContent.replace(pattern.regex, pattern.replace);
      }
      
      // Escrever arquivo modificado (se não for dry-run)
      if (!dryRun && newContent !== content) {
        writeFile(filePath, newContent);
      }
      
      results.push({
        path: filePath,
        modified: newContent !== content,
        replacements: imports.map(imp => ({
          pattern: imp.pattern,
          deprecated: imp.deprecated,
          replacement: imp.replacement,
        })),
      });
      
    } catch (error) {
      results.push({
        path: filePath,
        modified: false,
        error: error.message,
      });
    }
  }
  
  // Gerar e imprimir relatório
  const report = generateReport(results);
  printReport(report, 'RELATÓRIO DE MIGRAÇÃO DE PROVIDERS');
  
  // Salvar relatório em arquivo
  const reportPath = path.join(PROJECT_ROOT, 'migration-providers-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Relatório salvo em: ${reportPath}\n`);
  
  return report;
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  backup: args.includes('--backup'),
};

migrateProviders(options);
