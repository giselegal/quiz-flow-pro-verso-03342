import { EditorProvider } from '@/context/EditorContext';
import type { Block, FunnelStage } from '@/types/editor';
import { DefaultEditorFixed, EditorFixed, useEditorFixed } from './EditorFixed';

/**
 * 🎯 EXEMPLOS DE USO: EditorFixed com Compound Components
 *
 * Demonstra diferentes formas de usar a nova arquitetura:
 * 1. Uso simples (DefaultEditorFixed)
 * 2. Uso customizado (Compound Components)
 * 3. Uso avançado (Custom implementations)
 */

// =============================================
// 1. USO SIMPLES - Default Implementation
// =============================================

const SimpleEditorExample: React.FC = () => {
  return (
    <EditorProvider>
      <DefaultEditorFixed
        config={{
          theme: 'light',
          viewport: 'lg',
          features: {
            toolbar: true,
            properties: true,
            dragDrop: true,
            funnel: true,
          },
        }}
      />
    </EditorProvider>
  );
};

// =============================================
// 2. USO CUSTOMIZADO - Compound Components
// =============================================

const CustomEditorExample: React.FC = () => {
  return (
    <EditorProvider>
      <EditorFixed.Root
        config={{
          theme: 'dark',
          layout: 'three-column',
          viewport: 'xl',
        }}
      >
        <div className="flex flex-col h-screen">
          {/* Custom Toolbar */}
          <EditorFixed.Toolbar>
            {({ isPreviewing, actions }) => (
              <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
                <h1 className="text-xl font-bold">My Custom Editor</h1>
                <div className="flex gap-2">
                  <button
                    onClick={actions.togglePreview}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {isPreviewing ? '✏️ Edit' : '👁️ Preview'}
                  </button>
                  <button
                    onClick={actions.save}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            )}
          </EditorFixed.Toolbar>

          <div className="flex flex-1">
            {/* Custom Sidebar with Search */}
            <EditorFixed.Sidebar className="bg-slate-100">
              {({ stages, activeStageId, actions }) => (
                <div className="p-4">
                  <input
                    type="search"
                    placeholder="Search stages..."
                    className="w-full p-2 border rounded mb-4"
                  />
                  <div className="space-y-2">
                    {stages.map((stage: FunnelStage) => (
                      <div
                        key={stage.id}
                        onClick={() => actions.selectStage(stage.id)}
                        className={`p-3 rounded cursor-pointer ${
                          stage.id === activeStageId
                            ? 'bg-blue-600 text-white'
                            : 'bg-white hover:bg-blue-50'
                        }`}
                      >
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm opacity-75">Stage {stage.order}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </EditorFixed.Sidebar>

            {/* Canvas with Custom Styling */}
            <EditorFixed.Canvas className="bg-gradient-to-b from-blue-50 to-white">
              {({ blocks, selectedBlock, actions, viewport }) => (
                <div className="flex-1 p-8">
                  <div className="text-center mb-4 text-gray-600">
                    Viewport: {viewport} | Blocks: {blocks.length}
                  </div>

                  <div
                    className={`mx-auto bg-white rounded-lg shadow-2xl p-6 ${
                      viewport === 'sm' ? 'max-w-sm' : viewport === 'md' ? 'max-w-2xl' : 'max-w-4xl'
                    } min-h-[700px]`}
                  >
                    {/* Drop Zone */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex items-center justify-center mb-6">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📱</div>
                        <div>Drag blocks here</div>
                      </div>
                    </div>

                    {/* Blocks */}
                    <div className="space-y-4">
                      {blocks.map((block: Block) => (
                        <div
                          key={block.id}
                          onClick={() => actions.selectBlock(block.id)}
                          className={`group p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedBlock?.id === block.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{block.type}</div>
                              <div className="text-sm text-gray-500">{block.id}</div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  actions.deleteBlock(block.id);
                                }}
                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </EditorFixed.Canvas>

            {/* Advanced Properties Panel */}
            <EditorFixed.Properties className="bg-slate-50">
              {({ selectedBlock }) => (
                <div className="p-4">
                  <div className="border-b pb-3 mb-4">
                    <h3 className="font-semibold text-lg">Properties</h3>
                  </div>

                  {selectedBlock ? (
                    <div className="space-y-4">
                      {/* Block Info */}
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium mb-2">Block Info</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">ID:</span>
                            <code className="ml-2 bg-gray-100 px-1 rounded">
                              {selectedBlock.id}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-2">{selectedBlock.type}</span>
                          </div>
                          <div>
                            <span className="font-medium">Order:</span>
                            <span className="ml-2">{selectedBlock.order}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Properties */}
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium mb-2">Content</h4>
                        <div className="space-y-2">
                          <label className="block">
                            <span className="text-sm font-medium">Title</span>
                            <input
                              type="text"
                              className="w-full mt-1 p-2 border rounded"
                              placeholder="Enter title..."
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium">Description</span>
                            <textarea
                              className="w-full mt-1 p-2 border rounded h-20"
                              placeholder="Enter description..."
                            />
                          </label>
                        </div>
                      </div>

                      {/* Style Properties */}
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium mb-2">Styling</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="block">
                            <span className="text-xs">Padding</span>
                            <input type="range" className="w-full" />
                          </label>
                          <label className="block">
                            <span className="text-xs">Margin</span>
                            <input type="range" className="w-full" />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">🎨</div>
                      <div>Select a block to edit properties</div>
                    </div>
                  )}
                </div>
              )}
            </EditorFixed.Properties>
          </div>
        </div>
      </EditorFixed.Root>
    </EditorProvider>
  );
};

// =============================================
// 3. USO AVANÇADO - Custom Hook Integration
// =============================================

const CustomToolbar: React.FC = () => {
  const { config, updateConfig } = useEditorFixed();

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <select
        value={config.viewport}
        onChange={e => updateConfig({ viewport: e.target.value as any })}
        className="p-1 border rounded"
      >
        <option value="sm">Mobile</option>
        <option value="md">Tablet</option>
        <option value="lg">Desktop</option>
        <option value="xl">Large</option>
      </select>

      <select
        value={config.theme}
        onChange={e => updateConfig({ theme: e.target.value as any })}
        className="p-1 border rounded"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
};

const AdvancedEditorExample: React.FC = () => {
  return (
    <EditorProvider>
      <EditorFixed.Root config={{ theme: 'light', viewport: 'lg' }}>
        <div className="h-screen flex flex-col">
          <CustomToolbar />

          <div className="flex flex-1">
            <EditorFixed.Sidebar />
            <EditorFixed.Canvas />
            <EditorFixed.Properties />
          </div>
        </div>
      </EditorFixed.Root>
    </EditorProvider>
  );
};

// =============================================
// EXPORTS
// =============================================

export { AdvancedEditorExample, CustomEditorExample, SimpleEditorExample };
