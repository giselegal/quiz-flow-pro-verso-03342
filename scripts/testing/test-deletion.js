// Script para testar a funcionalidade de exclusão no editor
// Execute no console do navegador em http://localhost:8080/editor

console.log("🧪 Testando funcionalidade de exclusão no editor...");

// Função para aguardar elemento aparecer
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Elemento ${selector} não encontrado em ${timeout}ms`));
    }, timeout);
  });
}

// Função principal de teste
async function testDeletion() {
  try {
    console.log("1. Verificando se o editor carregou...");

    // Aguardar o canvas carregar
    await waitForElement('[data-testid="droppable-canvas"], .canvas-container, .editor-canvas');
    console.log("   ✅ Canvas encontrado");

    // Verificar se existem componentes
    const existingBlocks = document.querySelectorAll(
      "[data-block-id], .block-item, .sortable-block"
    );
    console.log(`   📦 Componentes existentes: ${existingBlocks.length}`);

    if (existingBlocks.length > 0) {
      console.log("2. Testando exclusão de componente existente...");

      // Procurar botão de exclusão
      const deleteButtons = document.querySelectorAll(
        'button[title*="xcluir"], button[title*="elete"], .delete-btn, [data-action="delete"]'
      );
      console.log(`   🗑️  Botões de exclusão encontrados: ${deleteButtons.length}`);

      if (deleteButtons.length > 0) {
        console.log("   Clicando no primeiro botão de exclusão...");
        deleteButtons[0].click();

        // Aguardar um pouco para a exclusão processar
        setTimeout(() => {
          const remainingBlocks = document.querySelectorAll(
            "[data-block-id], .block-item, .sortable-block"
          );
          console.log(`   📦 Componentes após exclusão: ${remainingBlocks.length}`);

          if (remainingBlocks.length < existingBlocks.length) {
            console.log("   ✅ Exclusão funcionou!");
          } else {
            console.log("   ❌ Exclusão não funcionou");
          }
        }, 1000);
      } else {
        console.log("   ❌ Nenhum botão de exclusão encontrado");

        // Listar todos os botões para debug
        const allButtons = document.querySelectorAll("button");
        console.log(`   🔍 Total de botões na página: ${allButtons.length}`);

        allButtons.forEach((btn, index) => {
          const text = btn.textContent || btn.title || btn.getAttribute("aria-label") || "";
          if (
            text.toLowerCase().includes("excl") ||
            text.toLowerCase().includes("delet") ||
            text.innerHTML.includes("trash")
          ) {
            console.log(`     Botão ${index}: "${text}" - HTML: ${btn.innerHTML}`);
          }
        });
      }
    } else {
      console.log("2. Nenhum componente para excluir. Vamos tentar adicionar um...");

      // Procurar sidebar de componentes
      const sidebar = document.querySelector(
        '.components-sidebar, .sidebar, [data-testid="components-sidebar"]'
      );
      if (sidebar) {
        console.log("   📋 Sidebar de componentes encontrada");

        // Procurar componentes para arrastar
        const draggableComponents = sidebar.querySelectorAll(
          '[draggable="true"], .draggable-component, .component-item'
        );
        console.log(`   🎯 Componentes arrastáveis: ${draggableComponents.length}`);

        if (draggableComponents.length > 0) {
          console.log("   Para testar, arraste um componente para o canvas e tente excluí-lo");
        }
      }
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executar teste
testDeletion();
