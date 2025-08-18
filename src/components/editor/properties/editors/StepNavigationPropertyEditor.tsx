import { useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Info, RotateCcw, Save, Settings } from 'lucide-react';
import React, { useState } from 'react';

interface StepNavigationConfig {
  // Configurações de Seleção
  requiredSelections: number;
  maxSelections: number;
  multipleSelection: boolean;

  // Configurações de Navegação
  autoAdvanceOnComplete: boolean;
  autoAdvanceDelay: number;
  enableButtonOnlyWhenValid: boolean;
  showValidationFeedback: boolean;

  // Configurações de UI
  showSelectionCount: boolean;
  showProgressMessage: boolean;
  validationMessage: string;
  progressMessage: string;
  nextButtonText: string;

  // Configurações de Estilo
  selectionStyle: 'border' | 'background' | 'shadow';
  selectedColor: string;
  hoverColor: string;
}

interface StepNavigationPropertyEditorProps {
  stepId: string;
  currentConfig?: Partial<StepNavigationConfig>;
  onConfigChange: (stepId: string, config: StepNavigationConfig) => void;
  onClose?: () => void;
}

/**
 * 🎯 EDITOR NOCODE PARA CONFIGURAÇÕES DE NAVEGAÇÃO DAS ETAPAS
 *
 * Permite editar visualmente:
 * - Número de seleções obrigatórias
 * - Auto-advance e delay
 * - Mensagens e validações
 * - Estilos de seleção
 * - Comportamento do botão
 */
