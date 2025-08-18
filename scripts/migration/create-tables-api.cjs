const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase (mesmas do projeto)
const supabaseUrl = 'https://txqljpitotmcxntprxiu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cWxqcGl0b3RtY3hudHByeGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjI3MzQsImV4cCI6MjA2NTQzODczNH0.rHGZV47KUnSJ0fDNXbL-OjuB50BsuzT2IeO_LL-P8ok';

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL para criar as tabelas
const createTablesSQL = `
-- Criar tabelas para o Funnel Service

-- Tabela de funnels
CREATE TABLE IF NOT EXISTS funnels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de páginas do funnel
CREATE TABLE IF NOT EXISTS funnel_pages (
  id TEXT PRIMARY KEY,
  funnel_id TEXT NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks JSONB NOT NULL DEFAULT '[]',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_pages_order ON funnel_pages(funnel_id, page_order);

-- Triggers para atualização automática do campo updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_funnels
  BEFORE UPDATE ON funnels
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_funnel_pages
  BEFORE UPDATE ON funnel_pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Políticas de segurança (RLS)
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_pages ENABLE ROW LEVEL SECURITY;

-- Políticas para funnels
CREATE POLICY "Usuários podem ler seus próprios funnels"
  ON funnels FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem criar seus próprios funnels"
  ON funnels FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios funnels"
  ON funnels FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem deletar seus próprios funnels"
  ON funnels FOR DELETE
  USING (auth.uid()::text = user_id);

-- Políticas para funnel_pages
CREATE POLICY "Usuários podem ler páginas de seus funnels"
  ON funnel_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem criar páginas em seus funnels"
  ON funnel_pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem atualizar páginas em seus funnels"
  ON funnel_pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem deletar páginas em seus funnels"
  ON funnel_pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));
`;

async function createTables() {
  console.log('🚀 Iniciando criação das tabelas via API do Supabase...\n');

  try {
    // Executar o SQL via API
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTablesSQL,
    });

    if (error) {
      console.log('❌ Erro ao executar via RPC. Tentando método alternativo...\n');

      // Método alternativo: usar a função sql diretamente
      const { data: sqlData, error: sqlError } = await supabase
        .from('_supabase_sql')
        .insert({ sql: createTablesSQL });

      if (sqlError) {
        console.log(
          '❌ Método alternativo também falhou. Tentando criar tabelas individualmente...\n'
        );

        // Tentar criar as tabelas uma por vez
        await createTablesIndividually();
        return;
      }
    }

    console.log('✅ Tabelas criadas com sucesso via API!\n');

    // Verificar se as tabelas foram criadas
    await verifyTables();
  } catch (err) {
    console.error('❌ Erro inesperado:', err.message);
    console.log('\n📝 SOLUÇÃO MANUAL:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/txqljpitotmcxntprxiu');
    console.log('2. Vá para "SQL Editor"');
    console.log('3. Execute o conteúdo do arquivo "create-funnel-tables.sql"');
  }
}

async function createTablesIndividually() {
  console.log('🔄 Tentando criar tabelas individualmente...\n');

  // SQL dividido em partes menores
  const sqlParts = [
    // Criar função trigger primeiro
    `CREATE OR REPLACE FUNCTION trigger_set_timestamp()
     RETURNS TRIGGER AS $$
     BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
     END;
     $$ LANGUAGE plpgsql;`,

    // Criar tabela funnels
    `CREATE TABLE IF NOT EXISTS funnels (
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       user_id TEXT,
       is_published BOOLEAN DEFAULT FALSE,
       version INTEGER DEFAULT 1,
       settings JSONB,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );`,

    // Criar tabela funnel_pages
    `CREATE TABLE IF NOT EXISTS funnel_pages (
       id TEXT PRIMARY KEY,
       funnel_id TEXT NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
       page_type TEXT NOT NULL,
       page_order INTEGER NOT NULL,
       title TEXT,
       blocks JSONB NOT NULL DEFAULT '[]',
       metadata JSONB,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );`,
  ];

  for (let i = 0; i < sqlParts.length; i++) {
    try {
      console.log(`⏳ Executando parte ${i + 1}/${sqlParts.length}...`);

      // Tentar usar diferentes métodos
      const methods = [
        () => supabase.rpc('exec_sql', { sql: sqlParts[i] }),
        () => supabase.from('_supabase_sql').insert({ sql: sqlParts[i] }),
      ];

      let success = false;
      for (const method of methods) {
        try {
          await method();
          success = true;
          break;
        } catch (err) {
          continue;
        }
      }

      if (success) {
        console.log(`✅ Parte ${i + 1} executada com sucesso`);
      } else {
        console.log(`❌ Falha na parte ${i + 1}`);
      }
    } catch (err) {
      console.log(`❌ Erro na parte ${i + 1}:`, err.message);
    }
  }
}

async function verifyTables() {
  console.log('🔍 Verificando se as tabelas foram criadas...\n');

  try {
    // Tentar acessar a tabela funnels
    const { data: funnelsData, error: funnelsError } = await supabase
      .from('funnels')
      .select('*')
      .limit(1);

    if (funnelsError && funnelsError.code === '42P01') {
      console.log('❌ Tabela "funnels" não existe');
      return false;
    } else if (funnelsError) {
      console.log('⚠️  Erro ao acessar tabela "funnels":', funnelsError.message);
    } else {
      console.log('✅ Tabela "funnels" existe e está acessível');
    }

    // Tentar acessar a tabela funnel_pages
    const { data: pagesData, error: pagesError } = await supabase
      .from('funnel_pages')
      .select('*')
      .limit(1);

    if (pagesError && pagesError.code === '42P01') {
      console.log('❌ Tabela "funnel_pages" não existe');
      return false;
    } else if (pagesError) {
      console.log('⚠️  Erro ao acessar tabela "funnel_pages":', pagesError.message);
    } else {
      console.log('✅ Tabela "funnel_pages" existe e está acessível');
    }

    console.log('\n🎉 Todas as tabelas foram criadas com sucesso!');
    console.log('📝 Agora você pode usar o sistema de funis no editor.');

    return true;
  } catch (err) {
    console.error('❌ Erro ao verificar tabelas:', err.message);
    return false;
  }
}

// Executar o script
createTables();
