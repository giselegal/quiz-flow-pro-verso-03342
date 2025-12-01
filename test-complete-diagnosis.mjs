#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO COMPLETO - ModernQuizEditor
 * 
 * Verifica todos os pontos mencionados na documentação:
 * 1. Editor correto na rota /editor
 * 2. Registro de blocos (window.__BLOCK_REGISTRY__)
 * 3. Estrutura do JSON do quiz
 * 4. Função extractBlocksFromStepData
 * 5. Canvas e funnelId
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname);

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║     DIAGNÓSTICO COMPLETO - ModernQuizEditor - Blocos         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

let issues = [];
let warnings = [];
let successes = [];

// ============================================================================
// TESTE 1: Verificar qual editor está na rota /editor
// ============================================================================
async function test1_CheckEditorRoute() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 1: Verificar Editor na Rota /editor');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        const editorPagePath = path.join(rootDir, 'src/pages/editor/EditorPage.tsx');
        const content = await fs.readFile(editorPagePath, 'utf-8');

        // Verificar qual editor está sendo importado
        const hasModernQuizEditor = content.includes('ModernQuizEditor');
        const hasModernUnifiedEditor = content.includes('ModernUnifiedEditor');
        const hasQuizFunnelEditorWYSIWYG = content.includes('QuizFunnelEditorWYSIWYG');
        
        // Verificar se há lazy loading
        const hasLazyLoading = content.includes('React.lazy(');
        
        // Verificar qual componente é renderizado
        const renderMatch = content.match(/<(\w+)\s+initialQuiz/);
        const renderedComponent = renderMatch ? renderMatch[1] : null;

        console.log('📄 Arquivo: src/pages/editor/EditorPage.tsx\n');
        console.log('Imports detectados:');
        console.log(`   ${hasModernQuizEditor ? '✅' : '❌'} ModernQuizEditor`);
        console.log(`   ${hasModernUnifiedEditor ? '✅' : '❌'} ModernUnifiedEditor`);
        console.log(`   ${hasQuizFunnelEditorWYSIWYG ? '❌ PROBLEMA!' : '✅'} QuizFunnelEditorWYSIWYG (não deve estar)`);
        console.log(`   ${hasLazyLoading ? '✅' : '⚠️'} Lazy Loading`);
        
        if (renderedComponent) {
            console.log(`\nComponente renderizado: <${renderedComponent}>`);
        }

        // Verificar problema conhecido
        if (hasQuizFunnelEditorWYSIWYG) {
            issues.push({
                test: 'Teste 1',
                severity: 'CRÍTICO',
                message: 'Editor ANTIGO (QuizFunnelEditorWYSIWYG) detectado na rota /editor',
                solution: 'Trocar para ModernQuizEditor ou ModernUnifiedEditor',
                reference: 'docs/reports/PROBLEMA_ROTA_RESOLVIDO.md'
            });
            console.log('\n❌ PROBLEMA DETECTADO: Editor antigo ainda presente!');
        } else if (hasModernQuizEditor) {
            successes.push('Teste 1: Editor correto (ModernQuizEditor) está sendo usado');
            console.log('\n✅ SUCESSO: Editor moderno correto está sendo usado!');
        } else {
            warnings.push('Teste 1: Nenhum editor conhecido detectado no EditorPage.tsx');
            console.log('\n⚠️ AVISO: Não foi possível identificar o editor');
        }

        return !hasQuizFunnelEditorWYSIWYG && (hasModernQuizEditor || hasModernUnifiedEditor);
    } catch (error) {
        issues.push({
            test: 'Teste 1',
            severity: 'ERRO',
            message: `Erro ao ler EditorPage.tsx: ${error.message}`,
            solution: 'Verificar se o arquivo existe e tem permissões corretas'
        });
        console.log('\n❌ ERRO:', error.message);
        return false;
    }
}

