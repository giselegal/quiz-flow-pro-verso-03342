const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://pwtjuuhchtbzttrzoutw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("Verificando se as tabelas existem no Supabase...");

  try {
    // Tentar uma operação simples na tabela funnels
    const { data, error } = await supabase.from("funnels").select("id").limit(1);

    if (error) {
      console.error("Erro ao acessar tabela funnels:", error);

      if (error.code === "42P01") {
        console.log('\n❌ A tabela "funnels" não existe no banco de dados.');
        console.log("\n=== SOLUÇÃO MANUAL ===");
        console.log("1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw");
        console.log('2. Vá para "SQL Editor"');
        console.log("3. Execute o SQL abaixo:");
        console.log("\n```sql");
        console.log("-- Criar tabela funnels");
        console.log("CREATE TABLE funnels (");
        console.log("  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),");
        console.log("  name TEXT NOT NULL,");
        console.log("  description TEXT,");
        console.log("  user_id UUID,");
        console.log("  is_published BOOLEAN DEFAULT FALSE,");
        console.log("  version INTEGER DEFAULT 1,");
        console.log("  settings JSONB,");
        console.log("  created_at TIMESTAMPTZ DEFAULT NOW(),");
        console.log("  updated_at TIMESTAMPTZ DEFAULT NOW()");
        console.log(");");
        console.log("");
        console.log("-- Criar tabela funnel_pages");
        console.log("CREATE TABLE funnel_pages (");
        console.log("  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),");
        console.log("  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,");
        console.log("  page_type TEXT NOT NULL,");
        console.log("  page_order INTEGER NOT NULL,");
        console.log("  title TEXT,");
        console.log("  blocks JSONB NOT NULL,");
        console.log("  metadata JSONB,");
        console.log("  created_at TIMESTAMPTZ DEFAULT NOW(),");
        console.log("  updated_at TIMESTAMPTZ DEFAULT NOW()");
        console.log(");");
        console.log("```");
        console.log("\n4. Após executar, teste novamente o salvamento do funil.");
      } else if (error.message.includes("Invalid API key")) {
        console.log("\n❌ Chave de API inválida.");
        console.log("A chave anônima pode estar incorreta ou expirada.");
        console.log("Verifique as configurações do projeto no Supabase Dashboard.");
      } else {
        console.log("\n❌ Erro desconhecido:", error);
      }
    } else {
      console.log("✅ Tabela funnels existe e é acessível!");
      console.log("Dados encontrados:", data?.length || 0, "registros");

      // Verificar tabela funnel_pages
      const { data: pagesData, error: pagesError } = await supabase
        .from("funnel_pages")
        .select("id")
        .limit(1);

      if (pagesError) {
        console.error("❌ Erro ao acessar tabela funnel_pages:", pagesError);
      } else {
        console.log("✅ Tabela funnel_pages existe e é acessível!");
        console.log("Dados encontrados:", pagesData?.length || 0, "registros");
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
}

checkTables();
