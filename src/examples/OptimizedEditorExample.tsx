/**
 * 🚀 EXEMPLO PRÁTICO DO SISTEMA INTEGRADO
 * =======================================
 * 
 * Demonstração completa de como usar o editor otimizado
 * aproveitando todos os 50 hooks e sistema existente.
 */

import React, { useEffect, useState } from 'react';
import { useOptimizedEditor } from '@/utils/optimizedEditorLoader';
import { withOptimizedInline } from '@/utils/optimizedPerformance';

// Exemplo de uso do hook principal
const OptimizedEditorExample: React.FC = () => {
  const {
    // Estado do editor
    currentStep,
    totalSteps,
    steps,
    responses,
    calculatedStyle,
    isLoading,
    hasUnsavedChanges,
    
    // Ações principais
    loadStep,
    navigateToStep,
    updateResponse,
    calculateResult,
    
    // Hooks integrados
    unifiedProps,
    editor,
    quiz,
    history,
    autoSave,
    shortcuts,
    performance,
    
    // Utilitários
    getCurrentStep,
    getProgress,
    canGoNext,
    canGoPrev,
    isSaving,
    lastSaved,
    isOptimized
  } = useOptimizedEditor();

  const [currentStepData, setCurrentStepData] = useState(null);

  // Carregar etapa inicial
  useEffect(() => {
    const stepData = loadStep(1);
    setCurrentStepData(stepData);
  }, [loadStep]);

  // Exemplo de navegação
  const handleNext = () => {
    if (canGoNext()) {
      const nextStep = currentStep + 1;
      navigateToStep(nextStep);
      const stepData = loadStep(nextStep);
      setCurrentStepData(stepData);
    }
  };

  const handlePrev = () => {
    if (canGoPrev()) {
      const prevStep = currentStep - 1;
      navigateToStep(prevStep);
      const stepData = loadStep(prevStep);
      setCurrentStepData(stepData);
    }
  };

  // Exemplo de atualização de resposta
  const handleResponseUpdate = (response: any) => {
    updateResponse(`step-${currentStep}`, response);
  };

  // Exemplo de cálculo de resultado
  const handleCalculateResult = () => {
    const result = calculateResult();
    console.log('🎯 Resultado calculado:', result);
  };

  return (
    <div className="optimized-editor-example">
      {/* Header com informações do sistema */}
      <div className="editor-header">
        <h1>Editor Otimizado - Etapa {currentStep} de {totalSteps}</h1>
        <div className="status-bar">
          <span>Progresso: {getProgress()}%</span>
          <span>Otimizado: {isOptimized ? '✅' : '❌'}</span>
          <span>Salvando: {isSaving ? '💾' : '✅'}</span>
          <span>Último save: {lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'Nunca'}</span>
          <span>Alterações: {hasUnsavedChanges ? '⚠️' : '✅'}</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Conteúdo da etapa atual */}
      <div className="step-content">
        {isLoading ? (
          <div className="loading">Carregando etapa...</div>
        ) : currentStepData ? (
          <div>
            <h2>{currentStepData.name}</h2>
            <p>{currentStepData.description}</p>
            
            {/* Renderizar blocos da etapa */}
            {currentStepData.blocks?.map((block, index) => (
              <div key={index} className="step-block">
                <h4>Bloco: {block.type}</h4>
                <pre>{JSON.stringify(block.properties, null, 2)}</pre>
              </div>
            ))}
            
            {/* Área de resposta */}
            <div className="response-area">
              <h3>Sua resposta:</h3>
              <textarea
                value={responses[`step-${currentStep}`] || ''}
                onChange={(e) => handleResponseUpdate(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                rows={4}
                cols={50}
              />
            </div>
          </div>
        ) : (
          <div className="no-step">Etapa não encontrada</div>
        )}
      </div>

      {/* Controles de navegação */}
      <div className="navigation-controls">
        <button 
          onClick={handlePrev} 
          disabled={!canGoPrev()}
          className="nav-button prev"
        >
          ← Anterior
        </button>
        
        <button 
          onClick={handleCalculateResult}
          className="calculate-button"
        >
          Calcular Resultado
        </button>
        
        <button 
          onClick={handleNext} 
          disabled={!canGoNext()}
          className="nav-button next"
        >
          Próximo →
        </button>
      </div>

      {/* Resultado calculado */}
      {calculatedStyle && (
        <div className="calculated-result">
          <h3>Resultado Calculado:</h3>
          <pre>{JSON.stringify(calculatedStyle, null, 2)}</pre>
        </div>
      )}

      {/* Debug info */}
      <details className="debug-info">
        <summary>🔍 Informações de Debug</summary>
        <pre>
{`Hooks disponíveis:
- unifiedProps: ${!!unifiedProps}
- editor: ${!!editor}
- quiz: ${!!quiz}
- history: ${!!history}
- autoSave: ${!!autoSave}
- shortcuts: ${!!shortcuts}
- performance: ${!!performance}

Estado atual:
- currentStep: ${currentStep}
- totalSteps: ${totalSteps}
- responses: ${Object.keys(responses).length} respostas
- hasUnsavedChanges: ${hasUnsavedChanges}
- isOptimized: ${isOptimized}
`}
        </pre>
      </details>

      <style jsx>{`
        .optimized-editor-example {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .editor-header {
          background: linear-gradient(135deg, #B89B7A, #8F7A6A);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .editor-header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        .status-bar {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          font-size: 14px;
          opacity: 0.9;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #B89B7A, #8F7A6A);
          transition: width 0.3s ease;
        }

        .step-content {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
          min-height: 300px;
        }

        .loading, .no-step {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 50px 0;
        }

        .step-block {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }

        .response-area {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .response-area textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: vertical;
          font-family: inherit;
        }

        .navigation-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 30px 0;
        }

        .nav-button, .calculate-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-button {
          background: #B89B7A;
          color: white;
        }

        .nav-button:hover:not(:disabled) {
          background: #8F7A6A;
          transform: translateY(-1px);
        }

        .nav-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .calculate-button {
          background: #28a745;
          color: white;
        }

        .calculate-button:hover {
          background: #218838;
        }

        .calculated-result {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .debug-info {
          margin-top: 30px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
        }

        .debug-info summary {
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .debug-info pre {
          background: white;
          padding: 15px;
          border-radius: 6px;
          overflow: auto;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

// Otimizar o componente com HOC
const OptimizedEditorExampleComponent = withOptimizedInline(OptimizedEditorExample);

export default OptimizedEditorExampleComponent;

// ====================================================================
// 🎯 EXEMPLO DE INTEGRAÇÃO EM PÁGINAS EXISTENTES
// ====================================================================

/**
 * Exemplo de como integrar em QuizPage.tsx existente
 */
export const integrateWithExistingQuizPage = () => {
  // Este código pode ser adicionado à QuizPage.tsx existente
  const exampleIntegration = `
// No topo do arquivo QuizPage.tsx
import { useOptimizedEditor } from '@/utils/optimizedEditorLoader';

// Dentro do componente QuizPage
export default function QuizPage() {
  const optimizedEditor = useOptimizedEditor();
  
  // Usar junto com hooks existentes
  const existingHooks = {
    // hooks existentes continuam funcionando
  };
  
  // Combinar funcionalidades
  const handleStepChange = (step) => {
    // Lógica existente
    // + Nova funcionalidade otimizada
    optimizedEditor.navigateToStep(step);
  };
  
  return (
    <div>
      {/* UI existente continua funcionando */}
      {/* + Novas funcionalidades otimizadas */}
    </div>
  );
}
`;

  return exampleIntegration;
};

/**
 * 🎯 GUIA DE USO RÁPIDO
 */
export const quickStartGuide = {
  step1: {
    title: "1. Importar o hook principal",
    code: `import { useOptimizedEditor } from '@/utils/optimizedEditorLoader';`
  },
  step2: {
    title: "2. Usar no componente",
    code: `const editor = useOptimizedEditor();`
  },
  step3: {
    title: "3. Carregar etapa",
    code: `const stepData = editor.loadStep(1);`
  },
  step4: {
    title: "4. Navegar entre etapas",
    code: `editor.navigateToStep(2);`
  },
  step5: {
    title: "5. Atualizar resposta",
    code: `editor.updateResponse('step-1', userData);`
  },
  step6: {
    title: "6. Calcular resultado",
    code: `const result = editor.calculateResult();`
  }
};

console.log('🚀 EXEMPLO PRÁTICO CRIADO!');
console.log('📖 Use o OptimizedEditorExampleComponent para testar');
console.log('🎯 Veja quickStartGuide para começar rapidamente');
