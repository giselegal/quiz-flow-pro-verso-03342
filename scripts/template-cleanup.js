#!/usr/bin/env node

/**
 * Script Inteligente: Limpeza de Imports e Padronização
 * Remove imports React desnecessários e aplica Prettier
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STEPS_DIR = path.join(__dirname, '../src/components/steps');

class TemplateCleanup {
  constructor() {
    this.results = {
      cleaned: [],
      errors: [],
      totalImportsRemoved: 0,
    };
  }

  async run() {
    console.log('🧹 Iniciando limpeza inteligente...\n');
    
    await this.cleanAllTemplates();
    await this.standardizeStructure();
    await this.formatWithPrettier();
    
    this.generateReport();
  }

  async cleanAllTemplates() {
    const templateFiles = fs.readdirSync(STEPS_DIR)
      .filter(file => file.match(/Step\d+Template\.tsx$/));
    
    for (const fileName of templateFiles) {
      try {
        const filePath = path.join(STEPS_DIR, fileName);
        console.log(`🧹 Limpando ${fileName}...`);
        
        await this.cleanTemplate(filePath);
        this.results.cleaned.push(fileName);
      } catch (error) {
        console.error(`❌ Erro ao limpar ${fileName}:`, error.message);
        this.results.errors.push(`${fileName}: ${error.message}`);
      }
    }
  }

  async cleanTemplate(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let importsRemoved = 0;
    
    // Remover imports React se não são React components
    if (!content.includes('React.FC') && !content.includes('interface') && !content.includes('useEffect')) {
      if (content.includes('import React')) {
        content = content.replace(/import React[^;]*;\n?/g, '');
        importsRemoved++;
      }
      
      // Remover outras imports desnecessárias para templates modulares
      const unnecessaryImports = [
        /import.*\{ useEffect \}.*;\n?/g,
        /import.*\{ useState \}.*;\n?/g,
        /import.*\{ useCallback \}.*;\n?/g,
      ];
      
      unnecessaryImports.forEach(importPattern => {
        if (importPattern.test(content)) {
          content = content.replace(importPattern, '');
          importsRemoved++;
        }
      });
    }
    
    // Limpar linhas vazias excessivas
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    // Garantir que termina com uma linha vazia
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    
    fs.writeFileSync(filePath, content);
    this.results.totalImportsRemoved += importsRemoved;
  }

  async standardizeStructure() {
    console.log('\n📐 Padronizando estrutura...');
    
    const templateFiles = fs.readdirSync(STEPS_DIR)
      .filter(file => file.match(/Step\d+Template\.tsx$/));
    
    for (const fileName of templateFiles) {
      const filePath = path.join(STEPS_DIR, fileName);
      await this.standardizeTemplate(filePath);
    }
  }

  async standardizeTemplate(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Garantir padrão de export
    const stepMatch = path.basename(filePath).match(/Step(\d+)/);
    if (stepMatch) {
      const stepNum = stepMatch[1];
      const funcName = `getStep${stepNum}Template`;
      
      // Adicionar export default se não existir
      if (!content.includes('export default')) {
        content = content.replace(
          new RegExp(`export const ${funcName}`),
          `export const ${funcName}`
        );
        
        if (!content.includes(`export default ${funcName}`)) {
          content += `\nexport default ${funcName};\n`;
        }
      }
    }
    
    fs.writeFileSync(filePath, content);
  }

  async formatWithPrettier() {
    console.log('\n🎨 Aplicando Prettier...');
    
    try {
      // Aplicar prettier em todos os templates
      execSync(`npx prettier --write "${STEPS_DIR}/Step*Template.tsx"`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
      
      console.log('✅ Prettier aplicado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao aplicar Prettier:', error.message);
    }
  }

  generateReport() {
    console.log('\n📊 RELATÓRIO DE LIMPEZA:\n');
    
    console.log(`✅ Templates limpos: ${this.results.cleaned.length}`);
    console.log(`🗑️  Imports removidos: ${this.results.totalImportsRemoved}`);
    
    if (this.results.errors.length > 0) {
      console.log(`\n❌ Erros: ${this.results.errors.length}`);
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎯 Templates padronizados e formatados!');
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new TemplateCleanup();
  cleanup.run().catch(console.error);
}

export default TemplateCleanup;
