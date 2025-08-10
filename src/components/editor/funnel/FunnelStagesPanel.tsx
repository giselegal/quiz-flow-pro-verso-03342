import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useEditor } from "../../../context/EditorContext";
import { cn } from "../../../lib/utils";
import { Copy, Eye, Loader2, Plus, Settings, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  className,
  onStageSelect,
}) => {
  // ✅ ESTADO DE LOADING PARA DEBUG
  const [isLoading, setIsLoading] = useState(true);
  const [renderCount, setRenderCount] = useState(0);

  // ✅ USAR APENAS EDITORCONTEXT UNIFICADO
  const {
    stages,
    activeStageId,
    stageActions: { setActiveStage, addStage, removeStage, updateStage },
    blockActions: { getBlocksForStage },
    computed: { stageCount },
  } = useEditor();

  // ✅ TIMESTAMP E DEBUG APRIMORADO
  const timestamp = new Date().toLocaleTimeString();

  // ✅ INCREMENTAR CONTADOR DE RENDER
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
    console.log(
      `� [${timestamp}] FunnelStagesPanel - RENDER #${renderCount + 1} INICIADO`
    );
    console.log(
      `🔍 [${timestamp}] FunnelStagesPanel - Stages:`,
      stages?.length || 0,
      "ActiveStage:",
      activeStageId
    );
    console.log(`🔍 [${timestamp}] FunnelStagesPanel - Stages Array:`, stages);
    console.log(
      `🔍 [${timestamp}] FunnelStagesPanel - StageCount:`,
      stageCount
    );

    // ✅ CARREGAR IMEDIATAMENTE SE HÁ STAGES
    if (stages && stages.length > 0) {
      console.log(
        `✅ [${timestamp}] FunnelStagesPanel - STAGES CARREGADAS, removendo loading`
      );
      setIsLoading(false);
    } else {
      console.warn(
        `⚠️ [${timestamp}] FunnelStagesPanel - STAGES VAZIAS ou UNDEFINED`
      );
      setIsLoading(false); // Remover delay artificial
    }
  }, [stages, activeStageId, stageCount]);

  // ✅ HANDLER PARA ADICIONAR NOVA ETAPA
  const handleAddStage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 CLICK: Adicionar nova etapa");

    const newStageId = addStage();
    console.log("✅ Nova etapa criada:", newStageId);
  };

  // ✅ HANDLER PARA SELEÇÃO DE ETAPA (UNIFICADO)
  const handleStageClick = (stageId: string, e?: React.MouseEvent) => {
    console.log("🚨 EVENTO CLICK RECEBIDO - StageID:", stageId);
    console.log("🚨 Current ActiveStageId:", activeStageId);

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ✅ USAR EDITORCONTEXT UNIFICADO PARA MUDANÇA DE ETAPA
    setActiveStage(stageId);

    // ✅ CALLBACK OPCIONAL PARA SINCRONIZAÇÃO EXTERNA
    if (onStageSelect) {
      console.log("🚨 Chamando onStageSelect para callback externo");
      onStageSelect(stageId);
    }

    console.log("✅ Etapa ativada:", stageId);
  };

  // ✅ HANDLER PARA ACTIONS DOS BOTÕES
  const handleActionClick = (
    action: string,
    stageId: string,
    e: React.MouseEvent
  ) => {
    console.log("🚨 ACTION CLICK RECEBIDO:", action, stageId);

    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case "view":
        console.log("👁️ Visualizar etapa:", stageId);
        handleStageClick(stageId); // Apenas selecionar a etapa
        break;
      case "settings":
        console.log("⚙️ Configurar etapa:", stageId);
        // TODO: Abrir modal de configurações
        break;
      case "copy":
        console.log("📋 Copiar etapa:", stageId);
        // TODO: Implementar duplicação de etapa
        break;
      case "delete":
        console.log("🗑️ EXECUTANDO DELETE da etapa:", stageId);
        if (confirm(`Deseja realmente deletar a etapa "${stageId}"?`)) {
          removeStage(stageId);
        }
        break;
    }
  };

  // Função para obter componentes de uma etapa
  const getStageComponents = (stageId: string) => {
    const blocks = getBlocksForStage(stageId);
    return blocks.map((block) => ({
      id: block.id,
      type: block.type,
      name: block.type
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    }));
  };

  // Função para obter tipos únicos de componentes por etapa
  const getStageComponentTypes = (stageId: string) => {
    const blocks = getBlocksForStage(stageId);
    const typeSet = new Set(blocks.map((block) => block.type));
    const types = Array.from(typeSet);
    return types;
  };

  // ✅ VALIDAÇÃO: VERIFICAR SE HÁ ETAPAS OU LOADING
  if (isLoading) {
    console.log(`🔄 [${timestamp}] FunnelStagesPanel - LOADING STATE`);
    return (
      <Card
        className={cn(
          "h-full flex flex-col min-h-[400px] bg-stone-50/50 border-stone-200",
          className
        )}
      >
        <CardHeader className="flex-shrink-0 pb-3 bg-stone-100/50">
          <CardTitle className="text-lg font-semibold text-stone-700 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            🔄 Carregando Etapas...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-full flex items-center justify-center text-stone-600">
            <div className="text-center space-y-4">
              <div className="text-4xl animate-bounce">⏳</div>
              <p className="font-medium">Inicializando contexto...</p>
              <p className="text-sm">Render #{renderCount}</p>
              <p className="text-xs">Stages: {stages?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stages || stages.length === 0) {
    console.warn(
      `⚠️ [${timestamp}] FunnelStagesPanel - PROBLEMA: Nenhuma etapa encontrada após loading!`
    );
    console.warn(
      `⚠️ [${timestamp}] FunnelStagesPanel - Render #${renderCount}, Stages:`,
      stages
    );
    return (
      <Card
        className={cn(
          "h-full flex flex-col min-h-[400px] bg-brand-dark/5 border-brand-dark/30",
          className
        )}
      >
        <CardHeader className="flex-shrink-0 pb-3 bg-brand-dark/10">
          <CardTitle className="text-lg font-semibold text-brand-dark flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-dark animate-pulse"></div>
            ⚠️ Erro nas Etapas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-full flex items-center justify-center text-brand-dark">
            <div className="text-center space-y-4">
              <div className="text-4xl animate-bounce">🚨</div>
              <p className="font-medium">Etapas não carregaram</p>
              <p className="text-sm">Render #{renderCount}</p>
              <p className="text-xs">
                Stages: {stages ? stages.length : "undefined"}
              </p>
              <p className="text-xs">StageCount: {stageCount || "undefined"}</p>
              <p className="text-xs">
                ActiveStageId: {activeStageId || "undefined"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-brand-dark/40 text-brand-dark hover:bg-brand-dark/10"
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
        "h-full flex flex-col min-h-[400px] border-2 bg-brand/5 border-brand/30",
        className
      )}
    >
      <CardHeader className="flex-shrink-0 pb-3 bg-brand/10 border-b border-brand/30">
        <CardTitle className="text-lg font-semibold text-brand-dark flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>✅
          Etapas do Funil
          <span className="ml-auto text-sm bg-brand/20 text-brand-dark px-2 py-1 rounded font-bold">
            {stageCount}/21 etapas
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4">
            {stages.map((stage, index) => {
              console.log(
                "🚨 RENDERIZANDO STAGE:",
                stage.id,
                stage.name,
                "Order:",
                stage.order
              );

              // Obter componentes da etapa
              const stageComponents = getStageComponents(stage.id);
              const componentTypes = getStageComponentTypes(stage.id);

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "group relative rounded-lg border-2 transition-all duration-200 cursor-pointer select-none",
                    "hover:border-brand/60 hover:shadow-lg active:scale-[0.95]",
                    "min-h-[80px] bg-white",
                    // ✅ USAR activeStageId DO EDITORCONTEXT PARA HIGHLIGHT
                    activeStageId === stage.id
                      ? "border-brand bg-brand/10 shadow-md ring-2 ring-brand/30"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  )}
                  onClick={(e) => {
                    console.log("🚨 CLICK DIRETO NO DIV - StageID:", stage.id);
                    console.log("🚨 Current activeStageId:", activeStageId);
                    handleStageClick(stage.id, e);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStageClick(stage.id);
                    }
                  }}
                >
                  <div className="p-4 relative z-10">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <span
                          className={cn(
                            "font-medium text-lg",
                            activeStageId === stage.id
                              ? "text-brand-dark"
                              : "text-foreground"
                          )}
                        >
                          Etapa {stage.order}
                        </span>
                        <div style={{ color: "#6B4F43" }}>{stage.name}</div>
                      </div>
                    </div>{" "}
                    {/* ✅ INDICADOR VISUAL DE ETAPA ATIVA - MINIMALISTA */}
                    {activeStageId === stage.id && (
                      <div className="flex justify-center mt-2">
                        <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                      </div>
                    )}
                    {/* Actions - Aparecem no hover */}
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={(e) => handleActionClick("view", stage.id, e)}
                        title="Visualizar etapa"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={(e) =>
                          handleActionClick("settings", stage.id, e)
                        }
                        title="Configurações"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/80"
                        onClick={(e) => handleActionClick("copy", stage.id, e)}
                        title="Copiar etapa"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) =>
                          handleActionClick("delete", stage.id, e)
                        }
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
