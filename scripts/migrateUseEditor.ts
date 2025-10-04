/**
 * 🔄 MIGRATION SCRIPT - FASE 4
 * 
 * Script para migrar automaticamente todos os imports de useEditor
 * para o novo hook unificado useUnifiedEditor.
 * 
 * EXECUTA:
 * ✅ Substitui imports de useEditor espalhados
 * ✅ Atualiza referencias nos arquivos  
 * ✅ Mantém compatibilidade durante transição
 * ✅ Gera relatório de migração
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ============================================================================
// CONFIGURAÇÃO DA MIGRAÇÃO
// ============================================================================

const MIGRATION_CONFIG = {
    // Diretórios para escanear
    scanDirs: ['src/components', 'src/hooks', 'src/pages', 'src/providers'],

    // Extensões de arquivo suportadas
    extensions: ['.ts', '.tsx'],

    // Padrões de import para substituir
    importPatterns: [
        {
            from: /import\s*{\s*useEditor\s*}\s*from\s*['"]@\/components\/editor\/EditorProviderMigrationAdapter['"]/g,
            to: "import { useEditor } from '@/hooks/useUnifiedEditor'"
        },
        {
            from: /import\s*{\s*useEditor\s*}\s*from\s*['"]@\/components\/editor\/EditorProvider['"]/g,
            to: "import { useEditor } from '@/hooks/useUnifiedEditor'"
        },
        {
            from: /import\s*{\s*useEditor\s*}\s*from\s*['"]\.\.\/context\/EditorContext['"]/g,
            to: "import { useEditor } from '@/hooks/useUnifiedEditor'"
        },
        {
            from: /import\s*{\s*useEditor\s*}\s*from\s*['"]\.\.\/\.\.\/context\/EditorContext['"]/g,
            to: "import { useEditor } from '@/hooks/useUnifiedEditor'"
        },
        {
            from: /import\s*{\s*useEditorCore,?\s*useEditorElements,?\s*useEditorSelection,?\s*useEditorViewport,?\s*[^}]*}\s*from\s*['"][^'"]*EditorCore['"]/g,
            to: "import { useEditor } from '@/hooks/useUnifiedEditor'"
        }
    ],

    // Arquivos para ignorar (já foram migrados ou são especiais)
    ignoreFiles: [
        'useUnifiedEditor.ts',
        'OptimizedEditorProvider.tsx',
        'EditorProvider.tsx', // Manter original como fallback
        'EditorProviderMigrationAdapter.tsx' // Manter para compatibilidade temporária
    ]
};

// ============================================================================
// UTILITÁRIOS DE MIGRAÇÃO
// ============================================================================

interface MigrationResult {
    filePath: string;
    originalImports: string[];
    newImports: string[];
    changesMade: number;
    success: boolean;
    error?: string;
}

const migrationResults: MigrationResult[] = [];

/**
 * Encontra todos os arquivos TypeScript/React no diretório
 */
function findTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];

    function scanDirectory(currentDir: string) {
        try {
            const items = readdirSync(currentDir);

            for (const item of items) {
                const fullPath = join(currentDir, item);

                try {
                    const stat = statSync(fullPath);

                    if (stat.isDirectory()) {
                        // Recursively scan subdirectories
                        scanDirectory(fullPath);
                    } else if (stat.isFile()) {
                        // Check if file has supported extension
                        const hasValidExtension = MIGRATION_CONFIG.extensions.some(ext =>
                            fullPath.endsWith(ext)
                        );

                        // Check if file should be ignored
                        const shouldIgnore = MIGRATION_CONFIG.ignoreFiles.some(ignore =>
                            fullPath.includes(ignore)
                        );

                        if (hasValidExtension && !shouldIgnore) {
                            files.push(fullPath);
                        }
                    }
                } catch (itemError) {
                    console.warn(`⚠️ Error processing ${fullPath}:`, itemError);
                }
            }
        } catch (dirError) {
            console.warn(`⚠️ Error scanning directory ${currentDir}:`, dirError);
        }
    }

    scanDirectory(dir);
    return files;
}

/**
 * Migra um arquivo individual
 */
function migrateFile(filePath: string): MigrationResult {
    const result: MigrationResult = {
        filePath,
        originalImports: [],
        newImports: [],
        changesMade: 0,
        success: false
    };

    try {
        // Ler conteúdo do arquivo
        const originalContent = readFileSync(filePath, 'utf-8');
        let newContent = originalContent;

        // Aplicar cada padrão de migração
        for (const pattern of MIGRATION_CONFIG.importPatterns) {
            const matches = originalContent.match(pattern.from);

            if (matches) {
                result.originalImports.push(...matches);
                newContent = newContent.replace(pattern.from, pattern.to);
                result.changesMade += matches.length;
            }
        }

        // Se houve mudanças, salvar arquivo
        if (result.changesMade > 0) {
            writeFileSync(filePath, newContent, 'utf-8');
            result.newImports.push("import { useEditor } from '@/hooks/useUnifiedEditor'");
            result.success = true;

            console.log(`✅ Migrated ${filePath} (${result.changesMade} changes)`);
        } else {
            result.success = true; // No changes needed is also success
        }

    } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
        result.success = false;
        console.error(`❌ Error migrating ${filePath}:`, error);
    }

    return result;
}

