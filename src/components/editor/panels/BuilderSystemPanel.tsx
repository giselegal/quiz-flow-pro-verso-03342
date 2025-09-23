/**
 * 🎯 BUILDER SYSTEM PANEL - INTERFACE IA ATIVADA
 * 
 * Painel principal para interação com Builder System
 * Expõe funcionalidades de IA, templates e automação
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useBuilderSystem } from '@/hooks/useBuilderSystem';
import { useToast } from '@/components/ui/use-toast';
import { 
  Wand2, 
  Sparkles, 
  Zap, 
  LayoutTemplate, 
  Brain, 
  Rocket,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface BuilderSystemPanelProps {
  onQuizGenerated?: (result: any) => void;
  className?: string;
}

export const BuilderSystemPanel: React.FC<BuilderSystemPanelProps> = ({
  onQuizGenerated,
  className = ''
}) => {
  const { toast } = useToast();
  const builderSystem = useBuilderSystem({
    aiEnabled: true,
    templatesEnabled: true,
    autoOptimization: true,
    mode: 'hybrid'
  });

  // Estados locais da interface
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedQuizType, setSelectedQuizType] = useState('product-quiz');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSteps, setCustomSteps] = useState(21);

  // 🤖 CRIAR COM IA
  const handleCreateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite uma descrição do quiz que deseja criar",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await builderSystem.createWithAI(aiPrompt, selectedQuizType);
      
      toast({
        title: "✨ Quiz criado com IA!",
        description: `Quiz "${aiPrompt}" gerado com ${result?.funnel?.steps?.length || 21} etapas`,
        variant: "default"
      });

      onQuizGenerated?.(result);
      setAiPrompt(''); // Limpar após sucesso

    } catch (error) {
      toast({
        title: "Erro na criação com IA",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  // 🎨 APLICAR PRESET
  const handleApplyPreset = async () => {
    if (!selectedPreset) {
      toast({
        title: "Selecione um preset",
        description: "Escolha um template predefinido para aplicar",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await builderSystem.applyPreset(selectedPreset);
      
      toast({
        title: "🎨 Preset aplicado!",
        description: `Template "${selectedPreset}" configurado com sucesso`,
        variant: "default"
      });

      onQuizGenerated?.(result);
      setSelectedPreset(''); // Limpar após sucesso

    } catch (error) {
      toast({
        title: "Erro ao aplicar preset",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  // 🎯 GERAR TEMPLATE PERSONALIZADO
  const handleGenerateCustom = async () => {
    if (!customName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o template personalizado",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await builderSystem.generateCustomTemplate({
        name: customName,
        type: selectedQuizType,
        steps: customSteps
      });
      
      toast({
        title: "🎯 Template personalizado criado!",
        description: `Template "${customName}" com ${customSteps} etapas`,
        variant: "default"
      });

      onQuizGenerated?.(result);
      setCustomName(''); // Limpar após sucesso

    } catch (error) {
      toast({
        title: "Erro ao criar template",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  // 🎯 RENDER STATUS INDICATOR
  const StatusIndicator = () => {
    if (!builderSystem.isReady) {
      return (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
          <span className="text-sm text-yellow-700">Inicializando Builder System...</span>
        </div>
      );
    }

    if (builderSystem.state.error) {
      return (
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{builderSystem.state.error}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-700">Builder System ativo</span>
        <div className="flex gap-1 ml-auto">
          {builderSystem.canUseAI && <Badge variant="secondary" className="text-xs">IA</Badge>}
          {builderSystem.canUseTemplates && <Badge variant="secondary" className="text-xs">Templates</Badge>}
        </div>
      </div>
    );
  };

  return (
    <div className={`builder-system-panel ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Builder System
            <Badge variant="outline" className="ml-auto">Fase 1 Ativo</Badge>
          </CardTitle>
          <StatusIndicator />
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ai-creation" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-creation" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                IA
              </TabsTrigger>
              <TabsTrigger value="presets" className="flex items-center gap-1">
                <LayoutTemplate className="h-4 w-4" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-1">
                <Wand2 className="h-4 w-4" />
                Personalizado
              </TabsTrigger>
            </TabsList>

            {/* 🤖 ABA CRIAÇÃO COM IA */}
            <TabsContent value="ai-creation" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Descreva seu quiz:</label>
                <Textarea
                  placeholder="Ex: Quiz para descobrir qual produto é ideal para o cliente baseado no estilo de vida"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Quiz:</label>
                <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-quiz">Quiz de Produto</SelectItem>
                    <SelectItem value="lead-qualification">Qualificação de Lead</SelectItem>
                    <SelectItem value="customer-satisfaction">Satisfação do Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateWithAI}
                disabled={!builderSystem.canUseAI || builderSystem.state.isGenerating}
                className="w-full"
              >
                {builderSystem.state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Criar com IA
                  </>
                )}
              </Button>
            </TabsContent>

            {/* 🎨 ABA PRESETS */}
            <TabsContent value="presets" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template Predefinido:</label>
                <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {builderSystem.state.availablePresets.map((preset) => (
                      <SelectItem key={preset} value={preset}>
                        {preset.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleApplyPreset}
                disabled={!selectedPreset || builderSystem.state.isGenerating}
                className="w-full"
                variant="outline"
              >
                {builderSystem.state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Aplicar Preset
                  </>
                )}
              </Button>
            </TabsContent>

            {/* 🎯 ABA PERSONALIZADO */}
            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Template:</label>
                <Input
                  placeholder="Ex: Quiz Moda Personalizada"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo:</label>
                  <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-quiz">Produto</SelectItem>
                      <SelectItem value="lead-qualification">Lead</SelectItem>
                      <SelectItem value="customer-satisfaction">Satisfação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Etapas:</label>
                  <Input
                    type="number"
                    min="5"
                    max="30"
                    value={customSteps}
                    onChange={(e) => setCustomSteps(parseInt(e.target.value) || 21)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerateCustom}
                disabled={builderSystem.state.isGenerating}
                className="w-full"
                variant="secondary"
              >
                {builderSystem.state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar Template
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* 🎯 ESTATÍSTICAS QUICK */}
          {builderSystem.state.currentTemplate && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium text-primary">
                Template Ativo: {builderSystem.state.currentTemplate}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};