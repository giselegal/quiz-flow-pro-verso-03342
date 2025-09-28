import React, { useState, useEffect } from 'react';
import { useHeadlessEditor } from './HeadlessEditorProvider';
import { usePureBuilder } from '../../components/editor/PureBuilderProvider';
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
  const currentStepBlocks = builderState.stepBlocks[currentStepKey] || [];
  const selectedBlock = selectedBlockId ? currentStepBlocks.find(block => block.id === selectedBlockId) : null;

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

  const goToStep = (index: number) => {
    builderActions.setCurrentStep(index + 1);
  };

  const isLoading = schemaLoading || builderState.isLoading;

  if (isLoading) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!schema && !builderState.stepBlocks) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Painel de Propriedades</h3>
          <p className="text-sm text-gray-500">Carregue um template para começar a editar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Header com Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="p-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Painel de Propriedades</h2>
          <nav className="flex space-x-1">
            {[
              { id: 'step', name: 'Etapa', icon: '📝', color: 'blue' },
              { id: 'global', name: 'Global', icon: '⚙️', color: 'green' },
              { id: 'style', name: 'Estilo', icon: '🎨', color: 'purple' },
              { id: 'publish', name: 'Publicar', icon: '🚀', color: 'orange' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PanelTab)}
                className={`
                  flex-1 px-2 py-2 text-xs font-medium rounded transition-all
                  ${activeTab === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                  }
                `}
              >
                <span className="block">{tab.icon}</span>
                <span className="block mt-1">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo do Tab */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent(
          activeTab, 
          schema, 
          builderState, 
          currentStepBlocks, 
          selectedBlock,
          updateStep, 
          updateGlobalSettings, 
          selectStep, 
          goToStep, 
          selectedBlockId, 
          setSelectedBlockId,
          builderActions
        )}
      </div>
    </div>
  );
};

function renderTabContent(
  tab: PanelTab,
  schema: any,
  builderState: any,
  currentStepBlocks: Block[],
  selectedBlock: Block | null,
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void,
  updateGlobalSettings: (updates: any) => void,
  selectStep: (stepId: string) => void,
  goToStep: (index: number) => void,
  selectedBlockId: string | null,
  setSelectedBlockId: (id: string | null) => void,
  builderActions: any
) {
  switch (tab) {
    case 'step':
      return <StepPropertiesPanel
        schema={schema}
        builderState={builderState}
        currentStepBlocks={currentStepBlocks}
        selectedBlock={selectedBlock}
        updateStep={updateStep}
        selectStep={selectStep}
        goToStep={goToStep}
        selectedBlockId={selectedBlockId}
        setSelectedBlockId={setSelectedBlockId}
        builderActions={builderActions}
      />;

    case 'global':
      return <GlobalPropertiesPanel
        schema={schema}
        builderState={builderState}
        updateGlobalSettings={updateGlobalSettings}
      />;

    case 'style':
      return <StylePropertiesPanel
        schema={schema}
        builderState={builderState}
        updateGlobalSettings={updateGlobalSettings}
      />;

    case 'publish':
      return <PublishPropertiesPanel
        schema={schema}
        builderState={builderState}
        updateGlobalSettings={updateGlobalSettings}
      />;

    default:
      return <div className="p-4 text-center text-gray-500">Tab não encontrada</div>;
  }
}

interface StepPropertiesPanelProps {
  schema: any;
  builderState: any;
  currentStepBlocks: Block[];
  selectedBlock: Block | null;
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void;
  selectStep: (stepId: string) => void;
  goToStep: (index: number) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  builderActions: any;
}

