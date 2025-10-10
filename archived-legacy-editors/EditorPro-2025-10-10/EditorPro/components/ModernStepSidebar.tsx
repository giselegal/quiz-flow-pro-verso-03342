// @ts-nocheck
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
    totalSteps?: number; // ✅ DINÂMICO - calculado pelos componentes pai
    activeStepId?: string;
    onStepClick?: (stepId: string) => void;
    onStepAdd?: () => void;
    onStepDelete?: (stepId: string) => void;
    onStepRename?: (stepId: string, newName: string) => void;
    onStepDuplicate?: (stepId: string) => void;
    className?: string;
    funnelId?: string; // Para debug
}

export const ModernStepSidebar: React.FC<ModernStepSidebarProps> = ({
    totalSteps = 1, // ✅ DINÂMICO - mínimo 1 step
    activeStepId,
    onStepClick,
    onStepAdd,
    onStepDelete,
    onStepRename,
    onStepDuplicate,
    className = '',
    funnelId,
}) => {
    const [editingStepId, setEditingStepId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    // ✅ DINÂMICO: Gerar steps baseado no totalSteps
    const steps: Step[] = Array.from({ length: totalSteps }, (_, i) => ({
        id: `${i + 1}`,
        name: `Etapa ${i + 1}`,
        isActive: activeStepId === `${i + 1}`,
        order: i + 1
    }));

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

                        <div className="grid md:p-1 relative">
                            <Button
                                variant="ghost"
                                onClick={onStepAdd}
                                className="hover:bg-primary hover:text-foreground h-10 px-4 py-2 text-zinc-100"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Etapa
                            </Button>
                            {funnelId && (
                                <div className="text-xs text-zinc-500 mt-1 px-4">
                                    {totalSteps} steps ({funnelId})
                                </div>
                            )}
                        </div>

                        <div className="py-10"></div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

// ❌ REMOVIDO: Steps hardcoded - agora são gerados dinamicamente
// Default steps removidos - ModernStepSidebar agora usa totalSteps para gerar steps dinamicamente

export default ModernStepSidebar;