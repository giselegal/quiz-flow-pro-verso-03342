/**
 * 🎨 EDITOR VISUAL COMPLETO HEADLESS
 * 
 * Interface principal que integra todos os componentes:
 * - Painel de propriedades dinâmico
 * - Preview em tempo real 
 * - Sistema de publicação instantânea
 * - Navegação entre etapas
 */

import React, { useState, useCallback, useEffect } from 'react';
import { HeadlessEditorProvider } from './HeadlessEditorProvider';
import { DynamicPropertiesPanel } from './DynamicPropertiesPanel';
import { LivePreviewSystem } from './LivePreviewSystem';
import { InstantPublishingSystem } from './InstantPublishingSystem';
import { QuizTemplateAdapter } from '../migration/QuizTemplateAdapter';
import { QuizFunnelSchema } from '../../types/quiz-schema';

// Import do template legacy para migração
import { quiz21StepsComplete } from '../../config/optimized21StepsFunnel';

// ============================================================================
// COMPONENTE PRINCIPAL DO EDITOR
// ============================================================================

export const HeadlessVisualEditor: React.FC = () => {
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'publish'>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'complete' | 'error'>('idle');

  // Migração automática do template legacy ao inicializar
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        setMigrationStatus('migrating');
        
        // Migrar template legacy para formato headless
        const adapter = new QuizTemplateAdapter();
        const migratedSchema = await adapter.convertLegacyTemplate(quiz21StepsComplete);
        
        setMigrationStatus('complete');
        setIsInitialized(true);
        
        console.log('🎉 Editor inicializado com schema migrado:', migratedSchema);
      } catch (error) {
        console.error('❌ Erro na migração:', error);
        setMigrationStatus('error');
      }
    };

    initializeEditor();
  }, []);

  const renderMainContent = () => {
    switch (activeView) {
      case 'preview':
        return <LivePreviewSystem />;
      case 'publish':
        return <InstantPublishingSystem />;
      case 'editor':
      default:
        return <EditorMainCanvas />;
    }
  };

  if (!isInitialized) {
    return <LoadingScreen migrationStatus={migrationStatus} />;
  }

  return (
    <HeadlessEditorProvider>
      <div className=\"h-screen flex flex-col bg-gray-50\">
        {/* Header principal */}
        <EditorHeader 
          activeView={activeView}
          onViewChange={setActiveView}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Layout principal */}
        <div className=\"flex-1 flex overflow-hidden\">
          {/* Área principal */}
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'mr-0' : 'mr-80'}`}>
            {renderMainContent()}
          </main>

          {/* Sidebar - Painel de propriedades */}
          <div className={`fixed right-0 top-16 h-[calc(100vh-4rem)] transition-transform duration-300 z-40 ${
            sidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
          }`}>
            <DynamicPropertiesPanel />
          </div>
        </div>

        {/* Overlay para mobile quando sidebar aberta */}
        {!sidebarCollapsed && (
          <div 
            className=\"fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden\"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </div>
    </HeadlessEditorProvider>
  );
};

// ============================================================================
// HEADER DO EDITOR
// ============================================================================

interface EditorHeaderProps {
  activeView: 'editor' | 'preview' | 'publish';
  onViewChange: (view: 'editor' | 'preview' | 'publish') => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  activeView,
  onViewChange,
  sidebarCollapsed,
  onToggleSidebar
}) => {
  return (
    <header className=\"bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50 relative\">
      {/* Logo e título */}
      <div className=\"flex items-center space-x-4\">
        <div className=\"flex items-center space-x-2\">
          <div className=\"w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center\">
            <span className=\"text-white font-bold text-sm\">QQ</span>
          </div>
          <div>
            <h1 className=\"text-lg font-semibold text-gray-900\">Quiz Quest Editor</h1>
            <p className=\"text-xs text-gray-500\">Editor Visual Headless</p>
          </div>
        </div>
      </div>

      {/* Navegação entre views */}
      <div className=\"flex items-center space-x-1 bg-gray-100 p-1 rounded-lg\">
        {[
          { key: 'editor', label: 'Editor', icon: '🎨' },
          { key: 'preview', label: 'Preview', icon: '👁️' },
          { key: 'publish', label: 'Publicar', icon: '🚀' }
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => onViewChange(view.key as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeView === view.key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>{view.icon}</span>
            <span className=\"hidden sm:inline\">{view.label}</span>
          </button>
        ))}
      </div>

      {/* Controles da sidebar */}
      <div className=\"flex items-center space-x-2\">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg border transition-colors ${
            sidebarCollapsed 
              ? 'border-gray-300 text-gray-500 hover:bg-gray-50' 
              : 'border-blue-200 text-blue-600 bg-blue-50'
          }`}
          title={sidebarCollapsed ? 'Mostrar propriedades' : 'Ocultar propriedades'}
        >
          <svg className=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
            <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} 
              d={sidebarCollapsed ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'} />
          </svg>
        </button>
      </div>
    </header>
  );
};

