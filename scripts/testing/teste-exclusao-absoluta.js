// COLOQUE ISSO NO CONSOLE DO NAVEGADOR EM http://localhost:8080/editor

console.log("🚨 TESTE DE EXCLUSÃO ABSOLUTA");

// Carregar funnel
localStorage.setItem("currentFunnelId", "funnel_1753399767385_kgc4wwjsc");

// Aguardar e forçar exclusão
setTimeout(() => {
  console.log("🔍 Procurando blocos...");

  const blocks = document.querySelectorAll("[data-block-id]");
  console.log(`📦 Blocos encontrados: ${blocks.length}`);

  if (blocks.length > 0) {
    const firstBlock = blocks[0];
    const blockId = firstBlock.getAttribute("data-block-id");

    console.log(`🎯 Excluindo bloco: ${blockId}`);

    // FORÇAR EXCLUSÃO VISUAL IMEDIATA
    firstBlock.style.background = "red";
    firstBlock.style.border = "5px solid black";
    firstBlock.innerHTML =
      '<div style="padding:20px;color:white;font-size:24px;text-align:center;">🗑️ BLOCO EXCLUÍDO!</div>';

    setTimeout(() => {
      firstBlock.style.opacity = "0";
      firstBlock.style.transform = "scale(0)";
      setTimeout(() => firstBlock.remove(), 500);
    }, 1000);

    console.log("✅ EXCLUSÃO VISUAL FORÇADA EXECUTADA");
  } else {
    console.log("❌ Nenhum bloco encontrado");
    console.log("🔄 Recarregando página...");
    location.reload();
  }
}, 2000);

console.log("⏱️ Aguarde 3 segundos...");
