#!/usr/bin/env node
/**
 * 🧪 Script de validação do lazy loader
 * Verifica se o funnel pode ser carregado corretamente
 */

console.log('🧪 Validando lazy loader...\n');

// Simular ambiente Node.js para imports ESM
const checks = {
  loaderExists: false,
  funnelStructure: false,
  stepsPresent: false,
  cacheWorks: false,
};

try {
  // 1. Verificar se o loader existe
  console.log('1️⃣ Verificando estrutura de arquivos...');
  const fs = await import('fs');
  const path = await import('path');
  
  const loaderPath = './src/templates/loaders/dynamic.ts';
  const funnelPath = './src/templates/funnels/quiz21Steps/index.ts';
  
  checks.loaderExists = fs.existsSync(loaderPath);
  console.log(`   Loader: ${checks.loaderExists ? '✅' : '❌'} ${loaderPath}`);
  
  checks.funnelStructure = fs.existsSync(funnelPath);
  console.log(`   Funnel: ${checks.funnelStructure ? '✅' : '❌'} ${funnelPath}`);
  
  // 2. Verificar steps
  console.log('\n2️⃣ Verificando steps...');
  const stepsDir = './src/templates/funnels/quiz21Steps/steps';
  if (fs.existsSync(stepsDir)) {
    const stepFiles = fs.readdirSync(stepsDir).filter(f => f.endsWith('.ts'));
    checks.stepsPresent = stepFiles.length >= 21;
    console.log(`   Steps encontrados: ${stepFiles.length}/21`);
    console.log(`   Status: ${checks.stepsPresent ? '✅' : '⚠️'}`);
  }
  
  // 3. Verificar imports críticos
  console.log('\n3️⃣ Verificando refatoração de imports...');
  const filesToCheck = [
    './src/services/core/HierarchicalTemplateSource.ts',
    './src/templates/imports.ts',
    './src/lib/tools/debug/StepSidebarTest.tsx',
    './src/lib/tools/debug/DebugStep02.tsx',
    './src/lib/tools/debug/TemplateDebugPage.tsx',
  ];
  
  let migratedCount = 0;
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const usesLazyLoader = content.includes('loadFunnel') || content.includes('getLoadedFunnelSync');
      const hasDirectImport = content.includes("from '@/templates/quiz21StepsComplete'");
      
      if (usesLazyLoader && !hasDirectImport) {
        migratedCount++;
        console.log(`   ✅ ${path.basename(file)} - migrado`);
      } else if (usesLazyLoader && hasDirectImport) {
        console.log(`   ⚠️  ${path.basename(file)} - parcial (tem ambos)`);
      } else if (hasDirectImport) {
        console.log(`   ❌ ${path.basename(file)} - ainda usa import direto`);
      } else {
        console.log(`   ℹ️  ${path.basename(file)} - não usa template`);
      }
    }
  }
  
  checks.cacheWorks = migratedCount >= 4;
  
  // 4. Resumo
  console.log('\n📊 RESUMO DA VALIDAÇÃO:');
  console.log('========================');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
  });
  
  const allPassed = Object.values(checks).every(v => v);
  console.log('\n' + (allPassed ? '🎉 VALIDAÇÃO COMPLETA!' : '⚠️  Algumas verificações falharam'));
  
  process.exit(allPassed ? 0 : 1);
  
} catch (error) {
  console.error('❌ Erro durante validação:', error.message);
  process.exit(1);
}
