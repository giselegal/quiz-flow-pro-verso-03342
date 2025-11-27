/**
 * 🎨 Editor Skeleton Loaders
 * 
 * Componentes de skeleton loading otimizados para cada coluna do editor
 * Melhoram percepção de performance e UX durante carregamento inicial
 */

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 COLUMN 01: Steps Navigator Skeleton
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const StepNavigatorSkeleton: React.FC = () => (
    <div className="h-full border-r bg-white overflow-y-auto flex flex-col p-2 space-y-2">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        {/* Step items skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-3 w-20" />
            </div>
        ))}

        {/* Footer button skeleton */}
        <div className="p-2 border-t mt-auto">
            <Skeleton className="h-9 w-full" />
        </div>
    </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📚 COLUMN 02: Component Library Skeleton
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ComponentLibrarySkeleton: React.FC = () => (
    <div className="h-full border-r bg-white overflow-y-auto p-4 space-y-4">
        {/* Search skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />

        {/* Stats skeleton */}
        <div className="flex gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
        </div>

        {/* Category + components skeleton */}
        {[1, 2, 3].map((cat) => (
            <div key={cat} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-4" />
                </div>

                {/* Component cards */}
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((comp) => (
                        <div key={comp} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                            </div>
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-2 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 COLUMN 03: Canvas Skeleton
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CanvasSkeleton: React.FC = () => (
    <div className="h-full bg-gray-50 overflow-y-auto p-8">
        {/* Viewport container skeleton */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Header block */}
            <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                    </div>
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Content blocks */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <div className="flex gap-1">
                            <Skeleton className="h-6 w-6 rounded" />
                            <Skeleton className="h-6 w-6 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-1/2" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-4/6" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚙️ COLUMN 04: Properties Panel Skeleton
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PropertiesPanelSkeleton: React.FC = () => (
    <div className="h-full bg-white border-l overflow-y-auto p-4 space-y-6">
        {/* Header with tabs */}
        <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pb-4 border-b">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
        </div>

        {/* Form sections */}
        {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-3">
                {/* Section header */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-4" />
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏗️ FULL EDITOR Skeleton (all columns)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EditorSkeleton: React.FC<{
    showSteps?: boolean;
    showLibrary?: boolean;
    showCanvas?: boolean;
    showProperties?: boolean;
}> = ({
    showSteps = true,
    showLibrary = true,
    showCanvas = true,
    showProperties = true,
}) => (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header skeleton */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </header>

            {/* Columns skeleton */}
            <div className="flex flex-1 overflow-hidden">
                {showSteps && (
                    <div className="w-64 border-r">
                        <StepNavigatorSkeleton />
                    </div>
                )}

                {showLibrary && (
                    <div className="w-80 border-r">
                        <ComponentLibrarySkeleton />
                    </div>
                )}

                {showCanvas && (
                    <div className="flex-1">
                        <CanvasSkeleton />
                    </div>
                )}

                {showProperties && (
                    <div className="w-96">
                        <PropertiesPanelSkeleton />
                    </div>
                )}
            </div>
        </div>
    );

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 COMPACT LOADING (minimal skeleton)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CompactEditorSkeleton: React.FC = () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
                <div className="relative">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
            </div>
        </div>
    </div>
);

export default {
    StepNavigatorSkeleton,
    ComponentLibrarySkeleton,
    CanvasSkeleton,
    PropertiesPanelSkeleton,
    EditorSkeleton,
    CompactEditorSkeleton,
};
