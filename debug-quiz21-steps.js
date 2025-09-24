// Debug script to check quiz21StepsComplete template
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './src/templates/quiz21StepsComplete.ts';

console.log('🔍 Debugging quiz21StepsComplete template:');
console.log('Template loaded:', !!QUIZ_STYLE_21_STEPS_TEMPLATE);
console.log('Total steps:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length);

// Check first few steps
for (let i = 1; i <= 5; i++) {
    const stepKey = `step-${i}`;
    const stepData = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];
    console.log(`${stepKey}:`, stepData ? `${stepData.length} blocks` : 'NOT FOUND');

    if (stepData && stepData.length > 0) {
        console.log(`  First block:`, {
            id: stepData[0].id,
            type: stepData[0].type,
            hasContent: !!stepData[0].content,
            hasProperties: !!stepData[0].properties
        });
    }
}