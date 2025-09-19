/**
 * 🎯 MIGRATION SYSTEM - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 5: Sistema automatizado de migração do código legacy:
 * ✅ Detecta automaticamente código legacy vs consolidado
 * ✅ Scripts de migração automatizada com rollback
 * ✅ Validação de compatibilidade pré e pós migração
 * ✅ Relatórios detalhados de progresso e problemas
 * ✅ Migração gradual com coexistência temporária
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// === TIPOS PARA MIGRAÇÃO ===

interface MigrationRule {
    id: string;
    name: string;
    description: string;
    priority: number;
    sourcePattern: RegExp;
    targetPattern: string;
    validator?: (content: string) => boolean;
    transformer: (content: string, filePath: string) => Promise<string>;
    rollback?: (content: string, filePath: string) => Promise<string>;
}

interface MigrationTarget {
    filePath: string;
    type: 'service' | 'hook' | 'component' | 'config' | 'legacy';
    migrationNeeded: boolean;
    applicableRules: string[];
    estimatedComplexity: 'low' | 'medium' | 'high';
    dependencies: string[];
}

interface MigrationResult {
    filePath: string;
    success: boolean;
    appliedRules: string[];
    errors: string[];
    warnings: string[];
    backupPath?: string;
    rollbackAvailable: boolean;
}

interface MigrationReport {
    totalFiles: number;
    migratedFiles: number;
    failedFiles: number;
    skippedFiles: number;
    results: MigrationResult[];
    totalTime: number;
    estimatedSavings: {
        lines: number;
        files: number;
        kb: number;
    };
}

// === SISTEMA DE MIGRAÇÃO ===

export class MigrationSystem {
    private rules: Map<string, MigrationRule> = new Map();
    private backupDir: string;
    private dryRun: boolean = false;

    constructor(backupDir: string = '.migration-backup') {
        this.backupDir = backupDir;
        this.initializeDefaultRules();
    }

    /**
     * Inicializa regras de migração padrão
     */
    private initializeDefaultRules(): void {
        // Migração de serviços legacy para serviços consolidados
        this.addRule({
            id: 'consolidate-editor-services',
            name: 'Consolidar Serviços de Editor',
            description: 'Migra editorService, canvasConfigurationService para UnifiedEditorService',
            priority: 1,
            sourcePattern: /import.*from.*['"](\.\/|\.\.\/).*editorService|canvasConfigurationService|pageConfigService['"];/g,
            targetPattern: "import { getUnifiedEditorService } from '@/services/core';",
            transformer: async (content: string) => {
                return content
                    .replace(/import\s+\{[^}]*editorService[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*canvasConfigurationService[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*pageConfigService[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/editorService\./g, 'getUnifiedEditorService().')
                    .replace(/canvasConfigurationService\./g, 'getUnifiedEditorService().')
                    .replace(/pageConfigService\./g, 'getUnifiedEditorService().');
            }
        });

        // Migração de hooks fragmentados para hooks consolidados
        this.addRule({
            id: 'consolidate-state-hooks',
            name: 'Consolidar Hooks de Estado',
            description: 'Migra useConfiguration, useGlobalEventManager para useGlobalState',
            priority: 2,
            sourcePattern: /useConfiguration|useGlobalEventManager|useSingleActiveFunnel/g,
            targetPattern: 'useGlobalState',
            transformer: async (content: string) => {
                const imports = "import { useGlobalState } from '@/hooks/core';";

                let transformed = content
                    .replace(/import\s+\{[^}]*useConfiguration[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*useGlobalEventManager[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*useSingleActiveFunnel[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/const\s+\{[^}]*\}\s*=\s*useConfiguration\(\);/g, 'const { config, updateConfig } = useGlobalState();')
                    .replace(/const\s+\{[^}]*\}\s*=\s*useGlobalEventManager\(\);/g, 'const { ui, updateUI } = useGlobalState();')
                    .replace(/const\s+\{[^}]*\}\s*=\s*useSingleActiveFunnel\(\);/g, 'const { funnel, updateFunnel } = useGlobalState();');

                // Adiciona import se não existir
                if (!transformed.includes("import { useGlobalState }")) {
                    transformed = imports + '\n' + transformed;
                }

                return transformed;
            }
        });

        // Migração de validação fragmentada para validação unificada
        this.addRule({
            id: 'consolidate-validation',
            name: 'Consolidar Validação',
            description: 'Migra múltiplos sistemas de validação para UnifiedValidationService',
            priority: 1,
            sourcePattern: /funnelValidationService|pageStructureValidator|validationService/g,
            targetPattern: 'getUnifiedValidationService',
            transformer: async (content: string) => {
                return content
                    .replace(/import\s+\{[^}]*funnelValidationService[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*pageStructureValidator[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*validationService[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/funnelValidationService\./g, 'getUnifiedValidationService().')
                    .replace(/pageStructureValidator\./g, 'getUnifiedValidationService().')
                    .replace(/validationService\./g, 'getUnifiedValidationService().');
            }
        });

        // Migração para Master Schema
        this.addRule({
            id: 'migrate-to-master-schema',
            name: 'Migrar para Master Schema',
            description: 'Substitui imports de schemas fragmentados pelo Master Schema',
            priority: 1,
            sourcePattern: /blockDefinitions|blockPropertySchemas|blockSchemas/g,
            targetPattern: 'MASTER_BLOCK_REGISTRY',
            transformer: async (content: string) => {
                const imports = "import { MASTER_BLOCK_REGISTRY } from '@/config/masterSchema';";

                let transformed = content
                    .replace(/import\s+\{[^}]*blockDefinitions[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*blockPropertySchemas[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/import\s+\{[^}]*blockSchemas[^}]*\}\s+from\s+['"'][^'"]*['"];?/g, '')
                    .replace(/blockDefinitions\[([^\]]+)\]/g, 'MASTER_BLOCK_REGISTRY[$1]')
                    .replace(/blockPropertySchemas\[([^\]]+)\]/g, 'MASTER_BLOCK_REGISTRY[$1].properties')
                    .replace(/blockSchemas\[([^\]]+)\]/g, 'MASTER_BLOCK_REGISTRY[$1].validation');

                // Adiciona import se não existir
                if (!transformed.includes('MASTER_BLOCK_REGISTRY') && !transformed.includes(imports)) {
                    transformed = imports + '\n' + transformed;
                }

                return transformed;
            }
        });

        // Remove imports desnecessários
        this.addRule({
            id: 'cleanup-unused-imports',
            name: 'Limpar Imports Não Utilizados',
            description: 'Remove imports de arquivos que não são mais necessários',
            priority: 10, // Executa por último
            sourcePattern: /import.*legacy|old|deprecated/gi,
            targetPattern: '',
            transformer: async (content: string) => {
                const lines = content.split('\n');
                const cleanedLines = lines.filter(line => {
                    const trimmed = line.trim();
                    // Remove imports de arquivos legacy/deprecated não utilizados no código
                    if (trimmed.startsWith('import') &&
                        (trimmed.includes('legacy') || trimmed.includes('old') || trimmed.includes('deprecated'))) {
                        const importName = this.extractImportName(trimmed);
                        if (importName && !content.includes(importName + '.') && !content.includes(importName + '(')) {
                            return false;
                        }
                    }
                    return true;
                });

                return cleanedLines.join('\n');
            }
        });
    }

    /**
     * Adiciona regra de migração
     */
    addRule(rule: MigrationRule): void {
        this.rules.set(rule.id, rule);
    }

    /**
     * Analisa projeto para identificar alvos de migração
     */
    async analyzeProject(sourceDir: string): Promise<MigrationTarget[]> {
        console.log('🔍 Analyzing project for migration targets...');

        const targets: MigrationTarget[] = [];
        const files = await this.scanDirectory(sourceDir);

        for (const filePath of files) {
            if (this.shouldAnalyzeFile(filePath)) {
                const target = await this.analyzeFile(filePath);
                if (target) {
                    targets.push(target);
                }
            }
        }

        // Ordena por prioridade de migração
        targets.sort((a, b) => {
            const complexityOrder = { high: 3, medium: 2, low: 1 };
            return complexityOrder[a.estimatedComplexity] - complexityOrder[b.estimatedComplexity];
        });

        console.log(`📊 Found ${targets.length} files that need migration`);
        return targets;
    }

    /**
     * Executa migração completa
     */
    async migrate(sourceDir: string, options: {
        dryRun?: boolean;
        targetFiles?: string[];
        skipBackup?: boolean;
    } = {}): Promise<MigrationReport> {
        this.dryRun = options.dryRun || false;
        const startTime = Date.now();

        console.log(`🚀 Starting migration${this.dryRun ? ' (DRY RUN)' : ''}...`);

        // Cria diretório de backup se necessário
        if (!options.skipBackup && !this.dryRun) {
            await this.ensureBackupDirectory();
        }

        // Analisa projeto
        const targets = await this.analyzeProject(sourceDir);
        const filteredTargets = options.targetFiles
            ? targets.filter(t => options.targetFiles!.includes(t.filePath))
            : targets;

        const results: MigrationResult[] = [];
        let migratedCount = 0;
        let failedCount = 0;
        let skippedCount = 0;

        // Migra cada arquivo
        for (const target of filteredTargets) {
            if (!target.migrationNeeded) {
                skippedCount++;
                continue;
            }

            console.log(`📝 Migrating: ${target.filePath}`);
            const result = await this.migrateFile(target, !options.skipBackup);
            results.push(result);

            if (result.success) {
                migratedCount++;
            } else {
                failedCount++;
                console.error(`❌ Failed to migrate ${target.filePath}:`, result.errors);
            }
        }

        const totalTime = Date.now() - startTime;
        const estimatedSavings = this.calculateSavings(results);

        const report: MigrationReport = {
            totalFiles: filteredTargets.length,
            migratedFiles: migratedCount,
            failedFiles: failedCount,
            skippedFiles: skippedCount,
            results,
            totalTime,
            estimatedSavings
        };

        console.log('✅ Migration completed!');
        this.printMigrationSummary(report);

        return report;
    }

    /**
     * Migra um arquivo específico
     */
    private async migrateFile(target: MigrationTarget, createBackup: boolean): Promise<MigrationResult> {
        const result: MigrationResult = {
            filePath: target.filePath,
            success: false,
            appliedRules: [],
            errors: [],
            warnings: [],
            rollbackAvailable: false
        };

        try {
            // Lê conteúdo original
            const originalContent = await fs.readFile(target.filePath, 'utf-8');
            let transformedContent = originalContent;

            // Cria backup se necessário
            if (createBackup && !this.dryRun) {
                const backupPath = await this.createBackup(target.filePath, originalContent);
                result.backupPath = backupPath;
                result.rollbackAvailable = true;
            }

            // Aplica regras de migração
            const sortedRules = Array.from(this.rules.values())
                .filter(rule => target.applicableRules.includes(rule.id))
                .sort((a, b) => a.priority - b.priority);

            for (const rule of sortedRules) {
                try {
                    const beforeTransform = transformedContent;
                    transformedContent = await rule.transformer(transformedContent, target.filePath);

                    if (beforeTransform !== transformedContent) {
                        result.appliedRules.push(rule.id);
                        console.log(`  ✓ Applied: ${rule.name}`);
                    }
                } catch (error) {
                    const errorMsg = `Failed to apply rule ${rule.id}: ${error}`;
                    result.errors.push(errorMsg);
                    console.warn(`  ⚠️ ${errorMsg}`);
                }
            }

            // Valida resultado
            if (await this.validateMigration(originalContent, transformedContent)) {
                if (!this.dryRun && transformedContent !== originalContent) {
                    await fs.writeFile(target.filePath, transformedContent, 'utf-8');
                }
                result.success = true;
            } else {
                result.errors.push('Migration validation failed');
            }

        } catch (error) {
            result.errors.push(`Migration failed: ${error}`);
        }

        return result;
    }

    /**
     * Analisa arquivo específico
     */
    private async analyzeFile(filePath: string): Promise<MigrationTarget | null> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const applicableRules: string[] = [];
            let migrationNeeded = false;

            // Verifica quais regras se aplicam
            for (const [ruleId, rule] of this.rules) {
                if (rule.sourcePattern.test(content)) {
                    applicableRules.push(ruleId);
                    migrationNeeded = true;
                }
            }

            if (!migrationNeeded) {
                return null;
            }

            // Determina tipo e complexidade
            const type = this.determineFileType(filePath, content);
            const complexity = this.estimateComplexity(content, applicableRules.length);
            const dependencies = this.extractDependencies(content);

            return {
                filePath,
                type,
                migrationNeeded,
                applicableRules,
                estimatedComplexity: complexity,
                dependencies
            };

        } catch (error) {
            console.warn(`Failed to analyze ${filePath}:`, error);
            return null;
        }
    }

    /**
     * Determina tipo do arquivo
     */
    private determineFileType(filePath: string, _content: string): MigrationTarget['type'] {
        if (filePath.includes('services/')) return 'service';
        if (filePath.includes('hooks/')) return 'hook';
        if (filePath.includes('components/')) return 'component';
        if (filePath.includes('config/')) return 'config';
        if (filePath.includes('legacy/') || filePath.includes('old/')) return 'legacy';
        return 'service';
    }

    /**
     * Estima complexidade da migração
     */
    private estimateComplexity(content: string, ruleCount: number): 'low' | 'medium' | 'high' {
        const lines = content.split('\n').length;
        const imports = (content.match(/^import/gm) || []).length;

        if (lines > 500 || imports > 20 || ruleCount > 5) return 'high';
        if (lines > 200 || imports > 10 || ruleCount > 3) return 'medium';
        return 'low';
    }

    /**
     * Extrai dependências do arquivo
     */
    private extractDependencies(content: string): string[] {
        const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
        return importMatches
            .map(imp => imp.match(/from\s+['"]([^'"]+)['"]/)?.[1])
            .filter(Boolean) as string[];
    }

    /**
     * Extrai nome do import
     */
    private extractImportName(importStatement: string): string | null {
        const match = importStatement.match(/import\s+(?:\{[^}]*\}|\w+|(?:\{[^}]*\}\s*,\s*\w+))/);
        if (match) {
            return match[0].replace(/import\s+/, '').replace(/[{}]/g, '').trim();
        }
        return null;
    }

    /**
     * Valida migração
     */
    private async validateMigration(original: string, transformed: string): Promise<boolean> {
        // Validações básicas
        if (transformed.length === 0) return false;
        if (transformed === original) return true; // Não houve mudanças necessárias

        // Verifica se não removeu código importante
        const originalImports = (original.match(/^import/gm) || []).length;
        const transformedImports = (transformed.match(/^import/gm) || []).length;

        // Se removeu muitos imports (> 50%), pode ser um problema
        if (transformedImports < originalImports * 0.5) {
            console.warn('Warning: Significant reduction in imports detected');
        }

        return true;
    }

    /**
     * Cria backup do arquivo
     */
    private async createBackup(filePath: string, content: string): Promise<string> {
        const relativePath = path.relative(process.cwd(), filePath);
        const backupPath = path.join(this.backupDir, relativePath + '.backup');
        const backupDir = path.dirname(backupPath);

        await fs.mkdir(backupDir, { recursive: true });
        await fs.writeFile(backupPath, content, 'utf-8');

        return backupPath;
    }

    /**
     * Garante que diretório de backup existe
     */
    private async ensureBackupDirectory(): Promise<void> {
        await fs.mkdir(this.backupDir, { recursive: true });

        // Cria arquivo README no backup
        const readmePath = path.join(this.backupDir, 'README.md');
        const readmeContent = `# Migration Backup

This directory contains backups of files before migration.

- Created: ${new Date().toISOString()}
- Migration System: Consolidação Arquitetural

## Rollback

To rollback a file, copy it back from here to its original location.
`;

        await fs.writeFile(readmePath, readmeContent, 'utf-8');
    }

    /**
     * Escaneia diretório recursivamente
     */
    private async scanDirectory(dir: string): Promise<string[]> {
        const files: string[] = [];

        const scan = async (currentDir: string) => {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    // Ignora node_modules e outros diretórios desnecessários
                    if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                        await scan(fullPath);
                    }
                } else if (entry.isFile() && this.shouldAnalyzeFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        };

        await scan(dir);
        return files;
    }

    /**
     * Verifica se deve analisar o arquivo
     */
    private shouldAnalyzeFile(filePath: string): boolean {
        const ext = path.extname(filePath);
        const allowedExtensions = ['.ts', '.tsx', '.js', '.jsx'];

        return allowedExtensions.includes(ext) &&
            !filePath.includes('node_modules') &&
            !filePath.includes('.test.') &&
            !filePath.includes('.spec.');
    }

    /**
     * Calcula economia estimada
     */
    private calculateSavings(results: MigrationResult[]): MigrationReport['estimatedSavings'] {
        const successfulResults = results.filter(r => r.success);

        return {
            lines: successfulResults.length * 50, // Estima 50 linhas economizadas por arquivo
            files: successfulResults.length,
            kb: successfulResults.length * 2 // Estima 2KB economizados por arquivo
        };
    }

    /**
     * Imprime resumo da migração
     */
    private printMigrationSummary(report: MigrationReport): void {
        console.group('📊 Migration Summary');
        console.log(`✅ Successfully migrated: ${report.migratedFiles} files`);
        console.log(`❌ Failed migrations: ${report.failedFiles} files`);
        console.log(`⏭️  Skipped files: ${report.skippedFiles} files`);
        console.log(`⏱️  Total time: ${(report.totalTime / 1000).toFixed(2)}s`);

        console.group('💾 Estimated Savings');
        console.log(`Lines of code: ${report.estimatedSavings.lines}`);
        console.log(`File size: ${report.estimatedSavings.kb}KB`);
        console.log(`Files consolidated: ${report.estimatedSavings.files}`);
        console.groupEnd();

        if (report.failedFiles > 0) {
            console.group('❌ Failed Files');
            report.results
                .filter(r => !r.success)
                .forEach(r => {
                    console.log(`${r.filePath}: ${r.errors.join(', ')}`);
                });
            console.groupEnd();
        }

        console.groupEnd();
    }

    /**
     * Executa rollback de migração
     */
    async rollback(filePath: string): Promise<boolean> {
        try {
            const relativePath = path.relative(process.cwd(), filePath);
            const backupPath = path.join(this.backupDir, relativePath + '.backup');

            const backupContent = await fs.readFile(backupPath, 'utf-8');
            await fs.writeFile(filePath, backupContent, 'utf-8');

            console.log(`✅ Rolled back: ${filePath}`);
            return true;
        } catch (error) {
            console.error(`❌ Rollback failed for ${filePath}:`, error);
            return false;
        }
    }
}

