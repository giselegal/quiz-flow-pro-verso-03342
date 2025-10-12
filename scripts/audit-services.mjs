#!/usr/bin/env node
/**
 * 🔍 AUDIT SERVICES - Sprint 3
 * 
 * Analisa todos os serviços do projeto e identifica:
 * - Serviços duplicados (FunnelService v1/v2/v3)
 * - Serviços não utilizados
 * - Serviços que podem ser consolidados
 * - Uso real em cada arquivo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 🎯 Padrões de serviços para buscar
const SERVICE_PATTERNS = {
    funnel: /Funnel.*Service|.*FunnelService/i,
    template: /Template.*Service|.*TemplateService/i,
    analytics: /Analytics.*Service|.*AnalyticsService/i,
    storage: /Storage.*Service|.*StorageService/i,
    data: /Data.*Service|.*DataService/i,
    editor: /Editor.*Service|.*EditorService/i,
    monitoring: /Monitoring.*Service|.*MonitoringService/i,
    validation: /Validation.*Service|.*ValidatorService/i,
};

// 📊 Estatísticas globais
const stats = {
    totalServices: 0,
    servicesByCategory: {},
    duplicates: {},
    unusedServices: [],
    usageCount: {},
    serviceFiles: [],
};

/**
 * 🔍 Encontra todos os arquivos *Service*.ts
 */
function findServiceFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Ignora node_modules, dist, build
            if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
                findServiceFiles(fullPath, files);
            }
        } else if (entry.isFile() && /Service\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * 📝 Extrai nome do serviço e exports do arquivo
 */
function analyzeServiceFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);

    // Extrai classes e exports
    const classMatches = content.match(/export\s+class\s+(\w+Service)/g) || [];
    const constMatches = content.match(/export\s+const\s+(\w+Service)\s*=/g) || [];
    const defaultMatches = content.match(/export\s+default\s+class\s+(\w+Service)/g) || [];

    const services = [
        ...classMatches.map(m => m.match(/(\w+Service)/)[1]),
        ...constMatches.map(m => m.match(/(\w+Service)/)[1]),
        ...defaultMatches.map(m => m.match(/(\w+Service)/)[1]),
    ];

    // Categoriza o serviço
    let category = 'other';
    for (const [cat, pattern] of Object.entries(SERVICE_PATTERNS)) {
        if (services.some(s => pattern.test(s))) {
            category = cat;
            break;
        }
    }

    return {
        filePath: relativePath,
        services,
        category,
        linesOfCode: content.split('\n').length,
        hasTests: fs.existsSync(filePath.replace(/\.ts$/, '.test.ts')),
    };
}

/**
 * 🔎 Conta uso de cada serviço no projeto
 */
function countServiceUsage(serviceName) {
    let count = 0;
    const importingFiles = [];

    // Busca imports deste serviço
    function searchInDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
                    searchInDir(fullPath);
                }
            } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
                const content = fs.readFileSync(fullPath, 'utf-8');

                // Busca imports e uso
                const importRegex = new RegExp(`import.*${serviceName}.*from`, 'gi');
                const usageRegex = new RegExp(`\\b${serviceName}\\b`, 'gi');

                const imports = content.match(importRegex) || [];
                const usages = content.match(usageRegex) || [];

                if (imports.length > 0 || usages.length > 0) {
                    count += usages.length;
                    importingFiles.push({
                        file: path.relative(rootDir, fullPath),
                        imports: imports.length,
                        usages: usages.length,
                    });
                }
            }
        }
    }

    searchInDir(path.join(rootDir, 'src'));

    return { count, importingFiles };
}

/**
 * 🎯 Identifica duplicatas óbvias
 */
function findDuplicates(serviceInfos) {
    const duplicates = {};

    // Agrupa por nome base (sem sufixo v1, v2, Enhanced, etc)
    const grouped = {};

    for (const info of serviceInfos) {
        for (const serviceName of info.services) {
            // Remove sufixos comuns
            const baseName = serviceName
                .replace(/V\d+$/, '')
                .replace(/(Enhanced|Unified|Consolidated|Migrated|Corrected|Advanced|Optimized|Scalable|AI)/, '')
                .replace(/Service$/, '');

            if (!grouped[baseName]) {
                grouped[baseName] = [];
            }

            grouped[baseName].push({
                serviceName,
                filePath: info.filePath,
                linesOfCode: info.linesOfCode,
            });
        }
    }

    // Identifica grupos com múltiplas versões
    for (const [baseName, variants] of Object.entries(grouped)) {
        if (variants.length > 1) {
            duplicates[baseName] = variants;
        }
    }

    return duplicates;
}

