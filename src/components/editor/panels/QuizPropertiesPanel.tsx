'use client';

/**
 * 🎯 QUIZ PROPERTIES PANEL - Painel Especializado
 * 
 * Painel de propriedades específico para configuração
 * de questões, pontuação e lógica do quiz.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Settings, Target, Palette, BarChart3,
  Plus, Trash2, Edit3, Save
} from 'lucide-react';

interface QuizPropertiesPanelProps {
  stepNumber: number;
  stepType: string;
  onStepChange?: (stepNumber: number) => void;
  className?: string;
}

interface QuestionOption {
  id: string;
  text: string;
  points: Record<string, number>;
  image?: string;
}

interface StepConfiguration {
  title: string;
  description: string;
  questionText?: string;
  options?: QuestionOption[];
  maxSelections?: number;
  isRequired?: boolean;
  customStyling?: any;
}

const QUIZ_STYLES = [
  'Natural', 'Clássico', 'Contemporâneo', 'Elegante',
  'Romântico', 'Sexy', 'Dramático', 'Criativo'
];

const QuizPropertiesPanel: React.FC<QuizPropertiesPanelProps> = ({
  stepNumber,
  stepType,
  onStepChange,
  className = ''
}) => {
  // Estado local
  const [config, setConfig] = useState<StepConfiguration>({
    title: `Etapa ${stepNumber}`,
    description: `Configuração da ${stepType}`,
    questionText: '',
    options: [],
    maxSelections: 3,
    isRequired: true
  });

  const [activeTab, setActiveTab] = useState<'content' | 'scoring' | 'styling' | 'logic'>('content');
  const [isEditing, setIsEditing] = useState(false);

  // Carregar configuração da etapa
  useEffect(() => {
    loadStepConfiguration();
  }, [stepNumber]);

  const loadStepConfiguration = useCallback(async () => {
    // Simular carregamento da configuração
    const mockConfig: StepConfiguration = {
      title: `${stepType} - Etapa ${stepNumber}`,
      description: getStepDescription(stepNumber, stepType),
      questionText: getDefaultQuestionText(stepNumber, stepType),
      options: getDefaultOptions(stepNumber, stepType),
      maxSelections: stepType === 'Questão Estratégica' ? 1 : 3,
      isRequired: true
    };

    setConfig(mockConfig);
  }, [stepNumber, stepType]);

  // Handlers
  const handleConfigChange = useCallback((field: keyof StepConfiguration, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setIsEditing(true);
  }, []);

  const handleOptionAdd = useCallback(() => {
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      points: QUIZ_STYLES.reduce((acc, style) => ({ ...acc, [style]: 0 }), {})
    };

    handleConfigChange('options', [...(config.options || []), newOption]);
  }, [config.options, handleConfigChange]);

  const handleOptionUpdate = useCallback((optionId: string, updates: Partial<QuestionOption>) => {
    const updatedOptions = (config.options || []).map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    handleConfigChange('options', updatedOptions);
  }, [config.options, handleConfigChange]);

  const handleOptionDelete = useCallback((optionId: string) => {
    const filteredOptions = (config.options || []).filter(option => option.id !== optionId);
    handleConfigChange('options', filteredOptions);
  }, [config.options, handleConfigChange]);

  const handleSave = useCallback(() => {
    console.log('💾 Salvando configuração da etapa:', { stepNumber, config });
    setIsEditing(false);
    // Aqui será implementada a integração com o backend
  }, [stepNumber, config]);

  return (
    <div className={`quiz-properties-panel h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Propriedades da Etapa</h3>
            <p className="text-sm text-muted-foreground">
              {stepType} - Etapa {stepNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <Badge variant="outline" className="text-xs">
                Não salvo
              </Badge>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!isEditing}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo com tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="h-full flex flex-col">
          <div className="border-b border-border px-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="text-sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="scoring" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Pontuação
              </TabsTrigger>
              <TabsTrigger value="styling" className="text-sm">
                <Palette className="w-4 h-4 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="logic" className="text-sm">
                <Settings className="w-4 h-4 mr-1" />
                Lógica
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="content" className="space-y-6 m-0">
              {/* Informações básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título da Etapa</Label>
                    <Input
                      id="title"
                      value={config.title}
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                      placeholder="Digite o título..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => handleConfigChange('description', e.target.value)}
                      placeholder="Digite a descrição..."
                      rows={3}
                    />
                  </div>

                  {(stepType === 'Questão' || stepType === 'Questão Estratégica') && (
                    <div>
                      <Label htmlFor="questionText">Texto da Questão</Label>
                      <Textarea
                        id="questionText"
                        value={config.questionText || ''}
                        onChange={(e) => handleConfigChange('questionText', e.target.value)}
                        placeholder="Digite a pergunta..."
                        rows={2}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Opções da questão */}
              {(stepType === 'Questão' || stepType === 'Questão Estratégica') && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Opções de Resposta</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOptionAdd}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(config.options || []).map((option, index) => (
                      <div key={option.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">Opção {index + 1}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOptionDelete(option.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionUpdate(option.id, { text: e.target.value })}
                            placeholder="Texto da opção..."
                          />
                        </div>
                      </div>
                    ))}

                    {(!config.options || config.options.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma opção configurada</p>
                        <p className="text-sm">Clique em "Adicionar" para criar uma opção</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scoring" className="space-y-6 m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sistema de Pontuação</CardTitle>
                  <CardDescription>
                    Configure os pontos por estilo para cada opção
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(config.options || []).length > 0 ? (
                    <div className="space-y-6">
                      {(config.options || []).map((option, optionIndex) => (
                        <div key={option.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-3">
                            Opção {optionIndex + 1}: {option.text}
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            {QUIZ_STYLES.map(style => (
                              <div key={style} className="flex items-center justify-between">
                                <Label className="text-sm">{style}</Label>
                                <Input
                                  type="number"
                                  className="w-20"
                                  value={option.points[style] || 0}
                                  onChange={(e) => {
                                    const newPoints = {
                                      ...option.points,
                                      [style]: parseInt(e.target.value) || 0
                                    };
                                    handleOptionUpdate(option.id, { points: newPoints });
                                  }}
                                  min="0"
                                  max="10"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Configure as opções primeiro</p>
                      <p className="text-sm">Vá para a aba "Conteúdo" para adicionar opções</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="styling" className="space-y-6 m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configurações Visuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Configurações visuais</p>
                    <p className="text-sm">Será implementado na Fase 3</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logic" className="space-y-6 m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lógica da Etapa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Etapa obrigatória</Label>
                      <p className="text-sm text-muted-foreground">
                        Usuário deve responder para continuar
                      </p>
                    </div>
                    <Switch
                      checked={config.isRequired}
                      onCheckedChange={(checked) => handleConfigChange('isRequired', checked)}
                    />
                  </div>

                  {(stepType === 'Questão' || stepType === 'Questão Estratégica') && (
                    <div>
                      <Label htmlFor="maxSelections">Máximo de seleções</Label>
                      <Input
                        id="maxSelections"
                        type="number"
                        value={config.maxSelections || 3}
                        onChange={(e) => handleConfigChange('maxSelections', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="w-24"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="text-sm text-muted-foreground">
                    <p>Lógica avançada de navegação e condições será implementada na Fase 4</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Funções auxiliares
function getStepDescription(stepNumber: number, stepType: string): string {
  if (stepNumber === 1) return 'Página de introdução e coleta de nome';
  if (stepNumber >= 2 && stepNumber <= 11) return `Questão ${stepNumber - 1} do quiz de estilo`;
  if (stepNumber === 12) return 'Transição para questões estratégicas';
  if (stepNumber >= 13 && stepNumber <= 18) return `Questão estratégica ${stepNumber - 12}`;
  if (stepNumber === 19) return 'Transição para resultado';
  if (stepNumber === 20) return 'Página de resultado personalizada';
  if (stepNumber === 21) return 'Página de oferta final';
  return `Configuração da ${stepType}`;
}

function getDefaultQuestionText(stepNumber: number, stepType: string): string {
  if (stepType === 'Questão') {
    return `Qual dessas opções mais combina com seu estilo? (Questão ${stepNumber - 1})`;
  }
  if (stepType === 'Questão Estratégica') {
    return `Agora vamos personalizar sua experiência... (Estratégica ${stepNumber - 12})`;
  }
  return '';
}

function getDefaultOptions(stepNumber: number, stepType: string): QuestionOption[] {
  if (stepType === 'Questão' || stepType === 'Questão Estratégica') {
    return [
      {
        id: 'option-1',
        text: 'Opção de exemplo 1',
        points: QUIZ_STYLES.reduce((acc, style) => ({ ...acc, [style]: 0 }), {})
      },
      {
        id: 'option-2',
        text: 'Opção de exemplo 2',
        points: QUIZ_STYLES.reduce((acc, style) => ({ ...acc, [style]: 0 }), {})
      }
    ];
  }
  return [];
}

export default QuizPropertiesPanel;