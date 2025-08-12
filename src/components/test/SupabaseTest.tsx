import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [funnelId, setFunnelId] = useState('');

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('funnels').select('count');
      if (error) throw error;
      addResult(`✅ Conexão bem-sucedida. Dados encontrados: ${data?.length || 0}`);
    } catch (error) {
      addResult(`❌ Erro na conexão: ${error instanceof Error ? error.message : String(error)}`);
    }
    setLoading(false);
  };

  const testInsert = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funnels')
        .insert([
          {
            id: `test-${Date.now()}`,
            name: 'Teste Quiz',
            description: 'Quiz de teste criado automaticamente',
            user_id: 'test-user',
          },
        ])
        .select();

      if (error) throw error;
      addResult(`✅ Inserção bem-sucedida: ${JSON.stringify(data)}`);
    } catch (error) {
      addResult(`❌ Erro na inserção: ${error instanceof Error ? error.message : String(error)}`);
    }
    setLoading(false);
  };

  const testRead = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('funnels').select('*').limit(5);

      if (error) throw error;
      addResult(`✅ Leitura bem-sucedida: ${data?.length || 0} registros encontrados`);
    } catch (error) {
      addResult(`❌ Erro na leitura: ${error instanceof Error ? error.message : String(error)}`);
    }
    setLoading(false);
  };

  const testUpdate = async () => {
    if (!funnelId) {
      addResult('❌ Forneça um ID de funil para testar a atualização');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funnels')
        .update({
          name: 'Teste Quiz Atualizado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', funnelId)
        .select();

      if (error) throw error;
      addResult(`✅ Atualização bem-sucedida: ${JSON.stringify(data)}`);
    } catch (error) {
      addResult(
        `❌ Erro na atualização: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    setLoading(false);
  };

  const testDelete = async () => {
    if (!funnelId) {
      addResult('❌ Forneça um ID de funil para testar a exclusão');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('funnels').delete().eq('id', funnelId);

      if (error) throw error;
      addResult(`✅ Exclusão bem-sucedida para ID: ${funnelId}`);
    } catch (error) {
      addResult(`❌ Erro na exclusão: ${error instanceof Error ? error.message : String(error)}`);
    }
    setLoading(false);
  };

  const testSteps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funnel_pages')
        .select(
          `
          *,
          funnels (
            name
          )
        `
        )
        .limit(3);

      if (error) throw error;
      addResult(`✅ Teste de páginas bem-sucedido: ${data?.length || 0} páginas encontradas`);
    } catch (error) {
      addResult(
        `❌ Erro no teste de páginas: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    setLoading(false);
  };

  const testRealTimeSubscription = () => {
    const subscription = supabase
      .channel('funnels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funnels',
        },
        payload => {
          addResult(`🔄 Mudança em tempo real detectada: ${payload.eventType}`);
        }
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          addResult('✅ Subscrição em tempo real ativa');
        } else if (status === 'CHANNEL_ERROR') {
          addResult(`❌ Erro na subscrição: ${status}`);
        }
      });

    setTimeout(() => {
      subscription.unsubscribe();
      addResult('🔄 Subscrição em tempo real encerrada');
    }, 10000);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Integração Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={testConnection} disabled={loading}>
              Testar Conexão
            </Button>
            <Button onClick={testInsert} disabled={loading}>
              Testar Inserção
            </Button>
            <Button onClick={testRead} disabled={loading}>
              Testar Leitura
            </Button>
            <Button onClick={testSteps} disabled={loading}>
              Testar Páginas
            </Button>
            <Button onClick={testRealTimeSubscription} disabled={loading}>
              Testar Real-time
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="ID do funil para testes de Update/Delete"
              value={funnelId}
              onChange={e => setFunnelId(e.target.value)}
            />
            <Button onClick={testUpdate} disabled={loading || !funnelId}>
              Testar Update
            </Button>
            <Button onClick={testDelete} disabled={loading || !funnelId} variant="destructive">
              Testar Delete
            </Button>
          </div>

          <div style={{ backgroundColor: '#FAF9F7' }}>
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
            {results.length === 0 && (
              <div style={{ color: '#8B7355' }}>
                Nenhum teste executado ainda. Clique nos botões acima para começar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
