import React, { Suspense } from 'react';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
import { TemplateErrorBoundary } from '@/components/error/UnifiedErrorBoundary';
import { EditorProUnified } from '@/components/editor/EditorProUnified';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TemplateLoadingSkeleton } from '@/components/ui/template-loading-skeleton';
import FunnelTypePanel from './FunnelTypePanel';

interface UnifiedEditorCanvasProps {
    extractedInfo: any;
    detectorElement: React.ReactNode;
    detectedFunnelType: any;
    isDetectingType: boolean;
    pureBuilderTargetId: string;
    realExperienceMode: boolean;
}

const UnifiedEditorCanvas: React.FC<UnifiedEditorCanvasProps> = ({
    extractedInfo,
    detectorElement,
    detectedFunnelType,
    isDetectingType,
    pureBuilderTargetId,
    realExperienceMode
}) => {
    return (
        <div className="flex-1 overflow-hidden">
            <FunnelMasterProvider
                funnelId={extractedInfo.funnelId || undefined}
                debugMode={false}
                enableCache={true}
            >
                {extractedInfo.funnelId && (
                    <FunnelTypePanel
                        detector={detectorElement}
                        detectedFunnelType={detectedFunnelType}
                        isDetecting={isDetectingType}
                    />
                )}
                <Suspense fallback={<Suspense fallback={<LoadingSpinner />}><TemplateLoadingSkeleton /></Suspense>}>
                    <Suspense fallback={<LoadingSpinner />}>
                        <PureBuilderProvider
                            key={`pure-builder-${pureBuilderTargetId}`}
                            funnelId={pureBuilderTargetId}
                            enableSupabase={false}
                        >
                            <TemplateErrorBoundary>
                                <EditorProUnified
                                    funnelId={extractedInfo.funnelId || undefined}
                                    realExperienceMode={realExperienceMode}
                                    showProFeatures={true}
                                    className="h-full"
                                />
                            </TemplateErrorBoundary>
                        </PureBuilderProvider>
                    </Suspense>
                </Suspense>
            </FunnelMasterProvider>
        </div>
    );
};

export default UnifiedEditorCanvas;
