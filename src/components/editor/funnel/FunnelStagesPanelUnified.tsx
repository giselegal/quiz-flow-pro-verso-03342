
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/context/EditorContext';

export const FunnelStagesPanelUnified: React.FC = () => {
  const {
    stages,
    activeStageId,
    stageActions: { setActiveStage },
  } = useEditor();

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {stages.map((stage: any) => (
            <Card
              key={stage.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-sm ${
                activeStageId === stage.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-background hover:bg-muted/50'
              }`}
              onClick={() => setActiveStage(stage.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {stage.order}. {stage.name}
                  </h3>
                  {stage.metadata?.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {stage.metadata.description}
                    </p>
                  )}
                  {stage.description && !stage.metadata?.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {stage.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {stage.blocks?.length || 0}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
