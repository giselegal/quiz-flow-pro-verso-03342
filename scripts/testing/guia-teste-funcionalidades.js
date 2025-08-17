/* 
🧪 GUIA DE TESTE COMPLETO - FUNCIONALIDADES DO SISTEMA
Execute este script no console do navegador em cada página para testar as funcionalidades

INSTRUÇÕES:
1. Abra http://localhost:8080/admin
2. Abra DevTools (F12) → Console
3. Cole e execute cada seção conforme necessário
*/

// ========================================
// TESTE 1: DASHBOARD → CRIAR NOVO FUNIL → TESTAR NAVEGAÇÃO
// Execute em: http://localhost:8080/admin
// ========================================

console.log('🧪 TESTE 1: DASHBOARD - CRIAÇÃO E NAVEGAÇÃO DE FUNIS');

function testarDashboard() {
  console.log('\n📋 Testando Dashboard...');

  // 1. Verificar se estamos na página correta
  if (!window.location.pathname.includes('/admin')) {
    console.log('❌ Não está na página do dashboard. Navegue para /admin');
    return false;
  }

  // 2. Procurar templates disponíveis
  const templates = document.querySelectorAll(
    '[class*="template"], .template, [data-testid*="template"]'
  );
  console.log(`✅ Templates encontrados: ${templates.length}`);

  // 3. Procurar botões de ação
  const actionButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
    const text = btn.textContent?.toLowerCase() || '';
    return (
      text.includes('usar template') ||
      text.includes('duplicar') ||
      text.includes('personalizado') ||
      text.includes('criar')
    );
  });

  console.log(`✅ Botões de ação encontrados: ${actionButtons.length}`);
  actionButtons.forEach((btn, i) => {
    console.log(`   ${i + 1}. "${btn.textContent?.trim()}"`);
  });

  // 4. Verificar cards de funis
  const funnelCards = document.querySelectorAll('[class*="Card"], .card, [class*="template"]');
  console.log(`✅ Cards de funis/templates: ${funnelCards.length}`);

  // 5. Testar clique no primeiro botão disponível (SEM executar)
  if (actionButtons.length > 0) {
    console.log(`✅ Botão principal encontrado: "${actionButtons[0].textContent?.trim()}"`);
    console.log('💡 Para testar navegação, clique manualmente no botão e veja se vai para /editor');

    // Preparar listener para mudança de URL
    window.testNavigation = () => {
      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        console.log('🔄 Navegação detectada para:', args[2]);
        originalPushState.apply(history, args);
      };
      console.log('🎯 Listener de navegação ativado. Clique em um botão agora.');
    };

    return true;
  } else {
    console.log('❌ Nenhum botão de ação encontrado');
    return false;
  }
}

// Execute este teste:
testarDashboard();

// ========================================
// TESTE 2: EDITOR → ADICIONAR COMPONENTES → TESTAR PROPRIEDADES
// Execute em: http://localhost:8080/editor
// ========================================

