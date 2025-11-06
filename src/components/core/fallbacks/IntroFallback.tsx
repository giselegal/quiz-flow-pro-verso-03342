import React from 'react';
import type { Block } from '@/types/editor';

const IntroFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50 rounded">
        <div className="text-sm text-blue-900 font-medium mb-1">Intro: componente ausente</div>
        <div className="text-xs text-blue-800">{block.type}</div>
        <div className="text-xs text-blue-700/80">Use blocos intro-* disponíveis ou ajuste o tipo.</div>
    </div>
);

export default IntroFallback;
