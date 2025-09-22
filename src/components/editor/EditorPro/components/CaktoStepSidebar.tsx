import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Grip,
    EllipsisVertical,
    Plus,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CaktoStepSidebarProps {
    currentStep: number;
    totalSteps?: number;
    stepHasBlocks?: Record<number, boolean>;
    stepValidation?: Record<number, boolean>;
    stepNames?: Record<number, string>;
    onSelectStep: (step: number) => void;
    onRenameStep?: (step: number, name: string) => void;
    onDeleteStep?: (step: number) => void;
    onDuplicateStep?: (step: number) => void;
    onAddStep?: () => void;
    onReorderSteps?: (fromIndex: number, toIndex: number) => void;
    className?: string;
}

interface StepItemProps {
    step: number;
    name: string;
    isActive: boolean;
    hasBlocks: boolean;
    isValid: boolean;
    onSelect: (step: number) => void;
    onRename?: (step: number, name: string) => void;
    onDelete?: (step: number) => void;
    onDuplicate?: (step: number) => void;
    onMoveUp?: (step: number) => void;
    onMoveDown?: (step: number) => void;
}

const StepItem: React.FC<StepItemProps> = ({
    step,
    name,
    isActive,
    hasBlocks,
    isValid,
    onSelect,
    onRename,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);

    const handleSaveName = () => {
        if (editName.trim() && editName !== name && onRename) {
            onRename(step, editName.trim());
        }
        setIsEditing(false);
        setEditName(name);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditName(name);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveName();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-disabled="false"
            className="group border-r md:border-y md:border-r-0 min-w-[10rem] -mt-[1px] flex pl-2 relative items-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => !isEditing && onSelect(step)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    !isEditing && onSelect(step);
                }
            }}
        >
            {/* Active indicator */}
            <div className={`absolute bottom-0 z-[5] left-0 w-full md:w-0 md:h-full border md:border-2 ${isActive ? 'border-blue-600' : 'border-transparent'
                }`} />

            {/* Drag handle */}
            <span className="text-muted-foreground hover:text-foreground transition-colors">
                <Grip className="w-4 h-4" />
            </span>

            {/* Step content */}
            <div className="w-full relative z-[5] flex items-center">
                {isEditing ? (
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyPress}
                        className="w-full h-[3rem] bg-transparent px-3 text-zinc-100 border-none outline-none focus:bg-background/20 rounded"
                        autoFocus
                    />
                ) : (
                    <span
                        className="block h-[3rem] w-full cursor-pointer bg-transparent p-3 text-zinc-100 flex items-center"
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {name}
                    </span>
                )}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-1 mr-2">
                {/* Content indicator */}
                {hasBlocks && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" title="Etapa com conteúdo" />
                )}

                {/* Validation indicator */}
                {!isValid && hasBlocks && (
                    <div className="w-2 h-2 rounded-full bg-yellow-500" title="Etapa com problemas" />
                )}
            </div>

            {/* Menu dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 w-4 h-4 text-zinc-100 hover:text-white p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EllipsisVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        Renomear Etapa
                    </DropdownMenuItem>
                    {onDuplicate && (
                        <DropdownMenuItem onClick={() => onDuplicate(step)}>
                            Duplicar Etapa
                        </DropdownMenuItem>
                    )}
                    {onMoveUp && (
                        <DropdownMenuItem onClick={() => onMoveUp(step)}>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Mover para Cima
                        </DropdownMenuItem>
                    )}
                    {onMoveDown && (
                        <DropdownMenuItem onClick={() => onMoveDown(step)}>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Mover para Baixo
                        </DropdownMenuItem>
                    )}
                    {onDelete && (
                        <>
                            <DropdownMenuItem className="border-t" />
                            <DropdownMenuItem
                                onClick={() => onDelete(step)}
                                className="text-destructive focus:text-destructive"
                            >
                                Excluir Etapa
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

const CaktoStepSidebar: React.FC<CaktoStepSidebarProps> = ({
    currentStep,
    totalSteps = 21,
    stepHasBlocks = {},
    stepValidation = {},
    stepNames = {},
    onSelectStep,
    onRenameStep,
    onDeleteStep,
    onDuplicateStep,
    onAddStep,
    onReorderSteps,
    className = ""
}) => {
    const getStepName = (step: number) => {
        return stepNames[step] || `Etapa ${step}`;
    };

    const handleMoveUp = (step: number) => {
        if (step > 1 && onReorderSteps) {
            onReorderSteps(step, step - 1);
        }
    };

    const handleMoveDown = (step: number) => {
        if (step < totalSteps && onReorderSteps) {
            onReorderSteps(step, step + 1);
        }
    };

    // Generate steps array
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className={`w-full min-h-[3rem] relative border-b overflow-auto md:max-w-[13rem] border-r ${className}`}>
            <ScrollArea className="relative overflow-hidden flex md:grid h-full">
                <div className="w-full">
                    {/* Steps list */}
                    {steps.map((step) => (
                        <StepItem
                            key={step}
                            step={step}
                            name={getStepName(step)}
                            isActive={currentStep === step}
                            hasBlocks={stepHasBlocks[step] || false}
                            isValid={stepValidation[step] !== false}
                            onSelect={onSelectStep}
                            onRename={onRenameStep}
                            onDelete={onDeleteStep}
                            onDuplicate={onDuplicateStep}
                            onMoveUp={step > 1 ? handleMoveUp : undefined}
                            onMoveDown={step < totalSteps ? handleMoveDown : undefined}
                        />
                    ))}

                    {/* Add step button */}
                    {onAddStep && (
                        <div className="grid md:p-1 relative">
                            <Button
                                variant="ghost"
                                onClick={onAddStep}
                                className="h-10 px-4 py-2 justify-start text-muted-foreground hover:text-foreground"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Etapa
                            </Button>
                        </div>
                    )}

                    {/* Bottom spacing */}
                    <div className="py-10" />
                </div>
            </ScrollArea>
        </div>
    );
};

export default CaktoStepSidebar;