/**
 * Gera relatório de migração
 */
function generateMigrationReport(): string {
    const totalFiles = migrationResults.length;
    const successfulMigrations = migrationResults.filter(r => r.success).length;
    const filesWithChanges = migrationResults.filter(r => r.changesMade > 0).length;
    const totalChanges = migrationResults.reduce((sum, r) => sum + r.changesMade, 0);
    const errors = migrationResults.filter(r => !r.success);

    let report = `
# 🔄 RELATÓRIO DE MIGRAÇÃO - useEditor → useUnifiedEditor

## 📊 Estatísticas
- **Arquivos processados**: ${totalFiles}
- **Migrações bem-sucedidas**: ${successfulMigrations}
- **Arquivos modificados**: ${filesWithChanges}
- **Total de mudanças**: ${totalChanges}
- **Erros**: ${errors.length}

## ✅ Arquivos Migrados
${migrationResults
            .filter(r => r.changesMade > 0)
            .map(r => `- \`${r.filePath}\` (${r.changesMade} mudanças)`)
            .join('\n')}

## 🔍 Detalhes das Mudanças
${migrationResults
            .filter(r => r.originalImports.length > 0)
            .map(r => `
### ${r.filePath}
**Antes:**
${r.originalImports.map(imp => `- \`${imp}\``).join('\n')}

**Depois:**  
${r.newImports.map(imp => `- \`${imp}\``).join('\n')}
`)
            .join('\n')}

${errors.length > 0 ? `
## ❌ Erros Encontrados
${errors.map(e => `- \`${e.filePath}\`: ${e.error}`).join('\n')}
` : ''}

## 🎯 Próximos Passos
1. Executar testes para validar migrações
2. Verificar se há imports ainda não migrados
3. Remover arquivos legacy quando apropriado
4. Atualizar documentação

---
*Migração executada em: ${new Date().toISOString()}*
`;

    return report;
}

// ============================================================================
// EXECUÇÃO DA MIGRAÇÃO
// ============================================================================

/**
 * Executa a migração completa
 */
export function executeMigration(workspaceRoot: string = process.cwd()): void {
    console.log('🚀 Iniciando migração useEditor → useUnifiedEditor...\n');

    let allFiles: string[] = [];

    // Encontrar todos os arquivos para migrar
    for (const scanDir of MIGRATION_CONFIG.scanDirs) {
        const fullPath = join(workspaceRoot, scanDir);
        console.log(`🔍 Escaneando: ${fullPath}`);

        try {
            const dirFiles = findTypeScriptFiles(fullPath);
            allFiles.push(...dirFiles);
            console.log(`   Encontrados: ${dirFiles.length} arquivos`);
        } catch (error) {
            console.warn(`⚠️ Erro escaneando ${fullPath}:`, error);
        }
    }

    console.log(`\n📁 Total de arquivos para processar: ${allFiles.length}\n`);

    // Migrar cada arquivo
    for (const filePath of allFiles) {
        const result = migrateFile(filePath);
        migrationResults.push(result);
    }

    // Gerar e salvar relatório
    const report = generateMigrationReport();
    const reportPath = join(workspaceRoot, 'MIGRATION_REPORT_USE_EDITOR.md');

    try {
        writeFileSync(reportPath, report, 'utf-8');
        console.log(`\n📊 Relatório salvo em: ${reportPath}`);
    } catch (error) {
        console.error('❌ Erro ao salvar relatório:', error);
    }

    // Exibir resumo
    console.log('\n🎉 Migração concluída!');
    console.log(`✅ ${migrationResults.filter(r => r.success).length} arquivos processados`);
    console.log(`🔄 ${migrationResults.filter(r => r.changesMade > 0).length} arquivos modificados`);
    console.log(`📝 ${migrationResults.reduce((sum, r) => sum + r.changesMade, 0)} mudanças aplicadas`);

    const errors = migrationResults.filter(r => !r.success);
    if (errors.length > 0) {
        console.log(`❌ ${errors.length} erros encontrados`);
    }
}

// ============================================================================
// CLI INTEGRATION
// ============================================================================

// Se executado diretamente, executar migração
if (require.main === module) {
    const workspaceRoot = process.argv[2] || process.cwd();
    executeMigration(workspaceRoot);
}

export default executeMigration;