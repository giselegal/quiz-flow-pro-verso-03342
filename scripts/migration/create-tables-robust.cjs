const { createClient } = require("@supabase/supabase-js");

// Configuração do Supabase com chave de serviço
const SUPABASE_URL = "https://pwtjuuhchtbzttrzoutw.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM0NDQ2MCwiZXhwIjoyMDY3OTIwNDYwfQ.jkXLyH0tJttuL_P-Kt7dGsIzyBuLWZRJ3NZi6F9trUI";

// Criar cliente Supabase com chave de serviço
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTablesDirectly() {
  try {
    console.log("🔧 Criando tabelas diretamente no Supabase...\n");

    // SQL para criar as tabelas
    const createFunnelsTable = `
      CREATE TABLE IF NOT EXISTS public.funnels (
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
    `;

    const createFunnelPagesTable = `
      CREATE TABLE IF NOT EXISTS public.funnel_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
        page_type TEXT NOT NULL,
        page_order INTEGER NOT NULL,
        title TEXT,
        blocks JSONB NOT NULL DEFAULT '[]',
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON public.funnel_pages(funnel_id);
      CREATE INDEX IF NOT EXISTS idx_funnel_pages_order ON public.funnel_pages(funnel_id, page_order);
    `;

    const createTriggerFunction = `
      CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const createTriggers = `
      DROP TRIGGER IF EXISTS set_timestamp_funnels ON public.funnels;
      CREATE TRIGGER set_timestamp_funnels
        BEFORE UPDATE ON public.funnels
        FOR EACH ROW
        EXECUTE FUNCTION public.trigger_set_timestamp();

      DROP TRIGGER IF EXISTS set_timestamp_funnel_pages ON public.funnel_pages;
      CREATE TRIGGER set_timestamp_funnel_pages
        BEFORE UPDATE ON public.funnel_pages
        FOR EACH ROW
        EXECUTE FUNCTION public.trigger_set_timestamp();
    `;

    const enableRLS = `
      ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.funnel_pages ENABLE ROW LEVEL SECURITY;
    `;

    const createPolicies = `
      -- Políticas para funnels
      DROP POLICY IF EXISTS "Usuários podem ler seus próprios funnels" ON public.funnels;
      CREATE POLICY "Usuários podem ler seus próprios funnels"
        ON public.funnels FOR SELECT
        USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Usuários podem criar seus próprios funnels" ON public.funnels;
      CREATE POLICY "Usuários podem criar seus próprios funnels"
        ON public.funnels FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios funnels" ON public.funnels;
      CREATE POLICY "Usuários podem atualizar seus próprios funnels"
        ON public.funnels FOR UPDATE
        USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Usuários podem deletar seus próprios funnels" ON public.funnels;
      CREATE POLICY "Usuários podem deletar seus próprios funnels"
        ON public.funnels FOR DELETE
        USING (auth.uid() = user_id);

      -- Políticas para funnel_pages
      DROP POLICY IF EXISTS "Usuários podem ler páginas de seus funnels" ON public.funnel_pages;
      CREATE POLICY "Usuários podem ler páginas de seus funnels"
        ON public.funnel_pages FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM public.funnels 
          WHERE funnels.id = funnel_pages.funnel_id 
          AND funnels.user_id = auth.uid()
        ));

      DROP POLICY IF EXISTS "Usuários podem criar páginas em seus funnels" ON public.funnel_pages;
      CREATE POLICY "Usuários podem criar páginas em seus funnels"
        ON public.funnel_pages FOR INSERT
        WITH CHECK (EXISTS (
          SELECT 1 FROM public.funnels 
          WHERE funnels.id = funnel_pages.funnel_id 
          AND funnels.user_id = auth.uid()
        ));

      DROP POLICY IF EXISTS "Usuários podem atualizar páginas em seus funnels" ON public.funnel_pages;
      CREATE POLICY "Usuários podem atualizar páginas em seus funnels"
        ON public.funnel_pages FOR UPDATE
        USING (EXISTS (
          SELECT 1 FROM public.funnels 
          WHERE funnels.id = funnel_pages.funnel_id 
          AND funnels.user_id = auth.uid()
        ));

      DROP POLICY IF EXISTS "Usuários podem deletar páginas em seus funnels" ON public.funnel_pages;
      CREATE POLICY "Usuários podem deletar páginas em seus funnels"
        ON public.funnel_pages FOR DELETE
        USING (EXISTS (
          SELECT 1 FROM public.funnels 
          WHERE funnels.id = funnel_pages.funnel_id 
          AND funnels.user_id = auth.uid()
        ));
    `;

    // Executar cada comando SQL
    const commands = [
      { name: "Criando tabela funnels", sql: createFunnelsTable },
      { name: "Criando tabela funnel_pages", sql: createFunnelPagesTable },
      { name: "Criando índices", sql: createIndexes },
      { name: "Criando função de trigger", sql: createTriggerFunction },
      { name: "Criando triggers", sql: createTriggers },
      { name: "Habilitando RLS", sql: enableRLS },
      { name: "Criando políticas", sql: createPolicies },
    ];

    for (const command of commands) {
      console.log(`📝 ${command.name}...`);

      try {
        // Usar a API REST do Supabase para executar SQL
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            apikey: SUPABASE_SERVICE_KEY,
          },
          body: JSON.stringify({ sql: command.sql }),
        });

        if (!response.ok) {
          // Se exec_sql não funcionar, tentar método alternativo
          console.log(`   ⚠️  exec_sql falhou, tentando método direto...`);

          // Método alternativo: usar query direta
          const { data, error } = await supabase
            .from("_supabase_sql_execute")
            .insert({ query: command.sql });

          if (error) {
            console.log(`   ❌ Erro: ${error.message}`);
          } else {
            console.log(`   ✅ Sucesso via método alternativo`);
          }
        } else {
          console.log(`   ✅ Sucesso`);
        }
      } catch (err) {
        console.log(`   ❌ Erro: ${err.message}`);
      }
    }

    // Verificar se as tabelas foram criadas
    console.log("\n🔍 Verificando criação das tabelas...");

    try {
      // Verificar tabela funnels
      const { data: funnelsData, error: funnelsError } = await supabase
        .from("funnels")
        .select("*")
        .limit(1);

      if (funnelsError) {
        console.log(`❌ Erro ao acessar tabela funnels: ${funnelsError.message}`);
      } else {
        console.log(`✅ Tabela 'funnels' criada e acessível`);
      }

      // Verificar tabela funnel_pages
      const { data: pagesData, error: pagesError } = await supabase
        .from("funnel_pages")
        .select("*")
        .limit(1);

      if (pagesError) {
        console.log(`❌ Erro ao acessar tabela funnel_pages: ${pagesError.message}`);
      } else {
        console.log(`✅ Tabela 'funnel_pages' criada e acessível`);
      }

      if (!funnelsError && !pagesError) {
        console.log("\n🎉 Todas as tabelas foram criadas com sucesso!");
        console.log("\n📝 Próximos passos:");
        console.log("   1. Execute: node check-tables.cjs");
        console.log("   2. Teste a criação de funnels no editor");
      }
    } catch (err) {
      console.log(`❌ Erro na verificação: ${err.message}`);
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

// Executar a criação das tabelas
createTablesDirectly();
