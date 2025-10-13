#!/usr/bin/env node
/**
 * Script para gerar schemas faltantes em blockPropertySchemas.ts
 * 
 * Lê o EnhancedBlockRegistry e gera schemas básicos para todos os
 * componentes que não têm schema definido.
 */

import fs from 'fs';

console.log('🔧 GERANDO SCHEMAS FALTANTES');
console.log('='.repeat(60));

// 1. Ler EnhancedBlockRegistry
const registryPath = 'src/components/editor/blocks/EnhancedBlockRegistry.tsx';
const registryContent = fs.readFileSync(registryPath, 'utf-8');

const registryTypes = new Set();
const typeMatches = registryContent.matchAll(/'([^']+)':\s*(?:[A-Z][a-zA-Z]+|lazy)/g);
for (const match of typeMatches) {
    if (!match[1].includes('*')) {
        registryTypes.add(match[1]);
    }
}

// 2. Ler blockPropertySchemas existentes
const schemaPath = 'src/config/blockPropertySchemas.ts';
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

const existingSchemas = new Set();
const schemaMatches = schemaContent.matchAll(/'([^']+)':\s*\{[\s\S]*?label:\s*'([^']+)'/g);
for (const match of schemaMatches) {
    existingSchemas.add(match[1]);
}

// 3. Identificar componentes faltantes
const missingSchemas = Array.from(registryTypes).filter(t => !existingSchemas.has(t));

console.log(`\n📊 Encontrados ${missingSchemas.length} componentes sem schema\n`);

// 4. Categorizar componentes para schemas apropriados
const schemaCategories = {
    container: ['container', 'section', 'box', 'form-container'],
    text: ['legal-notice', 'legal-notice-inline', 'headline-inline'],
    button: ['button-inline-fixed', 'cta-inline', 'quiz-offer-cta-inline'],
    navigation: ['quiz-navigation', 'navigation'],
    progress: ['progress-bar', 'progress-inline', 'loader-inline', 'loading-animation'],
    decoration: ['decorative-bar', 'guarantee-badge', 'gradient-animation'],
    quiz: ['quiz-advanced-question', 'quiz-button', 'quiz-form', 'quiz-image', 'quiz-intro',
        'quiz-options-inline', 'quiz-personal-info-inline', 'quiz-processing', 'quiz-progress',
        'quiz-question-inline', 'quiz-result-header', 'quiz-result-secondary', 'quiz-result-style',
        'quiz-results', 'quiz-start-page-inline', 'quiz-style-question', 'quiz-text', 'quiz-transition'],
    result: ['modular-result-header', 'result-card', 'style-results', 'options-grid-inline'],
    sales: ['benefits-list', 'bonus-inline', 'personalized-hook-inline', 'final-value-proposition-inline',
        'testimonials-grid'],
    step20: ['step20-compatibility', 'step20-complete-template', 'step20-personalized-offer',
        'step20-result-header', 'step20-secondary-styles', 'step20-style-reveal', 'step20-user-greeting'],
    ai: ['fashion-ai-generator']
};

// 5. Gerar schemas
function generateSchema(type, category) {
    const label = type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const baseFields = [
        `    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }`,
    ];

    let specificFields = [];

    switch (category) {
        case 'container':
            specificFields = [
                `    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' }`,
                `    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' }`,
                `    { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' }`,
                `    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' }`,
            ];
            break;

        case 'text':
            specificFields = [
                `    { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true }`,
                `    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '1rem' }`,
                `    { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{label: 'Normal', value: 'normal'}, {label: 'Negrito', value: 'bold'}], defaultValue: 'normal' }`,
                `    { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' }`,
                `    { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{label: 'Esquerda', value: 'left'}, {label: 'Centro', value: 'center'}, {label: 'Direita', value: 'right'}], defaultValue: 'left' }`,
            ];
            break;

        case 'button':
            specificFields = [
                `    { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' }`,
                `    { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' }`,
                `    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' }`,
                `    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' }`,
                `    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' }`,
                `    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' }`,
            ];
            break;

        case 'navigation':
            specificFields = [
                `    { key: 'showProgressBar', label: 'Mostrar Barra de Progresso', type: 'boolean', group: 'content', defaultValue: true }`,
                `    { key: 'showStepNumber', label: 'Mostrar Número do Step', type: 'boolean', group: 'content', defaultValue: true }`,
                `    { key: 'backButtonText', label: 'Texto Botão Voltar', type: 'text', group: 'content', defaultValue: 'Voltar' }`,
                `    { key: 'nextButtonText', label: 'Texto Botão Avançar', type: 'text', group: 'content', defaultValue: 'Próximo' }`,
            ];
            break;

        case 'progress':
            specificFields = [
                `    { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 }`,
                `    { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true }`,
                `    { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' }`,
                `    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' }`,
                `    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' }`,
            ];
            break;

        case 'decoration':
            specificFields = [
                `    { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' }`,
                `    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '4px' }`,
                `    { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' }`,
                `    { key: 'opacity', label: 'Opacidade', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 100 }`,
            ];
            break;

        case 'quiz':
            specificFields = [
                `    { key: 'title', label: 'Título', type: 'text', group: 'content' }`,
                `    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' }`,
                `    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' }`,
                `    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' }`,
            ];
            break;

        case 'result':
        case 'sales':
        case 'step20':
            specificFields = [
                `    { key: 'title', label: 'Título', type: 'text', group: 'content' }`,
                `    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' }`,
                `    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' }`,
                `    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' }`,
                `    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' }`,
            ];
            break;

        case 'ai':
            specificFields = [
                `    { key: 'apiKey', label: 'Chave da API', type: 'text', group: 'config' }`,
                `    { key: 'model', label: 'Modelo', type: 'text', group: 'config', defaultValue: 'gpt-4' }`,
                `    { key: 'prompt', label: 'Prompt', type: 'textarea', group: 'content' }`,
            ];
            break;

        default:
            specificFields = [
                `    { key: 'content', label: 'Conteúdo', type: 'text', group: 'content' }`,
            ];
    }

    return `  '${type}': {
    label: '${label}',
    fields: [
${specificFields.join(',\n')},
${baseFields.join(',\n')}
    ]
  }`;
}

// 6. Agrupar por categoria e gerar
const generatedSchemas = [];

for (const [category, types] of Object.entries(schemaCategories)) {
    console.log(`\n📦 Categoria: ${category.toUpperCase()}`);

    for (const type of types) {
        if (missingSchemas.includes(type)) {
            const schema = generateSchema(type, category);
            generatedSchemas.push(schema);
            console.log(`   ✅ ${type}`);
        }
    }
}

// 7. Salvar schemas gerados em arquivo temporário
const outputPath = 'SCHEMAS_GERADOS.ts';
const output = `// 🤖 SCHEMAS GERADOS AUTOMATICAMENTE
// Data: ${new Date().toISOString()}
// Total: ${generatedSchemas.length} schemas

export const GENERATED_SCHEMAS = {
${generatedSchemas.join(',\n\n')}
};
`;

fs.writeFileSync(outputPath, output, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ ${generatedSchemas.length} schemas gerados!`);
console.log(`📄 Arquivo salvo: ${outputPath}`);
console.log('\n🔧 PRÓXIMOS PASSOS:');
console.log('   1. Revisar schemas em SCHEMAS_GERADOS.ts');
console.log('   2. Copiar e colar no final de blockPropertySchemas.ts');
console.log('   3. Ajustar campos específicos conforme necessário');
console.log('   4. Testar no editor');
console.log('='.repeat(60));