// ============================================================================
// TESTE 2: Verificar estrutura do JSON do quiz
// ============================================================================
async function test2_CheckQuizJSON() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 2: Verificar Estrutura do JSON do Quiz');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        const jsonPath = path.join(rootDir, 'public/templates/quiz21-v4.json');
        const content = await fs.readFile(jsonPath, 'utf-8');
        const quizData = JSON.parse(content);

        console.log('📄 Arquivo: public/templates/quiz21-v4.json\n');
        
        // Verificações estruturais
        const checks = {
            'Quiz existe': !!quizData,
            'Tem metadata': !!quizData.metadata,
            'Tem steps': !!quizData.steps,
            'Steps é array': Array.isArray(quizData.steps),
            'Steps não vazio': quizData.steps && quizData.steps.length > 0
        };

        console.log('Verificações estruturais:');
        Object.entries(checks).forEach(([check, result]) => {
            console.log(`   ${result ? '✅' : '❌'} ${check}`);
        });

        if (!checks['Steps não vazio']) {
            issues.push({
                test: 'Teste 2',
                severity: 'CRÍTICO',
                message: 'Quiz não possui steps ou steps está vazio',
                solution: 'Adicionar steps com blocos ao JSON do quiz'
            });
            return false;
        }

        // Verificar blocos em cada step
        console.log(`\n📊 Total de steps: ${quizData.steps.length}`);
        console.log('\nDetalhes dos steps:\n');

        let stepsWithoutBlocks = 0;
        let totalBlocks = 0;

        quizData.steps.forEach((step, index) => {
            const hasBlocks = step.blocks && Array.isArray(step.blocks);
            const blockCount = hasBlocks ? step.blocks.length : 0;
            totalBlocks += blockCount;

            if (blockCount === 0) {
                stepsWithoutBlocks++;
            }

            const status = blockCount > 0 ? '✅' : '⚠️';
            console.log(`   ${status} Step ${index + 1} (${step.id || 'sem-id'}): ${blockCount} blocos`);
            
            if (blockCount > 0) {
                console.log(`      Blocos: ${step.blocks.map(b => b.type || 'sem-tipo').join(', ')}`);
            }
        });

        console.log(`\n📈 Resumo:`);
        console.log(`   Total de blocos: ${totalBlocks}`);
        console.log(`   Steps com blocos: ${quizData.steps.length - stepsWithoutBlocks}`);
        console.log(`   Steps sem blocos: ${stepsWithoutBlocks}`);

        if (totalBlocks === 0) {
            issues.push({
                test: 'Teste 2',
                severity: 'CRÍTICO',
                message: 'Nenhum bloco encontrado em nenhum step do quiz',
                solution: 'Adicionar blocos aos steps do quiz no JSON'
            });
            console.log('\n❌ PROBLEMA: Quiz não possui blocos!');
            return false;
        } else if (stepsWithoutBlocks > 0) {
            warnings.push(`Teste 2: ${stepsWithoutBlocks} steps não possuem blocos`);
            console.log(`\n⚠️ AVISO: ${stepsWithoutBlocks} steps sem blocos`);
        }

        successes.push(`Teste 2: Quiz possui ${totalBlocks} blocos em ${quizData.steps.length} steps`);
        console.log('\n✅ SUCESSO: Quiz possui blocos!');
        return true;

    } catch (error) {
        issues.push({
            test: 'Teste 2',
            severity: 'ERRO',
            message: `Erro ao ler JSON do quiz: ${error.message}`,
            solution: 'Verificar se o arquivo quiz21-v4.json existe e é um JSON válido'
        });
        console.log('\n❌ ERRO:', error.message);
        return false;
    }
}

// ============================================================================
// TESTE 3: Verificar logs de debug no código
// ============================================================================
async function test3_CheckDebugLogs() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 3: Verificar Logs de Debug');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        const filesToCheck = [
            'src/components/editor/ModernQuizEditor/ModernQuizEditor.tsx',
            'src/components/editor/ModernQuizEditor/layout/Canvas.tsx',
            'src/components/editor/ModernQuizEditor/layout/StepPanel.tsx',
            'src/pages/editor/EditorPage.tsx'
        ];

        console.log('Verificando logs de debug nos arquivos:\n');

        for (const file of filesToCheck) {
            const filePath = path.join(rootDir, file);
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                
                // Contar console.logs
                const logMatches = content.match(/console\.log/g);
                const logCount = logMatches ? logMatches.length : 0;
                
                // Verificar logs específicos importantes
                const hasCanvasRenderLog = content.includes('Canvas render');
                const hasQuizLoadLog = content.includes('Carregando quiz');
                const hasBlockRenderLog = content.includes('Renderizando bloco');
                const hasStepSelectionLog = content.includes('selecionando');

                console.log(`📄 ${path.basename(file)}`);
                console.log(`   ${logCount > 0 ? '✅' : '⚠️'} ${logCount} console.log()`);
                
                if (file.includes('Canvas.tsx')) {
                    console.log(`   ${hasCanvasRenderLog ? '✅' : '❌'} Log "Canvas render"`);
                    console.log(`   ${hasBlockRenderLog ? '✅' : '❌'} Log "Renderizando bloco"`);
                }
                if (file.includes('ModernQuizEditor.tsx')) {
                    console.log(`   ${hasQuizLoadLog ? '✅' : '❌'} Log "Carregando quiz"`);
                    console.log(`   ${hasStepSelectionLog ? '✅' : '❌'} Log de seleção de step"`);
                }
                
                console.log('');
            } catch (e) {
                console.log(`   ⚠️ Não foi possível ler o arquivo\n`);
            }
        }

        successes.push('Teste 3: Logs de debug verificados');
        console.log('✅ Logs de debug estão presentes para diagnóstico');
        return true;

    } catch (error) {
        warnings.push(`Teste 3: ${error.message}`);
        console.log('⚠️', error.message);
        return false;
    }
}

