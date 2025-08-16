import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

/**
 * Mock FunnelStagesPanel - Replacement after cleanup
 */
export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({ 
  className, 
  onStageSelect 
}) => {
  const stages = Array.from({ length: 21 }, (_, i) => ({
    id: `step-${i + 1}`,
    name: `Etapa ${i + 1}`,
    isActive: i === 0
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">Etapas do Funil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onStageSelect?.(stage.id)}
            className={`w-full text-left p-2 rounded text-sm transition-colors ${
              stage.isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            {stage.name}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default FunnelStagesPanel;