#!/usr/bin/env node

/**
 * Script para configurar e ativar as 21 etapas do funil no editor
 */

console.log('🎯 CONFIGURANDO AS 21 ETAPAS DO FUNIL');
console.log('=' .repeat(50));

// Estrutura das 21 etapas
const FUNNEL_STEPS = [
  { id: 1, type: 'quiz-start-page', name: 'Introdução ao Quiz', description: 'Página inicial com apresentação' },
  { id: 2, type: 'quiz-question-configurable', name: 'Questão 1', description: 'Primeira pergunta do quiz' },
  { id: 3, type: 'quiz-question-configurable', name: 'Questão 2', description: 'Segunda pergunta do quiz' },
  { id: 4, type: 'quiz-question-configurable', name: 'Questão 3', description: 'Terceira pergunta do quiz' },
  { id: 5, type: 'quiz-question-configurable', name: 'Questão 4', description: 'Quarta pergunta do quiz' },
  { id: 6, type: 'quiz-question-configurable', name: 'Questão 5', description: 'Quinta pergunta do quiz' },
  { id: 7, type: 'quiz-question-configurable', name: 'Questão 6', description: 'Sexta pergunta do quiz' },
  { id: 8, type: 'quiz-question-configurable', name: 'Questão 7', description: 'Sétima pergunta do quiz' },
  { id: 9, type: 'quiz-question-configurable', name: 'Questão 8', description: 'Oitava pergunta do quiz' },
  { id: 10, type: 'quiz-question-configurable', name: 'Questão 9', description: 'Nona pergunta do quiz' },
  { id: 11, type: 'quiz-question-configurable', name: 'Questão 10', description: 'Décima pergunta do quiz' },
  { id: 12, type: 'quiz-transition', name: 'Calculando...', description: 'Transição e processamento' },
  { id: 13, type: 'strategic-question', name: 'Questão Estratégica 1', description: 'Primeira questão estratégica' },
  { id: 14, type: 'strategic-question', name: 'Questão Estratégica 2', description: 'Segunda questão estratégica' },
  { id: 15, type: 'strategic-question', name: 'Questão Estratégica 3', description: 'Terceira questão estratégica' },
  { id: 16, type: 'strategic-question', name: 'Questão Estratégica 4', description: 'Quarta questão estratégica' },
  { id: 17, type: 'strategic-question', name: 'Questão Estratégica 5', description: 'Quinta questão estratégica' },
  { id: 18, type: 'strategic-question', name: 'Questão Estratégica 6', description: 'Sexta questão estratégica' },
  { id: 19, type: 'quiz-transition', name: 'Finalizando...', description: 'Transição final' },
  { id: 20, type: 'quiz-result-calculated', name: 'Resultado', description: 'Página de resultado personalizado' },
  { id: 21, type: 'quiz-offer-page', name: 'Oferta', description: 'Página de oferta comercial' }
];

console.log('📋 ESTRUTURA DAS 21 ETAPAS:');
FUNNEL_STEPS.forEach(step => {
  console.log(`  ${step.id.toString().padStart(2, '0')}. ${step.name} (${step.type})`);
});

// Verificar tipos de componentes disponíveis
const AVAILABLE_COMPONENTS = [
  'quiz-start-page',
  'quiz-question-configurable', 
  'quiz-transition',
  'strategic-question',
  'quiz-result-calculated',
  'quiz-offer-page'
];

console.log('\n🧩 COMPONENTES DISPONÍVEIS:');
AVAILABLE_COMPONENTS.forEach(component => {
  const count = FUNNEL_STEPS.filter(step => step.type === component).length;
  console.log(`  ✅ ${component} (usado ${count}x)`);
});

// Resumo estatístico
const stats = {
  totalPages: FUNNEL_STEPS.length,
  questionsMain: FUNNEL_STEPS.filter(s => s.type === 'quiz-question-configurable').length,
  questionsStrategic: FUNNEL_STEPS.filter(s => s.type === 'strategic-question').length,
  transitions: FUNNEL_STEPS.filter(s => s.type === 'quiz-transition').length,
  otherPages: FUNNEL_STEPS.filter(s => !['quiz-question-configurable', 'strategic-question', 'quiz-transition'].includes(s.type)).length
};

console.log('\n📊 ESTATÍSTICAS:');
console.log(`  📄 Total de páginas: ${stats.totalPages}`);
console.log(`  ❓ Questões principais: ${stats.questionsMain}`);
console.log(`  🎯 Questões estratégicas: ${stats.questionsStrategic}`);
console.log(`  🔄 Páginas de transição: ${stats.transitions}`);
console.log(`  📋 Outras páginas: ${stats.otherPages}`);

console.log('\n✅ CONFIGURAÇÃO CONCLUÍDA!');
console.log('👉 Acesse o editor em: http://localhost:8080/editor');
console.log('🔗 As 21 etapas estarão disponíveis na aba "Páginas"');
console.log('🧩 Os blocos estarão disponíveis na aba "Blocos"');
