/**
 * 🧪 TESTES ESPECÍFICOS DE COMPONENTES REACT
 * Validação detalhada dos componentes criados
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TESTES ESPECÍFICOS DE COMPONENTES REACT');
console.log('═'.repeat(60));

// Função para validar sintaxe React detalhada
function validateReactComponentDetailed(filePath) {
    console.log(`\n🔍 Analisando: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ Arquivo não existe');
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const checks = [
        { name: 'Importa React', regex: /import\s+React/, required: true },
        { name: 'Export default function', regex: /export\s+default\s+function/, required: true },
        { name: 'Props TypeScript', regex: /:\s*\w+Props/, required: false },
        { name: 'Return statement', regex: /return\s*\(/, required: true },
        { name: 'JSX elements', regex: /<\w+/, required: true },
        { name: 'Closing JSX', regex: />\s*;?\s*\}/, required: false },
        { name: 'DisplayName', regex: /\.displayName\s*=/, required: false },
        { name: 'BlockType', regex: /\.blockType\s*=/, required: false }
    ];
    
    let valid = true;
    let score = 0;
    const total = checks.length;
    
    checks.forEach(check => {
        const found = check.regex.test(content);
        const status = found ? '✅' : (check.required ? '❌' : '⚠️');
        console.log(`  ${status} ${check.name}: ${found ? 'PRESENTE' : 'AUSENTE'}`);
        
        if (found) score++;
        if (check.required && !found) valid = false;
    });
    
    console.log(`📊 Score: ${score}/${total} (${Math.round(score/total*100)}%)`);
    console.log(`✅ Válido: ${valid ? 'SIM' : 'NÃO'}`);
    
    return valid;
}

// Testar componentes críticos
const componentsToTest = [
    'src/components/editor/blocks/atomic/QuestionTitleBlock.tsx',
    'src/components/editor/blocks/atomic/QuestionHeroBlock.tsx',
    'src/components/editor/blocks/atomic/QuestionProgressBlock.tsx',
    'src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx',
    'src/components/editor/blocks/atomic/OptionsGridBlock.tsx'
];

let validComponents = 0;
let totalComponents = 0;

componentsToTest.forEach(componentPath => {
    totalComponents++;
    if (validateReactComponentDetailed(componentPath)) {
        validComponents++;
    }
});

console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMO DA VALIDAÇÃO');
console.log('═'.repeat(60));
console.log(`✅ Componentes válidos: ${validComponents}/${totalComponents}`);
console.log(`📈 Taxa de sucesso: ${Math.round(validComponents/totalComponents*100)}%`);

if (validComponents === totalComponents) {
    console.log('🎉 TODOS OS COMPONENTES ESTÃO VÁLIDOS!');
} else {
    console.log('⚠️ Alguns componentes precisam de correção');
}

// Teste adicional: Verificar se os componentes podem ser importados (simulação)
console.log('\n🔗 TESTE DE IMPORTAÇÃO (simulação)');
console.log('─'.repeat(40));

componentsToTest.forEach(componentPath => {
    const componentName = path.basename(componentPath, '.tsx');
    
    if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar se tem export default
        const hasDefaultExport = /export\s+default/.test(content);
        console.log(`📦 ${componentName}: ${hasDefaultExport ? '✅ Importável' : '❌ Sem export default'}`);
    }
});

console.log('\n✨ Teste específico concluído!');