/**
 * 🔍 BLOCK REGISTRY VALIDATION SCRIPT
 * 
 * Valida que todos os tipos de bloco referenciados nos templates
 * existem no UnifiedBlockRegistry.
 * 
 * Run: npx tsx scripts/validate-block-registry.ts
 */

import { blockRegistry } from '../src/registry/UnifiedBlockRegistry';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  success: boolean;
  totalBlocks: number;
  missingBlocks: string[];
  warnings: string[];
  templatesCovered: number;
  templatesTotal: number;
}

// Função para extrair tipos de bloco de um template JSON
function extractBlockTypesFromTemplate(templatePath: string): string[] {
  try {
    const content = fs.readFileSync(templatePath, 'utf-8');
    const template = JSON.parse(content);
    
    const blockTypes = new Set<string>();
    
    // Extrair de blocks array
    if (Array.isArray(template.blocks)) {
      template.blocks.forEach((block: any) => {
        if (block.type) {
          blockTypes.add(block.type);
        }
      });
    }
    
    // Extrair de sections (v2 format)
    if (Array.isArray(template.sections)) {
      template.sections.forEach((section: any) => {
        if (Array.isArray(section.components)) {
          section.components.forEach((comp: any) => {
            if (comp.type) {
              blockTypes.add(comp.type);
            }
          });
        }
      });
    }
    
    return Array.from(blockTypes);
  } catch (error) {
    console.error(`Error reading template ${templatePath}:`, error);
    return [];
  }
}

// Função para buscar todos os templates JSON
function findAllTemplates(dir: string): string[] {
  const templates: string[] = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // Recursivamente buscar em subdiretórios
        templates.push(...findAllTemplates(fullPath));
      } else if (item.isFile() && item.name.endsWith('.json')) {
        templates.push(fullPath);
      }
    }
  } catch (error) {
    // Diretório não existe ou não é acessível
  }
  
  return templates;
}

// Função principal de validação
function validateBlockRegistry(): ValidationResult {
  console.log('🔍 Validating Block Registry...\n');
  
  const result: ValidationResult = {
    success: true,
    totalBlocks: 0,
    missingBlocks: [],
    warnings: [],
    templatesCovered: 0,
    templatesTotal: 0,
  };
  
  // Buscar templates em múltiplos diretórios
  const templateDirs = [
    path.join(process.cwd(), 'templates'),
    path.join(process.cwd(), 'src/templates'),
    path.join(process.cwd(), 'templates/funnels'),
  ];
  
  const allBlockTypes = new Set<string>();
  let templateFiles: string[] = [];
  
  templateDirs.forEach(dir => {
    const templates = findAllTemplates(dir);
    templateFiles.push(...templates);
  });
  
  result.templatesTotal = templateFiles.length;
  console.log(`📁 Found ${templateFiles.length} template files\n`);
  
  // Extrair todos os tipos de bloco
  templateFiles.forEach(templatePath => {
    const blockTypes = extractBlockTypesFromTemplate(templatePath);
    
    if (blockTypes.length > 0) {
      result.templatesCovered++;
      blockTypes.forEach(type => allBlockTypes.add(type));
    }
  });
  
  result.totalBlocks = allBlockTypes.size;
  console.log(`🧩 Found ${allBlockTypes.size} unique block types\n`);
  
  // Validar que todos os tipos existem no registry
  console.log('✅ Validating block types...\n');
  
  const missingTypes: string[] = [];
  const validTypes: string[] = [];
  
  allBlockTypes.forEach(type => {
    if (!blockRegistry.has(type)) {
      missingTypes.push(type);
      result.success = false;
    } else {
      validTypes.push(type);
    }
  });
  
  result.missingBlocks = missingTypes;
  
  // Relatório
  if (result.success) {
    console.log('✅ SUCCESS: All block types are registered!\n');
  } else {
    console.log('❌ FAILURE: Missing block types found!\n');
  }
  
  console.log('📊 SUMMARY:');
  console.log(`   Templates scanned: ${result.templatesCovered}/${result.templatesTotal}`);
  console.log(`   Total block types: ${result.totalBlocks}`);
  console.log(`   Valid types: ${validTypes.length}`);
  console.log(`   Missing types: ${missingTypes.length}\n`);
  
  if (missingTypes.length > 0) {
    console.log('❌ MISSING BLOCK TYPES:');
    missingTypes.sort().forEach(type => {
      console.log(`   - ${type}`);
    });
    console.log('');
  }
  
  // Registry stats
  const stats = blockRegistry.getStats();
  console.log('🎯 REGISTRY STATS:');
  console.log(`   Total registered: ${stats.registry.totalTypes}`);
  console.log(`   Critical (pre-loaded): ${stats.registry.criticalTypes}`);
  console.log(`   Lazy (code-split): ${stats.registry.lazyTypes}`);
  console.log(`   Cache hit rate: ${stats.performance.cacheHitRate}%\n`);
  
  return result;
}

// Run validation
const result = validateBlockRegistry();

// Exit with error code if validation failed
process.exit(result.success ? 0 : 1);
