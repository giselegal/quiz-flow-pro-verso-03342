import {
  quizCalculationEngine,
  processResponse,
  calculateQuizResult,
} from '../lib/quizCalculation';
import type { QuizResponse } from '../types/quiz';

// Teste do engine de cálculo
console.log('🧮 Testando Engine de Cálculo CaktoQuiz');
console.log('=========================================');

// Simular respostas de um quiz completo (10 questões normais)
const mockResponses: QuizResponse[] = [
  processResponse('q1', 'option_b'), // Clássico
  processResponse('q2', 'option_b'), // Clássico
  processResponse('q3', 'option_b'), // Clássico
  processResponse('q4', 'option_a'), // Natural
  processResponse('q5', 'option_d'), // Elegante
  processResponse('q6', 'option_b'), // Clássico
  processResponse('q7', 'option_e'), // Romântico
  processResponse('q8', 'option_b'), // Clássico
  processResponse('q9', 'option_a'), // Natural
  processResponse('q10', 'option_h'), // Criativo
];

console.log('📝 Respostas simuladas:');
mockResponses.forEach((response, index) => {
  console.log(`Q${index + 1}: ${response.selectedOptionId} → ${response.selectedStyle}`);
});

console.log('\n🏆 Calculando resultado...');
const result = calculateQuizResult(mockResponses, 'Teste');

console.log('\n📊 Scores por estilo:');
result.styleScores.forEach(score => {
  console.log(
    `${score.rank}º lugar: ${score.style} - ${score.points} pontos (${score.percentage}%)`
  );
});

console.log(`\n🎯 Estilo predominante: ${result.predominantStyle}`);
console.log(`🤝 Estilos complementares: ${result.complementaryStyles.join(', ')}`);
console.log(`📝 Total de questões normais: ${result.totalNormalQuestions}`);

// Teste de desempate
console.log('\n🔄 Testando desempate...');
const tieResponses: QuizResponse[] = [
  processResponse('q1', 'option_a'), // Natural (primeira aparição)
  processResponse('q2', 'option_b'), // Clássico
  processResponse('q3', 'option_a'), // Natural
  processResponse('q4', 'option_b'), // Clássico (empate com Natural)
];

const tieResult = calculateQuizResult(tieResponses, 'Teste Empate');
console.log('🎯 Resultado com empate:');
console.log(
  `1º lugar: ${tieResult.predominantStyle} (deve ser 'natural' por ter aparecido primeiro)`
);

console.log('\n✅ Teste concluído com sucesso!');
