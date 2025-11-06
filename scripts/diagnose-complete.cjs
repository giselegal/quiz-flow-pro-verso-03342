/**
 * 🎯 DIAGNÓSTICO COMPLETO - Identifica porque blocos não renderizam
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║            🔍 DIAGNÓSTICO COMPLETO - PONTOS CEGOS                    ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

// 1. VERIFICAR JSON
console.log('1️⃣ VERIFICAÇÃO DO JSON:\n');
const jsonPath = path.join(process.cwd(), 'public/templates/quiz21-complete.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const step20 = data.steps['step-20'];

console.log(`✅ Step-20 existe: ${!!step20}`);
console.log(`✅ Total de blocos: ${step20.blocks.length}`);
console.log(`✅ Todos habilitados: ${step20.blocks.every(b => b.properties?.enabled !== false)}`);

// 2. VERIFICAR COMPONENTES FÍSICOS
console.log('\n2️⃣ VERIFICAÇÃO DE ARQUIVOS DE COMPONENTES:\n');
const componentPaths = {
  'result-congrats': 'src/components/editor/blocks/ResultCongratsBlock.tsx',
  'quiz-score-display': 'src/components/quiz/blocks/QuizScoreDisplay.tsx',
  'result-main': 'src/components/editor/blocks/atomic/ResultMainBlock.tsx',
  'result-progress-bars': 'src/components/editor/blocks/ResultProgressBarsBlock.tsx',
  'result-secondary-styles': 'src/components/editor/blocks/atomic/ResultSecondaryStylesBlock.tsx',
  'result-image': 'src/components/editor/blocks/atomic/ResultImageBlock.tsx',
  'result-description': 'src/components/editor/blocks/atomic/ResultDescriptionBlock.tsx',
  'result-cta': 'src/components/editor/blocks/atomic/ResultCTABlock.tsx',
  'result-share': 'src/components/editor/blocks/atomic/ResultShareBlock.tsx',
  'text-inline': 'src/components/editor/blocks/TextInlineBlock.tsx'
};

let missingFiles = [];
Object.entries(componentPaths).forEach(([type, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    console.log(`✅ ${type} → ${filePath}`);
  } else {
    console.log(`❌ ${type} → ${filePath} (ARQUIVO NÃO EXISTE!)`);
    missingFiles.push(type);
  }
});

// 3. VERIFICAR EXPORTS DOS COMPONENTES
console.log('\n3️⃣ VERIFICAÇÃO DE EXPORTS:\n');
let exportIssues = [];
Object.entries(componentPaths).forEach(([type, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasDefaultExport = content.includes('export default');
    const hasNamedExport = content.match(/export\s+(const|function|class)\s+\w+/);
    
    if (hasDefaultExport) {
      console.log(`✅ ${type} → export default ✓`);
    } else if (hasNamedExport) {
      console.log(`⚠️  ${type} → apenas named export (precisa de default!)`);
      exportIssues.push(type);
    } else {
      console.log(`❌ ${type} → SEM EXPORT!`);
      exportIssues.push(type);
    }
  }
});

// 4. VERIFICAR REGISTRY
console.log('\n4️⃣ VERIFICAÇÃO DO REGISTRY:\n');
const registryPath = path.join(process.cwd(), 'src/registry/UnifiedBlockRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

let registryIssues = [];
Object.keys(componentPaths).forEach(type => {
  const isRegistered = registryContent.includes(`'${type}':`);
  if (isRegistered) {
    console.log(`✅ ${type} → registrado`);
  } else {
    console.log(`❌ ${type} → NÃO REGISTRADO!`);
    registryIssues.push(type);
  }
});

// 5. VERIFICAR RENDERER
console.log('\n5️⃣ VERIFICAÇÃO DO RENDERER:\n');
const rendererPath = path.join(process.cwd(), 'src/components/editor/quiz/renderers/BlockTypeRenderer.tsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

let rendererIssues = [];
Object.keys(componentPaths).forEach(type => {
  const hasCase = rendererContent.includes(`case '${type}':`);
  if (hasCase) {
    console.log(`✅ ${type} → case mapeado`);
  } else {
    console.log(`❌ ${type} → SEM CASE NO SWITCH!`);
    rendererIssues.push(type);
  }
});

// 6. VERIFICAR PROPS NO JSON
console.log('\n6️⃣ VERIFICAÇÃO DE PROPS/CONTENT:\n');
step20.blocks.forEach(block => {
  const hasProps = block.properties?.props && Object.keys(block.properties.props).length > 0;
  const hasContent = block.content && Object.keys(block.content).length > 0;
  
  if (!hasProps && !hasContent) {
    console.log(`⚠️  ${block.type} (${block.id}) → SEM props NEM content`);
  } else if (hasProps) {
    console.log(`✅ ${block.type} (${block.id}) → tem props`);
  } else if (hasContent) {
    console.log(`✅ ${block.type} (${block.id}) → tem content`);
  }
});

// 7. VERIFICAR RESULTADO PROVIDER
console.log('\n7️⃣ VERIFICAÇÃO DO RESULT PROVIDER:\n');
const productionStepsPath = path.join(process.cwd(), 'src/components/step-registry/ProductionStepsRegistry.tsx');
const productionContent = fs.readFileSync(productionStepsPath, 'utf8');

const hasResultProvider = productionContent.includes('ResultProvider');
const hasUserProfile = productionContent.includes('userName') && productionContent.includes('resultStyle');
const hasScores = productionContent.includes('scores');

console.log(`${hasResultProvider ? '✅' : '❌'} ResultProvider importado`);
console.log(`${hasUserProfile ? '✅' : '❌'} userProfile configurado (userName, resultStyle)`);
console.log(`${hasScores ? '✅' : '❌'} scores passados para provider`);

// 8. RESUMO FINAL
console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                          🎯 DIAGNÓSTICO                              ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

const totalIssues = missingFiles.length + exportIssues.length + registryIssues.length + rendererIssues.length;

if (totalIssues === 0) {
  console.log('✅ NENHUM PROBLEMA ESTRUTURAL ENCONTRADO!\n');
  console.log('📝 POSSÍVEIS CAUSAS DE NÃO RENDERIZAÇÃO:\n');
  console.log('   1. Componentes requerem ResultContext mas useResultOptional() retorna null');
  console.log('   2. Props/content não estão no formato esperado pelos componentes');
  console.log('   3. Componentes têm erros de runtime (verificar console do browser)');
  console.log('   4. CSS/Tailwind fazendo elementos invisíveis (height: 0, opacity: 0, etc)');
  console.log('   5. Conditional rendering retornando null');
  console.log('   6. Componentes renderizando mas fora da viewport');
  console.log('\n💡 RECOMENDAÇÃO: Abrir DevTools e verificar:');
  console.log('   - Console para erros JavaScript');
  console.log('   - Elements para ver se DOM está sendo criado');
  console.log('   - React DevTools para ver props/state dos componentes');
} else {
  console.log(`❌ ${totalIssues} PROBLEMA(S) ENCONTRADO(S):\n`);
  
  if (missingFiles.length > 0) {
    console.log(`   📁 Arquivos faltando (${missingFiles.length}):`);
    missingFiles.forEach(f => console.log(`      - ${f}`));
  }
  
  if (exportIssues.length > 0) {
    console.log(`   📤 Problemas de export (${exportIssues.length}):`);
    exportIssues.forEach(f => console.log(`      - ${f}`));
  }
  
  if (registryIssues.length > 0) {
    console.log(`   📋 Não registrados (${registryIssues.length}):`);
    registryIssues.forEach(f => console.log(`      - ${f}`));
  }
  
  if (rendererIssues.length > 0) {
    console.log(`   🎨 Sem case no renderer (${rendererIssues.length}):`);
    rendererIssues.forEach(f => console.log(`      - ${f}`));
  }
}

console.log('\n');
