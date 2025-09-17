#!/usr/bin/env node

/**
 * 🚀 SETUP MIGRAÇÃO - PREPARAÇÃO DO AMBIENTE
 * 
 * FASE 5: Script de configuração para sistema de migração:
 * ✅ Verifica dependências necessárias
 * ✅ Instala ferramentas de CLI
 * ✅ Configura ambiente de desenvolvimento
 * ✅ Cria estrutura de pastas
 * ✅ Testa integração completa
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

interface SetupConfig {
    projectDir: string;
    createBackupDir: boolean;
    installDeps: boolean;
    runTests: boolean;
}

class MigrationSetup {
    constructor(private config: SetupConfig) { }

    async run(): Promise<void> {
        console.log(chalk.blue.bold('🚀 SETUP SISTEMA DE MIGRAÇÃO'));
        console.log(chalk.gray('─'.repeat(50)));

        try {
            await this.checkEnvironment();
            await this.createDirectories();
            await this.installDependencies();
            await this.setupScripts();
            await this.validateSetup();

            console.log('\n' + chalk.green.bold('✅ SETUP CONCLUÍDO COM SUCESSO!'));
            this.printNextSteps();

        } catch (error) {
            console.error(chalk.red('\n❌ ERRO NO SETUP:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }

    private async checkEnvironment(): Promise<void> {
        const spinner = ora('Verificando ambiente...').start();

        try {
            // Verifica Node.js
            const nodeVersion = process.version;
            if (!this.isNodeVersionValid(nodeVersion)) {
                throw new Error(`Node.js ${nodeVersion} não é suportado. Mínimo: v16.0.0`);
            }

            // Verifica npm/yarn
            try {
                execSync('npm --version', { stdio: 'pipe' });
            } catch {
                throw new Error('npm não está instalado');
            }

            // Verifica se é um projeto Node.js
            const packageJsonPath = path.join(this.config.projectDir, 'package.json');
            try {
                await fs.access(packageJsonPath);
            } catch {
                throw new Error('package.json não encontrado. Execute em um projeto Node.js');
            }

            spinner.succeed('Ambiente validado');

        } catch (error) {
            spinner.fail('Erro na verificação do ambiente');
            throw error;
        }
    }

    private async createDirectories(): Promise<void> {
        const spinner = ora('Criando estrutura de pastas...').start();

        try {
            const dirs = [
                'src/consolidated',
                'src/consolidated/hooks',
                'src/consolidated/services',
                'src/consolidated/schemas',
                'src/optimization',
                'src/migration',
                'scripts',
                'migration-logs',
                'backups'
            ];

            if (this.config.createBackupDir) {
                dirs.push('backups/pre-migration');
            }

            for (const dir of dirs) {
                const fullPath = path.join(this.config.projectDir, dir);
                await fs.mkdir(fullPath, { recursive: true });
            }

            // Cria arquivos .gitkeep para manter pastas vazias
            for (const dir of ['migration-logs', 'backups']) {
                const gitkeepPath = path.join(this.config.projectDir, dir, '.gitkeep');
                await fs.writeFile(gitkeepPath, '');
            }

            spinner.succeed('Estrutura de pastas criada');

        } catch (error) {
            spinner.fail('Erro na criação de pastas');
            throw error;
        }
    }

    private async installDependencies(): Promise<void> {
        if (!this.config.installDeps) return;

        const spinner = ora('Instalando dependências...').start();

        try {
            const devDependencies = [
                'commander',
                'chalk',
                'inquirer',
                'ora',
                '@types/inquirer',
                'ts-node',
                'typescript'
            ];

            const dependencies = [
                'zustand',
                'zod',
                'wouter'
            ];

            spinner.text = 'Instalando dependências de desenvolvimento...';
            execSync(`npm install --save-dev ${devDependencies.join(' ')}`, {
                cwd: this.config.projectDir,
                stdio: 'pipe'
            });

            spinner.text = 'Instalando dependências de produção...';
            execSync(`npm install ${dependencies.join(' ')}`, {
                cwd: this.config.projectDir,
                stdio: 'pipe'
            });

            spinner.succeed('Dependências instaladas');

        } catch (error) {
            spinner.fail('Erro na instalação de dependências');
            throw error;
        }
    }

    private async setupScripts(): Promise<void> {
        const spinner = ora('Configurando scripts...').start();

        try {
            // Atualiza package.json com scripts de migração
            const packageJsonPath = path.join(this.config.projectDir, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

            packageJson.scripts = {
                ...packageJson.scripts,
                'migrate:analyze': 'ts-node scripts/migrate.ts analyze',
                'migrate:run': 'ts-node scripts/migrate.ts run',
                'migrate:dry-run': 'ts-node scripts/migrate.ts run --dry-run',
                'migrate:status': 'ts-node scripts/migrate.ts status',
                'migrate:rollback': 'ts-node scripts/migrate.ts rollback',
                'migrate:validate': 'ts-node scripts/migrate.ts validate',
                'migrate:interactive': 'ts-node scripts/migrate.ts run --interactive'
            };

            await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

            // Torna o script executável
            const migratePath = path.join(this.config.projectDir, 'scripts/migrate.ts');
            try {
                await fs.chmod(migratePath, '755');
            } catch {
                // Ignore chmod errors on Windows
            }

            spinner.succeed('Scripts configurados');

        } catch (error) {
            spinner.fail('Erro na configuração de scripts');
            throw error;
        }
    }

    private async validateSetup(): Promise<void> {
        const spinner = ora('Validando setup...').start();

        try {
            // Testa se o CLI funciona
            execSync('npm run migrate:analyze --help', {
                cwd: this.config.projectDir,
                stdio: 'pipe'
            });

            // Verifica se os arquivos principais existem
            const requiredFiles = [
                'src/migration/MigrationSystem.ts',
                'src/optimization/BundleOptimizer.ts',
                'scripts/migrate.ts'
            ];

            for (const file of requiredFiles) {
                const filePath = path.join(this.config.projectDir, file);
                try {
                    await fs.access(filePath);
                } catch {
                    throw new Error(`Arquivo obrigatório não encontrado: ${file}`);
                }
            }

            spinner.succeed('Setup validado com sucesso');

        } catch (error) {
            spinner.fail('Erro na validação');
            throw error;
        }
    }

    private isNodeVersionValid(version: string): boolean {
        const major = parseInt(version.replace('v', '').split('.')[0]);
        return major >= 16;
    }

    private printNextSteps(): void {
        console.log('\n' + chalk.blue.bold('🎯 PRÓXIMOS PASSOS:'));
        console.log(chalk.gray('─'.repeat(30)));

        console.log(chalk.green('1.') + ' Analise o projeto:');
        console.log(chalk.cyan('   npm run migrate:analyze'));

        console.log(chalk.green('\n2.') + ' Execute migração em modo preview:');
        console.log(chalk.cyan('   npm run migrate:dry-run'));

        console.log(chalk.green('\n3.') + ' Migração interativa:');
        console.log(chalk.cyan('   npm run migrate:interactive'));

        console.log(chalk.green('\n4.') + ' Migração completa:');
        console.log(chalk.cyan('   npm run migrate:run'));

        console.log(chalk.green('\n5.') + ' Verifique status:');
        console.log(chalk.cyan('   npm run migrate:status'));

        console.log(chalk.yellow('\n💡 DICAS:'));
        console.log('• Use --dry-run para preview sem alterações');
        console.log('• Mode interativo permite escolher arquivos específicos');
        console.log('• Backups automáticos são criados antes das mudanças');
        console.log('• Use rollback em caso de problemas');

        console.log(chalk.green('\n🎉 Sistema de migração pronto para uso!'));
    }
}

// === CONFIGURAÇÃO E EXECUÇÃO ===

export async function setupMigration(config: Partial<SetupConfig> = {}): Promise<void> {
    const fullConfig: SetupConfig = {
        projectDir: process.cwd(),
        createBackupDir: true,
        installDeps: true,
        runTests: false,
        ...config
    };

    const setup = new MigrationSetup(fullConfig);
    await setup.run();
}

// Execução direta via CLI
if (require.main === module) {
    setupMigration().catch(error => {
        console.error(chalk.red('❌ Erro no setup:'), error);
        process.exit(1);
    });
}

export default setupMigration;