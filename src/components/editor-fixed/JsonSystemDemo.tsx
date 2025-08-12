/**
 * 🎉 DEMONSTRAÇÃO FINAL - Sistema JSON Integrado ao /editor-fixed
 *
 * Arquivo demonstra o sistema completo funcionando
 * 100% compatível com infraestrutura existente
 */

import { Block } from '@/types/editor';
import React, { useState } from 'react';
import JsonIntegrationTest from './JsonIntegrationTest';
import { TemplateAdapter } from './TemplateAdapter';
import { useEditorWithJson } from './useEditorWithJson';

// =============================================
// 🚀 DEMO PRINCIPAL - QUICK START
// =============================================

export const JsonSystemDemo: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [demoStep, setDemoStep] = useState<'intro' | 'loading' | 'loaded' | 'export'>('intro');
  const [demoLog, setDemoLog] = useState<string[]>([]);

  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDemoLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runDemo = async () => {
    log('🚀 Iniciando demonstração do sistema JSON...');
    setDemoStep('loading');

    try {
      // 1. Descobrir templates disponíveis
      log('🔍 Descobrindo templates disponíveis...');
      const available = await TemplateAdapter.discoverAvailableTemplates();
      const existingTemplates = available.filter(t => t.exists);
      log(`✅ Encontrados ${existingTemplates.length} templates disponíveis`);

      // 2. Carregar primeiro template
      log('📄 Carregando template da etapa 1 (Introdução)...');
      const success = await jsonFeatures.loadStepTemplate(1);

      if (success) {
        log('✅ Template carregado com sucesso!');
        log(`📊 Nome: ${jsonFeatures.currentTemplate?.name}`);
        log(`🧩 Blocos convertidos: ${blocks.length}`);

        // 3. Mostrar detalhes dos blocos
        blocks.forEach((block, index) => {
          log(
            `  └─ Bloco ${index + 1}: ${block.type} (${block.content?.content?.toString().slice(0, 30) || 'sem conteúdo'}...)`
          );
        });

        setDemoStep('loaded');

        // 4. Testar validação
        log('🔍 Executando validação...');
        const validation = jsonFeatures.validateCurrentTemplate();
        log(`✅ Template válido: ${validation.isValid ? 'SIM' : 'NÃO'}`);

        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => log(`⚠️ ${warning}`));
        }

        // 5. Mostrar componentes disponíveis
        log('🧩 Verificando componentes disponíveis...');
        const components = jsonFeatures.getAvailableComponents();
        log(`📊 Total de componentes no registry: ${components.length}`);

        // Mostrar categorias
        const categories = components.reduce(
          (acc, comp) => {
            acc[comp.category] = (acc[comp.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        Object.entries(categories).forEach(([category, count]) => {
          log(`  └─ ${category}: ${count} componentes`);
        });

        log('🎉 Demonstração concluída com sucesso!');
      } else {
        log('❌ Falha ao carregar template');
      }
    } catch (error) {
      log(`❌ Erro durante demonstração: ${error}`);
    }
  };

  const exportDemo = () => {
    if (blocks.length === 0) {
      log('⚠️ Nenhum bloco para exportar');
      return;
    }

    setDemoStep('export');
    log('💾 Exportando configuração atual como template...');

    const template = jsonFeatures.exportCurrentAsTemplate({
      name: 'Template Demo - Personalizado',
      description: 'Template criado durante demonstração',
      category: 'custom',
    });

    jsonFeatures.saveTemplateToFile(template, 'demo-template.json');
    log('✅ Template exportado e download iniciado!');
    log(`📊 Tamanho do arquivo: ${JSON.stringify(template).length} caracteres`);
  };

  const resetDemo = () => {
    setBlocks([]);
    setDemoStep('intro');
    setDemoLog([]);
    jsonFeatures.clearTemplate();
    log('🧹 Demo resetada');
  };

  return (
    <div className="json-system-demo max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎯 Sistema JSON para /editor-fixed
        </h1>
        <p className="text-xl text-gray-600">
          Integração completa com seus 290+ componentes e 92 templates existentes
        </p>
      </div>

      {/* Controles principais */}
      <div className="demo-controls mb-8 flex justify-center space-x-4">
        <button
          onClick={runDemo}
          disabled={jsonFeatures.isLoadingTemplate || demoStep === 'loading'}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {demoStep === 'loading' ? '⏳ Executando...' : '🚀 Iniciar Demonstração'}
        </button>

        <button
          onClick={exportDemo}
          disabled={blocks.length === 0}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
        >
          💾 Exportar Template
        </button>

        <button
          onClick={resetDemo}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700"
        >
          🧹 Reset
        </button>
      </div>

      {/* Status atual */}
      <div className="status-panel mb-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Status Atual</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-semibold">Template Carregado</div>
            <div className="text-2xl font-bold text-blue-800">
              {jsonFeatures.currentTemplate?.name || 'Nenhum'}
            </div>
          </div>

          <div className="stat-card bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-semibold">Blocos Convertidos</div>
            <div className="text-2xl font-bold text-green-800">{blocks.length}</div>
          </div>

          <div className="stat-card bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-semibold">Status</div>
            <div className="text-2xl font-bold text-purple-800">
              {demoStep === 'intro'
                ? '🏁 Pronto'
                : demoStep === 'loading'
                  ? '⏳ Carregando'
                  : demoStep === 'loaded'
                    ? '✅ Carregado'
                    : '💾 Exportado'}
            </div>
          </div>
        </div>

        {/* Erro */}
        {jsonFeatures.templateError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-semibold">❌ Erro</div>
            <div className="text-red-600">{jsonFeatures.templateError}</div>
          </div>
        )}
      </div>

      {/* Blocos carregados */}
      {blocks.length > 0 && (
        <div className="blocks-display mb-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🧩 Blocos do Editor ({blocks.length})</h2>

          <div className="blocks-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="block-card bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="block-number bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    #{index + 1}
                  </span>
                  <span className="block-type text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                    {block.type}
                  </span>
                </div>

                <div className="block-id text-xs text-gray-600 mb-2">ID: {block.id}</div>

                {block.content?.content && (
                  <div className="block-content text-sm text-gray-800 bg-white p-2 rounded border">
                    {String(block.content.content).slice(0, 80)}
                    {String(block.content.content).length > 80 && '...'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log da demonstração */}
      <div className="demo-log bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📋 Log da Demonstração</h2>

        <div className="log-container bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {demoLog.length === 0 ? (
            <div className="text-gray-500">Clique em "Iniciar Demonstração" para começar...</div>
          ) : (
            demoLog.map((entry, index) => (
              <div key={index} className="log-entry mb-1">
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Componente de teste avançado */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">🧪 Teste Avançado do Sistema</h2>
        <JsonIntegrationTest />
      </div>
    </div>
  );
};

// =============================================
// 🎯 EXEMPLO MÍNIMO PARA INTEGRAÇÃO
// =============================================

export const MinimalExample: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  return (
    <div className="minimal-example p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">⚡ Exemplo Mínimo</h3>

      {/* Carregar templates das etapas */}
      <div className="mb-4 space-x-2">
        <button onClick={() => jsonFeatures.loadStepTemplate(1)} className="btn">
          🚀 Introdução
        </button>
        <button onClick={() => jsonFeatures.loadStepTemplate(2)} className="btn">
          ❓ Pergunta
        </button>
        <button onClick={() => jsonFeatures.loadStepTemplate(3)} className="btn">
          📊 Resultado
        </button>
      </div>

      {/* Status */}
      <div className="mb-4 text-sm text-gray-600">
        Template: {jsonFeatures.currentTemplate?.name || 'Nenhum'} | Blocos: {blocks.length}
      </div>

      {/* Preview dos blocos */}
      <div className="blocks-preview space-y-2">
        {blocks.map(block => (
          <div key={block.id} className="p-2 bg-gray-100 rounded text-sm">
            <strong>{block.type}:</strong> {block.content?.content || 'Sem conteúdo'}
          </div>
        ))}
      </div>

      {/* Estilos inline */}
      <div style={{ display: 'none' }}>
        {/* CSS será aplicado via className normalmente no seu projeto */}
      </div>
    </div>
  );
};

export default JsonSystemDemo;
