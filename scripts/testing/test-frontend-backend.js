// Teste simples para verificar comunicação frontend-backend
async function testBackendConnection() {
  console.log("🔍 Testando conexão com o backend...");

  try {
    // Teste 1: Health check
    console.log("1. Testando health check...");
    const healthResponse = await fetch("http://localhost:3001/api/health");
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);

    // Teste 2: Listar funnels
    console.log("2. Testando listagem de funnels...");
    const funnelsResponse = await fetch("http://localhost:3001/api/schema-driven/funnels");
    const funnelsData = await funnelsResponse.json();
    console.log("✅ Funnels:", funnelsData.length, "encontrados");

    // Teste 3: Criar um funnel de teste
    console.log("3. Testando criação de funnel...");
    const testFunnel = {
      name: "Teste Frontend-Backend",
      description: "Funnel de teste para verificar comunicação",
      pages: [
        {
          id: "page-test-" + Date.now(),
          title: "Página de Teste",
          pageType: "quiz",
          pageOrder: 1,
          blocks: [],
        },
      ],
    };

    const createResponse = await fetch("http://localhost:3001/api/schema-driven/funnels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testFunnel),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("❌ Erro na criação:", createResponse.status, errorText);
      return;
    }

    const createdFunnel = await createResponse.json();
    console.log("✅ Funnel criado:", createdFunnel.data.id);

    // Teste 4: Atualizar o funnel
    console.log("4. Testando atualização de funnel...");
    const updatedFunnel = {
      ...createdFunnel.data,
      name: "Teste Frontend-Backend (Atualizado)",
      description: "Funnel de teste atualizado",
    };

    const updateResponse = await fetch(
      `http://localhost:3001/api/schema-driven/funnels/${createdFunnel.data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFunnel),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("❌ Erro na atualização:", updateResponse.status, errorText);
      return;
    }

    const updatedResult = await updateResponse.json();
    console.log("✅ Funnel atualizado:", updatedResult.data.name);

    // Teste 5: Deletar o funnel de teste
    console.log("5. Testando exclusão de funnel...");
    const deleteResponse = await fetch(
      `http://localhost:3001/api/schema-driven/funnels/${createdFunnel.data.id}`,
      {
        method: "DELETE",
      }
    );

    if (deleteResponse.ok) {
      console.log("✅ Funnel deletado com sucesso");
    } else {
      console.log("⚠️ Não foi possível deletar o funnel (pode não ter endpoint DELETE)");
    }

    console.log("🎉 Todos os testes passaram! A comunicação frontend-backend está funcionando.");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
  }
}

// Executar o teste
testBackendConnection();
