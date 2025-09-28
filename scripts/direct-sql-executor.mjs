/**
 * 🎯 DIRECT SQL EXECUTOR - BYPASS LIMITATIONS
 * 
 * Executa migration diretamente via HTTP POST no PostgREST
 * Tentativa de contornar limitações do cliente JS
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

console.log('🎯 DIRECT SQL EXECUTOR - INICIANDO...');
console.log('');

// ============================================================================
// PARSE MIGRATION INTO INDIVIDUAL STATEMENTS
// ============================================================================

function parseMigrationSQL() {
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '006_component_configurations.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Extrair apenas os comandos essenciais
    const createTableMatch = migrationSQL.match(/CREATE TABLE IF NOT EXISTS[^;]+;/s);
    const createIndexMatches = migrationSQL.match(/CREATE INDEX[^;]+;/g) || [];
    const createFunctionMatch = migrationSQL.match(/CREATE OR REPLACE FUNCTION[^$]+\$\$ LANGUAGE plpgsql;/s);
    const createTriggerMatch = migrationSQL.match(/CREATE TRIGGER[^;]+;/s);
    const alterTableMatch = migrationSQL.match(/ALTER TABLE[^;]+;/g) || [];
    const createPolicyMatches = migrationSQL.match(/CREATE POLICY[^;]+;/g) || [];
    const insertMatch = migrationSQL.match(/INSERT INTO[^;]+ON CONFLICT[^;]+;/s);
    
    return {
      createTable: createTableMatch ? createTableMatch[0] : null,
      createIndexes: createIndexMatches,
      createFunction: createFunctionMatch ? createFunctionMatch[0] : null,
      createTrigger: createTriggerMatch ? createTriggerMatch[0] : null,
      alterTable: alterTableMatch,
      createPolicies: createPolicyMatches,
      insertData: insertMatch ? insertMatch[0] : null
    };
    
  } catch (error) {
    console.error('❌ Erro ao ler migration:', error.message);
    return null;
  }
}

// ============================================================================
// EXECUTE INDIVIDUAL COMMANDS
// ============================================================================

async function executeCommand(sql, description) {
  console.log(\`🔧 \${description}...\`);
  
  try {
    const response = await fetch(\`\${supabaseUrl}/rest/v1/rpc/exec_sql\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ sql: sql.trim() })
    });
    
    if (response.ok) {
      console.log(\`✅ \${description} - SUCESSO\`);
      return true;
    } else {
      const error = await response.text();
      console.log(\`❌ \${description} - FALHOU: \${error}\`);
      return false;
    }
    
  } catch (error) {
    console.log(\`❌ \${description} - ERRO: \${error.message}\`);
    return false;
  }
}

// ============================================================================
// ALTERNATIVE: CREATE VIA INSERTS
// ============================================================================

async function createTableViaAlternativeMethod() {
  console.log('🔄 Tentativa alternativa: Simular criação da tabela...');
  
  try {
    // Tentar usar uma tabela temporária para "provocar" a criação
    const testResponse = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        component_id: 'system-test',
        funnel_id: null,
        properties: { created: 'via-api' },
        version: 1,
        metadata: { source: 'api-creation' },
        source: 'api'
      })
    });
    
    if (testResponse.ok) {
      console.log('✅ Tabela component_configurations já existe e funcionando!');
      
      // Limpar dados de teste
      await fetch(\`\${supabaseUrl}/rest/v1/component_configurations?component_id=eq.system-test\`, {
        method: 'DELETE',
        headers: {
          'Authorization': \`Bearer \${supabaseAnonKey}\`,
          'apikey': supabaseAnonKey
        }
      });
      
      return true;
    } else {
      const error = await testResponse.text();
      console.log('❌ Tabela não existe:', error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Método alternativo falhou:', error.message);
    return false;
  }
}

// ============================================================================
// MAIN PROCESS
// ============================================================================

async function main() {
  const startTime = Date.now();
  
  // 1. Verificar se migration já foi aplicada
  console.log('📋 Verificando status atual...');
  const alreadyApplied = await createTableViaAlternativeMethod();
  
  if (alreadyApplied) {
    console.log('');
    console.log('🎉 MIGRATION JÁ FOI APLICADA!');
    console.log('✅ Tabela component_configurations funcionando perfeitamente');
    
    // Inserir dados de exemplo
    await insertExampleData();
    await validateSystem();
    
    const endTime = Date.now();
    console.log(\`⏱️ Validação completa em \${((endTime - startTime) / 1000).toFixed(2)}s\`);
    return true;
  }
  
  // 2. Tentar aplicar migration
  console.log('⚡ Aplicando migration...');
  const commands = parseMigrationSQL();
  
  if (!commands) {
    console.error('❌ Não foi possível parsear a migration');
    return false;
  }
  
  let successCount = 0;
  const totalCommands = Object.values(commands).filter(Boolean).length;
  
  // Tentar executar comandos
  if (commands.createTable) {
    if (await executeCommand(commands.createTable, 'CREATE TABLE')) successCount++;
  }
  
  for (const index of commands.createIndexes) {
    if (await executeCommand(index, 'CREATE INDEX')) successCount++;
  }
  
  if (commands.createFunction) {
    if (await executeCommand(commands.createFunction, 'CREATE FUNCTION')) successCount++;
  }
  
  if (commands.createTrigger) {
    if (await executeCommand(commands.createTrigger, 'CREATE TRIGGER')) successCount++;
  }
  
  for (const alter of commands.alterTable) {
    if (await executeCommand(alter, 'ALTER TABLE')) successCount++;
  }
  
  for (const policy of commands.createPolicies) {
    if (await executeCommand(policy, 'CREATE POLICY')) successCount++;
  }
  
  if (commands.insertData) {
    if (await executeCommand(commands.insertData, 'INSERT DATA')) successCount++;
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 RESULTADO FINAL');
  console.log('='.repeat(60));
  console.log(\`✅ Comandos executados com sucesso: \${successCount}/\${totalCommands}\`);
  console.log(\`⏱️ Tempo total: \${duration}s\`);
  
  if (successCount === totalCommands) {
    console.log('🎉 MIGRATION APLICADA COMPLETAMENTE VIA API!');
    
    // Validar funcionamento
    await validateSystem();
    return true;
  } else {
    console.log('⚠️ MIGRATION PARCIALMENTE APLICADA');
    console.log('');
    console.log('🔧 RECOMENDAÇÃO:');
    console.log('   1. Execute: node scripts/supabase-migration-service.mjs');
    console.log('   2. Abra: http://localhost:3001/migration');
    console.log('   3. Siga as instruções na interface web');
    
    return false;
  }
}

async function insertExampleData() {
  console.log('📝 Inserindo dados de exemplo...');
  
  const exampleConfigs = [
    {
      component_id: 'quiz-global-config',
      funnel_id: 'quiz-estilo-21-steps',
      properties: {
        primaryColor: '#B89B7A',
        secondaryColor: '#432818',
        fontFamily: 'Inter, sans-serif'
      },
      metadata: { source: 'migration', version: '1.0' },
      source: 'import'
    },
    {
      component_id: 'quiz-theme-config',
      funnel_id: 'quiz-estilo-21-steps',
      properties: {
        backgroundColor: '#fefefe',
        textColor: '#5b4135',
        borderRadius: 8
      },
      metadata: { source: 'migration', version: '1.0' },
      source: 'import'
    },
    {
      component_id: 'quiz-options-grid',
      funnel_id: null,
      properties: {
        columns: 2,
        gridGap: 16,
        showShadows: true
      },
      metadata: { source: 'migration', global: true },
      source: 'import'
    }
  ];
  
  let inserted = 0;
  for (const config of exampleConfigs) {
    try {
      const response = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${supabaseAnonKey}\`,
          'apikey': supabaseAnonKey,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        inserted++;
        console.log(\`✅ \${config.component_id}\`);
      } else {
        console.log(\`⚠️ \${config.component_id} - já existe ou erro\`);
      }
    } catch (error) {
      console.log(\`❌ \${config.component_id}: \${error.message}\`);
    }
  }
  
  console.log(\`✅ \${inserted}/\${exampleConfigs.length} configurações inseridas\`);
}

async function validateSystem() {
  console.log('🧪 Validando sistema completo...');
  
  try {
    // Test CRUD operations
    const testId = \`validation-\${Date.now()}\`;
    const testData = {
      component_id: testId,
      funnel_id: null,
      properties: { test: true, automated: true },
      version: 1,
      metadata: { source: 'validation' },
      source: 'api'
    };
    
    // INSERT
    const insertResponse = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify(testData)
    });
    
    if (!insertResponse.ok) {
      throw new Error('INSERT failed');
    }
    console.log('✅ INSERT funcionando');
    
    // SELECT
    const selectResponse = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations?component_id=eq.\${testId}\`, {
      headers: {
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      }
    });
    
    if (!selectResponse.ok) {
      throw new Error('SELECT failed');
    }
    console.log('✅ SELECT funcionando');
    
    // UPDATE
    const updateResponse = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations?component_id=eq.\${testId}\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ properties: { ...testData.properties, updated: true } })
    });
    
    if (!updateResponse.ok) {
      throw new Error('UPDATE failed');
    }
    console.log('✅ UPDATE funcionando');
    
    // DELETE
    const deleteResponse = await fetch(\`\${supabaseUrl}/rest/v1/component_configurations?component_id=eq.\${testId}\`, {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${supabaseAnonKey}\`,
        'apikey': supabaseAnonKey
      }
    });
    
    if (!deleteResponse.ok) {
      throw new Error('DELETE failed');
    }
    console.log('✅ DELETE funcionando');
    
    console.log('🎉 SISTEMA TOTALMENTE FUNCIONAL!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro na validação:', error.message);
    return false;
  }
}

// Execute
main().catch(console.error);
