// =====================================================================
// components/editor/StepsPanel.tsx - Painel de Etapas do Quiz
// =====================================================================

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  GripVertical, Plus, MoreHorizontal, Edit2, 
  Trash2, Copy, Check, X 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

interface Step {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive?: boolean;
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
  className?: string;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  selectedStepId,
  onStepSelect,
  onStepAdd,
  onStepUpdate,
  onStepDelete,
  onStepDuplicate,
  onStepReorder,
  className = ''
}) => {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 21 Etapas pré-definidas do Quiz
  const quiz21Steps = [
    { id: 'etapa-1', name: 'Etapa 1', description: 'Introdução do Quiz' },
    { id: 'etapa-2', name: 'Etapa 2', description: 'Primeira Questão' },
    { id: 'etapa-3', name: 'Etapa 3', description: 'Segunda Questão' },
    { id: 'etapa-4', name: 'Etapa 4', description: 'Terceira Questão' },
    { id: 'etapa-5', name: 'Etapa 5', description: 'Quarta Questão' },
    { id: 'etapa-6', name: 'Etapa 6', description: 'Quinta Questão' },
    { id: 'etapa-7', name: 'Etapa 7', description: 'Sexta Questão' },
    { id: 'etapa-8', name: 'Etapa 8', description: 'Sétima Questão' },
    { id: 'etapa-9', name: 'Etapa 9', description: 'Oitava Questão' },
    { id: 'etapa-10', name: 'Etapa 10', description: 'Nona Questão' },
    { id: 'etapa-11', name: 'Etapa 11', description: 'Décima Questão' },
    { id: 'etapa-12', name: 'Etapa 12', description: 'Análise Parcial' },
    { id: 'etapa-13', name: 'Etapa 13', description: 'Depoimentos' },
    { id: 'etapa-14', name: 'Etapa 14', description: 'Resultado Preliminar' },
    { id: 'etapa-15', name: 'Etapa 15', description: 'Detalhes do Estilo' },
    { id: 'etapa-16', name: 'Etapa 16', description: 'Recomendações' },
    { id: 'etapa-17', name: 'Etapa 17', description: 'Antes e Depois' },
    { id: 'etapa-18', name: 'Etapa 18', description: 'Galeria de Looks' },
    { id: 'etapa-19', name: 'Etapa 19', description: 'Oferta Especial' },
    { id: 'etapa-20', name: 'Etapa 20', description: 'Garantia' },
    { id: 'etapa-21', name: 'Etapa 21', description: 'CTA Final' }
  ];

  // Combinar etapas das 21 predefinidas com etapas personalizadas
  const allSteps = [...quiz21Steps.map((step, index) => ({
    id: step.id,
    name: step.name,
    order: index + 1,
    blocksCount: 0,
    isActive: selectedStepId === step.id,
    description: step.description
  })), ...steps];

  const handleStartEdit = useCallback((stepId: string, currentName: string) => {
    setEditingStepId(stepId);
    setEditingName(currentName);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingStepId && editingName.trim()) {
      onStepUpdate(editingStepId, { name: editingName.trim() });
    }
    setEditingStepId(null);
    setEditingName('');
  }, [editingStepId, editingName, onStepUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditingStepId(null);
    setEditingName('');
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Etapas Quiz</CardTitle>
          <Button
            onClick={onStepAdd}
            size="sm"
            className="h-8 px-3"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Nova Etapa
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-2">
            {allSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'group relative p-3 rounded-lg border transition-all duration-200',
                  'hover:border-blue-300 hover:bg-blue-50/50',
                  step.isActive || selectedStepId === step.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-200 bg-white'
                )}
              >
                <div className="flex items-center space-x-3">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Step Content */}
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => onStepSelect(step.id)}
                  >
                    {editingStepId === step.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="h-7 text-sm"
                          autoFocus
                        />
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-gray-900">
                            {step.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {step.blocksCount || 0}
                          </Badge>
                        </div>
                        {'description' in step && (
                          <p className="text-xs text-gray-500">
                            {(step as any).description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleStartEdit(step.id, step.name)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStepDuplicate(step.id)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onStepDelete(step.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StepsPanel;
