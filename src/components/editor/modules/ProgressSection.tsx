import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { BaseModuleProps, withCraftjsComponent } from './types';

export interface ProgressSectionProps extends BaseModuleProps {
    percentage?: number;
    label?: string;
    showLabel?: boolean;
    showPercentage?: boolean;
    [key: string]: any;
}

const ProgressSectionComponent: React.FC<ProgressSectionProps> = ({
    percentage = 50,
    label = 'Progresso',
    showLabel = true,
    className = '',
}) => {
    const { connectors: { connect } } = useEditor();

    return (
        <div ref={(ref) => { if (ref) connect(ref as HTMLElement); }} className={cn('progress-section p-4', className)}>
            {showLabel && <label className="text-sm font-medium mb-2 block">{label}</label>}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                />
            </div>
        </div>
    );
};

export const ProgressSection = withCraftjsComponent(ProgressSectionComponent);
export default ProgressSection;