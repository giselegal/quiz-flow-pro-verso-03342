#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Atualização em Lote de Headers para todas as Steps
 *
 * Este script atualiza todas as steps (01-21) para usar o cabeçalho consolidado
 * "quiz-intro-header" com as propriedades padrão otimizadas.
 */

const fs = require('fs');
const path = require('path');

// Configuração do cabeçalho consolidado padrão
const CONSOLIDATED_HEADER_BLOCK = {
  id: 'step-header',
  type: 'quiz-intro-header',
  properties: {
    logoUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: 'Logo Gisele Galvão',
    logoWidth: 120,
    logoHeight: 50,
    showProgress: true,
    progressValue: 1, // Será atualizado por step
    progressMax: 21,
    showBackButton: true,
    containerWidth: 'full',
    spacing: 'small',
    showLogo: true,
    progressBarColor: '#B89B7A',
    progressBarThickness: 6,
    backgroundColor: '#FFFFFF',
    textColor: '#432818',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 24,
  },
};

// Diretório dos templates
const TEMPLATES_DIR = path.join(__dirname, '../src/config/templates');

/**
 * Atualiza o header de uma step específica
 */
function updateStepHeader(stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  const filePath = path.join(TEMPLATES_DIR, `step-${stepId}.json`);

  try {
    // Lê o arquivo da step
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Step ${stepId}: Arquivo não encontrado`);
      return false;
    }

    const stepData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Encontra o bloco de header existente
    let headerBlockIndex = -1;
    const headerTypes = ['header', 'quiz-header', 'quiz-intro-header', 'step-header'];

    for (let i = 0; i < stepData.blocks.length; i++) {
      const block = stepData.blocks[i];
      if (
        headerTypes.includes(block.type) ||
        block.id.includes('header') ||
        block.id.includes('Header')
      ) {
        headerBlockIndex = i;
        break;
      }
    }

    // Cria o novo bloco de header consolidado
    const newHeaderBlock = {
      ...CONSOLIDATED_HEADER_BLOCK,
      id: `step${stepId}-header`,
      properties: {
        ...CONSOLIDATED_HEADER_BLOCK.properties,
        progressValue: stepNumber,
        showBackButton: stepNumber > 1, // Só mostra voltar após step 1
      },
    };

    // Substitui ou adiciona o header
    if (headerBlockIndex >= 0) {
      // Preserva qualquer customização específica da step
      const existingBlock = stepData.blocks[headerBlockIndex];
      if (existingBlock.properties) {
        // Mantém customizações específicas se existirem
        newHeaderBlock.properties = {
          ...newHeaderBlock.properties,
          ...existingBlock.properties,
          // Mas força valores essenciais
          progressValue: stepNumber,
          progressMax: 21,
          type: 'quiz-intro-header',
          showBackButton: stepNumber > 1,
        };
      }

      stepData.blocks[headerBlockIndex] = newHeaderBlock;
      console.log(`✅ Step ${stepId}: Header atualizado (posição ${headerBlockIndex})`);
    } else {
      // Adiciona no início se não existe
      stepData.blocks.unshift(newHeaderBlock);
      console.log(`✅ Step ${stepId}: Header adicionado no início`);
    }

    // Atualiza metadados
    stepData.updatedAt = new Date().toISOString();

    // Salva o arquivo atualizado
    fs.writeFileSync(filePath, JSON.stringify(stepData, null, 2), 'utf8');

    return true;
  } catch (error) {
    console.error(`❌ Step ${stepId}: Erro ao processar - ${error.message}`);
    return false;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🚀 INICIANDO ATUALIZAÇÃO EM LOTE DOS HEADERS DAS STEPS');
  console.log('📁 Diretório:', TEMPLATES_DIR);
  console.log('');

  let totalSteps = 0;
  let updatedSteps = 0;

  // Processa todas as steps de 1 a 21
  for (let step = 1; step <= 21; step++) {
    totalSteps++;

    if (updateStepHeader(step)) {
      updatedSteps++;
    }
  }

  console.log('');
  console.log('📊 RESULTADO DA ATUALIZAÇÃO:');
  console.log(`   Total de steps: ${totalSteps}`);
  console.log(`   Steps atualizadas: ${updatedSteps}`);
  console.log(`   Steps com problemas: ${totalSteps - updatedSteps}`);

  if (updatedSteps === totalSteps) {
    console.log('');
    console.log('🎉 SUCESSO! Todas as steps foram atualizadas com o header consolidado!');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('   1. Verificar se o TypeScript compila sem erros');
    console.log('   2. Testar o servidor de desenvolvimento');
    console.log('   3. Verificar se o HeaderPropertyEditor funciona em todas as steps');
  } else {
    console.log('');
    console.log('⚠️  ATENÇÃO: Algumas steps não foram atualizadas corretamente.');
    console.log('   Verifique os logs acima para identificar os problemas.');
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { updateStepHeader, CONSOLIDATED_HEADER_BLOCK };
