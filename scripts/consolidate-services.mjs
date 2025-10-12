#!/usr/bin/env node
/**
 * 🗄️ CONSOLIDATE SERVICES - Sprint 3
 * 
 * Arquiva serviços obsoletos e atualiza imports automaticamente
 * Baseado no SERVICE_AUDIT_REPORT.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 📋 MAPEAMENTO: Serviço antigo → Serviço novo
const SERVICE_MIGRATIONS = {
    // Funnel Services → ConsolidatedFunnelService
    'FunnelService': {
        newImport: "import { consolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService'",
        newName: 'consolidatedFunnelService',
        oldPath: 'src/application/services/FunnelService.ts',
        reason: 'Substituído por ConsolidatedFunnelService (mais completo e testado)',
    },
    'EnhancedFunnelService': {
        newImport: "import { consolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService'",
        newName: 'consolidatedFunnelService',
        oldPath: 'src/services/EnhancedFunnelService.ts',
        reason: 'Funcionalidades mescladas em ConsolidatedFunnelService',
    },
    'FunnelUnifiedService': {
        newImport: "import { consolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService'",
        newName: 'consolidatedFunnelService',
        oldPath: 'src/services/FunnelUnifiedService.ts',
        reason: 'Unificado em ConsolidatedFunnelService',
    },
    'FunnelUnifiedServiceV2': {
        newImport: "import { consolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService'",
        newName: 'consolidatedFunnelService',
        oldPath: 'src/services/FunnelUnifiedServiceV2.ts',
        reason: 'V2 obsoleta, migrada para ConsolidatedFunnelService',
    },
    'funnelApiService': {
        newImport: "import { consolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService'",
        newName: 'consolidatedFunnelService',
        oldPath: 'src/services/funnelService.ts',
        reason: 'API antiga, substituída por ConsolidatedFunnelService',
    },

    // ContextualFunnelService → Versão core
    'ContextualFunnelService': {
        newImport: "import { ContextualFunnelService } from '@/services/core/ContextualFunnelService'",
        newName: 'ContextualFunnelService',
        oldPath: 'src/services/contextualFunnelService.ts',
        reason: 'Versão antiga, migrada para services/core/',
    },
    'MigratedContextualFunnelService': {
        newImport: "import { ContextualFunnelService } from '@/services/core/ContextualFunnelService'",
        newName: 'ContextualFunnelService',
        oldPath: 'src/services/migratedContextualFunnelService.ts',
        reason: 'Migração completa, usar versão core',
    },

    // Template Services → MasterTemplateService
    'HybridTemplateService': {
        newImport: "import { masterTemplateService } from '@/services/templates/MasterTemplateService'",
        newName: 'masterTemplateService',
        oldPath: 'src/services/HybridTemplateService.ts',
        reason: 'Estratégia híbrida obsoleta, usar MasterTemplateService',
    },
    'OptimizedHybridTemplateService': {
        newImport: "import { masterTemplateService } from '@/services/templates/MasterTemplateService'",
        newName: 'masterTemplateService',
        oldPath: 'src/services/OptimizedHybridTemplateService.ts',
        reason: 'Otimizações integradas em MasterTemplateService',
    },
    'ScalableHybridTemplateService': {
        newImport: "import { masterTemplateService } from '@/services/templates/MasterTemplateService'",
        newName: 'masterTemplateService',
        oldPath: 'src/services/ScalableHybridTemplateService.ts',
        reason: 'Funcionalidades mescladas em MasterTemplateService',
    },
    'AIEnhancedHybridTemplateService': {
        newImport: "import { masterTemplateService } from '@/services/templates/MasterTemplateService'",
        newName: 'masterTemplateService',
        oldPath: 'src/services/AIEnhancedHybridTemplateService.ts',
        reason: 'AI features não utilizadas, usar MasterTemplateService',
    },

    // Analytics Services → RealDataAnalyticsService
    'AnalyticsService': {
        newImport: "import { realDataAnalyticsService } from '@/services/core/RealDataAnalyticsService'",
        newName: 'realDataAnalyticsService',
        oldPath: 'src/services/AnalyticsService.ts',
        reason: 'Substituído por RealDataAnalyticsService (dados reais)',
    },
    'UnifiedAnalyticsService': {
        newImport: "import { realDataAnalyticsService } from '@/services/core/RealDataAnalyticsService'",
        newName: 'realDataAnalyticsService',
        oldPath: 'src/services/unifiedAnalytics.ts',
        reason: 'Unificado em RealDataAnalyticsService',
    },
    'ActivatedAnalyticsService': {
        newImport: "import { realDataAnalyticsService } from '@/services/core/RealDataAnalyticsService'",
        newName: 'realDataAnalyticsService',
        oldPath: 'src/services/ActivatedAnalytics.ts',
        reason: 'Funcionalidades em RealDataAnalyticsService',
    },

    // Monitoring Services → services/core/MonitoringService
    'MonitoringService': {
        newImport: "import { monitoringService } from '@/services/core/MonitoringService'",
        newName: 'monitoringService',
        oldPath: 'src/services/MonitoringService.ts',
        reason: 'Versão antiga, usar services/core/MonitoringService',
    },

    // Storage Services → StorageService (core)
    'LocalStorageService': {
        newImport: "import { StorageService } from '@/services/core/StorageService'",
        newName: 'StorageService',
        oldPath: 'src/core/funnel/services/LocalStorageService.ts',
        reason: 'Obsoleto após Sprint 2, usar StorageService',
    },
    'UnifiedStorageService': {
        newImport: "import { StorageService } from '@/services/core/StorageService'",
        newName: 'StorageService',
        oldPath: 'src/services/UnifiedStorageService.ts',
        reason: 'Unificado em StorageService (core)',
    },

    // Data Services → EnhancedUnifiedDataService
    'UnifiedDataService': {
        newImport: "import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService'",
        newName: 'EnhancedUnifiedDataService',
        oldPath: 'src/services/core/UnifiedDataService.ts',
        reason: 'Enhanced version com mais features',
    },

    // ComponentsService → Versão core/funnel
    'ComponentsService': {
        newImport: "import { ComponentsService } from '@/core/funnel/services/ComponentsService'",
        newName: 'ComponentsService',
        oldPath: 'src/services/ComponentsService.ts',
        reason: 'Usar versão em core/funnel (mais recente)',
    },

    // MasterLoadingService → Versão core
    'MasterLoadingService': {
        newImport: "import { getMasterLoadingService } from '@/services/core/MasterLoadingService'",
        newName: 'masterLoadingService',
        oldPath: 'src/hooks/loading/MasterLoadingService.ts',
        reason: 'Movido para services/core/',
    },
};

// 📊 Estatísticas
const stats = {
    filesScanned: 0,
    importsUpdated: 0,
    servicesArchived: 0,
    errors: [],
};

/**
 * 🗄️ Arquiva um serviço obsoleto
 */
