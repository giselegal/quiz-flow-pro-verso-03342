/**
 * 🧪 EDITOR VALIDATION PAGE - Página de Teste de Validação
 * 
 * Página dedicada para executar testes de validação do editor
 * e verificar se o sistema está funcionando corretamente.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Eye,
  Play,
  Download
} from 'lucide-react';
import EditorValidationTest from '@/tests/EditorValidationTest';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
  error?: string;
}

export default function EditorValidationPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<'test' | 'results' | 'report'>('test');

  const handleTestComplete = (results: TestResult[]) => {
    setTestResults(results);
    setActiveTab('results');
  };

  const generateReport = () => {
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const failedTests = testResults.filter(r => r.status === 'failed').length;
    const totalTests = testResults.length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: successRate.toFixed(2)
      },
      results: testResults,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    };

    // Download do relatório
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `editor-validation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const passedCount = testResults.filter(r => r.status === 'passed').length;
  const failedCount = testResults.filter(r => r.status === 'failed').length;
  const totalCount = testResults.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TestTube className="w-8 h-8 text-blue-600" />
                Validação do Editor
              </h1>
              <p className="text-gray-600 mt-2">
                Teste completo do sistema de edição após correções do React Error #300
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {totalCount > 0 && (
                <Badge variant={failedCount === 0 ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                  {passedCount}/{totalCount} Aprovados
                </Badge>
              )}
              
              <Button 
                onClick={() => window.location.href = '/editor/quiz-estilo'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ir para Editor
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Executar Testes
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Relatório
            </TabsTrigger>
          </TabsList>

          {/* Tab: Executar Testes */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Executar Testes de Validação
                </CardTitle>
                <CardDescription>
                  Execute uma bateria completa de testes para verificar se o sistema está funcionando corretamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditorValidationTest 
                  onComplete={handleTestComplete}
                  autoRun={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Resultados */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Resultados dos Testes
                </CardTitle>
                <CardDescription>
                  Visualize os resultados detalhados dos testes executados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Nenhum teste executado ainda.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Vá para a aba "Executar Testes" para começar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{passedCount}</div>
                        <div className="text-sm text-green-600">Aprovados</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                        <div className="text-sm text-red-600">Falharam</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                        <div className="text-sm text-blue-600">Total</div>
                      </div>
                    </div>

                    {/* Lista de resultados */}
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {result.status === 'passed' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : result.status === 'failed' ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-gray-600">{result.message}</div>
                              {result.duration && (
                                <div className="text-xs text-gray-500">
                                  {result.duration.toFixed(2)}ms
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                            {result.status === 'passed' ? 'Aprovado' : 'Falhou'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Relatório */}
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Relatório de Validação
                </CardTitle>
                <CardDescription>
                  Gere e baixe um relatório completo dos testes executados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Nenhum teste executado ainda.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Execute os testes primeiro para gerar um relatório.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Resumo do Relatório</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Total de Testes:</strong> {totalCount}
                        </div>
                        <div>
                          <strong>Aprovados:</strong> {passedCount}
                        </div>
                        <div>
                          <strong>Falharam:</strong> {failedCount}
                        </div>
                        <div>
                          <strong>Taxa de Sucesso:</strong> {totalCount > 0 ? ((passedCount / totalCount) * 100).toFixed(2) : 0}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={generateReport} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Baixar Relatório JSON
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