// ============================================================================
// CANVAS PRINCIPAL DO EDITOR
// ============================================================================

const EditorMainCanvas: React.FC = () => {
  return (
    <div className=\"h-full flex flex-col\">
      {/* Barra de ferramentas do canvas */}
      <div className=\"bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between\">
        <div className=\"flex items-center space-x-4\">
          <h2 className=\"text-lg font-semibold text-gray-900\">Canvas do Editor</h2>
          <AutoSaveIndicator />
        </div>
        <div className=\"flex items-center space-x-2\">
          <button className=\"px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50\">
            🔄 Desfazer
          </button>
          <button className=\"px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50\">
            🔄 Refazer
          </button>
        </div>
      </div>

      {/* Área do canvas */}
      <div className=\"flex-1 overflow-auto bg-gray-100 p-6\">
        <div className=\"max-w-4xl mx-auto\">
          {/* Integração com o sistema de preview para edição visual */}
          <div className=\"bg-white rounded-lg shadow-lg p-1\">
            <LivePreviewSystem />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// INDICADOR DE AUTO-SAVE
// ============================================================================

const AutoSaveIndicator: React.FC = () => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Simular auto-save periódico
  useEffect(() => {
    const interval = setInterval(() => {
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 1000);
    }, 30000); // Auto-save a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (saveStatus) {
      case 'saving':
        return { color: 'text-yellow-600', icon: '💾', text: 'Salvando...' };
      case 'error':
        return { color: 'text-red-600', icon: '❌', text: 'Erro ao salvar' };
      case 'saved':
      default:
        return { color: 'text-green-600', icon: '✅', text: 'Salvo' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-1 text-xs ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

// ============================================================================
// TELA DE CARREGAMENTO
// ============================================================================

interface LoadingScreenProps {
  migrationStatus: 'idle' | 'migrating' | 'complete' | 'error';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ migrationStatus }) => {
  const getStatusMessage = () => {
    switch (migrationStatus) {
      case 'idle':
        return { icon: '⏳', text: 'Inicializando editor...' };
      case 'migrating':
        return { icon: '🔄', text: 'Migrando template para formato headless...' };
      case 'complete':
        return { icon: '✅', text: 'Migração concluída!' };
      case 'error':
        return { icon: '❌', text: 'Erro na inicialização' };
      default:
        return { icon: '⏳', text: 'Carregando...' };
    }
  };

  const status = getStatusMessage();

  return (
    <div className=\"h-screen flex items-center justify-center bg-gray-50\">
      <div className=\"text-center space-y-4\">
        <div className=\"text-6xl animate-pulse\">{status.icon}</div>
        <div className=\"text-xl font-medium text-gray-900\">{status.text}</div>
        <div className=\"text-sm text-gray-500\">Quiz Quest Challenge Verse</div>
        
        {migrationStatus === 'migrating' && (
          <div className=\"w-64 bg-gray-200 rounded-full h-2 mx-auto\">
            <div className=\"bg-blue-600 h-2 rounded-full animate-pulse\" style={{ width: '60%' }} />
          </div>
        )}
        
        {migrationStatus === 'error' && (
          <div className=\"text-red-600 text-sm max-w-md mx-auto\">
            Erro ao inicializar o editor. Verifique o console para mais detalhes.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE ATALHOS DE TECLADO
// ============================================================================

export const EditorKeyboardShortcuts: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S para salvar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log('🔄 Salvando via atalho...');
      }

      // Ctrl/Cmd + Z para desfazer
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        console.log('↶ Desfazendo...');
      }

      // Ctrl/Cmd + Shift + Z para refazer
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        console.log('↷ Refazendo...');
      }

      // Ctrl/Cmd + P para preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        console.log('👁️ Alternando preview...');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};

// ============================================================================
// HOOK PARA GESTÃO DE ESTADO DO EDITOR
// ============================================================================

export const useEditorState = () => {
  const [editorState, setEditorState] = useState({
    activeView: 'editor' as 'editor' | 'preview' | 'publish',
    sidebarCollapsed: false,
    selectedBlockId: null as string | null,
    selectedStepId: null as string | null,
    isDirty: false,
    lastSaved: new Date()
  });

  const updateEditorState = useCallback((updates: Partial<typeof editorState>) => {
    setEditorState(prev => ({ ...prev, ...updates, isDirty: true }));
  }, []);

  const markAsSaved = useCallback(() => {
    setEditorState(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }));
  }, []);

  return {
    editorState,
    updateEditorState,
    markAsSaved
  };
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default HeadlessVisualEditor;

// Componentes individuais para uso isolado
export {
  DynamicPropertiesPanel,
  LivePreviewSystem,
  InstantPublishingSystem,
  HeadlessEditorProvider
};