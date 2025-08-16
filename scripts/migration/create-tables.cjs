const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://txqljpitotmcxntprxiu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cWxqcGl0b3RtY3hudHByeGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTM0NjgsImV4cCI6MjA2NzA2OTQ2OH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log("Criando tabelas no Supabase...");

  try {
    // Criar tabela funnels
    const { data: funnelsData, error: funnelsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS funnels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          user_id UUID,
          is_published BOOLEAN DEFAULT FALSE,
          version INTEGER DEFAULT 1,
          settings JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    });

    if (funnelsError) {
      console.error("Erro ao criar tabela funnels:", funnelsError);
      // Tentar abordagem alternativa - inserir dados de teste
      console.log("Tentando inserir dados de teste diretamente...");

      const { data: testData, error: testError } = await supabase
        .from("funnels")
        .select("count", { count: "exact" });

      if (testError) {
        console.error("Tabela funnels não existe. Erro:", testError);
        console.log("\n=== INSTRUÇÕES PARA CRIAR AS TABELAS ===");
        console.log("1. Acesse o Supabase Dashboard: https://supabase.com/dashboard");
        console.log("2. Vá para o projeto: txqljpitotmcxntprxiu");
        console.log('3. Clique em "SQL Editor" no menu lateral');
        console.log("4. Cole o seguinte SQL e execute:");
        console.log("\n-- Criar tabela funnels");
        console.log(`CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID,
  is_published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela funnel_pages
CREATE TABLE IF NOT EXISTS funnel_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);`);
        console.log("\n5. Após executar o SQL, teste novamente o salvamento do funil.");
        return;
      } else {
        console.log("Tabela funnels já existe!");
      }
    } else {
      console.log("Tabela funnels criada com sucesso!");
    }

    // Criar tabela funnel_pages
    const { data: pagesData, error: pagesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS funnel_pages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
          page_type TEXT NOT NULL,
          page_order INTEGER NOT NULL,
          title TEXT,
          blocks JSONB NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    });

    if (pagesError) {
      console.error("Erro ao criar tabela funnel_pages:", pagesError);
    } else {
      console.log("Tabela funnel_pages criada com sucesso!");
    }

    console.log("Migração concluída!");
  } catch (error) {
    console.error("Erro geral:", error);
  }
}

createTables();
