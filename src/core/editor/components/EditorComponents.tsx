/**
 * 🧩 COMPONENTES AUXILIARES DO EDITOR
 * 
 * Componentes desacoplados para o editor de funis
 */

import React from 'react';
import {
    EditorPagePanelProps,
    EditorPropertiesPanelProps,
    EditorCanvasProps,
    EditorPageType,
    EditorMode,
    EditorSaveStatus,
    EditorValidationResult
} from '../interfaces/EditorInterfaces';

// ============================================================================
// PAINEL DE PÁGINAS
// ============================================================================

export const EditorPagePanel: React.FC<EditorPagePanelProps> = ({
    pages,
    selectedPageId,
    onPageSelect,
    onPageAdd,
    onPageRemove,
    onPageReorder,
    onPageDuplicate,
    canEdit
}) => {
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Pages</h2>
                    {canEdit && (
                        <button
                            onClick={() => onPageAdd('question')}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            title="Add Page"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${page.id === selectedPageId ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                        onClick={() => onPageSelect(page.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-gray-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {page.title}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {page.type} • {page.blocks.length} blocks
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPageDuplicate(page.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                        title="Duplicate"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPageRemove(page.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                                        title="Remove"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Page type selector */}
            {canEdit && (
                <div className="p-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Page Type:
                    </label>
                    <select
                        onChange={(e) => {
                            const type = e.target.value as EditorPageType;
                            if (type) {
                                onPageAdd(type);
                                e.target.value = '';
                            }
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        defaultValue=""
                    >
                        <option value="">Select type...</option>
                        <option value="intro">Intro Page</option>
                        <option value="question">Question Page</option>
                        <option value="form">Form Page</option>
                        <option value="result">Result Page</option>
                        <option value="transition">Transition Page</option>
                        <option value="custom">Custom Page</option>
                    </select>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// PAINEL DE PROPRIEDADES
// ============================================================================

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
    selectedBlock,
    selectedPage,
    onBlockUpdate,
    onPageUpdate,
    onStyleUpdate
}) => {
    if (!selectedPage && !selectedBlock) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <p>Select a page or block to edit properties</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Properties</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {selectedBlock ? `Block: ${selectedBlock.type}` : `Page: ${selectedPage?.type}`}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Block Properties */}
                {selectedBlock && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Block Properties</h3>
                        <div className="space-y-4">
                            {Object.entries(selectedBlock.properties).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {key}
                                    </label>
                                    {typeof value === 'string' ? (
                                        value.length > 50 ? (
                                            <textarea
                                                value={value}
                                                onChange={(e) => onBlockUpdate(selectedBlock.id, {
                                                    ...selectedBlock.properties,
                                                    [key]: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                rows={3}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => onBlockUpdate(selectedBlock.id, {
                                                    ...selectedBlock.properties,
                                                    [key]: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        )
                                    ) : typeof value === 'number' ? (
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => onBlockUpdate(selectedBlock.id, {
                                                ...selectedBlock.properties,
                                                [key]: Number(e.target.value)
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm"
                                        />
                                    ) : typeof value === 'boolean' ? (
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => onBlockUpdate(selectedBlock.id, {
                                                    ...selectedBlock.properties,
                                                    [key]: e.target.checked
                                                })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-600">Enabled</span>
                                        </label>
                                    ) : (
                                        <textarea
                                            value={JSON.stringify(value, null, 2)}
                                            onChange={(e) => {
                                                try {
                                                    const parsed = JSON.parse(e.target.value);
                                                    onBlockUpdate(selectedBlock.id, {
                                                        ...selectedBlock.properties,
                                                        [key]: parsed
                                                    });
                                                } catch {
                                                    // Ignore invalid JSON
                                                }
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                                            rows={4}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page Properties */}
                {selectedPage && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Page Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={selectedPage.title}
                                    onChange={(e) => onPageUpdate(selectedPage.id, {
                                        ...selectedPage.settings,
                                        title: e.target.value
                                    } as any)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={selectedPage.type}
                                    onChange={(e) => onPageUpdate(selectedPage.id, {
                                        ...selectedPage.settings,
                                        type: e.target.value
                                    } as any)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                >
                                    <option value="intro">Intro</option>
                                    <option value="question">Question</option>
                                    <option value="form">Form</option>
                                    <option value="result">Result</option>
                                    <option value="transition">Transition</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            {selectedPage.settings?.showTitle !== undefined && (
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedPage.settings.showTitle}
                                        onChange={(e) => onPageUpdate(selectedPage.id, {
                                            ...selectedPage.settings,
                                            showTitle: e.target.checked
                                        })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Show Title</span>
                                </label>
                            )}
                        </div>
                    </div>
                )}

                {/* Styles */}
                {(selectedBlock || selectedPage) && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Styles</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Background Color
                                </label>
                                <input
                                    type="color"
                                    onChange={(e) => {
                                        const targetId = selectedBlock?.id || selectedPage?.id;
                                        if (targetId) {
                                            onStyleUpdate(targetId, { backgroundColor: e.target.value });
                                        }
                                    }}
                                    className="w-full h-10 border border-gray-300 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Padding
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 1rem, 16px"
                                    onChange={(e) => {
                                        const targetId = selectedBlock?.id || selectedPage?.id;
                                        if (targetId) {
                                            onStyleUpdate(targetId, { padding: e.target.value });
                                        }
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Text Align
                                </label>
                                <select
                                    onChange={(e) => {
                                        const targetId = selectedBlock?.id || selectedPage?.id;
                                        if (targetId) {
                                            onStyleUpdate(targetId, { textAlign: e.target.value });
                                        }
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    defaultValue=""
                                >
                                    <option value="">Default</option>
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                    <option value="justify">Justify</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// CANVAS DE EDIÇÃO
// ============================================================================

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
    page,
    theme,
    mode,
    selectedBlockId,
    onBlockSelect,
    onBlockUpdate,
    onBlockAdd,
    onBlockRemove,
    onBlockReorder
}) => {
    const isEditMode = mode === 'edit';

    return (
        <div className="h-full bg-gray-100 overflow-y-auto">
            <div className="max-w-4xl mx-auto py-8">
                {/* Page Header */}
                <div className="mb-6 px-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Type: {page.type}</span>
                        <span>Order: {page.order}</span>
                        <span>Blocks: {page.blocks.length}</span>
                    </div>
                </div>

                {/* Blocks */}
                <div className="space-y-4 px-4">
                    {page.blocks.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-500 mb-4">No blocks in this page</p>
                            {isEditMode && (
                                <button
                                    onClick={() => onBlockAdd('hero-section', 0)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Add First Block
                                </button>
                            )}
                        </div>
                    ) : (
                        page.blocks.map((block, index) => (
                            <div
                                key={block.id}
                                className={`relative border rounded-lg p-4 bg-white transition-all ${block.id === selectedBlockId
                                    ? 'border-blue-500 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                style={{
                                    backgroundColor: theme.backgroundColor,
                                    color: theme.textColor,
                                    fontFamily: theme.fontFamily,
                                    ...block.styles
                                }}
                                onClick={() => isEditMode && onBlockSelect(block.id)}
                            >
                                {/* Block Type Badge */}
                                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    {block.type}
                                </div>

                                {/* Block Content Preview */}
                                <div className="pr-16">
                                    {block.type === 'hero-section' && (
                                        <div>
                                            <h2 className="text-xl font-bold mb-2">
                                                {block.properties.title || 'Hero Title'}
                                            </h2>
                                            <p className="text-gray-600 mb-4">
                                                {block.properties.content || 'Hero content goes here...'}
                                            </p>
                                            {block.properties.buttonText && (
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                                    {block.properties.buttonText}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {block.type === 'simple-question' && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">
                                                {block.properties.question || 'Question text here...'}
                                            </h3>
                                            <div className="space-y-2">
                                                {(block.properties.options || ['Option 1', 'Option 2']).map((option: string, idx: number) => (
                                                    <label key={idx} className="flex items-center">
                                                        <input type="radio" name={`question-${block.id}`} className="mr-2" />
                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'text-input' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {block.properties.label || 'Input Label'}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={block.properties.placeholder || 'Enter text...'}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                readOnly
                                            />
                                        </div>
                                    )}

                                    {/* Fallback for other block types */}
                                    {!['hero-section', 'simple-question', 'text-input'].includes(block.type) && (
                                        <div>
                                            <h3 className="font-semibold mb-2">{block.type} Block</h3>
                                            <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                                                {JSON.stringify(block.properties, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                {/* Block Actions */}
                                {isEditMode && block.id === selectedBlockId && (
                                    <div className="absolute top-2 left-2 flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBlockAdd(block.type, index);
                                            }}
                                            className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            title="Add Block Above"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBlockRemove(block.id);
                                            }}
                                            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            title="Remove Block"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Selection Indicator */}
                                {block.id === selectedBlockId && (
                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Add Block at End */}
                    {isEditMode && page.blocks.length > 0 && (
                        <div className="text-center">
                            <button
                                onClick={() => onBlockAdd('hero-section', page.blocks.length)}
                                className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Block
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// TOOLBAR DO EDITOR
// ============================================================================

interface EditorToolbarProps {
    mode: EditorMode;
    onModeChange: (mode: EditorMode) => void;
    saveStatus: EditorSaveStatus;
    onSave: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    validation: EditorValidationResult;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    mode,
    onModeChange,
    saveStatus,
    onSave,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    validation
}) => {
    return (
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between canvas-toolbar">
            {/* Left Side - Mode & Actions */}
            <div className="flex items-center gap-4">
                {/* Mode Selector */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {(['edit', 'preview', 'readonly'] as EditorMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => onModeChange(m)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === m
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Undo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Redo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Side - Save & Validation */}
            <div className="flex items-center gap-4">
                {/* Validation Status */}
                {!validation.valid && (
                    <div className="flex items-center gap-2 text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm">{validation.errors.length} errors</span>
                    </div>
                )}

                {/* Save Status */}
                <div className="flex items-center gap-2">
                    {saveStatus.saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">Saving...</span>
                        </>
                    ) : saveStatus.saved ? (
                        <>
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                {saveStatus.lastSaved ? `Saved ${new Date(saveStatus.lastSaved).toLocaleTimeString()}` : 'Saved'}
                            </span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm text-gray-600">Unsaved changes</span>
                        </>
                    )}
                </div>

                {/* Manual Save Button */}
                <button
                    onClick={onSave}
                    disabled={saveStatus.saving || (!saveStatus.hasChanges && saveStatus.saved)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>
        </div>
    );
};
