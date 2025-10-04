import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { AtomicComponent } from '../../atomic-components/types';

interface SimpleAtomicWrapperProps {
    children: React.ReactNode;
    component: AtomicComponent;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const SimpleAtomicWrapper: React.FC<SimpleAtomicWrapperProps> = ({
    children,
    component,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    return (
        <div className="relative group">
            {/* Drag handle */}
            {isEditable && (
                <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center cursor-grab">
                        <GripVertical className="w-2 h-2 text-gray-600" />
                    </div>
                </div>
            )}

            {/* Insert before */}
            {isEditable && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 border-dashed border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => onInsertBefore('text')}
                        title="Inserir componente antes"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Main content */}
            <div className={cn(
                "relative rounded border transition-all",
                isEditable && "hover:border-blue-300 hover:shadow-sm"
            )}>
                {children}
            </div>

            {/* Controls */}
            {isEditable && (
                <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white border-red-500"
                        onClick={onDelete}
                        title="Deletar componente"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Insert after */}
            {isEditable && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 border-dashed border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => onInsertAfter('text')}
                        title="Inserir componente depois"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            )}
        </div>
    );
};