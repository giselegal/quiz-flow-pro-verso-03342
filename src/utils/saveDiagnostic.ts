// =============================================================================
// DIAGNÓSTICO DO SISTEMA DE SALVAMENTO
// Verifica se as funções de save estão funcionando corretamente
// =============================================================================

import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';
import { supabase } from '../lib/supabase';

export const saveDiagnostic = {
  
  // Testar conexão com Supabase
  async testSupabaseConnection() {
    try {
      console.log('🔍 Testando conexão com Supabase...');
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        console.error('❌ Erro na conexão Supabase:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Conexão Supabase OK:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  // Testar salvamento de um funil teste
  async testFunnelSave() {
    try {
      console.log('🔍 Testando salvamento direto no Supabase...');
      
      // Testar inserção direta no Supabase
      const testData = {
        id: `test-funnel-${Date.now()}`,
        title: 'Teste Salvamento',
        description: 'Funil de teste para verificar salvamento',
        category: 'geral',
        difficulty: 'medium' as const,
        data: {
          funnel: {
            name: 'Teste Salvamento',
            description: 'Funil de teste'
          },
          pages: [],
          config: {}
        },
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Inserir dados
      const { data: insertResult, error: insertError } = await supabase
        .from('quizzes')
        .insert([testData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir:', insertError);
        return { success: false, error: insertError.message };
      }

      console.log('✅ Dados inseridos:', insertResult);

      // Testar atualização
      const { data: updateResult, error: updateError } = await supabase
        .from('quizzes')
        .update({ 
          title: 'Teste Salvamento - MODIFICADO',
          updated_at: new Date().toISOString()
        })
        .eq('id', testData.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('✅ Dados atualizados:', updateResult);

      // Limpar dados de teste
      await supabase
        .from('quizzes')
        .delete()
        .eq('id', testData.id);

      return { 
        success: true, 
        insertResult, 
        updateResult 
      };

    } catch (error) {
      console.error('❌ Erro no teste de salvamento:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  // Executar diagnóstico completo
  async runFullDiagnostic() {
    console.log('🏥 === DIAGNÓSTICO DO SISTEMA DE SALVAMENTO ===');
    
    const results = {
      supabaseConnection: await this.testSupabaseConnection(),
      funnelSave: await this.testFunnelSave()
    };

    console.log('📊 === RESULTADOS DO DIAGNÓSTICO ===');
    console.log('Conexão Supabase:', results.supabaseConnection.success ? '✅' : '❌');
    console.log('Salvamento de Funil:', results.funnelSave.success ? '✅' : '❌');

    if (!results.supabaseConnection.success) {
      console.error('🚨 PROBLEMA: Conexão com Supabase falhando');
      console.error('Erro:', results.supabaseConnection.error);
    }

    if (!results.funnelSave.success) {
      console.error('🚨 PROBLEMA: Salvamento de funil falhando');  
      console.error('Erro:', results.funnelSave.error);
    }

    if (results.supabaseConnection.success && results.funnelSave.success) {
      console.log('🎉 SISTEMA DE SALVAMENTO FUNCIONANDO CORRETAMENTE!');
    }

    return results;
  },

  // Verificar configuração do Supabase
  checkSupabaseConfig() {
    console.log('🔍 Verificando configuração do Supabase...');
    
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };

    console.log('Configuração:', config);
    
    if (!config.hasUrl || !config.hasKey) {
      console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
      console.log('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return false;
    }

    console.log('✅ Configuração do Supabase OK');
    return true;
  }
};

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  (window as any).saveDiagnostic = saveDiagnostic;
}

export default saveDiagnostic;
