/**
 * 🏗️ BUILDER SYSTEM PANEL - Painel de controle do Builder System
 * 
 * Interface visual para usar os recursos do Builder System:
 * - Criar quizzes com presets
 * - Gerar com IA
 * - Templates personalizados
 * - Validação e otimização
 */

import React, { useState } from 'react';
import { useBuilderSystem } from '@/hooks/useBuilderSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, Wand2, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BuilderSystemPanelProps {
  onQuizCreated?: (quiz: any) => void;
}

export const BuilderSystemPanel: React.FC<BuilderSystemPanelProps> = ({ onQuizCreated }) => {
  const {
    state,
    createWithAI,
    applyPreset,
    generateCustomTemplate,
    isReady,
    canUseAI
  } = useBuilderSystem();

  const [aiPrompt, setAiPrompt] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSteps, setCustomSteps] = useState(5);
  const [customTheme, setCustomTheme] = useState('modern-blue');

  const handlePresetClick = async (presetName: string) => {
    try {
      const result = await applyPreset(presetName);
      onQuizCreated?.(result);
    } catch (error) {
      console.error('Erro ao aplicar preset:', error);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      const result = await createWithAI(aiPrompt, 'quiz');
      onQuizCreated?.(result);
      setAiPrompt('');
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
    }
  };

  const handleCustomCreate = async () => {
    if (!customName.trim()) return;

    try {
      const result = await generateCustomTemplate({
        name: customName,
        type: 'quiz',
        steps: customSteps,
        theme: customTheme
      });
      onQuizCreated?.(result);
      setCustomName('');
    } catch (error) {
      console.error('Erro ao criar template:', error);
    }
  };

  if (!isReady) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Inicializando Builder System...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Builder System
          </h3>
          <p className="text-sm text-muted-foreground">
            Crie quizzes completos em minutos
          </p>
        </div>
        <Badge variant={isReady ? 'default' : 'secondary'}>
          {isReady ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
          {isReady ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="ai" disabled={!canUseAI}>
            <Sparkles className="w-3 h-3 mr-1" />
            IA
          </TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Templates Prontos</CardTitle>
              <CardDescription>Comece rapidamente com um template predefinido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.availablePresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(preset)}
                  disabled={state.isGenerating}
                >
                  {state.isGenerating && state.currentTemplate === preset ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  {preset.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Criar com IA
              </CardTitle>
              <CardDescription>Descreva seu quiz e deixe a IA criar para você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Descrição do Quiz</Label>
                <Input
                  id="ai-prompt"
                  placeholder="Ex: Quiz para descobrir estilo de decoração"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={state.isGenerating}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || state.isGenerating}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Tab */}
        <TabsContent value="custom" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template Personalizado</CardTitle>
              <CardDescription>Configure seu próprio template do zero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="custom-name">Nome do Quiz</Label>
                <Input
                  id="custom-name"
                  placeholder="Ex: Meu Quiz Personalizado"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  disabled={state.isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-steps">Número de Etapas</Label>
                <Input
                  id="custom-steps"
                  type="number"
                  min={2}
                  max={50}
                  value={customSteps}
                  onChange={(e) => setCustomSteps(parseInt(e.target.value) || 5)}
                  disabled={state.isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-theme">Tema</Label>
                <Select value={customTheme} onValueChange={setCustomTheme} disabled={state.isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern-blue">Modern Blue</SelectItem>
                    <SelectItem value="warm-orange">Warm Orange</SelectItem>
                    <SelectItem value="minimal-gray">Minimal Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handleCustomCreate}
                disabled={!customName.trim() || state.isGenerating}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Criar Template
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
