import React, { useEffect, useState } from 'react';
// Usar paths relativos para evitar eventuais discrepâncias de resolução em bundler
import { EditorDashboardSyncService } from '../../../../services/core/EditorDashboardSyncService';
import FunnelTypeDetector from '../../../../components/editor/FunnelTypeDetector';
import type { FunnelType } from '../../../../services/FunnelTypesRegistry';

interface UseFunnelSyncOptions {
    funnelId: string | null;
    crudContext: { currentFunnel?: { id: string } | null };
    unifiedEditor: { funnel?: { id: string } | null; loadFunnel: (id: string) => Promise<void> };
}

export function useFunnelSyncLogic({ funnelId, crudContext, unifiedEditor }: UseFunnelSyncOptions): {
    detectedFunnelType: FunnelType | null;
    funnelData: any;
    isDetectingType: boolean;
    DetectorElement: React.ReactNode;
} {
    const [detectedFunnelType, setDetectedFunnelType] = useState<FunnelType | null>(null);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [isDetectingType, setIsDetectingType] = useState(false);

    // Conexão com serviço de sync
    useEffect(() => {
        if (!funnelId) return;
        const disconnect = EditorDashboardSyncService.connectEditor({
            funnelId,
            refresh: () => {
                // Placeholder para refresh incremental
            }
        });
        return disconnect;
    }, [funnelId]);

    // Sincronizar funnel entre CRUD e UnifiedEditor
    useEffect(() => {
        if (crudContext.currentFunnel && !unifiedEditor.funnel) {
            unifiedEditor.loadFunnel(crudContext.currentFunnel.id).catch(() => { });
        }
    }, [crudContext.currentFunnel, unifiedEditor.funnel, unifiedEditor]);

    // Iniciar detecção de tipo
    useEffect(() => {
        if (funnelId && !detectedFunnelType && !isDetectingType) {
            setIsDetectingType(true);
        }
    }, [funnelId, detectedFunnelType, isDetectingType]);

    const DetectorElement = funnelId ? (
        <FunnelTypeDetector
            funnelId={funnelId}
            onFunnelLoaded={(data: any) => { setFunnelData(data); setIsDetectingType(false); }}
            onTypeDetected={(type: FunnelType) => { setDetectedFunnelType(type); }}
        />
    ) : null;

    return { detectedFunnelType, funnelData, isDetectingType, DetectorElement };
}

export default useFunnelSyncLogic;