#!/usr/bin/env node
/**
 * Build Modular Template - Compila steps individuais em template consolidado
 * 
 * Funcionalidade:
 * 1. Lê todos os steps de public/templates/quiz21Steps/steps/
 * 2. Valida cada step individualmente
 * 3. Consolida em compiled/full.json
 * 4. Atualiza meta.json com buildInfo
 * 5. Gera TypeScript tipado (opcional)
 * 
 * Uso:
 *   npm run build:modular-template
 *   node scripts/build-modular-template.mjs
 *   node scripts/build-modular-template.mjs --watch
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos
const PROJECT_ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps');
const STEPS_DIR = path.join(TEMPLATE_DIR, 'steps');
const COMPILED_DIR = path.join(TEMPLATE_DIR, 'compiled');
const META_FILE = path.join(TEMPLATE_DIR, 'meta.json');
const OUTPUT_FILE = path.join(COMPILED_DIR, 'full.json');

// Flags
const WATCH_MODE = process.argv.includes('--watch');
const FORCE_BUILD = process.argv.includes('--force');
const GENERATE_TS = process.argv.includes('--ts');

// Stats
const stats = {
  totalSteps: 0,
  validSteps: 0,
  invalidSteps: 0,
  buildTime: 0,
  outputSize: 0,
  errors: []
};

/**
 * Valida estrutura de um step com Zod-like validation
 */
function validateStepStructure(stepData, fileName) {
  const errors = [];
  
  // Required fields
  if (!stepData.templateVersion) {
    errors.push(`${fileName}: Missing templateVersion`);
  }
  
  if (!stepData.metadata) {
    errors.push(`${fileName}: Missing metadata`);
  } else {
    if (!stepData.metadata.id) errors.push(`${fileName}: Missing metadata.id`);
    if (!stepData.metadata.name) errors.push(`${fileName}: Missing metadata.name`);
  }
  
  if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
    errors.push(`${fileName}: Missing or invalid blocks array`);
  } else {
    // Validate each block
    stepData.blocks.forEach((block, idx) => {
      if (!block.id) errors.push(`${fileName}: Block ${idx} missing id`);
      if (!block.type) errors.push(`${fileName}: Block ${idx} missing type`);
    });
  }
  
  return errors;
}

/**
 * Remove metadados internos antes de compilar
 */
function cleanStepForCompilation(stepData) {
  const cleaned = { ...stepData };
  delete cleaned._modular; // Remove metadados de split
  return cleaned;
}

/**
 * Lê e processa um step individual
 */
async function loadStep(filePath) {
  const fileName = path.basename(filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stepData = JSON.parse(content);
    
    // Validar estrutura
    const validationErrors = validateStepStructure(stepData, fileName);
    if (validationErrors.length > 0) {
      stats.errors.push(...validationErrors);
      stats.invalidSteps++;
      return null;
    }
    
    stats.validSteps++;
    return cleanStepForCompilation(stepData);
    
  } catch (err) {
    stats.errors.push(`${fileName}: ${err.message}`);
    stats.invalidSteps++;
    return null;
  }
}

/**
 * Compila todos os steps em template consolidado
 */
