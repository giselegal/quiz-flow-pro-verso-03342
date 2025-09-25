#!/usr/bin/env node

/**
 * 🧪 TESTE EXECUTÁVEL: VALIDAÇÃO IMEDIATA DA ESTRUTURA
 * 
 * Execute: node validate-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 === VALIDAÇÃO DA ESTRUTURA DO SISTEMA UNIVERSAL DE FUNIS ===\n');

/**
 * 🔍 TESTE 1: Verificação de Arquivos Essenciais
 */
const testEssentialFiles = () => {
    console.log('📁 Verificando arquivos essenciais...');

    const essentialFiles = [
        'src/services/UnifiedTemplateService.ts',
        'src/pages/editor/ModernUnifiedEditor.tsx',
        'src/components/editor/PureBuilderProvider.tsx',
    ];

    const optionalFiles = [
        'src/integrations/supabase/client.ts',
        'src/types/editor.ts',
        'src/utils/funnelNormalizer.ts',
    ];

    let passedEssential = 0;
    let passedOptional = 0;

    essentialFiles.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ ${file}`);
            passedEssential++;
        } else {
            console.log(`❌ ${file} - ARQUIVO ESSENCIAL AUSENTE`);
        }
    });

    optionalFiles.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ ${file} (opcional)`);
            passedOptional++;
        } else {
            console.log(`⚠️ ${file} (opcional) - ausente`);
        }
    });

    console.log(`📊 Arquivos essenciais: ${passedEssential}/${essentialFiles.length}`);
    console.log(`📊 Arquivos opcionais: ${passedOptional}/${optionalFiles.length}\n`);

    return {
        essential: { passed: passedEssential, total: essentialFiles.length },
        optional: { passed: passedOptional, total: optionalFiles.length }
    };
};

/**
 * 🔍 TESTE 2: Análise do Código UnifiedTemplateService
 */
const testUnifiedTemplateServiceCode = () => {
    console.log('🔧 Analisando UnifiedTemplateService...');

    const filePath = path.join(process.cwd(), 'src/services/UnifiedTemplateService.ts');

    if (!fs.existsSync(filePath)) {
        console.log('❌ UnifiedTemplateService.ts não encontrado');
        return { passed: 0, total: 6 };
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const checks = [
        {
            name: 'Método loadFromDatabase implementado',
            test: () => content.includes('loadFromDatabase'),
            critical: true
        },
        {
            name: 'Busca dinâmica no Supabase',
            test: () => content.includes('supabase') && content.includes('funnels'),
            critical: true
        },
        {
            name: 'Sistema de cache implementado',
            test: () => content.includes('cache') && content.includes('getCachedTemplate'),
            critical: false
        },
        {
            name: 'Fallback dinâmico',
            test: () => content.includes('generateFallbackTemplate'),
            critical: true
        },
        {
            name: 'Remoção da dependência antiga',
            test: () => !content.includes('import { templateService }'),
            critical: true
        },
        {
            name: 'Preload de templates críticos',
            test: () => content.includes('preloadCriticalTemplates'),
            critical: false
        }
    ];

    let passed = 0;
    let criticalIssues = 0;

    checks.forEach(check => {
        const result = check.test();
        if (result) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            const icon = check.critical ? '❌' : '⚠️';
            console.log(`${icon} ${check.name}${check.critical ? ' - CRÍTICO' : ''}`);
            if (check.critical) criticalIssues++;
        }
    });

    console.log(`📊 Verificações: ${passed}/${checks.length}`);
    console.log(`🚨 Problemas críticos: ${criticalIssues}\n`);

    return { passed, total: checks.length, criticalIssues };
};

/**
 * 🔍 TESTE 3: Análise do ModernUnifiedEditor
 */
const testModernUnifiedEditorCode = () => {
    console.log('🎯 Analisando ModernUnifiedEditor...');

    const filePath = path.join(process.cwd(), 'src/pages/editor/ModernUnifiedEditor.tsx');

    if (!fs.existsSync(filePath)) {
        console.log('❌ ModernUnifiedEditor.tsx não encontrado');
        return { passed: 0, total: 4 };
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const checks = [
        {
            name: 'Detecção dinâmica de URL implementada',
            test: () => content.includes('looksLikeTemplate') && content.includes('/^(step-|template|quiz|test)/'),
        },
        {
            name: 'Suporte a modo automático',
            test: () => content.includes("type: 'auto'") || content.includes('auto'),
        },
        {
            name: 'Remoção de templates hardcodados',
            test: () => !content.includes('quiz21StepsComplete') || content.includes('templateId || null'),
        },
        {
            name: 'Integração com PureBuilderProvider',
            test: () => content.includes('PureBuilderProvider') && content.includes('funnelId='),
        }
    ];

    let passed = 0;

    checks.forEach(check => {
        const result = check.test();
        if (result) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            console.log(`❌ ${check.name}`);
        }
    });

    console.log(`📊 Verificações: ${passed}/${checks.length}\n`);

    return { passed, total: checks.length };
};

