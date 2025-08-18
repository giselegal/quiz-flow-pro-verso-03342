/**
 * 📋 EDITOR URL EXAMPLES COMPONENT
 * Demonstra diferentes maneiras de usar o editor-fixed
 */

import { buildEditorUrl, editorNavigation } from '@/utils/editorUrlHelpers';
import React from 'react';

const EditorUrlExamples: React.FC = () => {
  const baseUrl = window.location.origin;

  const examples = [
    {
      title: '🎯 Básico',
      url: `${baseUrl}/editor-fixed`,
      description: 'Editor padrão com funil de 21 etapas',
    },
    {
      title: '🎨 Quiz de Estilo',
      url: buildEditorUrl(baseUrl, {
        funnelId: 'quiz-estilo-2024',
        template: 'quiz-estilo',
      }),
      description: 'Funil específico para quiz de estilo',
    },
    {
      title: '🧠 Quiz de Personalidade',
      url: buildEditorUrl(baseUrl, {
        funnelId: 'personalidade-test',
        template: 'quiz-personalidade',
        stage: 'step-3',
      }),
      description: 'Quiz de personalidade começando na etapa 3',
    },
    {
      title: '📱 Preview Mobile',
      url: buildEditorUrl(baseUrl, {
        funnelId: 'mobile-test',
        preview: true,
        viewport: 'sm',
      }),
      description: 'Visualização em modo preview mobile',
    },
    {
      title: '🚀 Configuração Completa',
      url: buildEditorUrl(baseUrl, {
        funnelId: 'advanced-funnel-123',
        template: 'funil-21-etapas',
        stage: 'step-10',
        preview: false,
        viewport: 'lg',
      }),
      description: 'Todas as opções configuradas',
    },
  ];

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada para a área de transferência!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🌐 Editor-Fixed - Exemplos de URL</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📋 Exemplos Práticos</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-lg">{example.title}</h3>
                <button
                  onClick={() => copyToClipboard(example.url)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copiar URL
                </button>
              </div>
              <p className="text-gray-600 mb-2">{example.description}</p>
              <div className="bg-white border rounded p-2 font-mono text-sm break-all">
                <a
                  href={example.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {example.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🎮 Navegação Programática</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => editorNavigation.goToFunnel('test-funnel-' + Date.now())}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Novo Funil
          </button>
          <button
            onClick={() => editorNavigation.goToStage('step-5')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Ir para Etapa 5
          </button>
          <button
            onClick={() => editorNavigation.togglePreview()}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Toggle Preview
          </button>
          <button
            onClick={() => editorNavigation.setViewport('sm')}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Mobile View
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📖 Parâmetros Suportados</h2>
        <div className="bg-gray-100 rounded p-4">
          <ul className="space-y-2 text-sm">
            <li>
              <strong>?funnelId=xxx</strong> - ID único do funil
            </li>
            <li>
              <strong>?template=xxx</strong> - Template inicial (quiz-estilo, quiz-personalidade,
              funil-21-etapas)
            </li>
            <li>
              <strong>?stage=step-X</strong> - Etapa inicial (step-1 até step-21)
            </li>
            <li>
              <strong>?preview=true</strong> - Inicia em modo preview
            </li>
            <li>
              <strong>?viewport=sm/md/lg/xl</strong> - Tamanho da viewport inicial
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/editor-fixed"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          🚀 Abrir Editor-Fixed
        </a>
      </div>
    </div>
  );
};

export default EditorUrlExamples;
