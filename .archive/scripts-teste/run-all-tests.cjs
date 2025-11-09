#!/usr/bin/env node

/**
 * 🧪 SUITE DE TESTES COMPLETA v3.0
 * Executa validação estrutural, build, tipos e gera relatório completo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};

const log = {
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`),
    section: (msg) => console.log(`${colors.bright}${colors.cyan}║ ${msg.padEnd(61)}║${colors.reset}`),
    divider: () => console.log(`${colors.cyan}╠═══════════════════════════════════════════════════════════════╣${colors.reset}`),
    end: () => console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    test: (name, passed) => {
        const icon = passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
        console.log(`  ${icon} ${name}`);
    }
};

// Resultados globais
const results = {
    structural: { passed: 0, failed: 0, warnings: 0, tests: [] },
    build: { passed: 0, failed: 0, warnings: 0, tests: [] },
    integration: { passed: 0, failed: 0, warnings: 0, tests: [] },
    startTime: Date.now()
};

// ══════════════════════════════════════════════════════════════
// TESTE 1: VALIDAÇÃO ESTRUTURAL DOS TEMPLATES
// ══════════════════════════════════════════════════════════════
function testStructuralValidation() {
    log.title();
    log.section('🔍 TESTE 1: VALIDAÇÃO ESTRUTURAL DOS TEMPLATES');
    log.end();

    const templatesDir = path.join(__dirname, 'public', 'templates');
    const steps = Array.from({ length: 21 }, (_, i) => i + 1);

    let totalSections = 0;
    const sectionTypes = new Set();
    const templateSizes = [];

    // Test 1.1: Verificar existência dos arquivos
    log.info('1.1 Verificando existência dos 21 templates v3.0...');
    let filesFound = 0;

    steps.forEach(step => {
        const fileName = `step-${String(step).padStart(2, '0')}-v3.json`;
        const filePath = path.join(templatesDir, fileName);

        if (fs.existsSync(filePath)) {
            filesFound++;
            const stats = fs.statSync(filePath);
            templateSizes.push({ step, size: stats.size });

            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                if (content.sections) {
                    totalSections += content.sections.length;
                    content.sections.forEach(section => sectionTypes.add(section.type));
                }
            } catch (error) {
                results.structural.failed++;
                results.structural.tests.push({ name: `Parse ${fileName}`, passed: false, error: error.message });
                log.error(`Erro ao parsear ${fileName}: ${error.message}`);
            }
        }
    });

    const test1Passed = filesFound === 21;
    log.test(`21 arquivos v3.0 encontrados (${filesFound}/21)`, test1Passed);
    results.structural.tests.push({ name: 'Arquivos v3.0', passed: test1Passed, count: filesFound });
    if (test1Passed) results.structural.passed++; else results.structural.failed++;

    // Test 1.2: Validar estrutura JSON
    log.info('1.2 Validando estrutura dos templates...');
    let validStructures = 0;
    const requiredFields = ['templateVersion', 'metadata', 'theme', 'sections'];

    steps.forEach(step => {
        const fileName = `step-${String(step).padStart(2, '0')}-v3.json`;
        const filePath = path.join(templatesDir, fileName);

        if (fs.existsSync(filePath)) {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hasAllFields = requiredFields.every(field => content[field] !== undefined);

            if (hasAllFields && content.templateVersion === '3.0') {
                validStructures++;
            }
        }
    });

    const test2Passed = validStructures === 21;
    log.test(`Estrutura v3.0 válida (${validStructures}/21)`, test2Passed);
    results.structural.tests.push({ name: 'Estrutura válida', passed: test2Passed, count: validStructures });
    if (test2Passed) results.structural.passed++; else results.structural.failed++;

    // Test 1.3: Contar seções e tipos
    log.info('1.3 Contando seções e tipos...');
    const test3Passed = totalSections >= 45 && sectionTypes.size >= 15;
    log.test(`${totalSections} seções, ${sectionTypes.size} tipos únicos`, test3Passed);
    results.structural.tests.push({
        name: 'Seções e tipos',
        passed: test3Passed,
        sections: totalSections,
        types: sectionTypes.size
    });
    if (test3Passed) results.structural.passed++; else results.structural.failed++;

    // Test 1.4: Verificar tamanho total
    const totalSize = templateSizes.reduce((sum, t) => sum + t.size, 0);
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    log.info(`1.4 Tamanho total dos templates: ${totalSizeKB} KB`);

    const test4Passed = totalSize > 80000; // > 80 KB
    log.test(`Tamanho adequado (${totalSizeKB} KB > 80 KB)`, test4Passed);
    results.structural.tests.push({ name: 'Tamanho total', passed: test4Passed, size: totalSizeKB });
    if (test4Passed) results.structural.passed++; else results.structural.failed++;

    console.log('');
}

// ══════════════════════════════════════════════════════════════
// TESTE 2: BUILD E COMPILAÇÃO
// ══════════════════════════════════════════════════════════════
function testBuildCompilation() {
    log.title();
    log.section('🔨 TESTE 2: BUILD E COMPILAÇÃO');
    log.end();

    // Test 2.1: TypeScript compilation
    log.info('2.1 Verificando erros TypeScript...');
    try {
        execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe', timeout: 60000 });
        log.test('TypeScript: 0 erros de tipo', true);
        results.build.passed++;
        results.build.tests.push({ name: 'TypeScript', passed: true, errors: 0 });
    } catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        const errorCount = (output.match(/error TS/g) || []).length;
        log.test(`TypeScript: ${errorCount} erros encontrados`, false);
        results.build.failed++;
        results.build.tests.push({ name: 'TypeScript', passed: false, errors: errorCount });
    }

    // Test 2.2: Verificar templates TypeScript gerados
    log.info('2.2 Verificando quiz21StepsComplete.ts...');
    const tsTemplatePath = path.join(__dirname, 'src', 'templates', 'quiz21StepsComplete.ts');

    if (fs.existsSync(tsTemplatePath)) {
        const stats = fs.statSync(tsTemplatePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        const test2Passed = stats.size > 100000; // > 100 KB

        log.test(`quiz21StepsComplete.ts existe (${sizeKB} KB)`, test2Passed);
        results.build.tests.push({ name: 'Templates TS', passed: test2Passed, size: sizeKB });
        if (test2Passed) results.build.passed++; else results.build.failed++;
    } else {
        log.test('quiz21StepsComplete.ts não encontrado', false);
        results.build.failed++;
        results.build.tests.push({ name: 'Templates TS', passed: false });
    }

    // Test 2.3: Verificar componentes de seção
    log.info('2.3 Verificando componentes de seção...');
    const sectionComponents = [
        'src/components/sections/intro/IntroHeroSection.tsx',
        'src/components/sections/intro/WelcomeFormSection.tsx',
        'src/components/sections/questions/QuestionHeroSection.tsx',
        'src/components/sections/questions/OptionsGridSection.tsx',
        'src/components/sections/transitions/TransitionHeroSection.tsx',
        'src/components/sections/offer/OfferHeroSection.tsx',
        'src/components/sections/offer/PricingSection.tsx'
    ];

    let componentsFound = 0;
    sectionComponents.forEach(comp => {
        if (fs.existsSync(path.join(__dirname, comp))) {
            componentsFound++;
        }
    });

    const test3Passed = componentsFound === sectionComponents.length;
    log.test(`${componentsFound}/${sectionComponents.length} componentes encontrados`, test3Passed);
    results.build.tests.push({ name: 'Section Components', passed: test3Passed, count: componentsFound });
    if (test3Passed) results.build.passed++; else results.build.failed++;

    console.log('');
}

// ══════════════════════════════════════════════════════════════
// TESTE 3: INTEGRAÇÃO
// ══════════════════════════════════════════════════════════════
function testIntegration() {
    log.title();
    log.section('🔗 TESTE 3: INTEGRAÇÃO');
    log.end();

    // Test 3.1: Verificar SectionRenderer
    log.info('3.1 Verificando SectionRenderer.tsx...');
    const sectionRendererPath = path.join(__dirname, 'src', 'components', 'sections', 'SectionRenderer.tsx'); if (fs.existsSync(sectionRendererPath)) {
        const content = fs.readFileSync(sectionRendererPath, 'utf-8');
        const hasLazyImports = content.includes('React.lazy');
        const hasComponentMap = content.includes('SECTION_COMPONENT_MAP');

        const newSectionTypes = [
            'intro-hero',
            'welcome-form',
            'question-hero',
            'options-grid',
            'transition-hero',
            'offer-hero',
            'pricing'
        ];

        let typesFound = 0;
        newSectionTypes.forEach(type => {
            if (content.includes(`'${type}'`) || content.includes(`"${type}"`)) {
                typesFound++;
            }
        });

        const test1Passed = hasLazyImports && hasComponentMap && typesFound >= 6;
        log.test(`SectionRenderer integrado (${typesFound}/7 tipos)`, test1Passed);
        results.integration.tests.push({ name: 'SectionRenderer', passed: test1Passed, types: typesFound });
        if (test1Passed) results.integration.passed++; else results.integration.failed++;
    } else {
        log.test('SectionRenderer.tsx não encontrado', false);
        results.integration.failed++;
    }

    // Test 3.2: Verificar design tokens
    log.info('3.2 Verificando design-tokens.ts...');
    const designTokensPath = path.join(__dirname, 'src', 'styles', 'design-tokens.ts');

    if (fs.existsSync(designTokensPath)) {
        const content = fs.readFileSync(designTokensPath, 'utf-8');
        const hasColors = content.includes('colors:');
        const hasFonts = content.includes('fonts:');
        const hasSpacing = content.includes('spacing:');

        const test2Passed = hasColors && hasFonts && hasSpacing;
        log.test('Design tokens definidos (colors, fonts, spacing)', test2Passed);
        results.integration.tests.push({ name: 'Design Tokens', passed: test2Passed });
        if (test2Passed) results.integration.passed++; else results.integration.failed++;
    } else {
        log.test('design-tokens.ts não encontrado', false);
        results.integration.failed++;
    }

    // Test 3.3: Verificar tipos de seção
    log.info('3.3 Verificando section-types.ts...');
    const sectionTypesPath = path.join(__dirname, 'src', 'types', 'section-types.ts');

    if (fs.existsSync(sectionTypesPath)) {
        const content = fs.readFileSync(sectionTypesPath, 'utf-8');
        const hasBaseSectionProps = content.includes('BaseSectionProps');
        const hasSectionStyle = content.includes('SectionStyle');
        const hasSectionAnimation = content.includes('SectionAnimation');

        const test3Passed = hasBaseSectionProps && hasSectionStyle && hasSectionAnimation;
        log.test('Tipos de seção definidos (Base, Style, Animation)', test3Passed);
        results.integration.tests.push({ name: 'Section Types', passed: test3Passed });
        if (test3Passed) results.integration.passed++; else results.integration.failed++;
    } else {
        log.test('section-types.ts não encontrado', false);
        results.integration.failed++;
    }

    console.log('');
}

// ══════════════════════════════════════════════════════════════
// RELATÓRIO FINAL
// ══════════════════════════════════════════════════════════════
function generateReport() {
    const totalTests =
        results.structural.passed + results.structural.failed +
        results.build.passed + results.build.failed +
        results.integration.passed + results.integration.failed;

    const totalPassed =
        results.structural.passed + results.build.passed + results.integration.passed;

    const totalFailed =
        results.structural.failed + results.build.failed + results.integration.failed;

    const successRate = ((totalPassed / totalTests) * 100).toFixed(1);
    const duration = ((Date.now() - results.startTime) / 1000).toFixed(2);

    log.title();
    log.section('📊 RELATÓRIO FINAL DOS TESTES');
    log.end();

    console.log(`${colors.bright}╭─────────────────────────────────────────────────────────────╮${colors.reset}`);
    console.log(`│  ${colors.bright}Total de Testes:${colors.reset}      ${String(totalTests).padStart(3)} testes                        │`);
    console.log(`│  ${colors.green}✅ Aprovados:${colors.reset}         ${String(totalPassed).padStart(3)} (${successRate}%)${' '.repeat(28 - successRate.length)} │`);
    console.log(`│  ${colors.red}❌ Falharam:${colors.reset}          ${String(totalFailed).padStart(3)} (${(100 - successRate).toFixed(1)}%)${' '.repeat(28 - (100 - parseFloat(successRate)).toFixed(1).length)} │`);
    console.log(`│  ${colors.yellow}⚠️  Avisos:${colors.reset}           ${String(results.structural.warnings + results.build.warnings + results.integration.warnings).padStart(3)}                                 │`);
    console.log(`│  ${colors.blue}⏱️  Duração:${colors.reset}           ${duration}s${' '.repeat(32 - duration.length)} │`);
    console.log(`╰─────────────────────────────────────────────────────────────╯\n`);

    console.log(`${colors.bright}Detalhamento por Categoria:${colors.reset}\n`);

    console.log(`  ${colors.cyan}🔍 Estrutural:${colors.reset}`);
    console.log(`     ✓ ${results.structural.passed} aprovados | ✗ ${results.structural.failed} falharam\n`);

    console.log(`  ${colors.cyan}🔨 Build:${colors.reset}`);
    console.log(`     ✓ ${results.build.passed} aprovados | ✗ ${results.build.failed} falharam\n`);

    console.log(`  ${colors.cyan}🔗 Integração:${colors.reset}`);
    console.log(`     ✓ ${results.integration.passed} aprovados | ✗ ${results.integration.failed} falharam\n`);

    // Status final
    if (totalFailed === 0) {
        console.log(`${colors.bgGreen}${colors.bright}                                                                 ${colors.reset}`);
        console.log(`${colors.bgGreen}${colors.bright}  🎉 TODOS OS TESTES PASSARAM! Sistema pronto para produção!    ${colors.reset}`);
        console.log(`${colors.bgGreen}${colors.bright}                                                                 ${colors.reset}\n`);
        return 0;
    } else if (totalFailed <= 2) {
        console.log(`${colors.bgYellow}${colors.bright}                                                                 ${colors.reset}`);
        console.log(`${colors.bgYellow}${colors.bright}  ⚠️  ALGUNS TESTES FALHARAM - Verificar antes de continuar    ${colors.reset}`);
        console.log(`${colors.bgYellow}${colors.bright}                                                                 ${colors.reset}\n`);
        return 1;
    } else {
        console.log(`${colors.bgRed}${colors.bright}                                                                 ${colors.reset}`);
        console.log(`${colors.bgRed}${colors.bright}  ❌ VÁRIOS TESTES FALHARAM - Correções necessárias             ${colors.reset}`);
        console.log(`${colors.bgRed}${colors.bright}                                                                 ${colors.reset}\n`);
        return 2;
    }
}

// ══════════════════════════════════════════════════════════════
// EXECUÇÃO PRINCIPAL
// ══════════════════════════════════════════════════════════════
console.log(`\n${colors.bright}${colors.magenta}
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🧪 SUITE DE TESTES COMPLETA v3.0                ║
║         Validação Estrutural + Build + Integração            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

try {
    testStructuralValidation();
    testBuildCompilation();
    testIntegration();

    const exitCode = generateReport();

    // Salvar relatório JSON
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log.info(`Relatório salvo em: ${reportPath}`);

    process.exit(exitCode);
} catch (error) {
    log.error(`Erro fatal na execução dos testes: ${error.message}`);
    console.error(error.stack);
    process.exit(3);
}
