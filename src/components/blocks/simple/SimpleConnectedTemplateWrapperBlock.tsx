import React from 'react';

interface BlockComponentProps {
    block: {
        type: string;
        content: any;
        properties: any;
    };
    isSelected: boolean;
    editMode: boolean;
    previewMode?: boolean;
    onSelect: () => void;
}

/**
 * 🔗 SIMPLE CONNECTED TEMPLATE WRAPPER BLOCK
 * 
 * Componente wrapper para templates conectados
 * Usado quando há referências externas ou templates aninhados
 */
const SimpleConnectedTemplateWrapperBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    editMode,
    onSelect
}) => {
    const content = block.content || {};
    const properties = block.properties || {};

    return (
        <div
            onClick={onSelect}
            className={`
                p-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-slate-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Template wrapper info */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <h3 className="text-lg font-semibold text-slate-800">
                    Template Conectado
                </h3>
            </div>

            {/* Content preview */}
            {content.templateId && (
                <div className="bg-white/60 rounded p-3 mb-3">
                    <span className="text-sm text-slate-600">Template ID: </span>
                    <code className="text-sm font-mono bg-slate-200 px-2 py-1 rounded">
                        {content.templateId}
                    </code>
                </div>
            )}

            {/* Template status */}
            <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-slate-600">
                    Template carregado dinamicamente
                </span>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do template
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleConnectedTemplateWrapperBlock;