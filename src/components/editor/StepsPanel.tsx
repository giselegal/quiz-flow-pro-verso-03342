// =====================================================================
// components/editor/StepsPanel.tsx - Painel de Etapas do Quiz
// =====================================================================

import React, { useState, useCallback, useMemo } from 'react';
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
import { stepTemplateService } from '../../services/stepTemplateService';

interface Step {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive?: boolean;
  type?: string;
  description?: string;
  multiSelect?: number;
}

interface StepsPanelProps {
  steps: Step[];
  selectedStepId: string | null;
  onStepSelect: (stepId: string) => void;
  onStepAdd: () => void;
  onStepUpdate: (stepId: string, updates: Partial<Step>) => void;
  onStepDelete: (stepId: string) => void;
  onStepDuplicate: (stepId: string) => void;
  onStepReorder: (draggedId: string, targetId: string) => void;
  onAddBlocksToStep?: (stepId: string, blocks: any[]) => void;
  onPopulateStep?: (stepId: string) => void;
  className?: string;
}

/**
 * Renders a panel displaying the list of quiz steps, allowing users to select, add, edit, duplicate, reorder, and delete steps.
 *
 * @remarks
 * - Supports inline renaming of steps.
 * - Displays step details, including name, type, and block count.
 * - Provides contextual actions via a dropdown menu for each step.
 * - Includes a button to add new steps.
 * - Integrates with drag-and-drop UI for reordering (visual only, actual drag logic not included).
 *
 * @param steps - Array of step objects to display in the panel.
 * @param selectedStepId - The ID of the currently selected step.
 * @param onStepSelect - Callback invoked when a step is selected.
 * @param onStepAdd - Callback invoked to add a new step.
 * @param onStepUpdate - Callback invoked to update a step's properties (e.g., name).
 * @param onStepDelete - Callback invoked to delete a step.
 * @param onStepDuplicate - Callback invoked to duplicate a step.
 * @param onStepReorder - Callback invoked to reorder steps (not implemented in UI).
 * @param onAddBlocksToStep - Callback to add blocks to a step (not used in UI).
 * @param onPopulateStep - Optional callback to populate a step with predefined content.
 * @param className - Optional additional CSS class names for the panel container.
 *
 * @example
 * ```tsx
 * <StepsPanel
 *   steps={steps}
 *   selectedStepId={selectedStepId}
 *   onStepSelect={handleStepSelect}
 *   onStepAdd={handleStepAdd}
 *   onStepUpdate={handleStepUpdate}
 *   onStepDelete={handleStepDelete}
 *   onStepDuplicate={handleStepDuplicate}
 *   onStepReorder={handleStepReorder}
 *   onPopulateStep={handlePopulateStep}
 * />
 * ```
 */
export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  selectedStepId,
  onStepSelect,
  onStepAdd,
  onStepUpdate,
  onStepDelete,
  onStepDuplicate,
  onStepReorder: _onStepReorder,
  onAddBlocksToStep: _onAddBlocksToStep,
  onPopulateStep,
  className = '',
}) => {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 🎯 OBTER DEFINIÇÕES DAS ETAPAS DO STEPTEMPLATE SERVICE (FONTE ÚNICA)
  const serviceStepsReference = useMemo(() => {
    try {
      console.log('📋 StepsPanel: Obtendo referência das etapas do stepTemplateService...');
      const allSteps = stepTemplateService.getAllSteps();

      if (allSteps && allSteps.length > 0) {
        const serviceSteps = allSteps.map(stepInfo => ({
          id: stepInfo.id,
          name: stepInfo.name,
          order: stepInfo.order,
          type: stepInfo.type,
          description: stepInfo.description,
          blocksCount: stepInfo.blocksCount,
          hasTemplate: stepInfo.hasTemplate,
          multiSelect: stepInfo.multiSelect,
        }));

        console.log(`✅ StepsPanel: ${serviceSteps.length} etapas de referência obtidas`);
        console.log(
          '📊 StepsPanel: Estatísticas dos templates:',
          stepTemplateService.getTemplateStats()
        );
        return serviceSteps;
      }
    } catch (error) {
      console.error('❌ StepsPanel: Erro ao obter referência do stepTemplateService:', error);
    }

    return [];
  }, []);

  const handleEditStart = useCallback((step: Step) => {
    setEditingStepId(step.id);
    setEditingName(step.name);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingStepId && editingName.trim()) {
      onStepUpdate(editingStepId, { name: editingName.trim() });
    }
    setEditingStepId(null);
    setEditingName('');
  }, [editingStepId, editingName, onStepUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditingStepId(null);
    setEditingName('');
  }, []);

  // 🔧 FUNÇÃO UTILITÁRIA: Obter informações da etapa do service
  const getStepReferenceInfo = useCallback(
    (stepId: string) => {
      const serviceStep = serviceStepsReference.find(s => s.id === stepId);
      if (serviceStep) {
        return {
          originalName: serviceStep.name,
          originalDescription: serviceStep.description,
          type: serviceStep.type,
          hasTemplate: true,
        };
      }

      // Fallback para etapas não encontradas no service
      return {
        originalName: `Etapa ${stepId.replace('etapa-', '')}`,
        originalDescription: 'Etapa personalizada',
        type: 'custom',
        hasTemplate: false,
      };
    },
    [serviceStepsReference]
  );

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
            {steps.map((step, _index) => (
              <div
                key={step.id}
                className={cn(
                  'group relative flex items-center p-3 rounded-lg border transition-all duration-200',
                  'hover:shadow-sm cursor-pointer',
                  selectedStepId === step.id
                    ? 'bg-[#B89B7A]/10 border-[#B89B7A]/30 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                )}
                onClick={() => onStepSelect(step.id)}
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
                        {(() => {
                          const stepInfo = getStepReferenceInfo(step.id);
                          const typeLabel =
                            {
                              intro: '🎯 Introdução',
                              question: '❓ Questão',
                              strategic: '🎪 Estratégica',
                              transition: '🔄 Transição',
                              result: '🏆 Resultado',
                              offer: '💎 Oferta',
                              custom: '⚙️ Personalizada',
                            }[stepInfo.type] || '📄 Etapa';

                          return `${typeLabel} • ${step.blocksCount} componente${step.blocksCount !== 1 ? 's' : ''}${stepInfo.hasTemplate ? ' • Template disponível' : ''}`;
                        })()}
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
                        <DropdownMenuItem onClick={() => onStepDuplicate(step.id)}>
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
                          onClick={() => onStepDelete(step.id)}
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
            <Button variant="outline" style={{ borderColor: '#E5DDD5' }} onClick={onStepAdd}>
              <Plus className="w-4 h-4" />
              <span>Adicionar Nova Etapa</span>
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
