/**
 * 📋 LISTAR TODAS AS STEPS DO TEMPLATE
 */

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║          📋 STEPS DO TEMPLATE quiz21StepsComplete       ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Listar todas as 21 steps
const steps = Array.from({ length: 21 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `step-${num}`;
});

console.log('🎯 TOTAL: 21 Steps\n');

// Organizar por categoria
const categories = {
    'INTRO (1 step)': ['step-01'],
    'PERGUNTAS (10 steps)': steps.slice(1, 11), // step-02 a step-11
    'TRANSIÇÃO 1 (1 step)': ['step-12'],
    'ESTRATÉGICAS (6 steps)': steps.slice(12, 18), // step-13 a step-18
    'TRANSIÇÃO 2 (1 step)': ['step-19'],
    'RESULTADO (1 step)': ['step-20'],
    'OFERTA (1 step)': ['step-21']
};

Object.entries(categories).forEach(([category, stepList]) => {
    console.log(`\n${category}:`);
    stepList.forEach(stepId => {
        console.log(`   ✓ ${stepId}`);
    });
});

console.log('\n\n╔══════════════════════════════════════════════════════════╗');
console.log('║         🎯 STEPS COM OPTIONS-GRID (Quiz Steps)         ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const stepsWithOptions = [
    'step-02', 'step-03', 'step-04', 'step-05', 'step-06',
    'step-07', 'step-08', 'step-09', 'step-10', 'step-11',
    'step-13', 'step-14', 'step-15', 'step-16', 'step-17', 'step-18'
];

console.log('📦 Steps que TÊM options-grid (com imageUrl, points, category):');
stepsWithOptions.forEach(stepId => {
    console.log(`   ✓ ${stepId} → http://localhost:5173/quiz-editor/modular?template=quiz21StepsComplete (navegar até ${stepId})`);
});

console.log('\n\n╔══════════════════════════════════════════════════════════╗');
console.log('║              🧪 COMO TESTAR CADA STEP                   ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

console.log('1. Abra o editor:');
console.log('   http://localhost:5173/quiz-editor/modular?template=quiz21StepsComplete\n');

console.log('2. Use o navegador de steps (coluna esquerda ou topo) para ir até a step desejada\n');

console.log('3. Clique no bloco "options-grid" (se existir na step)\n');

console.log('4. Veja o Painel de Propriedades (coluna direita)\n');

console.log('5. Clique no botão 🧪 DEBUG para ver os dados\n');

console.log('\n📋 EXEMPLO: Para testar step-02:');
console.log('   1. Abra: http://localhost:5173/quiz-editor/modular?template=quiz21StepsComplete');
console.log('   2. Se não estiver em step-02, navegue até ela');
console.log('   3. Clique no bloco "Grid de Opções"');
console.log('   4. Clique em 🧪 DEBUG');
console.log('   5. Verifique se options[0] tem: imageUrl, points, category\n');

