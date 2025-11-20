/**
 * 🔧 PROPERTIES COLUMN SIMPLE
 * 
 * Versão simplificada e stateless do painel de propriedades.
 * Sem loops, sem useEffect chamando callbacks do pai.
 * 
 * Usado para DEBUG e isolamento de problemas.
 */

import React, { useMemo, ChangeEvent } from 'react';
import type { Block } from '@/types/editor';

type PropertiesColumnSimpleProps = {
    selectedBlock?: Block;
    blocks: Block[] | null;
    onBlockSelect: (id: string | null) => void;
    onBlockUpdate: (id: string, updates: Partial<Block>) => void;
    onClearSelection: () => void;
};

export const PropertiesColumnSimple: React.FC<PropertiesColumnSimpleProps> = ({
    selectedBlock,
    blocks,
    onBlockSelect,
    onBlockUpdate,
    onClearSelection,
}) => {
    const hasSelection = Boolean(selectedBlock);

    const availableBlocks = useMemo(
        () => (blocks ? blocks : []),
        [blocks]
    );

    const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
        if (!selectedBlock) return;
        const newId = e.target.value.trim();
        if (!newId) return;
        onBlockUpdate(selectedBlock.id, { id: newId });
    };

    const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {
        if (!selectedBlock) return;
        onBlockUpdate(selectedBlock.id, { type: e.target.value });
    };

    const handleSelectFromList = (id: string) => {
        onBlockSelect(id);
    };

    return (
        <div
            className="h-full flex flex-col border-l bg-white"
            data-testid="column-properties-simple"
        >
            <div className="px-4 py-3 border-b flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                        Painel de Propriedades (Simples)
                    </h2>
                    <p className="text-xs text-gray-500">
                        Ajuste as propriedades do bloco selecionado
                    </p>
                </div>

                {hasSelection && (
                    <button
                        type="button"
                        onClick={onClearSelection}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Limpar seleção
                    </button>
                )}
            </div>

            {/* Lista rápida de blocos do step */}
            <div className="px-3 py-2 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">
                        Blocos neste step
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {availableBlocks.length} bloco(s)
                    </span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {availableBlocks.map((b) => (
                        <button
                            key={b.id}
                            type="button"
                            onClick={() => handleSelectFromList(b.id)}
                            className={[
                                'px-2 py-0.5 rounded border text-[10px] leading-snug',
                                selectedBlock?.id === b.id
                                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400',
                            ].join(' ')}
                        >
                            {b.type || 'sem tipo'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sem seleção */}
            {!hasSelection && (
                <div className="flex-1 flex items-center justify-center px-4 text-center text-xs text-gray-500">
                    Selecione um bloco no canvas ou na lista acima para editar as
                    propriedades.
                </div>
            )}

            {/* Com seleção */}
            {hasSelection && selectedBlock && (
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-1">Identificação</h3>
                        <label className="block mb-2">
                            <span className="block text-[11px] text-gray-500 mb-0.5">
                                ID do bloco
                            </span>
                            <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-xs"
                                defaultValue={selectedBlock.id}
                                onBlur={handleChangeId}
                            />
                        </label>

                        <label className="block mb-2">
                            <span className="block text-[11px] text-gray-500 mb-0.5">
                                Tipo
                            </span>
                            <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-xs"
                                defaultValue={selectedBlock.type}
                                onBlur={handleChangeType}
                            />
                        </label>
                    </div>

                    <div className="border-t pt-3">
                        <h3 className="font-medium text-gray-800 mb-1">Debug rápido</h3>
                        <pre className="text-[10px] bg-gray-50 border rounded px-2 py-2 overflow-x-auto max-h-48">
                            {JSON.stringify(selectedBlock, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesColumnSimple;
