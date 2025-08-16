import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, GripVertical, Eye, Settings, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  className,
  onStageSelect,
}) => {
  // ✅ USAR APENAS EDITORCONTEXT UNIFICADO
  const {
    stages,
    activeStageId,
    stageActions: { setActiveStage, addStage, removeStage },
    computed: { stageCount },
  } = useEditor();

  // ✅ TIMESTAMP PARA DEBUG
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `🔍 [${timestamp}] FunnelStagesPanel - Stages:`,
    stages?.length || 0,
    'ActiveStage:',
    activeStageId
  );

  // ✅ HANDLER PARA ADICIONAR NOVA ETAPA
  const handleAddStage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 CLICK: Adicionar nova etapa');

    const newStageId = addStage();
    console.log('✅ Nova etapa criada:', newStageId);
  };

  // ✅ HANDLER PARA SELEÇÃO DE ETAPA (UNIFICADO)
  const handleStageClick = (stageId: string, e?: React.MouseEvent) => {
    console.log('🚨 EVENTO CLICK RECEBIDO - StageID:', stageId);
    console.log('🚨 Current ActiveStageId:', activeStageId);

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ✅ USAR EDITORCONTEXT UNIFICADO PARA MUDANÇA DE ETAPA
    setActiveStage(stageId);

    // ✅ CALLBACK OPCIONAL PARA SINCRONIZAÇÃO EXTERNA
    if (onStageSelect) {
      console.log('🚨 Chamando onStageSelect para callback externo');
      onStageSelect(stageId);
    }

    console.log('✅ Etapa ativada:', stageId);
  };

  // ✅ HANDLER PARA ACTIONS DOS BOTÕES
  const handleActionClick = (action: string, stageId: string, e: React.MouseEvent) => {
    console.log('🚨 ACTION CLICK RECEBIDO:', action, stageId);

    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case 'view':
        console.log('👁️ Visualizar etapa:', stageId);
        handleStageClick(stageId); // Apenas selecionar a etapa
        break;
      case 'settings':
        console.log('⚙️ Configurar etapa:', stageId);
        // TODO: Abrir modal de configurações
        break;
      case 'copy':
        console.log('📋 Copiar etapa:', stageId);
        // TODO: Implementar duplicação de etapa
        break;
      case 'delete':
        console.log('🗑️ EXECUTANDO DELETE da etapa:', stageId);
        if (confirm(`Deseja realmente deletar a etapa "${stageId}"?`)) {
          removeStage(stageId);
        }
        break;
    }
  };

  // ✅ VALIDAÇÃO: VERIFICAR SE HÁ ETAPAS
  if (!stages || stages.length === 0) {
    console.warn(`⚠️ [${timestamp}] FunnelStagesPanel - PROBLEMA: Nenhuma etapa encontrada!`);
    return (
      <Card
        className={cn('h-full flex flex-col min-h-[400px] bg-red-50/50 border-red-200', className)}
      >
        <CardHeader className="flex-shrink-0 pb-3 bg-red-100/50">
          <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <div style={{ backgroundColor: '#FAF9F7' }}></div>
            ⚠️ Erro nas Etapas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div style={{ color: '#432818' }}>
            <div className="text-center space-y-4">
              <div className="text-4xl animate-bounce">🚨</div>
              <p className="font-medium">Etapas não carregaram</p>
              <p className="text-sm">Verifique o console para detalhes</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                style={{ borderColor: '#B89B7A' }}
              >
                🔄 Recarregar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ RENDERIZAÇÃO PRINCIPAL COM SUCESSO
  console.log(
    `✅ [${timestamp}] FunnelStagesPanel - SUCESSO: Renderizando ${stages.length} etapas`
  );

  return (
    <Card
      className={cn(
        'h-full flex flex-col min-h-[400px] border-2 bg-green-50/30 border-green-200',
        className
      )}
    >
      <CardHeader style={{ backgroundColor: '#E5DDD5' }}>
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>✅ Etapas do Funil
          <span className="ml-auto text-sm bg-green-200 text-green-800 px-2 py-1 rounded font-bold">
            {stageCount}/21 etapas
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4">
            {stages.map(stage => {
              console.log('🚨 RENDERIZANDO STAGE:', stage.id, stage.name);
              return (
                <div
                  key={stage.id}
                  className={cn(
                    'group relative rounded-lg border-2 transition-all duration-200 cursor-pointer select-none',
                    'hover:border-purple-400 hover:shadow-lg active:scale-[0.95]',
                    'min-h-[80px] bg-white',
                    // ✅ USAR activeStageId DO EDITORCONTEXT PARA HIGHLIGHT
                    activeStageId === stage.id
                      ? 'border-purple-500 bg-[#B89B7A]/10 shadow-md ring-2 ring-purple-200'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  )}
                  onClick={e => {
                    console.log('🚨 CLICK DIRETO NO DIV - StageID:', stage.id);
                    console.log('🚨 Current activeStageId:', activeStageId);
                    handleStageClick(stage.id, e);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleStageClick(stage.id);
                    }
                  }}
                >
                  <div className="p-4 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'font-medium text-sm',
                              activeStageId === stage.id ? 'text-[#A38A69]' : 'text-foreground'
                            )}
                          >
                            Etapa {stage.order}
                          </span>
                          <Badge
                            variant={activeStageId === stage.id ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {stage.metadata?.blocksCount || 0} blocos
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {stage.name || stage.description || 'Sem título'}
                        </p>
                        {/* ✅ INDICADOR VISUAL DE ETAPA ATIVA */}
                        {activeStageId === stage.id && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-[#B89B7A]/100 rounded-full animate-pulse"></div>
                            <span className="text-xs text-[#B89B7A] font-medium">ATIVA</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions - Aparecem no hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={e => handleActionClick('view', stage.id, e)}
                        title="Visualizar etapa"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={e => handleActionClick('settings', stage.id, e)}
                        title="Configurações"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={e => handleActionClick('copy', stage.id, e)}
                        title="Copiar etapa"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={e => handleActionClick('delete', stage.id, e)}
                        title="Excluir etapa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Botão Adicionar Etapa */}
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors active:scale-[0.98]"
              onClick={handleAddStage}
              title="Adicionar nova etapa"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