const StepPropertiesPanel: React.FC<StepPropertiesPanelProps> = ({
  schema,
  builderState,
  currentStepBlocks,
  selectedBlock,
  updateStep,
  selectStep,
  goToStep,
  selectedBlockId,
  setSelectedBlockId,
  builderActions
}) => {
  // 🎯 NOVA LÓGICA: Usar dados reais do builder
  const totalSteps = Object.keys(builderState.stepBlocks || {}).length;
  const currentStepNumber = builderState.currentStep;
  
  // 🔧 Se não há bloco selecionado, mostrar overview da etapa atual
  if (!selectedBlock) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="font-semibold text-gray-900 mb-2">Etapa {currentStepNumber}</h3>
          <p className="text-sm mb-4">Selecione um bloco para editar suas propriedades ou navegue entre etapas</p>
        </div>

        {/* Lista de Etapas */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Etapas Disponíveis ({totalSteps})</h4>
          {Object.keys(builderState.stepBlocks || {}).map((stepKey, index) => {
            const stepNumber = parseInt(stepKey.replace('step-', ''));
            const blocks = builderState.stepBlocks[stepKey] || [];
            const isCurrentStep = stepNumber === currentStepNumber;
            
            return (
              <button
                key={stepKey}
                onClick={() => {
                  selectStep(stepKey);
                  goToStep(stepNumber - 1);
                }}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  isCurrentStep 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Etapa {stepNumber}</span>
                  <span className="text-xs text-gray-500">{blocks.length} blocos</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {blocks.length > 0 ? `${blocks[0].type}${blocks.length > 1 ? ` +${blocks.length-1}` : ''}` : 'Vazia'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Blocos da Etapa Atual */}
        {currentStepBlocks.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Blocos da Etapa {currentStepNumber}</h4>
            {currentStepBlocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => {
                  setSelectedBlockId(block.id);
                  builderActions.setSelectedBlockId(block.id);
                }}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedBlockId === block.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm capitalize">{block.type.replace('-', ' ')}</span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                {block.content?.text && (
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {block.content.text.substring(0, 40)}...
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🎯 EDIÇÃO DE BLOCO SELECIONADO
  const handleBlockUpdate = (field: string, value: any) => {
    if (selectedBlock) {
      const stepKey = `step-${currentStepNumber}`;
      builderActions.updateBlock(stepKey, selectedBlock.id, { [field]: value });
    }
  };

  const handlePropertyUpdate = (field: string, value: any) => {
    if (selectedBlock) {
      const stepKey = `step-${currentStepNumber}`;
      builderActions.updateBlock(stepKey, selectedBlock.id, { 
        properties: { ...selectedBlock.properties, [field]: value } 
      });
    }
  };

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Etapa
            </label>
            <input
              type="text"
              value={currentStep.name || ''}
              onChange={(e) => handleStepUpdate('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome da etapa..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo da Etapa
            </label>
            <select
              value={currentStep.type || ''}
              onChange={(e) => handleStepUpdate('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="intro">🎯 Introdução</option>
              <option value="lead-capture">📝 Captura de Lead</option>
              <option value="quiz-question">❓ Pergunta Quiz</option>
              <option value="strategic-question">🎯 Pergunta Estratégica</option>
              <option value="transition">🔄 Transição</option>
              <option value="result">🏆 Resultado</option>
              <option value="offer">💎 Oferta</option>
              <option value="custom">🔧 Personalizada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={currentStep.description || ''}
              onChange={(e) => handleStepUpdate('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descreva o propósito desta etapa..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordem
            </label>
            <input
              type="number"
              value={currentStep.order || 0}
              onChange={(e) => handleStepUpdate('order', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Configurações da Etapa */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Configurações</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentStep.settings?.showProgress || false}
              onChange={(e) => handleStepUpdate('settings', {
                ...currentStep.settings,
                showProgress: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mostrar barra de progresso</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentStep.settings?.showBackButton || false}
              onChange={(e) => handleStepUpdate('settings', {
                ...currentStep.settings,
                showBackButton: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mostrar botão "Voltar"</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentStep.settings?.allowSkip || false}
              onChange={(e) => handleStepUpdate('settings', {
                ...currentStep.settings,
                allowSkip: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Permitir pular etapa</span>
          </label>
        </div>
      </div>

      {/* Blocos da Etapa */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">
          Blocos ({currentStep.blocks?.length || 0})
        </h4>

        {!currentStep.blocks || currentStep.blocks.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm text-gray-500">Nenhum bloco encontrado</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {currentStep.blocks.map((block: any, index: number) => (
              <div
                key={block.id || index}
                onClick={() => setSelectedBlockId(block.id === selectedBlockId ? null : block.id)}
                className={`
                  p-3 border rounded-lg cursor-pointer transition-all
                  ${selectedBlockId === block.id
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{block.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    {selectedBlockId === block.id && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                        Selecionado
                      </span>
                    )}
                  </div>
                </div>

                {block.content && (
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {typeof block.content === 'string' ? block.content : JSON.stringify(block.content).substring(0, 50)}...
                  </div>
                )}

                {selectedBlockId === block.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <BlockPropertiesEditor block={block} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface GlobalPropertiesPanelProps {
  schema: any;
  updateGlobalSettings: (updates: any) => void;
}

const GlobalPropertiesPanel: React.FC<GlobalPropertiesPanelProps> = ({
  schema,
  updateGlobalSettings
}) => {
  const handleUpdate = (section: string, field: string, value: any) => {
    updateGlobalSettings({
      [section]: {
        ...schema.settings?.[section],
        [field]: value
      }
    });
  };

  const handleDirectUpdate = (field: string, value: any) => {
    updateGlobalSettings({ [field]: value });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Informações Básicas */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Informações Básicas
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Quiz
            </label>
            <input
              type="text"
              value={schema.name || ''}
              onChange={(e) => handleDirectUpdate('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Digite o título do quiz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={schema.description || ''}
              onChange={(e) => handleDirectUpdate('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Descreva seu quiz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={schema.category || 'quiz'}
              onChange={(e) => handleDirectUpdate('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="quiz">🧠 Quiz</option>
              <option value="personality">👤 Personalidade</option>
              <option value="knowledge">📚 Conhecimento</option>
              <option value="assessment">📊 Avaliação</option>
              <option value="survey">📝 Pesquisa</option>
              <option value="lead-generation">🎯 Lead Generation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versão
            </label>
            <input
              type="text"
              value={schema.version || '1.0.0'}
              onChange={(e) => handleDirectUpdate('version', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="1.0.0"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🔍</span>
          Configurações SEO
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título SEO
            </label>
            <input
              type="text"
              value={schema.settings?.seo?.title || ''}
              onChange={(e) => handleUpdate('seo', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Título para mecanismos de busca..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição SEO
            </label>
            <textarea
              value={schema.settings?.seo?.description || ''}
              onChange={(e) => handleUpdate('seo', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Descrição para mecanismos de busca..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavras-chave (separadas por vírgula)
            </label>
            <input
              type="text"
              value={schema.settings?.seo?.keywords?.join(', ') || ''}
              onChange={(e) => handleUpdate('seo', 'keywords', e.target.value.split(',').map((k: string) => k.trim()))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="quiz, teste, personalidade, etc..."
            />
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📊</span>
          Analytics
        </h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={schema.settings?.analytics?.enabled || false}
              onChange={(e) => handleUpdate('analytics', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Ativar Analytics</span>
          </label>

          {schema.settings?.analytics?.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={schema.settings?.analytics?.googleAnalytics?.measurementId || ''}
                onChange={(e) => handleUpdate('analytics', 'googleAnalytics', {
                  ...schema.settings?.analytics?.googleAnalytics,
                  measurementId: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas do Quiz */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📈</span>
          Estatísticas
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {schema.steps?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Total de Etapas</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {schema.editorMeta?.stats?.totalBlocks || 0}
            </div>
            <div className="text-xs text-gray-600">Total de Blocos</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {schema.editorMeta?.stats?.estimatedCompletionTime || 0}
            </div>
            <div className="text-xs text-gray-600">Minutos Estimados</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {schema.version || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Versão</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StylePropertiesPanelProps {
  schema: any;
  updateGlobalSettings: (updates: any) => void;
}

const StylePropertiesPanel: React.FC<StylePropertiesPanelProps> = ({ schema, updateGlobalSettings }) => {
  const handleBrandingUpdate = (section: string, field: string, value: any) => {
    updateGlobalSettings({
      branding: {
        ...schema.settings?.branding,
        [section]: {
          ...schema.settings?.branding?.[section],
          [field]: value
        }
      }
    });
  };

  const handleColorUpdate = (colorKey: string, value: string) => {
    updateGlobalSettings({
      branding: {
        ...schema.settings?.branding,
        colors: {
          ...schema.settings?.branding?.colors,
          [colorKey]: value
        }
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Cores */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🎨</span>
          Paleta de Cores
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={schema.settings?.branding?.colors?.primary || '#B89B7A'}
                  onChange={(e) => handleColorUpdate('primary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={schema.settings?.branding?.colors?.primary || '#B89B7A'}
                  onChange={(e) => handleColorUpdate('primary', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="#B89B7A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={schema.settings?.branding?.colors?.secondary || '#D4C2A8'}
                  onChange={(e) => handleColorUpdate('secondary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={schema.settings?.branding?.colors?.secondary || '#D4C2A8'}
                  onChange={(e) => handleColorUpdate('secondary', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="#D4C2A8"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Destaque
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={schema.settings?.branding?.colors?.accent || '#4CAF50'}
                  onChange={(e) => handleColorUpdate('accent', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={schema.settings?.branding?.colors?.accent || '#4CAF50'}
                  onChange={(e) => handleColorUpdate('accent', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="#4CAF50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Fundo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={schema.settings?.branding?.colors?.background || '#F9F5F1'}
                  onChange={(e) => handleColorUpdate('background', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={schema.settings?.branding?.colors?.background || '#F9F5F1'}
                  onChange={(e) => handleColorUpdate('background', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="#F9F5F1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipografia */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🔤</span>
          Tipografia
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fonte Primária
            </label>
            <select
              value={schema.settings?.branding?.typography?.fontFamily?.primary || 'Inter, system-ui, sans-serif'}
              onChange={(e) => handleBrandingUpdate('typography', 'fontFamily', {
                ...schema.settings?.branding?.typography?.fontFamily,
                primary: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Inter, system-ui, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lato, sans-serif">Lato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fonte Secundária
            </label>
            <select
              value={schema.settings?.branding?.typography?.fontFamily?.secondary || 'Poppins, sans-serif'}
              onChange={(e) => handleBrandingUpdate('typography', 'fontFamily', {
                ...schema.settings?.branding?.typography?.fontFamily,
                secondary: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logo e Marca */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🏷️</span>
          Logo e Marca
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL do Logo
            </label>
            <input
              type="url"
              value={schema.settings?.branding?.logo?.primary || ''}
              onChange={(e) => handleBrandingUpdate('logo', 'primary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL do Favicon
            </label>
            <input
              type="url"
              value={schema.settings?.branding?.logo?.favicon || ''}
              onChange={(e) => handleBrandingUpdate('logo', 'favicon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://exemplo.com/favicon.ico"
            />
          </div>
        </div>
      </div>

      {/* Espaçamento */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📏</span>
          Espaçamento e Layout
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raio da Borda
            </label>
            <select
              value={schema.settings?.branding?.borderRadius?.md || '0.5rem'}
              onChange={(e) => handleBrandingUpdate('borderRadius', 'md', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="0">Sem arredondamento</option>
              <option value="0.25rem">Pequeno (4px)</option>
              <option value="0.5rem">Médio (8px)</option>
              <option value="0.75rem">Grande (12px)</option>
              <option value="1rem">Extra Grande (16px)</option>
              <option value="9999px">Completamente arredondado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview das Cores */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">👁️</span>
          Preview da Paleta
        </h3>

        <div className="grid grid-cols-4 gap-2">
          <div
            className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: schema.settings?.branding?.colors?.primary || '#B89B7A' }}
          >
            Primária
          </div>
          <div
            className="h-16 rounded-lg flex items-center justify-center text-gray-700 text-xs font-medium"
            style={{ backgroundColor: schema.settings?.branding?.colors?.secondary || '#D4C2A8' }}
          >
            Secundária
          </div>
          <div
            className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: schema.settings?.branding?.colors?.accent || '#4CAF50' }}
          >
            Destaque
          </div>
          <div
            className="h-16 rounded-lg flex items-center justify-center text-gray-700 text-xs font-medium border border-gray-200"
            style={{ backgroundColor: schema.settings?.branding?.colors?.background || '#F9F5F1' }}
          >
            Fundo
          </div>
        </div>
      </div>
    </div>
  );
};

interface PublishPropertiesPanelProps {
  schema: any;
  updateGlobalSettings: (updates: any) => void;
}

const PublishPropertiesPanel: React.FC<PublishPropertiesPanelProps> = ({ schema, updateGlobalSettings }) => {
  const handlePublicationUpdate = (field: string, value: any) => {
    updateGlobalSettings({
      publication: {
        ...schema.publication,
        [field]: value
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Status da Publicação */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🚀</span>
          Status da Publicação
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={schema.publication?.status || 'draft'}
              onChange={(e) => handlePublicationUpdate('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="draft">📝 Rascunho</option>
              <option value="review">👀 Em Revisão</option>
              <option value="published">✅ Publicado</option>
              <option value="archived">📦 Arquivado</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${schema.publication?.status === 'published' ? 'bg-green-500' :
                  schema.publication?.status === 'review' ? 'bg-yellow-500' :
                    'bg-gray-400'
                }`}></div>
              <div>
                <div className="font-medium text-sm">
                  {schema.publication?.status === 'published' ? 'Publicado' :
                    schema.publication?.status === 'review' ? 'Em Revisão' :
                      'Rascunho'}
                </div>
                <div className="text-xs text-gray-600">
                  {schema.publication?.publishedAt ?
                    `Publicado em ${new Date(schema.publication.publishedAt).toLocaleDateString()}` :
                    'Não publicado'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de URL */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🔗</span>
          Configurações de URL
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Base
            </label>
            <input
              type="url"
              value={schema.publication?.baseUrl || ''}
              onChange={(e) => handlePublicationUpdate('baseUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://meusite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug/Caminho
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {schema.publication?.baseUrl || 'https://meusite.com'}/
              </span>
              <input
                type="text"
                value={schema.publication?.slug || ''}
                onChange={(e) => handlePublicationUpdate('slug', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="meu-quiz"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL final: {schema.publication?.baseUrl || 'https://meusite.com'}/{schema.publication?.slug || 'meu-quiz'}
            </p>
          </div>
        </div>
      </div>

      {/* Controle de Acesso */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🔐</span>
          Controle de Acesso
        </h3>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={schema.publication?.accessControl?.public || false}
              onChange={(e) => handlePublicationUpdate('accessControl', {
                ...schema.publication?.accessControl,
                public: e.target.checked
              })}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Quiz público (visível para todos)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={schema.publication?.accessControl?.requiresAuth || false}
              onChange={(e) => handlePublicationUpdate('accessControl', {
                ...schema.publication?.accessControl,
                requiresAuth: e.target.checked
              })}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Requer autenticação</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={schema.publication?.cdn?.enabled || false}
              onChange={(e) => handlePublicationUpdate('cdn', {
                ...schema.publication?.cdn,
                enabled: e.target.checked
              })}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Usar CDN para melhor performance</span>
          </label>
        </div>
      </div>

      {/* Informações de Versão */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Informações de Versão
        </h3>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Versão atual:</span>
            <span className="text-sm font-medium">{schema.publication?.version || '1.0.0'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Última modificação:</span>
            <span className="text-sm font-medium">
              {schema.editorMeta?.lastModified ?
                new Date(schema.editorMeta.lastModified).toLocaleString() :
                'N/A'
              }
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Modificado por:</span>
            <span className="text-sm font-medium">{schema.editorMeta?.lastModifiedBy || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Ações de Publicação */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">⚡</span>
          Ações Rápidas
        </h3>

        <div className="space-y-3">
          <button
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            onClick={() => alert('Funcionalidade de publicação será implementada!')}
          >
            🚀 Publicar Quiz
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => alert('Funcionalidade de preview será implementada!')}
          >
            👁️ Preview da Publicação
          </button>

          <button
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => alert('Funcionalidade de backup será implementada!')}
          >
            💾 Criar Backup
          </button>
        </div>
      </div>
    </div>
  );
};

interface BlockPropertiesEditorProps {
  block: any;
  onUpdateBlock?: (updates: any) => void;
}

const BlockPropertiesEditor: React.FC<BlockPropertiesEditorProps> = ({ block, onUpdateBlock }) => {
  const handleBlockUpdate = (field: string, value: any) => {
    if (onUpdateBlock) {
      onUpdateBlock({
        ...block,
        [field]: value
      });
    }
  };

  const handlePropertyUpdate = (key: string, value: any) => {
    if (onUpdateBlock) {
      onUpdateBlock({
        ...block,
        properties: {
          ...block.properties,
          [key]: value
        }
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-gray-900 flex items-center">
          <span className="mr-2">🧱</span>
          Propriedades do Bloco
        </h4>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {block.type || 'Bloco'}
        </span>
      </div>

      <div className="space-y-3">
        {/* Conteúdo do Bloco */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Conteúdo
          </label>
          <textarea
            value={block.content || ''}
            onChange={(e) => handleBlockUpdate('content', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o conteúdo do bloco..."
          />
        </div>

        {/* Tipo do Bloco */}
        {block.type && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={block.type}
              onChange={(e) => handleBlockUpdate('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">📝 Texto</option>
              <option value="image">🖼️ Imagem</option>
              <option value="video">🎥 Vídeo</option>
              <option value="audio">🎵 Áudio</option>
              <option value="button">🔘 Botão</option>
              <option value="link">🔗 Link</option>
              <option value="divider">➖ Divisor</option>
            </select>
          </div>
        )}

        {/* Propriedades Específicas por Tipo */}
        {block.type === 'image' && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                value={block.properties?.src || ''}
                onChange={(e) => handlePropertyUpdate('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={block.properties?.alt || ''}
                onChange={(e) => handlePropertyUpdate('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição da imagem"
              />
            </div>
          </div>
        )}

        {block.type === 'video' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL do Vídeo
            </label>
            <input
              type="url"
              value={block.properties?.src || ''}
              onChange={(e) => handlePropertyUpdate('src', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        )}

        {block.type === 'button' && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Texto do Botão
              </label>
              <input
                type="text"
                value={block.properties?.text || ''}
                onChange={(e) => handlePropertyUpdate('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Clique aqui"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ação do Botão
              </label>
              <select
                value={block.properties?.action || 'next'}
                onChange={(e) => handlePropertyUpdate('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="next">➡️ Próximo</option>
                <option value="previous">⬅️ Anterior</option>
                <option value="submit">✅ Enviar</option>
                <option value="link">🔗 Link Externo</option>
                <option value="custom">⚙️ Personalizado</option>
              </select>
            </div>
          </div>
        )}

        {/* Propriedades Gerais */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            CSS Classes (opcional)
          </label>
          <input
            type="text"
            value={block.properties?.className || ''}
            onChange={(e) => handlePropertyUpdate('className', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="class1 class2 class3"
          />
        </div>

        {/* Debug: Propriedades Completas */}
        {block.properties && Object.keys(block.properties).length > 0 && (
          <details className="mt-3">
            <summary className="text-xs font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              🔍 Ver Propriedades Completas
            </summary>
            <pre className="text-xs bg-white p-3 rounded border mt-2 overflow-x-auto">
              {JSON.stringify(block.properties, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;
