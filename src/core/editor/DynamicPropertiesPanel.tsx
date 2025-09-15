import React, { useState } from 'react';
import { useHeadlessEditor } from './HeadlessEditorProvider';
import { FunnelStep } from '../../types/quiz-schema';

type PanelTab = 'step' | 'global' | 'style' | 'publish';

export const DynamicPropertiesPanel: React.FC = () => {
  const { schema, currentStep, updateStep, updateGlobalSettings } = useHeadlessEditor();
  const [activeTab, setActiveTab] = useState<PanelTab>('step');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  if (!schema) {
    return <div className="p-4 text-gray-500">Carregando schema...</div>;
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 p-2" aria-label="Tabs">
          {[
            { id: 'step', name: 'Etapa', icon: '📝' },
            { id: 'global', name: 'Global', icon: '⚙️' },
            { id: 'style', name: 'Estilo', icon: '🎨' },
            { id: 'publish', name: 'Publicar', icon: '🚀' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PanelTab)}
              className={`
                ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
                }
                px-3 py-2 font-medium text-xs rounded-md border
              `}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent(activeTab, schema, currentStep, updateStep, updateGlobalSettings, selectedBlockId, setSelectedBlockId)}
      </div>
    </div>
  );
};

function renderTabContent(
  tab: PanelTab,
  schema: any,
  currentStep: FunnelStep | null,
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void,
  updateGlobalSettings: (updates: any) => void,
  selectedBlockId: string | null,
  setSelectedBlockId: (id: string | null) => void
) {
  switch (tab) {
    case 'step':
      return <StepPropertiesPanel 
        currentStep={currentStep} 
        updateStep={updateStep}
        selectedBlockId={selectedBlockId}
        setSelectedBlockId={setSelectedBlockId}
      />;
    
    case 'global':
      return <GlobalPropertiesPanel 
        schema={schema} 
        updateGlobalSettings={updateGlobalSettings} 
      />;
    
    case 'style':
      return <StylePropertiesPanel schema={schema} />;
    
    case 'publish':
      return <PublishPropertiesPanel schema={schema} />;
    
    default:
      return <div>Tab não encontrada</div>;
  }
}

interface StepPropertiesPanelProps {
  currentStep: FunnelStep | null;
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
}

const StepPropertiesPanel: React.FC<StepPropertiesPanelProps> = ({
  currentStep,
  updateStep,
  selectedBlockId,
  setSelectedBlockId
}) => {
  if (!currentStep) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">📝</div>
        <p>Nenhuma etapa selecionada</p>
        <p className="text-sm">Selecione uma etapa para editar</p>
      </div>
    );
  }

  const handleStepUpdate = (field: string, value: any) => {
    updateStep(currentStep.id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Propriedades da Etapa</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Etapa
            </label>
            <input
              type="text"
              value={currentStep.name}
              onChange={(e) => handleStepUpdate('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={currentStep.type}
              onChange={(e) => handleStepUpdate('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="intro">Introdução</option>
              <option value="quiz-question">Pergunta Quiz</option>
              <option value="strategic-question">Pergunta Estratégica</option>
              <option value="result">Resultado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={currentStep.description}
              onChange={(e) => handleStepUpdate('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Blocos ({currentStep.blocks.length})
        </h3>
        
        <div className="space-y-2">
          {currentStep.blocks.map((block: any) => (
            <div
              key={block.id}
              onClick={() => setSelectedBlockId(block.id === selectedBlockId ? null : block.id)}
              className={`
                p-3 border rounded-md cursor-pointer transition-colors
                ${selectedBlockId === block.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{block.type}</span>
                <span className="text-xs text-gray-500">{block.id}</span>
              </div>
              
              {selectedBlockId === block.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <BlockPropertiesEditor block={block} />
                </div>
              )}
            </div>
          ))}
        </div>
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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Configurações Globais</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Quiz
            </label>
            <input
              type="text"
              value={schema.title}
              onChange={(e) => updateGlobalSettings({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={schema.description}
              onChange={(e) => updateGlobalSettings({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={schema.category}
              onChange={(e) => updateGlobalSettings({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="personality">Personalidade</option>
              <option value="knowledge">Conhecimento</option>
              <option value="assessment">Avaliação</option>
              <option value="survey">Pesquisa</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const StylePropertiesPanel: React.FC<{ schema: any }> = ({ schema: _schema }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Configurações de Estilo</h3>
        <p className="text-sm text-gray-600">Personalize a aparência do seu quiz.</p>
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="default">Padrão</option>
              <option value="modern">Moderno</option>
              <option value="minimal">Minimalista</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor Primária
            </label>
            <input
              type="color"
              defaultValue="#3B82F6"
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PublishPropertiesPanel: React.FC<{ schema: any }> = ({ schema: _schema }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Configurações de Publicação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Personalizada
            </label>
            <input
              type="text"
              placeholder="meu-quiz-personalizado"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockPropertiesEditor: React.FC<{ block: any }> = ({ block }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Propriedades do Bloco</h4>
      
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Conteúdo
          </label>
          <textarea
            value={block.content || ''}
            rows={2}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>

        {block.properties && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Propriedades
            </label>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
              {JSON.stringify(block.properties, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;
