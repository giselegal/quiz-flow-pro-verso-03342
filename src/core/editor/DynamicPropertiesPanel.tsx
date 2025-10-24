import React, { useState, useEffect } from 'react';
import { useHeadlessEditor } from './HeadlessEditorProvider';
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
import { FunnelStep } from '../../types/quiz-schema';
import type { Block } from '@/types/editor';

type PanelTab = 'step' | 'global' | 'style' | 'publish';

export const DynamicPropertiesPanel: React.FC = () => {
  const {
    schema,
    isLoading: schemaLoading
  } = useHeadlessEditor();

  const {
    state: builderState,
    actions: builderActions
  } = usePureBuilder();

  const [activeTab, setActiveTab] = useState<PanelTab>('step');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // 🔧 INTEGRAÇÃO: Usar dados reais do PureBuilder
  const currentStepKey = `step-${builderState.currentStep}`;
  const stepBlocksMap = (builderState.stepBlocks || {}) as Record<string, Block[]>;
  const currentStepBlocks: Block[] = stepBlocksMap[currentStepKey] || [];
  const selectedBlock = selectedBlockId ? currentStepBlocks.find((block: Block) => block.id === selectedBlockId) : null;

  // 🔄 SINCRONIZAÇÃO: Atualizar seleção baseada no estado do builder
  useEffect(() => {
    if (builderState.selectedBlockId && builderState.selectedBlockId !== selectedBlockId) {
      setSelectedBlockId(builderState.selectedBlockId);
    }
  }, [builderState.selectedBlockId, selectedBlockId]);

  // 🎯 FUNÇÕES REAIS DE ATUALIZAÇÃO
  const updateStep = (stepId: string, updates: any) => {
    console.log('🔄 Atualizando step:', stepId, updates);
    // Implementar lógica de atualização de step via builder actions
  };

  const updateGlobalSettings = (updates: any) => {
    console.log('🌍 Atualizando configurações globais:', updates);
    // Implementar lógica de atualização global
  };

  const selectStep = (stepId: string) => {
    // Converter stepId para número se necessário
    const stepNumber = parseInt(stepId.replace('step-', '')) || builderState.currentStep;
    builderActions.setCurrentStep(stepNumber);
  };

  // 🔧 DEFININDO currentStep que estava faltando
  const currentStep = {
    order: builderState.currentStep,
    name: `Etapa ${builderState.currentStep}`,
    type: 'custom',
    description: `Etapa personalizada ${builderState.currentStep}`,
    blocks: currentStepBlocks,
    settings: {
      showProgress: true,
      showBackButton: true,
      allowSkip: false
    }
  };

  // 🔧 DEFININDO handleStepUpdate que estava faltando
  const handleStepUpdate = (field: string, value: any) => {
    console.log('🔄 Atualizando campo da etapa:', field, value);
    // Implementar lógica real de atualização conforme necessário
  };

  if (schemaLoading || !schema) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header com Tabs */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-1">
          {([
            { id: 'step', label: 'Etapa', icon: '📝' },
            { id: 'global', label: 'Global', icon: '🌍' },
            { id: 'style', label: 'Estilo', icon: '🎨' },
            { id: 'publish', label: 'Publicar', icon: '🚀' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo do painel baseado na tab ativa */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'step' && (
          <StepPropertiesPanel
            currentStep={currentStep}
            selectedBlock={selectedBlock || null}
            selectedBlockId={selectedBlockId}
            onBlockSelect={setSelectedBlockId}
            onBlockUpdate={async (blockId, updates) => {
              await builderActions.updateBlock(currentStepKey, blockId, updates);
            }}
            updateProperty={(blockId, property, value) => {
              builderActions.updateBlock(currentStepKey, blockId, { [property]: value });
            }}
            addBlock={(block) => {
              builderActions.addBlock(currentStepKey, block);
            }}
            removeBlock={(blockId) => {
              builderActions.removeBlock(currentStepKey, blockId);
            }}
            selectBlock={setSelectedBlockId}
          />
        )}

        {activeTab === 'global' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Configurações Globais</h3>
            <p className="text-gray-600">Painel de configurações globais em desenvolvimento.</p>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Configurações de Estilo</h3>
            <p className="text-gray-600">Painel de estilos em desenvolvimento.</p>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Configurações de Publicação</h3>
            <p className="text-gray-600">Painel de publicação em desenvolvimento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 COMPONENTE SIMPLIFICADO StepPropertiesPanel
const StepPropertiesPanel: React.FC<{
  currentStep: any;
  selectedBlock: Block | null;
  selectedBlockId: string | null;
  onBlockSelect: (id: string) => void;
  onBlockUpdate: (blockId: string, updates: any) => Promise<void>;
  updateProperty: (blockId: string, property: string, value: any) => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  selectBlock: (id: string) => void;
}> = ({
  currentStep,
  selectedBlock,
  selectedBlockId,
  onBlockSelect,
  onBlockUpdate,
  updateProperty,
  addBlock,
  removeBlock,
  selectBlock
}) => {
    return (
      <div className="p-4 space-y-6">
        {/* Informações da Etapa */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Propriedades da Etapa</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              #{currentStep.order}
            </span>
          </div>

          <div className="space-y-4">
            {/* Nome da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Etapa</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={currentStep.name || ''}
                onChange={(e) => console.log('Nome atualizado:', e.target.value)}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={currentStep.type || ''}
                onChange={(e) => console.log('Tipo atualizado:', e.target.value)}
              >
                <option value="intro">Introdução</option>
                <option value="question">Pergunta</option>
                <option value="result">Resultado</option>
                <option value="custom">Personalizada</option>
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                value={currentStep.description || ''}
                onChange={(e) => console.log('Descrição atualizada:', e.target.value)}
              />
            </div>

            {/* Configurações */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Configurações</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={currentStep.settings?.showProgress || false}
                    onChange={(e) => console.log('Show Progress:', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Mostrar Progresso</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={currentStep.settings?.showBackButton || false}
                    onChange={(e) => console.log('Show Back Button:', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Mostrar Botão Voltar</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={currentStep.settings?.allowSkip || false}
                    onChange={(e) => console.log('Allow Skip:', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Permitir Pular</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Blocos da Etapa */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Blocos ({currentStep.blocks?.length || 0})
          </h4>

          {!currentStep.blocks || currentStep.blocks.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhum bloco nesta etapa</p>
          ) : (
            <div className="space-y-2">
              {currentStep.blocks.map((block: any, index: number) => (
                <div
                  key={block.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedBlockId === block.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => onBlockSelect(block.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{block.type}</div>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloco Selecionado */}
        {selectedBlock && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Propriedades do Bloco: {selectedBlock.type}
            </h4>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">ID: {selectedBlock.id}</p>
              <p className="text-sm text-gray-600">Tipo: {selectedBlock.type}</p>

              {/* Aqui seria o painel de propriedades específicas do bloco */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Painel de propriedades específicas em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default DynamicPropertiesPanel;