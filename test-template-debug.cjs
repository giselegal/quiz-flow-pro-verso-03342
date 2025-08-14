// Teste de diagnóstico completo do sistema de templates
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO COMPLETO DOS TEMPLATES - Step01');
console.log('='.repeat(60));

// 1. Verificar arquivos JSON de templates
console.log('\n📁 1. ARQUIVOS JSON DISPONÍVEIS:');
const jsonFiles = [
  'examples/step01-blocks.json',
  'examples/step01-blocks-corrigido.json',
  'src/config/templates/step01.json',
];

jsonFiles.forEach(file => {
  const fullPath = path.join('/workspaces/quiz-quest-challenge-verse', file);
  if (fs.existsSync(fullPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      console.log(
        `✅ ${file}: ${Array.isArray(content) ? content.length : Object.keys(content).length} itens`
      );

      // Mostrar tipos de blocos
      if (Array.isArray(content) && content.length > 0) {
        const types = content.map(block => block.type).filter(Boolean);
        console.log(`   🎯 Tipos: ${[...new Set(types)].join(', ')}`);
      }
    } catch (e) {
      console.log(`❌ ${file}: Erro ao ler - ${e.message}`);
    }
  } else {
    console.log(`❌ ${file}: Não encontrado`);
  }
});

// 2. Verificar Enhanced Block Registry
console.log('\n🔧 2. ENHANCED BLOCK REGISTRY:');
try {
  const registryPath = '/workspaces/quiz-quest-challenge-verse/src/config/enhancedBlockRegistry.ts';
  const registryContent = fs.readFileSync(registryPath, 'utf8');

  // Extrair tipos do registry
  const registryMatches = registryContent.match(/'([^']+)':\s*\w+/g) || [];
  const registryTypes = registryMatches.map(match => match.split("'")[1]);

  console.log(`✅ Registry atual: ${registryTypes.length} tipos`);
  console.log(`   🎯 Tipos: ${registryTypes.join(', ')}`);

  // Verificar types específicos do Step01
  const step01Types = [
    'quiz-intro-header',
    'decorative-bar',
    'text',
    'image',
    'form-input',
    'button',
  ];
  console.log('\n📋 Compatibilidade Step01:');
  step01Types.forEach(type => {
    const exists = registryTypes.includes(type) || registryTypes.includes(`${type}-inline`);
    console.log(`   ${exists ? '✅' : '❌'} ${type}: ${exists ? 'Encontrado' : 'Faltando'}`);
  });
} catch (e) {
  console.log(`❌ Erro ao ler registry: ${e.message}`);
}

// 3. Verificar templateService
console.log('\n⚙️ 3. TEMPLATE SERVICE:');
try {
  const servicePath = '/workspaces/quiz-quest-challenge-verse/src/services/templateService.ts';
  const serviceContent = fs.readFileSync(servicePath, 'utf8');

  const hasGetStepTemplate = serviceContent.includes('getStepTemplate');
  const hasStep01Logic = serviceContent.includes('step 1') || serviceContent.includes('step01');

  console.log(`   ✅ Arquivo existe`);
  console.log(
    `   ${hasGetStepTemplate ? '✅' : '❌'} getStepTemplate: ${hasGetStepTemplate ? 'Presente' : 'Ausente'}`
  );
  console.log(
    `   ${hasStep01Logic ? '✅' : '❌'} Lógica Step01: ${hasStep01Logic ? 'Presente' : 'Ausente'}`
  );
} catch (e) {
  console.log(`❌ Erro ao ler templateService: ${e.message}`);
}

// 4. Verificar templates.ts
console.log('\n📄 4. SISTEMA TEMPLATES.TS:');
try {
  const templatesPath = '/workspaces/quiz-quest-challenge-verse/src/config/templates/templates.ts';
  const templatesContent = fs.readFileSync(templatesPath, 'utf8');

  const hasGetStepTemplate = templatesContent.includes('getStepTemplate');
  const hasAsyncLogic = templatesContent.includes('async') && templatesContent.includes('Promise');
  const hasJsonImport = templatesContent.includes('.json');

  console.log(`   ✅ Arquivo existe`);
  console.log(
    `   ${hasGetStepTemplate ? '✅' : '❌'} getStepTemplate: ${hasGetStepTemplate ? 'Presente' : 'Ausente'}`
  );
  console.log(
    `   ${hasAsyncLogic ? '✅' : '❌'} Lógica async: ${hasAsyncLogic ? 'Presente' : 'Ausente'}`
  );
  console.log(
    `   ${hasJsonImport ? '✅' : '❌'} Import JSON: ${hasJsonImport ? 'Presente' : 'Ausente'}`
  );
} catch (e) {
  console.log(`❌ Erro ao ler templates.ts: ${e.message}`);
}

console.log('\n' + '='.repeat(60));
console.log('🎯 RESUMO DO DIAGNÓSTICO CONCLUÍDO');
