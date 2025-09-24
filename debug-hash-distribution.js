/**
 * 🔍 DEBUG AVANÇADO - Analisar distribuição de hash
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
    return `fnl${Math.abs(hash).toString(16).slice(0, 8)}`;
}

function getFunnelVariantName(seed) {
    const variants = [
        'Premium', 'Pro', 'Classic', 'Elite', 'Special',
        'Advanced', 'Custom', 'Exclusive', 'Deluxe', 'Ultimate'
    ];
    const index = seed.charCodeAt(0) % variants.length;
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
    const index = seed.charCodeAt(0) % themes.length;
    return themes[index];
}

console.log('🔍 ANÁLISE DETALHADA DE DISTRIBUIÇÃO\n');

testFunnelIds.forEach((funnelId) => {
    const seed = generateSeedFromFunnelId(funnelId);
    const firstChar = seed.charCodeAt(0);
    const variantIndex = firstChar % 10;
    const colorIndex = firstChar % 8;
    const variant = getFunnelVariantName(seed);
    const theme = getFunnelThemeColor(seed);

    console.log(`${funnelId.padEnd(12)} → seed: ${seed} → firstChar: ${firstChar} (${seed.charAt(0)}) → variant: ${variantIndex}/${variant} → color: ${colorIndex}/${theme.name}`);
});

console.log('\n--- ESTATÍSTICAS ---');
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