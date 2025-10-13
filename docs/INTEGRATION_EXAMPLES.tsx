/**
 * 🎯 EXEMPLO PRÁTICO - Componente usando sistema unificado
 * 
 * Este exemplo mostra como usar UnifiedQuizBridge e adapters
 * em componentes reais do quiz
 */

import { useState, useEffect } from 'react';
import { useUnifiedQuiz } from '@/hooks/useUnifiedQuiz';
import { UnifiedQuizStepAdapter } from '@/adapters/UnifiedQuizStepAdapter';
import { unifiedQuizBridge } from '@/services/UnifiedQuizBridge';

/**
 * EXEMPLO 1: Componente de Preview de Step
 * Mostra como carregar e exibir um step individual
 */
export function StepPreview({ stepId }: { stepId: string }) {
  const { step, isLoading, error } = useUnifiedQuiz(stepId);

  if (isLoading) {
    return <div className="animate-pulse">Carregando...</div>;
  }

  if (error || !step) {
    return <div className="text-red-500">Erro ao carregar step</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Step {step.stepNumber}: {step.id}
      </h2>
      
      <div className="text-sm text-muted-foreground">
        Tipo: {step.type} | Fonte: {step.metadata.source}
      </div>

      <div className="space-y-2">
        {step.sections.map((section, index) => (
          <div key={index} className="border p-4 rounded">
            <div className="font-semibold">{section.type}</div>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(section.content, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * EXEMPLO 2: Lista de Steps do Funil
 * Mostra como carregar e exibir funil completo
 */
export function FunnelStepsList() {
  const { funnel, isLoading } = useUnifiedQuiz();

  if (isLoading || !funnel) {
    return <div>Carregando funil...</div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">{funnel.name}</h2>
      <p className="text-sm text-muted-foreground">
        {Object.keys(funnel.steps).length} steps | v{funnel.version}
      </p>

      <div className="grid gap-2">
        {Object.entries(funnel.steps).map(([stepId, step]) => (
          <div key={stepId} className="border p-3 rounded hover:bg-accent">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{step.stepNumber}.</span> {step.id}
              </div>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                {step.type}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {step.sections.length} sections
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * EXEMPLO 3: Editor de Step Simplificado
 * Mostra como editar e salvar usando adapters
 */
export function SimpleStepEditor({ stepId }: { stepId: string }) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar
  useEffect(() => {
    async function load() {
      const unified = await unifiedQuizBridge.loadStep(stepId);
      if (unified) {
        const editorBlocks = UnifiedQuizStepAdapter.toBlocks(unified);
        setBlocks(editorBlocks);
      }
    }
    load();
  }, [stepId]);

  // Salvar
  async function handleSave() {
    setIsSaving(true);
    try {
      const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, stepId);
      await unifiedQuizBridge.saveStep(stepId, unified);
      alert('Step salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar step');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Editar: {stepId}</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div key={block.id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{block.type}</span>
              <button
                onClick={() => {
                  const newBlocks = blocks.filter((_, i) => i !== index);
                  setBlocks(newBlocks);
                }}
                className="text-red-500 text-sm"
              >
                Remover
              </button>
            </div>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(block.content, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setBlocks([
            ...blocks,
            {
              id: `block-${Date.now()}`,
              type: 'text-inline',
              order: blocks.length,
              content: { text: 'Novo bloco' },
              properties: {}
            }
          ]);
        }}
        className="w-full border-2 border-dashed p-3 rounded hover:bg-accent"
      >
        + Adicionar Bloco
      </button>
    </div>
  );
}

/**
 * EXEMPLO 4: Export/Import JSON v3.0
 * Mostra como exportar e importar templates
 */
export function TemplateExportImport() {
  const [exportedData, setExportedData] = useState<string>('');

  async function handleExport() {
    const templates = await unifiedQuizBridge.exportToJSONv3('production');
    const json = JSON.stringify(templates, null, 2);
    setExportedData(json);
  }

  async function handleImport() {
    try {
      const templates = JSON.parse(exportedData);
      const funnel = await unifiedQuizBridge.importFromJSONv3(templates);
      alert(`Importado: ${Object.keys(funnel.steps).length} steps`);
    } catch (error) {
      alert('Erro ao importar: JSON inválido');
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Export/Import Templates</h2>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Exportar Funil
        </button>
        <button
          onClick={handleImport}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={!exportedData}
        >
          Importar Templates
        </button>
      </div>

      <textarea
        value={exportedData}
        onChange={(e) => setExportedData(e.target.value)}
        placeholder="JSON dos templates aparecerá aqui..."
        className="w-full h-64 p-3 border rounded font-mono text-xs"
      />
    </div>
  );
}

/**
 * EXEMPLO 5: Validação de Funil
 * Mostra como validar integridade do funil
 */
export function FunnelValidator() {
  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: string[];
  } | null>(null);

  async function handleValidate() {
    const result = await unifiedQuizBridge.validateFunnel('production');
    setValidation(result);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Validar Funil</h2>

      <button
        onClick={handleValidate}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        Validar Integridade
      </button>

      {validation && (
        <div
          className={`border p-4 rounded ${
            validation.valid ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="font-semibold mb-2">
            {validation.valid ? '✅ Funil Válido' : '❌ Problemas Detectados'}
          </div>

          {validation.errors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
