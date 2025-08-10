const { createClient } = require("@supabase/supabase-js");

// Configurações do Supabase
const supabaseUrl = "https://txqljpitotmcxntprxiu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cWxqcGl0b3RtY3hudHByeGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjI3MzQsImV4cCI6MjA2NTQzODczNH0.rHGZV47KUnSJ0fDNXbL-OjuB50BsuzT2IeO_LL-P8ok";

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🔍 DIAGNÓSTICO: Verificando permissões e limitações da API\n");

async function diagnoseSupabasePermissions() {
  console.log("📋 Informações da conexão:");
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Tipo de chave: Anônima (limitada)\n`);

  console.log("🔐 LIMITAÇÕES DA CHAVE ANÔNIMA:");
  console.log("   ❌ Não pode criar tabelas (CREATE TABLE)");
  console.log("   ❌ Não pode alterar estrutura do banco (DDL)");
  console.log("   ❌ Não pode executar comandos administrativos");
  console.log("   ✅ Pode ler/escrever dados (com RLS)");
  console.log("   ✅ Pode executar funções permitidas\n");

  console.log("💡 SOLUÇÕES DISPONÍVEIS:\n");

  console.log("🎯 SOLUÇÃO 1 - MANUAL (RECOMENDADA):");
  console.log("   1. Acesse: https://supabase.com/dashboard/project/txqljpitotmcxntprxiu");
  console.log("   2. Faça login na sua conta");
  console.log('   3. Vá para "SQL Editor"');
  console.log('   4. Cole e execute o SQL do arquivo "create-funnel-tables.sql"');
  console.log('   5. Clique em "Run" para executar\n');

  console.log("🔧 SOLUÇÃO 2 - CHAVE DE SERVIÇO:");
  console.log('   1. No Supabase Dashboard, vá em "Settings" > "API"');
  console.log('   2. Copie a "service_role key" (⚠️  CUIDADO: muito poderosa!)');
  console.log('   3. Adicione no .env: SUPABASE_SERVICE_KEY="sua_chave_aqui"');
  console.log("   4. Execute: node create-tables-with-service-key.cjs\n");

  console.log("📝 CONTEÚDO PARA COPIAR NO SQL EDITOR:");
  console.log("   Arquivo: create-funnel-tables.sql");
  console.log("   Localização: raiz do projeto\n");

  // Tentar uma verificação básica
  try {
    console.log("🧪 Testando conexão básica...");
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("   ⚠️  Erro na sessão:", error.message);
    } else {
      console.log("   ✅ Conexão com Supabase estabelecida");
    }
  } catch (err) {
    console.log("   ❌ Erro de conexão:", err.message);
  }

  console.log("\n🚀 PRÓXIMOS PASSOS:");
  console.log("   1. Use a SOLUÇÃO 1 (manual) para criar as tabelas");
  console.log("   2. Execute: node check-tables.cjs (para verificar)");
  console.log("   3. Teste o sistema de funis no editor");
  console.log("\n✨ Após criar as tabelas, o sistema estará pronto para uso!");
}

// Executar diagnóstico
diagnoseSupabasePermissions();
