/**
 * 🎯 FASE 2: StepNavigator Virtualizado
 * 
 * Suporta 1000+ steps sem degradação de performance
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Step {
    key: string;
    title: string;
    isComplete?: boolean;
    hasErrors?: boolean;
}

interface StepNavigatorProps {
    steps: Step[];
    currentStep: string;
    onStepSelect: (stepKey: string) => void;
    className?: string;
}

export function StepNavigator({
    steps,
    currentStep,
    onStepSelect,
    className,
}: StepNavigatorProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Virtualizar lista de steps
    const virtualizer = useVirtualizer({
        count: steps.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50, // Altura estimada de cada step
        overscan: 5, // Renderizar 5 items extras acima/abaixo
    });

    return (
        <div
            ref={parentRef}
            className={cn(
                'h-full overflow-auto bg-gray-50 border-r',
                className
            )}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const step = steps[virtualRow.index];
                    const isActive = step.key === currentStep;

                    return (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <Button
                                onClick={() => onStepSelect(step.key)}
                                variant={isActive ? 'default' : 'ghost'}
                                className={cn(
                                    'w-full justify-start text-left h-full',
                                    isActive && 'bg-blue-500 text-white hover:bg-blue-600',
                                    step.hasErrors && 'border-l-4 border-red-500',
                                    step.isComplete && !step.hasErrors && 'border-l-4 border-green-500'
                                )}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <span className="font-medium">{step.title}</span>
                                    {step.hasErrors && (
                                        <span className="ml-auto text-xs text-red-500">⚠️</span>
                                    )}
                                    {step.isComplete && !step.hasErrors && (
                                        <span className="ml-auto text-xs text-green-500">✓</span>
                                    )}
                                </div>
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
