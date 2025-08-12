/**
 * 🧪 TESTE PRÁTICO: Integração JSON com /editor-fixed
 *
 * Demonstração real de como o sistema funciona com templates existentes
 */

import { Block } from '@/types/editor';
import React, { useState } from 'react';
import { useEditorWithJson } from './useEditorWithJson';

// =============================================
// 🎯 TESTE REAL COM TEMPLATE STEP-01
// =============================================

export const JsonIntegrationTest: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLoadStepTemplate = async () => {
    addTestResult('🧪 Iniciando teste de carregamento...');

    try {
      const success = await jsonFeatures.loadStepTemplate(1);

      if (success) {
        addTestResult('✅ Template da etapa 1 carregado com sucesso!');
        addTestResult(`📊 Blocos carregados: ${blocks.length}`);
        addTestResult(`📄 Template: ${jsonFeatures.currentTemplate?.name}`);

        // Listar tipos dos blocos carregados
        const blockTypes = blocks.map(b => b.type);
        addTestResult(`🧩 Tipos: ${blockTypes.join(', ')}`);

        // Verificar se componentes existem no registry
        const { getAvailableComponents } = jsonFeatures;
        const availableTypes = getAvailableComponents().map(c => c.type);

        blockTypes.forEach(type => {
          const exists = availableTypes.includes(type);
          addTestResult(
            `${exists ? '✅' : '⚠️'} Componente "${type}": ${exists ? 'OK' : 'NÃO ENCONTRADO'}`
          );
        });
      } else {
        addTestResult('❌ Falha ao carregar template');
      }
    } catch (error) {
      addTestResult(`❌ Erro: ${error}`);
    }
  };

  const testValidation = () => {
    addTestResult('🧪 Testando validação...');

    if (jsonFeatures.currentTemplate) {
      const validation = jsonFeatures.validateCurrentTemplate();

      addTestResult(`✅ Template válido: ${validation.isValid ? 'SIM' : 'NÃO'}`);

      if (validation.errors.length > 0) {
        validation.errors.forEach(error => {
          addTestResult(`❌ Erro: ${error}`);
        });
      }

      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          addTestResult(`⚠️ Aviso: ${warning}`);
        });
      }

      if (validation.isValid) {
        addTestResult('🎉 Validação passou sem problemas!');
      }
    } else {
      addTestResult('⚠️ Nenhum template carregado para validar');
    }
  };

  const testExport = () => {
    addTestResult('🧪 Testando export...');

    if (blocks.length === 0) {
      addTestResult('⚠️ Nenhum bloco para exportar');
      return;
    }

    try {
      const template = jsonFeatures.exportCurrentAsTemplate({
        name: 'Template de Teste',
        description: 'Template criado durante teste de integração',
        category: 'custom',
      });

      addTestResult('✅ Template exportado com sucesso!');
      addTestResult(`📄 Nome: ${template.name}`);
      addTestResult(`🧩 Blocos exportados: ${template.blocks.length}`);
      addTestResult(`📊 Tamanho JSON: ${JSON.stringify(template).length} chars`);

      // Log do JSON para debug (primeiros 200 chars)
      const jsonPreview = JSON.stringify(template, null, 2).slice(0, 200) + '...';
      addTestResult(`🔍 Preview JSON: ${jsonPreview}`);
    } catch (error) {
      addTestResult(`❌ Erro no export: ${error}`);
    }
  };

  const testComponentRegistry = () => {
    addTestResult('🧪 Testando registry de componentes...');

    const components = jsonFeatures.getAvailableComponents();
    addTestResult(`📊 Total de componentes: ${components.length}`);

    // Categorizar componentes
    const categories = components.reduce(
      (acc, comp) => {
        acc[comp.category] = (acc[comp.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(categories).forEach(([category, count]) => {
      addTestResult(`📁 ${category}: ${count} componentes`);
    });

    // Mostrar alguns componentes de exemplo
    const sampleComponents = components.slice(0, 5);
    sampleComponents.forEach(comp => {
      addTestResult(`🧩 ${comp.type} (${comp.category})`);
    });

    if (components.length > 5) {
      addTestResult(`... e mais ${components.length - 5} componentes`);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult('🚀 Iniciando bateria de testes completa...');

    // Teste 1: Registry
    testComponentRegistry();

    // Teste 2: Carregamento
    await testLoadStepTemplate();

    // Aguardar um pouco para estados atualizarem
    setTimeout(() => {
      // Teste 3: Validação
      testValidation();

      // Teste 4: Export
      testExport();

      addTestResult('🏁 Todos os testes concluídos!');
    }, 1000);
  };

  const clearAll = () => {
    setBlocks([]);
    setTestResults([]);
    jsonFeatures.clearTemplate();
    addTestResult('🧹 Limpeza realizada');
  };

  return (
    <div className="json-integration-test p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Teste de Integração JSON</h2>

      {/* Controles de Teste */}
      <div className="test-controls mb-6 space-x-4">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={jsonFeatures.isLoadingTemplate}
        >
          {jsonFeatures.isLoadingTemplate ? '⏳ Testando...' : '🚀 Executar Todos os Testes'}
        </button>

        <button
          onClick={testLoadStepTemplate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={jsonFeatures.isLoadingTemplate}
        >
          📄 Testar Carregamento
        </button>

        <button
          onClick={testValidation}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          ✅ Testar Validação
        </button>

        <button
          onClick={testExport}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          💾 Testar Export
        </button>

        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🧹 Limpar
        </button>
      </div>

      {/* Status Atual */}
      <div className="current-status mb-6 p-4 bg-white rounded border">
        <h3 className="font-bold mb-2">📊 Status Atual</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Template Carregado:</strong> {jsonFeatures.currentTemplate?.name || 'Nenhum'}
          </div>
          <div>
            <strong>Blocos:</strong> {blocks.length}
          </div>
          <div>
            <strong>Carregando:</strong> {jsonFeatures.isLoadingTemplate ? '⏳ Sim' : '✅ Não'}
          </div>
          <div>
            <strong>Erro:</strong> {jsonFeatures.templateError || 'Nenhum'}
          </div>
        </div>

        {jsonFeatures.currentTemplate && (
          <div className="mt-4 p-2 bg-blue-50 rounded">
            <strong>Template Detalhes:</strong>
            <ul className="text-xs mt-1">
              <li>ID: {jsonFeatures.currentTemplate.id}</li>
              <li>Categoria: {jsonFeatures.currentTemplate.category}</li>
              <li>Blocos: {jsonFeatures.currentTemplate.blocks.length}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Blocos Carregados */}
      {blocks.length > 0 && (
        <div className="blocks-display mb-6 p-4 bg-white rounded border">
          <h3 className="font-bold mb-2">🧩 Blocos Carregados ({blocks.length})</h3>
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div key={block.id} className="p-2 bg-gray-100 rounded text-sm">
                <div className="font-mono">
                  <strong>
                    #{index + 1} {block.type}
                  </strong>
                </div>
                <div className="text-xs text-gray-600">
                  ID: {block.id} | Order: {block.order}
                </div>
                {block.content?.content && (
                  <div className="text-xs mt-1 text-blue-600">
                    Conteúdo: {String(block.content.content).slice(0, 50)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados dos Testes */}
      <div className="test-results bg-white rounded border p-4">
        <h3 className="font-bold mb-2">📋 Log de Testes</h3>
        <div className="test-log bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-gray-500">Nenhum teste executado ainda...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonIntegrationTest;
