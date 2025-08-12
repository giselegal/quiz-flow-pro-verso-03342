/**
 * 🚀 EXEMPLO PRÁTICO: Como integrar JSON com o /editor-fixed EXISTENTE
 *
 * Este arquivo demonstra como usar o sistema JSON no seu editor atual
 * SEM QUEBRAR NADA que já existe.
 */

import { Block } from '@/types/editor';
import React, { useState } from 'react';
import { JsonTemplate } from './JsonTemplateEngine';
import { useEditorWithJson } from './useEditorWithJson';

// =============================================
// 1️⃣ EXEMPLO: Hook no Editor Existente
// =============================================

const EditorWithJsonIntegration: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // 🎯 ADICIONA FUNCIONALIDADES JSON AO EDITOR
  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  const handleLoadStep = async (stepNumber: number) => {
    const success = await jsonFeatures.loadStepTemplate(stepNumber);
    if (success) {
      console.log(`✅ Etapa ${stepNumber} carregada com sucesso!`);
      console.log('📊 Template atual:', jsonFeatures.currentTemplate?.name);
      console.log('🧩 Blocos carregados:', blocks.length);
    }
  };

  const handleExportCurrent = () => {
    const template = jsonFeatures.exportCurrentAsTemplate({
      name: 'Meu Template Personalizado',
      description: 'Template criado no editor',
      category: 'custom',
    });

    jsonFeatures.saveTemplateToFile(template);
    console.log('💾 Template exportado!');
  };

  return (
    <div className="editor-with-json">
      <div className="json-controls">
        <h3>🎯 Controles JSON</h3>

        {/* Carregar Templates das 21 Etapas */}
        <div className="step-controls">
          <h4>📋 Etapas do Funil</h4>
          {[1, 2, 3, 4, 5].map(step => (
            <button
              key={step}
              onClick={() => handleLoadStep(step)}
              disabled={jsonFeatures.isLoadingTemplate}
            >
              Carregar Etapa {step}
            </button>
          ))}
        </div>

        {/* Status do Template */}
        {jsonFeatures.currentTemplate && (
          <div className="template-status">
            <h4>📄 Template Atual</h4>
            <p>
              <strong>Nome:</strong> {jsonFeatures.currentTemplate.name}
            </p>
            <p>
              <strong>Blocos:</strong> {jsonFeatures.currentTemplate.blocks.length}
            </p>
            <p>
              <strong>Categoria:</strong> {jsonFeatures.currentTemplate.category}
            </p>
          </div>
        )}

        {/* Erro */}
        {jsonFeatures.templateError && <div className="error">❌ {jsonFeatures.templateError}</div>}

        {/* Exportar */}
        <button onClick={handleExportCurrent} disabled={blocks.length === 0}>
          💾 Exportar como Template
        </button>
      </div>

      {/* SEU EDITOR EXISTENTE AQUI */}
      <div className="existing-editor">
        <h3>🎨 Seu Editor (Sem Modificação)</h3>
        <div className="blocks-display">
          {blocks.map(block => (
            <div key={block.id} className="block-preview">
              <strong>{block.type}</strong>: {JSON.stringify(block.content).slice(0, 50)}...
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================
// 2️⃣ EXEMPLO: Integração Simples com Editor Existente
// =============================================

interface SimpleJsonIntegrationProps {
  existingBlocks: Block[];
  onBlocksUpdate: (blocks: Block[]) => void;
}

const SimpleJsonIntegration: React.FC<SimpleJsonIntegrationProps> = ({
  existingBlocks,
  onBlocksUpdate,
}) => {
  const {
    loadStepTemplate,
    mergeTemplateWithExisting: _mergeTemplateWithExisting,
    isLoadingTemplate,
  } = useEditorWithJson(existingBlocks, onBlocksUpdate);

  return (
    <div className="simple-integration">
      <button onClick={() => loadStepTemplate(1)} disabled={isLoadingTemplate}>
        {isLoadingTemplate ? '⏳ Carregando...' : '🚀 Adicionar Introdução'}
      </button>

      <button onClick={() => loadStepTemplate(2)} disabled={isLoadingTemplate}>
        {isLoadingTemplate ? '⏳ Carregando...' : '❓ Adicionar Pergunta'}
      </button>
    </div>
  );
};

// =============================================
// 3️⃣ EXEMPLO: Sistema de Preview de Templates
// =============================================

const JsonTemplatePreview: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<JsonTemplate | null>(null);
  const { loadCustomTemplate } = useEditorWithJson();

  const previewTemplate = async (stepNumber: number) => {
    const stepId = stepNumber.toString().padStart(2, '0');
    const ok = await loadCustomTemplate(`/templates/step-${stepId}-template.json`);

    if (ok) {
      // Carregamos via hook interno; aqui poderíamos buscar novamente para preview detalhado
      setSelectedTemplate({
        id: `step-${stepId}`,
        name: `Etapa ${stepNumber}`,
        description: 'Template carregado',
        category: 'step',
        blocks: [],
      } as any);
    }
  };

  return (
    <div className="template-preview">
      <div className="template-selector">
        <h3>🔍 Preview de Templates</h3>
        {[1, 2, 3, 4, 5].map(step => (
          <button key={step} onClick={() => previewTemplate(step)}>
            Preview Etapa {step}
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="preview-details">
          <h4>📋 {selectedTemplate.name}</h4>
          <p>
            <strong>Descrição:</strong> {selectedTemplate.description}
          </p>
          <p>
            <strong>Categoria:</strong> {selectedTemplate.category}
          </p>
          <p>
            <strong>Blocos:</strong> {selectedTemplate.blocks.length}
          </p>

          <div className="blocks-list">
            <h5>🧩 Componentes:</h5>
            <ul>
              {selectedTemplate.blocks.map(block => (
                <li key={block.id}>
                  <code>{block.type}</code> -{' '}
                  {block.properties.title || block.properties.text || 'Sem título'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================
// 4️⃣ EXEMPLO: Modo Debug/Desenvolvimento
// =============================================

const JsonDebugPanel: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  const { exportCurrentAsTemplate, validateCurrentTemplate, getAvailableComponents } =
    useEditorWithJson(blocks);

  const debugInfo = {
    blocksCount: blocks.length,
    blockTypes: [...new Set(blocks.map(b => b.type))],
    validation: validateCurrentTemplate(),
    availableComponents: getAvailableComponents(),
  };

  return (
    <div className="debug-panel">
      <h3>🐛 JSON Debug Panel</h3>

      <div className="debug-section">
        <h4>📊 Estatísticas</h4>
        <p>Blocos: {debugInfo.blocksCount}</p>
        <p>Tipos únicos: {debugInfo.blockTypes.length}</p>
        <p>Componentes disponíveis: {debugInfo.availableComponents.length}</p>
      </div>

      <div className="debug-section">
        <h4>✅ Validação</h4>
        <p>Válido: {debugInfo.validation.isValid ? '✅' : '❌'}</p>
        {debugInfo.validation.errors.length > 0 && (
          <div className="errors">
            <strong>Erros:</strong>
            <ul>
              {debugInfo.validation.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {debugInfo.validation.warnings.length > 0 && (
          <div className="warnings">
            <strong>Avisos:</strong>
            <ul>
              {debugInfo.validation.warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="debug-section">
        <h4>💾 Export</h4>
        <button
          onClick={() => {
            const template = exportCurrentAsTemplate({
              name: `Debug Template ${new Date().toISOString()}`,
              category: 'custom',
            });
            console.log('🔍 Template JSON:', JSON.stringify(template, null, 2));
          }}
          disabled={blocks.length === 0}
        >
          Log Template JSON
        </button>
      </div>
    </div>
  );
};

// =============================================
// 5️⃣ EXEMPLO: Hook Customizado para Casos Específicos
// =============================================

export const useStepByStepBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);

  const { loadStepTemplate, mergeTemplateWithExisting } = useEditorWithJson(
    allBlocks,
    setAllBlocks
  );

  const addNextStep = async () => {
    if (currentStep <= 21) {
      const success = await loadStepTemplate(currentStep);
      if (success) {
        setCurrentStep(prev => prev + 1);
        return true;
      }
    }
    return false;
  };

  const insertStepAt = async (stepNumber: number, position: 'append' | 'merge' = 'append') => {
    if (stepNumber < 1 || stepNumber > 21) return false;

    const stepId = stepNumber.toString().padStart(2, '0');
    const template = await fetch(`/templates/step-${stepId}-template.json`)
      .then(res => res.json())
      .catch(() => null);

    if (!template) return false;

    if (position === 'merge') {
      mergeTemplateWithExisting(template, allBlocks);
    } else {
      await loadStepTemplate(stepNumber);
    }

    return true;
  };

  return {
    currentStep,
    allBlocks,
    totalSteps: 21,
    addNextStep,
    insertStepAt,
    reset: () => {
      setCurrentStep(1);
      setAllBlocks([]);
    },
  };
};

// =============================================
// EXPORTS PARA USO
// =============================================

export { EditorWithJsonIntegration, JsonDebugPanel, JsonTemplatePreview, SimpleJsonIntegration };