function archiveService(serviceName, config) {
    const oldPath = path.join(rootDir, config.oldPath);

    if (!fs.existsSync(oldPath)) {
        console.log(`   ⚠️  Arquivo não encontrado: ${config.oldPath}`);
        return false;
    }

    // Cria diretório archived se não existir
    const archivedDir = path.join(rootDir, 'src/services/archived');
    if (!fs.existsSync(archivedDir)) {
        fs.mkdirSync(archivedDir, { recursive: true });
    }

    // Move arquivo
    const fileName = path.basename(oldPath);
    const newPath = path.join(archivedDir, fileName);

    // Adiciona comentário no topo explicando migração
    const content = fs.readFileSync(oldPath, 'utf-8');
    const header = `/**
 * ⚠️ ARCHIVED - Sprint 3 Consolidation
 * 
 * Razão: ${config.reason}
 * Migrado para: ${config.newName}
 * Data: ${new Date().toISOString().split('T')[0]}
 * 
 * Este arquivo foi arquivado durante Sprint 3 de consolidação.
 * Não use este serviço - imports foram atualizados automaticamente.
 */

`;

    fs.writeFileSync(newPath, header + content);
    fs.unlinkSync(oldPath); // Remove original

    console.log(`   ✅ Arquivado: ${config.oldPath} → archived/${fileName}`);
    stats.servicesArchived++;

    return true;
}

/**
 * 🔄 Atualiza imports em um arquivo
 */
function updateImportsInFile(filePath, migrations) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;
    const relativePath = path.relative(rootDir, filePath);

    for (const [oldService, config] of Object.entries(migrations)) {
        // Padrões de import a buscar
        const importPatterns = [
            // import { FunnelService } from '...'
            new RegExp(`import\\s*{[^}]*\\b${oldService}\\b[^}]*}\\s*from\\s*['"][^'"]+['"]`, 'g'),
            // import FunnelService from '...'
            new RegExp(`import\\s+${oldService}\\s+from\\s*['"][^'"]+['"]`, 'g'),
            // import * as funnel from '...' (raro, mas possível)
            new RegExp(`import\\s*\\*\\s*as\\s+${oldService}\\s+from\\s*['"][^'"]+['"]`, 'g'),
        ];

        for (const pattern of importPatterns) {
            const matches = content.match(pattern);

            if (matches && matches.length > 0) {
                // Remove import antigo
                content = content.replace(pattern, '');

                // Adiciona novo import se não existir
                if (!content.includes(config.newImport)) {
                    // Adiciona após últimos imports
                    const lastImportIndex = content.lastIndexOf('import ');
                    if (lastImportIndex !== -1) {
                        const nextLineIndex = content.indexOf('\n', lastImportIndex);
                        content = content.slice(0, nextLineIndex + 1) +
                            config.newImport + '\n' +
                            content.slice(nextLineIndex + 1);
                    } else {
                        // Sem imports, adiciona no topo
                        content = config.newImport + '\n\n' + content;
                    }
                }

                // Substitui uso do serviço antigo pelo novo
                const usagePattern = new RegExp(`\\b${oldService}\\b`, 'g');
                content = content.replace(usagePattern, config.newName);

                updated = true;
                stats.importsUpdated++;
                console.log(`   ✏️  ${relativePath}: ${oldService} → ${config.newName}`);
            }
        }
    }

    if (updated) {
        // Remove linhas vazias duplicadas
        content = content.replace(/\n{3,}/g, '\n\n');
        fs.writeFileSync(filePath, content);
    }

    return updated;
}

