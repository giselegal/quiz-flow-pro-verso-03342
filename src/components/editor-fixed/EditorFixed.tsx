import { useEditor as useEditorContext } from '@/context/EditorContext';
import type { Block, FunnelStage } from '@/types/editor';
import React, { createContext, ReactNode, useContext } from 'react';

/**
 * 🏗️ COMPOUND COMPONENTS PATTERN - EditorFixed
 *
 * Implementação do padrão Compound Components para máxima
 * escalabilidade e reutilização no editor.
 */

// =============================================
// TYPES & INTERFACES
// =============================================

export interface EditorFixedConfig {
  theme?: 'light' | 'dark' | 'auto';
  layout?: 'four-column' | 'three-column' | 'responsive';
  viewport?: 'sm' | 'md' | 'lg' | 'xl';
  features?: {
    dragDrop?: boolean;
    properties?: boolean;
    toolbar?: boolean;
    funnel?: boolean;
  };
}

export interface EditorFixedContextValue {
  config: EditorFixedConfig;
  updateConfig: (config: Partial<EditorFixedConfig>) => void;
}

// =============================================
// CONTEXT
// =============================================

const EditorFixedContext = createContext<EditorFixedContextValue | null>(null);

export const useEditorFixed = () => {
  const context = useContext(EditorFixedContext);
  if (!context) {
    throw new Error('useEditorFixed must be used within EditorFixed.Provider');
  }
  return context;
};

// =============================================
// COMPOUND COMPONENTS
// =============================================

export interface EditorRootProps {
  children: ReactNode;
  className?: string;
  config?: Partial<EditorFixedConfig>;
}

const EditorRoot: React.FC<EditorRootProps> = ({
  children,
  className = '',
  config: initialConfig = {},
}) => {
  const [config, setConfig] = React.useState<EditorFixedConfig>({
    theme: 'light',
    layout: 'four-column',
    viewport: 'xl',
    features: {
      dragDrop: true,
      properties: true,
      toolbar: true,
      funnel: true,
    },
    ...initialConfig,
  });

  const updateConfig = React.useCallback((newConfig: Partial<EditorFixedConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      features: {
        ...prev.features,
        ...newConfig.features,
      },
    }));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      config,
      updateConfig,
    }),
    [config, updateConfig]
  );

  const rootClassName = React.useMemo(() => {
    const baseClasses = 'editor-fixed-root min-h-screen bg-background';
    const themeClasses = config.theme === 'dark' ? 'dark' : '';
    const layoutClasses = `layout-${config.layout}`;

    return `${baseClasses} ${themeClasses} ${layoutClasses} ${className}`.trim();
  }, [config.theme, config.layout, className]);

  return (
    <EditorFixedContext.Provider value={contextValue}>
      <div className={rootClassName} data-viewport={config.viewport}>
        {children}
      </div>
    </EditorFixedContext.Provider>
  );
};

// =============================================
// CANVAS COMPONENT
// =============================================

export interface EditorCanvasProps {
  className?: string;
  children?: ReactNode | ((canvas: any) => ReactNode);
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ className = '', children }) => {
  const { config } = useEditorFixed();
  const editor = useEditorContext();

  // Canvas-specific logic
  const canvasAPI = React.useMemo(
    () => ({
      blocks: editor.computed.currentBlocks,
      selectedBlock: editor.computed.selectedBlock,
      isPreviewing: editor.uiState.isPreviewing,
      actions: {
        addBlock: editor.blockActions.addBlock,
        updateBlock: editor.blockActions.updateBlock,
        deleteBlock: editor.blockActions.deleteBlock,
        selectBlock: editor.blockActions.setSelectedBlockId,
      },
      viewport: config.viewport,
    }),
    [editor, config.viewport]
  );

  const canvasClassName = React.useMemo(() => {
    const baseClasses = 'editor-canvas flex-1 relative';
    const viewportClasses = `viewport-${config.viewport}`;

    return `${baseClasses} ${viewportClasses} ${className}`.trim();
  }, [config.viewport, className]);

  return (
    <div className={canvasClassName}>
      {typeof children === 'function' ? children(canvasAPI) : children}
    </div>
  );
};

// =============================================
// PROPERTIES COMPONENT
// =============================================

export interface EditorPropertiesProps {
  className?: string;
  children?: ReactNode | ((properties: any) => ReactNode);
}

const EditorProperties: React.FC<EditorPropertiesProps> = ({ className = '', children }) => {
  const { config } = useEditorFixed();
  const editor = useEditorContext();

  // Properties-specific logic
  const propertiesAPI = React.useMemo(
    () => ({
      selectedBlock: editor.computed.selectedBlock,
      activeStageId: editor.activeStageId,
      actions: {
        updateBlock: editor.blockActions.updateBlock,
        updateStage: editor.stageActions.updateStage,
      },
    }),
    [editor]
  );

  const propertiesClassName = React.useMemo(() => {
    const baseClasses = 'editor-properties w-80 bg-card border-l';
    const hiddenClasses = !config.features?.properties ? 'hidden' : '';

    return `${baseClasses} ${hiddenClasses} ${className}`.trim();
  }, [config.features?.properties, className]);

  if (!config.features?.properties) return null;

  return (
    <div className={propertiesClassName}>
      {typeof children === 'function' ? children(propertiesAPI) : children}
    </div>
  );
};

// =============================================
// SIDEBAR COMPONENT
// =============================================

