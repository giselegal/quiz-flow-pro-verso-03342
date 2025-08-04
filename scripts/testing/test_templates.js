// Teste simples para verificar se os templates estão funcionando
console.log("🔍 Testando generateRealQuestionTemplates...");

// Simular a função (não conseguimos importar TS diretamente)
console.log("📋 Este teste deve ser executado no navegador");
console.log("💻 Abra o Console do Navegador em http://localhost:8080/editor");
console.log("🧪 Execute o seguinte código no console:");
console.log(`
// TESTE NO CONSOLE DO NAVEGADOR:
console.log('=== TESTE DE TEMPLATES ===');
const templates = generateRealQuestionTemplates();
console.log('Total de templates:', templates.length);
console.log('Template 1:', templates[0]);
console.log('Tipos de blocos do template 1:', templates[0]?.blocks?.map(b => b.type));
`);