/**
 * 🔍 Processa todos os arquivos .ts/.tsx
 */
function processDirectory(dir, migrations) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Ignora node_modules, dist, build, archived
            if (!['node_modules', 'dist', 'build', '.git', 'archived'].includes(entry.name)) {
                processDirectory(fullPath, migrations);
            }
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            stats.filesScanned++;
            updateImportsInFile(fullPath, migrations);
        }
    }
}

/**
 * 📝 Gera README no diretório archived
 */
function createArchivedReadme() {
    const archivedDir = path.join(rootDir, 'src/services/archived');
    const readmePath = path.join(archivedDir, 'README.md');

    const content = `# 🗄️ Serviços Arquivados

Este diretório contém serviços que foram **consolidados** durante o **Sprint 3** de refatoração.

## ⚠️ NÃO USE ESTES SERVIÇOS

Todos os imports foram atualizados automaticamente para os novos serviços consolidados.

## 📋 Mapeamento de Migração

| Serviço Antigo | Novo Serviço | Razão |
|----------------|--------------|-------|
${Object.entries(SERVICE_MIGRATIONS).map(([old, config]) =>
        `| ${old} | ${config.newName} | ${config.reason} |`
    ).join('\n')}

## 🗑️ Quando deletar?

Estes arquivos podem ser **deletados com segurança** após:
- ✅ Validação completa em produção (2 semanas)
- ✅ Testes de regressão passando
- ✅ Code review aprovado

## 📊 Sprint 3 Stats

- **Data:** ${new Date().toISOString().split('T')[0]}
- **Serviços arquivados:** ${stats.servicesArchived}
- **Imports atualizados:** ${stats.importsUpdated}
- **Arquivos processados:** ${stats.filesScanned}

---

**Gerado automaticamente por:** \`scripts/consolidate-services.mjs\`
`;

    fs.writeFileSync(readmePath, content);
    console.log(`\n📝 README criado em: src/services/archived/README.md`);
}

/**
 * 🚀 Execução principal
 */
async function main() {
    console.log('\n🗄️  CONSOLIDAÇÃO DE SERVIÇOS - Sprint 3\n');
    console.log('═'.repeat(80));

    console.log('\n📋 FASE 1: Atualizando imports...\n');

    // Processa todos os arquivos e atualiza imports
    processDirectory(path.join(rootDir, 'src'), SERVICE_MIGRATIONS);

    console.log(`\n✅ Fase 1 completa:`);
    console.log(`   - Arquivos escaneados: ${stats.filesScanned}`);
    console.log(`   - Imports atualizados: ${stats.importsUpdated}`);

    console.log('\n📋 FASE 2: Arquivando serviços obsoletos...\n');

    // Arquiva serviços obsoletos
    for (const [serviceName, config] of Object.entries(SERVICE_MIGRATIONS)) {
        archiveService(serviceName, config);
    }

    console.log(`\n✅ Fase 2 completa:`);
    console.log(`   - Serviços arquivados: ${stats.servicesArchived}`);

    // Cria README
    createArchivedReadme();

    console.log('\n═'.repeat(80));
    console.log('\n📊 RESUMO FINAL:\n');
    console.log(`   ✅ ${stats.filesScanned} arquivos processados`);
    console.log(`   ✅ ${stats.importsUpdated} imports atualizados`);
    console.log(`   ✅ ${stats.servicesArchived} serviços arquivados`);
    console.log(`   ⚠️  ${stats.errors.length} erros encontrados`);

    if (stats.errors.length > 0) {
        console.log('\n⚠️  ERROS:\n');
        for (const error of stats.errors) {
            console.log(`   - ${error}`);
        }
    }

    console.log('\n✅ Consolidação completa!\n');
    console.log('═'.repeat(80));
    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   1. Execute: npm run build');
    console.log('   2. Teste a aplicação manualmente');
    console.log('   3. Execute: git add -A && git commit -m "Sprint 3: Consolidar serviços"\n');
}

main().catch(err => {
    console.error('❌ Erro na consolidação:', err);
    process.exit(1);
});
