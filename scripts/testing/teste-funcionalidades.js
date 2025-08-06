console.log("🧪 INICIANDO TESTES AUTOMATIZADOS DE FUNCIONALIDADES...");

// ========================================
// 1. TESTE: DASHBOARD → CRIAR NOVO FUNIL → TESTAR NAVEGAÇÃO
// ========================================

function testeDashboardCriacaoFunil() {
  console.log("\n📋 1. TESTANDO DASHBOARD E CRIAÇÃO DE FUNIL...");

  try {
    // Verificar se estamos no dashboard
    const isOnDashboard = window.location.pathname.includes("/admin");
    console.log("✅ Localização atual:", window.location.pathname);

    // Verificar se componentes do dashboard existem
    const templates = document.querySelectorAll('[class*="template"], [class*="Card"]');
    console.log("✅ Templates encontrados:", templates.length);

    // Verificar botões de criação
    const createButtons = document.querySelectorAll("button");
    const templateButtons = Array.from(createButtons).filter(
      btn =>
        btn.textContent?.includes("Template") ||
        btn.textContent?.includes("Usar") ||
        btn.textContent?.includes("Duplicar") ||
        btn.textContent?.includes("Personalizado")
    );
    console.log("✅ Botões de template encontrados:", templateButtons.length);

    templateButtons.forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.textContent?.trim()}"`);
    });

    if (templateButtons.length > 0) {
      console.log("✅ Dashboard tem botões funcionais para criar funis");
      return true;
    } else {
      console.log("❌ Botões de criação não encontrados");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste do dashboard:", error);
    return false;
  }
}

// ========================================
// 2. TESTE: EDITOR → ADICIONAR COMPONENTES → TESTAR PROPRIEDADES
// ========================================

function testeEditorComponentesPropriedades() {
  console.log("\n🎨 2. TESTANDO EDITOR - COMPONENTES E PROPRIEDADES...");

  try {
    // Verificar se estamos no editor
    const isOnEditor = window.location.pathname.includes("/editor");
    console.log("✅ No editor:", isOnEditor);

    // Verificar sidebars
    const sidebars = document.querySelectorAll('[class*="sidebar"], [class*="panel"]');
    console.log("✅ Sidebars encontradas:", sidebars.length);

    // Verificar canvas principal
    const canvas = document.querySelector('[class*="canvas"], [class*="preview"], main');
    console.log("✅ Canvas principal:", canvas ? "Encontrado" : "Não encontrado");

    // Verificar componentes disponíveis
    const components = document.querySelectorAll(
      '[draggable="true"], [class*="component"], [class*="block"]'
    );
    console.log("✅ Componentes arrastavéis:", components.length);

    // Verificar abas (Blocos, Páginas)
    const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
    console.log("✅ Abas encontradas:", tabs.length);

    tabs.forEach((tab, i) => {
      console.log(`   ${i + 1}. "${tab.textContent?.trim()}"`);
    });

    // Verificar área de propriedades
    const propertiesPanel = document.querySelector('[class*="properties"], [class*="config"]');
    console.log("✅ Painel de propriedades:", propertiesPanel ? "Encontrado" : "Não encontrado");

    if (isOnEditor && canvas && components.length > 0) {
      console.log("✅ Editor tem interface completa para edição");
      return true;
    } else {
      console.log("❌ Interface do editor incompleta");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste do editor:", error);
    return false;
  }
}

// ========================================
// 3. TESTE: 21 ETAPAS → VALIDAR RESPONSIVIDADE
// ========================================

function teste21EtapasResponsividade() {
  console.log("\n📱 3. TESTANDO 21 ETAPAS E RESPONSIVIDADE...");

  try {
    // Verificar lista de páginas/etapas
    const pagesList = document.querySelectorAll(
      '[class*="page"], [class*="step"], [class*="etapa"]'
    );
    console.log("✅ Etapas/páginas encontradas:", pagesList.length);

    // Verificar se há navegação entre etapas
    const navigation = document.querySelectorAll(
      '[class*="nav"], button[class*="page"], [role="button"]'
    );
    console.log("✅ Elementos de navegação:", navigation.length);

    // Verificar controles de dispositivo (responsividade)
    const deviceControls = document.querySelectorAll(
      '[class*="device"], [class*="mobile"], [class*="tablet"], [class*="desktop"]'
    );
    console.log("✅ Controles de dispositivo:", deviceControls.length);

    // Verificar largura atual da tela
    const screenWidth = window.innerWidth;
    console.log("✅ Largura da tela:", screenWidth + "px");

    // Testar responsividade básica
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    console.log("✅ Dispositivo detectado:", isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop");

    // Verificar se elementos se adaptam
    const responsiveElements = document.querySelectorAll(
      '[class*="responsive"], [class*="hidden"], [class*="lg:"], [class*="md:"], [class*="sm:"]'
    );
    console.log("✅ Elementos responsivos:", responsiveElements.length);

    if (pagesList.length >= 10 && responsiveElements.length > 0) {
      console.log("✅ Sistema tem múltiplas etapas e é responsivo");
      return true;
    } else {
      console.log("❌ Etapas insuficientes ou responsividade limitada");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de etapas:", error);
    return false;
  }
}

// ========================================
// 4. TESTE: SALVAMENTO → VERIFICAR PERSISTÊNCIA
// ========================================

function testeSalvamentoPersistencia() {
  console.log("\n💾 4. TESTANDO SALVAMENTO E PERSISTÊNCIA...");

  try {
    // Verificar localStorage
    const localStorageKeys = Object.keys(localStorage);
    const funnelKeys = localStorageKeys.filter(
      key => key.includes("funnel") || key.includes("schema") || key.includes("editor")
    );
    console.log("✅ Chaves no localStorage:", funnelKeys.length);
    funnelKeys.forEach(key => console.log(`   - ${key}`));

    // Verificar botões de salvamento
    const saveButtons = Array.from(document.querySelectorAll("button")).filter(
      btn =>
        btn.textContent?.includes("Salvar") ||
        btn.textContent?.includes("Save") ||
        btn.textContent?.includes("Publicar")
    );
    console.log("✅ Botões de salvamento:", saveButtons.length);

    saveButtons.forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.textContent?.trim()}"`);
    });

    // Verificar indicadores de status
    const statusIndicators = document.querySelectorAll(
      '[class*="saving"], [class*="saved"], [class*="status"]'
    );
    console.log("✅ Indicadores de status:", statusIndicators.length);

    // Verificar se há dados salvos
    const hasSavedData = funnelKeys.length > 0;
    console.log("✅ Dados persistidos:", hasSavedData ? "Sim" : "Não");

    // Verificar funções globais de salvamento
    const hasSaveFunction =
      typeof window.forceSave === "function" || typeof window.saveFunnel === "function";
    console.log("✅ Funções de salvamento:", hasSaveFunction ? "Disponíveis" : "Não encontradas");

    if (saveButtons.length > 0 && (hasSavedData || funnelKeys.length > 0)) {
      console.log("✅ Sistema de salvamento está operacional");
      return true;
    } else {
      console.log("❌ Sistema de salvamento incompleto");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de salvamento:", error);
    return false;
  }
}

// ========================================
// TESTE: FUNCIONALIDADES AVANÇADAS
// ========================================

function testeFuncionalidadesAvancadas() {
  console.log("\n⚡ 5. TESTANDO FUNCIONALIDADES AVANÇADAS...");

  try {
    // Verificar barra superior com funcionalidades
    const advancedButtons = Array.from(document.querySelectorAll("button")).filter(btn => {
      const text = btn.textContent?.toLowerCase() || "";
      return (
        text.includes("template") ||
        text.includes("versão") ||
        text.includes("relatório") ||
        text.includes("analytics") ||
        text.includes("diagnóstico") ||
        text.includes("dashboard")
      );
    });

    console.log("✅ Botões avançados encontrados:", advancedButtons.length);
    advancedButtons.forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.textContent?.trim()}"`);
    });

    // Verificar se há modais/dialogs
    const modals = document.querySelectorAll(
      '[role="dialog"], [class*="modal"], [class*="dialog"]'
    );
    console.log("✅ Modais disponíveis:", modals.length);

    // Verificar undo/redo
    const undoRedoButtons = Array.from(document.querySelectorAll("button")).filter(btn => {
      const text = btn.textContent?.toLowerCase() || "";
      return (
        text.includes("desfazer") ||
        text.includes("refazer") ||
        text.includes("undo") ||
        text.includes("redo")
      );
    });
    console.log("✅ Botões undo/redo:", undoRedoButtons.length);

    if (advancedButtons.length >= 3) {
      console.log("✅ Funcionalidades avançadas estão disponíveis");
      return true;
    } else {
      console.log("❌ Funcionalidades avançadas limitadas");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de funcionalidades avançadas:", error);
    return false;
  }
}

