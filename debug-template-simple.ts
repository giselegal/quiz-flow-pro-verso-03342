// Test script using npx tsx for TypeScript support
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './src/templates/quiz21StepsComplete';
import { normalizeStepBlocks } from './src/config/quizStepsComplete';

console.log('🎯 Template Debug Test\n');

console.log('1. Template availability:', {
    hasTemplate: !!QUIZ_STYLE_21_STEPS_TEMPLATE,
    templateType: typeof QUIZ_STYLE_21_STEPS_TEMPLATE,
    templateKeys: QUIZ_STYLE_21_STEPS_TEMPLATE ? Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE) : [],
    keyCount: QUIZ_STYLE_21_STEPS_TEMPLATE ? Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length : 0
});

if (QUIZ_STYLE_21_STEPS_TEMPLATE) {
    console.log('\n2. Sample entries:');
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).slice(0, 3).forEach(([key, value]) => {
        console.log(`  ${key}:`, {
            type: typeof value,
            isArray: Array.isArray(value),
            length: Array.isArray(value) ? value.length : 'N/A',
            hasBlocks: value && typeof value === 'object' && 'blocks' in value
        });
    });

    console.log('\n3. Testing normalization...');
    const normalized = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);

    console.log('Normalized result:', {
        keys: Object.keys(normalized),
        keyCount: Object.keys(normalized).length,
        stepBlockCounts: Object.entries(normalized).map(([k, v]) => [k, v.length])
    });

    console.log('\n4. Testing specific steps:');
    for (let i = 1; i <= 5; i++) {
        const stepKey = `step-${i}`;
        const blocks = normalized[stepKey];
        console.log(`  Step ${i}:`, {
            hasBlocks: !!blocks,
            count: blocks?.length || 0,
            types: blocks?.slice(0, 3).map(b => b.type) || []
        });
    }
}