async function buildCompiledTemplate() {
  const startTime = Date.now();
  
  console.log('🔨 Iniciando build do template modular...\n');
  
  try {
    // 1. Verificar diretórios
    if (!fs.existsSync(STEPS_DIR)) {
      throw new Error(`Diretório de steps não encontrado: ${STEPS_DIR}`);
    }
    
    if (!fs.existsSync(COMPILED_DIR)) {
      fs.mkdirSync(COMPILED_DIR, { recursive: true });
      console.log(`📁 Diretório compiled/ criado\n`);
    }
    
    // 2. Ler meta.json
    if (!fs.existsSync(META_FILE)) {
      throw new Error(`meta.json não encontrado: ${META_FILE}`);
    }
    
    const metaContent = fs.readFileSync(META_FILE, 'utf-8');
    const metaData = JSON.parse(metaContent);
    
    console.log(`📋 Template: ${metaData.name}`);
    console.log(`📦 Versão: ${metaData.version}\n`);
    
    // 3. Buscar todos os steps
    const stepFiles = glob.sync(path.join(STEPS_DIR, 'step-*.json'));
    stepFiles.sort(); // Ordenar step-01, step-02, etc.
    
    stats.totalSteps = stepFiles.length;
    console.log(`📂 Encontrados ${stats.totalSteps} steps\n`);
    
    if (stats.totalSteps === 0) {
      throw new Error('Nenhum arquivo step-*.json encontrado');
    }
    
    // 4. Carregar e validar steps
    console.log('🔍 Validando steps...');
    const stepsData = {};
    
    for (const filePath of stepFiles) {
      const fileName = path.basename(filePath, '.json');
      const stepData = await loadStep(filePath);
      
      if (stepData) {
        // Extrair número do step (step-01 → 1)
        const stepNumber = fileName.match(/step-(\d+)/)?.[1];
        const stepKey = `step-${stepNumber}`;
        
        stepsData[stepKey] = stepData;
        console.log(`  ✅ ${fileName}`);
      } else {
        console.log(`  ❌ ${fileName} (validação falhou)`);
      }
    }
    
    // 5. Verificar se temos steps válidos
    if (stats.validSteps === 0) {
      throw new Error('Nenhum step válido encontrado');
    }
    
    console.log(`\n✅ ${stats.validSteps}/${stats.totalSteps} steps válidos\n`);
    
    // 6. Criar template compilado
    const compiledTemplate = {
      $schema: '/schemas/quiz-template-v4.schema.json',
      templateVersion: metaData.version,
      templateId: metaData.templateId,
      templateIdAlias: metaData.templateIdAlias,
      name: metaData.name,
      description: metaData.description,
      metadata: {
        ...metaData.metadata,
        compiledFrom: 'modular-steps',
        compiledAt: new Date().toISOString(),
        buildScript: 'scripts/build-modular-template.mjs',
        sourceSteps: stats.validSteps,
        structure: 'compiled'
      },
      globalConfig: metaData.globalConfig,
      steps: stepsData
    };
    
    // 7. Salvar arquivo compilado
    const outputContent = JSON.stringify(compiledTemplate, null, 2);
    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf-8');
    
    stats.outputSize = (outputContent.length / 1024).toFixed(2);
    stats.buildTime = Date.now() - startTime;
    
    console.log('💾 Arquivo compilado salvo:');
    console.log(`   ${OUTPUT_FILE}`);
    console.log(`   Tamanho: ${stats.outputSize}KB`);
    console.log(`   Steps: ${Object.keys(stepsData).length}\n`);
    
    // 8. Atualizar meta.json com buildInfo
    metaData.buildInfo.lastBuild = new Date().toISOString();
    metaData.buildInfo.buildStats = {
      totalSteps: stats.totalSteps,
      validSteps: stats.validSteps,
      invalidSteps: stats.invalidSteps,
      buildTime: stats.buildTime,
      outputSize: `${stats.outputSize}KB`
    };
    
    fs.writeFileSync(META_FILE, JSON.stringify(metaData, null, 2), 'utf-8');
    console.log('✅ meta.json atualizado\n');
    
    // 9. Gerar TypeScript (se solicitado)
    if (GENERATE_TS) {
      await generateTypeScriptDefinitions(compiledTemplate, metaData);
    }
    
    // 10. Relatório final
    console.log('═'.repeat(60));
    console.log('📊 BUILD COMPLETO');
    console.log('═'.repeat(60));
    console.log(`Steps processados:   ${stats.totalSteps}`);
    console.log(`Steps válidos:       ${stats.validSteps} ✅`);
    console.log(`Steps inválidos:     ${stats.invalidSteps} ❌`);
    console.log(`Tempo de build:      ${stats.buildTime}ms`);
    console.log(`Tamanho de saída:    ${stats.outputSize}KB`);
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  AVISOS/ERROS:');
      stats.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (stats.errors.length > 10) {
        console.log(`   ... e mais ${stats.errors.length - 10} erros`);
      }
    }
    
    console.log('\n🎉 Build concluído com sucesso!\n');
    
    return {
      success: stats.invalidSteps === 0,
      stats,
      output: OUTPUT_FILE
    };
    
  } catch (err) {
    console.error('\n❌ ERRO NO BUILD:', err.message);
    console.error(err.stack);
    throw err;
  }
}

/**
 * Gera definições TypeScript a partir do template compilado
 */
async function generateTypeScriptDefinitions(template, meta) {
  const tsOutputPath = path.join(COMPILED_DIR, 'quiz21StepsComplete.d.ts');
  
  const tsContent = `/**
 * Type definitions for ${meta.name}
 * Auto-generated from modular template build
 * 
 * @version ${meta.version}
 * @generated ${new Date().toISOString()}
 */

export interface Quiz21StepsTemplate {
  templateId: '${template.templateId}';
  name: '${template.name}';
  version: '${template.templateVersion}';
  steps: {
    ${Object.keys(template.steps).map(stepId => `'${stepId}': StepDefinition;`).join('\n    ')}
  };
}

export interface StepDefinition {
  templateVersion: string;
  metadata: StepMetadata;
  blocks: BlockDefinition[];
  navigation?: NavigationConfig;
}

export interface StepMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface BlockDefinition {
  id: string;
  type: string;
  order?: number;
  content?: any;
  properties?: any;
  style?: any;
}

export interface NavigationConfig {
  nextButton?: string;
  prevButton?: string;
  skipButton?: boolean;
}

export const quiz21StepsTemplate: Quiz21StepsTemplate;
`;
  
  fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
  console.log(`✅ TypeScript definitions geradas: ${path.basename(tsOutputPath)}\n`);
}

/**
 * Watch mode para rebuild automático
 */
async function watchMode() {
  console.log('👀 Watch mode ativado - monitorando mudanças...\n');
  
  let building = false;
  
  fs.watch(STEPS_DIR, { recursive: true }, async (eventType, filename) => {
    if (building) return;
    if (!filename || !filename.endsWith('.json')) return;
    
    console.log(`\n🔄 Detectada mudança em: ${filename}`);
    console.log(`⏰ ${new Date().toLocaleTimeString()}\n`);
    
    building = true;
    try {
      await buildCompiledTemplate();
    } catch (err) {
      console.error('❌ Erro no rebuild:', err.message);
    } finally {
      building = false;
    }
  });
  
  console.log('✅ Monitorando: ' + STEPS_DIR);
  console.log('   Pressione Ctrl+C para sair\n');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  buildCompiledTemplate()
    .then(async (result) => {
      if (WATCH_MODE) {
        await watchMode();
      } else {
        process.exit(result.success ? 0 : 1);
      }
    })
    .catch(err => {
      console.error('❌ Build falhou:', err);
      process.exit(1);
    });
}

export { buildCompiledTemplate };
