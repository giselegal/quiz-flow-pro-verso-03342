#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Atualizando configurações de pontuação do quiz...');

const filePath = path.join(__dirname, 'src/data/realQuizTemplates.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Questão 5 - Estampas
const q5OldPattern =
  /{\s*id:\s*"5([a-h])",\s*text:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)",\s*value:\s*"5\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q5OldPattern, (match, letter, text, imageUrl, category) => {
  return `{ 
                id: "5${letter}", 
                text: "${text}",
                imageUrl: "${imageUrl}",
                value: "5${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Questão 6 - Casacos
const q6OldPattern =
  /{\s*id:\s*"6([a-h])",\s*text:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)",\s*value:\s*"6\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q6OldPattern, (match, letter, text, imageUrl, category) => {
  return `{ 
                id: "6${letter}", 
                text: "${text}",
                imageUrl: "${imageUrl}",
                value: "6${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Questão 7 - Calças
const q7OldPattern =
  /{\s*id:\s*"7([a-h])",\s*text:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)",\s*value:\s*"7\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q7OldPattern, (match, letter, text, imageUrl, category) => {
  return `{ 
                id: "7${letter}", 
                text: "${text}",
                imageUrl: "${imageUrl}",
                value: "7${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Questão 8 - Sapatos
const q8OldPattern =
  /{\s*id:\s*"8([a-h])",\s*text:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)",\s*value:\s*"8\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q8OldPattern, (match, letter, text, imageUrl, category) => {
  return `{ 
                id: "8${letter}", 
                text: "${text}",
                imageUrl: "${imageUrl}",
                value: "8${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Questão 9 - Acessórios
const q9OldPattern =
  /{\s*id:\s*"9([a-h])",\s*text:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)",\s*value:\s*"9\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q9OldPattern, (match, letter, text, imageUrl, category) => {
  return `{ 
                id: "9${letter}", 
                text: "${text}",
                imageUrl: "${imageUrl}",
                value: "9${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Questão 10 - Tecidos (sem imagem)
const q10OldPattern =
  /{\s*id:\s*"10([a-h])",\s*text:\s*"([^"]+)",\s*value:\s*"10\1",\s*category:\s*"([^"]+)"\s*}/g;
content = content.replace(q10OldPattern, (match, letter, text, category) => {
  return `{ 
                id: "10${letter}", 
                text: "${text}",
                value: "10${letter}",
                category: "${category}",
                styleCategory: "${category}",
                points: 1
              }`;
});

// Adicionar metadados de scoring para cada questão
const questionsMetadata = {
  q1: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q2: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q3: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q4: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q5: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q6: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q7: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q8: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q9: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
  q10: {
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
  },
};

// Adicionar metadados no final do arquivo
const metadataExport = `

// Metadados de scoring e validação para as questões
export const QUIZ_QUESTIONS_METADATA = ${JSON.stringify(questionsMetadata, null, 2)};

// Categorias de estilo disponíveis
export const STYLE_CATEGORIES = [
  'Natural',
  'Clássico', 
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo'
] as const;

export type StyleCategory = typeof STYLE_CATEGORIES[number];

// Configurações de pontuação
export const SCORING_CONFIG = {
  pointsPerSelection: 1,
  maxSelectionsPerQuestion: 3,
  minSelectionsPerQuestion: 1,
  totalQuestions: 10,
  passageThreshold: 0.6, // 60% das questões respondidas para calcular resultado
  tieBreakingMethod: 'firstSelection' // ou 'timestamp'
};
`;

// Verificar se os metadados já existem para evitar duplicação
if (!content.includes('QUIZ_QUESTIONS_METADATA')) {
  content += metadataExport;
}

fs.writeFileSync(filePath, content);

console.log('✅ Configurações de pontuação atualizadas com sucesso!');
console.log('\n📋 Recursos implementados:');
console.log('  • styleCategory e points adicionados a todas as opções');
console.log('  • Metadados de validação para cada questão');
console.log('  • Configurações de scoring globais');
console.log('  • Constantes de categorias de estilo');
console.log('  • Sistema de desempate configurado');