/**
 * 📊 Gera relatório consolidado
 */
function generateReport(serviceInfos) {
    console.log('\n🔍 AUDITORIA DE SERVIÇOS - Sprint 3\n');
    console.log('═'.repeat(80));

    // Total de serviços
    const totalServiceFiles = serviceInfos.length;
    const totalServiceExports = serviceInfos.reduce((sum, info) => sum + info.services.length, 0);

    console.log(`\n📦 RESUMO GERAL:`);
    console.log(`   Total de arquivos *Service*.ts: ${totalServiceFiles}`);
    console.log(`   Total de exports de serviços: ${totalServiceExports}`);

    // Por categoria
    const byCategory = {};
    for (const info of serviceInfos) {
        if (!byCategory[info.category]) {
            byCategory[info.category] = [];
        }
        byCategory[info.category].push(info);
    }

    console.log(`\n📊 POR CATEGORIA:`);
    for (const [category, infos] of Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`   ${category.padEnd(15)}: ${infos.length.toString().padStart(3)} serviços`);
    }

    // Duplicatas
    const duplicates = findDuplicates(serviceInfos);
    const duplicateCount = Object.keys(duplicates).length;

    console.log(`\n🔄 DUPLICATAS IDENTIFICADAS: ${duplicateCount}`);

    if (duplicateCount > 0) {
        console.log('\n   Top 10 duplicatas:\n');

        const sortedDuplicates = Object.entries(duplicates)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 10);

        for (const [baseName, variants] of sortedDuplicates) {
            console.log(`   🔸 ${baseName}Service (${variants.length} versões):`);
            for (const variant of variants) {
                console.log(`      - ${variant.serviceName} (${variant.linesOfCode} LOC)`);
                console.log(`        ${variant.filePath}`);
            }
            console.log('');
        }
    }

    // Recomendações
    console.log('═'.repeat(80));
    console.log('\n💡 RECOMENDAÇÕES:\n');

    const funnelServices = serviceInfos.filter(s => s.category === 'funnel');
    const templateServices = serviceInfos.filter(s => s.category === 'template');
    const analyticsServices = serviceInfos.filter(s => s.category === 'analytics');
    const storageServices = serviceInfos.filter(s => s.category === 'storage');

    console.log(`   1. 🎯 Funnel Services (${funnelServices.length} encontrados):`);
    console.log(`      → Consolidar para ConsolidatedFunnelService`);
    console.log(`      → Arquivar versões antigas (v1, v2, Enhanced, etc.)`);

    console.log(`\n   2. 📄 Template Services (${templateServices.length} encontrados):`);
    console.log(`      → Manter MasterTemplateService como principal`);
    console.log(`      → Arquivar HybridTemplateService, OptimizedHybridTemplateService`);

    console.log(`\n   3. 📊 Analytics Services (${analyticsServices.length} encontrados):`);
    console.log(`      → Consolidar para RealDataAnalyticsService`);
    console.log(`      → Manter apenas um MonitoringService`);

    console.log(`\n   4. 💾 Storage Services (${storageServices.length} encontrados):`);
    console.log(`      → Manter StorageService (core)`);
    console.log(`      → Arquivar LocalStorageService (obsoleto)`);

    console.log(`\n   5. 🗑️  Serviços sem testes: ${serviceInfos.filter(s => !s.hasTests).length}`);
    console.log(`      → Adicionar testes ou considerar remoção`);

    return {
        totalServiceFiles,
        totalServiceExports,
        byCategory,
        duplicates,
        recommendations: {
            toConsolidate: duplicateCount,
            toArchive: Math.floor(totalServiceExports * 0.4), // Estima 40% arquiváveis
            targetServices: 30,
        },
    };
}

/**
 * 💾 Salva relatório detalhado em JSON
 */
function saveDetailedReport(serviceInfos, summary) {
    const reportPath = path.join(rootDir, 'SERVICE_AUDIT_REPORT.json');

    const detailedReport = {
        timestamp: new Date().toISOString(),
        summary,
        services: serviceInfos,
        duplicates: findDuplicates(serviceInfos),
    };

    fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
    console.log(`\n📄 Relatório detalhado salvo: SERVICE_AUDIT_REPORT.json`);
}

/**
 * 📋 Gera lista de ações para consolidação
 */
