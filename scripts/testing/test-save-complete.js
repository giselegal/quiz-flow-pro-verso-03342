// Script para testar salvamento manual step-by-step
console.log("🔧 TESTE COMPLETO DO SALVAMENTO MANUAL");
console.log("=====================================");

// Aguardar o React carregar
setTimeout(() => {
  console.log("\n📋 PASSO 1: Verificar estado do editor");

  // Verificar se estamos na página correta
  const currentPath = window.location.pathname;
  console.log(`🔍 Página atual: ${currentPath}`);

  // Verificar se o botão existe
  const saveButtons = document.querySelectorAll("button");
  let saveButton = null;

  saveButtons.forEach(btn => {
    if (btn.textContent?.includes("Salvar") || btn.textContent?.includes("Salvando")) {
      saveButton = btn;
      console.log(`✅ Botão Salvar encontrado: "${btn.textContent}"`);
      console.log(`   Disabled: ${btn.disabled}`);
      console.log(`   Classes: ${btn.className}`);
    }
  });

  if (!saveButton) {
    console.error("❌ Botão Salvar não encontrado!");
    return;
  }

  console.log("\n📋 PASSO 2: Verificar dados locais");

  // Verificar localStorage
  const localFunnels = localStorage.getItem("schema-driven-funnels");
  const pendingChanges = localStorage.getItem("schema-driven-pending-changes");

  console.log(`🗄️ Funnels no localStorage: ${!!localFunnels}`);
  console.log(`⏳ Mudanças pendentes: ${pendingChanges}`);

  if (localFunnels) {
    try {
      const parsed = JSON.parse(localFunnels);
      console.log(`📊 Quantidade de funnels: ${Object.keys(parsed).length}`);
      Object.keys(parsed).forEach(key => {
        const funnel = parsed[key];
        console.log(`   - ${key}: "${funnel.name}" (${funnel.pages?.length || 0} páginas)`);
      });
    } catch (e) {
      console.error("❌ Erro ao parsear localStorage:", e);
    }
  }

  console.log("\n📋 PASSO 3: Simular salvamento");

  // Adicionar listener antes do clique
  const originalConsoleLog = console.log;
  const logs = [];

  console.log = function (...args) {
    logs.push(args);
    originalConsoleLog.apply(console, args);
  };

  // Simular clique
  console.log("🎯 Clicando no botão Salvar...");
  saveButton.click();

  // Aguardar e verificar logs
  setTimeout(() => {
    console.log("\n📋 PASSO 4: Analisar resultado");

    // Filtrar logs relevantes
    const saveLogs = logs.filter(log =>
      log.some(
        arg =>
          typeof arg === "string" &&
          (arg.includes("DEBUG") || arg.includes("saveFunnel") || arg.includes("handleSave"))
      )
    );

    console.log(`📝 Logs de salvamento capturados: ${saveLogs.length}`);
    saveLogs.forEach((log, i) => {
      console.log(`   ${i + 1}. ${log.join(" ")}`);
    });

    // Verificar se houve mudanças no localStorage
    const newLocalFunnels = localStorage.getItem("schema-driven-funnels");
    const newPendingChanges = localStorage.getItem("schema-driven-pending-changes");

    console.log(`\n🔄 Estado após salvamento:`);
    console.log(`   Funnels no localStorage: ${!!newLocalFunnels}`);
    console.log(`   Mudanças pendentes: ${newPendingChanges}`);

    // Restaurar console.log original
    console.log = originalConsoleLog;

    console.log("\n✅ Teste completo! Verifique os logs acima para diagnóstico.");
  }, 3000);
}, 2000);

console.log("⏳ Aguardando 2 segundos para React carregar...");
