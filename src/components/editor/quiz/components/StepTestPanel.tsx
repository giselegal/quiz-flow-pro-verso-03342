/**
 * 🧪 PAINEL DE TESTES DE STEP - Debug UI
 * 
 * Componente de debug para testar steps no editor.
 * Mostra resultados de validação em tempo real.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { testAllSteps, generateTestReport, quickTest } from '@/utils/stepIntegrationTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, Play } from 'lucide-react';

export const StepTestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simular async

    const results = testAllSteps();
    setTestResults(results);

    const report = generateTestReport(results);
    console.log(report);

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run ao montar
    runTests();
  }, []);

  if (!testResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Testes de Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? 'Executando...' : 'Executar Testes'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const results = Object.values(testResults);
  const passed = results.filter((r: any) => r.passed).length;
  const failed = results.filter((r: any) => !r.passed).length;
  const totalWarnings = results.reduce((acc: number, r: any) => acc + r.warnings.length, 0);

  const getStatusIcon = (result: any) => {
    if (result.passed && result.warnings.length === 0) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (result.passed && result.warnings.length > 0) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🧪 Testes de Step
          </span>
          <Button onClick={runTests} disabled={isRunning} size="sm">
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Executando...' : 'Re-executar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sumário */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{passed}</div>
            <div className="text-sm text-muted-foreground">Passou</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{failed}</div>
            <div className="text-sm text-muted-foreground">Falhou</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{totalWarnings}</div>
            <div className="text-sm text-muted-foreground">Avisos</div>
          </div>
        </div>

        {/* Lista de Steps */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {Object.entries(testResults).map(([stepId, result]: [string, any]) => (
              <div
                key={stepId}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedStep === stepId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => setSelectedStep(stepId === selectedStep ? '' : stepId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result)}
                    <span className="font-medium">{stepId}</span>
                    <Badge variant="outline">{result.stepType}</Badge>
                  </div>
                  {result.warnings.length > 0 && (
                    <Badge variant="secondary">{result.warnings.length} avisos</Badge>
                  )}
                </div>

                {/* Detalhes expandidos */}
                {selectedStep === stepId && (
                  <div className="mt-3 space-y-2 text-sm">
                    {result.errors.length > 0 && (
                      <div className="space-y-1">
                        <div className="font-semibold text-red-500">Erros:</div>
                        {result.errors.map((err: string, i: number) => (
                          <div key={i} className="ml-4 text-red-400">
                            • {err}
                          </div>
                        ))}
                      </div>
                    )}

                    {result.warnings.length > 0 && (
                      <div className="space-y-1">
                        <div className="font-semibold text-yellow-500">Avisos:</div>
                        {result.warnings.map((warn: string, i: number) => (
                          <div key={i} className="ml-4 text-yellow-400">
                            • {warn}
                          </div>
                        ))}
                      </div>
                    )}

                    {result.passed && result.errors.length === 0 && result.warnings.length === 0 && (
                      <div className="text-green-500">✅ Todos os dados estão corretos</div>
                    )}

                    {/* Botão para testar individualmente */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        quickTest(stepId);
                      }}
                    >
                      Ver Dados no Console
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Status final */}
        <div className="mt-6 p-4 rounded-lg bg-accent text-center">
          {failed === 0 ? (
            <div className="text-green-500 font-semibold">
              ✅ TODOS OS TESTES PASSARAM
            </div>
          ) : (
            <div className="text-red-500 font-semibold">
              ❌ {failed} TESTE{failed > 1 ? 'S' : ''} FALHARAM
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepTestPanel;
