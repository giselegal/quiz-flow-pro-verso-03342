/**
 * 💾 GERENCIADOR DE DADOS DO QUIZ
 *
 * QuizDataManager.tsx - Gerencia state, localStorage, validação e sincronização
 * Componente invisível que coordena toda a persistência de dados
 */

import React, { useEffect, useRef } from 'react';

export interface QuizDataManagerProps {
  quizData: Record<string, any>;
  currentStep: number;
  mode: 'editor' | 'preview' | 'production';
  onDataChange: (data: Record<string, any>) => void;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  storageKey?: string;
}

export const QuizDataManager: React.FC<QuizDataManagerProps> = ({
  quizData,
  currentStep,
  mode,
  onDataChange,
  enableAutoSave = false,
  autoSaveInterval = 5000,
  storageKey = 'quiz_data',
}) => {
  const lastSaveRef = useRef<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          onDataChange(parsedData);
          console.log('🔄 QuizDataManager: Dados carregados do localStorage');
        }
      } catch (error) {
        console.warn('⚠️ QuizDataManager: Erro ao carregar dados:', error);
      }
    }
  }, [storageKey, onDataChange]);

  // Auto-save com debounce
  useEffect(() => {
    if (!enableAutoSave || typeof window === 'undefined') return;

    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Configurar novo save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(quizData));
        lastSaveRef.current = Date.now();
        console.log('💾 QuizDataManager: Auto-save realizado');
      } catch (error) {
        console.warn('⚠️ QuizDataManager: Erro no auto-save:', error);
      }
    }, autoSaveInterval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [quizData, enableAutoSave, autoSaveInterval, storageKey]);

  // Exportar dados
  const exportData = () => {
    const dataToExport = {
      quizData,
      metadata: {
        currentStep,
        mode,
        timestamp: new Date().toISOString(),
        totalSteps: Object.keys(quizData).length,
      },
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar dados
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.quizData) {
          onDataChange(importedData.quizData);
          console.log('📥 QuizDataManager: Dados importados com sucesso');
        }
      } catch (error) {
        console.error('❌ QuizDataManager: Erro ao importar dados:', error);
        alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
      }
    };
    reader.readAsText(file);
  };

  // Limpar todos os dados
  const clearAllData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      onDataChange({});
      localStorage.removeItem(storageKey);
      console.log('🗑️ QuizDataManager: Todos os dados foram limpos');
    }
  };

  // Calcular estatísticas
  const stats = {
    totalSteps: Object.keys(quizData).length,
    currentStepData: quizData[`step_${currentStep}`],
    hasDataForCurrentStep: !!quizData[`step_${currentStep}`],
    lastSave: lastSaveRef.current ? new Date(lastSaveRef.current).toLocaleTimeString() : 'Nunca',
    dataSize: JSON.stringify(quizData).length,
  };

  // Apenas renderizar controles no modo editor
  if (mode !== 'editor') {
    return null;
  }

  return (
    <div className="quiz-data-manager fixed bottom-4 left-4 z-50">
      <details className="bg-white rounded-lg shadow-lg border border-gray-200">
        <summary className="p-3 cursor-pointer hover:bg-gray-50 rounded-t-lg">
          <span className="text-sm font-medium text-gray-700">
            📊 Gerenciador de Dados
          </span>
          <span className="ml-2 text-xs text-gray-500">
            ({stats.totalSteps} etapas)
          </span>
        </summary>

        <div className="p-4 border-t border-gray-100 space-y-3">
          {/* Estatísticas */}
          <div className="text-xs text-gray-600 space-y-1">
            <div>Total de etapas: {stats.totalSteps}</div>
            <div>Etapa atual: {currentStep} {stats.hasDataForCurrentStep ? '✅' : '❌'}</div>
            <div>Último save: {stats.lastSave}</div>
            <div>Tamanho dos dados: {(stats.dataSize / 1024).toFixed(1)} KB</div>
            <div>Auto-save: {enableAutoSave ? '✅ Ativo' : '❌ Inativo'}</div>
          </div>

          {/* Controles */}
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              📥 Exportar Dados
            </button>

            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
              <div className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer text-center">
                📤 Importar Dados
              </div>
            </label>

            <button
              onClick={clearAllData}
              className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              🗑️ Limpar Tudo
            </button>
          </div>

          {/* Dados da etapa atual (se houver) */}
          {stats.currentStepData && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                Dados da etapa {currentStep}
              </summary>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(stats.currentStepData, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </details>
    </div>
  );
};

export default QuizDataManager;