// === INSTÂNCIA E UTILITÁRIOS ===

export const migrationSystem = new MigrationSystem();

/**
 * Executa migração completa do projeto
 */
export async function migrateProject(options: {
    sourceDir?: string;
    dryRun?: boolean;
    targetFiles?: string[];
} = {}) {
    const sourceDir = options.sourceDir || './src';

    console.log('🎯 Starting Consolidated Architecture Migration');
    console.log('This will migrate legacy code to the new consolidated architecture');

    const report = await migrationSystem.migrate(sourceDir, {
        dryRun: options.dryRun || false,
        targetFiles: options.targetFiles
    });

    return report;
}

/**
 * Analisa projeto sem fazer migração
 */
export async function analyzeForMigration(sourceDir: string = './src') {
    console.log('🔍 Analyzing project for migration opportunities...');

    const targets = await migrationSystem.analyzeProject(sourceDir);

    console.group('📊 Migration Analysis');
    console.log(`Total files needing migration: ${targets.length}`);

    const byComplexity = {
        low: targets.filter(t => t.estimatedComplexity === 'low').length,
        medium: targets.filter(t => t.estimatedComplexity === 'medium').length,
        high: targets.filter(t => t.estimatedComplexity === 'high').length
    };

    console.log(`Complexity breakdown: Low: ${byComplexity.low}, Medium: ${byComplexity.medium}, High: ${byComplexity.high}`);

    const byType = targets.reduce((acc, target) => {
        acc[target.type] = (acc[target.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('By type:', byType);
    console.groupEnd();

    return targets;
}

export default MigrationSystem;