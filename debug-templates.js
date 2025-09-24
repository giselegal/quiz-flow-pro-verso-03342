/**
 * 🔍 DEBUG SCRIPT - Testar personalização de templates por funil
 */

// Simular diferentes funnelIds
const testFunnelIds = [
    'funil-123',
    'funil-456',
    'funil-789',
    'quiz-abc',
    'teste-def',
    'form-ghi'
];

// Função para gerar seed (igual ao quiz21StepsComplete.ts)
function generateSeedFromFunnelId(funnelId) {
    let hash = 0;
    for (let i = 0; i < funnelId.length; i++) {
        const char = funnelId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `fnl${Math.abs(hash).toString(16).slice(0, 8)}`;
}

// Função para obter nome da variante
function getFunnelVariantName(seed) {
    const variants = [
        'Premium', 'Pro', 'Classic', 'Elite', 'Special',
        'Advanced', 'Custom', 'Exclusive', 'Deluxe', 'Ultimate'
    ];
    const index = seed.charCodeAt(0) % variants.length;
    return variants[index];
}

// Função para obter cores temáticas
function getFunnelThemeColor(seed) {
    const themes = [
        { bg: '#f3f4f6', text: '#374151' }, // Gray
        { bg: '#fef3c7', text: '#92400e' }, // Yellow
        { bg: '#dbeafe', text: '#1e40af' }, // Blue
        { bg: '#d1fae5', text: '#065f46' }, // Green
        { bg: '#fce7f3', text: '#be185d' }, // Pink
        { bg: '#e0e7ff', text: '#3730a3' }, // Indigo
        { bg: '#fed7d7', text: '#c53030' }, // Red
        { bg: '#c6f6d5', text: '#2d3748' }, // Light Green
    ];
    const index = seed.charCodeAt(0) % themes.length;
    return themes[index];
}

// Simular template base (exemplo step-1)
const baseTemplate = [
    {
        id: 'intro-header-1',
        type: 'quiz-intro-header',
        content: {
            title: 'Descubra Seu Estilo Pessoal'
        },
        properties: {
            style: {
                backgroundColor: '#ffffff',
                color: '#000000'
            }
        }
    },
    {
        id: 'intro-text-1',
        type: 'text-inline',
        content: {
            text: 'Este quiz irá ajudar você a descobrir seu estilo único.'
        }
    }
];

// Testar personalização para cada funil
console.log('🔍 TESTE DE PERSONALIZAÇÃO DE TEMPLATES\n');

testFunnelIds.forEach((funnelId, index) => {
    console.log(`\n--- FUNIL ${index + 1}: ${funnelId} ---`);

    const funnelSeed = generateSeedFromFunnelId(funnelId);
    const variantName = getFunnelVariantName(funnelSeed);
    const themeColor = getFunnelThemeColor(funnelSeed);

    console.log(`Seed gerado: ${funnelSeed}`);
    console.log(`Variante: ${variantName}`);
    console.log(`Cores: ${themeColor.bg} / ${themeColor.text}`);

    // Simular personalização do primeiro bloco
    const personalizedBlock = JSON.parse(JSON.stringify(baseTemplate[0]));
    personalizedBlock.id = `${personalizedBlock.id}-${funnelSeed}`;

    // Personalizar título
    const variations = [
        personalizedBlock.content.title, // Original
        `${personalizedBlock.content.title} - Versão ${funnelSeed.slice(-3)}`,
        `${personalizedBlock.content.title} (${variantName})`,
        `${personalizedBlock.content.title} - Edição Personalizada`
    ];
    personalizedBlock.content.title = variations[funnelSeed.charCodeAt(0) % variations.length];

    // Personalizar cores
    personalizedBlock.properties.style.backgroundColor = themeColor.bg;
    personalizedBlock.properties.style.color = themeColor.text;

    console.log(`ID personalizado: ${personalizedBlock.id}`);
    console.log(`Título personalizado: ${personalizedBlock.content.title}`);
    console.log(`Background: ${personalizedBlock.properties.style.backgroundColor}`);
    console.log(`Cor do texto: ${personalizedBlock.properties.style.color}`);
});

console.log('\n✅ Teste concluído! Cada funil deveria ter conteúdo diferente.');