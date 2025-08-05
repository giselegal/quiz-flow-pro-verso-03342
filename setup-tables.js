const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const SUPABASE_URL = "https://txqljpitotmcxntprxiu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cWxqcGl0b3RtY3hudHByeGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjI3MzQsImV4cCI6MjA2NTQzODczNH0.rHGZV47KUnSJ0fDNXbL-OjuB50BsuzT2IeO_LL-P8ok";

async function createTables() {
  console.log("🔄 Conectando ao Supabase...");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Ler arquivo SQL
    const sql = fs.readFileSync("create-tables.sql", "utf8");
    console.log("📄 SQL carregado:", sql.substring(0, 100) + "...");

    // Dividir em comandos individuais
    const commands = sql.split(";").filter(cmd => cmd.trim().length > 0);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command) {
        console.log(`⚙️ Executando comando ${i + 1}/${commands.length}...`);
        const { data, error } = await supabase.rpc("exec_sql", {
          sql_query: command,
        });

        if (error) {
          console.log(`⚠️ Erro no comando ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
        }
      }
    }

    // Testar listando tabelas
    console.log("\n🔍 Verificando tabelas criadas...");
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .like("table_name", "quiz_%");

    if (tablesError) {
      console.log("❌ Erro ao listar tabelas:", tablesError.message);
    } else {
      console.log("📊 Tabelas encontradas:", tables);
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

createTables();
