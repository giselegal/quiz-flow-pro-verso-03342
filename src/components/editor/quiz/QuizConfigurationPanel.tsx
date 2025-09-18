// src/components/editor/quiz/QuizConfigurationPanel.tsx
// Painel específico para configurar questões baseadas no JSON do Quiz de Estilo Pessoal

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';
import { useEditor } from '@/context/EditorContext';
import { Settings, Grid, Eye, Palette } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface QuizConfigurationPanelProps {
  selectedBlock?: any;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
}

export const QuizConfigurationPanel: React.FC<QuizConfigurationPanelProps> = ({
  selectedBlock: _selectedBlock,
  onUpdate: _onUpdate,
}) => {
  const { activeStageId } = useEditor();
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [, setEditingQuestion] = useState<any>(null);

  // Identificar o tipo de step atual baseado na configuração JSON
  useEffect(() => {
    const currentStepIndex = Number(activeStageId) - 1;
    if (currentStepIndex >= 0 && currentStepIndex < QUIZ_CONFIGURATION.steps.length) {
      setSelectedStep(QUIZ_CONFIGURATION.steps[currentStepIndex]);
    }
  }, [activeStageId]);

  // Renderizar configurações específicas para cada tipo de step
  const renderStepConfiguration = () => {
    if (!selectedStep) return null;

    switch (selectedStep.type) {
      case 'intro':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
              Configuração da Introdução
            </h3>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Título
                </Label>
                <Input
                  defaultValue={selectedStep.title}
                  className="text-sm"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>

              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Descrição Superior
                </Label>
                <Textarea
                  defaultValue={selectedStep.descriptionTop}
                  className="text-sm min-h-[60px]"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>

              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Imagem de Introdução
                </Label>
                <Input
                  defaultValue={selectedStep.imageIntro}
                  placeholder="URL da imagem"
                  className="text-sm"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>

              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Label do Input
                </Label>
                <Input
                  defaultValue={selectedStep.inputLabel}
                  className="text-sm"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>
            </div>
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                Questões Principais
              </h3>
              <Badge variant="outline" style={{ borderColor: '#B89B7A', color: '#B89B7A' }}>
                {selectedStep.questions?.length || 0} questões
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Multi-seleção
                </Label>
                <Badge variant="secondary" style={{ backgroundColor: '#FAF9F7', color: '#432818' }}>
                  {selectedStep.rules?.multiSelect} opções
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Layout
                  </Label>
                  <Select defaultValue={selectedStep.rules?.colunas?.toString()}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 coluna</SelectItem>
                      <SelectItem value="2">2 colunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Progresso
                  </Label>
                  <Switch defaultChecked={selectedStep.progressBar?.show} />
                </div>
              </div>
            </div>

            {/* Lista de questões */}
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                Questões Configuradas
              </Label>
              {selectedStep.questions?.map((question: any, index: number) => (
                <Card key={question.id} className="border" style={{ borderColor: '#E5DDD5' }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium" style={{ color: '#432818' }}>
                        Questão {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuestion(question)}
                        className="h-6 text-xs"
                        style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p
                      className="text-xs text-ellipsis overflow-hidden"
                      style={{ color: '#6B4F43' }}
                    >
                      {question.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {question.options?.length || 0} opções
                      </Badge>
                      {question.layout && (
                        <Badge variant="secondary" className="text-xs">
                          {question.layout}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'strategicQuestions':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                Questões Estratégicas
              </h3>
              <Badge variant="outline" style={{ borderColor: '#aa6b5d', color: '#aa6b5d' }}>
                {selectedStep.questions?.length || 0} questões
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Seleção única
                </Label>
                <Badge variant="secondary" style={{ backgroundColor: '#FAF9F7', color: '#432818' }}>
                  1 opção obrigatória
                </Badge>
              </div>

              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Descrição
                </Label>
                <Textarea
                  defaultValue={selectedStep.description}
                  className="text-sm min-h-[50px]"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
              Configuração de Resultado
            </h3>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  CTA Principal
                </Label>
                <Input
                  defaultValue={selectedStep.cta?.text}
                  className="text-sm"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>

              <div>
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  URL do CTA
                </Label>
                <Input
                  defaultValue={selectedStep.cta?.url}
                  className="text-sm"
                  style={{ borderColor: '#E5DDD5' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedStep.styles?.slice(0, 4).map((style: any) => (
                  <Card key={style.name} className="border" style={{ borderColor: '#E5DDD5' }}>
                    <CardContent className="p-2">
                      <div className="text-xs font-medium" style={{ color: '#432818' }}>
                        {style.name}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#6B4F43' }}>
                        {style.description?.substring(0, 40)}...
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                {selectedStep.title}
              </h3>
              <Badge variant="outline" style={{ borderColor: '#B89B7A', color: '#B89B7A' }}>
                {selectedStep.type}
              </Badge>
            </div>

            <p className="text-xs" style={{ color: '#6B4F43' }}>
              {selectedStep.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FEFEFE' }}>
      <div className="border-b p-3" style={{ borderColor: '#E5DDD5' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: '#B89B7A' }}
          >
            <Settings className="h-3 w-3 text-white" />
          </div>
          <h2 className="font-semibold text-sm" style={{ color: '#432818' }}>
            Configuração do Quiz
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <Tabs defaultValue="step" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="step" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Etapa
            </TabsTrigger>
            <TabsTrigger value="design" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Design
            </TabsTrigger>
            <TabsTrigger value="logic" className="text-xs">
              <Grid className="h-3 w-3 mr-1" />
              Lógica
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step" className="space-y-4 m-0">
            {renderStepConfiguration()}
          </TabsContent>

          <TabsContent value="design" className="space-y-4 m-0">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                Cores da Marca
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Primária
                  </Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: '#B89B7A', borderColor: '#E5DDD5' }}
                    ></div>
                    <span className="text-xs" style={{ color: '#6B4F43' }}>
                      #B89B7A
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Secundária
                  </Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: '#432818', borderColor: '#E5DDD5' }}
                    ></div>
                    <span className="text-xs" style={{ color: '#6B4F43' }}>
                      #432818
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Configurações Visuais
                </Label>
                <div
                  className="p-2 rounded border"
                  style={{ borderColor: '#E5DDD5', backgroundColor: '#FAF9F7' }}
                >
                  <div className="text-xs" style={{ color: '#6B4F43' }}>
                    • Border Radius: {QUIZ_CONFIGURATION.design.card.borderRadius}
                  </div>
                  <div className="text-xs" style={{ color: '#6B4F43' }}>
                    • Altura da Barra: {QUIZ_CONFIGURATION.design.progressBar.height}
                  </div>
                  <div className="text-xs" style={{ color: '#6B4F43' }}>
                    • Animações: {QUIZ_CONFIGURATION.design.animations.questionTransition}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logic" className="space-y-4 m-0">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                Lógica do Quiz
              </h3>

              <div className="space-y-2">
                <div
                  className="p-2 rounded border"
                  style={{ borderColor: '#E5DDD5', backgroundColor: '#FAF9F7' }}
                >
                  <div className="text-xs font-medium" style={{ color: '#432818' }}>
                    Cálculo de Resultado
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B4F43' }}>
                    {QUIZ_CONFIGURATION.logic.calculation.method}
                  </div>
                </div>

                <div
                  className="p-2 rounded border"
                  style={{ borderColor: '#E5DDD5', backgroundColor: '#FAF9F7' }}
                >
                  <div className="text-xs font-medium" style={{ color: '#432818' }}>
                    Validação Visual
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B4F43' }}>
                    {QUIZ_CONFIGURATION.logic.selection.visualValidation}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
                  Eventos de Analytics
                </Label>
                <div className="flex flex-wrap gap-1">
                  {QUIZ_CONFIGURATION.config.analyticsEvents.map((event: string) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedStep && (
        <div className="border-t p-3" style={{ borderColor: '#E5DDD5' }}>
          <div className="text-xs" style={{ color: '#6B4F43' }}>
            Etapa {activeStageId} de {QUIZ_CONFIGURATION.steps.length} • {selectedStep.type}
          </div>
        </div>
      )}
    </div>
  );
};
