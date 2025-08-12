// Debug script para verificar componentes na sidebar
// src/debug/check-sidebar-components.js

import { generateBlockDefinitions } from '../config/enhancedBlockRegistry';

// Função para simular a geração dos blocos do quiz
const generateQuizBlocks = () => {
  const headerBlock = {
    type: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho configurável com logo e barra decorativa',
    category: 'Questões do Quiz',
  };

  const introBlock = {
    type: 'step01-intro',
    name: 'Introdução - Step 1',
    description: 'Componente de introdução para a primeira etapa do quiz',
    category: 'Questões do Quiz',
  };

  return [headerBlock, introBlock];
};

// Verificar todos os blocos
console.log('=== DEBUG: Componentes da Sidebar ===');

const quizBlocks = generateQuizBlocks();
console.log('Quiz Blocks:', quizBlocks.length);
quizBlocks.forEach(block => {
  console.log(`- ${block.type}: ${block.name} (${block.category})`);
});

const regularBlocks = generateBlockDefinitions();
console.log('Regular Blocks:', regularBlocks.length);

const allBlocks = [...quizBlocks, ...regularBlocks];
console.log('Total Blocks:', allBlocks.length);

// Agrupar por categoria
const groupedBlocks = allBlocks.reduce((groups, block) => {
  const category = block.category || 'Outros';
  if (!groups[category]) {
    groups[category] = [];
  }
  groups[category].push(block);
  return groups;
}, {});

console.log('\n=== Blocos por Categoria ===');
Object.entries(groupedBlocks).forEach(([category, blocks]) => {
  console.log(`${category}: ${blocks.length} componentes`);
  blocks.forEach(block => {
    console.log(`  - ${block.type}: ${block.name}`);
  });
});

export { generateQuizBlocks, groupedBlocks };
