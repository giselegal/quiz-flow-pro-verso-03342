#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Corrigir imports e parâmetros dos componentes Step
 */

const fs = require('fs');
const path = require('path');

// Diretório dos componentes das steps
const STEPS_DIR = path.join(__dirname, '../src/components/steps');

/**
 * Template correto para componente de Step
 */
const STEP_COMPONENT_TEMPLATE = stepNumber => {
  const stepId = stepNumber.toString().padStart(2, '0');

  return `import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP ${stepId} - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-${stepId}.json que inclui o header otimizado.
 */
export const Step${stepId}Template: React.FC = () => {
  return (
    <TemplateRenderer 
      stepNumber={${stepNumber}}
      sessionId="demo"
    />
  );
};

export default Step${stepId}Template;
`;
};

/**
 * Corrige um componente TSX específico
 */
function fixStepComponent(stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  const fileName = `Step${stepId}Template.tsx`;
  const filePath = path.join(STEPS_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Step ${stepId}: Arquivo não encontrado`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Se já tem o import correto e parâmetros corretos, pula
    if (
      content.includes('../templates/TemplateRenderer') &&
      content.includes(`stepNumber={${stepNumber}}`)
    ) {
      console.log(`⏭️  Step ${stepId}: Já corrigido`);
      return true;
    }

    // Gera novo conteúdo
    const newContent = STEP_COMPONENT_TEMPLATE(stepNumber);

    // Escreve novo arquivo
    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`✅ Step ${stepId}: Import e parâmetros corrigidos`);
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
  console.log('🔧 CORRIGINDO IMPORTS E PARÂMETROS DOS COMPONENTES STEP');
  console.log('📁 Diretório:', STEPS_DIR);
  console.log('');

  let totalSteps = 0;
  let fixedSteps = 0;

  // Processa todas as steps de 1 a 21
  for (let step = 1; step <= 21; step++) {
    totalSteps++;

    if (fixStepComponent(step)) {
      fixedSteps++;
    }
  }

  console.log('');
  console.log('📊 RESULTADO DA CORREÇÃO:');
  console.log(`   Total de steps: ${totalSteps}`);
  console.log(`   Steps corrigidas: ${fixedSteps}`);
  console.log(`   Steps com problemas: ${totalSteps - fixedSteps}`);

  if (fixedSteps === totalSteps) {
    console.log('');
    console.log('🎉 SUCESSO! Todas as steps foram corrigidas!');
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { fixStepComponent };
