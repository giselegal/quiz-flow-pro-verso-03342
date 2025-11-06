import React from 'react';
import type { Block } from '@/types/editor';

const QuestionFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-amber-200 bg-amber-50 rounded">
        <div className="text-sm text-amber-900 font-medium mb-1">Pergunta: componente ausente</div>
        <div className="text-xs text-amber-800">{block.type}</div>
        <div className="text-xs text-amber-700/80">Verifique tipos question-* ou options-* no registry.</div>
    </div>
);

export default QuestionFallback;
