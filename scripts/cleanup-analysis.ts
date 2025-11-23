#!/usr/bin/env node
/**
 * 🗑️  SCRIPT DE CLEANUP - FASE 3
 * 
 * Remove services deprecated e documenta consolidação
 */

import fs from 'fs';
import path from 'path';

const SERVICES_DIR = path.join(process.cwd(), 'src/services');
const DEPRECATED_PATTERNS = [
  /DEPRECATED/i,
  /Legacy/,
  /legacy/,
  /\.old\./,
  /\.backup\./,
];

interface DeprecatedFile {
  path: string;
  size: number;
  reason: string;
}

const deprecatedFiles: DeprecatedFile[] = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach(file => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Recursivo
      if (file.name !== 'node_modules' && file.name !== 'dist') {
        scanDirectory(filePath);
      }
    } else if (file.isFile()) {
      // Verificar se arquivo é deprecated
      const isDeprecated = DEPRECATED_PATTERNS.some(pattern => 
        pattern.test(file.name) || pattern.test(filePath)
      );

      if (isDeprecated) {
        const stats = fs.statSync(filePath);
        deprecatedFiles.push({
          path: filePath.replace(process.cwd(), '.'),
          size: stats.size,
          reason: file.name.includes('DEPRECATED') ? 'Nome com DEPRECATED' :
                  file.name.includes('Legacy') ? 'Nome com Legacy' :
                  'Padrão deprecated detectado',
        });
      }

      // Verificar conteúdo para TODO/FIXME de remoção
      if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (/@deprecated/i.test(content) || /TODO.*remove/i.test(content)) {
          const stats = fs.statSync(filePath);
          deprecatedFiles.push({
            path: filePath.replace(process.cwd(), '.'),
            size: stats.size,
            reason: '@deprecated ou TODO remove no código',
          });
        }
      }
    }
  });
}

function generateReport() {
  console.log('🗑️  RELATÓRIO DE CLEANUP - FASE 3\n');
  console.log('='.repeat(60) + '\n');

  if (deprecatedFiles.length === 0) {
    console.log('✅ Nenhum arquivo deprecated encontrado!\n');
    return;
  }

  const totalSize = deprecatedFiles.reduce((sum, f) => sum + f.size, 0);
  const totalSizeKB = (totalSize / 1024).toFixed(2);

  console.log(`📁 Arquivos deprecated encontrados: ${deprecatedFiles.length}`);
  console.log(`💾 Tamanho total: ${totalSizeKB} KB\n`);

  console.log('Lista de arquivos:\n');
  deprecatedFiles.forEach((file, i) => {
    console.log(`${i + 1}. ${file.path}`);
    console.log(`   Tamanho: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`   Razão: ${file.reason}`);
    console.log('');
  });

  // Salvar relatório
  const reportPath = path.join(process.cwd(), 'CLEANUP_REPORT.md');
  const reportContent = `# 🗑️  Relatório de Cleanup - FASE 3

**Data:** ${new Date().toISOString()}  
**Total de arquivos:** ${deprecatedFiles.length}  
**Tamanho total:** ${totalSizeKB} KB

## Arquivos para Remover

${deprecatedFiles.map((f, i) => `
### ${i + 1}. \`${f.path}\`
- **Tamanho:** ${(f.size / 1024).toFixed(2)} KB
- **Razão:** ${f.reason}
`).join('\n')}

## Recomendação

Para remover todos os arquivos deprecated:

\`\`\`bash
# BACKUP primeiro!
tar -czf deprecated-backup.tar.gz ${deprecatedFiles.map(f => f.path).join(' ')}

# Remover arquivos
${deprecatedFiles.map(f => `rm ${f.path}`).join('\n')}
\`\`\`

**⚠️  ATENÇÃO:** Teste completamente antes de remover!
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log(`💾 Relatório salvo em: ${reportPath}\n`);
}

function analyzeServiceDuplication() {
  console.log('🔍 Análise de Services Duplicados:\n');

  const coreServicesDir = path.join(SERVICES_DIR, 'core');
  if (!fs.existsSync(coreServicesDir)) {
    console.log('⚠️  Diretório /services/core não encontrado\n');
    return;
  }

  const coreFiles = fs.readdirSync(coreServicesDir)
    .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

  console.log(`📁 Arquivos em /services/core: ${coreFiles.length}`);

  // Agrupar por padrão de nome
  const patterns = {
    Unified: coreFiles.filter(f => /Unified/i.test(f)),
    Consolidated: coreFiles.filter(f => /Consolidated/i.test(f)),
    Contextual: coreFiles.filter(f => /Contextual/i.test(f)),
    Enhanced: coreFiles.filter(f => /Enhanced/i.test(f)),
  };

  console.log('\nAgrupamento por padrão:');
  Object.entries(patterns).forEach(([pattern, files]) => {
    if (files.length > 0) {
      console.log(`  ${pattern}: ${files.length} arquivos`);
    }
  });

  console.log('\n💡 Recomendação:');
  console.log('  Consolidar para 5 canonical services:');
  console.log('    1. templateService.ts');
  console.log('    2. funnelService.ts');
  console.log('    3. quizService.ts');
  console.log('    4. storageService.ts');
  console.log('    5. analyticsService.ts\n');
}

function main() {
  console.log('🚀 Iniciando análise de cleanup - FASE 3\n');

  // Scan /services
  scanDirectory(SERVICES_DIR);

  // Gerar relatório
  generateReport();

  // Análise de duplicação
  analyzeServiceDuplication();

  console.log('='.repeat(60));
  console.log('✅ Análise completa!\n');
}

main();
