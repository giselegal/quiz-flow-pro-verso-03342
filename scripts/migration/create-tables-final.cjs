const { createClient } = require('@supabase/supabase-js');

// Configuração correta do Supabase
const SUPABASE_URL = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM0NDQ2MCwiZXhwIjoyMDY3OTIwNDYwfQ.jkXLyH0tJttuL_P-Kt7dGsIzyBuLWZRJ3NZi6F9trUI';

// Criar cliente com chave de serviço para operações administrativas
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Criar cliente com chave anônima para verificação
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createTablesCorrectProject() {
  try {
    console.log('🔧 Criando tabelas no projeto correto do Supabase...\n');
    console.log(`📍 URL: ${SUPABASE_URL}`);
    console.log(`🔑 Usando chave de serviço para criação das tabelas\n`);

    // SQL simplificado para criar as tabelas
    const createTablesSQL = `
      -- Criar tabela funnels
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

      -- Criar tabela funnel_pages
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

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON public.funnel_pages(funnel_id);
      CREATE INDEX IF NOT EXISTS idx_funnel_pages_order ON public.funnel_pages(funnel_id, page_order);

      -- Função para trigger de updated_at
      CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Triggers
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

      -- Habilitar RLS
      ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.funnel_pages ENABLE ROW LEVEL SECURITY;

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

    console.log('📝 Executando SQL para criar tabelas...');

    // Tentar executar via API REST diretamente
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          apikey: SUPABASE_SERVICE_KEY,
        },
        body: JSON.stringify({ sql: createTablesSQL }),
      });

      if (response.ok) {
        console.log('✅ Tabelas criadas via API REST');
      } else {
        console.log('⚠️  API REST falhou, tentando método alternativo...');

        // Método alternativo: dividir em comandos menores
        const commands = createTablesSQL
          .split(';')
          .map(cmd => cmd.trim())
          .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

        let successCount = 0;
        for (const command of commands) {
          try {
            const cmdResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
                apikey: SUPABASE_SERVICE_KEY,
              },
              body: JSON.stringify({ sql: command + ';' }),
            });

            if (cmdResponse.ok) {
              successCount++;
            }
          } catch (err) {
            // Ignorar erros individuais
          }
        }

        console.log(`✅ ${successCount} comandos executados com sucesso`);
      }
    } catch (err) {
      console.log('❌ Erro na execução via API:', err.message);
    }

    // Verificar se as tabelas foram criadas usando chave anônima
    console.log('\n🔍 Verificando criação das tabelas com chave anônima...');

    try {
      const { data: funnelsData, error: funnelsError } = await supabaseClient
        .from('funnels')
        .select('*')
        .limit(1);

      if (funnelsError) {
        console.log(`❌ Erro ao acessar tabela funnels: ${funnelsError.message}`);
        console.log(`   Código: ${funnelsError.code}`);
      } else {
        console.log(`✅ Tabela 'funnels' criada e acessível via chave anônima`);
      }

      const { data: pagesData, error: pagesError } = await supabaseClient
        .from('funnel_pages')
        .select('*')
        .limit(1);

      if (pagesError) {
        console.log(`❌ Erro ao acessar tabela funnel_pages: ${pagesError.message}`);
        console.log(`   Código: ${pagesError.code}`);
      } else {
        console.log(`✅ Tabela 'funnel_pages' criada e acessível via chave anônima`);
      }

      if (!funnelsError && !pagesError) {
        console.log('\n🎉 SUCESSO! Todas as tabelas foram criadas e estão funcionais!');
        console.log('\n📝 Próximos passos:');
        console.log('   1. Execute: node check-tables.cjs');
        console.log('   2. Teste a criação de funnels no editor');
        console.log('   3. As tabelas agora usam UUID para compatibilidade total');
      } else {
        console.log('\n⚠️  Tabelas podem ter sido criadas, mas há problemas de acesso.');
        console.log('💡 Isso pode ser normal devido às políticas RLS.');
        console.log('   Execute: node check-tables.cjs para verificar');
      }
    } catch (err) {
      console.log(`❌ Erro na verificação: ${err.message}`);
    }

    // Verificar também com chave de serviço
    console.log('\n🔍 Verificando com chave de serviço...');

    try {
      const { data: adminFunnels, error: adminFunnelsError } = await supabaseAdmin
        .from('funnels')
        .select('*')
        .limit(1);

      const { data: adminPages, error: adminPagesError } = await supabaseAdmin
        .from('funnel_pages')
        .select('*')
        .limit(1);

      if (!adminFunnelsError && !adminPagesError) {
        console.log('✅ Tabelas confirmadas via chave de serviço');
      } else {
        console.log('❌ Problemas detectados via chave de serviço');
        if (adminFunnelsError) console.log(`   funnels: ${adminFunnelsError.message}`);
        if (adminPagesError) console.log(`   funnel_pages: ${adminPagesError.message}`);
      }
    } catch (err) {
      console.log(`❌ Erro na verificação admin: ${err.message}`);
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.log('\n💡 Solução manual:');
    console.log(`   1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw`);
    console.log('   2. Vá para "SQL Editor"');
    console.log('   3. Execute o SQL do arquivo create-funnel-tables.sql');
  }
}

// Executar a criação das tabelas
createTablesCorrectProject();
