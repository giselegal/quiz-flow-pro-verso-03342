/**
 * 🔍 TESTE COM ALGORITMO CORRIGIDO
 */

const testFunnelIds = [
    'funil-123', 'funil-456', 'funil-789', 'quiz-abc', 'teste-def', 'form-ghi',
    'funnel-a', 'funnel-b', 'funnel-c', 'id-100', 'id-200', 'id-300'
];

function generateSeedFromFunnelId(funnelId) {
    let hash = 0;
    for (let i = 0; i < funnelId.length; i++) {
        const char = funnelId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).slice(0, 8); // SEM prefixo "fnl"
}

function getFunnelVariantName(seed) {
    const variants = [
        'Premium', 'Pro', 'Classic', 'Elite', 'Special',
        'Advanced', 'Custom', 'Exclusive', 'Deluxe', 'Ultimate'
    ];
    // Usar hash numérico do seed completo
    let hashNum = 0;
    for (let i = 0; i < seed.length; i++) {
        hashNum += seed.charCodeAt(i);
    }
    const index = hashNum % variants.length;
    return variants[index];
}

function getFunnelThemeColor(seed) {
    const themes = [
        { bg: '#f3f4f6', text: '#374151', name: 'Gray' },
        { bg: '#fef3c7', text: '#92400e', name: 'Yellow' },
        { bg: '#dbeafe', text: '#1e40af', name: 'Blue' },
        { bg: '#d1fae5', text: '#065f46', name: 'Green' },
        { bg: '#fce7f3', text: '#be185d', name: 'Pink' },
        { bg: '#e0e7ff', text: '#3730a3', name: 'Indigo' },
        { bg: '#fed7d7', text: '#c53030', name: 'Red' },
        { bg: '#c6f6d5', text: '#2d3748', name: 'Light Green' },
    ];
    // Usar hash diferente para cores
    let colorHash = 0;
    for (let i = 0; i < seed.length; i++) {
        colorHash += seed.charCodeAt(i) * (i + 1);
    }
    const index = colorHash % themes.length;
    return themes[index];
}

console.log('🔍 TESTE COM ALGORITMO CORRIGIDO\n');

testFunnelIds.forEach((funnelId) => {
    const seed = generateSeedFromFunnelId(funnelId);
    const variant = getFunnelVariantName(seed);
    const theme = getFunnelThemeColor(seed);

    console.log(`${funnelId.padEnd(12)} → seed: ${seed} → variant: ${variant} → color: ${theme.name}`);
});

console.log('\n--- ESTATÍSTICAS CORRIGIDAS ---');
const variants = {};
const colors = {};

testFunnelIds.forEach((funnelId) => {
    const seed = generateSeedFromFunnelId(funnelId);
    const variant = getFunnelVariantName(seed);
    const theme = getFunnelThemeColor(seed);

    variants[variant] = (variants[variant] || 0) + 1;
    colors[theme.name] = (colors[theme.name] || 0) + 1;
});

console.log('\nDistribuição de Variantes:');
Object.entries(variants).forEach(([variant, count]) => {
    console.log(`  ${variant}: ${count}`);
});

console.log('\nDistribuição de Cores:');
Object.entries(colors).forEach(([color, count]) => {
    console.log(`  ${color}: ${count}`);
});