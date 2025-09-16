import React, { useState } from 'react';
import { HeadlessEditorProvider } from './HeadlessEditorProvider';
import { DynamicPropertiesPanel } from './DynamicPropertiesPanel';
import { LivePreviewSystem } from './LivePreviewSystem';
import { InstantPublishingSystem } from './InstantPublishingSystem';

type EditorView = 'canvas' | 'preview' | 'publish';

interface HeadlessVisualEditorProps {
  funnelId?: string;
  templateId?: string;
}

export const HeadlessVisualEditor: React.FC<HeadlessVisualEditorProps> = ({
  funnelId,
  templateId
}) => {
  const [activeView, setActiveView] = useState<EditorView>('canvas');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log('🎯 HeadlessVisualEditor inicializado com:', { funnelId, templateId });

  return (
    <HeadlessEditorProvider
      schemaId={funnelId || templateId || 'default-template'}
      autoSave={true}
      autoSaveInterval={30000}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        <EditorHeader
          activeView={activeView}
          onViewChange={setActiveView}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className={`
            ${sidebarCollapsed ? 'w-0' : 'w-80'} 
            transition-all duration-300 
            bg-white border-r border-gray-200 
            overflow-hidden
          `}>
            {!sidebarCollapsed && <DynamicPropertiesPanel />}
          </div>

          <div className="flex-1 flex flex-col">
            {renderMainContent(activeView)}
          </div>
        </div>

        {!sidebarCollapsed && (
          <div
            onClick={() => setSidebarCollapsed(true)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          />
        )}
      </div>
    </HeadlessEditorProvider>
  );
};

interface EditorHeaderProps {
  activeView: EditorView;
  onViewChange: (view: EditorView) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  activeView,
  onViewChange,
  sidebarCollapsed: _sidebarCollapsed,
  onToggleSidebar
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">Q</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Quiz Editor Headless</h1>
        </div>

        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        >
          Menu
        </button>
      </div>

      <nav className="flex bg-gray-100 rounded-lg p-1">
        {[
          { id: 'canvas', label: 'Editor', icon: 'Edit' },
          { id: 'preview', label: 'Preview', icon: 'Eye' },
          { id: 'publish', label: 'Publicar', icon: 'Upload' }
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id as EditorView)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeView === id
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {icon} {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          Salvar
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          Publicar
        </button>
      </div>
    </header>
  );
};

function renderMainContent(activeView: EditorView) {
  switch (activeView) {
    case 'canvas':
      return (
        <div className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm h-full p-6">
            <h2 className="text-lg font-semibold mb-4">Canvas do Editor</h2>
            <p className="text-gray-600">
              Canvas principal onde o funil será editado visualmente.
              Integração com ENHANCED_BLOCK_REGISTRY em desenvolvimento.
            </p>
          </div>
        </div>
      );

    case 'preview':
      return <LivePreviewSystem />;

    case 'publish':
      return <InstantPublishingSystem />;

    default:
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">Loading</div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      );
  }
}

export default HeadlessVisualEditor;
