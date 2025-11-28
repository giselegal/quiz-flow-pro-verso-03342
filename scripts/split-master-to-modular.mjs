#!/usr/bin/env node
/**
 * Script para dividir quiz21-complete.json em steps modulares individuais
 * 
 * Funcionalidade:
 * 1. Lê quiz21-complete.json
 * 2. Extrai cada step como arquivo separado
 * 3. Salva em public/templates/quiz21Steps/steps/
 * 4. Preserva estrutura e metadados
 * 5. Valida cada step individualmente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos
const PROJECT_ROOT = path.join(__dirname, '..');
const SOURCE_FILE = path.join(PROJECT_ROOT, 'public/templates/quiz21-complete.json');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');

// Estatísticas
const stats = {
  totalSteps: 0,
  successfulSplits: 0,
  failedSplits: 0,
  errors: []
};

/**
 * Formata número do step com zero padding
 */
function formatStepNumber(num) {
  return num.toString().padStart(2, '0');
}

/**
 * Valida estrutura de um step
 */
function validateStep(stepData, stepId) {
  const errors = [];
  
  if (!stepData.metadata) {
    errors.push(`${stepId}: Missing metadata`);
  }
  
  if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
    errors.push(`${stepId}: Missing or invalid blocks array`);
  }
  
  if (!stepData.templateVersion) {
    errors.push(`${stepId}: Missing templateVersion`);
  }
  
  return errors;
}

/**
 * Adiciona metadados úteis ao step individual
 */
function enrichStepData(stepData, stepId, sourceMetadata) {
  return {
    ...stepData,
    _modular: {
      extractedFrom: 'quiz21-complete.json',
      extractedAt: new Date().toISOString(),
      sourceVersion: sourceMetadata.version || '3.0.0',
      modularVersion: '4.0.0',
      originalStepId: stepId
    }
  };
}

/**
 * Split do master JSON em steps individuais
 */
async function splitMasterToModularSteps() {
  console.log('🔄 Iniciando split de quiz21-complete.json...\n');
  
  try {
    // 1. Ler arquivo fonte
    console.log(`📖 Lendo: ${SOURCE_FILE}`);
    if (!fs.existsSync(SOURCE_FILE)) {
      throw new Error(`Arquivo não encontrado: ${SOURCE_FILE}`);
    }
    
    const masterContent = fs.readFileSync(SOURCE_FILE, 'utf-8');
    const masterData = JSON.parse(masterContent);
    
    console.log(`✅ Arquivo carregado: ${(masterContent.length / 1024).toFixed(2)}KB`);
    console.log(`📊 Template: ${masterData.name}`);
    console.log(`📋 Versão: ${masterData.metadata?.version || 'N/A'}\n`);
    
    // 2. Verificar estrutura
    if (!masterData.steps || typeof masterData.steps !== 'object') {
      throw new Error('Estrutura inválida: propriedade "steps" não encontrada ou inválida');
    }
    
    // 3. Criar diretório de saída se não existir
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Diretório criado: ${OUTPUT_DIR}\n`);
    }
    
    // 4. Processar cada step
    const stepIds = Object.keys(masterData.steps).sort();
    stats.totalSteps = stepIds.length;
    
    console.log(`🔨 Processando ${stats.totalSteps} steps...\n`);
    
    for (const stepId of stepIds) {
      try {
        const stepData = masterData.steps[stepId];
        
        // Validar step
        const validationErrors = validateStep(stepData, stepId);
        if (validationErrors.length > 0) {
          stats.errors.push(...validationErrors);
          stats.failedSplits++;
          console.log(`❌ ${stepId}: Validação falhou`);
          validationErrors.forEach(err => console.log(`   - ${err}`));
          continue;
        }
        
        // Enriquecer com metadados
        const enrichedStep = enrichStepData(stepData, stepId, masterData.metadata);
        
        // Gerar nome do arquivo
        const stepNumber = parseInt(stepId.match(/\d+/)?.[0] || '0');
        const fileName = `step-${formatStepNumber(stepNumber)}.json`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        
        // Salvar arquivo
        const stepContent = JSON.stringify(enrichedStep, null, 2);
        fs.writeFileSync(filePath, stepContent, 'utf-8');
        
        const sizeKB = (stepContent.length / 1024).toFixed(2);
        const blockCount = stepData.blocks?.length || 0;
        
        stats.successfulSplits++;
        console.log(`✅ ${fileName} → ${sizeKB}KB (${blockCount} blocos)`);
        
      } catch (err) {
        stats.failedSplits++;
        stats.errors.push(`${stepId}: ${err.message}`);
        console.log(`❌ ${stepId}: ${err.message}`);
      }
    }
    
    // 5. Relatório final
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RELATÓRIO FINAL');
    console.log('═'.repeat(60));
    console.log(`Total de steps:     ${stats.totalSteps}`);
    console.log(`Splits bem-sucedidos: ${stats.successfulSplits} ✅`);
    console.log(`Splits falhados:      ${stats.failedSplits} ❌`);
    console.log(`Taxa de sucesso:      ${((stats.successfulSplits / stats.totalSteps) * 100).toFixed(1)}%`);
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  ERROS ENCONTRADOS:');
      stats.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n📁 Arquivos salvos em:');
    console.log(`   ${OUTPUT_DIR}`);
    
    // 6. Atualizar meta.json com buildInfo
    const metaPath = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/meta.json');
    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, 'utf-8');
      const metaData = JSON.parse(metaContent);
      
      metaData.metadata.totalSteps = stats.successfulSplits;
      metaData.metadata.updatedAt = new Date().toISOString();
      metaData.buildInfo.lastSplit = new Date().toISOString();
      metaData.buildInfo.splitStats = stats;
      
      fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2), 'utf-8');
      console.log('\n✅ meta.json atualizado');
    }
    
    console.log('\n🎉 Split concluído com sucesso!\n');
    
    return {
      success: stats.failedSplits === 0,
      stats
    };
    
  } catch (err) {
    console.error('\n❌ ERRO FATAL:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  splitMasterToModularSteps()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('❌ Erro não tratado:', err);
      process.exit(1);
    });
}

export { splitMasterToModularSteps };
