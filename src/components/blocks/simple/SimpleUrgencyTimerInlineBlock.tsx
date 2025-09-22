import React, { useState, useEffect } from 'react';

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
 * ⏰ SIMPLE URGENCY TIMER INLINE BLOCK
 * 
 * Timer de urgência com countdown
 * Usado para criar senso de urgência nas ofertas
 */
const SimpleUrgencyTimerInlineBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    editMode,
    onSelect
}) => {
    const content = block.content || {};
    const properties = block.properties || {};

    // Estado do timer (simples demo, em produção seria configurável)
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 15,
        seconds: 30
    });

    // Timer effect
    useEffect(() => {
        if (!editMode) {
            const interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev.seconds > 0) {
                        return { ...prev, seconds: prev.seconds - 1 };
                    } else if (prev.minutes > 0) {
                        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                    } else if (prev.hours > 0) {
                        return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                    }
                    return prev; // Timer parado
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [editMode]);

    return (
        <div
            onClick={onSelect}
            className={`
                p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-red-300' : ''}
                transition-all duration-200 text-center
            `}
        >
            {/* Urgency title */}
            {content.title && (
                <h3 className="text-xl md:text-2xl font-bold text-red-800 mb-2">
                    {content.title}
                </h3>
            )}

            {/* Countdown timer */}
            <div className="flex justify-center gap-4 my-6">
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg min-w-[70px]">
                    <div className="text-2xl font-bold">
                        {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider">
                        Horas
                    </div>
                </div>
                <div className="flex items-center text-red-600 text-2xl font-bold">
                    :
                </div>
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg min-w-[70px]">
                    <div className="text-2xl font-bold">
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider">
                        Min
                    </div>
                </div>
                <div className="flex items-center text-red-600 text-2xl font-bold">
                    :
                </div>
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg min-w-[70px]">
                    <div className="text-2xl font-bold">
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider">
                        Seg
                    </div>
                </div>
            </div>

            {/* Urgency message */}
            {content.urgencyMessage && (
                <p className="text-lg font-semibold text-red-700 mb-4">
                    {content.urgencyMessage}
                </p>
            )}

            {/* Warning icon and additional message */}
            <div className="flex items-center justify-center gap-2 text-red-600">
                <span className="text-xl animate-pulse">⚠️</span>
                <span className="font-medium">
                    Tempo limitado!
                </span>
            </div>

            {/* Edit mode indicator */}
            {editMode && (
                <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                    ⏸️ Timer pausado no modo de edição
                </div>
            )}

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do timer
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties, timeLeft }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleUrgencyTimerInlineBlock;