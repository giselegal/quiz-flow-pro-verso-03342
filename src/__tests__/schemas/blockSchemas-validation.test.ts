/**
 * Script de validação dos novos schemas Zod
 * Testa result-congrats e result-progress-bars
 */

import {
  resultCongratsBlockSchema,
  resultProgressBarsBlockSchema,
  resultMainBlockSchema,
  type ResultCongratsBlockData,
  type ResultProgressBarsBlockData,
  type ResultMainBlockData,
} from '../../schemas/blockSchemas';

console.log('🧪 Testando schemas Zod adicionados...\n');

// =====================================================
// TEST 1: result-congrats (válido)
// =====================================================
console.log('📝 Test 1: result-congrats (válido)');
const validCongrats: ResultCongratsBlockData = {
  text: 'Parabéns, {userName}!',
  showUserName: true,
  userName: 'Maria',
  fontSize: '3xl',
  fontFamily: 'Playfair Display',
  color: '#B89B7A',
  textAlign: 'center',
  marginBottom: '6',
};

try {
  const result = resultCongratsBlockSchema.parse(validCongrats);
  console.log('✅ PASSOU:', result);
} catch (error: any) {
  console.error('❌ FALHOU:', error.errors);
}

// =====================================================
// TEST 2: result-congrats (inválido - texto vazio)
// =====================================================
console.log('\n📝 Test 2: result-congrats (inválido)');
const invalidCongrats = {
  text: '', // ❌ Texto vazio
  fontSize: 'invalid', // ❌ Enum inválido
};

try {
  resultCongratsBlockSchema.parse(invalidCongrats);
  console.error('❌ Deveria ter falhado!');
} catch (error: any) {
  console.log('✅ Validação correta detectou erros:');
  error.errors.forEach((err: any) => {
    console.log(`   - ${err.path.join('.')}: ${err.message}`);
  });
}

// =====================================================
// TEST 3: result-progress-bars (válido)
// =====================================================
console.log('\n📝 Test 3: result-progress-bars (válido)');
const validProgressBars: ResultProgressBarsBlockData = {
  scores: [
    { name: 'Clássico Elegante', score: 85 },
    { name: 'Romântico', score: 72 },
    { name: 'Natural', score: 65 },
  ],
  showTop3: true,
  barColor: '#B89B7A',
  title: 'Compatibilidade com estilos:',
  marginBottom: '8',
  showPercentage: true,
  percentageFormat: '{percentage}%',
  animationDelay: 200,
};

try {
  const result = resultProgressBarsBlockSchema.parse(validProgressBars);
  console.log('✅ PASSOU:', result);
} catch (error: any) {
  console.error('❌ FALHOU:', error.errors);
}

// =====================================================
// TEST 4: result-progress-bars (inválido - score > 100)
// =====================================================
console.log('\n📝 Test 4: result-progress-bars (inválido)');
const invalidProgressBars = {
  scores: [
    { name: 'Estilo A', score: 150 }, // ❌ Score > 100
    { name: '', score: -10 }, // ❌ Nome vazio, score negativo
  ],
  animationDelay: 2000, // ❌ Delay > 1000
};

try {
  resultProgressBarsBlockSchema.parse(invalidProgressBars);
  console.error('❌ Deveria ter falhado!');
} catch (error: any) {
  console.log('✅ Validação correta detectou erros:');
  error.errors.forEach((err: any) => {
    console.log(`   - ${err.path.join('.')}: ${err.message}`);
  });
}

// =====================================================
// TEST 5: result-main (atualizado com novos campos)
// =====================================================
console.log('\n📝 Test 5: result-main (com novos campos)');
const validResultMain: ResultMainBlockData = {
  styleName: 'Clássico Elegante',
  description: 'Estilo sofisticado e atemporal',
  showIcon: true,
  userName: 'João',
  percentage: '85%',
  showCelebration: true,
  backgroundColor: '#F5EDE4',
  textColor: '#5b4135',
  accentColor: '#B89B7A',
};

try {
  const result = resultMainBlockSchema.parse(validResultMain);
  console.log('✅ PASSOU:', result);
} catch (error: any) {
  console.error('❌ FALHOU:', error.errors);
}

// =====================================================
// TEST 6: Defaults automáticos
// =====================================================
console.log('\n📝 Test 6: Defaults automáticos');
const minimalCongrats = {
  text: 'Parabéns!',
};

try {
  const result = resultCongratsBlockSchema.parse(minimalCongrats);
  console.log('✅ Defaults aplicados corretamente:', {
    showUserName: result.showUserName, // deve ser true
    fontSize: result.fontSize, // deve ser '2xl'
    textAlign: result.textAlign, // deve ser 'center'
    marginBottom: result.marginBottom, // deve ser '4'
  });
} catch (error: any) {
  console.error('❌ FALHOU:', error.errors);
}

console.log('\n🎉 Testes concluídos!');

export {};
