import React from 'react';
import type { Block } from '@/types/editor';

const ResultFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-green-200 bg-green-50 rounded">
        <div className="text-sm text-green-900 font-medium mb-1">Resultado: componente ausente</div>
        <div className="text-xs text-green-800">{block.type}</div>
        <div className="text-xs text-green-700/80">Ajuste para tipos result-* compatíveis.</div>
    </div>
);

export default ResultFallback;
