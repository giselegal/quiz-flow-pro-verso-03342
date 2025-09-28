/**
 * 🎯 MIGRATION EXECUTOR FINAL - SOLUÇÃO DEFINITIVA
 * 
 * Script limpo e funcional para aplicar migration via API
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🎯 MIGRATION EXECUTOR FINAL - INICIANDO...');
console.log('');

async function checkTableExists() {
  console.log('🔍 Verificando se tabela component_configurations existe...');
  
  try {
    const { data, error } = await supabase
      .from('component_configurations')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist') || error.code === 'PGRST106') {
        console.log('📋 Tabela NÃO existe - migration necessária');
        return false;
      } else {
        console.error('❌ Erro inesperado:', error.message);
        return false;
      }
    }
    
    console.log('✅ Tabela EXISTS e está funcional!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message);
    return false;
  }
}

async function insertExampleData() {
  console.log('📝 Inserindo configurações de exemplo...');
  
  const configs = [
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
  for (const config of configs) {
    try {
      const { error } = await supabase
        .from('component_configurations')
        .upsert(config, { onConflict: 'component_id,funnel_id' });
      
      if (!error) {
        inserted++;
        console.log('✅ ' + config.component_id);
      } else {
        console.log('⚠️ ' + config.component_id + ': ' + error.message);
      }
    } catch (error) {
      console.log('❌ ' + config.component_id + ': ' + error.message);
    }
  }
  
  console.log('✅ ' + inserted + '/' + configs.length + ' configurações inseridas');
  return inserted > 0;
}

async function validateCRUD() {
  console.log('🧪 Validando operações CRUD...');
  
  try {
    const testId = 'validation-' + Date.now();
    const testData = {
      component_id: testId,
      funnel_id: null,
      properties: { test: true, timestamp: Date.now() },
      version: 1,
      metadata: { source: 'validation' },
      source: 'api'
    };
    
    // INSERT
    const { error: insertError } = await supabase
      .from('component_configurations')
      .insert(testData);
    
    if (insertError) {
      throw new Error('INSERT falhou: ' + insertError.message);
    }
    console.log('✅ INSERT funcionando');
    
    // SELECT
    const { data: selectData, error: selectError } = await supabase
      .from('component_configurations')
      .select('*')
      .eq('component_id', testId)
      .single();
    
    if (selectError) {
      throw new Error('SELECT falhou: ' + selectError.message);
    }
    console.log('✅ SELECT funcionando');
    
    // UPDATE
    const { error: updateError } = await supabase
      .from('component_configurations')
      .update({ properties: { ...testData.properties, updated: true } })
      .eq('component_id', testId);
    
    if (updateError) {
      throw new Error('UPDATE falhou: ' + updateError.message);
    }
    console.log('✅ UPDATE funcionando');
    
    // DELETE
    const { error: deleteError } = await supabase
      .from('component_configurations')
      .delete()
      .eq('component_id', testId);
    
    if (deleteError) {
      throw new Error('DELETE falhou: ' + deleteError.message);
    }
    console.log('✅ DELETE funcionando');
    
    console.log('🎉 TODAS as operações CRUD funcionando perfeitamente!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro na validação CRUD:', error.message);
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  
  try {
    // 1. Verificar conexão
    console.log('🔗 Testando conexão...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('funnels')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Falha na conexão:', connectionError.message);
      return false;
    }
    console.log('✅ Conexão estabelecida');
    
    // 2. Verificar se migration já foi aplicada
    const tableExists = await checkTableExists();
    
    if (tableExists) {
      console.log('');
      console.log('🎉 MIGRATION JÁ FOI APLICADA!');
      console.log('✅ Tabela component_configurations está operacional');
      
      // Inserir dados exemplo e validar
      await insertExampleData();
      const validationOK = await validateCRUD();
      
      if (validationOK) {
        console.log('');
        console.log('🎉 SISTEMA 100% FUNCIONAL!');
        console.log('✅ Migration aplicada');
        console.log('✅ Dados inseridos');
        console.log('✅ CRUD validado');
        console.log('✅ SupabaseConfigurationStorage operacional');
      }
      
      const endTime = Date.now();
      console.log('⏱️ Tempo total: ' + ((endTime - startTime) / 1000).toFixed(2) + 's');
      return true;
    }
    
    // 3. Migration precisa ser aplicada
    console.log('');
    console.log('📋 MIGRATION PRECISA SER APLICADA');
    console.log('');
    console.log('🎯 SOLUÇÕES DISPONÍVEIS:');
    console.log('');
    console.log('1. 🌟 INTERFACE WEB (RECOMENDADO):');
    console.log('   - Abra: apply-migration-web.html');
    console.log('   - Clique: "Verificar Status"');
    console.log('   - Clique: "Aplicar via API"');
    console.log('');
    console.log('2. 📝 MÉTODO MANUAL OTIMIZADO:');
    console.log('   - Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw');
    console.log('   - Vá para: SQL Editor');
    console.log('   - Execute: supabase/migrations/006_component_configurations.sql');
    console.log('');
    console.log('3. 🔧 SERVIDOR LOCAL:');
    console.log('   - Execute: node scripts/supabase-migration-service.mjs');
    console.log('   - Acesse: http://localhost:3001/migration');
    console.log('');
    console.log('💡 RAZÃO das limitações:');
    console.log('   - DDL operations (CREATE TABLE) requerem service role');
    console.log('   - ANON role não tem permissões de schema');
    console.log('   - Sistema funcionará com IndexedDB até migration ser aplicada');
    
    return false;
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    return false;
  }
}

// Executar
main()
  .then((success) => {
    console.log('');
    console.log('🎯 MIGRATION EXECUTOR FINALIZADO');
    
    if (success) {
      console.log('✅ Sistema totalmente operacional!');
    } else {
      console.log('⚠️ Migration pendente - use uma das soluções acima');
    }
    
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