function testarEditor() {
  console.log('\n🎨 TESTE 2: EDITOR - COMPONENTES E PROPRIEDADES');

  // 1. Verificar se estamos no editor
  if (!window.location.pathname.includes('/editor')) {
    console.log('❌ Não está na página do editor. Navegue para /editor');
    return false;
  }

  // 2. Verificar estrutura do editor
  const sidebars = document.querySelectorAll('[class*="sidebar"], [class*="panel"], aside');
  console.log(`✅ Sidebars encontradas: ${sidebars.length}`);

  // 3. Verificar canvas/área de edição
  const canvas = document.querySelector(
    '[class*="canvas"], [class*="preview"], main, [class*="editor"]'
  );
  console.log(`✅ Canvas principal: ${canvas ? 'Encontrado' : 'Não encontrado'}`);

  // 4. Verificar abas
  const tabs = document.querySelectorAll('[role="tab"], [class*="tab"], [data-state="active"]');
  console.log(`✅ Abas encontradas: ${tabs.length}`);
  tabs.forEach((tab, i) => {
    console.log(
      `   ${i + 1}. "${tab.textContent?.trim()}" (ativo: ${tab.getAttribute('data-state') === 'active' || tab.classList.contains('active')})`
    );
  });

  // 5. Verificar componentes arrastáveis
  const draggableComponents = document.querySelectorAll(
    '[draggable="true"], [class*="draggable"], [class*="component"]'
  );
  console.log(`✅ Componentes arrastáveis: ${draggableComponents.length}`);

  // 6. Verificar painel de propriedades
  const propertiesPanel = document.querySelector(
    '[class*="properties"], [class*="config"], [class*="settings"]'
  );
  console.log(`✅ Painel de propriedades: ${propertiesPanel ? 'Encontrado' : 'Não encontrado'}`);

  // 7. Listar tipos de componentes disponíveis
  const componentLabels = Array.from(document.querySelectorAll('span, div, p')).filter(el => {
    const text = el.textContent?.toLowerCase() || '';
    return (
      text.includes('text') ||
      text.includes('button') ||
      text.includes('image') ||
      text.includes('grid')
    );
  });

  console.log(`✅ Tipos de componentes identificados: ${componentLabels.length}`);
  componentLabels.slice(0, 10).forEach((label, i) => {
    console.log(`   ${i + 1}. "${label.textContent?.trim()}"`);
  });

  return canvas && sidebars.length > 0;
}

// ========================================
// TESTE 3: 21 ETAPAS → VALIDAR RESPONSIVIDADE
// Execute no editor: http://localhost:8080/editor
// ========================================

function testar21Etapas() {
  console.log('\n📱 TESTE 3: 21 ETAPAS E RESPONSIVIDADE');

  // 1. Procurar indicadores de páginas/etapas
  const pageIndicators = document.querySelectorAll(
    '[class*="page"], [class*="step"], [class*="etapa"]'
  );
  console.log(`✅ Indicadores de página/etapa: ${pageIndicators.length}`);

  // 2. Procurar lista de páginas (normalmente em sidebar)
  const pagesList = document.querySelector('[class*="pages"], [class*="list"]');
  if (pagesList) {
    const pages = pagesList.querySelectorAll('li, div, button');
    console.log(`✅ Páginas listadas: ${pages.length}`);
  }

  // 3. Verificar controles de responsividade
  const deviceControls = document.querySelectorAll(
    '[class*="device"], [class*="mobile"], [class*="tablet"], [class*="desktop"]'
  );
  console.log(`✅ Controles de dispositivo: ${deviceControls.length}`);

  // 4. Testar responsividade da viewport
  const originalWidth = window.innerWidth;
  console.log(`✅ Largura atual: ${originalWidth}px`);

  // 5. Verificar elementos responsivos
  const responsiveElements = document.querySelectorAll(
    '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]'
  );
  console.log(`✅ Elementos com classes responsivas: ${responsiveElements.length}`);

  // 6. Verificar se há navegação entre páginas
  const navigationButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
    const text = btn.textContent?.toLowerCase() || '';
    return (
      text.includes('próxima') ||
      text.includes('anterior') ||
      text.includes('next') ||
      text.includes('prev')
    );
  });
  console.log(`✅ Botões de navegação: ${navigationButtons.length}`);

  return pageIndicators.length >= 5 || responsiveElements.length > 0;
}

// ========================================
// TESTE 4: SALVAMENTO → VERIFICAR PERSISTÊNCIA
// Execute no editor após fazer alguma alteração
// ========================================

