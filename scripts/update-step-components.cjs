#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Atualização em Lote de Componentes TSX das Steps
 *
 * Este script atualiza todos os componentes Step*.tsx para garantir que
 * usem o sistema de header consolidado via template engine.
 */

const fs = require('fs');
const path = require('path');

// Diretório dos componentes das steps
const STEPS_DIR = path.join(__dirname, '../src/components/steps');

/**
 * Template básico para componente de Step
 */
const STEP_COMPONENT_TEMPLATE = stepNumber => {
  const stepId = stepNumber.toString().padStart(2, '0');

  return `import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP ${stepId} - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-${stepId}.json que inclui o header otimizado.
 */
export const Step${stepId}Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-${stepNumber}"
      fallbackStep={${stepNumber}}
    />
  );
};

export default Step${stepId}Template;
`;
};

/**
 * Verifica se um arquivo TSX de step precisa ser atualizado
 */
function needsUpdate(filePath, stepNumber) {
  if (!fs.existsSync(filePath)) {
    return true; // Arquivo não existe, precisa criar
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Verifica se já usa TemplateRenderer
  if (content.includes('TemplateRenderer')) {
    return false; // Já está atualizado
  }

  // Verifica se é muito complexo para atualizar automaticamente
  const complexPatterns = [
    /useState/g,
    /useEffect/g,
    /const \[.*\] = /g, // Destructuring de estado
    /function.*{/g, // Funções personalizadas
    /onClick.*{/g, // Handlers complexos
  ];

  const complexityScore = complexPatterns.reduce((score, pattern) => {
    const matches = content.match(pattern);
    return score + (matches ? matches.length : 0);
  }, 0);

  return complexityScore < 5; // Só atualiza se for relativamente simples
}

/**
 * Atualiza um componente TSX específico
 */
function updateStepComponent(stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  const fileName = `Step${stepId}Template.tsx`;
  const filePath = path.join(STEPS_DIR, fileName);

  try {
    if (!needsUpdate(filePath, stepNumber)) {
      console.log(`⏭️  Step ${stepId}: Componente já atualizado ou muito complexo`);
      return 'skipped';
    }

    // Cria backup se arquivo existe
    if (fs.existsSync(filePath)) {
      const backupPath = `${filePath}.backup-${Date.now()}`;
      fs.copyFileSync(filePath, backupPath);
      console.log(`💾 Step ${stepId}: Backup criado em ${path.basename(backupPath)}`);
    }

    // Gera novo conteúdo
    const newContent = STEP_COMPONENT_TEMPLATE(stepNumber);

    // Escreve novo arquivo
    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`✅ Step ${stepId}: Componente atualizado para usar TemplateRenderer`);
    return 'updated';
  } catch (error) {
    console.error(`❌ Step ${stepId}: Erro ao processar - ${error.message}`);
    return 'error';
  }
}

/**
 * Atualiza o index.ts para exportar todos os componentes
 */
function updateIndexFile() {
  const indexPath = path.join(STEPS_DIR, 'index.ts');

  const exports = [];
  for (let step = 1; step <= 21; step++) {
    const stepId = step.toString().padStart(2, '0');
    exports.push(`export { default as Step${stepId}Template } from './Step${stepId}Template';`);
  }

  const indexContent = `/**
 * 📦 STEPS COMPONENTS - Auto-generated exports
 * 
 * Todos os componentes das steps que usam o TemplateRenderer
 * para carregar templates consolidados com headers otimizados.
 * 
 * Gerado automaticamente em: ${new Date().toISOString()}
 */

${exports.join('\n')}

// Tipo para facilitar importação dinâmica
export type StepComponent = React.FC;

// Helper para importação dinâmica
export const getStepComponent = async (stepNumber: number) => {
  const stepId = stepNumber.toString().padStart(2, '0');
  const module = await import(\`./Step\${stepId}Template\`);
  return module.default;
};
`;

  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`✅ index.ts atualizado com exports de todas as steps`);
}

/**
 * Função principal
 */
function main() {
  console.log('🚀 INICIANDO ATUALIZAÇÃO EM LOTE DOS COMPONENTES TSX DAS STEPS');
  console.log('📁 Diretório:', STEPS_DIR);
  console.log('');

  let totalSteps = 0;
  let updatedSteps = 0;
  let skippedSteps = 0;
  let errorSteps = 0;

  // Processa todas as steps de 1 a 21
  for (let step = 1; step <= 21; step++) {
    totalSteps++;

    const result = updateStepComponent(step);
    switch (result) {
      case 'updated':
        updatedSteps++;
        break;
      case 'skipped':
        skippedSteps++;
        break;
      case 'error':
        errorSteps++;
        break;
    }
  }

  // Atualiza o index.ts
  updateIndexFile();

  console.log('');
  console.log('📊 RESULTADO DA ATUALIZAÇÃO:');
  console.log(`   Total de steps: ${totalSteps}`);
  console.log(`   Steps atualizadas: ${updatedSteps}`);
  console.log(`   Steps ignoradas: ${skippedSteps}`);
  console.log(`   Steps com erro: ${errorSteps}`);

  console.log('');
  console.log('📋 PRÓXIMOS PASSOS:');
  console.log('   1. Verificar se TemplateRenderer existe e funciona');
  console.log('   2. Compilar TypeScript para verificar erros');
  console.log('   3. Testar algumas steps no navegador');
  console.log('   4. Verificar se headers aparecem corretamente');
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { updateStepComponent, STEP_COMPONENT_TEMPLATE };
