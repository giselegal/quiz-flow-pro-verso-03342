/**
 * 🎯 ADD STEP DIALOG
 * 
 * Modal para adicionar novas etapas manualmente no modo "Começar do Zero"
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface NewStepData {
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer' | 'custom';
  description: string;
  order: number;
}

interface AddStepDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (stepData: NewStepData) => void;
  existingStepsCount: number;
}

const STEP_TYPES = [
  { value: 'intro', label: 'Introdução', description: 'Tela inicial de apresentação' },
  { value: 'question', label: 'Pergunta', description: 'Pergunta do quiz' },
  { value: 'strategic', label: 'Estratégica', description: 'Pergunta estratégica/segmentação' },
  { value: 'transition', label: 'Transição', description: 'Tela de transição entre seções' },
  { value: 'result', label: 'Resultado', description: 'Tela de resultado' },
  { value: 'offer', label: 'Oferta', description: 'Apresentação de produto/serviço' },
  { value: 'custom', label: 'Customizada', description: 'Etapa personalizada' },
] as const;

export function AddStepDialog({ open, onClose, onAdd, existingStepsCount }: AddStepDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewStepData>({
    name: '',
    type: 'question',
    description: '',
    order: existingStepsCount + 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewStepData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewStepData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.order < 1) {
      newErrors.order = 'Ordem deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    onAdd(formData);
    
    // Reset form
    setFormData({
      name: '',
      type: 'question',
      description: '',
      order: existingStepsCount + 2,
    });
    setErrors({});
    
    toast({
      title: 'Etapa adicionada!',
      description: `${formData.name} foi adicionada com sucesso`,
    });
    
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const selectedTypeInfo = STEP_TYPES.find(t => t.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Nova Etapa
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes da nova etapa do seu funil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome da Etapa */}
          <div className="space-y-2">
            <Label htmlFor="step-name">
              Nome da Etapa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="step-name"
              placeholder="Ex: Primeira Pergunta"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Tipo de Etapa */}
          <div className="space-y-2">
            <Label htmlFor="step-type">
              Tipo de Etapa <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as NewStepData['type'] })}
            >
              <SelectTrigger id="step-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTypeInfo && (
              <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs text-blue-700 dark:text-blue-300">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{selectedTypeInfo.description}</span>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="step-description">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="step-description"
              placeholder="Descreva o objetivo desta etapa..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Ordem */}
          <div className="space-y-2">
            <Label htmlFor="step-order">
              Posição na Sequência <span className="text-red-500">*</span>
            </Label>
            <Input
              id="step-order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className={errors.order ? 'border-red-500' : ''}
            />
            {errors.order && (
              <p className="text-xs text-red-500">{errors.order}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Total de etapas: {existingStepsCount}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Etapa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
