import { StepNavigationPropertyEditor } from '@/components/editor/properties/editors/StepNavigationPropertyEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditor } from '@/context/EditorContext';
import { useFunnels } from '@/context/FunnelsContext';
import { cn } from '@/lib/utils';
import { useStepNavigationStore } from '@/stores/useStepNavigationStore';
import { Copy, Eye, GripVertical, Navigation, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  className,
  onStageSelect,
}) => {
  // Estado para o editor de navegação
  const [editingStepNavigation, setEditingStepNavigation] = useState<string | null>(null);

  // Store de configurações de navegação
  const { updateStepConfig, getStepConfig } = useStepNavigationStore();

  // Get stages from FunnelsContext (21 stages system)
  const { steps: stages, loading, error, currentFunnelId } = useFunnels();

  // Get editor functionality for blocks and UI (optional properties)
  const editorContext = useEditor();
  const activeStageId = editorContext.activeStageId || 'step-1';
  const setActiveStage =
    editorContext.stageActions?.setActiveStage ||
    (() => console.log('setActiveStage not available'));

  // 🔍 DEBUG: Status das etapas no painel
  console.log('🏗️ FunnelStagesPanel:', {
    totalSteps: stages?.length || 0,
    currentFunnelId,
    activeStageId,
    loading,
    error,
    hasSteps: !!stages && stages.length > 0
  });
  const quizState = editorContext.quizState || {
    userName: '',
    answers: [],
    isQuizCompleted: false,
  };

  const handleAddStage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add stage not implemented for FunnelsContext');
  };

  const handleStageClick = async (stageId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Extrair o número da etapa do stageId (por exemplo, 'step-3' -> 3)
    const stepNumber = parseInt(stageId.replace('step-', ''), 10);

    if (!isNaN(stepNumber)) {
      console.log(`🔄 Carregando template para etapa ${stepNumber}`);

      // Usar a função loadTemplateByStep do EditorContext
      try {
        if (editorContext.templateActions?.loadTemplateByStep) {
          const success = await editorContext.templateActions.loadTemplateByStep(stepNumber);
          if (success !== undefined) {
            console.log(`✅ Template para etapa ${stepNumber} carregado com sucesso`);
          } else {
            console.warn(`⚠️ Não foi possível carregar o template para etapa ${stepNumber}`);
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao carregar template para etapa ${stepNumber}:`, error);
      }
    }

    setActiveStage(stageId);
    if (onStageSelect) {
      onStageSelect(stageId);
    }
  };

  const handleActionClick = (action: string, stageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case 'view':
        handleStageClick(stageId);
        break;
      case 'settings':
        // Abrir configurações gerais da etapa
        console.log('Configurações gerais para:', stageId);
        break;
      case 'navigation':
        // Abrir editor de navegação NoCode
        setEditingStepNavigation(stageId);
        break;
      case 'copy':
        // Copiar configurações da etapa
        console.log('Copiar etapa:', stageId);
        break;
      case 'delete':
        if (confirm(`Deseja excluir a etapa "${stageId}"?`)) {
          console.log('Remove stage not implemented for FunnelsContext:', stageId);
        }
        break;
    }
  };

  // Manipular mudanças nas configurações de navegação
  const handleNavigationConfigChange = (stepId: string, config: any) => {
    updateStepConfig(stepId, config);
    console.log(`✅ Configurações de navegação atualizadas para ${stepId}:`, config);
  };

  // Fechar editor de navegação
  const handleCloseNavigationEditor = () => {
    setEditingStepNavigation(null);
  };

  if (!stages || stages.length === 0) {
    return (
      <Card className={cn('h-full flex flex-col min-h-[400px]', className)}>
        <CardHeader>
          <CardTitle>Nenhuma etapa disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Recarregue a página ou verifique a configuração.</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-bold">Debug Info:</p>
            <p>stages: {stages ? `Array com ${stages.length} itens` : 'null/undefined'}</p>
            <p>activeStageId: {activeStageId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col min-h-[400px]', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Etapas do Funil
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary">{stages.length}/21</Badge>
            {/* ✅ NOVO: Indicador de progresso do quiz */}
            {quizState.userName && (
              <Badge variant="outline" className="text-xs">
                👤 {quizState.userName}
              </Badge>
            )}
            {quizState.answers.length > 0 && (
              <Badge variant="default" className="text-xs">
                📊 {quizState.answers.length} respostas
              </Badge>
            )}
            {quizState.isQuizCompleted && (
              <Badge variant="default" className="text-xs bg-green-500">
                ✅ Completo
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-y-auto [scrollbar-gutter:stable]">
          <div className="space-y-2 p-4">
            {stages.map(stage => (
              <div
                key={stage.id}
                className={cn(
                  'group relative rounded-lg border-2 transition-all cursor-pointer',
                  'hover:border-purple-400 hover:shadow-lg',
                  'min-h-[80px] bg-white p-4',
                  activeStageId === stage.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
                onClick={e => handleStageClick(stage.id, e)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Etapa {stage.order}</span>
                      <Badge variant={stage.isActive ? 'default' : 'secondary'} className="text-xs">
                        {stage.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold truncate">{stage.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {stage.blocksCount} componentes
                    </Badge>
                    {/* 🎯 NOVO: Indicador de configuração personalizada de navegação */}
                    {getStepConfig(stage.id).requiredSelections !==
                      getStepConfig(stage.id).requiredSelections && (
                      <Badge variant="default" className="text-xs bg-blue-500">
                        ⚙️ Custom
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('view', stage.id, e)}
                      title="Visualizar"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('navigation', stage.id, e)}
                      title="Configurar Navegação"
                    >
                      <Navigation className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('settings', stage.id, e)}
                      title="Configurações"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('copy', stage.id, e)}
                      title="Copiar"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={e => handleActionClick('delete', stage.id, e)}
                      title="Excluir"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2"
              onClick={handleAddStage}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </div>
        </div>
      </CardContent>

      {/* 🎯 MODAL/OVERLAY PARA EDITOR DE NAVEGAÇÃO NOCODE */}
      {editingStepNavigation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <StepNavigationPropertyEditor
              stepId={editingStepNavigation}
              currentConfig={getStepConfig(editingStepNavigation)}
              onConfigChange={handleNavigationConfigChange}
              onClose={handleCloseNavigationEditor}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default FunnelStagesPanel;
