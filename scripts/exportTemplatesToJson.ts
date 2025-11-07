#!/usr/bin/env ts-node
/**
 * 🔄 EXPORT TEMPLATES TO JSON
 * 
 * Script para converter templates TypeScript (.ts) em arquivos JSON estáticos
 * Formato de saída: v3.1 template schema (compatível com builtInTemplates loader)
 * 
 * Uso:
 *   npm run export-templates
 *   npm run export-templates -- --template=quiz21StepsComplete
 *   npm run export-templates -- --all
 * 
 * @author Quiz Quest Team
 * @date 2025-11-07
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de templates para exportar
const TEMPLATES_TO_EXPORT = [
  'quiz21StepsComplete',
  'quiz21StepsSimplified',
  'fashionStyle21PtBR',
  // Adicione novos templates aqui
];

interface ExportOptions {
  template?: string;
  all?: boolean;
  outputDir?: string;
  verbose?: boolean;
}

/**
 * Parse argumentos da linha de comando
 */
function parseArgs(): ExportOptions {
  const args = process.argv.slice(2);
  const options: ExportOptions = {
    all: false,
    verbose: false,
    outputDir: path.resolve(__dirname, '../src/templates'),
  };

  args.forEach(arg => {
    if (arg.startsWith('--template=')) {
      options.template = arg.split('=')[1];
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg.startsWith('--output=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    }
  });

  return options;
}

/**
 * Normaliza template para formato JSON canônico (v3.1)
 */
function normalizeTemplate(exported: any, templateName: string): any {
  // Se já tem estrutura adequada, retornar
  if (exported.metadata && exported.steps) {
    return exported;
  }

  // Criar estrutura v3.1
  const normalized: any = {
    id: templateName,
    name: exported.name || templateName,
    description: exported.description || `Template ${templateName}`,
    version: '3.1.0',
    type: exported.type || 'quiz',
    metadata: {
      id: templateName,
      name: exported.name || templateName,
      description: exported.description || `Template ${templateName}`,
      version: '3.1.0',
      totalSteps: 0,
      type: exported.type || 'quiz',
      tags: exported.tags || [],
      author: exported.author || 'Quiz Quest Team',
      created: new Date().toISOString(),
    },
    steps: {},
  };

  // Processar steps
  let totalSteps = 0;
  for (const [key, value] of Object.entries(exported)) {
    if (key.startsWith('step-') && Array.isArray(value)) {
      normalized.steps[key] = value;
      totalSteps++;
    }
  }

  normalized.metadata.totalSteps = totalSteps;
  normalized.totalSteps = totalSteps;

  return normalized;
}

/**
 * Exporta um template específico
 */
async function exportTemplate(templateName: string, options: ExportOptions): Promise<boolean> {
  const verbose = options.verbose;
  
  try {
    if (verbose) {
      console.log(`\n🔄 Exportando template: ${templateName}`);
    }

    // Importar módulo TypeScript
    const modulePath = path.resolve(__dirname, `../src/templates/${templateName}.ts`);
    
    if (!fs.existsSync(modulePath)) {
      console.error(`❌ Arquivo não encontrado: ${modulePath}`);
      return false;
    }

    if (verbose) {
      console.log(`   📂 Importando de: ${modulePath}`);
    }

    // Importar template (dynamic import para ESM)
    const mod = await import(modulePath);
    
    // Extrair template exportado
    const exported = mod.default ?? mod.QUIZ_STYLE_21_STEPS_TEMPLATE ?? mod.template ?? mod;
    
    if (!exported || typeof exported !== 'object') {
      console.error(`❌ Template inválido ou não encontrado em ${templateName}`);
      return false;
    }

    // Normalizar para formato v3.1
    const normalized = normalizeTemplate(exported, templateName);

    // Serializar para JSON (pretty print)
    const jsonContent = JSON.stringify(normalized, null, 2);

    // Salvar arquivo
    const outPath = path.join(options.outputDir!, `${templateName}.json`);
    
    if (verbose) {
      console.log(`   💾 Salvando em: ${outPath}`);
    }

    fs.writeFileSync(outPath, jsonContent, 'utf-8');

    console.log(`✅ Exportado: ${templateName}.json (${normalized.metadata.totalSteps} steps)`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao exportar ${templateName}:`, error);
    if (verbose && error instanceof Error) {
      console.error(`   Stack: ${error.stack}`);
    }
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🔄 Export Templates to JSON\n');
  
  const options = parseArgs();

  // Garantir que diretório de saída existe
  if (!fs.existsSync(options.outputDir!)) {
    fs.mkdirSync(options.outputDir!, { recursive: true });
    console.log(`📁 Diretório criado: ${options.outputDir}\n`);
  }

  let templatesToProcess: string[] = [];

  // Determinar quais templates processar
  if (options.template) {
    templatesToProcess = [options.template];
  } else if (options.all) {
    templatesToProcess = TEMPLATES_TO_EXPORT;
  } else {
    // Default: exportar templates principais
    templatesToProcess = ['quiz21StepsComplete'];
  }

  console.log(`📋 Templates a exportar: ${templatesToProcess.join(', ')}\n`);

  // Exportar cada template
  let successCount = 0;
  let failCount = 0;

  for (const templateName of templatesToProcess) {
    const success = await exportTemplate(templateName, options);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📊 Total: ${templatesToProcess.length}`);
  console.log('='.repeat(50));

  if (successCount > 0) {
    console.log(`\n💡 Templates JSON disponíveis em: ${options.outputDir}`);
    console.log('   Use ?template=<id> no editor para carregar');
  }

  // Exit code
  process.exit(failCount > 0 ? 1 : 0);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
