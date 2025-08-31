// components/editor/StepsPanel.tsx - Versão Refatorada
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { GripVertical, Plus, MoreHorizontal, Edit2, Trash2, Copy, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSteps, QuizStep } from '../../context/StepsContext';

interface StepsPanelProps {
  className?: string;
  onPopulateStep?: (stepId: string) => void;
}

/**
 * Painel de Etapas do Quiz - Versão refatorada usando Context API
 *
 * Este componente utiliza o StepsContext para gerenciar o estado das etapas,
 * simplificando a interface e removendo a necessidade de passar múltiplos callbacks.
 */
export const StepsPanel: React.FC<StepsPanelProps> = ({ className = '', onPopulateStep }) => {
  // Consumir o contexto de etapas
  const {
    steps,
    selectedStepId,
    setSelectedStepId,
    addStep,
    updateStep,
    deleteStep,
    duplicateStep,
  } = useSteps();

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditStart = useCallback((step: QuizStep) => {
    setEditingStepId(step.id);
    setEditingName(step.name);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingStepId && editingName.trim()) {
      updateStep(editingStepId, { name: editingName.trim() });
    }
    setEditingStepId(null);
    setEditingName('');
  }, [editingStepId, editingName, updateStep]);

  const handleEditCancel = useCallback(() => {
    setEditingStepId(null);
    setEditingName('');
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel]
  );

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: '#432818' }}>Etapas Quiz</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {steps.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-2 pb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'group relative flex items-center p-3 rounded-lg border transition-all duration-200',
                  'hover:shadow-sm cursor-pointer',
                  selectedStepId === step.id
                    ? 'bg-[#B89B7A]/10 border-[#B89B7A]/30 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setSelectedStepId(step.id)}
              >
                {/* Drag Handle */}
                <div className="flex-shrink-0 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  {editingStepId === step.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="h-7 text-sm"
                        autoFocus
                        onBlur={handleEditSave}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={handleEditSave}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={handleEditCancel}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 style={{ color: '#432818' }}>{step.name}</h4>
                        <div className="flex items-center space-x-1">
                          {step.blocksCount > 0 && (
                            <Badge variant="outline" className="text-xs px-1">
                              {step.blocksCount}
                            </Badge>
                          )}
                          {step.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p style={{ color: '#8B7355' }}>
                        Etapa {index + 1} • {step.blocksCount} componente
                        {step.blocksCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>

                {/* Step Actions */}
                {editingStepId !== step.id && (
                  <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEditStart(step)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateStep(step.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        {onPopulateStep && (
                          <DropdownMenuItem onClick={() => onPopulateStep(step.id)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Popular Etapa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteStep(step.id)}
                          style={{ color: '#432818' }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Selected Indicator */}
                {selectedStepId === step.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B89B7A] rounded-l-lg"></div>
                )}
              </div>
            ))}

            {/* Add New Step Button */}
            <Button variant="outline" style={{ borderColor: '#E5DDD5' }} onClick={addStep}>
              <Plus className="w-4 h-4" />
              <span>Adicionar Nova Etapa</span>
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
