import React from 'react';
import type { Block } from '@/types/editor';

const OfferFallback: React.FC<{ block: Block }> = ({ block }) => (
    <div className="p-4 border-2 border-dashed border-rose-200 bg-rose-50 rounded">
        <div className="text-sm text-rose-900 font-medium mb-1">Oferta: componente ausente</div>
        <div className="text-xs text-rose-800">{block.type}</div>
        <div className="text-xs text-rose-700/80">Use tipos offer-* (cta, pricing, testimonials, etc.).</div>
    </div>
);

export default OfferFallback;
