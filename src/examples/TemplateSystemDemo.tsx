/**
 * Template System Demo Component
 * 
 * Demonstra o uso completo do sistema de templates v3.1:
 * - Carregamento de steps com React Query
 * - Prefetch inteligente
 * - Importação de templates JSON
 * - Navegação entre steps
 * 
 * @module examples/TemplateSystemDemo
 */

import React, { useState, useEffect } from 'react';
import {
    useTemplateStep,
    usePrefetchTemplateStep,
    usePrepareTemplate,
    templateKeys,
} from '@/services/hooks';
import { ImportTemplateDialog } from '@/components/editor/quiz/dialogs/ImportTemplateDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronRight,
    Upload,
    RefreshCw,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import type { Template } from '@/schemas/templateSchema';

/**
 * Lista de steps do template demo
 */
const DEMO_STEPS = [
    'step-01-intro',
    'step-02-question',
    'step-03-result',
];

const TEMPLATE_ID = 'quiz21StepsComplete';

/**
 * Component de demonstração do sistema de templates
 */
export function TemplateSystemDemo() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importedTemplate, setImportedTemplate] = useState<Template | null>(null);

    const queryClient = useQueryClient();
    const currentStepId = DEMO_STEPS[currentStepIndex];

    // Hook principal - carregar step atual
    const {
        data: blocks,
        isLoading,
        isError,
        error,
        refetch,
    } = useTemplateStep(currentStepId, {
        templateId: TEMPLATE_ID,
        onSuccess: (data) => {
            console.log('✅ Step loaded:', currentStepId, data.length, 'blocks');
        },
    });

    // Hook de prefetch para próximo step
    const prefetchStep = usePrefetchTemplateStep();

    // Hook de preparação de template
    const {
        mutate: prepareTemplate,
        isPending: isPreparing,
        isSuccess: isPrepared,
    } = usePrepareTemplate({
        onSuccess: () => {
            console.log('✅ Template prepared successfully');
        },
    });

    // Prefetch próximo step ao mudar de step
    useEffect(() => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < DEMO_STEPS.length) {
            console.log('🔄 Prefetching next step:', DEMO_STEPS[nextIndex]);
            prefetchStep(DEMO_STEPS[nextIndex], { templateId: TEMPLATE_ID });
        }
    }, [currentStepIndex, prefetchStep]);

    // Preparar template ao montar
    useEffect(() => {
        prepareTemplate({
            templateId: TEMPLATE_ID,
            options: { preloadAll: false },
        });
    }, []);

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handleInvalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: templateKeys.all });
        console.log('🔄 Cache invalidated');
    };

    const handleImportTemplate = (template: Template, stepId?: string) => {
        setImportedTemplate(template);
        setIsImportDialogOpen(false);

        console.log('📥 Template imported:', {
            id: template.metadata.id,
            name: template.metadata.name,
            totalSteps: Object.keys(template.steps).length,
        });
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Sistema de Templates v3.1 - Demo
                </h1>
                <p className="text-muted-foreground">
                    Demonstração completa do sistema de gerenciamento de templates com React Query
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Template Status */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Template Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {isPreparing && (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Preparando...</span>
                                </>
                            )}
                            {isPrepared && (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Preparado</span>
                                </>
                            )}
                        </div>
                        <Badge variant="outline" className="mt-2">
                            {TEMPLATE_ID}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Current Step */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Step Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold">
                                {currentStepIndex + 1} / {DEMO_STEPS.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {currentStepId}
                            </div>
                            {blocks && (
                                <Badge variant="secondary">
                                    {blocks.length} blocos
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Imported Template */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Template Importado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {importedTemplate ? (
                            <div className="space-y-1">
                                <div className="font-medium">{importedTemplate.metadata.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {Object.keys(importedTemplate.steps).length} steps
                                </div>
                                <Badge variant="outline">
                                    v{importedTemplate.metadata.version}
                                </Badge>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                Nenhum template importado
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant="outline"
                    onClick={() => setIsImportDialogOpen(true)}
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar JSON
                </Button>
                <Button
                    variant="outline"
                    onClick={handleInvalidateCache}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Invalidar Cache
                </Button>
            </div>

            {/* Main Content */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Step Content</CardTitle>
                    <CardDescription>
                        Blocos carregados via useTemplateStep hook
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Erro ao carregar step: {error?.message}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-4"
                                    onClick={() => refetch()}
                                >
                                    Tentar Novamente
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success State */}
                    {blocks && (
                        <div className="space-y-4">
                            {blocks.map((block, index) => (
                                <Card key={block.id} className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{index + 1}</Badge>
                                                    <span className="font-medium">{block.type}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {block.id}
                                                </div>
                                            </div>
                                            <Badge>{block.order ?? index}</Badge>
                                        </div>
                                        {block.config && Object.keys(block.config).length > 0 && (
                                            <div className="mt-3 p-3 bg-background rounded text-xs">
                                                <pre className="overflow-x-auto">
                                                    {JSON.stringify(block.config, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                </Button>

                <div className="flex gap-2">
                    {DEMO_STEPS.map((stepId, index) => (
                        <Button
                            key={stepId}
                            variant={index === currentStepIndex ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentStepIndex(index)}
                            disabled={isLoading}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentStepIndex === DEMO_STEPS.length - 1 || isLoading}
                >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            {/* Import Dialog */}
            <ImportTemplateDialog
                open={isImportDialogOpen}
                onClose={() => setIsImportDialogOpen(false)}
                onImport={handleImportTemplate}
            />
        </div>
    );
}

export default TemplateSystemDemo;
