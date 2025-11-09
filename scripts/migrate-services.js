#!/usr/bin/env node

/**
 * 🔄 SERVICE MIGRATION SCRIPT
 * 
 * Migra imports de services deprecados para services canônicos
 * 
 * USO:
 *   npm run migrate:services [--dry-run] [--backup] [--type=<template|funnel|all>]
 *   
 * FLAGS:
 *   --dry-run: Mostra o que seria feito sem modificar arquivos
 *   --backup: Cria backup dos arquivos antes de modificar
 *   --type: Tipo de serviço a migrar (template, funnel, ou all)
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
// TEMPLATE SERVICE MIGRATION PATTERNS
// ============================================================================

const TEMPLATE_SERVICE_PATTERNS = [
  {
    name: 'templateService (old)',
    deprecated: "@/services/templateService",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/templateService['\"]",
  },
  {
    name: 'TemplateRegistry',
    deprecated: "@/services/TemplateRegistry",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/TemplateRegistry['\"]",
  },
  {
    name: 'UnifiedTemplateRegistry',
    deprecated: "@/services/UnifiedTemplateRegistry",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/UnifiedTemplateRegistry['\"]",
  },
  {
    name: 'TemplateEditorService',
    deprecated: "@/services/TemplateEditorService",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/TemplateEditorService['\"]",
  },
  {
    name: 'AIEnhancedHybridTemplateService',
    deprecated: "@/services/AIEnhancedHybridTemplateService",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/AIEnhancedHybridTemplateService['\"]",
  },
  {
    name: 'templateRegistry',
    deprecated: "templateRegistry",
    replacement: "templateService",
    regex: "\\btemplateRegistry\\b(?!\\s*:)",
  },
];

// ============================================================================
// FUNNEL SERVICE MIGRATION PATTERNS
// ============================================================================

const FUNNEL_SERVICE_PATTERNS = [
  {
    name: 'FunnelUnifiedService',
    deprecated: "@/services/FunnelUnifiedService",
    replacement: "@/services/canonical/FunnelService",
    regex: "from\\s+['\"]@/services/FunnelUnifiedService['\"]",
  },
  {
    name: 'funnelUnifiedService',
    deprecated: "funnelUnifiedService",
    replacement: "funnelService",
    regex: "\\bfunnelUnifiedService\\b(?!\\s*:)",
  },
  {
    name: 'EnhancedFunnelService',
    deprecated: "@/services/EnhancedFunnelService",
    replacement: "@/services/canonical/FunnelService",
    regex: "from\\s+['\"]@/services/EnhancedFunnelService['\"]",
  },
  {
    name: 'FunnelConfigPersistenceService',
    deprecated: "@/services/FunnelConfigPersistenceService",
    replacement: "@/services/canonical/FunnelService",
    regex: "from\\s+['\"]@/services/FunnelConfigPersistenceService['\"]",
  },
];

// ============================================================================
// EDITOR SERVICE MIGRATION PATTERNS
// ============================================================================

const EDITOR_SERVICE_PATTERNS = [
  {
    name: 'QuizEditorBridge',
    deprecated: "@/services/QuizEditorBridge",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/QuizEditorBridge['\"]",
  },
  {
    name: 'UnifiedQuizBridge',
    deprecated: "@/services/UnifiedQuizBridge",
    replacement: "@/services/canonical/TemplateService",
    regex: "from\\s+['\"]@/services/UnifiedQuizBridge['\"]",
  },
];

// ============================================================================
// CACHE SERVICE MIGRATION PATTERNS
// ============================================================================

const CACHE_SERVICE_PATTERNS = [
  {
    name: 'TemplatesCacheService',
    deprecated: "@/services/TemplatesCacheService",
    replacement: "@/services/unified/UnifiedCacheService",
    regex: "from\\s+['\"]@/services/TemplatesCacheService['\"]",
  },
  {
    name: 'templatesCacheService',
    deprecated: "templatesCacheService",
    replacement: "unifiedCacheService",
    regex: "\\btemplatesCacheService\\b(?!\\s*:)",
  },
];

// ============================================================================
// MAIN MIGRATION LOGIC
// ============================================================================

function getPatternsByType(type) {
  switch (type) {
    case 'template':
      return TEMPLATE_SERVICE_PATTERNS;
    case 'funnel':
      return FUNNEL_SERVICE_PATTERNS;
    case 'editor':
      return EDITOR_SERVICE_PATTERNS;
    case 'cache':
      return CACHE_SERVICE_PATTERNS;
    case 'all':
    default:
      return [
        ...TEMPLATE_SERVICE_PATTERNS,
        ...FUNNEL_SERVICE_PATTERNS,
        ...EDITOR_SERVICE_PATTERNS,
        ...CACHE_SERVICE_PATTERNS,
      ];
  }
}

function migrateServices(options = {}) {
  const { dryRun = false, backup = false, type = 'all' } = options;
  
  console.log('🚀 Iniciando migração de services...\n');
  console.log(`📦 Tipo: ${type}\n`);
  
  if (dryRun) {
    console.log('⚠️  Modo DRY-RUN ativado (nenhum arquivo será modificado)\n');
  }
  
  if (backup) {
    console.log('💾 Modo BACKUP ativado (arquivos serão copiados antes de modificar)\n');
  }
  
  const patterns = getPatternsByType(type);
  
  // Escanear src/ por arquivos TypeScript/JavaScript
  const srcDir = path.join(PROJECT_ROOT, 'src');
  const files = scanDirectory(srcDir);
  
  console.log(`📂 Escaneando ${files.length} arquivos...\n`);
  
  const results = [];
  
  for (const filePath of files) {
    try {
      const content = readFile(filePath);
      const imports = findImports(content, patterns);
      
      if (imports.length === 0) {
        results.push({ path: filePath, modified: false });
        continue;
      }
      
      // Criar backup se solicitado
      if (backup && !dryRun) {
        createBackup(filePath);
      }
      
      // Substituir imports e usages
      let newContent = content;
      
      for (const imp of imports) {
        // Escapar caracteres especiais do regex
        const escapedMatch = imp.match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedMatch, 'g');
        
        // Determinar replacement baseado no padrão
        let replacement;
        if (imp.match.includes('from')) {
          // É um import statement
          replacement = imp.match.replace(imp.deprecated, imp.replacement);
        } else {
          // É um uso de variável
          replacement = imp.replacement;
        }
        
        newContent = newContent.replace(regex, replacement);
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
  printReport(report, `RELATÓRIO DE MIGRAÇÃO DE SERVICES (${type.toUpperCase()})`);
  
  // Salvar relatório em arquivo
  const reportPath = path.join(PROJECT_ROOT, `migration-services-${type}-report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Relatório salvo em: ${reportPath}\n`);
  
  return report;
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const typeArg = args.find(arg => arg.startsWith('--type='));
const type = typeArg ? typeArg.split('=')[1] : 'all';

const options = {
  dryRun: args.includes('--dry-run'),
  backup: args.includes('--backup'),
  type,
};

migrateServices(options);
