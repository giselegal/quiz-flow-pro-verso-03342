// 🧪 Script de Validação do Template quiz21StepsComplete
// Verifica a integridade e estrutura do template

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`${BLUE}════════════════════════════════════════════════════════${RESET}`);
console.log(`${BLUE}   🧪 VALIDADOR DE TEMPLATE - quiz21StepsComplete${RESET}`);
console.log(`${BLUE}════════════════════════════════════════════════════════${RESET}\n`);

const TEMPLATE_PATH = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');

// Verificar se o arquivo existe
if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`${RED}❌ Template não encontrado: ${TEMPLATE_PATH}${RESET}\n`);
    process.exit(1);
}

console.log(`${GREEN}✅ Arquivo encontrado${RESET}`);
console.log(`${BLUE}📄 Caminho: ${TEMPLATE_PATH}${RESET}\n`);

// Ler o conteúdo do arquivo
const content = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Estatísticas básicas
const lines = content.split('\n').length;
const chars = content.length;
const size = fs.statSync(TEMPLATE_PATH).size;

console.log(`${BLUE}═══ ESTATÍSTICAS BÁSICAS ═══${RESET}`);
console.log(`📏 Linhas: ${lines}`);
console.log(`📝 Caracteres: ${chars.toLocaleString()}`);
console.log(`💾 Tamanho: ${(size / 1024).toFixed(2)} KB\n`);

// Validações
let errors = 0;
let warnings = 0;

console.log(`${BLUE}═══ VALIDAÇÕES ═══${RESET}\n`);

// 1. Verificar exportação principal
if (content.includes('export const QUIZ_STYLE_21_STEPS_TEMPLATE')) {
    console.log(`${GREEN}✅ Export QUIZ_STYLE_21_STEPS_TEMPLATE encontrado${RESET}`);
} else {
    console.log(`${RED}❌ Export QUIZ_STYLE_21_STEPS_TEMPLATE não encontrado${RESET}`);
    errors++;
}

// 2. Verificar IS_TEST
if (content.includes('IS_TEST ? MINIMAL_TEST_TEMPLATE')) {
    console.log(`${YELLOW}⚠️  IS_TEST detectado - pode afetar carregamento em testes${RESET}`);
    warnings++;
} else {
    console.log(`${GREEN}✅ Sem flags IS_TEST problemáticas${RESET}`);
}

// 3. Verificar todos os steps (1-20)
console.log(`\n${BLUE}═══ VERIFICAÇÃO DE STEPS ═══${RESET}`);
const missingSteps = [];
for (let i = 1; i <= 20; i++) {
    const stepId = `'step-${i}'`;
    if (content.includes(stepId)) {
        console.log(`${GREEN}✅ step-${i}${RESET}`);
    } else {
        console.log(`${RED}❌ step-${i} não encontrado${RESET}`);
        missingSteps.push(i);
        errors++;
    }
}

if (missingSteps.length > 0) {
    console.log(`\n${RED}❌ Steps faltando: ${missingSteps.join(', ')}${RESET}`);
}

// 4. Contar tipos de blocos
console.log(`\n${BLUE}═══ TIPOS DE BLOCOS ═══${RESET}`);
const blockTypes = content.match(/type: '[^']+'/g) || [];
const uniqueTypes = {};
blockTypes.forEach(type => {
    const typeName = type.match(/'([^']+)'/)[1];
    uniqueTypes[typeName] = (uniqueTypes[typeName] || 0) + 1;
});

Object.entries(uniqueTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
        console.log(`  📦 ${type}: ${count}x`);
    });

// 5. Verificar componentes críticos
console.log(`\n${BLUE}═══ COMPONENTES CRÍTICOS ═══${RESET}`);
const criticalComponents = [
    'quiz-intro-header',
    'form-container',
    'options-grid',
    'result-header-inline',
    'secondary-styles',
    'fashion-ai-generator'
];

criticalComponents.forEach(comp => {
    if (content.includes(`type: '${comp}'`)) {
        console.log(`${GREEN}✅ ${comp}${RESET}`);
    } else {
        console.log(`${YELLOW}⚠️  ${comp} não encontrado${RESET}`);
        warnings++;
    }
});

// 6. Verificar variáveis de personalização
console.log(`\n${BLUE}═══ VARIÁVEIS DE PERSONALIZAÇÃO ═══${RESET}`);
const variables = [
    '{userName}',
    '{resultStyle}',
    '{resultPercentage}',
    '{secondaryStyle1}',
    '{secondaryStyle2}',
    '{secondaryPercentage1}',
    '{secondaryPercentage2}'
];

variables.forEach(variable => {
    if (content.includes(variable)) {
        console.log(`${GREEN}✅ ${variable}${RESET}`);
    } else {
        console.log(`${YELLOW}⚠️  ${variable} não encontrado${RESET}`);
        warnings++;
    }
});

// 7. Verificar estrutura de scoring
console.log(`\n${BLUE}═══ SISTEMA DE PONTUAÇÃO ═══${RESET}`);
const styles = [
    'Natural',
    'Clássico',
    'Contemporâneo',
    'Elegante',
    'Romântico',
    'Sexy',
    'Dramático',
    'Criativo'
];

let styleCount = 0;
styles.forEach(style => {
    const count = (content.match(new RegExp(style, 'g')) || []).length;
    if (count > 0) {
        console.log(`${GREEN}✅ ${style}: ${count}x${RESET}`);
        styleCount++;
    } else {
        console.log(`${RED}❌ ${style}: não encontrado${RESET}`);
        errors++;
    }
});

// Resumo final
console.log(`\n${BLUE}════════════════════════════════════════════════════════${RESET}`);
console.log(`${BLUE}   📊 RESUMO DA VALIDAÇÃO${RESET}`);
console.log(`${BLUE}════════════════════════════════════════════════════════${RESET}\n`);

console.log(`📦 Total de blocos: ${blockTypes.length}`);
console.log(`🎨 Tipos únicos: ${Object.keys(uniqueTypes).length}`);
console.log(`🎯 Steps encontrados: ${20 - missingSteps.length}/20`);
console.log(`💎 Estilos encontrados: ${styleCount}/8\n`);

if (errors > 0) {
    console.log(`${RED}❌ Erros: ${errors}${RESET}`);
}
if (warnings > 0) {
    console.log(`${YELLOW}⚠️  Avisos: ${warnings}${RESET}`);
}
if (errors === 0 && warnings === 0) {
    console.log(`${GREEN}✅ Template válido! Nenhum erro encontrado.${RESET}`);
}

console.log(`\n${BLUE}════════════════════════════════════════════════════════${RESET}\n`);

// Exit code
process.exit(errors > 0 ? 1 : 0);
