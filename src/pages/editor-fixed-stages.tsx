// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { getStepTemplate, getAllSteps } from '../components/editor-fixed/FixedTemplateService';
import { Block } from '@/types/editor';
import { TemplateProvider } from '../components/editor-fixed/UnifiedTemplateManager';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';

/**
 * PÁGINA DE TESTE - RENDERIZAÇÃO DAS ETAPAS
 *
 * Testa se todas as 21 etapas estão sendo renderizadas corretamente
 * usando o FixedTemplateService
 */

const EditorFixedStages: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar template da etapa atual
  useEffect(() => {
    console.log(`🔄 Carregando etapa ${currentStep}...`);
    setLoading(true);
    setError(null);

    try {
      const stepBlocks = getStepTemplate(currentStep);

      // Converter para formato Block
      const convertedBlocks: Block[] = stepBlocks.map((block, index) => ({
        id: block.id,
        type: block.type as any,
        content: block.content || {},
        properties: block.properties || {},
        order: block.order !== undefined ? block.order : index,
      }));

      setBlocks(convertedBlocks);
      console.log(`✅ Etapa ${currentStep} carregada: ${convertedBlocks.length} blocos`);
    } catch (err) {
      console.error(`❌ Erro ao carregar etapa ${currentStep}:`, err);
      setError(`Erro ao carregar etapa ${currentStep}`);
    } finally {
      setLoading(false);
    }
  }, [currentStep]);

  const allSteps = getAllSteps();

  return (
    <TemplateProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
        {/* Header com navegação */}
        <header
          className="border-b p-4"
          style={{ borderColor: '#E5DDD5', backgroundColor: '#FEFEFE' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold" style={{ color: '#432818' }}>
                Teste de Renderização das Etapas
              </h1>
              <div className="text-sm" style={{ color: '#6B4F43' }}>
                Etapa {currentStep} de 21
              </div>
            </div>

            {/* Navegação rápida */}
            <div className="flex gap-2 flex-wrap">
              {allSteps.slice(0, 10).map(step => (
                <button
                  key={step.stepNumber}
                  onClick={() => setCurrentStep(step.stepNumber)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    currentStep === step.stepNumber
                      ? 'text-white font-medium'
                      : 'border hover:bg-opacity-10'
                  }`}
                  style={{
                    backgroundColor: currentStep === step.stepNumber ? '#B89B7A' : 'transparent',
                    borderColor: '#B89B7A',
                    color: currentStep === step.stepNumber ? 'white' : '#B89B7A',
                  }}
                >
                  {step.stepNumber}
                </button>
              ))}

              <span className="text-gray-400 self-center">...</span>

              {allSteps.slice(-5).map(step => (
                <button
                  key={step.stepNumber}
                  onClick={() => setCurrentStep(step.stepNumber)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    currentStep === step.stepNumber
                      ? 'text-white font-medium'
                      : 'border hover:bg-opacity-10'
                  }`}
                  style={{
                    backgroundColor: currentStep === step.stepNumber ? '#B89B7A' : 'transparent',
                    borderColor: '#B89B7A',
                    color: currentStep === step.stepNumber ? 'white' : '#B89B7A',
                  }}
                >
                  {step.stepNumber}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="max-w-4xl mx-auto p-6">
          {/* Info da etapa atual */}
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{ backgroundColor: '#FEFEFE', borderColor: '#E5DDD5' }}
          >
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#432818' }}>
              {allSteps.find(s => s.stepNumber === currentStep)?.name}
            </h2>
            <p className="text-sm mb-3" style={{ color: '#6B4F43' }}>
              {allSteps.find(s => s.stepNumber === currentStep)?.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <span style={{ color: '#B89B7A' }}>📦 {blocks.length} blocos carregados</span>
              {loading && <span style={{ color: '#6B4F43' }}>🔄 Carregando...</span>}
              {error && <span style={{ color: '#FF6B6B' }}>❌ {error}</span>}
            </div>
          </div>

          {/* Renderização dos blocos */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div
                  className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-4"
                  style={{ borderColor: '#B89B7A', borderTopColor: 'transparent' }}
                />
                <p style={{ color: '#6B4F43' }}>Carregando etapa {currentStep}...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4" style={{ color: '#FF6B6B' }}>
                ❌ {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: '#B89B7A' }}
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => {
                console.log(`🔍 Renderizando bloco: ${block.type} (${block.id})`);

                return (
                  <div
                    key={block.id}
                    className="border rounded-lg overflow-hidden"
                    style={{ borderColor: '#E5DDD5' }}
                  >
                    {/* Header do bloco para debug */}
                    <div
                      className="px-4 py-2 text-xs border-b flex items-center justify-between"
                      style={{
                        backgroundColor: '#FAF9F7',
                        borderColor: '#E5DDD5',
                        color: '#6B4F43',
                      }}
                    >
                      <span>
                        <strong>{index + 1}.</strong> {block.type}
                        <span className="ml-2 opacity-60">({block.id})</span>
                      </span>
                      <span>Order: {block.order}</span>
                    </div>

                    {/* Renderização do bloco */}
                    <div className="p-4" style={{ backgroundColor: '#FEFEFE' }}>
                      <UniversalBlockRenderer
                        block={block}
                        onUpdate={() => {}}
                        onDelete={() => {}}
                        isSelected={false}
                        isPreviewing={true}
                      />
                    </div>
                  </div>
                );
              })}

              {blocks.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ color: '#6B4F43' }}>Nenhum bloco encontrado para esta etapa.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer com navegação */}
        <footer
          className="border-t p-4 mt-12"
          style={{ borderColor: '#E5DDD5', backgroundColor: '#FEFEFE' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep <= 1}
              className="px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
            >
              ← Anterior
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={21}
                value={currentStep}
                onChange={e => setCurrentStep(Number(e.target.value))}
                className="w-16 px-2 py-1 text-center border rounded"
                style={{ borderColor: '#E5DDD5' }}
              />
              <span className="text-sm" style={{ color: '#6B4F43' }}>
                de 21
              </span>
            </div>

            <button
              onClick={() => setCurrentStep(Math.min(21, currentStep + 1))}
              disabled={currentStep >= 21}
              className="px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
            >
              Próxima →
            </button>
          </div>
        </footer>
      </div>
    </TemplateProvider>
  );
};

export default EditorFixedStages;
