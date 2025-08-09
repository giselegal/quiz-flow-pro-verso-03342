import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEditor } from "@/context/EditorContext";
import { QuizTemplateService } from "@/services/QuizTemplateService";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  MousePointer,
  Palette,
  Play,
  Plus,
  Settings,
  Shuffle,
  Target,
} from "lucide-react";
import React, { useState } from "react";

const QuizStepsPanel: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    steps: true,
    design: false,
    logic: false,
    config: false,
  });

  const quizService = QuizTemplateService.getInstance();
  const template = quizService.getCurrentTemplate();
  const { stageActions, blockActions } = useEditor();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStepIcon = (type: string) => {
    const icons: Record<string, any> = {
      intro: Play,
      questions: HelpCircle,
      mainTransition: Shuffle,
      strategicQuestions: Target,
      finalTransition: Shuffle,
      result: BarChart3,
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStepTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      intro: "bg-green-100 text-green-800 border-green-200",
      questions: "bg-blue-100 text-blue-800 border-blue-200",
      mainTransition: "bg-purple-100 text-purple-800 border-purple-200",
      strategicQuestions: "bg-orange-100 text-orange-800 border-orange-200",
      finalTransition: "bg-purple-100 text-purple-800 border-purple-200",
      result: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleAddStepToEditor = (step: any, index: number) => {
    // Criar um novo estágio baseado na etapa do template
    const stage = quizService.createEditorStage(step.type);
    if (stage) {
      // Garantir que o type está no formato correto para o FunnelStage
      const validStage = {
        ...stage,
        type: stage.type as
          | "intro"
          | "question"
          | "transition"
          | "result"
          | "processing"
          | "lead"
          | "offer"
          | "final",
      };
      stageActions.addStage(validStage);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: template.design.primaryColor }}
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">{template.meta.name}</CardTitle>
              <p className="text-xs text-muted-foreground">v{template.meta.version}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {template.steps.length} Etapas
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quiz Steps */}
      <Card>
        <Collapsible open={expandedSections.steps} onOpenChange={() => toggleSection("steps")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <CardTitle className="text-sm">Etapas do Quiz</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.order.length}
                  </Badge>
                  {expandedSections.steps ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {template.order.map((stepType, index) => {
                  const step = template.steps.find(s => s.type === stepType);
                  if (!step) return null;

                  return (
                    <div
                      key={`${stepType}-${index}`}
                      className="group border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getStepIcon(step.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{step.title}</h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStepTypeColor(step.type)}`}
                            >
                              {step.type}
                            </Badge>
                          </div>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {step.description}
                            </p>
                          )}

                          {/* Step Details */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {step.type === "questions" && step.rules && (
                              <Badge variant="outline" className="text-xs">
                                {step.rules.multiSelect} seleções
                              </Badge>
                            )}
                            {step.type === "questions" && step.questions && (
                              <Badge variant="outline" className="text-xs">
                                {step.questions.length} perguntas
                              </Badge>
                            )}
                            {step.progressBar?.show && (
                              <Badge variant="outline" className="text-xs">
                                Progress Bar
                              </Badge>
                            )}
                            {step.imageUrl && (
                              <Badge variant="outline" className="text-xs">
                                Com imagem
                              </Badge>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleAddStepToEditor(step, index)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Design System */}
      <Card>
        <Collapsible open={expandedSections.design} onOpenChange={() => toggleSection("design")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <CardTitle className="text-sm">Design System</CardTitle>
                </div>
                {expandedSections.design ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Colors */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded mx-auto border mb-1"
                      style={{ backgroundColor: template.design.primaryColor }}
                    />
                    <p className="text-xs text-muted-foreground">Primária</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded mx-auto border mb-1"
                      style={{ backgroundColor: template.design.secondaryColor }}
                    />
                    <p className="text-xs text-muted-foreground">Secundária</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded mx-auto border mb-1"
                      style={{ backgroundColor: template.design.accentColor }}
                    />
                    <p className="text-xs text-muted-foreground">Accent</p>
                  </div>
                </div>

                {/* Typography */}
                <div className="border rounded p-2">
                  <p className="text-xs text-muted-foreground mb-1">Typography</p>
                  <p className="text-sm" style={{ fontFamily: template.design.fontFamily }}>
                    {template.design.fontFamily}
                  </p>
                </div>

                {/* Animations */}
                <div className="space-y-2">
                  <p className="text-xs font-medium">Animações</p>
                  <div className="space-y-1">
                    {Object.entries(template.design.animations).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Logic & Rules */}
      <Card>
        <Collapsible open={expandedSections.logic} onOpenChange={() => toggleSection("logic")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  <CardTitle className="text-sm">Lógica & Regras</CardTitle>
                </div>
                {expandedSections.logic ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {Object.entries(template.logic).map(([section, rules]) => (
                  <div key={section} className="border rounded p-2">
                    <p className="text-xs font-medium mb-2 capitalize">{section}</p>
                    <div className="space-y-1">
                      {Object.entries(rules as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <p className="mt-1 text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Configuration */}
      <Card>
        <Collapsible open={expandedSections.config} onOpenChange={() => toggleSection("config")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <CardTitle className="text-sm">Configurações</CardTitle>
                </div>
                {expandedSections.config ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Analytics Events */}
                <div>
                  <p className="text-xs font-medium mb-2">Eventos Analytics</p>
                  <div className="flex flex-wrap gap-1">
                    {template.config.analyticsEvents.map(event => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Local Storage Keys */}
                <div>
                  <p className="text-xs font-medium mb-2">Local Storage</p>
                  <div className="flex flex-wrap gap-1">
                    {template.config.localStorageKeys.map(key => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tracking */}
                <div>
                  <p className="text-xs font-medium mb-2">Tracking</p>
                  <div className="space-y-1">
                    {Object.entries(template.config.tracking).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default QuizStepsPanel;
