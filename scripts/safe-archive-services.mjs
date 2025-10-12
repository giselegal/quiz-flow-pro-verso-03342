#!/usr/bin/env node
/**
 * 🗄️ SAFE ARCHIVE SERVICES - Sprint 3 (Conservador)
 * 
 * Arquiva APENAS serviços com uso mínimo/zero:
 * - Analisa uso real no código
 * - Arquiva apenas se < 3 referências
 * - Mantém serviços em uso ativo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 🎯 Serviços candidatos a arquivamento (checagem manual)
const CANDIDATES = [
    'src/services/OptimizedHybridTemplateService.ts',
    'src/services/ScalableHybridTemplateService.ts',
    'src/services/AIEnhancedHybridTemplateService.ts',
    'src/services/ActivatedAnalytics.ts',
    'src/services/unifiedAnalytics.ts',
    'src/services/FunnelUnifiedServiceV2.ts',
    'src/services/correctedSchemaDrivenFunnelService.ts',
    'src/services/migratedContextualFunnelService.ts',
    'src/application/services/FunnelService.ts',
    'src/application/services/EditorService.ts',
];

const stats = {
    analyzed: 0,
    archived: 0,
    kept: 0,
    usageMap: {},
};

/**
 * 🔍 Conta uso real de um arquivo no projeto
 */
function countUsage(serviceFilePath) {
    const serviceName = path.basename(serviceFilePath, '.ts');
    let usageCount = 0;
    const usedIn = [];

    function searchDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
                    searchDir(fullPath);
                }
            } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
                // Não conta o próprio arquivo
                if (fullPath === path.join(rootDir, serviceFilePath)) {
                    continue;
                }

                const content = fs.readFileSync(fullPath, 'utf-8');
                const fileName = path.basename(serviceFilePath);

                // Busca imports deste arquivo
                const importPattern = new RegExp(`from\\s+['"].*${serviceName.replace('.', '\\.')}['"]`, 'gi');
                const matches = content.match(importPattern) || [];

                if (matches.length > 0) {
                    usageCount += matches.length;
                    usedIn.push({
                        file: path.relative(rootDir, fullPath),
                        count: matches.length,
                    });
                }
            }
        }
    }

    searchDir(path.join(rootDir, 'src'));

    return { usageCount, usedIn };
}

/**
 * 🗄️ Arquiva arquivo se uso < 3
 */
function tryArchive(serviceFilePath) {
    const fullPath = path.join(rootDir, serviceFilePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`   ⚠️  Não encontrado: ${serviceFilePath}`);
        return false;
    }

    stats.analyzed++;

    // Analisa uso
    const { usageCount, usedIn } = countUsage(serviceFilePath);
    stats.usageMap[serviceFilePath] = { usageCount, usedIn };

    console.log(`\n📄 ${serviceFilePath}`);
    console.log(`   Uso: ${usageCount} referências`);

    if (usedIn.length > 0) {
        console.log(`   Usado em:`);
        for (const usage of usedIn.slice(0, 5)) {
            console.log(`      - ${usage.file} (${usage.count}x)`);
        }
        if (usedIn.length > 5) {
            console.log(`      ... e mais ${usedIn.length - 5} arquivos`);
        }
    }

    // Só arquiva se < 3 usos
    if (usageCount < 3) {
        // Cria diretório archived
        const archivedDir = path.join(rootDir, 'src/services/archived');
        if (!fs.existsSync(archivedDir)) {
            fs.mkdirSync(archivedDir, { recursive: true });
        }

        // Move arquivo
        const fileName = path.basename(fullPath);
        const newPath = path.join(archivedDir, fileName);

        // Adiciona header
        const content = fs.readFileSync(fullPath, 'utf-8');
        const header = `/**
 * ⚠️ ARCHIVED - Sprint 3 (Low Usage)
 * 
 * Uso detectado: ${usageCount} referências
 * Data: ${new Date().toISOString().split('T')[0]}
 * 
 * Este arquivo foi arquivado por ter baixo uso.
 * Se precisar, pode ser restaurado de src/services/archived/
 */

`;

        fs.writeFileSync(newPath, header + content);
        fs.unlinkSync(fullPath);

        console.log(`   ✅ ARQUIVADO → archived/${fileName}`);
        stats.archived++;
        return true;
    } else {
        console.log(`   ⏩ MANTIDO (uso ativo: ${usageCount}x)`);
        stats.kept++;
        return false;
    }
}

