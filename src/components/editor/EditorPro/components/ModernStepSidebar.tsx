import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    GripVertical,
    MoreVertical,
    Plus,
    ChevronRight
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Step {
    id: string;
    name: string;
    isActive?: boolean;
    order: number;
}

interface ModernStepSidebarProps {
    steps?: Step[];
    activeStepId?: string;
    onStepClick?: (stepId: string) => void;
    onStepAdd?: () => void;
    onStepDelete?: (stepId: string) => void;
    onStepRename?: (stepId: string, newName: string) => void;
    onStepDuplicate?: (stepId: string) => void;
    className?: string;
}

export const ModernStepSidebar: React.FC<ModernStepSidebarProps> = ({
    steps = defaultSteps,
    activeStepId,
    onStepClick,
    onStepAdd,
    onStepDelete,
    onStepRename,
    onStepDuplicate,
    className = '',
}) => {
    const [editingStepId, setEditingStepId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleStepClick = (step: Step) => {
        if (editingStepId === step.id) return;
        onStepClick?.(step.id);
    };

    const handleStartEdit = (step: Step, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingStepId(step.id);
        setEditingName(step.name);
    };

    const handleSaveEdit = () => {
        if (editingStepId && editingName.trim()) {
            onStepRename?.(editingStepId, editingName.trim());
        }
        setEditingStepId(null);
        setEditingName('');
    };

    const handleCancelEdit = () => {
        setEditingStepId(null);
        setEditingName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <div className={`w-full min-h-[3rem] relative border-b overflow-auto md:max-w-[13rem] border-r ${className}`}>
            <ScrollArea className="relative overflow-hidden flex md:grid h-full">
                <div className="h-full w-full rounded-[inherit]">
                    <div>
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                role="button"
                                tabIndex={0}
                                aria-disabled="false"
                                className="cursor-pointer"
                                onClick={() => handleStepClick(step)}
                            >
                                <div className="group border-r md:border-y md:border-r-0 min-w-[10rem] -mt-[1px] flex pl-2 relative items-center">
                                    {/* Active Indicator */}
                                    <div
                                        className={`absolute bottom-0 z-[5] left-0 w-full md:w-0 md:h-full border md:border-2 ${activeStepId === step.id || step.isActive
                                                ? 'border-blue-600'
                                                : 'border-transparent'
                                            }`}
                                    />

                                    {/* Drag Handle */}
                                    <span className="cursor-grab hover:cursor-grabbing">
                                        <GripVertical className="w-4 h-4 text-zinc-100" />
                                    </span>

                                    {/* Step Content */}
                                    <div className="w-full relative z-[5]">
                                        {editingStepId === step.id ? (
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onBlur={handleSaveEdit}
                                                onKeyDown={handleKeyDown}
                                                className="h-[3rem] bg-transparent border-none text-zinc-100 px-3"
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                className="block h-[3rem] w-full cursor-pointer bg-transparent p-3 text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                                                onDoubleClick={(e) => handleStartEdit(step, e)}
                                            >
                                                {step.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Options Menu */}
                                    {editingStepId !== step.id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="mr-2 w-4 h-4 cursor-pointer text-zinc-100 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={(e) => handleStartEdit(step, e)}>
                                                    Renomear
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onStepDuplicate?.(step.id)}>
                                                    Duplicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onStepDelete?.(step.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Step Button */}
                        <div className="grid md:p-1 relative">
                            <Button
                                variant="ghost"
                                onClick={onStepAdd}
                                className="hover:bg-primary hover:text-foreground h-10 px-4 py-2 text-zinc-100"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Etapa
                            </Button>
                        </div>

                        <div className="py-10"></div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

// Default steps for demonstration
const defaultSteps: Step[] = [
    { id: '1', name: 'Etapa 1', isActive: true, order: 1 },
    { id: '2', name: 'Etapa 2', order: 2 },
    { id: '3', name: 'Etapa 3', order: 3 },
    { id: '4', name: 'Etapa 4', order: 4 },
    { id: '5', name: 'Etapa 5', order: 5 },
    { id: '6', name: 'Etapa 6', order: 6 },
    { id: '7', name: 'Etapa 7', order: 7 },
    { id: '8', name: 'Etapa 8', order: 8 },
    { id: '9', name: 'Etapa 9', order: 9 },
    { id: '10', name: 'Etapa 10', order: 10 },
    { id: '11', name: 'Etapa 11', order: 11 },
    { id: '12', name: 'Etapa 12', order: 12 },
    { id: '13', name: 'Etapa 13', order: 13 },
    { id: '14', name: 'Etapa 14', order: 14 },
];

export default ModernStepSidebar;