export interface EditorSidebarProps {
  className?: string;
  children?: ReactNode | ((sidebar: any) => ReactNode);
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ className = '', children }) => {
  const editor = useEditorContext();

  // Sidebar-specific logic - Create mock stages since they don't exist in computed
  const mockStages: FunnelStage[] = React.useMemo(
    () => [
      { id: 'stage-1', name: 'Intro', order: 1, type: 'intro' },
      { id: 'stage-2', name: 'Questions', order: 2, type: 'question' },
      { id: 'stage-3', name: 'Result', order: 3, type: 'result' },
    ],
    []
  );

  const sidebarAPI = React.useMemo(
    () => ({
      stages: mockStages,
      activeStageId: editor.activeStageId,
      actions: {
        addStage: editor.stageActions.addStage,
        selectStage: editor.stageActions.setActiveStage,
        updateStage: editor.stageActions.updateStage,
      },
    }),
    [editor, mockStages]
  );

  const sidebarClassName = React.useMemo(() => {
    const baseClasses = 'editor-sidebar w-64 bg-card border-r';

    return `${baseClasses} ${className}`.trim();
  }, [className]);

  return (
    <div className={sidebarClassName}>
      {typeof children === 'function' ? children(sidebarAPI) : children}
    </div>
  );
};

// =============================================
// TOOLBAR COMPONENT
// =============================================

export interface EditorToolbarProps {
  className?: string;
  children?: ReactNode | ((toolbar: any) => ReactNode);
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ className = '', children }) => {
  const { config, updateConfig } = useEditorFixed();
  const editor = useEditorContext();

  // Toolbar-specific logic
  const toolbarAPI = React.useMemo(
    () => ({
      isPreviewing: editor.uiState.isPreviewing,
      viewport: config.viewport,
      actions: {
        togglePreview: () => editor.uiState.setIsPreviewing(!editor.uiState.isPreviewing),
        setViewport: (viewport: EditorFixedConfig['viewport']) => updateConfig({ viewport }),
        save: () => console.log('💾 Saving...'),
        export: () => console.log('📤 Exporting...'),
      },
    }),
    [editor, config, updateConfig]
  );

  const toolbarClassName = React.useMemo(() => {
    const baseClasses = 'editor-toolbar h-14 bg-card border-b flex items-center';
    const hiddenClasses = !config.features?.toolbar ? 'hidden' : '';

    return `${baseClasses} ${hiddenClasses} ${className}`.trim();
  }, [config.features?.toolbar, className]);

  if (!config.features?.toolbar) return null;

  return (
    <div className={toolbarClassName}>
      {typeof children === 'function' ? children(toolbarAPI) : children}
    </div>
  );
};

// =============================================
// MAIN COMPOUND COMPONENT EXPORT
// =============================================

export const EditorFixed = {
  Root: EditorRoot,
  Canvas: EditorCanvas,
  Properties: EditorProperties,
  Sidebar: EditorSidebar,
  Toolbar: EditorToolbar,
};

// =============================================
// DEFAULT IMPLEMENTATION
// =============================================

interface DefaultEditorFixedProps {
  config?: Partial<EditorFixedConfig>;
  className?: string;
}

export const DefaultEditorFixed: React.FC<DefaultEditorFixedProps> = ({ config, className }) => {
  return (
    <EditorFixed.Root config={config} className={className}>
      <div className="flex flex-col h-screen">
        {/* Toolbar */}
        <EditorFixed.Toolbar>
          {({ isPreviewing, viewport, actions }) => (
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold">Editor Fixed</h1>
                <div className="text-sm text-muted-foreground">Viewport: {viewport}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={actions.togglePreview}
                  className={`px-3 py-1 rounded text-sm ${
                    isPreviewing ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  {isPreviewing ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={actions.save}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </EditorFixed.Toolbar>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <EditorFixed.Sidebar>
            {({ stages, activeStageId, actions }) => (
              <div className="p-4">
                <h3 className="font-medium mb-3">Stages</h3>
                <div className="space-y-1">
                  {stages.map((stage: FunnelStage) => (
                    <button
                      key={stage.id}
                      onClick={() => actions.selectStage(stage.id)}
                      className={`w-full text-left p-2 rounded text-sm ${
                        stage.id === activeStageId
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {stage.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </EditorFixed.Sidebar>

          {/* Canvas */}
          <EditorFixed.Canvas>
            {({ blocks, selectedBlock, actions, viewport }) => (
              <div className="flex-1 p-4">
                <div
                  className={`mx-auto bg-white shadow-lg rounded-lg ${
                    viewport === 'sm'
                      ? 'max-w-sm'
                      : viewport === 'md'
                        ? 'max-w-md'
                        : viewport === 'lg'
                          ? 'max-w-4xl'
                          : 'max-w-6xl'
                  } min-h-[600px] p-6`}
                >
                  {blocks.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      Drop components here to start building
                    </div>
                  ) : (
                    blocks.map((block: Block) => (
                      <div
                        key={block.id}
                        onClick={() => actions.selectBlock(block.id)}
                        className={`mb-4 p-3 border rounded cursor-pointer ${
                          selectedBlock?.id === block.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Block: {block.type} ({block.id})
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </EditorFixed.Canvas>

          {/* Properties */}
          <EditorFixed.Properties>
            {({ selectedBlock }) => (
              <div className="p-4">
                <h3 className="font-medium mb-3">Properties</h3>
                {selectedBlock ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Block ID</label>
                      <div className="text-sm text-muted-foreground font-mono">
                        {selectedBlock.id}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <div className="text-sm text-muted-foreground">{selectedBlock.type}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select a block to edit properties
                  </div>
                )}
              </div>
            )}
          </EditorFixed.Properties>
        </div>
      </div>
    </EditorFixed.Root>
  );
};
