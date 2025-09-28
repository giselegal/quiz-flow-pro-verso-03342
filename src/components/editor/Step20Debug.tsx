import React from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const Step20Debug: React.FC = () => {
  const { activeStageId, state } = useEditor();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const isStep20 = activeStageId === 'step-20' || 
                   activeStageId === 'step20' || 
                   activeStageId?.includes('20') ||
                   window.location.pathname.includes('step20') ||
                   window.location.pathname.includes('step-20');

  const step20Blocks = state.blocks.filter(block => 
    block.type.startsWith('step20-') || block.type.includes('step20')
  );

  return (
    <Card className="mb-4 border-dashed border-2">
      <CardContent className="p-3">
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={isStep20 ? "default" : "secondary"}>
              Step 20: {isStep20 ? 'ATIVO' : 'Inativo'}
            </Badge>
            <span className="text-muted-foreground">
              Stage: {activeStageId || 'undefined'}
            </span>
          </div>
          
          <div className="text-muted-foreground">
            URL: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
          </div>
          
          {step20Blocks.length > 0 && (
            <div>
              <div className="font-medium">Blocos Step 20:</div>
              {step20Blocks.map(block => (
                <div key={block.id} className="text-xs text-muted-foreground ml-2">
                  • {block.type} ({block.id})
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};