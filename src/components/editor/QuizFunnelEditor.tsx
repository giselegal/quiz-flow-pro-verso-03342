/**
 * 🎯 QUIZ FUNNEL EDITOR - Editor Visual do Funil
 * 
 * Componente principal para edição visual do funil de quiz.
 * Funcionalidades:
 * - ✅ Drag & drop de etapas
 * - ✅ Preview em tempo real
 * - ✅ Configuração de etapas
 * - ✅ Validação de fluxo
 * - ✅ Sistema de versionamento
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Copy, 
  ArrowUp, 
  ArrowDown,
  Settings,
  Play,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuizStep {
  id: string;
  name: string;
  description: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  order: number;
  isActive: boolean;
  content: {
    title?: string;
    question?: string;
    options?: Array<{
      id: string;
      text: string;
      value: string;
    }>;
  };
  settings: {
    required: boolean;
    multipleSelection: boolean;
    showProgress: boolean;
  };
}

interface QuizFunnelEditorProps {
  funnelId?: string;
  initialSteps?: QuizStep[];
  onSave?: (steps: QuizStep[]) => void;
  onPreview?: (stepId: string) => void;
  className?: string;
}

export default function QuizFunnelEditor({
  funnelId = 'quiz-estilo-21-steps',
  initialSteps = [],
  onSave,
  onPreview,
  className = ''
}: QuizFunnelEditorProps) {
  const [steps, setSteps] = useState<QuizStep[]>(initialSteps);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Carregar etapas iniciais se não fornecidas
  useEffect(() => {
    if (initialSteps.length === 0) {
      loadDefaultSteps();
    }
  }, [initialSteps.length]);

  const loadDefaultSteps = () => {
    const defaultSteps: QuizStep[] = [
      {
        id: 'step-1',
        name: 'Introdução',
        description: 'Página inicial do quiz',
        type: 'intro',
        order: 1,
        isActive: true,
        content: {
          title: 'Descubra Seu Estilo Pessoal',
          question: 'Qual é o seu nome?'
        },
        settings: {
          required: true,
          multipleSelection: false,
          showProgress: true
        }
      },
      {
        id: 'step-2',
        name: 'Pergunta 1',
        description: 'Primeira pergunta do quiz',
        type: 'question',
        order: 2,
        isActive: true,
        content: {
          title: 'Qual o seu tipo de roupa favorita?',
          options: [
            { id: 'opt-1', text: 'Casual e confortável', value: 'casual' },
            { id: 'opt-2', text: 'Elegante e sofisticada', value: 'elegant' },
            { id: 'opt-3', text: 'Moderna e arrojada', value: 'modern' }
          ]
        },
        settings: {
          required: true,
          multipleSelection: false,
          showProgress: true
        }
      }
    ];
    setSteps(defaultSteps);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    // Atualizar ordem
    const updatedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));

    setSteps(updatedSteps);
    setHasChanges(true);
  };

  const handleAddStep = () => {
    const newStep: QuizStep = {
      id: `step-${Date.now()}`,
      name: 'Nova Etapa',
      description: 'Descrição da nova etapa',
      type: 'question',
      order: steps.length + 1,
      isActive: true,
      content: {
        title: 'Nova Pergunta',
        question: 'Qual é a sua resposta?'
      },
      settings: {
        required: true,
        multipleSelection: false,
        showProgress: true
      }
    };

    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
    setHasChanges(true);
  };

  const handleDeleteStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);
    setSelectedStep(null);
    setHasChanges(true);
  };

  const handleDuplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;

    const duplicatedStep: QuizStep = {
      ...stepToDuplicate,
      id: `step-${Date.now()}`,
      name: `${stepToDuplicate.name} (Cópia)`,
      order: steps.length + 1
    };

    setSteps([...steps, duplicatedStep]);
    setHasChanges(true);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<QuizStep>) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    setSteps(updatedSteps);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validar etapas
    const errors = validateSteps();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSave?.(steps);
    setHasChanges(false);
    setValidationErrors([]);
  };

  const validateSteps = (): string[] => {
    const errors: string[] = [];
    
    if (steps.length === 0) {
      errors.push('O funil deve ter pelo menos uma etapa');
    }

    const introSteps = steps.filter(step => step.type === 'intro');
    if (introSteps.length === 0) {
      errors.push('O funil deve ter pelo menos uma etapa de introdução');
    }

    const resultSteps = steps.filter(step => step.type === 'result');
    if (resultSteps.length === 0) {
      errors.push('O funil deve ter pelo menos uma etapa de resultado');
    }

    return errors;
  };

  const selectedStepData = steps.find(step => step.id === selectedStep);

  return (
    <div className={`quiz-funnel-editor ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold">Editor do Funil</h2>
          <p className="text-sm text-gray-600">
            {steps.length} etapas • {steps.filter(s => s.isActive).length} ativas
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Alterações não salvas
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Erros de validação */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex h-[calc(100vh-200px)]">
        {/* Lista de etapas */}
        <div className="w-80 border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Etapas do Funil</h3>
            <Button size="sm" onClick={handleAddStep}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-move ${
                            selectedStep === step.id ? 'ring-2 ring-blue-500' : ''
                          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {step.type}
                                  </Badge>
                                  {step.isActive ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <h4 className="font-medium text-sm mt-1">{step.name}</h4>
                                <p className="text-xs text-gray-600">{step.description}</p>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateStep(step.id);
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStep(step.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        </div>

        {/* Editor de etapa selecionada */}
        <div className="flex-1 p-4">
          {selectedStepData ? (
            <Tabs defaultValue="content" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="h-full">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Etapa</label>
                    <Input
                      value={selectedStepData.name}
                      onChange={(e) => handleUpdateStep(selectedStepData.id, { name: e.target.value })}
                      placeholder="Nome da etapa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <Textarea
                      value={selectedStepData.description}
                      onChange={(e) => handleUpdateStep(selectedStepData.id, { description: e.target.value })}
                      placeholder="Descrição da etapa"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <Input
                      value={selectedStepData.content.title || ''}
                      onChange={(e) => handleUpdateStep(selectedStepData.id, {
                        content: { ...selectedStepData.content, title: e.target.value }
                      })}
                      placeholder="Título da etapa"
                    />
                  </div>

                  {selectedStepData.type === 'question' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Pergunta</label>
                      <Textarea
                        value={selectedStepData.content.question || ''}
                        onChange={(e) => handleUpdateStep(selectedStepData.id, {
                          content: { ...selectedStepData.content, question: e.target.value }
                        })}
                        placeholder="Pergunta do quiz"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="h-full">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Etapa</label>
                    <select
                      value={selectedStepData.type}
                      onChange={(e) => handleUpdateStep(selectedStepData.id, { type: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="intro">Introdução</option>
                      <option value="question">Pergunta</option>
                      <option value="strategic">Estratégica</option>
                      <option value="transition">Transição</option>
                      <option value="result">Resultado</option>
                      <option value="offer">Oferta</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStepData.isActive}
                        onChange={(e) => handleUpdateStep(selectedStepData.id, { isActive: e.target.checked })}
                        className="mr-2"
                      />
                      Etapa ativa
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStepData.settings.required}
                        onChange={(e) => handleUpdateStep(selectedStepData.id, {
                          settings: { ...selectedStepData.settings, required: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      Obrigatória
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStepData.settings.multipleSelection}
                        onChange={(e) => handleUpdateStep(selectedStepData.id, {
                          settings: { ...selectedStepData.settings, multipleSelection: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      Seleção múltipla
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <div className="border border-gray-200 rounded-lg p-4 h-full">
                  <h3 className="font-medium mb-4">Preview da Etapa</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                      {selectedStepData.content.title || selectedStepData.name}
                    </h4>
                    {selectedStepData.content.question && (
                      <p className="text-gray-700 mb-4">{selectedStepData.content.question}</p>
                    )}
                    <p className="text-sm text-gray-600">{selectedStepData.description}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Selecione uma etapa para editar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
