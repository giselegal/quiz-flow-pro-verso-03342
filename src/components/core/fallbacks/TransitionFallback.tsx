import React from 'react';
import type { Block } from '@/types/editor';

const TransitionFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-purple-200 bg-purple-50 rounded">
        <div className="text-sm text-purple-900 font-medium mb-1">Transição: componente ausente</div>
        <div className="text-xs text-purple-800">{block.type}</div>
        <div className="text-xs text-purple-700/80">Considere usar transition-* ou loaders disponíveis.</div>
    </div>
);

export default TransitionFallback;
