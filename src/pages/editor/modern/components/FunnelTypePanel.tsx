import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface FunnelTypePanelProps {
    detector: React.ReactNode;
    detectedFunnelType: any;
    isDetecting: boolean;
}

const FunnelTypePanel: React.FC<FunnelTypePanelProps> = ({ detector, detectedFunnelType, isDetecting }) => {
    return (
        <div className="p-4 border-b bg-background">
            {detector}
            {detectedFunnelType && (
                <div className="mt-2 p-2 bg-primary/5 rounded-md">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{detectedFunnelType.category}</Badge>
                        <span className="text-sm font-medium">{detectedFunnelType.name}</span>
                        {detectedFunnelType.supportsAI && (
                            <Brain className="w-4 h-4 text-primary" />
                        )}
                    </div>
                    {detectedFunnelType.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {detectedFunnelType.description}
                        </p>
                    )}
                </div>
            )}
            {isDetecting && (
                <div className="mt-2 p-2 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Detectando tipo de funil...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FunnelTypePanel;
