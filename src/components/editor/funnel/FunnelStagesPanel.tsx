import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, GripVertical, Eye, Settings, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFunnels } from '@/context/FunnelsContext';

interface FunnelStagesPanelProps {
  className?: string;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({ 
  className 
}) => {
  const { steps, updateFunnelStep, addStepBlock } = useFunnels();

  // 🐛 DEBUG: Log dados das etapas
  console.log('🔍 FunnelStagesPanel - Steps carregadas:', steps);
  console.log('🔍 FunnelStagesPanel - Quantidade de steps:', steps?.length || 0);

  const handleAddStage = () => {
    // Lógica para adicionar nova etapa
    console.log('Adicionar nova etapa');
  };

  const handleStageClick = (stageId: string) => {
    // Navegar para a etapa específica
    console.log('Navegar para etapa:', stageId);
  };

  // 🐛 DEBUG: Verificar se há steps para renderizar
  if (!steps || steps.length === 0) {
    console.log('⚠️ FunnelStagesPanel - Nenhuma step encontrada para renderizar');
    return (
      <Card className={cn("h-full flex flex-col min-h-[400px]", className)}>
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Etapas do Funil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-4">
              <div className="text-4xl">📝</div>
              <p>Carregando etapas...</p>
              <p className="text-sm">Se o problema persistir, verifique o console</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full flex flex-col min-h-[400px] border-2", className)}>
      <CardHeader className="flex-shrink-0 pb-3 bg-card border-b">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Etapas do Funil
          <span className="ml-auto text-sm bg-primary/10 text-primary px-2 py-1 rounded">
            {steps.length} etapas
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "group relative rounded-lg border transition-all duration-200 cursor-pointer",
                  "hover:border-primary/50 hover:shadow-sm",
                  step.isActive 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border bg-card/50"
                )}
                onClick={() => handleStageClick(step.id)}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-foreground">
                          Etapa {index + 1}
                        </span>
                        <Badge 
                          variant={step.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {step.blocksCount || 0} blocos
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {step.name || step.description || 'Sem título'}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Aparecem no hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-background/80"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-background/80"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-background/80"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Botão Adicionar Etapa */}
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={handleAddStage}
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