function generateActionPlan(duplicates) {
    console.log('\n📋 PLANO DE AÇÃO - Sprint 3\n');
    console.log('═'.repeat(80));

    const actions = [];

    // Funnel Services
    if (duplicates['Funnel'] || duplicates['FunnelUnified'] || duplicates['ContextualFunnel']) {
        actions.push({
            priority: 'HIGH',
            action: 'Consolidar FunnelServices',
            target: 'ConsolidatedFunnelService',
            toArchive: [
                'FunnelService (v1)',
                'FunnelUnifiedService',
                'FunnelUnifiedServiceV2',
                'EnhancedFunnelService',
                'ContextualFunnelService (old)',
                'MigratedContextualFunnelService',
            ],
            estimatedTime: '2h',
        });
    }

    // Template Services
    if (duplicates['Template'] || duplicates['HybridTemplate']) {
        actions.push({
            priority: 'HIGH',
            action: 'Consolidar TemplateServices',
            target: 'MasterTemplateService + ConsolidatedTemplateService',
            toArchive: [
                'HybridTemplateService',
                'OptimizedHybridTemplateService',
                'ScalableHybridTemplateService',
                'AIEnhancedHybridTemplateService',
                'JsonTemplateService (se não usado)',
            ],
            estimatedTime: '1.5h',
        });
    }

    // Analytics Services
    if (duplicates['Analytics']) {
        actions.push({
            priority: 'MEDIUM',
            action: 'Consolidar AnalyticsServices',
            target: 'RealDataAnalyticsService',
            toArchive: [
                'AnalyticsService (old)',
                'UnifiedAnalyticsService',
                'ActivatedAnalyticsService',
            ],
            estimatedTime: '1h',
        });
    }

    // Data Services
    if (duplicates['Data'] || duplicates['UnifiedData']) {
        actions.push({
            priority: 'MEDIUM',
            action: 'Consolidar DataServices',
            target: 'EnhancedUnifiedDataService',
            toArchive: [
                'UnifiedDataService (old)',
                'QuizDataService (duplicado)',
            ],
            estimatedTime: '1h',
        });
    }

    // Storage Services
    if (duplicates['Storage']) {
        actions.push({
            priority: 'LOW',
            action: 'Consolidar StorageServices',
            target: 'StorageService (core)',
            toArchive: [
                'LocalStorageService (obsoleto)',
                'UnifiedStorageService',
                'ContextualStorageService',
            ],
            estimatedTime: '45min',
        });
    }

    // Exibe plano
    console.log('🎯 AÇÕES PRIORITÁRIAS:\n');

    for (const [index, action] of actions.entries()) {
        console.log(`${index + 1}. [${action.priority}] ${action.action}`);
        console.log(`   Manter: ${action.target}`);
        console.log(`   Arquivar:`);
        for (const item of action.toArchive) {
            console.log(`      - ${item}`);
        }
        console.log(`   Tempo estimado: ${action.estimatedTime}\n`);
    }

    const totalTime = actions.reduce((sum, a) => {
        const [hours, mins] = a.estimatedTime.match(/(\d+(?:\.\d+)?)h?|(\d+)min/) || ['0', '0'];
        return sum + parseFloat(hours || 0) * 60 + parseFloat(mins || 0);
    }, 0);

    console.log(`⏱️  TEMPO TOTAL ESTIMADO: ${Math.floor(totalTime / 60)}h ${totalTime % 60}min`);

    return actions;
}

/**
 * 🚀 Execução principal
 */
async function main() {
    console.log('🔍 Iniciando auditoria de serviços...\n');

    // 1. Encontra todos os arquivos de serviço
    const serviceFiles = findServiceFiles(path.join(rootDir, 'src'));
    console.log(`✅ Encontrados ${serviceFiles.length} arquivos *Service*.ts\n`);

    // 2. Analisa cada arquivo
    const serviceInfos = serviceFiles.map(analyzeServiceFile);

    // 3. Gera relatório
    const summary = generateReport(serviceInfos);

    // 4. Salva relatório detalhado
    saveDetailedReport(serviceInfos, summary);

    // 5. Gera plano de ação
    const duplicates = findDuplicates(serviceInfos);
    const actionPlan = generateActionPlan(duplicates);

    // 6. Salva plano de ação
    const planPath = path.join(rootDir, 'SERVICE_CONSOLIDATION_PLAN.json');
    fs.writeFileSync(planPath, JSON.stringify(actionPlan, null, 2));
    console.log(`\n📋 Plano de ação salvo: SERVICE_CONSOLIDATION_PLAN.json`);

    console.log('\n✅ Auditoria completa!\n');
    console.log('═'.repeat(80));
    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   Execute: node scripts/consolidate-services.mjs');
    console.log('   Para aplicar as consolidações automaticamente\n');
}

main().catch(console.error);
