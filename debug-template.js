// Debug script para verificar o carregamento do template
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../templates/quiz21StepsComplete';
import { normalizeStepBlocks } from '../config/quizStepsComplete';

console.log('🐛 DEBUG: Verificando template...');

// 1. Verificar template original
console.log('📦 Template original keys:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE));
console.log('📦 Total steps no template:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length);

// 2. Verificar primeiros steps
for (let i = 1; i <= 5; i++) {
    const key = `step-${i}`;
    const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[key];
    console.log(`📦 Step ${i} (${key}):`, blocks ? blocks.length : 'não encontrado', 'blocks');
}

// 3. Verificar normalização
const normalized = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
console.log('🔄 Normalized keys:', Object.keys(normalized));
console.log('🔄 Total steps normalizado:', Object.keys(normalized).length);

// 4. Verificar alguns steps normalizados
for (let i = 1; i <= 5; i++) {
    const key = `step-${i}`;
    const blocks = normalized[key];
    console.log(`🔄 Normalized Step ${i} (${key}):`, blocks ? blocks.length : 'não encontrado', 'blocks');
}

console.log('✅ Debug concluído');