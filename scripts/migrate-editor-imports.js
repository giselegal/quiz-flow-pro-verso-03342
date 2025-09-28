#!/usr/bin/env node

/**
 * 🔄 SCRIPT DE MIGRAÇÃO AUTOMÁTICA - EDITOR IMPORTS
 * 
 * Este script migra automaticamente todas as importações de useEditor
 * dos providers conflitantes para o adaptador unificado.
 * 
 * USO:
 * - node scripts/migrate-editor-imports.js --dry-run (simular)
 * - node scripts/migrate-editor-imports.js --apply (aplicar mudanças)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configurações
const CONFIG = {
  sourceDir: 'src',
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/EditorProviderMigrationAdapter.tsx', // Não migrar o próprio adaptador
  ],
  patterns: {
    // Padrões de importação a serem migrados
    legacyContext: {
      pattern: /import\s*{\s*([^}]*useEditor[^}]*)\s*}\s*from\s*['"]@\/context\/EditorContext['"];?/g,
      replacement: "import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';"
    },
    legacyContextWithProvider: {
      pattern: /import\s*{\s*([^}]*EditorProvider[^}]*)\s*}\s*from\s*['"]@\/context\/EditorContext['"];?/g,
      replacement: "import { EditorProvider } from '@/components/editor/EditorProviderMigrationAdapter';"
    },
    modernProvider: {
      pattern: /import\s*{\s*([^}]*useEditor[^}]*)\s*}\s*from\s*['"]@\/components\/editor\/EditorProvider['"];?/g,
      replacement: "import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';"
    },
    modernProviderWithProvider: {
      pattern: /import\s*{\s*([^}]*EditorProvider[^}]*)\s*}\s*from\s*['"]@\/components\/editor\/EditorProvider['"];?/g,
      replacement: "import { EditorProvider } from '@/components/editor/EditorProviderMigrationAdapter';"
    }
  }
};

class EditorImportMigrator {
  constructor() {
    this.dryRun = process.argv.includes('--dry-run');
    this.apply = process.argv.includes('--apply');
    this.stats = {
      filesScanned: 0,
      filesModified: 0,
      importsReplaced: 0,
      errors: []
    };
  }

  async migrate() {
    console.log('🔄 INICIANDO MIGRAÇÃO DE IMPORTS DO EDITOR\n');
    
    if (this.dryRun) {
      console.log('🧪 MODO DRY-RUN: Apenas simulando mudanças\n');
    } else if (this.apply) {
      console.log('✅ MODO APLICAR: Fazendo mudanças reais\n');
    } else {
      console.log('❌ Especifique --dry-run ou --apply');
      process.exit(1);
    }

    try {
      const files = await this.findFiles();
      console.log(`📁 Encontrados ${files.length} arquivos para análise\n`);

      for (const file of files) {
        await this.processFile(file);
      }

      this.printSummary();
    } catch (error) {
      console.error('❌ Erro durante migração:', error);
      process.exit(1);
    }
  }

  async findFiles() {
    const patterns = [
      `${CONFIG.sourceDir}/**/*.tsx`,
      `${CONFIG.sourceDir}/**/*.ts`,
      `${CONFIG.sourceDir}/**/*.jsx`,
      `${CONFIG.sourceDir}/**/*.js`
    ];

    let files = [];
    for (const pattern of patterns) {
      const found = glob.sync(pattern, { ignore: CONFIG.excludePatterns });
      files = files.concat(found);
    }

    // Remover duplicatas
    return [...new Set(files)];
  }

  async processFile(filePath) {
    this.stats.filesScanned++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let modifiedContent = content;
      let hasChanges = false;

      // Aplicar cada padrão de migração
      for (const [name, config] of Object.entries(CONFIG.patterns)) {
        const matches = [...modifiedContent.matchAll(config.pattern)];
        
        if (matches.length > 0) {
          console.log(`🔍 ${filePath}: Encontradas ${matches.length} importações para migrar (${name})`);
          
          for (const match of matches) {
            console.log(`  - ${match[0].trim()}`);
            this.stats.importsReplaced++;
          }

          modifiedContent = modifiedContent.replace(config.pattern, config.replacement);
          hasChanges = true;
        }
      }

      // Verificar e aplicar mudanças se necessário
      if (hasChanges) {
        this.stats.filesModified++;
        
        if (this.apply) {
          // Criar backup
          const backupPath = `${filePath}.backup-migration`;
          fs.writeFileSync(backupPath, originalContent);
          
          // Aplicar mudanças
          fs.writeFileSync(filePath, modifiedContent);
          console.log(`✅ ${filePath}: Migrado (backup em ${backupPath})`);
        } else {
          console.log(`🧪 ${filePath}: Seria migrado`);
        }
        
        console.log(''); // Linha em branco para separar
      }

    } catch (error) {
      this.stats.errors.push({
        file: filePath,
        error: error.message
      });
      console.error(`❌ Erro processando ${filePath}: ${error.message}`);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(60));
    console.log(`📁 Arquivos escaneados: ${this.stats.filesScanned}`);
    console.log(`📝 Arquivos modificados: ${this.stats.filesModified}`);
    console.log(`🔄 Importações migradas: ${this.stats.importsReplaced}`);
    console.log(`❌ Erros: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      this.stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }

    if (this.stats.filesModified > 0) {
      console.log('\n📋 PRÓXIMOS PASSOS:');
      console.log('1. Testar o sistema após a migração');
      console.log('2. Verificar se todos os componentes funcionam');
      console.log('3. Remover arquivos de backup se tudo estiver OK');
      console.log('4. Proceder com a limpeza dos providers antigos');
    }

    console.log('\n✅ Migração concluída!');
  }
}

// Adicionar verificação de dependências
function checkDependencies() {
  try {
    require('glob');
  } catch (error) {
    console.error('❌ Dependência "glob" não encontrada. Instale com: npm install glob');
    process.exit(1);
  }
}

// Executar migração
async function main() {
  checkDependencies();
  const migrator = new EditorImportMigrator();
  await migrator.migrate();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { EditorImportMigrator };