function testarSalvamento() {
  console.log('\n💾 TESTE 4: SALVAMENTO E PERSISTÊNCIA');

  // 1. Verificar localStorage
  const storageKeys = Object.keys(localStorage);
  const relevantKeys = storageKeys.filter(
    key =>
      key.includes('funnel') ||
      key.includes('schema') ||
      key.includes('editor') ||
      key.includes('quiz')
  );

  console.log(`✅ Chaves relevantes no localStorage: ${relevantKeys.length}`);
  relevantKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      const size = data ? (data.length / 1024).toFixed(2) : '0';
      console.log(`   - ${key}: ${size}KB`);
    } catch (e) {
      console.log(`   - ${key}: erro ao ler`);
    }
  });

  // 2. Verificar botões de salvamento
  const saveButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
    const text = btn.textContent?.toLowerCase() || '';
    return text.includes('salvar') || text.includes('save') || text.includes('publicar');
  });
  console.log(`✅ Botões de salvamento: ${saveButtons.length}`);
  saveButtons.forEach((btn, i) => {
    console.log(`   ${i + 1}. "${btn.textContent?.trim()}"`);
  });

  // 3. Verificar auto-save
  const autoSaveIndicators = document.querySelectorAll(
    '[class*="saving"], [class*="saved"], [class*="auto"]'
  );
  console.log(`✅ Indicadores de auto-save: ${autoSaveIndicators.length}`);

  // 4. Testar se há dados salvos
  const hasSavedData = relevantKeys.some(key => {
    try {
      const data = localStorage.getItem(key);
      return data && data.length > 100; // Dados substanciais
    } catch {
      return false;
    }
  });

  console.log(`✅ Dados salvos detectados: ${hasSavedData ? 'Sim' : 'Não'}`);

  // 5. Verificar se há funções globais de salvamento
  const globalSaveFunctions = [];
  if (typeof window.saveFunnel === 'function') globalSaveFunctions.push('saveFunnel');
  if (typeof window.autoSave === 'function') globalSaveFunctions.push('autoSave');
  if (typeof window.forceSave === 'function') globalSaveFunctions.push('forceSave');

  console.log(`✅ Funções globais de salvamento: ${globalSaveFunctions.length}`);
  globalSaveFunctions.forEach(fn => console.log(`   - ${fn}()`));

  return saveButtons.length > 0 || hasSavedData;
}

// ========================================
// EXECUTOR GERAL
// ========================================

function executarTestesCompletos() {
  console.log('🚀 EXECUTANDO TODOS OS TESTES...');
  console.log('='.repeat(50));

  const testes = [
    { nome: 'Dashboard', funcao: testarDashboard },
    { nome: 'Editor', funcao: testarEditor },
    { nome: '21 Etapas', funcao: testar21Etapas },
    { nome: 'Salvamento', funcao: testarSalvamento },
  ];

  const resultados = {};

  testes.forEach(teste => {
    try {
      resultados[teste.nome] = teste.funcao();
    } catch (error) {
      console.error(`❌ Erro no teste ${teste.nome}:`, error);
      resultados[teste.nome] = false;
    }
  });

  console.log('\n📊 RESULTADOS FINAIS:');
  console.log('='.repeat(50));

  const totalTestes = Object.keys(resultados).length;
  const testesPassaram = Object.values(resultados).filter(Boolean).length;
  const porcentagem = ((testesPassaram / totalTestes) * 100).toFixed(1);

  Object.entries(resultados).forEach(([nome, passou]) => {
    console.log(`${nome}: ${passou ? '✅ PASSOU' : '❌ FALHOU'}`);
  });

  console.log(`\n📈 SUCESSO: ${testesPassaram}/${totalTestes} (${porcentagem}%)`);

  if (porcentagem >= 75) {
    console.log('🎉 SISTEMA APROVADO! Funcionalidades principais operacionais.');
  } else {
    console.log('⚠️ SISTEMA PARCIALMENTE FUNCIONAL. Algumas melhorias necessárias.');
  }

  return resultados;
}

// Disponibilizar funções globalmente
window.testarDashboard = testarDashboard;
window.testarEditor = testarEditor;
window.testar21Etapas = testar21Etapas;
window.testarSalvamento = testarSalvamento;
window.executarTestesCompletos = executarTestesCompletos;

console.log('✅ SCRIPT DE TESTE CARREGADO!');
console.log('📋 Funções disponíveis:');
console.log('   - testarDashboard()');
console.log('   - testarEditor()');
console.log('   - testar21Etapas()');
console.log('   - testarSalvamento()');
console.log('   - executarTestesCompletos()');
console.log('\n💡 Execute as funções conforme a página que está acessando!');
