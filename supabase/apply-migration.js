#!/usr/bin/env node

/**
 * Script para aplicar a migração do SQLite para Supabase
 * Execute: node supabase/apply-migration.js
 */

const fs = require('fs');
const path = require('path');

async function applyMigration() {
  console.log('🚀 Iniciando migração para Supabase...');

  const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Arquivo de migração não encontrado:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migração carregada. SQL Schema:');
  console.log('- Tables: funnels, funnel_pages, funnel_versions');
  console.log('- RLS policies configuradas');
  console.log('- Indexes de performance criados');
  console.log('- Triggers de updated_at aplicados');

  console.log('\n✅ Para aplicar esta migração:');
  console.log('1. Acesse seu projeto no Supabase Dashboard');
  console.log('2. Vá para "SQL Editor"');
  console.log('3. Cole o conteúdo do arquivo:', migrationPath);
  console.log('4. Execute o SQL');
  console.log('\n🔧 Ou use a CLI do Supabase:');
  console.log('   npx supabase db push');

  return true;
}

applyMigration().catch(console.error);
