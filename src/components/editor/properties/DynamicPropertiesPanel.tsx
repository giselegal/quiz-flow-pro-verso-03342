import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Settings, Trash2, Copy, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertiesPanelRegistry } from './PropertiesPanelRegistry';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuestionPropertiesPanelDefinition, StrategicQuestionPropertiesPanelDefinition } from './QuestionPropertiesPanel';
import { ResultPropertiesPanelDefinition, TransitionResultPropertiesPanelDefinition } from './ResultPropertiesPanel';
import { OfferPropertiesPanelDefinition } from './OfferPropertiesPanel';
import { CommonPropertiesPanelDefinition, IntroPropertiesPanelDefinition, TransitionPropertiesPanelDefinition } from './CommonPropertiesPanel';

PropertiesPanelRegistry.registerMany([
    QuestionPropertiesPanelDefinition,
    StrategicQuestionPropertiesPanelDefinition,
    ResultPropertiesPanelDefinition,
    TransitionResultPropertiesPanelDefinition,
    OfferPropertiesPanelDefinition,
    IntroPropertiesPanelDefinition,
    TransitionPropertiesPanelDefinition,
]);
PropertiesPanelRegistry.setFallback(CommonPropertiesPanelDefinition);

export interface DynamicPropertiesPanelProps {
    selectedStep: any | null;
    onUpdateStep: (stepId: string, updates: any) => void;
    onClose: () => void;
    onDeleteStep?: (stepId: string) => void;
    onDuplicateStep?: (stepId: string) => void;
    isPreviewMode?: boolean;
    onTogglePreview?: () => void;
    className?: string;
}

export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
    selectedStep,
    onUpdateStep,
    onClose,
    onDeleteStep,
    onDuplicateStep,
    isPreviewMode = false,
    onTogglePreview,
    className = ''
}) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        setHasUnsavedChanges(false);
    }, [selectedStep?.id]);

    const handleUpdate = useCallback((updates: any) => {
        if (selectedStep) {
            onUpdateStep(selectedStep.id, updates);
            setHasUnsavedChanges(false);
        }
    }, [selectedStep, onUpdateStep]);

    const handleDelete = useCallback(() => {
        if (selectedStep && onDeleteStep) {
            if (confirm('Deletar step?')) {
                onDeleteStep(selectedStep.id);
            }
        }
    }, [selectedStep, onDeleteStep]);

    const handleDuplicate = useCallback(() => {
        if (selectedStep && onDuplicateStep) {
            onDuplicateStep(selectedStep.id);
        }
    }, [selectedStep, onDuplicateStep]);

    if (!selectedStep) {
        return (
            <Card className={cn('h-full', className)}>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4 text-muted-foreground">
                        <Settings className="w-12 h-12 mx-auto opacity-50" />
                        <div>
                            <h3 className="font-medium text-lg">Painel de Propriedades</h3>
                            <p className="text-sm">Selecione um step para editar</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const stepType = selectedStep.type || 'common';
    const panelDefinition = PropertiesPanelRegistry.resolve(stepType);

    if (!panelDefinition) {
        return (
            <Card className={cn('h-full flex flex-col', className)}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Erro no Painel</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 h-4" />
                        <AlertDescription>
                            Nenhum painel encontrado para o tipo {stepType}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const PanelComponent = panelDefinition.component;
    
    return (
        <Card className={cn('h-full flex flex-col', className)}>
            <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Propriedades</CardTitle>
                        <Badge variant="secondary">
                            {panelDefinition.label}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {onTogglePreview && (
                            <Button variant="ghost" size="sm" onClick={onTogglePreview} className="h-8 w-8 p-0">
                                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        )}
                        {onDuplicateStep && (
                            <Button variant="ghost" size="sm" onClick={handleDuplicate} className="h-8 w-8 p-0">
                                <Copy className="w-4 h-4" />
                            </Button>
                        )}
                        {onDeleteStep && (
                            <Button variant="ghost" size="sm" onClick={handleDelete} className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground">ID: {selectedStep.id}</div>
            </CardHeader>

            <Separator />

            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6 py-6">
                    <PanelComponent
                        stepId={selectedStep.id}
                        stepType={stepType}
                        stepData={selectedStep}
                        onUpdate={handleUpdate}
                        onDelete={onDeleteStep ? handleDelete : undefined}
                    />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default DynamicPropertiesPanel;
