/**
 * 🧪 TESTE PRÁTICO - Fluxo das 21 Etapas
 *
 * Testa o fluxo completo desde o carregamento até a renderização
 */

import { Block } from '@/types/editor';
import { templateService } from '@/services/templateService';
import React, { useState } from 'react';

interface TestResult {
  step: number;
  loaded: boolean;
  blocksCount: number;
  error?: string;
}

const StepsFlowTest: React.FC = () => {
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Funcionalidade simplificada usando templateService correto
  const jsonFeatures = {
    exportToJson: () => JSON.stringify(currentBlocks),
    importFromJson: (json: string) => {
      try {
        const blocks = JSON.parse(json);
        setCurrentBlocks(blocks);
      } catch (error) {
        console.error('Erro ao importar JSON:', error);
      }
    },
    loadStepTemplate: async (step: number) => {
      setIsLoadingTemplate(true);
      setTemplateError(null);
      try {
        const template = await templateService.getTemplateByStep(step);
        if (template) {
          const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks || []);
          setCurrentBlocks(blocks);
          setCurrentTemplate(template);
          setIsLoadingTemplate(false);
          return true;
        }
        setTemplateError(`Template não encontrado para step ${step}`);
        setIsLoadingTemplate(false);
        return false;
      } catch (error) {
        setTemplateError(error instanceof Error ? error.message : 'Erro desconhecido');
        setIsLoadingTemplate(false);
        return false;
      }
    },
    currentTemplate,
    templateError,
    isLoadingTemplate
  };

  const runFullTest = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    console.log('🚀 Iniciando teste completo das 21 etapas...');

    for (let step = 1; step <= 21; step++) {
      try {
        console.log(`Testing step ${step}...`);

        const success = await jsonFeatures.loadStepTemplate(step);

        const result: TestResult = {
          step,
          loaded: success,
          blocksCount: success ? currentBlocks.length : 0,
        };

        if (!success) {
          result.error = jsonFeatures.templateError || 'Erro desconhecido';
        }

        results.push(result);
        console.log(`Step ${step}: ${success ? '✅' : '❌'}`);

        // Pequena pausa entre testes
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          step,
          loaded: false,
          blocksCount: 0,
          error: String(error),
        });
        console.error(`❌ Erro na etapa ${step}:`, error);
      }
    }

    setTestResults(results);
    setIsRunning(false);

    // Relatório final
    const successCount = results.filter(r => r.loaded).length;
    const totalBlocks = results.reduce((sum, r) => sum + r.blocksCount, 0);

    console.log('📊 RELATÓRIO FINAL:');
    console.log(`✅ Etapas carregadas: ${successCount}/21`);
    console.log(`📦 Total de blocos: ${totalBlocks}`);
    console.log(`🎯 Taxa de sucesso: ${((successCount / 21) * 100).toFixed(1)}%`);

    return {
      successRate: successCount / 21,
      totalBlocks,
      results,
    };
  };

  const testSingleStep = async (stepNumber: number) => {
    try {
      const success = await jsonFeatures.loadStepTemplate(stepNumber);
      console.log(`Etapa ${stepNumber}: ${success ? '✅' : '❌'} (${currentBlocks.length} blocos)`);
      return success;
    } catch (error) {
      console.error(`❌ Erro na etapa ${stepNumber}:`, error);
      return false;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Teste do Fluxo das 21 Etapas</h1>

      {/* Controles */}
      <div className="mb-6 space-x-4">
        <button
          onClick={runFullTest}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isRunning ? '🔄 Testando...' : '🚀 Testar Todas as Etapas'}
        </button>

        <button
          onClick={() => testSingleStep(1)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🎯 Testar Etapa 1
        </button>
      </div>

      {/* Status atual */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Status Atual:</h3>
        <p>📄 Template: {jsonFeatures.currentTemplate?.name || 'Nenhum'}</p>
        <p>📦 Blocos: {currentBlocks.length}</p>
        <p>⚠️ Erro: {jsonFeatures.templateError || 'Nenhum'}</p>
        <p>🔄 Carregando: {jsonFeatures.isLoadingTemplate ? 'Sim' : 'Não'}</p>
      </div>

      {/* Resultados dos testes */}
      {testResults.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-4">📊 Resultados dos Testes:</h3>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {testResults.map(result => (
              <div
                key={result.step}
                className={`p-2 text-center text-xs rounded ${
                  result.loaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-medium">#{result.step}</div>
                <div>{result.loaded ? '✅' : '❌'}</div>
                <div>{result.blocksCount} blocos</div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            ✅ Sucessos: {testResults.filter(r => r.loaded).length}/21 • 📦 Total de blocos:{' '}
            {testResults.reduce((sum, r) => sum + r.blocksCount, 0)} • 🎯 Taxa:{' '}
            {((testResults.filter(r => r.loaded).length / 21) * 100).toFixed(1)}%
          </div>
        </div>
      )}

      {/* Blocos atuais */}
      {currentBlocks.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">📦 Blocos Carregados:</h3>
          <div className="space-y-2">
            {currentBlocks.map((block, index) => (
              <div key={block.id} className="p-3 border rounded bg-white">
                <div className="font-mono text-sm text-blue-600">
                  #{index + 1} {block.id}
                </div>
                <div className="font-medium">{block.type}</div>
                <div className="text-sm text-gray-600">
                  {block.content?.text || block.properties?.text || 'Sem texto'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsFlowTest;
