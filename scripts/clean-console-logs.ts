#!/usr/bin/env tsx
/**
 * 🧹 Clean Console Logs Script
 * 
 * Substitui console.log/warn/error por appLogger.* no projeto
 * 
 * Uso:
 *   npm run clean:logs -- --dry-run  # Preview mudanças
 *   npm run clean:logs               # Aplicar mudanças
 *   npm run clean:logs -- --path src/services  # Escopo específico
 */

import { Project, SyntaxKind, SourceFile, CallExpression } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

interface CleanOptions {
  dryRun: boolean;
  path?: string;
  verbose: boolean;
}

interface ConsoleStat {
  file: string;
  line: number;
  method: string;
  original: string;
  replacement: string;
}

class ConsoleLogCleaner {
  private project: Project;
  private stats: ConsoleStat[] = [];

  constructor(private options: CleanOptions) {
    this.project = new Project({
      tsConfigFilePath: path.resolve(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
  }

  async clean(): Promise<void> {
    console.log('🔍 Procurando console.* calls...\n');

    const targetPath = this.options.path || 'src';
    const pattern = path.resolve(process.cwd(), targetPath, '**/*.{ts,tsx}');

    // Adicionar arquivos ao projeto
    const files = this.project.addSourceFilesAtPaths(pattern);

    console.log(`📁 Analisando ${files.length} arquivos em ${targetPath}/\n`);

    // Processar cada arquivo
    for (const file of files) {
      await this.processFile(file);
    }

    // Exibir resultados
    this.printSummary();

    // Aplicar mudanças se não for dry-run
    if (!this.options.dryRun && this.stats.length > 0) {
      console.log('\n💾 Salvando mudanças...');
      await this.project.save();
      console.log('✅ Mudanças aplicadas com sucesso!');
    } else if (this.options.dryRun && this.stats.length > 0) {
      console.log('\n⚠️  Modo dry-run: nenhuma mudança foi aplicada.');
      console.log('Execute sem --dry-run para aplicar as mudanças.');
    }
  }

  private async processFile(file: SourceFile): Promise<void> {
    const filePath = file.getFilePath();
    
    // Ignorar arquivos de teste e config
    if (this.shouldSkipFile(filePath)) {
      return;
    }

    // Encontrar todos os console.* calls
    const consoleCalls = file.getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(call => this.isConsoleCall(call));

    if (consoleCalls.length === 0) return;

    // Adicionar import do appLogger se necessário
    if (!this.hasAppLoggerImport(file)) {
      this.addAppLoggerImport(file);
    }

    // Processar cada console call
    for (const call of consoleCalls) {
      this.replaceConsoleCall(file, call);
    }
  }

  private shouldSkipFile(filePath: string): boolean {
    const skipPatterns = [
      /\.test\.(ts|tsx)$/,
      /\.spec\.(ts|tsx)$/,
      /__tests__\//,
      /\/tests?\//,
      /\.config\.(ts|js)$/,
      /appLogger\.ts$/,
      /node_modules\//,
    ];

    return skipPatterns.some(pattern => pattern.test(filePath));
  }

  private isConsoleCall(call: CallExpression): boolean {
    const expression = call.getExpression();
    
    if (expression.getKind() !== SyntaxKind.PropertyAccessExpression) {
      return false;
    }

    const text = expression.getText();
    return /^console\.(log|info|warn|error|debug)/.test(text);
  }

  private hasAppLoggerImport(file: SourceFile): boolean {
    const imports = file.getImportDeclarations();
    return imports.some(imp => 
      imp.getModuleSpecifierValue().includes('appLogger')
    );
  }

  private addAppLoggerImport(file: SourceFile): void {
    // Adicionar import no topo do arquivo, após outros imports
    const existingImports = file.getImportDeclarations();
    const importStatement = "import { appLogger } from '@/lib/utils/appLogger';";

    if (existingImports.length > 0) {
      const lastImport = existingImports[existingImports.length - 1];
      // Adicionar após o último import
      file.insertStatements(lastImport.getChildIndex() + 1, importStatement);
    } else {
      // Adicionar no início do arquivo
      file.insertStatements(0, importStatement);
    }
  }

  private replaceConsoleCall(file: SourceFile, call: CallExpression): void {
    const expression = call.getExpression();
    const text = expression.getText();
    const match = text.match(/^console\.(log|info|warn|error|debug)/);
    
    if (!match) return;

    const method = match[1];
    const appLoggerMethod = method === 'log' ? 'info' : method;
    
    const args = call.getArguments();
    const originalText = call.getText();
    
    // Gerar replacement baseado no número de argumentos
    let replacement: string;
    
    if (args.length === 0) {
      replacement = `appLogger.${appLoggerMethod}('Empty log call')`;
    } else if (args.length === 1) {
      const arg = args[0].getText();
      // Se é string literal, usar diretamente
      if (arg.startsWith("'") || arg.startsWith('"') || arg.startsWith('`')) {
        replacement = `appLogger.${appLoggerMethod}(${arg})`;
      } else {
        // Se não é string, converter para string
        replacement = `appLogger.${appLoggerMethod}(String(${arg}))`;
      }
    } else {
      // Múltiplos argumentos: primeiro é mensagem, resto é contexto
      const firstArg = args[0].getText();
      const restArgs = args.slice(1).map(a => a.getText()).join(', ');
      
      if (firstArg.startsWith("'") || firstArg.startsWith('"') || firstArg.startsWith('`')) {
        replacement = `appLogger.${appLoggerMethod}(${firstArg}, { data: [${restArgs}] })`;
      } else {
        replacement = `appLogger.${appLoggerMethod}(String(${firstArg}), { data: [${restArgs}] })`;
      }
    }

    // Registrar estatística
    this.stats.push({
      file: file.getFilePath(),
      line: call.getStartLineNumber(),
      method,
      original: originalText,
      replacement,
    });

    // Substituir na árvore
    call.replaceWithText(replacement);

    if (this.options.verbose) {
      console.log(`  📝 ${path.relative(process.cwd(), file.getFilePath())}:${call.getStartLineNumber()}`);
      console.log(`     - ${originalText}`);
      console.log(`     + ${replacement}\n`);
    }
  }

  private printSummary(): void {
    if (this.stats.length === 0) {
      console.log('✨ Nenhum console.* encontrado. Código limpo!');
      return;
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   Total de substituições: ${this.stats.length}`);

    // Agrupar por método
    const byMethod = this.stats.reduce((acc, stat) => {
      acc[stat.method] = (acc[stat.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n   Por método:`);
    Object.entries(byMethod).forEach(([method, count]) => {
      console.log(`     console.${method}: ${count}`);
    });

    // Agrupar por arquivo
    const byFile = this.stats.reduce((acc, stat) => {
      const relPath = path.relative(process.cwd(), stat.file);
      acc[relPath] = (acc[relPath] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n   Arquivos modificados: ${Object.keys(byFile).length}`);
    
    // Top 10 arquivos mais afetados
    const topFiles = Object.entries(byFile)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    console.log(`\n   Top 10 arquivos:`);
    topFiles.forEach(([file, count], index) => {
      console.log(`     ${index + 1}. ${file}: ${count}`);
    });
  }
}

// CLI parsing
function parseArgs(): CleanOptions {
  const args = process.argv.slice(2);
  
  return {
    dryRun: args.includes('--dry-run'),
    path: args.find(arg => arg.startsWith('--path='))?.split('=')[1],
    verbose: args.includes('--verbose') || args.includes('-v'),
  };
}

// Main execution
async function main() {
  const options = parseArgs();
  
  console.log('🧹 Console Log Cleaner\n');
  console.log(`Mode: ${options.dryRun ? '🔍 DRY RUN (preview)' : '💾 APPLY changes'}`);
  if (options.path) {
    console.log(`Scope: ${options.path}`);
  }
  console.log('');

  const cleaner = new ConsoleLogCleaner(options);
  await cleaner.clean();
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
