'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Edit2, Copy, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Step {
  id: string;
  name: string;
  items: any[];
  settings: {
    showLogo: boolean;
    showProgress: boolean;
    allowReturn: boolean;
    isVisible: boolean;
  };
}

interface StepsPanelProps {
  steps: Step[];
  activeStepId: string;
  onStepSelect: (stepId: string) => void;
  onAddStep: (name?: string) => void;
  onUpdateStep: (stepId: string, updates: Partial<Step>) => void;
  onDeleteStep: (stepId: string) => void;
  onDuplicateStep: (stepId: string) => void;
  onReorderSteps: (oldIndex: number, newIndex: number) => void;
  collapsed: boolean;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  activeStepId,
  onStepSelect,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onDuplicateStep,
  collapsed,
}) => {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditStart = (step: Step) => {
    setEditingStepId(step.id);
    setEditingName(step.name);
  };

  const handleEditSave = () => {
    if (editingStepId && editingName.trim()) {
      onUpdateStep(editingStepId, { name: editingName.trim() });
    }
    setEditingStepId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingStepId(null);
    setEditingName('');
  };

  if (collapsed) {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer ${activeStepId === step.id
                  ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => onStepSelect(step.id)}
              title={step.name}
            >
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-12 h-12 p-0" onClick={() => onAddStep()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div style={{ borderColor: '#E5DDD5' }}>
        <Button variant="outline" className="w-full" onClick={() => onAddStep()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${activeStepId === step.id
                  ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => onStepSelect(step.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  {!step.settings.isVisible && <EyeOff className="w-4 h-4 text-gray-400" />}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        aria-label="Opções da etapa"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditStart(step)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar Nome
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicateStep(step.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStep(step.id, {
                            settings: {
                              ...step.settings,
                              isVisible: !step.settings.isVisible,
                            },
                          })
                        }
                      >
                        {step.settings.isVisible ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Mostrar
                          </>
                        )}
                      </DropdownMenuItem>
                      {steps.length > 1 && (
                        <DropdownMenuItem
                          onClick={() => onDeleteStep(step.id)}
                          style={{ color: '#432818' }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {editingStepId === step.id ? (
                <div className="space-y-2">
                  <Input
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleEditSave();
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                    className="text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEditSave}>
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleEditCancel}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <h4 className="font-medium text-sm mb-1">{step.name}</h4>
              )}

              <div style={{ color: '#8B7355' }}>
                <span>{step.items.length} componentes</span>
                <div className="flex gap-1">
                  {step.settings.showLogo && <span>🏷️</span>}
                  {step.settings.showProgress && <span>📊</span>}
                  {step.settings.allowReturn && <span>↩️</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
