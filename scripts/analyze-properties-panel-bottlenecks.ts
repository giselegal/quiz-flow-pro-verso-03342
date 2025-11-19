#!/usr/bin/env tsx
/**
 * 🔍 ANÁLISE DE GARGALOS - Painel de Propriedades
 * 
 * Investiga:
 * 1. Estrutura de blocos (aninhados vs planos)
 * 2. Conflitos properties vs content
 * 3. Validação excessiva
 * 4. Re-renders desnecessários
 * 5. Pontos cegos no fluxo de edição
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface AnalysisResult {
  category: string;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  issue: string;
  impact: string;
  solution: string;
  files: string[];
}

const results: AnalysisResult[] = [];

// ============================================================================
// 1. ANÁLISE DE ESTRUTURA DE BLOCOS
// ============================================================================

console.log('\n🔍 1. ANALISANDO ESTRUTURA DE BLOCOS...\n');

function analyzeBlockStructure() {
  const templatesDir = join(process.cwd(), 'src/templates');
  
  let totalBlocks = 0;
  let nestedBlocks = 0;
  let blocksWithParentId = 0;
  let blocksWithChildren = 0;
  let deeplyNested = 0;
  
  function scanDirectory(dir: string) {
    try {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.endsWith('.json')) {
          const content = readFileSync(fullPath, 'utf-8');
          const data = JSON.parse(content);
          
          // Analisar steps
          if (data.steps) {
            Object.values(data.steps).forEach((step: any) => {
              if (step.blocks) {
                step.blocks.forEach((block: any) => {
                  totalBlocks++;
                  
                  if (block.parentId) {
                    blocksWithParentId++;
                    nestedBlocks++;
                  }
                  
                  if (block.children && block.children.length > 0) {
                    blocksWithChildren++;
                  }
                  
                  // Verificar aninhamento profundo
                  if (block.parentId && block.children) {
                    deeplyNested++;
                  }
                });
              }
            });
          }
        }
      }
    } catch (error) {
      // Skip erros de arquivo
    }
  }
  
  scanDirectory(templatesDir);
  
  console.log(`📊 Total de blocos analisados: ${totalBlocks}`);
  console.log(`📦 Blocos com parentId: ${blocksWithParentId} (${((blocksWithParentId/totalBlocks)*100).toFixed(1)}%)`);
  console.log(`👶 Blocos com children: ${blocksWithChildren} (${((blocksWithChildren/totalBlocks)*100).toFixed(1)}%)`);
  console.log(`🏗️  Blocos profundamente aninhados: ${deeplyNested}`);
  
  if (nestedBlocks > 0) {
    results.push({
      category: 'ESTRUTURA DE BLOCOS',
      severity: 'ALTO',
      issue: `${nestedBlocks} blocos têm estrutura aninhada (parentId)`,
      impact: 'Painel de Propriedades não lida com hierarquia nested',
      solution: 'Implementar suporte a blocos nested ou achatar estrutura',
      files: ['PropertiesColumn/index.tsx', 'DynamicPropertyControls.tsx']
    });
  }
  
  if (deeplyNested > 0) {
    results.push({
      category: 'ESTRUTURA DE BLOCOS',
      severity: 'CRÍTICO',
      issue: `${deeplyNested} blocos têm aninhamento profundo (parent + children)`,
      impact: 'Editor não renderiza hierarquia corretamente',
      solution: 'Refatorar para estrutura plana ou implementar tree navigation',
      files: ['BlockDataNormalizer.ts']
    });
  }
}

analyzeBlockStructure();

// ============================================================================
// 2. ANÁLISE DO CONFLITO PROPERTIES VS CONTENT
// ============================================================================

console.log('\n🔍 2. ANALISANDO CONFLITO PROPERTIES VS CONTENT...\n');

function analyzePropertiesContentConflict() {
  const normalizerPath = join(process.cwd(), 'src/core/adapters/BlockDataNormalizer.ts');
  const normalizerCode = readFileSync(normalizerPath, 'utf-8');
  
  // Verificar se há duplicação de dados
  const hasMergeLogic = normalizerCode.includes('...block.properties') && 
                         normalizerCode.includes('...block.content');
  
  const hasSynchronization = normalizerCode.includes('createSynchronizedBlockUpdate');
  
  console.log(`✅ Tem lógica de merge: ${hasMergeLogic}`);
  console.log(`✅ Tem sincronização bidirecional: ${hasSynchronization}`);
  
  if (hasMergeLogic && hasSynchronization) {
    results.push({
      category: 'ARQUITETURA',
      severity: 'MÉDIO',
      issue: 'Duplicação de dados entre properties e content',
      impact: 'Overhead de memória e sincronização complexa',
      solution: 'Considerar unificar em uma única estrutura (properties OU content)',
      files: ['BlockDataNormalizer.ts', 'PropertiesColumn/index.tsx']
    });
  }
  
  // Verificar templates para ver distribuição de dados
  const templatesDir = join(process.cwd(), 'src/templates');
  let blocksUsingProperties = 0;
  let blocksUsingContent = 0;
  let blocksUsingBoth = 0;
  
  function scanTemplates(dir: string) {
    try {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanTemplates(fullPath);
        } else if (entry.endsWith('.json')) {
          const content = readFileSync(fullPath, 'utf-8');
          const data = JSON.parse(content);
          
          if (data.steps) {
            Object.values(data.steps).forEach((step: any) => {
              if (step.blocks) {
                step.blocks.forEach((block: any) => {
                  const hasProps = block.properties && Object.keys(block.properties).length > 0;
                  const hasContent = block.content && Object.keys(block.content).length > 0;
                  
                  if (hasProps && hasContent) blocksUsingBoth++;
                  else if (hasProps) blocksUsingProperties++;
                  else if (hasContent) blocksUsingContent++;
                });
              }
            });
          }
        }
      }
    } catch (error) {
      // Skip
    }
  }
  
  scanTemplates(templatesDir);
  
  console.log(`📊 Blocos usando properties: ${blocksUsingProperties}`);
  console.log(`📊 Blocos usando content: ${blocksUsingContent}`);
  console.log(`⚠️  Blocos usando AMBOS: ${blocksUsingBoth}`);
  
  if (blocksUsingBoth > 0) {
    results.push({
      category: 'ESTRUTURA DE DADOS',
      severity: 'ALTO',
      issue: `${blocksUsingBoth} blocos usam properties E content simultaneamente`,
      impact: 'Confusão sobre fonte de verdade, bugs de sincronização',
      solution: 'Normalizar todos os blocos para usar apenas properties',
      files: ['templates/*.json', 'BlockDataNormalizer.ts']
    });
  }
}

analyzePropertiesContentConflict();

// ============================================================================
// 3. ANÁLISE DE VALIDAÇÃO
// ============================================================================

console.log('\n🔍 3. ANALISANDO PERFORMANCE DE VALIDAÇÃO...\n');

function analyzeValidation() {
  const files = [
    'src/core/validation/UnifiedBlockValidator.ts',
    'src/lib/utils/templateValidation.ts',
    'src/lib/validation.ts',
    'src/types/schemas/templateSchema.ts'
  ];
  
  let totalValidationCalls = 0;
  const validationFiles: string[] = [];
  
  files.forEach(file => {
    try {
      const fullPath = join(process.cwd(), file);
      const content = readFileSync(fullPath, 'utf-8');
      
      // Contar chamadas de validação
      const validateMatches = content.match(/validate(Block|Properties|Schema)\(/g);
      if (validateMatches) {
        totalValidationCalls += validateMatches.length;
        validationFiles.push(file);
      }
    } catch (error) {
      // Skip
    }
  });
  
  console.log(`📊 Funções de validação encontradas: ${totalValidationCalls}`);
  console.log(`📁 Arquivos com validação: ${validationFiles.length}`);
  
  if (totalValidationCalls > 5) {
    results.push({
      category: 'PERFORMANCE',
      severity: 'MÉDIO',
      issue: `${totalValidationCalls} funções de validação diferentes`,
      impact: 'Validação redundante, overhead desnecessário',
      solution: 'Consolidar em UnifiedBlockValidator único',
      files: validationFiles
    });
  }
}

analyzeValidation();

// ============================================================================
// 4. ANÁLISE DE RE-RENDERS
// ============================================================================

console.log('\n🔍 4. ANALISANDO POTENCIAIS RE-RENDERS...\n');

function analyzeReRenders() {
  const propertiesColumnPath = join(process.cwd(), 'src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index.tsx');
  const code = readFileSync(propertiesColumnPath, 'utf-8');
  
  // Contar useEffects
  const useEffectCount = (code.match(/React\.useEffect|useEffect/g) || []).length;
  
  // Contar useStates
  const useStateCount = (code.match(/React\.useState|useState/g) || []).length;
  
  // Verificar React.memo
  const hasMemo = code.includes('React.memo');
  
  // Verificar useMemo/useCallback
  const hasMemoization = code.includes('useMemo') || code.includes('useCallback');
  
  console.log(`📊 useEffect hooks: ${useEffectCount}`);
  console.log(`📊 useState hooks: ${useStateCount}`);
  console.log(`✅ Usa React.memo: ${hasMemo}`);
  console.log(`✅ Usa memoization: ${hasMemoization}`);
  
  if (useEffectCount > 5) {
    results.push({
      category: 'PERFORMANCE',
      severity: 'MÉDIO',
      issue: `${useEffectCount} useEffect hooks no PropertiesColumn`,
      impact: 'Múltiplos side effects podem causar re-renders em cascata',
      solution: 'Consolidar useEffects relacionados',
      files: ['PropertiesColumn/index.tsx']
    });
  }
  
  if (!hasMemoization) {
    results.push({
      category: 'PERFORMANCE',
      severity: 'BAIXO',
      issue: 'Falta memoization em callbacks',
      impact: 'Re-renders desnecessários em componentes filhos',
      solution: 'Adicionar useCallback aos handlers (handleSave, handlePropertyChange)',
      files: ['PropertiesColumn/index.tsx']
    });
  }
}

analyzeReRenders();

// ============================================================================
// 5. ANÁLISE DE PONTOS CEGOS
// ============================================================================

console.log('\n🔍 5. PROCURANDO PONTOS CEGOS...\n');

function analyzeBlindSpots() {
  // Verificar se há tratamento de edge cases
  const propertiesColumnPath = join(process.cwd(), 'src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index.tsx');
  const code = readFileSync(propertiesColumnPath, 'utf-8');
  
  const hasNullCheck = code.includes('selectedBlock?') || code.includes('if (!selectedBlock)');
  const hasEmptyBlocksCheck = code.includes('blocks?.length') || code.includes('blocks && blocks.length');
  const hasSchemaFallback = code.includes('if (!schema)');
  const hasErrorBoundary = code.includes('ErrorBoundary') || code.includes('try {');
  
  console.log(`✅ Verifica null/undefined: ${hasNullCheck}`);
  console.log(`✅ Verifica array vazio: ${hasEmptyBlocksCheck}`);
  console.log(`✅ Fallback para schema ausente: ${hasSchemaFallback}`);
  console.log(`✅ Error boundary: ${hasErrorBoundary}`);
  
  if (!hasErrorBoundary) {
    results.push({
      category: 'ROBUSTEZ',
      severity: 'ALTO',
      issue: 'Falta error boundary no PropertiesColumn',
      impact: 'Erros de schema/validação podem quebrar UI inteira',
      solution: 'Adicionar try-catch ou ErrorBoundary React',
      files: ['PropertiesColumn/index.tsx']
    });
  }
  
  // Verificar se DynamicPropertyControls trata todos os control types
  const dynamicControlsPath = join(process.cwd(), 'src/components/editor/DynamicPropertyControls.tsx');
  const dynamicCode = readFileSync(dynamicControlsPath, 'utf-8');
  
  const hasDefaultCase = dynamicCode.includes('default:') && 
                          dynamicCode.match(/case ['"].*['"]:/g)?.length || 0 > 5;
  
  if (!hasDefaultCase) {
    results.push({
      category: 'ROBUSTEZ',
      severity: 'MÉDIO',
      issue: 'DynamicPropertyControls pode não ter fallback para control types desconhecidos',
      impact: 'Campos podem não renderizar se control type não for reconhecido',
      solution: 'Adicionar case default com Input genérico',
      files: ['DynamicPropertyControls.tsx']
    });
  }
}

analyzeBlindSpots();

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📋 RELATÓRIO DE GARGALOS - PAINEL DE PROPRIEDADES');
console.log('='.repeat(80) + '\n');

const critical = results.filter(r => r.severity === 'CRÍTICO');
const high = results.filter(r => r.severity === 'ALTO');
const medium = results.filter(r => r.severity === 'MÉDIO');
const low = results.filter(r => r.severity === 'BAIXO');

console.log(`🔴 CRÍTICO: ${critical.length}`);
console.log(`🟠 ALTO: ${high.length}`);
console.log(`🟡 MÉDIO: ${medium.length}`);
console.log(`🟢 BAIXO: ${low.length}\n`);

[...critical, ...high, ...medium, ...low].forEach((result, index) => {
  const emoji = {
    'CRÍTICO': '🔴',
    'ALTO': '🟠',
    'MÉDIO': '🟡',
    'BAIXO': '🟢'
  }[result.severity];
  
  console.log(`\n${emoji} [${result.category}] ${result.issue}`);
  console.log(`   Impacto: ${result.impact}`);
  console.log(`   Solução: ${result.solution}`);
  console.log(`   Arquivos: ${result.files.join(', ')}`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ ANÁLISE COMPLETA');
console.log('='.repeat(80) + '\n');

// Exportar JSON para processamento posterior
import { writeFileSync } from 'fs';
writeFileSync(
  join(process.cwd(), 'reports/properties-panel-bottlenecks.json'),
  JSON.stringify(results, null, 2)
);
console.log('📄 Relatório salvo em: reports/properties-panel-bottlenecks.json\n');
