// SOLUÇÃO DE EMERGÊNCIA - Adicionar diretamente ao HTML
// Cole este código no console do navegador em http://localhost:8080/editor

function emergencyDeleteFix() {
  console.log("🚨 EMERGÊNCIA: Corrigindo exclusão de componentes...");

  // 1. Garantir que o funnel está carregado
  localStorage.setItem("currentFunnelId", "funnel_1753399767385_kgc4wwjsc");

  // 2. Aguardar e então aplicar correções
  setTimeout(() => {
    // 3. Forçar CSS para mostrar botões
    const emergencyStyle = document.createElement("style");
    emergencyStyle.id = "emergency-delete-fix";
    emergencyStyle.textContent = `
      /* Forçar visibilidade de todos os botões de controle */
      .group .opacity-0,
      .group .opacity-90,
      .group-hover\\:opacity-90,
      .group-hover\\:opacity-100 {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Destacar botões de exclusão */
      button[title*="Excluir"] svg,
      button[title*="excluir"] svg,
      svg.lucide-trash-2,
      .lucide-trash-2 {
        color: red !important;
        background: rgba(255, 0, 0, 0.1) !important;
      }
      
      /* Botões de controle sempre visíveis */
      [class*="absolute"][class*="top-2"][class*="right-2"] {
        opacity: 1 !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid #ccc !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      
      /* Hover para destacar área de exclusão */
      button[title*="Excluir"]:hover,
      button[title*="excluir"]:hover {
        background: red !important;
        color: white !important;
        transform: scale(1.1) !important;
      }
    `;
    document.head.appendChild(emergencyStyle);

    // 4. Procurar e destacar componentes
    const blocks = document.querySelectorAll("[data-block-id], .sortable-block, .block-item");
    console.log(`📦 Componentes encontrados: ${blocks.length}`);

    blocks.forEach((block, index) => {
      block.style.border = "2px solid blue";
      block.style.position = "relative";

      // Adicionar indicador visual
      const indicator = document.createElement("div");
      indicator.textContent = `Componente ${index + 1}`;
      indicator.style.cssText = `
        position: absolute;
        top: -20px;
        left: 0;
        background: blue;
        color: white;
        padding: 2px 6px;
        font-size: 12px;
        z-index: 1000;
      `;
      block.appendChild(indicator);
    });

    // 5. Procurar botões de exclusão
    const deleteButtons = document.querySelectorAll(`
      button[title*="Excluir"],
      button[title*="excluir"],
      button:has(svg.lucide-trash-2),
      button:has(.lucide-trash-2)
    `);

    console.log(`🗑️ Botões de exclusão encontrados: ${deleteButtons.length}`);

    deleteButtons.forEach((btn, index) => {
      btn.style.cssText = `
        background: red !important;
        color: white !important;
        border: 3px solid darkred !important;
        opacity: 1 !important;
        z-index: 1001 !important;
        position: relative !important;
      `;

      // Adicionar handler de emergência
      btn.addEventListener("click", function (e) {
        console.log("🚨 CLIQUE DE EMERGÊNCIA no botão de exclusão");
        e.stopPropagation();

        // Tentar encontrar o ID do bloco
        const blockElement = btn.closest("[data-block-id]");
        const blockId = blockElement ? blockElement.getAttribute("data-block-id") : "test-block-1";

        console.log("🎯 Tentando excluir bloco:", blockId);

        // Exclusão forçada via API
        deleteBlockDirectly(blockId);
      });

      console.log(`Botão ${index}:`, btn);
    });

    if (deleteButtons.length === 0) {
      console.log("❌ PROBLEMA: Nenhum botão de exclusão encontrado!");
      console.log("🔧 Verificando elementos disponíveis...");

      // Listar todos os botões
      const allButtons = document.querySelectorAll("button");
      console.log(`Total de botões: ${allButtons.length}`);

      allButtons.forEach((btn, i) => {
        if (btn.innerHTML.includes("svg") || btn.innerHTML.includes("Trash")) {
          console.log(`Botão ${i} (possível exclusão):`, btn.innerHTML);
        }
      });
    }

    console.log("✅ Correção de emergência aplicada!");
  }, 2000);
}

// Função para exclusão direta via API
async function deleteBlockDirectly(blockId) {
  console.log("🚀 Exclusão direta via API para:", blockId);

  try {
    const funnelId = localStorage.getItem("currentFunnelId") || "funnel_1753399767385_kgc4wwjsc";

    // Buscar funnel
    const response = await fetch(`http://localhost:3001/api/schema-driven/funnels/${funnelId}`);
    const funnel = await response.json();

    console.log("📋 Funnel carregado:", funnel.name);
    console.log("📄 Páginas:", funnel.pages?.length);
    console.log("📦 Blocos antes:", funnel.pages?.[0]?.blocks?.length);

    // Remover bloco
    if (funnel.pages && funnel.pages[0]) {
      funnel.pages[0].blocks = funnel.pages[0].blocks.filter(block => block.id !== blockId);
      console.log("📦 Blocos depois:", funnel.pages[0].blocks.length);

      // Salvar
      const updateResponse = await fetch(
        `http://localhost:3001/api/schema-driven/funnels/${funnelId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(funnel),
        }
      );

      if (updateResponse.ok) {
        console.log("✅ Bloco excluído com sucesso!");
        alert("✅ Bloco excluído! Recarregando página...");
        location.reload();
      } else {
        console.error("❌ Erro ao salvar:", updateResponse.status);
      }
    }
  } catch (error) {
    console.error("❌ Erro na exclusão:", error);
  }
}

// Executar correção
console.log("🚨 INICIANDO CORREÇÃO DE EMERGÊNCIA...");
emergencyDeleteFix();

console.log(`
📋 INSTRUÇÕES:
1. Os componentes devem aparecer com bordas azuis
2. Botões de exclusão devem ficar vermelhos  
3. Clique no botão vermelho para excluir
4. Se não funcionar, execute: deleteBlockDirectly('test-block-1')
`);
