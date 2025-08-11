import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  className,
  onStageSelect,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>✅ Etapas do Funil - TESTE</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Componente de teste funcionando!</p>
      </CardContent>
    </Card>
  );
};

export default FunnelStagesPanel;
