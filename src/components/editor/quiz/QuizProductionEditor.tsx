/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * @deprecated Use QuizModularProductionEditor - Ver MIGRATION_EDITOR.md
 */

/**
 * 🎯 QUIZ PRODUCTION EDITOR - Editor Split-Screen
 * 
 * Editor completo com preview em tempo real do funil de produção
 * Layout: Editor (esquerda) + Preview idêntico à produção (direita)
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Save,
    Upload,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import QuizProductionPreview from './QuizProductionPreview';
import { QUIZ_STEPS } from '@/data/quizSteps';
import { useToast } from '@/hooks/use-toast';

interface EditableQuizStep {
    id: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    order: number;
    [key: string]: any;
}

interface QuizProductionEditorProps {
    funnelId?: string;
    className?: string;
}

export const QuizProductionEditor: React.FC<QuizProductionEditorProps> = ({
    funnelId: initialFunnelId,
    className
}) => {
    // 🚨 Console warning para desenvolvedores
    console.warn(
        '⚠️ DEPRECATED: QuizProductionEditor será removido em 01/nov/2025. ' +
        'Migre para QuizModularProductionEditor. Ver MIGRATION_EDITOR.md'
    );

    const [, setLocation] = useLocation();
    const { toast } = useToast();

    // Estado do editor
    const [funnelId, setFunnelId] = useState<string | undefined>(initialFunnelId);
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedStepId, setSelectedStepId] = useState<string>('');
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Layout
    const [showPreview, setShowPreview] = useState(true);
    const [previewWidth, setPreviewWidth] = useState(50); // porcentagem
    const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);

    // Validação
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Carregar funil inicial
    useEffect(() => {
        loadFunnel();
    }, [initialFunnelId]);

    const loadFunnel = async () => {
        setIsLoading(true);
        try {
            const funnel = await quizEditorBridge.loadFunnelForEdit(initialFunnelId);

            const editableSteps = funnel.steps.map(step => ({
                ...step,
                id: step.id,
                order: step.order
            }));

            setSteps(editableSteps);
            setFunnelId(funnel.id);
            setSelectedStepId(editableSteps[0]?.id || '');

            console.log('✅ Funil carregado:', funnel.name, editableSteps.length, 'etapas');

            toast({
                title: 'Funil carregado',
                description: `${editableSteps.length} etapas prontas para edição`,
            });
        } catch (error) {
            console.error('❌ Erro ao carregar:', error);
            toast({
                title: 'Erro',
                description: 'Falha ao carregar o funil',
                variant: 'destructive'
            });

            // Fallback: carregar QUIZ_STEPS
            const fallbackSteps = Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                id,
                order: index + 1,
                ...step
            }));
            setSteps(fallbackSteps);
            setSelectedStepId(fallbackSteps[0]?.id || '');
        } finally {
            setIsLoading(false);
        }
    };

    // Validar funil
    const validateFunnel = useCallback(() => {
        const funnel = {
            id: funnelId || 'temp',
            name: 'Quiz Estilo',
            slug: 'quiz-estilo',
            steps,
            isPublished: false,
            version: 1
        };

        const validation = quizEditorBridge.validateFunnel(funnel);
        setValidationErrors(validation.errors);

        return validation.valid;
    }, [steps, funnelId]);

    // Salvar rascunho
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const funnel = {
                id: funnelId || 'new-draft',
                name: 'Quiz Estilo Pessoal - Editado',
                slug: 'quiz-estilo',
                steps,
                isPublished: false,
                version: 1
            };

            const savedId = await quizEditorBridge.saveDraft(funnel);
            setFunnelId(savedId);
            setIsDirty(false);

            toast({
                title: 'Salvo com sucesso',
                description: `Rascunho ${savedId} salvo`,
            });

            console.log('✅ Rascunho salvo:', savedId);
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            toast({
                title: 'Erro ao salvar',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    }, [steps, funnelId, toast]);

    // Publicar para produção
    const handlePublish = useCallback(async () => {
        // Validar antes de publicar
        if (!validateFunnel()) {
            toast({
                title: 'Validação falhou',
                description: 'Corrija os erros antes de publicar',
                variant: 'destructive'
            });
            return;
        }

        if (!funnelId || funnelId === 'production') {
            toast({
                title: 'Salve primeiro',
                description: 'Salve o rascunho antes de publicar',
                variant: 'destructive'
            });
            return;
        }

        const confirmed = window.confirm(
            '⚠️ ATENÇÃO: Isso substituirá o funil de produção!\n\n' +
            'O quiz /quiz-estilo será atualizado imediatamente.\n\n' +
            'Deseja continuar?'
        );

        if (!confirmed) return;

        setIsPublishing(true);
        try {
            await quizEditorBridge.publishToProduction(funnelId);

            toast({
                title: '🚀 Publicado com sucesso!',
                description: 'O funil está agora em produção',
            });

            console.log('✅ Publicado para produção');

            // Redirecionar para produção
            setTimeout(() => {
                window.open('/quiz-estilo', '_blank');
            }, 1500);
        } catch (error) {
            console.error('❌ Erro ao publicar:', error);
            toast({
                title: 'Erro ao publicar',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsPublishing(false);
        }
    }, [funnelId, validateFunnel, toast]);

    // Atualizar step
    const updateStep = useCallback((stepId: string, updates: Partial<EditableQuizStep>) => {
        setSteps(prev =>
            prev.map(step =>
                step.id === stepId
                    ? { ...step, ...updates }
                    : step
            )
        );
        setIsDirty(true);
    }, []);

    // Step selecionado
    const selectedStep = useMemo(() =>
        steps.find(s => s.id === selectedStepId),
        [steps, selectedStepId]
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col h-screen bg-gray-50', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation('/quiz-estilo')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    <div className="h-6 w-px bg-border" />

                    <div>
                        <h1 className="text-lg font-semibold">Editor de Produção</h1>
                        <p className="text-xs text-muted-foreground">
                            {steps.length} etapas • {funnelId || 'Novo rascunho'}
                        </p>
                    </div>

                    {isDirty && (
                        <Badge variant="outline" className="ml-2">
                            Não salvo
                        </Badge>
                    )}

                    {validationErrors.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {validationErrors.length} erro{validationErrors.length > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        Preview
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving || !isDirty}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar
                    </Button>

                    <Button
                        size="sm"
                        onClick={handlePublish}
                        disabled={isPublishing || validationErrors.length > 0}
                    >
                        {isPublishing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        Publicar para Produção
                    </Button>
                </div>
            </div>

            {/* Avisos de validação */}
            {validationErrors.length > 0 && (
                <Alert variant="destructive" className="m-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Erros de validação:</strong>
                        <ul className="mt-2 ml-4 list-disc">
                            {validationErrors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Layout principal */}
            <div className="flex-1 flex overflow-hidden">
                {/* Painel do editor */}
                <div
                    className={cn(
                        'flex-1 overflow-auto bg-white border-r',
                        isPreviewMaximized && 'hidden'
                    )}
                    style={{
                        width: showPreview && !isPreviewMaximized
                            ? `${100 - previewWidth}%`
                            : '100%'
                    }}
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Etapas do Quiz</h2>

                        {/* Lista de steps */}
                        <div className="space-y-2">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        'p-4 border rounded-lg cursor-pointer transition-colors',
                                        selectedStepId === step.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                    onClick={() => setSelectedStepId(step.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{index + 1}</Badge>
                                                <span className="font-medium">{step.id}</span>
                                                <Badge>{step.type}</Badge>
                                            </div>
                                            {step.questionText && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {step.questionText}
                                                </p>
                                            )}
                                            {step.title && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {step.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Painel de preview */}
                {showPreview && (
                    <div
                        className={cn(
                            'bg-gray-100 border-l flex flex-col',
                            isPreviewMaximized && 'flex-1'
                        )}
                        style={{
                            width: isPreviewMaximized ? '100%' : `${previewWidth}%`
                        }}
                    >
                        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
                            <h3 className="text-sm font-semibold">Preview de Produção</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
                            >
                                {isPreviewMaximized ? (
                                    <Minimize2 className="w-4 h-4" />
                                ) : (
                                    <Maximize2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <QuizProductionPreview
                                funnelId={funnelId}
                                className="h-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizProductionEditor;
