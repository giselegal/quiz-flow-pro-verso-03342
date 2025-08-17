const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

async function createTables() {
  console.log('🔄 Conectando ao Supabase...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Testar conexão primeiro
    console.log('🔗 Testando conexão...');
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Erro de conexão:', testError.message);
      return;
    }

    console.log('✅ Conexão OK!');

    // Criar tabelas uma por vez
    const tables = [
      {
        name: 'quiz_users',
        sql: `CREATE TABLE IF NOT EXISTS quiz_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE,
          name VARCHAR(255),
          phone VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      },
      {
        name: 'quiz_sessions',
        sql: `CREATE TABLE IF NOT EXISTS quiz_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES quiz_users(id),
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          current_step INTEGER DEFAULT 1,
          session_data JSONB DEFAULT '{}'
        )`,
      },
      {
        name: 'quiz_step_responses',
        sql: `CREATE TABLE IF NOT EXISTS quiz_step_responses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES quiz_sessions(id),
          step_number INTEGER NOT NULL,
          question TEXT,
          answer TEXT,
          responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      },
      {
        name: 'quiz_results',
        sql: `CREATE TABLE IF NOT EXISTS quiz_results (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES quiz_sessions(id),
          user_id UUID REFERENCES quiz_users(id),
          result_data JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      },
    ];

    for (const table of tables) {
      console.log(`⚙️ Criando tabela ${table.name}...`);

      // Tentar inserir dados de teste para "criar" a tabela
      const { data, error } = await supabase.from(table.name).select('*').limit(1);

      if (error) {
        console.log(`❌ Tabela ${table.name} não existe:`, error.message);
      } else {
        console.log(`✅ Tabela ${table.name} já existe`);
      }
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createTables();