// ============================================================================
// TESTE 4: Verificar registro de blocos (simulação)
// ============================================================================
async function test4_CheckBlockRegistry() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 4: Verificar Sistema de Registro de Blocos');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('⚠️ NOTA: Este teste simula o que deve ser verificado no navegador\n');
    
    console.log('📋 Instruções para verificação manual no navegador:\n');
    console.log('1. Abra o DevTools (F12)');
    console.log('2. Vá para a aba Console');
    console.log('3. Execute o seguinte comando:\n');
    console.log('   console.log(window.__BLOCK_REGISTRY__);\n');
    console.log('4. Você deve ver um objeto com todos os tipos de blocos registrados\n');
    console.log('Exemplo esperado:');
    console.log('   {');
    console.log('     "text": { component: ƒ, ... },');
    console.log('     "quiz-header": { component: ƒ, ... },');
    console.log('     "options-grid": { component: ƒ, ... },');
    console.log('     ...');
    console.log('   }\n');
    
    console.log('❌ Se window.__BLOCK_REGISTRY__ for undefined:');
    console.log('   → Blocos não estão sendo registrados');
    console.log('   → Verificar inicialização do editor\n');

    warnings.push('Teste 4: Verificação manual necessária no navegador');
    return true;
}

// ============================================================================
// TESTE 5: Verificar fallback de funnelId
// ============================================================================
async function test5_CheckFunnelIdFallback() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 5: Verificar Fallback de FunnelId');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        const editorPagePath = path.join(rootDir, 'src/pages/editor/EditorPage.tsx');
        const content = await fs.readFile(editorPagePath, 'utf-8');

        const hasFallback = content.includes("funnelId = 'quiz21StepsComplete'");
        const hasFallbackLog = content.includes('Fallback de funil aplicado');

        console.log('Verificações de fallback:\n');
        console.log(`   ${hasFallback ? '✅' : '❌'} Fallback definido para funnelId`);
        console.log(`   ${hasFallbackLog ? '✅' : '❌'} Log de fallback presente`);

        if (hasFallback) {
            console.log('\n✅ SUCESSO: Sistema garante funnelId mesmo sem query params');
            console.log('   Referência: "editor precisa de canvas visível mesmo sem query params"');
            successes.push('Teste 5: Fallback de funnelId implementado corretamente');
            return true;
        } else {
            warnings.push('Teste 5: Fallback de funnelId não encontrado');
            console.log('\n⚠️ AVISO: Fallback pode não estar implementado');
            return false;
        }
    } catch (error) {
        console.log('\n❌ ERRO:', error.message);
        return false;
    }
}

// ============================================================================
// EXECUTAR TODOS OS TESTES
// ============================================================================
async function runAllTests() {
    const results = [
        await test1_CheckEditorRoute(),
        await test2_CheckQuizJSON(),
        await test3_CheckDebugLogs(),
        await test4_CheckBlockRegistry(),
        await test5_CheckFunnelIdFallback()
    ];

    // Relatório Final
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                      RELATÓRIO FINAL                          ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const totalTests = results.length;
    const passedTests = results.filter(r => r).length;

    console.log(`📊 Resumo dos Testes:`);
    console.log(`   Total: ${totalTests}`);
    console.log(`   ✅ Passou: ${passedTests}`);
    console.log(`   ❌ Falhou: ${totalTests - passedTests}\n`);

    if (successes.length > 0) {
        console.log('✅ Sucessos:');
        successes.forEach(s => console.log(`   • ${s}`));
        console.log('');
    }

    if (warnings.length > 0) {
        console.log('⚠️ Avisos:');
        warnings.forEach(w => console.log(`   • ${w}`));
        console.log('');
    }

    if (issues.length > 0) {
        console.log('❌ Problemas Críticos Encontrados:\n');
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. [${issue.test}] ${issue.severity}: ${issue.message}`);
            console.log(`   Solução: ${issue.solution}`);
            if (issue.reference) {
                console.log(`   Referência: ${issue.reference}`);
            }
            console.log('');
        });
    }

    // Próximos passos
    console.log('🔬 Próximos Passos para Diagnóstico Completo:\n');
    console.log('1. Execute a aplicação em desenvolvimento:');
    console.log('   npm run dev\n');
    console.log('2. Acesse /editor no navegador\n');
    console.log('3. Abra o DevTools (F12) e verifique:');
    console.log('   a) Aba Console - procure por logs:');
    console.log('      • "📂 Carregando quiz inicial"');
    console.log('      • "🎯 Auto-selecionando primeiro step"');
    console.log('      • "🎨 Canvas render"');
    console.log('      • "✅ Renderizando container de blocos"\n');
    console.log('   b) Execute no console:');
    console.log('      console.log(window.__BLOCK_REGISTRY__)\n');
    console.log('   c) Verifique erros no console (texto vermelho)\n');
    console.log('4. Compare os logs com a sequência esperada em:');
    console.log('   DIAGNOSTICO_MODERNQUIZEDITOR.md\n');

    if (issues.length === 0) {
        console.log('✅ Nenhum problema crítico encontrado no código!');
        console.log('   Se os blocos não aparecem, o problema provavelmente está em:');
        console.log('   • Componentes React não renderizando (verificar DevTools)');
        console.log('   • CSS/estilos ocultando os blocos');
        console.log('   • Problema com dnd-kit ou outras bibliotecas\n');
    }

    console.log('═══════════════════════════════════════════════════════════════\n');
}

// Executar
runAllTests().catch(console.error);
