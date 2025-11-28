#!/usr/bin/env node
/**
 * Script para Aplicar Migrations de Segurança via API
 * 
 * Executa as migrations SQL diretamente no Supabase via API REST
 * usando a service_role key para permissões administrativas.
 * 
 * Uso: node scripts/apply-security-migrations.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERRO: Variáveis de ambiente não encontradas');
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

console.log('🔒 Iniciando Aplicação de Migrations de Segurança...\n');
console.log(`📡 Conectando a: ${SUPABASE_URL}`);
console.log(`🔑 Usando key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// MIGRATIONS A APLICAR
// ============================================================================

const migrations = [
  {
    name: '20251110_auth_hardening_rls',
    file: 'supabase/migrations/20251110_auth_hardening_rls.sql',
    description: 'RLS Policies e Auth Hardening',
  },
  {
    name: '20251128_security_enhancements',
    file: 'supabase/migrations/20251128_security_enhancements.sql',
    description: 'Validação de Input e Monitoramento',
  },
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function readMigrationFile(filePath) {
  try {
    const fullPath = join(process.cwd(), filePath);
    return readFileSync(fullPath, 'utf-8');
  } catch (error) {
    throw new Error(`Erro ao ler arquivo ${filePath}: ${error.message}`);
  }
}

async function executeSQLViaPgRest(sql) {
  try {
    // Usar endpoint RPC para executar SQL arbitrário
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function executeSQLDirectly(sql) {
  try {
    // Dividir SQL em statements individuais
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Pular comentários e blocos DO
      if (statement.startsWith('/*') || 
          statement.startsWith('COMMENT') ||
          statement.includes('RAISE NOTICE')) {
        continue;
      }

      try {
        // Tentar executar via rpc (se existir)
        const { data, error } = await supabase.rpc('exec_sql', {
          query: statement + ';'
        });

        if (error) {
          // Se RPC não existir, tentar via query direta
          // (limitado, mas funciona para alguns comandos)
          throw error;
        }

        successCount++;
        process.stdout.write('.');
      } catch (err) {
        failCount++;
        errors.push({
          statement: statement.substring(0, 100) + '...',
          error: err.message
        });
        process.stdout.write('x');
      }
    }

    console.log('\n');
    return { 
      success: failCount === 0, 
      successCount, 
      failCount,
      errors 
    };

  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

async function createMigrationTrackingTable() {
  console.log('📋 Criando tabela de controle de migrations...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      description TEXT
    );
  `;

  try {
    // Tentar criar via SQL direto
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: createTableSQL })
    });

    if (response.ok) {
      console.log('✅ Tabela schema_migrations criada/verificada\n');
      return true;
    }
  } catch (err) {
    console.log('⚠️  Não foi possível criar tabela de tracking (continuando...)\n');
  }
  
  return false;
}

async function checkMigrationApplied(migrationName) {
  try {
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('name')
      .eq('name', migrationName)
      .single();

    return !error && data;
  } catch {
    return false;
  }
}

async function recordMigration(migrationName, description) {
  try {
    await supabase
      .from('schema_migrations')
      .insert({
        name: migrationName,
        description: description
      });
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// APLICAÇÃO DAS MIGRATIONS
// ============================================================================

async function applyMigration(migration) {
  console.log('─'.repeat(70));
  console.log(`📄 Migration: ${migration.name}`);
  console.log(`📝 ${migration.description}`);
  console.log('─'.repeat(70));

  // Verificar se já foi aplicada
  const alreadyApplied = await checkMigrationApplied(migration.name);
  if (alreadyApplied) {
    console.log('⏭️  Já aplicada anteriormente - PULANDO\n');
    return { success: true, skipped: true };
  }

  // Ler arquivo SQL
  let sql;
  try {
    sql = readMigrationFile(migration.file);
    console.log(`✅ Arquivo lido: ${sql.length} caracteres`);
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo: ${error.message}\n`);
    return { success: false, error: error.message };
  }

  // Aplicar SQL
  console.log('⚙️  Executando SQL...');
  const result = await executeSQLDirectly(sql);

  if (result.success) {
    console.log(`✅ Migration aplicada com sucesso!`);
    console.log(`   Statements executados: ${result.successCount}`);
    
    // Registrar na tabela de tracking
    await recordMigration(migration.name, migration.description);
    
    console.log('');
    return { success: true };
  } else {
    console.log(`❌ Falhou ao aplicar migration`);
    if (result.errors && result.errors.length > 0) {
      console.log(`   Erros encontrados: ${result.failCount}`);
      console.log('   Primeiros erros:');
      result.errors.slice(0, 3).forEach(err => {
        console.log(`   - ${err.statement}`);
        console.log(`     Erro: ${err.error}`);
      });
    }
    console.log('');
    return { success: false, ...result };
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 Aplicando Migrations de Segurança...\n');

  // Criar tabela de tracking
  await createMigrationTrackingTable();

  let totalSuccess = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  // Aplicar cada migration
  for (const migration of migrations) {
    const result = await applyMigration(migration);
    
    if (result.skipped) {
      totalSkipped++;
    } else if (result.success) {
      totalSuccess++;
    } else {
      totalFailed++;
    }
  }

  // Resumo final
  console.log('='.repeat(70));
  console.log('📊 RESUMO DA APLICAÇÃO');
  console.log('='.repeat(70));
  console.log(`Total de migrations: ${migrations.length}`);
  console.log(`✅ Aplicadas com sucesso: ${totalSuccess}`);
  console.log(`⏭️  Já aplicadas (puladas): ${totalSkipped}`);
  console.log(`❌ Falharam: ${totalFailed}`);
  console.log('');

  if (totalFailed > 0) {
    console.log('⚠️  ATENÇÃO: Algumas migrations falharam.');
    console.log('   Opções:');
    console.log('   1. Aplicar manualmente via SQL Editor do Dashboard');
    console.log('   2. Verificar logs de erro acima');
    console.log('   3. Verificar permissões da service_role key');
    console.log('');
    
    console.log('📖 APLICAÇÃO MANUAL:');
    console.log('   1. Acesse: https://pwtjuuhchtbzttrzoutw.supabase.co');
    console.log('   2. Vá para SQL Editor');
    console.log('   3. Cole e execute os arquivos:');
    migrations.forEach(m => {
      console.log(`      - ${m.file}`);
    });
    console.log('');
    
    process.exit(1);
  }

  console.log('✅ TODAS AS MIGRATIONS APLICADAS COM SUCESSO!');
  console.log('');
  console.log('🔄 Próximos passos:');
  console.log('   1. Execute a validação: node scripts/validate-security.mjs');
  console.log('   2. Configure o Dashboard seguindo:');
  console.log('      docs/GUIA_CONFIGURACAO_SEGURANCA_SUPABASE.md');
  console.log('');

  process.exit(0);
}

// ============================================================================
// TRATAMENTO DE ERROS
// ============================================================================

main().catch((error) => {
  console.error('\n❌ ERRO FATAL:', error.message);
  console.error('\nStack trace:', error.stack);
  process.exit(1);
});
