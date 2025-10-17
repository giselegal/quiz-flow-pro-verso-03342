#!/usr/bin/env node

/**
 * 🧪 TESTE DE ATUALIZAÇÃO DE TEMPLATES
 * 
 * Verifica se o template quiz21StepsComplete foi atualizado corretamente
 * com os atomic blocks nos Steps 12, 19 e 20.
 * 
 * Uso: node scripts/test-template-updates.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// ============================================================================
// CONFIGURAÇÃO DOS TESTES
// ============================================================================

const TESTS_CONFIG = {
    templateId: 'quiz21StepsComplete',
    criticalSteps: ['step-12', 'step-19', 'step-20'],
    
    expectedBlocks: {
        'step-12': ['transition-title', 'transition-loader', 'transition-progress', 'transition-message'],
        'step-19': ['transition-title', 'transition-loader', 'transition-progress', 'transition-message'],
        'step-20': ['result-main', 'result-style', 'result-cta-primary']
    },
    
    deprecatedComponents: [
        'src/components/quiz/TransitionStep.tsx',
        'src/components/quiz/ResultStep.tsx'
    ],
    
    newComponents: [
        'src/hooks/useResultCalculations.ts',
        'src/contexts/ResultContext.tsx',
        'src/components/editor/blocks/atomic/TransitionTitleBlock.tsx',
        'src/components/editor/blocks/atomic/ResultMainBlock.tsx',
        'src/components/step-registry/ProductionStepsRegistry.tsx'
    ]
};

// ============================================================================
// UTILIDADES
// ============================================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function testResult(name, condition, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`✅ ${name}`);
        if (details) console.log(`   ${details}`);
    } else {
        failedTests++;
        console.log(`❌ ${name}`);
        if (details) console.log(`   ${details}`);
        failures.push({ test: name, details });
    }
}

function loadTemplate() {
    try {
        const templatePath = join(ROOT_DIR, 'src/templates/quiz21StepsComplete.ts');
        if (!existsSync(templatePath)) {
            console.error('❌ Template não encontrado:', templatePath);
            return null;
        }
        
        const content = readFileSync(templatePath, 'utf-8');
        return content;
    } catch (error) {
        console.error('❌ Erro ao carregar template:', error.message);
        return null;
    }
}

function loadJSONTemplate(stepId) {
    try {
        const templatePath = join(ROOT_DIR, `src/config/templates/${stepId}.json`);
        if (!existsSync(templatePath)) {
            return null;
        }
        
        const content = readFileSync(templatePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

function fileExists(relativePath) {
    const fullPath = join(ROOT_DIR, relativePath);
    return existsSync(fullPath);
}

function readFile(relativePath) {
    try {
        const fullPath = join(ROOT_DIR, relativePath);
        return readFileSync(fullPath, 'utf-8');
    } catch {
        return null;
    }
}

// ============================================================================
// TESTES: ESTRUTURA DO TEMPLATE
// ============================================================================

console.log('\n📦 TESTE 1: ESTRUTURA DO TEMPLATE\n');

const templateContent = loadTemplate();
testResult(
    'Template quiz21StepsComplete existe',
    templateContent !== null,
    'Arquivo: src/templates/quiz21StepsComplete.ts'
);

if (templateContent) {
    testResult(
        'Template exporta QUIZ_STYLE_21_STEPS_TEMPLATE',
        templateContent.includes('export const QUIZ_STYLE_21_STEPS_TEMPLATE'),
        'Export principal encontrado'
    );
    
    TESTS_CONFIG.criticalSteps.forEach(stepId => {
        testResult(
            `Template contém definição para ${stepId}`,
            templateContent.includes(`'${stepId}'`) || templateContent.includes(`"${stepId}"`),
            `Step ${stepId} presente no template`
        );
    });
}

// ============================================================================
// TESTES: TEMPLATES JSON INDIVIDUAIS
// ============================================================================

console.log('\n📄 TESTE 2: TEMPLATES JSON DOS STEPS CRÍTICOS\n');

TESTS_CONFIG.criticalSteps.forEach(stepId => {
    const jsonTemplate = loadJSONTemplate(stepId);
    
    testResult(
        `Template JSON ${stepId}.json existe`,
        jsonTemplate !== null,
        `Arquivo: src/config/templates/${stepId}.json`
    );
    
    if (jsonTemplate) {
        testResult(
            `${stepId}.json tem propriedade blocks`,
            Array.isArray(jsonTemplate.blocks),
            `Blocks array: ${jsonTemplate.blocks?.length || 0} blocos`
        );
        
        if (jsonTemplate.blocks) {
            const expectedBlockTypes = TESTS_CONFIG.expectedBlocks[stepId];
            const foundBlockTypes = jsonTemplate.blocks.map(b => b.type);
            
            expectedBlockTypes.forEach(expectedType => {
                const found = foundBlockTypes.some(type => type.includes(expectedType));
                testResult(
                    `${stepId} contém bloco tipo "${expectedType}"`,
                    found,
                    `Blocos encontrados: ${foundBlockTypes.join(', ')}`
                );
            });
        }
    }
});

// ============================================================================
// TESTES: COMPONENTES DEPRECADOS
// ============================================================================

console.log('\n⚠️  TESTE 3: COMPONENTES LEGADOS DEPRECADOS\n');

TESTS_CONFIG.deprecatedComponents.forEach(componentPath => {
    const content = readFile(componentPath);
    
    testResult(
        `${componentPath.split('/').pop()} existe`,
        content !== null,
        'Componente legado mantido para compatibilidade'
    );
    
    if (content) {
        testResult(
            `${componentPath.split('/').pop()} tem tag @deprecated`,
            content.includes('@deprecated'),
            'Tag de deprecação presente'
        );
        
        testResult(
            `${componentPath.split('/').pop()} tem warning de console`,
            content.includes('console.warn') && content.includes('COMPONENTE LEGADO'),
            'Warning de desenvolvimento presente'
        );
        
        testResult(
            `${componentPath.split('/').pop()} referencia documentação`,
            content.includes('ANALISE_ACOPLAMENTO') || content.includes('LOGICA_CALCULOS'),
            'Referências de documentação presentes'
        );
    }
});

// ============================================================================
// TESTES: NOVOS COMPONENTES CRIADOS
// ============================================================================

console.log('\n✨ TESTE 4: NOVOS COMPONENTES MODULARES\n');

TESTS_CONFIG.newComponents.forEach(componentPath => {
    testResult(
        `${componentPath.split('/').pop()} existe`,
        fileExists(componentPath),
        componentPath
    );
});

// Testes específicos para componentes críticos
const useResultCalculationsContent = readFile('src/hooks/useResultCalculations.ts');
if (useResultCalculationsContent) {
    testResult(
        'useResultCalculations exporta hook',
        useResultCalculationsContent.includes('export') && useResultCalculationsContent.includes('useResultCalculations'),
        'Hook exportado corretamente'
    );
    
    testResult(
        'useResultCalculations tem lógica de cálculo',
        useResultCalculationsContent.includes('topStyles') && useResultCalculationsContent.includes('confidence'),
        'Lógica de cálculo presente'
    );
    
    testResult(
        'useResultCalculations usa useMemo',
        useResultCalculationsContent.includes('useMemo'),
        'Otimização com memoization'
    );
}

const resultContextContent = readFile('src/contexts/ResultContext.tsx');
if (resultContextContent) {
    testResult(
        'ResultContext exporta Provider',
        resultContextContent.includes('ResultProvider'),
        'Provider component presente'
    );
    
    testResult(
        'ResultContext exporta hook useResult',
        resultContextContent.includes('useResult'),
        'Hook de consumo presente'
    );
    
    testResult(
        'ResultContext usa useResultCalculations',
        resultContextContent.includes('useResultCalculations'),
        'Integração com hook de cálculos'
    );
}

// ============================================================================
// TESTES: REGISTRY E ADAPTERS
// ============================================================================

console.log('\n🔧 TESTE 5: PRODUCTION STEPS REGISTRY\n');

const registryContent = readFile('src/components/step-registry/ProductionStepsRegistry.tsx');
if (registryContent) {
    testResult(
        'Registry tem TransitionStepAdapter',
        registryContent.includes('TransitionStepAdapter'),
        'Adapter de transição presente'
    );
    
    testResult(
        'Registry tem ResultStepAdapter',
        registryContent.includes('ResultStepAdapter'),
        'Adapter de resultado presente'
    );
    
    testResult(
        'TransitionStepAdapter carrega template',
        registryContent.includes('loadTemplate') && registryContent.includes('step-12'),
        'Carregamento de template implementado'
    );
    
    testResult(
        'ResultStepAdapter usa ResultProvider',
        registryContent.includes('ResultProvider'),
        'Integração com context implementada'
    );
    
    testResult(
        'Adapters usam UniversalBlockRenderer',
        registryContent.includes('UniversalBlockRenderer'),
        'Renderização de atomic blocks implementada'
    );
    
    testResult(
        'Adapters têm fallback para componentes legados',
        registryContent.includes('OriginalTransitionStep') || registryContent.includes('StyleResultCard'),
        'Fallback para compatibilidade presente'
    );
}

// ============================================================================
// TESTES: ENHANCED BLOCK REGISTRY
// ============================================================================

console.log('\n📚 TESTE 6: ENHANCED BLOCK REGISTRY\n');

const blockRegistryContent = readFile('src/components/editor/blocks/EnhancedBlockRegistry.tsx');
if (blockRegistryContent) {
    testResult(
        'Registry tem seção LEGACY_REGISTRY',
        blockRegistryContent.includes('LEGACY_REGISTRY'),
        'Seção de componentes legados criada'
    );
    
    testResult(
        'Registry exporta LEGACY_TRANSITION_STEP',
        blockRegistryContent.includes('LEGACY_TRANSITION_STEP'),
        'Componente legado exportado'
    );
    
    testResult(
        'Registry exporta LEGACY_RESULT_STEP',
        blockRegistryContent.includes('LEGACY_RESULT_STEP'),
        'Componente legado exportado'
    );
    
    testResult(
        'Registry documenta deprecação',
        blockRegistryContent.includes('@deprecated'),
        'Documentação de deprecação presente'
    );
}

// ============================================================================
// TESTES: FUNNELS CONTEXT
// ============================================================================

console.log('\n🔄 TESTE 7: FUNNELS CONTEXT (DESACOPLAMENTO)\n');

const funnelsContextContent = readFile('src/contexts/funnel/FunnelsContext.tsx');
if (funnelsContextContent) {
    testResult(
        'FunnelsContext tem função inferStepTypeFromTemplate',
        funnelsContextContent.includes('inferStepTypeFromTemplate'),
        'Função de inferência de tipo criada'
    );
    
    testResult(
        'FunnelsContext NÃO usa hardcode stepNumber === 12',
        !funnelsContextContent.match(/stepNumber\s*===\s*12\s*\?.*transition/),
        'Lógica hardcoded removida'
    );
    
    testResult(
        'FunnelsContext NÃO usa hardcode stepNumber === 19',
        !funnelsContextContent.match(/stepNumber\s*===\s*19\s*\?.*transition/),
        'Lógica hardcoded removida'
    );
    
    testResult(
        'FunnelsContext NÃO usa hardcode stepNumber === 20',
        !funnelsContextContent.match(/stepNumber\s*===\s*20\s*\?.*result/),
        'Lógica hardcoded removida'
    );
    
    testResult(
        'inferStepTypeFromTemplate analisa blocks do template',
        funnelsContextContent.includes('blockTypes') && funnelsContextContent.includes('startsWith'),
        'Inferência baseada em tipos de blocos'
    );
}

// ============================================================================
// TESTES: ATOMIC BLOCKS RESULT
// ============================================================================

console.log('\n🧩 TESTE 8: ATOMIC BLOCKS DE RESULTADO\n');

const resultBlocks = [
    'ResultMainBlock.tsx',
    'ResultStyleBlock.tsx',
    'ResultCTAPrimaryBlock.tsx',
    'ResultCTASecondaryBlock.tsx'
];

resultBlocks.forEach(blockName => {
    const blockPath = `src/components/editor/blocks/atomic/${blockName}`;
    const content = readFile(blockPath);
    
    testResult(
        `${blockName} existe`,
        content !== null,
        blockPath
    );
    
    if (content) {
        testResult(
            `${blockName} usa useResult hook`,
            content.includes('useResult'),
            'Consome ResultContext'
        );
        
        testResult(
            `${blockName} tem tratamento de erro (try/catch)`,
            content.includes('try') && content.includes('catch'),
            'Dual mode: editor vs runtime'
        );
    }
});

// ============================================================================
// TESTES: ATOMIC BLOCKS TRANSITION
// ============================================================================

console.log('\n🔄 TESTE 9: ATOMIC BLOCKS DE TRANSIÇÃO\n');

const transitionBlocks = [
    'TransitionTitleBlock.tsx',
    'TransitionLoaderBlock.tsx',
    'TransitionProgressBlock.tsx',
    'TransitionMessageBlock.tsx'
];

transitionBlocks.forEach(blockName => {
    const blockPath = `src/components/editor/blocks/atomic/${blockName}`;
    
    testResult(
        `${blockName} existe`,
        fileExists(blockPath),
        blockPath
    );
});

// ============================================================================
// TESTES: DOCUMENTAÇÃO
// ============================================================================

console.log('\n📖 TESTE 10: DOCUMENTAÇÃO ATUALIZADA\n');

const docFiles = [
    'ANALISE_ACOPLAMENTO_STEPS_12_19_20.md',
    'LOGICA_CALCULOS_RESULTADOS.md',
    'PLANO_ACAO_DESACOPLAMENTO.md',
    'TESTE_STEPS_12_19_20.md'
];

docFiles.forEach(docFile => {
    testResult(
        `${docFile} existe`,
        fileExists(docFile),
        'Documentação de migração presente'
    );
});

// ============================================================================
// TESTES: IMPORTS E EXPORTS
// ============================================================================

console.log('\n📦 TESTE 11: IMPORTS E EXPORTS\n');

const importsContent = readFile('src/templates/imports.ts');
if (importsContent) {
    testResult(
        'imports.ts tem função loadTemplate',
        importsContent.includes('loadTemplate'),
        'Função de carregamento centralizada'
    );
    
    testResult(
        'loadTemplate suporta step-12',
        importsContent.includes('step-12'),
        'Step 12 mapeado'
    );
    
    testResult(
        'loadTemplate suporta step-19',
        importsContent.includes('step-19'),
        'Step 19 mapeado'
    );
    
    testResult(
        'loadTemplate suporta step-20',
        importsContent.includes('step-20'),
        'Step 20 mapeado'
    );
}

// ============================================================================
// RESUMO FINAL
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📊 RESUMO FINAL DOS TESTES');
console.log('='.repeat(80));
console.log(`\n✅ Testes Aprovados: ${passedTests}/${totalTests}`);
console.log(`❌ Testes Reprovados: ${failedTests}/${totalTests}`);
console.log(`📈 Taxa de Sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (failedTests > 0) {
    console.log('❌ FALHAS DETALHADAS:\n');
    failures.forEach(({ test, details }, index) => {
        console.log(`${index + 1}. ${test}`);
        if (details) console.log(`   → ${details}`);
    });
    console.log();
}

// ============================================================================
// CRITÉRIOS DE APROVAÇÃO
// ============================================================================

console.log('🎯 CRITÉRIOS DE APROVAÇÃO:\n');

const criteria = [
    { name: 'Templates JSON existem e têm blocos', met: passedTests >= totalTests * 0.8 },
    { name: 'Componentes legados deprecados', met: failedTests === 0 || failedTests <= 2 },
    { name: 'Novos componentes implementados', met: fileExists('src/hooks/useResultCalculations.ts') && fileExists('src/contexts/ResultContext.tsx') },
    { name: 'Adapters atualizados', met: registryContent?.includes('UniversalBlockRenderer') },
    { name: 'Desacoplamento completo', met: funnelsContextContent?.includes('inferStepTypeFromTemplate') }
];

criteria.forEach(({ name, met }) => {
    console.log(`${met ? '✅' : '❌'} ${name}`);
});

const allCriteriaMet = criteria.every(c => c.met);

console.log('\n' + '='.repeat(80));
if (allCriteriaMet && failedTests === 0) {
    console.log('🎉 TODOS OS TESTES PASSARAM! MIGRAÇÃO COMPLETA E VALIDADA! 🎉');
    console.log('='.repeat(80));
    console.log('\n✅ O template quiz21StepsComplete foi atualizado com sucesso!');
    console.log('✅ Steps 12, 19, 20 agora usam atomic blocks modulares!');
    console.log('✅ Componentes legados deprecados e documentados!');
    console.log('✅ Lógica hardcoded removida do FunnelsContext!');
    console.log('\n🚀 Próximo passo: Testar no navegador em /editor?template=quiz21StepsComplete\n');
    process.exit(0);
} else if (failedTests <= 5 && passedTests >= totalTests * 0.8) {
    console.log('⚠️  MIGRAÇÃO PARCIALMENTE COMPLETA - ATENÇÃO NECESSÁRIA');
    console.log('='.repeat(80));
    console.log('\n⚠️  Alguns testes falharam, mas a estrutura principal está OK.');
    console.log('⚠️  Revise as falhas acima antes de prosseguir.\n');
    process.exit(1);
} else {
    console.log('❌ MIGRAÇÃO INCOMPLETA - CORREÇÕES NECESSÁRIAS');
    console.log('='.repeat(80));
    console.log('\n❌ Muitos testes falharam. Revise as implementações.');
    console.log('❌ Consulte a documentação e os logs acima.\n');
    process.exit(2);
}