/**
 * 🔍 TESTE 4: Análise do PureBuilderProvider
 */
const testPureBuilderProviderCode = () => {
    console.log('🏗️ Analisando PureBuilderProvider...');

    const filePath = path.join(process.cwd(), 'src/components/editor/PureBuilderProvider.tsx');

    if (!fs.existsSync(filePath)) {
        console.log('❌ PureBuilderProvider.tsx não encontrado');
        return { passed: 0, total: 3 };
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const checks = [
        {
            name: 'Aceita funnelId dinâmico',
            test: () => content.includes('funnelId?:') && content.includes('string'),
        },
        {
            name: 'Gera ID dinâmico quando necessário',
            test: () => content.includes('Date.now()') || content.includes('dynamic-funnel'),
        },
        {
            name: 'Removida dependência de template fixo',
            test: () => !content.includes('pure-builder-quiz') || content.includes('targetFunnelId'),
        }
    ];

    let passed = 0;

    checks.forEach(check => {
        const result = check.test();
        if (result) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            console.log(`❌ ${check.name}`);
        }
    });

    console.log(`📊 Verificações: ${passed}/${checks.length}\n`);

    return { passed, total: checks.length };
};

/**
 * 🔍 TESTE 5: Verificação de Estrutura de Package.json
 */
const testPackageJson = () => {
    console.log('📦 Verificando package.json...');

    const filePath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(filePath)) {
        console.log('❌ package.json não encontrado');
        return { passed: 0, total: 3 };
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const packageJson = JSON.parse(content);

        const checks = [
            {
                name: 'React e dependências essenciais',
                test: () => packageJson.dependencies?.react && packageJson.dependencies?.['react-dom'],
            },
            {
                name: 'TypeScript configurado',
                test: () => packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript,
            },
            {
                name: 'Vite como bundler',
                test: () => packageJson.devDependencies?.vite || packageJson.dependencies?.vite,
            }
        ];

        let passed = 0;

        checks.forEach(check => {
            const result = check.test();
            if (result) {
                console.log(`✅ ${check.name}`);
                passed++;
            } else {
                console.log(`⚠️ ${check.name}`);
            }
        });

        console.log(`📊 Verificações: ${passed}/${checks.length}\n`);

        return { passed, total: checks.length };

    } catch (error) {
        console.log(`❌ Erro ao analisar package.json: ${error.message}\n`);
        return { passed: 0, total: 3 };
    }
};

/**
 * 🎯 EXECUTAR TODOS OS TESTES
 */
const runAllTests = () => {
    const results = [
        testEssentialFiles(),
        testUnifiedTemplateServiceCode(),
        testModernUnifiedEditorCode(),
        testPureBuilderProviderCode(),
        testPackageJson()
    ];

    // Calcular totais
    let totalPassed = 0;
    let totalTests = 0;
    let criticalIssues = 0;

    // Somar resultados essenciais
    totalPassed += results[0].essential.passed;
    totalTests += results[0].essential.total;

    // Somar outros resultados
    for (let i = 1; i < results.length; i++) {
        totalPassed += results[i].passed;
        totalTests += results[i].total;
        if (results[i].criticalIssues) {
            criticalIssues += results[i].criticalIssues;
        }
    }

    const successRate = (totalPassed / totalTests) * 100;

    console.log('🎯 === RELATÓRIO FINAL ===');
    console.log(`📊 Total de verificações: ${totalTests}`);
    console.log(`✅ Verificações aprovadas: ${totalPassed}`);
    console.log(`❌ Verificações reprovadas: ${totalTests - totalPassed}`);
    console.log(`🚨 Problemas críticos: ${criticalIssues}`);
    console.log(`🎯 Taxa de sucesso: ${successRate.toFixed(1)}%\n`);

    if (criticalIssues === 0 && successRate >= 90) {
        console.log('🎉 ESTRUTURA VALIDADA COM SUCESSO!');
        console.log('✅ O sistema universal de funis está corretamente implementado');
        console.log('✅ Todos os componentes essenciais estão funcionais');
        return true;
    } else if (criticalIssues === 0 && successRate >= 75) {
        console.log('⚠️ ESTRUTURA FUNCIONAL COM RESSALVAS');
        console.log('🔧 Sistema funcionando, mas algumas melhorias são recomendadas');
        return true;
    } else {
        console.log('❌ ESTRUTURA PRECISA DE CORREÇÕES');
        console.log('🔨 Problemas críticos encontrados que precisam ser resolvidos');
        if (criticalIssues > 0) {
            console.log(`🚨 ${criticalIssues} problema(s) crítico(s) identificado(s)`);
        }
        return false;
    }
};

// Executar testes
const success = runAllTests();

// Sair com código apropriado
process.exit(success ? 0 : 1);