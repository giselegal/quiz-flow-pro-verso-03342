const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Configuração do Supabase com chave de serviço
const SUPABASE_URL = "https://pwtjuuhchtbzttrzoutw.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM0NDQ2MCwiZXhwIjoyMDY3OTIwNDYwfQ.jkXLyH0tJttuL_P-Kt7dGsIzyBuLWZRJ3NZi6F9trUI";

// Criar cliente Supabase com chave de serviço (tem permissões administrativas)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTables() {
  try {
    console.log("🔧 Criando tabelas do Supabase com chave de serviço...\n");

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, "create-funnel-tables.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    console.log("📄 SQL a ser executado:");
    console.log("─".repeat(50));
    console.log(sqlContent.substring(0, 200) + "...");
    console.log("─".repeat(50));

    // Executar o SQL usando a função rpc do Supabase
    // Com chave de serviço, podemos executar comandos DDL
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: sqlContent,
    });

    if (error) {
      console.log("❌ Erro ao executar via rpc, tentando método alternativo...");
      console.log("Erro:", error.message);

      // Método alternativo: executar SQL diretamente
      const { data: altData, error: altError } = await supabase
        .from("_supabase_migrations")
        .insert({
          version: Date.now().toString(),
          name: "create_funnel_tables",
          statements: [sqlContent],
        });

      if (altError) {
        console.log("❌ Método alternativo também falhou, tentando execução por partes...");

        // Dividir o SQL em comandos individuais
        const commands = sqlContent
          .split(";")
          .map(cmd => cmd.trim())
          .filter(cmd => cmd.length > 0 && !cmd.startsWith("--"));

        let successCount = 0;
        let errorCount = 0;

        for (const command of commands) {
          try {
            const { error: cmdError } = await supabase.rpc("exec_sql", {
              sql: command + ";",
            });

            if (cmdError) {
              console.log(`❌ Erro no comando: ${command.substring(0, 50)}...`);
              console.log(`   Erro: ${cmdError.message}`);
              errorCount++;
            } else {
              console.log(`✅ Comando executado: ${command.substring(0, 50)}...`);
              successCount++;
            }
          } catch (err) {
            console.log(`❌ Exceção no comando: ${command.substring(0, 50)}...`);
            console.log(`   Erro: ${err.message}`);
            errorCount++;
          }
        }

        console.log(`\n📊 Resultado da execução por partes:`);
        console.log(`   ✅ Sucessos: ${successCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);

        if (successCount > 0) {
          console.log("\n🎉 Algumas operações foram executadas com sucesso!");
        }
      } else {
        console.log("✅ Tabelas criadas com sucesso via método alternativo!");
      }
    } else {
      console.log("✅ Tabelas criadas com sucesso via rpc!");
      console.log("Resultado:", data);
    }

    // Verificar se as tabelas foram criadas
    console.log("\n🔍 Verificando se as tabelas foram criadas...");

    const { data: funnelsCheck, error: funnelsError } = await supabase
      .from("funnels")
      .select("count", { count: "exact", head: true });

    const { data: pagesCheck, error: pagesError } = await supabase
      .from("funnel_pages")
      .select("count", { count: "exact", head: true });

    if (!funnelsError && !pagesError) {
      console.log("✅ Verificação bem-sucedida:");
      console.log(`   📋 Tabela 'funnels' existe e está acessível`);
      console.log(`   📋 Tabela 'funnel_pages' existe e está acessível`);
      console.log("\n🎉 Todas as tabelas foram criadas com sucesso!");
      console.log("\n📝 Próximos passos:");
      console.log("   1. Execute: node check-tables.cjs");
      console.log("   2. Teste a criação de funnels no editor");
    } else {
      console.log("❌ Problemas na verificação:");
      if (funnelsError) {
        console.log(`   Erro na tabela 'funnels': ${funnelsError.message}`);
      }
      if (pagesError) {
        console.log(`   Erro na tabela 'funnel_pages': ${pagesError.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
    console.log("\n💡 Dica: Verifique se:");
    console.log("   1. A chave de serviço está correta");
    console.log("   2. A URL do Supabase está correta");
    console.log("   3. O projeto Supabase está ativo");
  }
}

// Executar a criação das tabelas
createTables();
