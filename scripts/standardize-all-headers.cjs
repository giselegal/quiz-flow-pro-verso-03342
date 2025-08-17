#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Padronizar Headers de Todas as Steps
 * 
 * Este script garante que todas as steps tenham exatamente a mesma
 * estrutura de header, diferindo apenas nos valores específicos.
 */

const fs = require('fs');
const path = require('path');

// Diretório dos templates
const TEMPLATES_DIR = path.join(__dirname, '../src/config/templates');

/**
 * Estrutura padrão do header (template base)
 */
const STANDARD_HEADER_STRUCTURE = {
  "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  "logoAlt": "Logo Gisele Galvão",
  "logoWidth": 120,
  "logoHeight": 50,
  "showProgress": true,
  "progressValue": 1, // Será atualizado por step
  "progressMax": 21,
  "showBackButton": true, // Será atualizado por step
  "containerWidth": "full",
  "spacing": "small",
  "showLogo": true,
  "progressBarColor": "#B89B7A",
  "progressBarThickness": 6,
  "backgroundColor": "#FFFFFF",
  "textColor": "#432818",
  "paddingTop": 16,
  "paddingBottom": 16,
  "paddingLeft": 24,
  "paddingRight": 24,
  "marginBottom": 24,
  "progressTotal": 100,
  "type": "quiz-intro-header"
};

/**
 * Padroniza o header de uma step específica
 */
function standardizeStepHeader(stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  const filePath = path.join(TEMPLATES_DIR, `step-${stepId}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Step ${stepId}: Arquivo não encontrado`);
      return false;
    }
    
    const stepData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Encontra o bloco de header
    let headerBlockIndex = -1;
    for (let i = 0; i < stepData.blocks.length; i++) {
      const block = stepData.blocks[i];
      if (block.type === 'quiz-intro-header' || 
          block.id.includes('header') || 
          block.id.includes('Header')) {
        headerBlockIndex = i;
        break;
      }
    }
    
    if (headerBlockIndex === -1) {
      console.log(`⚠️  Step ${stepId}: Header não encontrado`);
      return false;
    }
    
    // Cria o header padronizado
    const standardHeader = {
      ...STANDARD_HEADER_STRUCTURE,
      progressValue: stepNumber,
      showBackButton: stepNumber > 1, // Primeira step não tem botão voltar
      showProgress: stepNumber > 1 // Primeira step pode não mostrar progresso
    };
    
    // Valores específicos para Step 01
    if (stepNumber === 1) {
      standardHeader.showProgress = false;
      standardHeader.showBackButton = false;
    }
    
    // Atualiza o bloco do header mantendo id
    const existingHeader = stepData.blocks[headerBlockIndex];
    stepData.blocks[headerBlockIndex] = {
      id: existingHeader.id,
      type: "quiz-intro-header",
      properties: standardHeader
    };
    
    // Atualiza timestamp
    stepData.updatedAt = new Date().toISOString();
    
    // Salva o arquivo
    fs.writeFileSync(filePath, JSON.stringify(stepData, null, 2), 'utf8');
    
    console.log(`✅ Step ${stepId}: Header padronizado`);
    return true;
    
  } catch (error) {
    console.error(`❌ Step ${stepId}: Erro - ${error.message}`);
    return false;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🎯 PADRONIZANDO ESTRUTURA DOS HEADERS DE TODAS AS STEPS');
  console.log('📁 Diretório:', TEMPLATES_DIR);
  console.log('');
  
  let totalSteps = 0;
  let standardizedSteps = 0;
  
  // Processa todas as steps de 1 a 21
  for (let step = 1; step <= 21; step++) {
    totalSteps++;
    
    if (standardizeStepHeader(step)) {
      standardizedSteps++;
    }
  }
  
  console.log('');
  console.log('📊 RESULTADO DA PADRONIZAÇÃO:');
  console.log(`   Total de steps: ${totalSteps}`);
  console.log(`   Steps padronizadas: ${standardizedSteps}`);
  console.log(`   Steps com problemas: ${totalSteps - standardizedSteps}`);
  
  if (standardizedSteps === totalSteps) {
    console.log('');
    console.log('🎉 SUCESSO! Todos os headers foram padronizados!');
    console.log('');
    console.log('📋 ESTRUTURA PADRÃO APLICADA:');
    console.log('   ✅ Mesma estrutura JSON em todas as steps');
    console.log('   ✅ Step 01: showProgress=false, showBackButton=false');
    console.log('   ✅ Steps 02-21: showProgress=true, showBackButton=true');
    console.log('   ✅ progressValue específico para cada step');
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { standardizeStepHeader, STANDARD_HEADER_STRUCTURE };
