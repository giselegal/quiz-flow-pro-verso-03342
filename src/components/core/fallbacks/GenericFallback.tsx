import React from 'react';
import type { Block } from '@/types/editor';

export const GenericFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded">
        <div className="text-sm text-gray-700 font-medium mb-1">Componente não encontrado</div>
        <div className="text-xs text-gray-600">Tipo: {block.type}</div>
        <div className="text-xs text-gray-500">ID: {block.id}</div>
    </div>
);

export default GenericFallback;
