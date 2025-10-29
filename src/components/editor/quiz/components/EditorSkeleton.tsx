/**
 * 🎯 EDITOR LOADING SKELETON
 * 
 * Loading states para o editor enquanto carrega template
 * 
 * @version 1.0.0
 */

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const EditorSkeleton: React.FC = () => {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Coluna 1: Steps List */}
            <div className="w-64 border-r bg-white p-4 space-y-2">
                <Skeleton className="h-8 w-full mb-4" />
                {Array.from({ length: 21 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
            
            {/* Coluna 2: Component Library */}
            <div className="w-80 border-r bg-white p-4 space-y-2">
                <Skeleton className="h-8 w-full mb-4" />
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
            
            {/* Coluna 3: Canvas */}
            <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            </div>
            
            {/* Coluna 4: Properties Panel */}
            <div className="w-96 border-l bg-white p-4 space-y-4">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
};

export const EditorErrorFallback: React.FC<{ error: Error; retry?: () => void }> = ({ error, retry }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center space-y-4">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-slate-800">
                    Erro ao Carregar Editor
                </h2>
                <p className="text-slate-600">
                    {error.message || 'Ocorreu um erro inesperado'}
                </p>
                {retry && (
                    <button
                        onClick={retry}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                )}
                <p className="text-sm text-slate-400 mt-4">
                    Se o problema persistir, recarregue a página
                </p>
            </div>
        </div>
    );
};
