
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  GripVertical,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Step } from '@/types/funnel';

interface StepsPanelProps {
  steps: Step[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
  onPopulateStep?: (stepId: string) => void;
  onAddStep: () => void;
  onDeleteStep: (index: number) => void;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  currentStepIndex,
  onStepSelect,
  onPopulateStep,
  onAddStep,
  onDeleteStep
}) => {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditStart = (step: Step) => {
    setEditingStepId(step.id);
    setEditingName(step.name);
  };

  const handleEditSave = (stepIndex: number) => {
    // Here you would typically call an update function
    console.log(`Updating step ${stepIndex} name to: ${editingName}`);
    setEditingStepId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingStepId(null);
    setEditingName('');
  };

  const handlePopulateStep = (step: Step) => {
    if (onPopulateStep) {
      onPopulateStep(step.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#432818]">Etapas</h3>
          <Button
            onClick={onAddStep}
            size="sm"
            variant="outline"
            className="h-7 px-2"
          >
            <Plus className="w-3 h-3 mr-1" />
            Adicionar
          </Button>
        </div>
        <p className="text-xs text-[#8F7A6A]">
          {steps.length} etapa{steps.length !== 1 ? 's' : ''} criada{steps.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className={`p-3 cursor-pointer transition-all border ${
              currentStepIndex === index
                ? 'border-[#B89B7A] bg-[#B89B7A]/5 shadow-sm'
                : 'border-gray-200 hover:border-[#B89B7A]/50 hover:shadow-sm'
            }`}
            onClick={() => onStepSelect(index)}
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="w-3 h-3 text-gray-400" />
              <div className="flex-1">
                {editingStepId === step.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-6 px-2 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditSave(index);
                        } else if (e.key === 'Escape') {
                          handleEditCancel();
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSave(index);
                      }}
                    >
                      <Check className="w-3 h-3 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCancel();
                      }}
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#432818] truncate">
                      {step.name}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditStart(step)}>
                          <Edit2 className="w-3 h-3 mr-2" />
                          Editar nome
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePopulateStep(step)}>
                          <Copy className="w-3 h-3 mr-2" />
                          Popular etapa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteStep(index)}
                          className="text-red-600"
                          disabled={steps.length <= 1}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-100 text-gray-600"
                >
                  Etapa {index + 1}
                </Badge>
                <span className="text-xs text-[#8F7A6A]">
                  {step.type || 'quiz'}
                </span>
              </div>
              
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {step.blocks?.length || 0} blocos
              </Badge>
            </div>
          </Card>
        ))}

        {steps.length === 0 && (
          <div className="text-center py-8 text-[#8F7A6A]">
            <p className="text-sm">Nenhuma etapa criada</p>
            <p className="text-xs mt-1">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};
