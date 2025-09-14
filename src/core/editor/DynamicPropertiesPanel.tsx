/**
 * 🎛️ PAINEL DE PROPRIEDADES DINÂMICO
 * 
 * Painel completo para edição de propriedades de etapas, blocos,
 * configurações globais e publicação com edição ao vivo.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useHeadlessEditor } from './HeadlessEditorProvider';
import { FunnelStep, StepType, QuizFunnelSchema } from '../../types/quiz-schema';
import { Block } from '../../types/editor';

// ============================================================================
// COMPONENTE PRINCIPAL DO PAINEL
// ============================================================================

export const DynamicPropertiesPanel: React.FC = () => {
  const { schema, currentStep, updateStep, updateGlobalSettings, updatePublicationSettings } = useHeadlessEditor();
  const [activeTab, setActiveTab] = useState<'step' | 'global' | 'publication'>('step');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  if (!schema) {
    return <div className=\"p-4 text-gray-500\">Carregando schema...</div>;
  }

  return (
    <div className=\"w-80 border-l border-gray-200 bg-white flex flex-col h-full\">
      {/* Tabs */}
      <div className=\"border-b border-gray-200\">
        <nav className=\"flex space-x-1 p-2\" aria-label=\"Tabs\">
          {[
            { key: 'step', label: 'Etapa', icon: '📄' },
            { key: 'global', label: 'Global', icon: '⚙️' },
            { key: 'publication', label: 'Publicação', icon: '🚀' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo do painel */}
      <div className=\"flex-1 overflow-y-auto\">
        {activeTab === 'step' && (
          <StepPropertiesPanel 
            step={currentStep}
            onUpdate={updateStep}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
          />
        )}
        {activeTab === 'global' && (
          <GlobalPropertiesPanel 
            settings={schema.settings}
            onUpdate={updateGlobalSettings}
          />
        )}
        {activeTab === 'publication' && (
          <PublicationPropertiesPanel 
            publication={schema.publication}
            onUpdate={updatePublicationSettings}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PAINEL DE PROPRIEDADES DA ETAPA
// ============================================================================

interface StepPropertiesPanelProps {
  step: FunnelStep | null;
  onUpdate: (stepId: string, updates: Partial<FunnelStep>) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
}

const StepPropertiesPanel: React.FC<StepPropertiesPanelProps> = ({
  step,
  onUpdate,
  selectedBlockId,
  onSelectBlock
}) => {
  if (!step) {
    return <div className=\"p-4 text-gray-500\">Selecione uma etapa para editar</div>;
  }

  const selectedBlock = step.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className=\"p-4 space-y-6\">
      {/* Informações básicas da etapa */}
      <div>
        <h3 className=\"text-lg font-semibold mb-3\">Informações da Etapa</h3>
        
        <div className=\"space-y-3\">
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">
              Nome da Etapa
            </label>
            <input
              type=\"text\"
              value={step.name}
              onChange={(e) => onUpdate(step.id, { name: e.target.value })}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
            />
          </div>

          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">
              Descrição
            </label>
            <textarea
              value={step.description}
              onChange={(e) => onUpdate(step.id, { description: e.target.value })}
              rows={3}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
            />
          </div>

          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">
              Tipo da Etapa
            </label>
            <select
              value={step.type}
              onChange={(e) => onUpdate(step.id, { type: e.target.value as StepType })}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
            >
              <option value=\"intro\">Introdução</option>
              <option value=\"lead-capture\">Captura de Dados</option>
              <option value=\"quiz-question\">Pergunta do Quiz</option>
              <option value=\"strategic-question\">Pergunta Estratégica</option>
              <option value=\"transition\">Transição</option>
              <option value=\"result\">Resultado</option>
              <option value=\"offer\">Oferta</option>
              <option value=\"thank-you\">Agradecimento</option>
              <option value=\"custom\">Personalizada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configurações de visualização */}
      <div>
        <h4 className=\"text-md font-semibold mb-3\">Configurações de Visualização</h4>
        
        <div className=\"space-y-3\">
          <label className=\"flex items-center space-x-2\">
            <input
              type=\"checkbox\"
              checked={step.settings.showProgress}
              onChange={(e) => onUpdate(step.id, {
                settings: { ...step.settings, showProgress: e.target.checked }
              })}
              className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
            />
            <span className=\"text-sm text-gray-700\">Mostrar progresso</span>
          </label>

          <label className=\"flex items-center space-x-2\">
            <input
              type=\"checkbox\"
              checked={step.settings.showBackButton}
              onChange={(e) => onUpdate(step.id, {
                settings: { ...step.settings, showBackButton: e.target.checked }
              })}
              className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
            />
            <span className=\"text-sm text-gray-700\">Botão voltar</span>
          </label>

          <label className=\"flex items-center space-x-2\">
            <input
              type=\"checkbox\"
              checked={step.settings.showNextButton}
              onChange={(e) => onUpdate(step.id, {
                settings: { ...step.settings, showNextButton: e.target.checked }
              })}
              className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
            />
            <span className=\"text-sm text-gray-700\">Botão avançar</span>
          </label>

          <label className=\"flex items-center space-x-2\">
            <input
              type=\"checkbox\"
              checked={step.settings.allowSkip}
              onChange={(e) => onUpdate(step.id, {
                settings: { ...step.settings, allowSkip: e.target.checked }
              })}
              className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
            />
            <span className=\"text-sm text-gray-700\">Permitir pular</span>
          </label>
        </div>
      </div>

      {/* Lista de blocos */}
      <div>
        <h4 className=\"text-md font-semibold mb-3\">Blocos de Conteúdo ({step.blocks.length})</h4>
        
        <div className=\"space-y-2\">
          {step.blocks.map((block, index) => (
            <div
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedBlockId === block.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className=\"flex justify-between items-center\">
                <div>
                  <div className=\"text-sm font-medium text-gray-900\">{block.type}</div>
                  <div className=\"text-xs text-gray-500\">#{block.id}</div>
                </div>
                <div className=\"text-xs text-gray-400\">#{index + 1}</div>
              </div>
            </div>
          ))}
        </div>

        {step.blocks.length === 0 && (
          <div className=\"text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-md\">
            Nenhum bloco nesta etapa
          </div>
        )}
      </div>

      {/* Editor do bloco selecionado */}
      {selectedBlock && (
        <div>
          <h4 className=\"text-md font-semibold mb-3\">Editando Bloco: {selectedBlock.type}</h4>
          <BlockPropertiesEditor 
            block={selectedBlock}
            onUpdate={(updates) => {
              const updatedBlocks = step.blocks.map(b => 
                b.id === selectedBlock.id ? { ...b, ...updates } : b
              );
              onUpdate(step.id, { blocks: updatedBlocks });
            }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EDITOR DE PROPRIEDADES DO BLOCO
// ============================================================================

interface BlockPropertiesEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

const BlockPropertiesEditor: React.FC<BlockPropertiesEditorProps> = ({ block, onUpdate }) => {
  // Render campos baseado no tipo do bloco
  const renderFieldsByBlockType = () => {
    switch (block.type) {
      case 'text-inline':
      case 'heading-inline':
        return (
          <>
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Conteúdo</label>
              <textarea
                value={block.properties?.content || block.content || ''}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, content: e.target.value }
                })}
                rows={4}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
              />
            </div>
            
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Cor do Texto</label>
              <input
                type=\"color\"
                value={block.properties?.color || '#000000'}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, color: e.target.value }
                })}
                className=\"w-full h-10 border border-gray-300 rounded-md\"
              />
            </div>
          </>
        );

      case 'image-inline':
      case 'image-display-inline':
        return (
          <>
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">URL da Imagem</label>
              <input
                type=\"url\"
                value={block.properties?.src || block.properties?.imageUrl || ''}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, src: e.target.value, imageUrl: e.target.value }
                })}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
              />
            </div>
            
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Texto Alternativo</label>
              <input
                type=\"text\"
                value={block.properties?.alt || block.properties?.imageAlt || ''}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, alt: e.target.value, imageAlt: e.target.value }
                })}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
              />
            </div>
          </>
        );

      case 'button-inline':
        return (
          <>
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Texto do Botão</label>
              <input
                type=\"text\"
                value={block.properties?.text || block.content || ''}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, text: e.target.value }
                })}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
              />
            </div>
            
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Cor de Fundo</label>
              <input
                type=\"color\"
                value={block.properties?.backgroundColor || '#4CAF50'}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, backgroundColor: e.target.value }
                })}
                className=\"w-full h-10 border border-gray-300 rounded-md\"
              />
            </div>
            
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">Cor do Texto</label>
              <input
                type=\"color\"
                value={block.properties?.textColor || '#FFFFFF'}
                onChange={(e) => onUpdate({ 
                  properties: { ...block.properties, textColor: e.target.value }
                })}
                className=\"w-full h-10 border border-gray-300 rounded-md\"
              />
            </div>
          </>
        );

      default:
        return (
          <div className=\"text-sm text-gray-500\">
            Editor específico para '{block.type}' não implementado ainda.
            <br />
            <br />
            Propriedades atuais:
            <pre className=\"mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto\">
              {JSON.stringify(block.properties, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className=\"space-y-4 p-4 bg-gray-50 rounded-md\">
      <div className=\"flex justify-between items-center\">
        <h5 className=\"font-medium text-gray-900\">Propriedades</h5>
        <span className=\"text-xs text-gray-500\">#{block.id}</span>
      </div>
      
      {renderFieldsByBlockType()}
      
      {/* Campo ordem sempre presente */}
      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Ordem</label>
        <input
          type=\"number\"
          value={block.order || 0}
          onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>
    </div>
  );
};

// ============================================================================
// PAINEL DE CONFIGURAÇÕES GLOBAIS
// ============================================================================

interface GlobalPropertiesPanelProps {
  settings: QuizFunnelSchema['settings'];
  onUpdate: (updates: Partial<QuizFunnelSchema['settings']>) => void;
}

const GlobalPropertiesPanel: React.FC<GlobalPropertiesPanelProps> = ({ settings, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<'seo' | 'branding' | 'analytics' | 'integrations'>('seo');

  return (
    <div className=\"p-4 space-y-6\">
      <h3 className=\"text-lg font-semibold\">Configurações Globais</h3>

      {/* Navegação de seções */}
      <div className=\"flex flex-wrap gap-2\">
        {[
          { key: 'seo', label: 'SEO', icon: '🔍' },
          { key: 'branding', label: 'Visual', icon: '🎨' },
          { key: 'analytics', label: 'Analytics', icon: '📊' },
          { key: 'integrations', label: 'Integrações', icon: '🔗' }
        ].map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as any)}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
              activeSection === section.key
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da seção ativa */}
      <div className=\"space-y-4\">
        {activeSection === 'seo' && (
          <SEOConfigSection seo={settings.seo} onUpdate={(seo) => onUpdate({ seo })} />
        )}
        {activeSection === 'branding' && (
          <BrandingConfigSection branding={settings.branding} onUpdate={(branding) => onUpdate({ branding })} />
        )}
        {activeSection === 'analytics' && (
          <AnalyticsConfigSection analytics={settings.analytics} onUpdate={(analytics) => onUpdate({ analytics })} />
        )}
        {activeSection === 'integrations' && (
          <IntegrationsConfigSection integrations={settings.integrations} onUpdate={(integrations) => onUpdate({ integrations })} />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SEÇÕES DE CONFIGURAÇÃO GLOBAL
// ============================================================================

const SEOConfigSection: React.FC<{
  seo: QuizFunnelSchema['settings']['seo'];
  onUpdate: (seo: QuizFunnelSchema['settings']['seo']) => void;
}> = ({ seo, onUpdate }) => (
  <div className=\"space-y-4\">
    <h4 className=\"font-medium\">SEO & Meta Tags</h4>
    
    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Título</label>
      <input
        type=\"text\"
        value={seo.title}
        onChange={(e) => onUpdate({ ...seo, title: e.target.value })}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>

    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Descrição</label>
      <textarea
        value={seo.description}
        onChange={(e) => onUpdate({ ...seo, description: e.target.value })}
        rows={3}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>

    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Palavras-chave (separadas por vírgula)</label>
      <input
        type=\"text\"
        value={seo.keywords.join(', ')}
        onChange={(e) => onUpdate({ ...seo, keywords: e.target.value.split(',').map(k => k.trim()) })}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>

    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Imagem Open Graph</label>
      <input
        type=\"url\"
        value={seo.openGraph.image}
        onChange={(e) => onUpdate({ 
          ...seo, 
          openGraph: { ...seo.openGraph, image: e.target.value }
        })}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>
  </div>
);

const BrandingConfigSection: React.FC<{
  branding: QuizFunnelSchema['settings']['branding'];
  onUpdate: (branding: QuizFunnelSchema['settings']['branding']) => void;
}> = ({ branding, onUpdate }) => (
  <div className=\"space-y-4\">
    <h4 className=\"font-medium\">Identidade Visual</h4>
    
    <div className=\"grid grid-cols-2 gap-3\">
      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Cor Primária</label>
        <input
          type=\"color\"
          value={branding.colors.primary}
          onChange={(e) => onUpdate({ 
            ...branding, 
            colors: { ...branding.colors, primary: e.target.value }
          })}
          className=\"w-full h-10 border border-gray-300 rounded-md\"
        />
      </div>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Cor Secundária</label>
        <input
          type=\"color\"
          value={branding.colors.secondary}
          onChange={(e) => onUpdate({ 
            ...branding, 
            colors: { ...branding.colors, secondary: e.target.value }
          })}
          className=\"w-full h-10 border border-gray-300 rounded-md\"
        />
      </div>
    </div>

    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Logo Principal (URL)</label>
      <input
        type=\"url\"
        value={branding.logo.primary}
        onChange={(e) => onUpdate({ 
          ...branding, 
          logo: { ...branding.logo, primary: e.target.value }
        })}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>

    <div>
      <label className=\"block text-sm font-medium text-gray-700 mb-1\">Fonte Principal</label>
      <input
        type=\"text\"
        value={branding.typography.fontFamily.primary}
        onChange={(e) => onUpdate({ 
          ...branding, 
          typography: { 
            ...branding.typography, 
            fontFamily: { ...branding.typography.fontFamily, primary: e.target.value }
          }
        })}
        className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
      />
    </div>
  </div>
);

const AnalyticsConfigSection: React.FC<{
  analytics: QuizFunnelSchema['settings']['analytics'];
  onUpdate: (analytics: QuizFunnelSchema['settings']['analytics']) => void;
}> = ({ analytics, onUpdate }) => (
  <div className=\"space-y-4\">
    <h4 className=\"font-medium\">Analytics & Tracking</h4>
    
    <label className=\"flex items-center space-x-2\">
      <input
        type=\"checkbox\"
        checked={analytics.enabled}
        onChange={(e) => onUpdate({ ...analytics, enabled: e.target.checked })}
        className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
      />
      <span className=\"text-sm text-gray-700\">Habilitar Analytics</span>
    </label>

    {analytics.enabled && analytics.googleAnalytics && (
      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Google Analytics Measurement ID</label>
        <input
          type=\"text\"
          value={analytics.googleAnalytics.measurementId}
          onChange={(e) => onUpdate({ 
            ...analytics, 
            googleAnalytics: { 
              ...analytics.googleAnalytics, 
              measurementId: e.target.value 
            }
          })}
          placeholder=\"GA4-XXXXXXXXX\"
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>
    )}

    <div className=\"grid grid-cols-1 gap-3\">
      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">UTM Source</label>
        <input
          type=\"text\"
          value={analytics.utm.source}
          onChange={(e) => onUpdate({ 
            ...analytics, 
            utm: { ...analytics.utm, source: e.target.value }
          })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">UTM Campaign</label>
        <input
          type=\"text\"
          value={analytics.utm.campaign}
          onChange={(e) => onUpdate({ 
            ...analytics, 
            utm: { ...analytics.utm, campaign: e.target.value }
          })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>
    </div>
  </div>
);

const IntegrationsConfigSection: React.FC<{
  integrations: QuizFunnelSchema['settings']['integrations'];
  onUpdate: (integrations: QuizFunnelSchema['settings']['integrations']) => void;
}> = ({ integrations, onUpdate }) => (
  <div className=\"space-y-4\">
    <h4 className=\"font-medium\">Integrações & Webhooks</h4>
    
    <div className=\"text-sm text-gray-600\">
      {integrations.webhooks.length} webhook(s) configurado(s)
    </div>
    
    <div className=\"text-sm text-gray-500\">
      Configuração detalhada de integrações será implementada em breve.
    </div>
  </div>
);

// ============================================================================
// PAINEL DE CONFIGURAÇÕES DE PUBLICAÇÃO
// ============================================================================

interface PublicationPropertiesPanelProps {
  publication: QuizFunnelSchema['publication'];
  onUpdate: (updates: Partial<QuizFunnelSchema['publication']>) => void;
}

const PublicationPropertiesPanel: React.FC<PublicationPropertiesPanelProps> = ({ publication, onUpdate }) => {
  return (
    <div className=\"p-4 space-y-6\">
      <h3 className=\"text-lg font-semibold\">Configurações de Publicação</h3>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Status</label>
        <select
          value={publication.status}
          onChange={(e) => onUpdate({ status: e.target.value as any })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        >
          <option value=\"draft\">Rascunho</option>
          <option value=\"published\">Publicado</option>
          <option value=\"archived\">Arquivado</option>
        </select>
      </div>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">URL Base</label>
        <input
          type=\"url\"
          value={publication.baseUrl}
          onChange={(e) => onUpdate({ baseUrl: e.target.value })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Slug</label>
        <input
          type=\"text\"
          value={publication.slug}
          onChange={(e) => onUpdate({ slug: e.target.value })}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
        />
      </div>

      <div>
        <label className=\"flex items-center space-x-2\">
          <input
            type=\"checkbox\"
            checked={publication.accessControl.public}
            onChange={(e) => onUpdate({ 
              accessControl: { ...publication.accessControl, public: e.target.checked }
            })}
            className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
          />
          <span className=\"text-sm text-gray-700\">Acesso público</span>
        </label>
      </div>

      <div>
        <label className=\"flex items-center space-x-2\">
          <input
            type=\"checkbox\"
            checked={publication.cdn.enabled}
            onChange={(e) => onUpdate({ 
              cdn: { ...publication.cdn, enabled: e.target.checked }
            })}
            className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
          />
          <span className=\"text-sm text-gray-700\">CDN habilitado</span>
        </label>
      </div>

      <div className=\"pt-4 border-t border-gray-200\">
        <h4 className=\"font-medium mb-2\">Informações</h4>
        <div className=\"text-sm text-gray-600 space-y-1\">
          <div>Versão: {publication.version}</div>
          {publication.publishedAt && (
            <div>Publicado em: {new Date(publication.publishedAt).toLocaleString()}</div>
          )}
          <div>Mudanças: {publication.changelog.length} entrada(s)</div>
        </div>
      </div>
    </div>
  );
};