export const StepNavigationPropertyEditor: React.FC<StepNavigationPropertyEditorProps> = ({
  stepId,
  currentConfig,
  onConfigChange,
  onClose,
}) => {
  const { currentStep, getStepRequirements } = useQuiz21Steps();
  const currentRequirements = getStepRequirements();

  // Estado local do editor
  const [config, setConfig] = useState<StepNavigationConfig>({
    // Valores padrão baseados nos requisitos atuais
    requiredSelections: currentConfig?.requiredSelections ?? currentRequirements.requiredSelections,
    maxSelections: currentConfig?.maxSelections ?? currentRequirements.maxSelections,
    multipleSelection:
      currentConfig?.multipleSelection ?? currentRequirements.requiredSelections > 1,

    autoAdvanceOnComplete: currentConfig?.autoAdvanceOnComplete ?? currentRequirements.autoAdvance,
    autoAdvanceDelay: currentConfig?.autoAdvanceDelay ?? 1500,
    enableButtonOnlyWhenValid: currentConfig?.enableButtonOnlyWhenValid ?? true,
    showValidationFeedback: currentConfig?.showValidationFeedback ?? true,

    showSelectionCount: currentConfig?.showSelectionCount ?? true,
    showProgressMessage: currentConfig?.showProgressMessage ?? true,
    validationMessage:
      currentConfig?.validationMessage ??
      `Selecione ${currentRequirements.requiredSelections} opções para continuar`,
    progressMessage:
      currentConfig?.progressMessage ?? 'Você selecionou {count} de {required} opções',
    nextButtonText: currentConfig?.nextButtonText ?? 'Avançar',

    selectionStyle: currentConfig?.selectionStyle ?? 'border',
    selectedColor: currentConfig?.selectedColor ?? '#3B82F6',
    hoverColor: currentConfig?.hoverColor ?? '#EBF5FF',
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Atualizar configuração
  const updateConfig = (updates: Partial<StepNavigationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  // Salvar configurações
  const handleSave = () => {
    onConfigChange(stepId, config);
    setHasChanges(false);
  };

  // Resetar para padrões
  const handleReset = () => {
    setConfig({
      requiredSelections: currentRequirements.requiredSelections,
      maxSelections: currentRequirements.maxSelections,
      multipleSelection: currentRequirements.requiredSelections > 1,
      autoAdvanceOnComplete: currentRequirements.autoAdvance,
      autoAdvanceDelay: 1500,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
      showSelectionCount: true,
      showProgressMessage: true,
      validationMessage: `Selecione ${currentRequirements.requiredSelections} opções para continuar`,
      progressMessage: 'Você selecionou {count} de {required} opções',
      nextButtonText: 'Avançar',
      selectionStyle: 'border',
      selectedColor: '#3B82F6',
      hoverColor: '#EBF5FF',
    });
    setHasChanges(true);
  };

  // Obter tipo de etapa para mostrar informações contextuais
  const getStepType = () => {
    const stepNumber = parseInt(stepId.replace('step-', ''), 10);
    if (stepNumber === 1) return 'lead-collection';
    if (stepNumber >= 2 && stepNumber <= 11) return 'scored-question';
    if (stepNumber === 12) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic-question';
    if (stepNumber === 19) return 'transition';
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'offer';
    return 'unknown';
  };

  const stepType = getStepType();
  const stepNumber = parseInt(stepId.replace('step-', ''), 10);

  // Informações contextuais por tipo de etapa
  const getStepInfo = () => {
    switch (stepType) {
      case 'lead-collection':
        return {
          icon: '👤',
          title: 'Coleta de Nome',
          description: 'Primeira etapa do funil - captura de lead',
        };
      case 'scored-question':
        return {
          icon: '❓',
          title: `Questão ${stepNumber - 1} de 10`,
          description: 'Questão pontuada do quiz principal',
        };
      case 'transition':
        return {
          icon: '⏳',
          title: 'Transição',
          description: 'Etapa de transição entre fases',
        };
      case 'strategic-question':
        return {
          icon: '🎯',
          title: `Pergunta Estratégica ${stepNumber - 12}`,
          description: 'Questão para qualificação e segmentação',
        };
      case 'result':
        return {
          icon: '📊',
          title: 'Resultado',
          description: 'Apresentação do resultado do quiz',
        };
      case 'offer':
        return {
          icon: '💎',
          title: 'Oferta',
          description: 'Página de conversão final',
        };
      default:
        return {
          icon: '⚙️',
          title: `Etapa ${stepNumber}`,
          description: 'Configuração personalizada',
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{stepInfo.icon}</div>
            <div>
              <CardTitle className="text-lg">{stepInfo.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{stepInfo.description}</p>
            </div>
          </div>
          <Badge
            variant={
              stepType === 'scored-question' || stepType === 'strategic-question'
                ? 'default'
                : 'secondary'
            }
          >
            {stepId}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 🎯 SEÇÃO: CONFIGURAÇÕES DE SELEÇÃO */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <h3 className="font-semibold">Configurações de Seleção</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requiredSelections">Seleções Obrigatórias</Label>
              <Input
                id="requiredSelections"
                type="number"
                min={0}
                max={10}
                value={config.requiredSelections}
                onChange={e => updateConfig({ requiredSelections: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSelections">Seleções Máximas</Label>
              <Input
                id="maxSelections"
                type="number"
                min={0}
                max={10}
                value={config.maxSelections}
                onChange={e => updateConfig({ maxSelections: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.multipleSelection}
              onCheckedChange={value => updateConfig({ multipleSelection: value })}
            />
            <Label>Permitir múltiplas seleções</Label>
          </div>
        </div>

        <Separator />

        {/* 🚀 SEÇÃO: CONFIGURAÇÕES DE NAVEGAÇÃO */}
        <div className="space-y-4">
          <h3 className="font-semibold">Navegação e Auto-Advance</h3>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.autoAdvanceOnComplete}
              onCheckedChange={value => updateConfig({ autoAdvanceOnComplete: value })}
            />
            <Label>Auto-avançar quando completo</Label>
          </div>

          {config.autoAdvanceOnComplete && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="autoAdvanceDelay">Delay do Auto-Advance (ms)</Label>
              <Input
                id="autoAdvanceDelay"
                type="number"
                min={500}
                max={5000}
                step={100}
                value={config.autoAdvanceDelay}
                onChange={e => updateConfig({ autoAdvanceDelay: parseInt(e.target.value) || 1500 })}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enableButtonOnlyWhenValid}
              onCheckedChange={value => updateConfig({ enableButtonOnlyWhenValid: value })}
            />
            <Label>Habilitar botão apenas quando válido</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.showValidationFeedback}
              onCheckedChange={value => updateConfig({ showValidationFeedback: value })}
            />
            <Label>Mostrar feedback de validação</Label>
          </div>
        </div>

        <Separator />

        {/* 💬 SEÇÃO: MENSAGENS E TEXTOS */}
        <div className="space-y-4">
          <h3 className="font-semibold">Mensagens e Textos</h3>

          <div className="space-y-2">
            <Label htmlFor="validationMessage">Mensagem de Validação</Label>
            <Input
              id="validationMessage"
              value={config.validationMessage}
              onChange={e => updateConfig({ validationMessage: e.target.value })}
              placeholder="Ex: Selecione 3 opções para continuar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progressMessage">Mensagem de Progresso</Label>
            <Input
              id="progressMessage"
              value={config.progressMessage}
              onChange={e => updateConfig({ progressMessage: e.target.value })}
              placeholder="Ex: Você selecionou {count} de {required} opções"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextButtonText">Texto do Botão</Label>
            <Input
              id="nextButtonText"
              value={config.nextButtonText}
              onChange={e => updateConfig({ nextButtonText: e.target.value })}
              placeholder="Ex: Avançar, Continuar, Próximo"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.showSelectionCount}
                onCheckedChange={value => updateConfig({ showSelectionCount: value })}
              />
              <Label>Mostrar contador</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={config.showProgressMessage}
                onCheckedChange={value => updateConfig({ showProgressMessage: value })}
              />
              <Label>Mostrar progresso</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* 🎨 SEÇÃO: ESTILOS VISUAIS */}
        <div className="space-y-4">
          <h3 className="font-semibold">Estilos Visuais</h3>

          <div className="space-y-2">
            <Label htmlFor="selectionStyle">Estilo de Seleção</Label>
            <Select
              value={config.selectionStyle}
              onValueChange={value => updateConfig({ selectionStyle: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="border">Borda</SelectItem>
                <SelectItem value="background">Fundo</SelectItem>
                <SelectItem value="shadow">Sombra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selectedColor">Cor de Seleção</Label>
              <Input
                id="selectedColor"
                type="color"
                value={config.selectedColor}
                onChange={e => updateConfig({ selectedColor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoverColor">Cor de Hover</Label>
              <Input
                id="hoverColor"
                type="color"
                value={config.hoverColor}
                onChange={e => updateConfig({ hoverColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 🔄 AÇÕES */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              {hasChanges ? 'Há alterações não salvas' : 'Configurações salvas'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Resetar
            </Button>

            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>

            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Fechar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepNavigationPropertyEditor;
