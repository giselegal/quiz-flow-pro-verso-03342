/**
 * 🔍 TESTE DE INSPEÇÃO - Quais JSONs o Código Real Carrega
 * 
 * Analisa o código-fonte para identificar TODOS os pontos
 * onde arquivos JSON são importados ou carregados
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

interface JsonReference {
  file: string;
  line: number;
  type: 'static-import' | 'dynamic-import' | 'fetch' | 'fs-read';
  pattern: string;
  jsonPath?: string;
}

describe('🔍 Inspeção de Carregamento de JSONs no Código Real', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const srcDir = path.join(projectRoot, 'src');

  // Função helper para buscar recursivamente
  function findFiles(dir: string, pattern: RegExp): string[] {
    const results: string[] = [];
    
    if (!fs.existsSync(dir)) return results;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.git')) {
          results.push(...findFiles(filePath, pattern));
        }
      } else if (pattern.test(file)) {
        results.push(filePath);
      }
    }
    
    return results;
  }

  // Função para analisar imports de JSON em um arquivo
  function analyzeJsonImports(filePath: string): JsonReference[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const references: JsonReference[] = [];
    const relativePath = path.relative(projectRoot, filePath);

    lines.forEach((line, index) => {
      // Static import: import data from './file.json'
      if (/import\s+.*from\s+['"].*\.json['"]/.test(line)) {
        const match = line.match(/from\s+['"](.*\.json)['"]/);
        references.push({
          file: relativePath,
          line: index + 1,
          type: 'static-import',
          pattern: line.trim(),
          jsonPath: match?.[1],
        });
      }

      // Dynamic import: import('./file.json')
      if (/import\s*\(\s*['"].*\.json['"]/.test(line)) {
        const match = line.match(/import\s*\(\s*['"](.*\.json)['"]/);
        references.push({
          file: relativePath,
          line: index + 1,
          type: 'dynamic-import',
          pattern: line.trim(),
          jsonPath: match?.[1],
        });
      }

      // Fetch: fetch('/templates/...')
      if (/fetch\s*\(.*\.json/.test(line)) {
        const match = line.match(/fetch\s*\(\s*['"`](.*\.json)['"`]/);
        references.push({
          file: relativePath,
          line: index + 1,
          type: 'fetch',
          pattern: line.trim(),
          jsonPath: match?.[1],
        });
      }

      // fs.readFile: fs.readFileSync('...json')
      if (/fs\.read.*\.json/.test(line)) {
        const match = line.match(/['"`](.*\.json)['"`]/);
        references.push({
          file: relativePath,
          line: index + 1,
          type: 'fs-read',
          pattern: line.trim(),
          jsonPath: match?.[1],
        });
      }
    });

    return references;
  }

  describe('Inspeção de Arquivos TypeScript/JavaScript', () => {
    it('deve encontrar TODOS os imports de JSON no código', () => {
      const tsFiles = findFiles(srcDir, /\.(ts|tsx|js|jsx)$/);
      const allReferences: JsonReference[] = [];

      console.log(`\n🔍 Analisando ${tsFiles.length} arquivos...`);

      for (const file of tsFiles) {
        const refs = analyzeJsonImports(file);
        allReferences.push(...refs);
      }

      console.log(`\n📊 Total de referências a JSONs: ${allReferences.length}`);
      
      if (allReferences.length > 0) {
        console.log('\n📄 JSONs referenciados no código:');
        
        const byType = allReferences.reduce((acc, ref) => {
          acc[ref.type] = (acc[ref.type] || []);
          acc[ref.type].push(ref);
          return acc;
        }, {} as Record<string, JsonReference[]>);

        Object.entries(byType).forEach(([type, refs]) => {
          console.log(`\n  ${type.toUpperCase()} (${refs.length}):`);
          refs.slice(0, 10).forEach(ref => {
            console.log(`    📍 ${ref.file}:${ref.line}`);
            console.log(`       ${ref.pattern}`);
            if (ref.jsonPath) {
              console.log(`       → ${ref.jsonPath}`);
            }
          });
          if (refs.length > 10) {
            console.log(`    ... e mais ${refs.length - 10} referências`);
          }
        });
      } else {
        console.log('⚠️ Nenhuma referência direta a JSON encontrada');
      }

      expect(tsFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Inspeção do Diretório de Templates', () => {
    it('deve listar TODOS os arquivos JSON em /templates', () => {
      const templatesDir = path.join(projectRoot, 'templates');
      
      if (!fs.existsSync(templatesDir)) {
        console.log('\n⚠️ Diretório /templates não existe');
        return;
      }

      const jsonFiles = findFiles(templatesDir, /\.json$/);
      
      console.log(`\n📂 Arquivos JSON em /templates:`);
      console.log(`   Total: ${jsonFiles.length} arquivo(s)`);
      
      if (jsonFiles.length > 0) {
        const byTemplate = jsonFiles.reduce((acc, file) => {
          const relativePath = path.relative(templatesDir, file);
          const templateName = relativePath.split(path.sep)[0];
          acc[templateName] = (acc[templateName] || []);
          acc[templateName].push(relativePath);
          return acc;
        }, {} as Record<string, string[]>);

        Object.entries(byTemplate).forEach(([template, files]) => {
          console.log(`\n   ${template}/ (${files.length} arquivos):`);
          files.sort().forEach(file => {
            console.log(`     - ${file}`);
          });
        });
      }

      expect(jsonFiles.length).toBeGreaterThanOrEqual(0);
    });

    it('deve listar JSONs em /src/templates', () => {
      const srcTemplatesDir = path.join(srcDir, 'templates');
      
      if (!fs.existsSync(srcTemplatesDir)) {
        console.log('\n⚠️ Diretório /src/templates não existe');
        return;
      }

      const jsonFiles = findFiles(srcTemplatesDir, /\.json$/);
      
      console.log(`\n📂 Arquivos JSON em /src/templates:`);
      console.log(`   Total: ${jsonFiles.length} arquivo(s)`);
      
      if (jsonFiles.length > 0) {
        jsonFiles.forEach(file => {
          const relativePath = path.relative(srcTemplatesDir, file);
          const size = fs.statSync(file).size;
          console.log(`     - ${relativePath} (${(size / 1024).toFixed(2)} KB)`);
        });
      }

      expect(jsonFiles.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Análise de Arquivos Específicos', () => {
    it('deve analisar HierarchicalTemplateSource.ts', () => {
      const filePath = path.join(srcDir, 'services/core/HierarchicalTemplateSource.ts');
      
      if (!fs.existsSync(filePath)) {
        console.log('\n⚠️ Arquivo não encontrado');
        return;
      }

      const references = analyzeJsonImports(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      console.log('\n📄 HierarchicalTemplateSource.ts:');
      console.log(`   Tamanho: ${content.length} caracteres`);
      console.log(`   Linhas: ${content.split('\n').length}`);
      console.log(`   Referências a JSON: ${references.length}`);

      if (references.length > 0) {
        console.log('\n   JSONs referenciados:');
        references.forEach(ref => {
          console.log(`     Linha ${ref.line}: ${ref.pattern}`);
        });
      }

      // Buscar menções a loadStepFromJson
      const loadStepMatches = content.match(/loadStepFromJson/g);
      console.log(`\n   Menções a "loadStepFromJson": ${loadStepMatches?.length || 0}`);

      // Buscar imports
      const imports = content.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g);
      console.log(`\n   Imports no arquivo:`);
      imports?.slice(0, 10).forEach(imp => {
        console.log(`     ${imp}`);
      });

      expect(content.length).toBeGreaterThan(0);
    });

    it('deve analisar jsonStepLoader.ts', () => {
      const possiblePaths = [
        path.join(srcDir, 'templates/loaders/jsonStepLoader.ts'),
        path.join(srcDir, 'loaders/jsonStepLoader.ts'),
        path.join(srcDir, 'services/loaders/jsonStepLoader.ts'),
      ];

      let filePath: string | null = null;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          filePath = p;
          break;
        }
      }

      if (!filePath) {
        console.log('\n⚠️ jsonStepLoader.ts não encontrado em:');
        possiblePaths.forEach(p => console.log(`   - ${path.relative(projectRoot, p)}`));
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const references = analyzeJsonImports(filePath);

      console.log(`\n📄 jsonStepLoader.ts encontrado em:`);
      console.log(`   ${path.relative(projectRoot, filePath)}`);
      console.log(`   Tamanho: ${content.length} caracteres`);
      console.log(`   Referências a JSON: ${references.length}`);

      if (references.length > 0) {
        console.log('\n   JSONs carregados:');
        references.forEach(ref => {
          console.log(`     Linha ${ref.line}: ${ref.jsonPath}`);
        });
      }

      // Buscar padrões de carregamento
      const dynamicImports = content.match(/import\s*\([^)]+\)/g);
      if (dynamicImports) {
        console.log(`\n   Dynamic imports (${dynamicImports.length}):`);
        dynamicImports.forEach(imp => {
          console.log(`     ${imp}`);
        });
      }

      expect(content.length).toBeGreaterThan(0);
    });

    it('deve analisar TemplateService.ts', () => {
      const filePath = path.join(srcDir, 'services/canonical/TemplateService.ts');
      
      if (!fs.existsSync(filePath)) {
        console.log('\n⚠️ TemplateService.ts não encontrado');
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const references = analyzeJsonImports(filePath);

      console.log('\n📄 TemplateService.ts:');
      console.log(`   Tamanho: ${content.length} caracteres`);
      console.log(`   Linhas: ${content.split('\n').length}`);
      console.log(`   Referências a JSON: ${references.length}`);

      // Buscar uso de HierarchicalTemplateSource
      const hierarchicalMatches = content.match(/hierarchicalTemplateSource\.\w+/g);
      if (hierarchicalMatches) {
        const uniqueMethods = [...new Set(hierarchicalMatches)];
        console.log(`\n   Métodos usados de HierarchicalTemplateSource:`);
        uniqueMethods.forEach(method => {
          console.log(`     - ${method}`);
        });
      }

      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('Relatório Completo de JSONs', () => {
    it('deve gerar relatório completo de todos os JSONs no projeto', () => {
      console.log('\n' + '='.repeat(70));
      console.log('📊 RELATÓRIO COMPLETO DE JSONs NO PROJETO');
      console.log('='.repeat(70));

      // 1. JSONs na raiz
      const rootJsons = fs.readdirSync(projectRoot).filter(f => f.endsWith('.json'));
      console.log(`\n1. JSONs na raiz do projeto (${rootJsons.length}):`);
      rootJsons.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (rootJsons.length > 10) {
        console.log(`   ... e mais ${rootJsons.length - 10}`);
      }

      // 2. JSONs em /templates
      const templatesDir = path.join(projectRoot, 'templates');
      if (fs.existsSync(templatesDir)) {
        const templateJsons = findFiles(templatesDir, /\.json$/);
        console.log(`\n2. JSONs em /templates (${templateJsons.length}):`);
        templateJsons.slice(0, 20).forEach(f => {
          const rel = path.relative(projectRoot, f);
          console.log(`   - ${rel}`);
        });
        if (templateJsons.length > 20) {
          console.log(`   ... e mais ${templateJsons.length - 20}`);
        }
      }

      // 3. JSONs em /src
      const srcJsons = findFiles(srcDir, /\.json$/);
      console.log(`\n3. JSONs em /src (${srcJsons.length}):`);
      srcJsons.slice(0, 10).forEach(f => {
        const rel = path.relative(srcDir, f);
        console.log(`   - ${rel}`);
      });
      if (srcJsons.length > 10) {
        console.log(`   ... e mais ${srcJsons.length - 10}`);
      }

      // 4. Análise de código
      const tsFiles = findFiles(srcDir, /\.(ts|tsx)$/);
      let totalReferences = 0;
      for (const file of tsFiles) {
        totalReferences += analyzeJsonImports(file).length;
      }

      console.log(`\n4. Análise de código:`);
      console.log(`   - Arquivos TypeScript: ${tsFiles.length}`);
      console.log(`   - Referências a JSONs no código: ${totalReferences}`);

      console.log('\n' + '='.repeat(70));

      expect(rootJsons.length).toBeGreaterThanOrEqual(0);
    });
  });
});
