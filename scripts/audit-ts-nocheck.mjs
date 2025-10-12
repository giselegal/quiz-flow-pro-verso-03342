#!/usr/bin/env node
/**
 * 🔍 AUDIT TS-NOCHECK - Sprint 4
 * 
 * Analisa todos os arquivos com @ts-nocheck:
 * - Categoriza por tipo (contexts, services, hooks, components)
 * - Prioriza por criticidade
 * - Identifica candidatos para remoção (baixa complexidade)
 * - Gera relatório e plano de ação
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 📊 Estatísticas globais
const stats = {
    totalFiles: 0,
    byCategory: {},
    byPriority: {
        critical: [],
        high: [],
        medium: [],
        low: [],
    },
    easyToFix: [], // < 5 erros
    hardToFix: [], // > 20 erros
};

/**
 * 🔍 Encontra todos os arquivos com @ts-nocheck
 */
function findTsNocheckFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (!['node_modules', 'dist', 'build', '.git', 'archived'].includes(entry.name)) {
                findTsNocheckFiles(fullPath, files);
            }
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Verifica se tem @ts-nocheck no início
            if (/^\/\/\s*@ts-nocheck|^\/\*\s*@ts-nocheck\s*\*\//m.test(content)) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

/**
 * 📝 Categoriza arquivo por tipo
 */
function categorizeFile(filePath) {
    const relativePath = path.relative(rootDir, filePath);

    if (relativePath.includes('/contexts/')) return 'contexts';
    if (relativePath.includes('/services/')) return 'services';
    if (relativePath.includes('/hooks/')) return 'hooks';
    if (relativePath.includes('/api/')) return 'api';
    if (relativePath.includes('/pages/')) return 'pages';
    if (relativePath.includes('/components/')) return 'components';
    if (relativePath.includes('/utils/')) return 'utils';
    if (relativePath.includes('/core/')) return 'core';
    if (relativePath.includes('/infrastructure/')) return 'infrastructure';
    if (relativePath.includes('/debug/') || relativePath.includes('/tools/')) return 'debug';

    return 'other';
}

/**
 * 🎯 Define prioridade baseada em categoria e uso
 */
function getPriority(category, relativePath) {
    // CRITICAL: Contexts e Services principais
    if (category === 'contexts' && !relativePath.includes('backup') && !relativePath.includes('old')) {
        return 'critical';
    }

    if (category === 'services' && (
        relativePath.includes('/core/') ||
        relativePath.includes('/application/')
    )) {
        return 'critical';
    }

    // HIGH: Hooks principais, API, Infrastructure
    if (category === 'hooks' && !relativePath.includes('test') && !relativePath.includes('old')) {
        return 'high';
    }

    if (category === 'api' || category === 'infrastructure') {
        return 'high';
    }

    // MEDIUM: Components principais, utils, core
    if (category === 'components' || category === 'utils' || category === 'core') {
        return 'medium';
    }

    // LOW: Pages, debug, outros
    return 'low';
}

/**
 * 🔢 Estima quantidade de erros TypeScript (sem executar tsc)
 */
function estimateErrorComplexity(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let complexity = 0;

    // Padrões que indicam complexidade TypeScript
    const patterns = {
        any: /:\s*any\b/g,                          // Uso de any
        implicitAny: /\b(function|const|let)\s+\w+\s*\(/g, // Funções sem tipo
        noReturn: /function\s+\w+\([^)]*\)\s*{/g,  // Funções sem tipo de retorno
        assertion: /as\s+any/g,                     // Type assertions perigosas
        ignore: /@ts-ignore/g,                      // @ts-ignore adicional
        emptyInterface: /interface\s+\w+\s*{\s*}/g, // Interfaces vazias
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const matches = content.match(pattern) || [];
        complexity += matches.length;
    }

    // Ajusta baseado no tamanho do arquivo
    const linesOfCode = lines.filter(l => l.trim() && !l.trim().startsWith('//')).length;
    const complexityRatio = complexity / Math.max(linesOfCode, 1);

    return {
        estimatedErrors: complexity,
        linesOfCode,
        complexityRatio: Math.round(complexityRatio * 100) / 100,
        difficulty: complexity < 5 ? 'easy' : complexity < 15 ? 'medium' : 'hard',
    };
}

/**
 * 📊 Analisa um arquivo
 */
function analyzeFile(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    const category = categorizeFile(filePath);
    const priority = getPriority(category, relativePath);
    const complexity = estimateErrorComplexity(filePath);

    return {
        path: relativePath,
        category,
        priority,
        ...complexity,
    };
}

/**
 * 📋 Gera relatório consolidado
 */
function generateReport(analyses) {
    console.log('\n🔍 AUDITORIA @ts-nocheck - Sprint 4\n');
    console.log('═'.repeat(80));

    console.log(`\n📦 RESUMO GERAL:`);
    console.log(`   Total de arquivos com @ts-nocheck: ${analyses.length}`);

    // Por categoria
    const byCategory = {};
    for (const analysis of analyses) {
        if (!byCategory[analysis.category]) {
            byCategory[analysis.category] = [];
        }
        byCategory[analysis.category].push(analysis);
    }

    console.log(`\n📊 POR CATEGORIA:`);
    for (const [category, items] of Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`   ${category.padEnd(15)}: ${items.length.toString().padStart(3)} arquivos`);
    }

    // Por prioridade
    const byPriority = {
        critical: analyses.filter(a => a.priority === 'critical'),
        high: analyses.filter(a => a.priority === 'high'),
        medium: analyses.filter(a => a.priority === 'medium'),
        low: analyses.filter(a => a.priority === 'low'),
    };

    console.log(`\n🎯 POR PRIORIDADE:`);
    console.log(`   🔴 CRITICAL: ${byPriority.critical.length} arquivos`);
    console.log(`   🟠 HIGH:     ${byPriority.high.length} arquivos`);
    console.log(`   🟡 MEDIUM:   ${byPriority.medium.length} arquivos`);
    console.log(`   🟢 LOW:      ${byPriority.low.length} arquivos`);

    // Por dificuldade
    const easyToFix = analyses.filter(a => a.difficulty === 'easy').sort((a, b) => a.estimatedErrors - b.estimatedErrors);
    const mediumToFix = analyses.filter(a => a.difficulty === 'medium');
    const hardToFix = analyses.filter(a => a.difficulty === 'hard');

    console.log(`\n🔧 POR DIFICULDADE:`);
    console.log(`   ✅ FÁCIL (< 5 erros):    ${easyToFix.length} arquivos`);
    console.log(`   🟡 MÉDIO (5-15 erros):   ${mediumToFix.length} arquivos`);
    console.log(`   🔴 DIFÍCIL (> 15 erros): ${hardToFix.length} arquivos`);

    // Top 20 candidatos (fácil + alta prioridade)
    const candidates = easyToFix
        .filter(a => a.priority === 'critical' || a.priority === 'high')
        .slice(0, 20);

    if (candidates.length > 0) {
        console.log(`\n✨ TOP 20 CANDIDATOS (Fácil + Alta Prioridade):\n`);
        for (const [index, candidate] of candidates.entries()) {
            const priorityIcon = {
                critical: '🔴',
                high: '🟠',
                medium: '🟡',
                low: '🟢',
            }[candidate.priority];

            console.log(`   ${(index + 1).toString().padStart(2)}. ${priorityIcon} ${candidate.path}`);
            console.log(`       Categoria: ${candidate.category} | Erros estimados: ${candidate.estimatedErrors} | LOC: ${candidate.linesOfCode}`);
        }
    }

    return {
        total: analyses.length,
        byCategory,
        byPriority,
        byDifficulty: {
            easy: easyToFix.length,
            medium: mediumToFix.length,
            hard: hardToFix.length,
        },
        candidates,
    };
}

/**
 * 📋 Gera plano de ação
 */
function generateActionPlan(summary) {
    console.log('\n📋 PLANO DE AÇÃO - Sprint 4\n');
    console.log('═'.repeat(80));

    const plan = [
        {
            phase: 'Fase 1: Quick Wins',
            target: 'Arquivos fáceis + alta prioridade',
            files: summary.candidates.slice(0, 10),
            estimatedTime: '1-2h',
            impact: 'ALTO',
        },
        {
            phase: 'Fase 2: Critical Files',
            target: 'Contexts e Services críticos restantes',
            files: summary.byPriority.critical.filter(a => a.difficulty !== 'easy').slice(0, 10),
            estimatedTime: '2-3h',
            impact: 'ALTO',
        },
        {
            phase: 'Fase 3: High Priority',
            target: 'Hooks e API principais',
            files: summary.byPriority.high.filter(a => a.difficulty === 'easy').slice(0, 15),
            estimatedTime: '1-2h',
            impact: 'MÉDIO',
        },
        {
            phase: 'Fase 4: Medium Priority',
            target: 'Components e Utils',
            files: summary.byPriority.medium.filter(a => a.difficulty === 'easy').slice(0, 15),
            estimatedTime: '1-2h',
            impact: 'MÉDIO',
        },
    ];

    for (const [index, phase] of plan.entries()) {
        console.log(`${index + 1}. ${phase.phase}`);
        console.log(`   Target: ${phase.target}`);
        console.log(`   Arquivos: ${phase.files.length}`);
        console.log(`   Tempo estimado: ${phase.estimatedTime}`);
        console.log(`   Impacto: ${phase.impact}`);

        if (phase.files.length > 0) {
            console.log(`   Exemplos:`);
            for (const file of phase.files.slice(0, 3)) {
                console.log(`      - ${file.path} (${file.estimatedErrors} erros estimados)`);
            }
        }
        console.log('');
    }

    const totalTime = plan.reduce((sum, p) => {
        const [min, max] = p.estimatedTime.match(/\d+/g).map(Number);
        return sum + (min + max) / 2;
    }, 0);

    console.log(`⏱️  TEMPO TOTAL ESTIMADO: ${Math.round(totalTime)}h`);

    return plan;
}

/**
 * 💾 Salva relatórios
 */
function saveReports(analyses, summary, plan) {
    // Relatório detalhado JSON
    const detailedReport = {
        timestamp: new Date().toISOString(),
        summary: {
            total: summary.total,
            byCategory: Object.fromEntries(
                Object.entries(summary.byCategory).map(([k, v]) => [k, v.length])
            ),
            byPriority: Object.fromEntries(
                Object.entries(summary.byPriority).map(([k, v]) => [k, v.length])
            ),
            byDifficulty: summary.byDifficulty,
        },
        analyses,
        candidates: summary.candidates,
        actionPlan: plan,
    };

    fs.writeFileSync(
        path.join(rootDir, 'TS_NOCHECK_AUDIT_REPORT.json'),
        JSON.stringify(detailedReport, null, 2)
    );

    console.log(`\n📄 Relatórios salvos:`);
    console.log(`   - TS_NOCHECK_AUDIT_REPORT.json`);
}

/**
 * 🚀 Main
 */
async function main() {
    console.log('🔍 Iniciando auditoria @ts-nocheck...\n');

    // 1. Encontra arquivos
    const files = findTsNocheckFiles(path.join(rootDir, 'src'));
    console.log(`✅ Encontrados ${files.length} arquivos com @ts-nocheck\n`);

    // 2. Analisa cada arquivo
    const analyses = files.map(analyzeFile);

    // 3. Gera relatório
    const summary = generateReport(analyses);

    // 4. Gera plano de ação
    const plan = generateActionPlan(summary);

    // 5. Salva relatórios
    saveReports(analyses, summary, plan);

    console.log('\n✅ Auditoria completa!\n');
    console.log('═'.repeat(80));
    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   Execute: node scripts/remove-ts-nocheck-batch.mjs');
    console.log('   Para remover @ts-nocheck dos candidatos automáticamente\n');
}

main().catch(console.error);