/**
 * 📝 Gera relatório
 */
function generateReport() {
    console.log('\n' + '═'.repeat(80));
    console.log('\n📊 RELATÓRIO FINAL - Sprint 3 (Conservador)\n');

    console.log(`✅ Serviços analisados: ${stats.analyzed}`);
    console.log(`🗄️  Serviços arquivados: ${stats.archived}`);
    console.log(`⏩ Serviços mantidos: ${stats.kept}`);

    if (stats.archived > 0) {
        console.log('\n🗄️  ARQUIVADOS:\n');
        for (const [file, data] of Object.entries(stats.usageMap)) {
            if (data.usageCount < 3) {
                console.log(`   - ${file} (${data.usageCount} refs)`);
            }
        }
    }

    if (stats.kept > 0) {
        console.log('\n⏩ MANTIDOS (uso ativo):\n');
        for (const [file, data] of Object.entries(stats.usageMap)) {
            if (data.usageCount >= 3) {
                console.log(`   - ${file} (${data.usageCount} refs)`);
            }
        }
    }

    // Salva relatório detalhado
    const reportPath = path.join(rootDir, 'SERVICE_ARCHIVE_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        stats,
        threshold: 3,
        note: 'Apenas serviços com < 3 referências foram arquivados',
    }, null, 2));

    console.log(`\n📄 Relatório salvo: SERVICE_ARCHIVE_REPORT.json`);
}

/**
 * 📋 Cria README no archived
 */
function createArchivedReadme() {
    const archivedDir = path.join(rootDir, 'src/services/archived');

    if (!fs.existsSync(archivedDir) || stats.archived === 0) {
        return;
    }

    const readmePath = path.join(archivedDir, 'README.md');

    const archivedList = Object.entries(stats.usageMap)
        .filter(([_, data]) => data.usageCount < 3)
        .map(([file, data]) => ({
            name: path.basename(file),
            refs: data.usageCount,
            usedIn: data.usedIn.map(u => u.file).join(', ') || 'nenhum',
        }));

    const content = `# 🗄️ Serviços Arquivados - Sprint 3

Este diretório contém serviços com **baixo uso** (< 3 referências) arquivados automaticamente.

## ⚠️ Status: ARQUIVADO (Não usar)

Estes serviços foram identificados como pouco utilizados ou obsoletos.

## 📋 Lista de Arquivados

| Arquivo | Refs | Usado Em |
|---------|------|----------|
${archivedList.map(item =>
        `| ${item.name} | ${item.refs} | ${item.usedIn || 'nenhum'} |`
    ).join('\n')}

## 🔄 Restauração

Se algum destes serviços for necessário:
1. Mova de volta para \`src/services/\`
2. Remova o header de arquivamento
3. Atualize imports se necessário

## 🗑️ Deleção

Após 2 semanas sem necessidade, deletar com segurança:
\`\`\`bash
rm -rf src/services/archived/
\`\`\`

---

**Data:** ${new Date().toISOString().split('T')[0]}  
**Arquivados:** ${stats.archived} serviços  
**Critério:** < 3 referências no código
`;

    fs.writeFileSync(readmePath, content);
    console.log(`\n📝 README criado: src/services/archived/README.md`);
}

/**
 * 🚀 Main
 */
async function main() {
    console.log('\n🗄️  ARQUIVAMENTO SEGURO DE SERVIÇOS - Sprint 3\n');
    console.log('═'.repeat(80));
    console.log('\n🎯 Estratégia: Arquivar apenas se < 3 referências\n');

    for (const candidate of CANDIDATES) {
        tryArchive(candidate);
    }

    generateReport();
    createArchivedReadme();

    console.log('\n═'.repeat(80));
    console.log('\n✅ Processo completo!\n');

    if (stats.archived > 0) {
        console.log('💡 PRÓXIMOS PASSOS:');
        console.log('   1. Teste a aplicação');
        console.log('   2. Execute: npm run build');
        console.log('   3. Se OK: git add -A && git commit -m "Sprint 3: Arquivar serviços não utilizados"\n');
    } else {
        console.log('💡 NENHUM SERVIÇO ARQUIVADO (todos têm uso ativo ≥ 3 refs)\n');
        console.log('   Recomendação: Manter todos por enquanto e consolidar gradualmente.\n');
    }
}

main().catch(console.error);
