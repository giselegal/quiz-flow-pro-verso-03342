const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testando a API Schema-Driven...\n');

  try {
    // Test GET
    console.log('1. Testando GET /api/schema-driven/funnels');
    const getResponse = await fetch('http://localhost:3001/api/schema-driven/funnels');
    const getFunnels = await getResponse.json();
    console.log('   Status:', getResponse.status);
    console.log('   Funnels existentes:', getFunnels.length);

    // Test POST
    console.log('\n2. Testando POST /api/schema-driven/funnels');
    const postData = {
      name: 'Funnel Teste via Script',
      description: 'Teste direto via fetch',
      settings: { theme: 'green', primaryColor: '#00cc66' },
    };

    const postResponse = await fetch('http://localhost:3001/api/schema-driven/funnels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    console.log('   Status:', postResponse.status);
    console.log('   Headers:', postResponse.headers.raw());

    const responseText = await postResponse.text();
    console.log('   Response body:', responseText);

    if (responseText) {
      try {
        const newFunnel = JSON.parse(responseText);
        console.log('   ✅ Funnel criado:', newFunnel.id);
      } catch (e) {
        console.log('   Response não é JSON válido');
      }
    }

    // Test GET again to see if it was created
    console.log('\n3. Verificando se foi criado (GET novamente)');
    const getResponse2 = await fetch('http://localhost:3001/api/schema-driven/funnels');
    const getFunnels2 = await getResponse2.json();
    console.log('   Funnels após criação:', getFunnels2.length);

    if (getFunnels2.length > getFunnels.length) {
      console.log('   ✅ Funnel foi criado com sucesso!');
      const newFunnel = getFunnels2[getFunnels2.length - 1];
      console.log('   Último funnel:', {
        id: newFunnel.id,
        name: newFunnel.name,
        description: newFunnel.description,
      });
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAPI();
