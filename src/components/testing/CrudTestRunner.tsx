/**
 * 🧪 CRUD TEST RUNNER - Interface para executar testes
 * 
 * Componente React para executar e visualizar testes CRUD do Supabase
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/services/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: string;
}

export const CrudTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState({ passed: 0, failed: 0, total: 0 });

  const TEST_FUNNEL_ID = `test-funnel-${Date.now()}`;
  const TEST_STEP = 1;
  const testIds: string[] = [];

  const updateTestResult = (name: string, updates: Partial<TestResult>) => {
    setTestResults(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, ...updates } : t);
      }
      return [...prev, { name, status: 'pending', ...updates } as TestResult];
    });
  };

  const runTest = async (
    name: string,
    testFn: () => Promise<void>
  ): Promise<boolean> => {
    updateTestResult(name, { status: 'running' });
    const startTime = Date.now();

    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTestResult(name, { status: 'passed', duration });
      return true;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateTestResult(name, {
        status: 'failed',
        duration,
        error: error.message || String(error)
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    let passed = 0;
    let failed = 0;

    // Test 1: CREATE - Criar componente
    if (await runTest('1. CREATE - Criar componente text-block', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .insert([{
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'text-block',
          instance_key: `text-${Date.now()}`,
          order_index: 0,
          properties: { text: 'Teste' },
          custom_styling: {},
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Nenhum dado retornado');
      testIds.push(data.id);
      updateTestResult('1. CREATE - Criar componente text-block', {
        details: `ID: ${data.id}, Order: ${data.order_index}`
      });
    })) passed++; else failed++;

    // Test 2: CREATE - Múltiplos componentes
    if (await runTest('2. CREATE - Múltiplos componentes', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .insert([
          {
            funnel_id: TEST_FUNNEL_ID,
            step_number: TEST_STEP,
            component_type_key: 'heading',
            instance_key: `heading-${Date.now()}`,
            order_index: 1,
            properties: { text: 'Título' },
            custom_styling: {},
            is_active: true
          },
          {
            funnel_id: TEST_FUNNEL_ID,
            step_number: TEST_STEP,
            component_type_key: 'button',
            instance_key: `button-${Date.now()}`,
            order_index: 2,
            properties: { label: 'Botão' },
            custom_styling: {},
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      if (!data || data.length !== 2) throw new Error('Esperado 2 componentes');
      data.forEach((item: any) => testIds.push(item.id));
      updateTestResult('2. CREATE - Múltiplos componentes', {
        details: `Criados: ${data.length} componentes`
      });
    })) passed++; else failed++;

    // Test 3: READ - Buscar componentes
    if (await runTest('3. READ - Buscar componentes', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', TEST_STEP)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Nenhum componente encontrado');
      
      const orderIndexes = data.map((c: any) => c.order_index as number);
      const isSorted = orderIndexes.every((val: number, i: number, arr: number[]) => !i || (arr[i - 1] ?? 0) <= val);
      if (!isSorted) throw new Error('Componentes não estão ordenados corretamente');
      
      updateTestResult('3. READ - Buscar componentes', {
        details: `Encontrados: ${data.length}, Order: [${orderIndexes.join(', ')}]`
      });
    })) passed++; else failed++;

    // Test 4: UPDATE - Atualizar properties
    if (await runTest('4. UPDATE - Atualizar properties', async () => {
      const testId = testIds[0];
      if (!testId) throw new Error('ID de teste não encontrado');

      const { data, error } = await supabase
        .from('component_instances')
        .update({ properties: { text: 'Atualizado', newField: 'novo' } })
        .eq('id', testId)
        .select()
        .single();

      if (error) throw error;
      if ((data.properties as any)?.text !== 'Atualizado') throw new Error('Properties não atualizado');
      
      updateTestResult('4. UPDATE - Atualizar properties', {
        details: `ID: ${testId}, Text: "${(data.properties as any)?.text}"`
      });
    })) passed++; else failed++;

    // Test 5: UPDATE - Atualizar order_index (FIX CRÍTICO)
    if (await runTest('5. UPDATE - order_index (bug fix)', async () => {
      const testId = testIds[0];
      const newOrder = 99;

      const { data, error } = await supabase
        .from('component_instances')
        .update({ order_index: newOrder })
        .eq('id', testId)
        .select()
        .single();

      if (error) throw error;
      if (data.order_index !== newOrder) throw new Error(`Order esperado: ${newOrder}, recebido: ${data.order_index}`);
      
      updateTestResult('5. UPDATE - order_index (bug fix)', {
        details: `✅ Bug fix validado! Order: ${data.order_index}`
      });
    })) passed++; else failed++;

    // Test 6: RPC - batch_sync_components_for_step
    if (await runTest('6. RPC - batch_sync_components_for_step', async () => {
      const { data, error } = await supabase.rpc('batch_sync_components_for_step', {
        p_funnel_id: TEST_FUNNEL_ID,
        p_step_number: 3,
        items: [
          {
            component_type_key: 'text-block',
            instance_key: `batch-text-${Date.now()}`,
            order_index: 0,
            properties: { text: 'Batch test' },
            custom_styling: {}
          }
        ]
      });

      if (error) throw error;
      if ((data as any)?.inserted_count !== 1) throw new Error('Batch sync falhou');

      const { data: inserted } = await supabase
        .from('component_instances')
        .select('id')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', 3);
      
      inserted?.forEach((item: any) => testIds.push(item.id));
      
      updateTestResult('6. RPC - batch_sync_components_for_step', {
        details: `Inseridos: ${(data as any)?.inserted_count}, Erros: ${(data as any)?.errors?.length || 0}`
      });
    })) passed++; else failed++;

    // Test 7: RPC - batch_update_components
    if (await runTest('7. RPC - batch_update_components', async () => {
      const updates = testIds.slice(0, 2).map(id => ({
        id,
        is_locked: true,
        order_index: 200
      }));

      const { data, error } = await supabase.rpc('batch_update_components', {
        updates
      });

      if (error) throw error;
      if ((data as any)?.updated_count !== 2) throw new Error('Batch update falhou');
      
      updateTestResult('7. RPC - batch_update_components', {
        details: `Atualizados: ${(data as any)?.updated_count}, Erros: ${(data as any)?.errors?.length || 0}`
      });
    })) passed++; else failed++;

    // Test 8: DELETE - Remover componente
    if (await runTest('8. DELETE - Remover componente', async () => {
      const testId = testIds[testIds.length - 1];

      const { error } = await supabase
        .from('component_instances')
        .delete()
        .eq('id', testId);

      if (error) throw error;

      const { data: deleted } = await supabase
        .from('component_instances')
        .select('id')
        .eq('id', testId);

      if (deleted && deleted.length > 0) throw new Error('Componente não foi deletado');
      
      updateTestResult('8. DELETE - Remover componente', {
        details: `ID deletado: ${testId}`
      });
    })) passed++; else failed++;

    // Cleanup: remover todos os componentes de teste
    if (testIds.length > 0) {
      await supabase
        .from('component_instances')
        .delete()
        .in('id', testIds);
    }

    setSummary({ passed, failed, total: passed + failed });
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧪 CRUD Test Runner - Supabase Integration</span>
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Executar Testes
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Valida correções: bug fix position → order_index, RPC functions, integração completa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.total > 0 && (
          <div className="flex gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{summary.total}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Aprovados</div>
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Falharam</div>
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Taxa</div>
              <div className="text-2xl font-bold">
                {((summary.passed / summary.total) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {testResults.map((test, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">{getStatusIcon(test.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{test.name}</span>
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
                {test.details && (
                  <p className="text-xs text-muted-foreground">{test.details}</p>
                )}
                {test.error && (
                  <p className="text-xs text-red-600 mt-1">{test.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {testResults.length === 0 && !isRunning && (
          <div className="text-center py-12 text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Clique em "Executar Testes" para iniciar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