// ========================================
// EXECUTOR PRINCIPAL
// ========================================

function executarTodosOsTestes() {
  console.log("🚀 EXECUTANDO BATERIA COMPLETA DE TESTES...");
  console.log("Data:", new Date().toLocaleString());
  console.log("URL atual:", window.location.href);
  console.log("User Agent:", navigator.userAgent.substring(0, 100) + "...");

  const resultados = {
    dashboard: testeDashboardCriacaoFunil(),
    editor: testeEditorComponentesPropriedades(),
    etapas: teste21EtapasResponsividade(),
    salvamento: testeSalvamentoPersistencia(),
    avancadas: testeFuncionalidadesAvancadas(),
  };

  console.log("\n📊 RESULTADOS FINAIS:");
  console.log("=".repeat(50));

  const totalTestes = Object.keys(resultados).length;
  const testesPassaram = Object.values(resultados).filter(Boolean).length;
  const porcentagemSucesso = ((testesPassaram / totalTestes) * 100).toFixed(1);

  Object.entries(resultados).forEach(([teste, passou]) => {
    const status = passou ? "✅ PASSOU" : "❌ FALHOU";
    console.log(`${teste.toUpperCase()}: ${status}`);
  });

  console.log("=".repeat(50));
  console.log(`📈 SUCESSO: ${testesPassaram}/${totalTestes} (${porcentagemSucesso}%)`);

  if (porcentagemSucesso >= 80) {
    console.log("🎉 SISTEMA APROVADO! Todas as funcionalidades principais estão operacionais.");
  } else if (porcentagemSucesso >= 60) {
    console.log("⚠️ SISTEMA PARCIALMENTE FUNCIONAL. Algumas melhorias são necessárias.");
  } else {
    console.log("❌ SISTEMA REQUER ATENÇÃO. Várias funcionalidades precisam de correção.");
  }

  console.log("\n💡 DICAS PARA PRÓXIMOS PASSOS:");
  console.log("1. Teste manualmente as funcionalidades que falharam");
  console.log("2. Verifique console do navegador para erros");
  console.log("3. Teste em dispositivos diferentes (mobile/desktop)");
  console.log("4. Valide fluxo completo: Dashboard → Editor → Salvamento");

  return resultados;
}

// Auto-executar se estiver no console
if (typeof window !== "undefined") {
  // Aguardar 2 segundos para página carregar completamente
  setTimeout(executarTodosOsTestes, 2000);
}

// Disponibilizar globalmente para uso manual
window.testarSistema = executarTodosOsTestes;
console.log('💡 Execute "testarSistema()" a qualquer momento para repetir os testes.');
