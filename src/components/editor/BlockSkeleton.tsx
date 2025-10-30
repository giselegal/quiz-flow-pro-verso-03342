/**
 * 🎯 FASE 3.1: BLOCK SKELETON
 * 
 * Placeholder exibido enquanto blocos lazy são carregados
 * Melhora perceived performance e evita layout shifts
 */

import React from 'react';

interface BlockSkeletonProps {
    height?: number | string;
    variant?: 'text' | 'image' | 'button' | 'card' | 'default';
    className?: string;
}

export const BlockSkeleton: React.FC<BlockSkeletonProps> = ({
    height = '60px',
    variant = 'default',
    className = '',
}) => {
    const getSkeletonContent = () => {
        switch (variant) {
            case 'text':
                return (
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </div>
                );

            case 'image':
                return (
                    <div className="bg-gray-200 rounded animate-pulse w-full h-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                );

            case 'button':
                return (
                    <div className="bg-gray-200 rounded-lg animate-pulse h-12 w-32" />
                );

            case 'card':
                return (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="h-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    </div>
                );

            default:
                return (
                    <div className="bg-gray-200 rounded animate-pulse w-full h-full" />
                );
        }
    };

    return (
        <div
            className={`block-skeleton ${className}`}
            style={{
                minHeight: typeof height === 'number' ? `${height}px` : height,
            }}
            role="status"
            aria-label="Loading block..."
        >
            {getSkeletonContent()}
        </div>
    );
};

/**
 * Skeleton específico para steps do quiz
 */
export const StepSkeleton: React.FC<{ blockCount?: number }> = ({ blockCount = 3 }) => {
    return (
        <div className="step-skeleton space-y-4 p-4">
            {Array.from({ length: blockCount }).map((_, index) => (
                <BlockSkeleton
                    key={index}
                    height={80}
                    variant={index === 0 ? 'text' : 'default'}
                />
            ))}
        </div>
    );
};

/**
 * Skeleton mínimo (baixo overhead para re-renders frequentes)
 */
export const MinimalSkeleton: React.FC = () => (
    <div className="h-12 bg-gray-100 rounded animate-pulse" />
);

export default BlockSkeleton;
