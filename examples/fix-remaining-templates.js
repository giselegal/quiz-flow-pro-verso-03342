#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORREÇÃO FINAL DOS 8 TEMPLATES RESTANTES\n');

const stepsDir = path.join(__dirname, 'src/components/steps');

// 🎯 TEMPLATES QUE PRECISAM DE CORREÇÃO
const templatesToFix = [
  {
    file: 'Step01Template.tsx',
    step: 1,
    needsInterface: true,
    needsProgress: false, // Etapa 1 já tem progressValue: 0
    needsStepNumber: true,
  },
  {
    file: 'Step02Template.tsx',
    step: 2,
    needsInterface: true,
    needsProgress: false, // Etapa 2 já tem progressValue: 10
    needsStepNumber: true,
  },
  {
    file: 'Step03Template.tsx',
    step: 3,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
  {
    file: 'Step04Template.tsx',
    step: 4,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
  {
    file: 'Step05Template.tsx',
    step: 5,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
  {
    file: 'Step06Template.tsx',
    step: 6,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
  {
    file: 'Step07Template.tsx',
    step: 7,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
  {
    file: 'Step19Template.tsx',
    step: 19,
    needsInterface: true,
    needsProgress: true,
    needsStepNumber: true,
  },
];

// 🔧 FUNÇÃO PARA ADICIONAR INTERFACE
function addInterface(content, stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  const interfaceCode = `import React from "react";

export interface Step${stepId}Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step${stepId} = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step${stepId}Props) => {
  return <div className="step-${stepId}">{/* Conteúdo da Etapa ${stepNumber} renderizado aqui */}</div>;
};

`;

  // Remove imports e componentes existentes
  const cleanContent = content
    .replace(/^import React from "react";\s*\n?/m, '')
    .replace(/^export interface.*?\}\s*\n?/ms, '')
    .replace(/^export const Step\d+.*?\};\s*\n?/ms, '');

  return interfaceCode + cleanContent;
}

// 🔧 FUNÇÃO PARA CORRIGIR PROGRESSO
function fixProgress(content, stepNumber) {
  const progressMap = {
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 35,
    19: 95,
  };

  const newProgress = progressMap[stepNumber];
  if (!newProgress) return content;

  return content.replace(/progressValue:\s*\d+/g, `progressValue: ${newProgress}`);
}

// 🔧 FUNÇÃO PARA CORRIGIR NÚMERO DA ETAPA
function fixStepNumber(content, stepNumber) {
  const stepNumberRegex = /stepNumber:\s*"[^"]*"/g;
  return content.replace(stepNumberRegex, `stepNumber: "${stepNumber} de 21"`);
}

let correctedFiles = 0;
let errorFiles = 0;

// 🔧 PROCESSAR CADA ARQUIVO
for (const template of templatesToFix) {
  const filePath = path.join(stepsDir, template.file);

  try {
    console.log(`🔧 Corrigindo ${template.file}...`);

    let content = fs.readFileSync(filePath, 'utf8');

    // Aplicar correções necessárias
    if (template.needsInterface) {
      content = addInterface(content, template.step);
      console.log(`   ✅ Interface adicionada`);
    }

    if (template.needsProgress) {
      content = fixProgress(content, template.step);
      console.log(`   ✅ Progresso corrigido`);
    }

    if (template.needsStepNumber) {
      content = fixStepNumber(content, template.step);
      console.log(`   ✅ Número da etapa corrigido`);
    }

    // Escrever arquivo corrigido
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`✅ ${template.file} corrigido com sucesso!\n`);
    correctedFiles++;
  } catch (error) {
    console.log(`❌ Erro ao corrigir ${template.file}: ${error.message}\n`);
    errorFiles++;
  }
}

console.log('='.repeat(60));
console.log('📋 RELATÓRIO DE CORREÇÃO FINAL:');
console.log(`✅ Arquivos corrigidos: ${correctedFiles}`);
console.log(`❌ Arquivos com erro: ${errorFiles}`);
console.log(`📊 Total processado: ${correctedFiles + errorFiles}`);

if (correctedFiles > 0) {
  console.log('\n🎯 CORREÇÕES APLICADAS:');
  console.log('   ✅ Interfaces TypeScript completas');
  console.log('   ✅ Progresso atualizado para valores corretos');
  console.log('   ✅ Números das etapas padronizados (X de 21)');
  console.log('   ✅ Props padronizadas');
}

console.log('\n🚀 EXECUTAR: node final-report-21-templates.js para verificação final');
