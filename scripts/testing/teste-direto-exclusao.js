console.log("🧪 TESTE DIRETO DE EXCLUSÃO");

// 1. Carregar o funnel
localStorage.setItem("currentFunnelId", "funnel_1753399767385_kgc4wwjsc");
location.reload();

// 2. Aguardar e testar
setTimeout(() => {
  console.log("🔍 Iniciando teste direto...");

  // Verificar se há blocos
  const blocks = document.querySelectorAll("[data-block-id]");
  console.log(`📦 Blocos encontrados: ${blocks.length}`);

  if (blocks.length > 0) {
    const firstBlock = blocks[0];
    const blockId = firstBlock.getAttribute("data-block-id");
    console.log(`🎯 Testando exclusão do bloco: ${blockId}`);

    // Procurar o botão de exclusão específico
    const deleteBtn = firstBlock.querySelector('button[title="Excluir Componente"]');

    if (deleteBtn) {
      console.log("✅ Botão de exclusão encontrado!");
      console.log("📍 Botão:", deleteBtn);

      // Destacar o botão
      deleteBtn.style.border = "5px solid red";
      deleteBtn.style.transform = "scale(1.5)";
      deleteBtn.style.zIndex = "9999";
      deleteBtn.style.position = "relative";

      console.log("🎯 CLIQUE NO BOTÃO DESTACADO EM VERMELHO PARA TESTAR");

      // Teste automático opcional
      setTimeout(() => {
        console.log("🤖 Simulando clique automático...");
        deleteBtn.click();
      }, 2000);
    } else {
      console.log("❌ Botão de exclusão NÃO encontrado");

      // Listar todos os botões do bloco
      const allButtons = firstBlock.querySelectorAll("button");
      console.log(`🔍 Botões no bloco (${allButtons.length}):`);
      allButtons.forEach((btn, i) => {
        console.log(`   ${i}: ${btn.title || btn.textContent || btn.innerHTML}`);
      });
    }
  } else {
    console.log("❌ Nenhum bloco encontrado na página");

    // Verificar se o funnel foi carregado
    const funnelId = localStorage.getItem("currentFunnelId");
    console.log("📋 Funnel ID no localStorage:", funnelId);

    // Tentar forçar carregamento
    console.log("🔄 Tentando forçar reload...");
    setTimeout(() => location.reload(), 1000);
  }
}, 3000);
