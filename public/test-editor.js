/**
 * 🧪 TESTE SIMPLES - EDITOR 21 ETAPAS
 * Script para verificar se o editor está funcionando corretamente
 */

console.log('🚀 TESTE DO EDITOR - 21 ETAPAS');
console.log('================================\n');

// 1. Verificar se estamos na página correta
console.log('📍 URL Atual:', window.location.href);

// 2. Verificar se a estrutura básica existe
const checkBasicStructure = () => {
  console.log('\n🔍 VERIFICANDO ESTRUTURA BÁSICA:');
  
  // Verificar se há um título ou cabeçalho
  const headings = document.querySelectorAll('h1, h2, h3, h4');
  console.log(`   • Cabeçalhos encontrados: ${headings.length}`);
  headings.forEach((h, i) => {
    console.log(`     ${i + 1}. ${h.tagName}: "${h.textContent?.trim()}"`);
  });
  
  // Verificar divs principais
  const mainDivs = document.querySelectorAll('div[class*="flex"], div[class*="grid"], div[class*="layout"]');
  console.log(`   • Divs de layout encontradas: ${mainDivs.length}`);
};

// 3. Verificar as 21 etapas
const checkStages = () => {
  console.log('\n🔢 VERIFICANDO AS 21 ETAPAS:');
  
  // Procurar por botões de etapa
  const stageButtons = document.querySelectorAll('button:contains("Etapa"), button[class*="step"], [data-stage]');
  console.log(`   • Botões de etapa encontrados: ${stageButtons.length}`);
  
  // Procurar especificamente por "Etapa"
  const etapaTexts = document.querySelectorAll('*');
  let etapaCount = 0;
  etapaTexts.forEach(el => {
    if (el.textContent?.includes('Etapa')) {
      etapaCount++;
    }
  });
  console.log(`   • Elementos com texto "Etapa": ${etapaCount}`);
  
  // Verificar se há exatamente 21 etapas
  const allButtons = document.querySelectorAll('button');
  let stageButtonsFound = 0;
  allButtons.forEach(btn => {
    if (btn.textContent?.match(/^Etapa \d+$/)) {
      stageButtonsFound++;
    }
  });
  console.log(`   • Botões "Etapa X" encontrados: ${stageButtonsFound}`);
  
  if (stageButtonsFound === 21) {
    console.log('   ✅ SUCESSO: 21 etapas encontradas!');
  } else {
    console.log(`   ❌ PROBLEMA: Esperado 21 etapas, encontrado ${stageButtonsFound}`);
  }
  
  return stageButtonsFound;
};

// 4. Verificar painéis do editor
const checkPanels = () => {
  console.log('\n🎛️ VERIFICANDO PAINÉIS DO EDITOR:');
  
  // Painel de etapas
  const stagesPanel = document.querySelector('[class*="stages"], [class*="steps"]');
  console.log(`   • Painel de etapas: ${stagesPanel ? '✅' : '❌'}`);
  
  // Painel de componentes
  const componentsPanel = document.querySelector('[class*="components"], [class*="tools"]');
  console.log(`   • Painel de componentes: ${componentsPanel ? '✅' : '❌'}`);
  
  // Canvas/área de edição
  const canvas = document.querySelector('[class*="canvas"], [class*="editor"], [class*="preview"]');
  console.log(`   • Canvas/Editor: ${canvas ? '✅' : '❌'}`);
  
  // Painel de propriedades
  const propertiesPanel = document.querySelector('[class*="properties"], [class*="settings"]');
  console.log(`   • Painel de propriedades: ${propertiesPanel ? '✅' : '❌'}`);
};

// 5. Verificar se há erros no console
const checkConsoleErrors = () => {
  console.log('\n🐛 VERIFICANDO ERROS:');
  
  // Note: Este script em si será executado no console, então não pode detectar erros anteriores
  console.log('   • Execute este script no console do navegador para ver erros');
  console.log('   • Verifique a aba "Console" para erros de JavaScript');
  console.log('   • Verifique a aba "Network" para erros de carregamento');
};

// 6. Testar navegação entre etapas
const testStageNavigation = () => {
  console.log('\n🖱️ TESTANDO NAVEGAÇÃO ENTRE ETAPAS:');
  
  const etapa5 = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent?.trim() === 'Etapa 5');
  
  if (etapa5) {
    console.log('   • Botão "Etapa 5" encontrado: ✅');
    console.log('   • Clique manual necessário para testar navegação');
  } else {
    console.log('   • Botão "Etapa 5" não encontrado: ❌');
  }
};

// 7. Executar todos os testes
const runAllTests = () => {
  console.log('🏁 EXECUTANDO TODOS OS TESTES...\n');
  
  checkBasicStructure();
  const stageCount = checkStages();
  checkPanels();
  checkConsoleErrors();
  testStageNavigation();
  
  console.log('\n📊 RESUMO FINAL:');
  console.log('================');
  console.log(`✅ Editor carregou: ${document.body ? 'Sim' : 'Não'}`);
  console.log(`✅ 21 etapas: ${stageCount === 21 ? 'Sim' : 'Não'}`);
  console.log(`✅ URL correta: ${window.location.pathname === '/editor-fixed' ? 'Sim' : 'Não'}`);
  
  if (stageCount === 21) {
    console.log('\n🎉 TESTE PASSOU! O editor está funcionando com 21 etapas.');
  } else {
    console.log('\n⚠️ TESTE FALHOU! Verifique a implementação das etapas.');
  }
};

// Executar automaticamente após 2 segundos
setTimeout(() => {
  runAllTests();
}, 2000);

// Também disponibilizar para execução manual
window.testEditor = runAllTests;
